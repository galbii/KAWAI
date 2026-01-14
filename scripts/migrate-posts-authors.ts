#!/usr/bin/env tsx
/**
 * Posts Authors Migration Script
 *
 * Migrates Posts collection from single author to multiple authors
 *
 * PHASE 2.2: Data Migration BEFORE Schema Changes
 * This script creates a NEW field (authorsNew) without modifying the old field
 *
 * SAFE ORDER:
 * 1. Run this script to populate authorsNew field
 * 2. Test thoroughly
 * 3. Update schema to rename authorsNew -> authors (Phase 2.3)
 *
 * Usage:
 *   bun run migrate:authors:dry-run  # Preview changes
 *   bun run migrate:authors          # Execute migration
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

interface MigrationStats {
  total: number
  migrated: number
  skipped: number
  errors: number
  noAuthor: number
}

/**
 * Main migration function
 */
async function migrateAuthorsField(dryRun = false): Promise<void> {
  console.log('🚀 Starting Posts Authors Migration')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (preview only)' : '✍️  LIVE (will modify database)'}`)
  console.log('')

  const payload = await getPayload({ config })

  // Fetch all posts
  console.log('📊 Fetching all posts...')
  const { docs: posts, totalDocs } = await payload.find({
    collection: 'posts',
    limit: 10000, // Adjust if you have more posts
    depth: 0, // Don't populate relationships
  })

  console.log(`📊 Found ${totalDocs} posts to process\n`)

  const stats: MigrationStats = {
    total: totalDocs,
    migrated: 0,
    skipped: 0,
    errors: 0,
    noAuthor: 0,
  }

  // Process each post
  for (const post of posts) {
    try {
      // Check if already migrated
      if ((post as any).authorsNew && Array.isArray((post as any).authorsNew) && (post as any).authorsNew.length > 0) {
        console.log(`⏭️  SKIP: Post "${post.title}" already has authorsNew field`)
        stats.skipped++
        continue
      }

      // Get old author (single relationship)
      const oldAuthor = (post as any).author

      // Handle posts with no author
      if (!oldAuthor) {
        console.log(`⚠️  NO AUTHOR: Post "${post.title}" has no author`)
        stats.noAuthor++
        stats.skipped++
        continue
      }

      // Extract author ID (could be string ID or object with id)
      const authorId = typeof oldAuthor === 'string' ? oldAuthor : oldAuthor.id

      if (!authorId) {
        console.warn(`⚠️  SKIP: Post "${post.title}" has invalid author data`)
        stats.skipped++
        continue
      }

      // Log what we're about to do
      console.log(`✅ MIGRATE: "${post.title}"`)
      console.log(`   Old: author = "${authorId}" (single relationship)`)
      console.log(`   New: authorsNew = ["${authorId}"] (array with 1 item)`)

      // Execute migration (unless dry run)
      if (!dryRun) {
        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            authorsNew: [authorId],
          } as any, // TypeScript doesn't know about authorsNew yet
          context: {
            skipRevalidation: true, // Prevent ISR revalidation during migration
          },
        })
        console.log(`   ✓ Database updated`)
      } else {
        console.log(`   [DRY RUN] Would update database`)
      }

      stats.migrated++
      console.log('')

    } catch (error) {
      console.error(`❌ ERROR: Failed to migrate post "${post.title}":`, error)
      stats.errors++
      console.log('')
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📈 MIGRATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`   Total Posts:           ${stats.total}`)
  console.log(`   ✅ Migrated:          ${stats.migrated}`)
  console.log(`   ⏭️  Skipped:           ${stats.skipped}`)
  console.log(`   ⚠️  No Author:         ${stats.noAuthor}`)
  console.log(`   ❌ Errors:            ${stats.errors}`)
  console.log('='.repeat(60))

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE - No changes were made to the database')
    console.log('   Run without --dry-run flag to execute migration')
  } else {
    console.log('\n✅ MIGRATION COMPLETE')
  }

  if (stats.errors > 0) {
    console.error(`\n⚠️  WARNING: ${stats.errors} errors occurred during migration`)
    process.exit(1)
  }
}

// Run script
const dryRun = process.argv.includes('--dry-run')

migrateAuthorsField(dryRun)
  .then(() => {
    console.log('\n✅ Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ FATAL ERROR:', error)
    process.exit(1)
  })
