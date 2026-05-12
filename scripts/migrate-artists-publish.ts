#!/usr/bin/env tsx
/**
 * Artists Publish Migration Script
 *
 * Sets _status: 'published' on all existing artists that were created before
 * versions.drafts was enabled on the Artists collection.
 *
 * When Payload's versions.drafts is enabled on an existing collection, documents
 * without a _status field are invisible to draft-aware queries. This script
 * publishes every artist so they remain accessible after drafts are enabled.
 *
 * SAFE TO RUN: Uses context.disableRevalidate to suppress ISR revalidation.
 * Only touches artists with no _status or _status !== 'published'.
 *
 * Usage:
 *   bun run migrate:artists:publish:dry-run   # Preview — no DB changes
 *   bun run migrate:artists:publish           # Execute migration
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

interface Stats {
  total: number
  published: number
  alreadyPublished: number
  errors: number
}

async function migrateArtistsPublish(dryRun = false): Promise<void> {
  console.log('🎹 Artists Publish Migration')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no DB changes)' : '✍️  LIVE (will modify database)'}`)
  console.log('')

  const payload = await getPayload({ config })

  // Fetch all artists, bypassing access control and draft filtering
  console.log('📊 Fetching all artists...')
  const { docs: artists, totalDocs } = await payload.find({
    collection: 'artists',
    limit: 10000,
    depth: 0,
    draft: true,        // Include drafts and unpublished
    overrideAccess: true,
  })

  console.log(`📊 Found ${totalDocs} artists to evaluate\n`)

  const stats: Stats = {
    total: totalDocs,
    published: 0,
    alreadyPublished: 0,
    errors: 0,
  }

  for (const artist of artists) {
    const doc = artist as any

    if (doc._status === 'published') {
      console.log(`⏭️  SKIP: "${doc.name}" — already published`)
      stats.alreadyPublished++
      continue
    }

    console.log(`✅ PUBLISH: "${doc.name}" (slug: ${doc.slug}, current _status: ${doc._status ?? 'none'})`)

    if (!dryRun) {
      try {
        await payload.update({
          collection: 'artists',
          id: doc.id,
          data: { _status: 'published' } as any,
          context: { disableRevalidate: true },
          draft: false,
          overrideAccess: true,
        })
        console.log(`   ✓ Published`)
      } catch (error) {
        console.error(`   ❌ Failed:`, error)
        stats.errors++
        continue
      }
    } else {
      console.log(`   [DRY RUN] Would publish`)
    }

    stats.published++
  }

  console.log('\n' + '='.repeat(50))
  console.log('📈 SUMMARY')
  console.log('='.repeat(50))
  console.log(`   Total artists:        ${stats.total}`)
  console.log(`   ✅ Published:         ${stats.published}`)
  console.log(`   ⏭️  Already published: ${stats.alreadyPublished}`)
  console.log(`   ❌ Errors:            ${stats.errors}`)
  console.log('='.repeat(50))

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE — no changes made')
    console.log('   Run without --dry-run to execute')
  } else {
    console.log('\n✅ MIGRATION COMPLETE')
    console.log('   You can now safely enable versions.drafts on the Artists collection.')
  }

  if (stats.errors > 0) {
    console.error(`\n⚠️  ${stats.errors} error(s) occurred — check output above`)
    process.exit(1)
  }
}

const dryRun = process.argv.includes('--dry-run')

migrateArtistsPublish(dryRun)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ FATAL ERROR:', error)
    process.exit(1)
  })
