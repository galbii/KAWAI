#!/usr/bin/env tsx
/**
 * Run All Post Migrations
 *
 * Orchestrates the complete migration process for Posts collection schema changes
 *
 * PHASE 2.2: Data Migration Runner
 *
 * This script:
 * 1. Performs pre-flight checks
 * 2. Creates database backup (optional, recommended)
 * 3. Runs categories migration
 * 4. Runs authors migration
 * 5. Displays comprehensive summary
 * 6. Asks for confirmation before proceeding (unless --yes flag)
 *
 * Usage:
 *   bun run tsx scripts/run-all-migrations.ts --dry-run  # Preview all changes
 *   bun run tsx scripts/run-all-migrations.ts --yes      # Skip confirmation
 *   bun run tsx scripts/run-all-migrations.ts            # Interactive mode
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { spawn } from 'child_process'
import * as readline from 'readline'

interface MigrationResult {
  success: boolean
  output: string
  duration: number
}

interface PreflightChecks {
  categoriesExist: boolean
  categoryCount: number
  postsExist: boolean
  postCount: number
  backupRecommended: boolean
}

/**
 * Run a child process and capture output
 */
function runScript(scriptPath: string, args: string[]): Promise<MigrationResult> {
  return new Promise((resolve) => {
    const startTime = Date.now()
    let output = ''

    const child = spawn('tsx', [scriptPath, ...args], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: process.cwd(),
    })

    child.stdout.on('data', (data) => {
      const text = data.toString()
      output += text
      process.stdout.write(text)
    })

    child.stderr.on('data', (data) => {
      const text = data.toString()
      output += text
      process.stderr.write(text)
    })

    child.on('close', (code) => {
      const duration = Date.now() - startTime
      resolve({
        success: code === 0,
        output,
        duration,
      })
    })
  })
}

/**
 * Prompt user for confirmation
 */
function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question + ' (yes/no): ', (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
    })
  })
}

/**
 * Run pre-flight checks
 */
async function runPreflightChecks(): Promise<PreflightChecks> {
  console.log('🔍 Running pre-flight checks...\n')

  const payload = await getPayload({ config })

  // Check Categories collection
  const { totalDocs: categoryCount } = await payload.find({
    collection: 'categories',
    limit: 1,
    depth: 0,
  })

  // Check Posts collection
  const { totalDocs: postCount } = await payload.find({
    collection: 'posts',
    limit: 1,
    depth: 0,
  })

  const checks: PreflightChecks = {
    categoriesExist: categoryCount > 0,
    categoryCount,
    postsExist: postCount > 0,
    postCount,
    backupRecommended: postCount > 0,
  }

  // Display results
  console.log('📊 Pre-flight Check Results:')
  console.log(`   ${checks.categoriesExist ? '✅' : '❌'} Categories collection: ${categoryCount} categories`)
  console.log(`   ${checks.postsExist ? '✅' : '❌'} Posts collection: ${postCount} posts`)
  console.log(`   ${checks.backupRecommended ? '⚠️' : '✅'} Backup recommended: ${checks.backupRecommended ? 'YES' : 'NO'}`)
  console.log('')

  return checks
}

/**
 * Display migration plan
 */
function displayMigrationPlan(dryRun: boolean, skipBackup: boolean): void {
  console.log('📋 MIGRATION PLAN')
  console.log('='.repeat(60))
  console.log(`   Mode:              ${dryRun ? '🔍 DRY RUN (preview only)' : '✍️  LIVE (will modify database)'}`)
  console.log(`   Backup:            ${skipBackup ? 'Skipped' : 'Recommended (run manually)'}`)
  console.log('')
  console.log('   Steps:')
  console.log('   1. Migrate categories (select → relationship)')
  console.log('   2. Migrate authors (single → array)')
  console.log('='.repeat(60))
  console.log('')
}

/**
 * Main migration orchestrator
 */
