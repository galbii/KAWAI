#!/usr/bin/env tsx
/**
 * showInCatalog → shopifyStatus Audit (READ-ONLY)
 *
 * Before removing the manual `visibility.showInCatalog` field and switching all
 * catalog-visibility filters to `shopify.shopifyStatus !== 'UNLISTED'`, this
 * script reports the RISK SET: products currently hidden via showInCatalog=false
 * that are NOT UNLISTED in Shopify. Those would BECOME VISIBLE after the change.
 *
 * Makes no writes. Mirrors scripts/migrate-product-featured.ts (direct mongodb
 * driver) so the soon-to-be-removed field is still readable.
 *
 * Usage:
 *   bunx tsx scripts/audit-showincatalog.ts
 */

import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

/* eslint-disable @typescript-eslint/no-explicit-any */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function audit(): Promise<void> {
  console.log('🎹 showInCatalog → shopifyStatus Audit (READ-ONLY)\n')

  const uri = process.env.DATABASE_URI
  if (!uri) throw new Error('DATABASE_URI not set (checked .env.local and .env)')

  const client = new MongoClient(uri)
  await client.connect()
  const products = client.db().collection('products')

  const total = await products.countDocuments({})

  // Every product explicitly hidden via the manual flag
  const hidden = (await products
    .find(
      { 'visibility.showInCatalog': false },
      { projection: { _id: 1, model: 1, name: 1, slug: 1, status: 1, visibility: 1, shopify: 1 } },
    )
    .toArray()) as any[]

  // The risk set: hidden by showInCatalog but NOT UNLISTED → would become visible
  const riskSet = hidden.filter((d) => d.shopify?.shopifyStatus !== 'UNLISTED')
  const alreadyUnlisted = hidden.length - riskSet.length

  // Inverse check (informational): UNLISTED but showInCatalog not false — these
  // were already hidden from the menu only; after the change they're hidden everywhere.
  const unlistedShown = await products.countDocuments({
    'shopify.shopifyStatus': 'UNLISTED',
    'visibility.showInCatalog': { $ne: false },
  })

  console.log(`📊 Total products:                              ${total}`)
  console.log(`   Hidden via showInCatalog=false:              ${hidden.length}`)
  console.log(`   ├─ also UNLISTED (stay hidden, no change):   ${alreadyUnlisted}`)
  console.log(`   └─ NOT UNLISTED ⚠️  (WOULD BECOME VISIBLE):  ${riskSet.length}`)
  console.log(`   UNLISTED but not showInCatalog=false:        ${unlistedShown}`)
  console.log(`      (already menu-hidden; become fully hidden after change)\n`)

  if (riskSet.length === 0) {
    console.log('✅ RISK SET EMPTY — no product relies on showInCatalog independently of UNLISTED.')
    console.log('   Safe to remove showInCatalog and switch to shopifyStatus as source of truth.')
  } else {
    console.log('⚠️  RISK SET — these would appear in catalog/menu after the change:\n')
    console.log('    ' + 'MODEL'.padEnd(16) + 'STATUS'.padEnd(14) + 'SHOPIFY'.padEnd(12) + 'NAME')
    console.log('    ' + '-'.repeat(70))
    for (const d of riskSet) {
      const model = String(d.model ?? '—').padEnd(16)
      const status = String(d.status ?? '—').padEnd(14)
      const shop = String(d.shopify?.shopifyStatus ?? '(none)').padEnd(12)
      console.log(`    ${model}${status}${shop}${d.name ?? d.slug ?? d._id}`)
    }
    console.log('\n   Decide per product: set these to UNLISTED in Shopify to preserve')
    console.log('   their hidden state, or accept that they become visible.')
  }

  await client.close()
}

audit()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ FATAL ERROR:', error)
    process.exit(1)
  })
