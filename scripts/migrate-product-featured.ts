#!/usr/bin/env tsx
/**
 * Product Featured Consolidation Migration
 *
 * Consolidates the two "featured" fields that used to exist on Products into the
 * single surviving top-level `featured` field:
 *
 *   - `featured`            (top-level, Product Details sidebar)   ← SURVIVOR
 *   - `visibility.featured` (Settings tab group)                  ← REMOVED
 *
 * Historically both flags were OR'd together everywhere in the nav, and the
 * sitemap read only `visibility.featured`. After removing `visibility.featured`
 * from the schema, any product that was featured ONLY via that field would
 * silently lose its featured status. This migration prevents that by:
 *
 *   1. Setting top-level `featured = true` on every product where the old
 *      `visibility.featured === true` but `featured` is not already true.
 *   2. Unsetting the now-orphaned `visibility.featured` subfield so the stored
 *      document matches the new schema.
 *
 * Talks to MongoDB directly via the `mongodb` driver (same approach as
 * scripts/diag-nav-digital.ts) — the field is gone from the Payload schema, so
 * the Payload query layer would strip it, and importing payload.config pulls in
 * unrelated module-load side effects (Shopify client). Direct writes also avoid
 * firing afterChange hooks / ISR revalidation for every doc.
 *
 * Usage:
 *   bun run migrate:product-featured:dry-run   # Preview — no DB changes
 *   bun run migrate:product-featured           # Execute migration
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

/* eslint-disable @typescript-eslint/no-explicit-any */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// DATABASE_URI lives in .env.local (falls back to .env / already-exported env)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

interface Stats {
  scanned: number
  backfilled: number
  alreadyFeatured: number
  cleaned: number
  errors: number
}

async function migrateProductFeatured(dryRun = false): Promise<void> {
  console.log('🎹 Product Featured Consolidation Migration')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no DB changes)' : '✍️  LIVE (will modify database)'}`)
  console.log('')

  const uri = process.env.DATABASE_URI
  if (!uri) throw new Error('DATABASE_URI not set (checked .env.local and .env)')

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()
  const products = db.collection('products')

  // Every product that still carries the legacy visibility.featured flag
  const docs = (await products
    .find(
      { 'visibility.featured': { $exists: true } },
      { projection: { _id: 1, model: 1, name: 1, featured: 1, visibility: 1 } },
    )
    .toArray()) as any[]

  console.log(`📊 Found ${docs.length} product(s) carrying the legacy visibility.featured field\n`)

  const stats: Stats = { scanned: 0, backfilled: 0, alreadyFeatured: 0, cleaned: 0, errors: 0 }

  for (const doc of docs) {
    stats.scanned++
    const label: string = doc.name || doc.model || String(doc._id)
    const legacyFeatured = doc.visibility?.featured === true
    const topFeatured = doc.featured === true
    const needsBackfill = legacyFeatured && !topFeatured

    if (needsBackfill) {
      console.log(`✅ BACKFILL: "${label}" — visibility.featured=true → featured=true (+ drop subfield)`)
    } else if (legacyFeatured && topFeatured) {
      console.log(`⏭️  KEEP: "${label}" — already featured top-level (+ drop subfield)`)
      stats.alreadyFeatured++
    } else {
      console.log(`🧹 CLEAN: "${label}" — legacy visibility.featured=${doc.visibility?.featured} (+ drop subfield)`)
    }

    if (dryRun) {
      if (needsBackfill) stats.backfilled++
      stats.cleaned++
      continue
    }

    try {
      const update: Record<string, unknown> = { $unset: { 'visibility.featured': '' } }
      if (needsBackfill) update.$set = { featured: true }
      await products.updateOne({ _id: doc._id }, update)
      if (needsBackfill) stats.backfilled++
      stats.cleaned++
    } catch (error) {
      console.error(`   ❌ Failed for "${label}":`, error)
      stats.errors++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📈 SUMMARY')
  console.log('='.repeat(50))
  console.log(`   Scanned (had legacy field):    ${stats.scanned}`)
  console.log(`   ✅ Backfilled featured=true:    ${stats.backfilled}`)
  console.log(`   ⏭️  Already top-level featured:  ${stats.alreadyFeatured}`)
  console.log(`   🧹 Legacy subfield removed:     ${stats.cleaned}`)
  console.log(`   ❌ Errors:                      ${stats.errors}`)
  console.log('='.repeat(50))

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE — no changes made')
    console.log('   Run without --dry-run to execute')
  } else {
    console.log('\n✅ MIGRATION COMPLETE')
    console.log('   Revalidate the nav cache (tag: products-navigation) or wait out the 5-min TTL.')
  }

  await client.close()

  if (stats.errors > 0) {
    console.error(`\n⚠️  ${stats.errors} error(s) occurred — check output above`)
    process.exit(1)
  }
}

const dryRun = process.argv.includes('--dry-run')

migrateProductFeatured(dryRun)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ FATAL ERROR:', error)
    process.exit(1)
  })
