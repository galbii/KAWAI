#!/usr/bin/env tsx
/**
 * Artists Publish Migration v2 — Direct MongoDB
 *
 * The previous migration (v1) used payload.update() while versions.drafts was
 * disabled, which silently stripped _status because it wasn't part of the schema.
 * This version goes directly to MongoDB via the native driver so the field is
 * written unconditionally, bypassing Payload's schema layer entirely.
 *
 * What it does:
 *   1. Boots Payload to initialize the DB connection and create the
 *      _artists_versions collection schema (versions.drafts must be enabled first).
 *   2. Sets _status: 'published' on every artist in the main `artists` collection.
 *   3. Inserts a minimal published version snapshot into `_artists_versions`
 *      so Payload's draft system recognises each artist as published.
 *
 * Run AFTER adding versions.drafts to src/collections/Artists.ts.
 *
 * Usage:
 *   bun --env-file=.env.local run migrate:artists:publish:v2:dry-run
 *   bun --env-file=.env.local run migrate:artists:publish:v2
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

interface Stats {
  total: number
  published: number
  alreadyPublished: number
  versionsCreated: number
  errors: number
}

async function migrate(dryRun = false): Promise<void> {
  console.log('🎹 Artists Publish Migration v2 (Direct MongoDB)')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no changes)' : '✍️  LIVE'}`)
  console.log('')

  const payload = await getPayload({ config })

  // Access the raw MongoDB Db via the mongoose adapter
  const db = (payload.db as any).connection.db as import('mongodb').Db

  const artistsCol = db.collection('artists')
  const versionsCol = db.collection('_artists_versions')

  // Verify the versions collection exists (Payload creates it on boot when
  // versions.drafts is enabled — if missing, the collection config is wrong)
  const collections = await db.listCollections({ name: '_artists_versions' }).toArray()
  if (collections.length === 0) {
    console.error('❌ _artists_versions collection not found.')
    console.error('   Make sure versions.drafts is enabled in src/collections/Artists.ts and the server has booted at least once.')
    process.exit(1)
  }

  // Fetch every artist directly from MongoDB (no Payload schema filtering)
  const artists = await artistsCol.find({}).toArray()
  console.log(`📊 Found ${artists.length} artists in MongoDB\n`)

  const stats: Stats = {
    total: artists.length,
    published: 0,
    alreadyPublished: 0,
    versionsCreated: 0,
    errors: 0,
  }

  for (const artist of artists) {
    const name = artist.name ?? '(unnamed)'
    const slug = artist.slug ?? '(no slug)'

    if (artist._status === 'published') {
      console.log(`⏭️  SKIP "${name}" — already published`)
      stats.alreadyPublished++
      continue
    }

    console.log(`✅ PUBLISH "${name}" (slug: ${slug})`)

    if (dryRun) {
      console.log('   [DRY RUN] Would set _status: published + create version doc')
      stats.published++
      continue
    }

    try {
      const now = new Date()

      // 1. Set _status on the main document directly in MongoDB
      await artistsCol.updateOne(
        { _id: artist._id },
        { $set: { _status: 'published', updatedAt: now } },
      )

      // 2. Check if a version snapshot already exists for this artist
      const existingVersion = await versionsCol.findOne({ parent: artist._id })

      if (!existingVersion) {
        // 3. Create a minimal published version snapshot so Payload's draft
        //    system has a history entry for this document
        await versionsCol.insertOne({
          parent: artist._id,
          version: {
            ...artist,
            _status: 'published',
            updatedAt: now,
          },
          autosave: false,
          latest: true,
          snapshot: false,
          createdAt: now,
          updatedAt: now,
        })
        console.log('   ✓ Published + version snapshot created')
        stats.versionsCreated++
      } else {
        // Mark the existing version as latest published
        await versionsCol.updateOne(
          { _id: existingVersion._id },
          { $set: { 'version._status': 'published', latest: true, updatedAt: now } },
        )
        console.log('   ✓ Published + existing version updated')
      }

      stats.published++
    } catch (error) {
      console.error(`   ❌ Failed:`, error)
      stats.errors++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📈 SUMMARY')
  console.log('='.repeat(50))
  console.log(`   Total artists:         ${stats.total}`)
  console.log(`   ✅ Published:          ${stats.published}`)
  console.log(`   ⏭️  Already published:  ${stats.alreadyPublished}`)
  console.log(`   📄 Versions created:   ${stats.versionsCreated}`)
  console.log(`   ❌ Errors:             ${stats.errors}`)
  console.log('='.repeat(50))

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE — no changes made')
    console.log('   Run without --dry-run to execute')
  } else if (stats.errors === 0) {
    console.log('\n✅ MIGRATION COMPLETE — all artists are now published')
  } else {
    console.error(`\n⚠️  ${stats.errors} error(s) — check output above`)
    process.exit(1)
  }

  process.exit(0)
}

migrate(process.argv.includes('--dry-run')).catch((err) => {
  console.error('\n❌ FATAL:', err)
  process.exit(1)
})