async function runAllMigrations(): Promise<void> {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const skipConfirmation = args.includes('--yes') || args.includes('-y')
  const skipBackup = args.includes('--skip-backup')

  console.log('🚀 POSTS SCHEMA MIGRATION - Phase 2.2')
  console.log('   Data Migration BEFORE Schema Changes')
  console.log('')

  // Run pre-flight checks
  const checks = await runPreflightChecks()

  // Validate pre-flight checks
  if (!checks.categoriesExist) {
    console.error('❌ FATAL ERROR: Categories collection is empty!')
    console.error('   Please seed categories before running migration.')
    console.error('   Hint: Create categories that match the old select field values')
    process.exit(1)
  }

  if (!checks.postsExist) {
    console.log('ℹ️  No posts found. Nothing to migrate.')
    process.exit(0)
  }

  // Display migration plan
  displayMigrationPlan(dryRun, skipBackup)

  // Backup warning
  if (!dryRun && !skipBackup && checks.backupRecommended) {
    console.log('⚠️  IMPORTANT: Database Backup Recommended')
    console.log('   Before running this migration, you should backup your database.')
    console.log('   Run: bun run backup:db')
    console.log('')

    if (!skipConfirmation) {
      const shouldContinue = await askConfirmation('Do you want to continue WITHOUT a backup?')
      if (!shouldContinue) {
        console.log('❌ Migration cancelled. Please create a backup and try again.')
        process.exit(0)
      }
    }
  }

  // Confirmation prompt
  if (!dryRun && !skipConfirmation) {
    console.log('⚠️  This will modify your database.')
    const confirmed = await askConfirmation('Are you sure you want to proceed?')

    if (!confirmed) {
      console.log('❌ Migration cancelled by user.')
      process.exit(0)
    }
    console.log('')
  }

  // Track overall success
  let allSuccess = true
  const results: Record<string, MigrationResult> = {}

  // Step 1: Migrate categories
  console.log('\n' + '='.repeat(60))
  console.log('📦 STEP 1: Migrate Categories')
  console.log('='.repeat(60) + '\n')

  const categoryResult = await runScript(
    'scripts/migrate-posts-categories.ts',
    dryRun ? ['--dry-run'] : []
  )

  results.categories = categoryResult
  allSuccess = allSuccess && categoryResult.success

  console.log(`\n✅ Categories migration ${categoryResult.success ? 'completed' : 'FAILED'} in ${(categoryResult.duration / 1000).toFixed(2)}s\n`)

  // Step 2: Migrate authors
  console.log('\n' + '='.repeat(60))
  console.log('📦 STEP 2: Migrate Authors')
  console.log('='.repeat(60) + '\n')

  const authorResult = await runScript(
    'scripts/migrate-posts-authors.ts',
    dryRun ? ['--dry-run'] : []
  )

  results.authors = authorResult
  allSuccess = allSuccess && authorResult.success

  console.log(`\n✅ Authors migration ${authorResult.success ? 'completed' : 'FAILED'} in ${(authorResult.duration / 1000).toFixed(2)}s\n`)

  // Final summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 FINAL SUMMARY')
  console.log('='.repeat(60))
  console.log(`   Categories Migration: ${results.categories.success ? '✅ SUCCESS' : '❌ FAILED'}`)
  console.log(`   Authors Migration:    ${results.authors.success ? '✅ SUCCESS' : '❌ FAILED'}`)
  console.log(`   Total Duration:       ${((results.categories.duration + results.authors.duration) / 1000).toFixed(2)}s`)
  console.log('='.repeat(60))

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE')
    console.log('   No changes were made to the database.')
    console.log('   Run without --dry-run flag to execute migration.')
  } else if (allSuccess) {
    console.log('\n✅ ALL MIGRATIONS COMPLETED SUCCESSFULLY!')
    console.log('')
    console.log('📝 Next Steps:')
    console.log('   1. Verify data in Payload admin panel')
    console.log('   2. Test a few posts to ensure categoriesNew and authorsNew are populated')
    console.log('   3. Once verified, proceed to Phase 2.3 (schema changes)')
    console.log('   4. Update Posts collection schema to use new fields')
  } else {
    console.error('\n❌ MIGRATION FAILED')
    console.error('   Some migrations did not complete successfully.')
    console.error('   Please review the errors above and fix before proceeding.')
  }

  process.exit(allSuccess ? 0 : 1)
}

// Run orchestrator
runAllMigrations().catch((error) => {
  console.error('\n❌ FATAL ERROR:', error)
  process.exit(1)
})
