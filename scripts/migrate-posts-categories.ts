#!/usr/bin/env tsx
/**
 * Posts Categories Migration Script
 *
 * Migrates Posts collection from select-based categories to relationship-based categories
 *
 * PHASE 2.2: Data Migration BEFORE Schema Changes
 * This script creates a NEW field (categoriesNew) without modifying the old field
 *
 * SAFE ORDER:
 * 1. Run this script to populate categoriesNew field
 * 2. Test thoroughly
 * 3. Update schema to rename categoriesNew -> categories (Phase 2.3)
 *
 * Usage:
 *   bun run migrate:categories:dry-run  # Preview changes
 *   bun run migrate:categories          # Execute migration
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

interface MigrationStats {
  total: number
  migrated: number
  skipped: number
  errors: number
  noCategories: number
}

interface CategoryMapping {
  [key: string]: string
}

/**
 * Mapping of old category slugs to expected Category document IDs
 * This will be built dynamically by fetching from Categories collection
 */
async function buildCategoryMapping(): Promise<CategoryMapping> {
  const payload = await getPayload({ config })

  console.log('📊 Fetching categories from Categories collection...')

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 0,
  })

  const mapping: CategoryMapping = {}

  categories.forEach((category) => {
    if (category.slug) {
      mapping[category.slug] = category.id
      console.log(`   ✓ ${category.slug} → ${category.id}`)
    }
  })

  console.log(`📊 Built category mapping with ${Object.keys(mapping).length} entries\n`)

  return mapping
}

/**
 * Main migration function
 */
async function migrateCategoriesField(dryRun = false): Promise<void> {
  console.log('🚀 Starting Posts Categories Migration')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (preview only)' : '✍️  LIVE (will modify database)'}`)
  console.log('')

  const payload = await getPayload({ config })

  // Build category mapping
  const categoryMap = await buildCategoryMapping()

  if (Object.keys(categoryMap).length === 0) {
    console.error('❌ ERROR: No categories found in Categories collection!')
    console.error('   Please ensure Categories collection is seeded before running migration.')
    process.exit(1)
  }

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
    noCategories: 0,
  }

  // Process each post
  for (const post of posts) {
    try {
      // Check if already migrated
      if ((post as any).categoriesNew && Array.isArray((post as any).categoriesNew) && (post as any).categoriesNew.length > 0) {
        console.log(`⏭️  SKIP: Post "${post.title}" already has categoriesNew field`)
        stats.skipped++
        continue
      }

      // Get old categories (select field)
      const oldCategories = (post as any).categories

      // Handle posts with no categories
      if (!oldCategories || !Array.isArray(oldCategories) || oldCategories.length === 0) {
        console.log(`⚠️  NO CATEGORIES: Post "${post.title}" has no categories`)
        stats.noCategories++
        stats.skipped++
        continue
      }

      // Map old category slugs to new category IDs
      const newCategoryIds: string[] = oldCategories
        .map((slug: string) => {
          const categoryId = categoryMap[slug]
          if (!categoryId) {
            console.warn(`   ⚠️  WARNING: No category found for slug "${slug}" in post "${post.title}"`)
          }
          return categoryId
        })
        .filter(Boolean) // Remove undefined values

      // Handle case where no categories could be mapped
      if (newCategoryIds.length === 0) {
        console.warn(`⚠️  SKIP: Post "${post.title}" has categories ${JSON.stringify(oldCategories)} but none matched`)
        stats.skipped++
        continue
      }

      // Log what we're about to do
      const categoryNames = oldCategories.join(', ')
      console.log(`✅ MIGRATE: "${post.title}"`)
      console.log(`   Old: [${categoryNames}] (${oldCategories.length} categories)`)
      console.log(`   New: ${newCategoryIds.length} category IDs`)

      // Execute migration (unless dry run)
      if (!dryRun) {
        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            categoriesNew: newCategoryIds,
          } as any, // TypeScript doesn't know about categoriesNew yet
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
  console.log(`   ⚠️  No Categories:     ${stats.noCategories}`)
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

migrateCategoriesField(dryRun)
  .then(() => {
    console.log('\n✅ Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ FATAL ERROR:', error)
    process.exit(1)
  })
