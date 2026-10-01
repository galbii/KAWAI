#!/usr/bin/env tsx
/**
 * SH-9 headphone bundle — promo popups for the qualifying catalogue
 *
 * Puts the /fall-financing SH-9 offer in front of shoppers where they actually
 * browse, instead of only on the campaign page:
 *
 *   • Every qualifying CN/CA Series model gets a BUNDLE-style promo on its
 *     product page — that model and a pair of SH-9 headphones, the two prices
 *     added up and struck through, and the model's own price as what you pay.
 *     The $139 headphones are the whole saving, which is precisely the offer.
 *
 *   • The CN Series and CA Series collection pages get a SINGLE-style promo.
 *     A collection page has no one piano price, and the offer covers every
 *     model in the series, so framing it as a two-item bundle there would
 *     misstate it.
 *
 * Qualifying set matches getPromoCollections() — active products in the
 * cn-series / ca-series Shopify collections that carry a price — less the models
 * in EXCLUDED_MODELS. Unpriced models are discontinued in this catalogue and are
 * skipped, exactly as the campaign page skips them.
 *
 * US only: `sites: 'us'`. These are US-market dealer offers and the campaign
 * page declares no en-CA alternate, so the popup must not appear on
 * ca.kawaius.com.
 *
 * Goes through the Local API so field shapes, array row ids and relationship
 * ObjectIds are written by Payload rather than hand-rolled, and so the
 * collection search-index hook fires. Shopify sync is suppressed with
 * `context.skipShopifySync` — this changes marketing copy, not catalogue data,
 * and must not be pushed back to the store.
 *
 * Idempotent. Refuses to overwrite a promo that is already enabled for
 * something else unless --force is passed.
 *
 * Usage:
 *   bun --env-file=.env.local run promo:sh9-bundle:dry-run
 *   bun --env-file=.env.local run promo:sh9-bundle
 *   bun --env-file=.env.local run promo:sh9-bundle -- --force
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Shopify collection handles the offer covers — mirrors campaign.ts `bundle.collections` */
const QUALIFYING_HANDLES = ['cn-series', 'ca-series'] as const

/**
 * Models inside those collections that the offer does NOT cover.
 *
 * Nothing in the catalogue distinguishes these — they are active and priced, and
 * carry no legacy flag — so the exclusion has to live here. Listed explicitly so
 * a re-run cannot quietly put the promo back: the script clears our promo from
 * anything named here.
 */
const EXCLUDED_MODELS = ['CA49', 'CA79', 'CA99', 'CN29', 'CN33', 'CN39'] as const

/** The accessory every qualifying piano comes with */
const SH9_MODEL = 'SH-9'

/**
 * Campaign artwork: the autumn-light room shot. Matched on filename, not alt —
 * several fall images share the alt "MS Fall 1", including KAWAI_CA401B-30.webp.
 */
const OFFER_IMAGE_FILENAME = 'MS Fall 1.webp'

const HEADLINE = 'SH-9 Headphones Included'
const EYEBROW = 'Starting October 1'
const CTA_LABEL = 'Find Your Local Dealer'
const DEALER_PATH = '/find-a-dealer'
const WINDOW = 'October 1 through December 31, 2026'

/**
 * Fine print. The campaign's disclaimer in full is too long for a popup, so
 * this keeps the two clauses that change what a shopper pays: the offer window
 * and the fact that the figures are MSRP, not the dealer's price.
 */
const PRICE_NOTE =
  "SH-9 included at no charge, October 1 – December 31, 2026. Prices are manufacturer's " +
  'suggested retail; your local Authorized Kawai dealer sets the final price.'

/**
 * Retry a write that lost a race.
 *
 * Atlas returns a transient WriteConflict (code 112) when another transaction is
 * touching the same document — the collection afterChange hook writes a search
 * index entry, so a save here regularly collides with itself. Mongo's own advice
 * for this label is to retry the transaction, which is all this does.
 */
async function withRetry<T>(label: string, op: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await op()
    } catch (error: any) {
      const transient =
        error?.code === 112 || error?.codeName === 'WriteConflict' || error?.errorLabels?.includes?.('TransientTransactionError')
      if (!transient || attempt >= attempts) throw error
      const backoff = 250 * attempt
      console.log(`   ↻ ${label}: write conflict, retrying in ${backoff}ms (attempt ${attempt + 1}/${attempts})`)
      await new Promise((resolve) => setTimeout(resolve, backoff))
    }
  }
}

interface Stats {
  products: number
  collections: number
  cleared: number
  skippedUnpriced: number
  skippedConflict: number
  errors: number
}

async function run(dryRun: boolean, force: boolean): Promise<void> {
  console.log('🎧 SH-9 Bundle Promo')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no DB changes)' : '✍️  LIVE (will modify database)'}`)
  if (force) console.log('   ⚠️  --force: will overwrite promos already enabled for something else')
  console.log('')

  const payload = await getPayload({ config })
  const stats: Stats = {
    products: 0,
    collections: 0,
    cleared: 0,
    skippedUnpriced: 0,
    skippedConflict: 0,
    errors: 0,
  }

  // ── The accessory ───────────────────────────────────────────────────────────
  const { docs: sh9Docs } = await payload.find({
    collection: 'products',
    where: { model: { equals: SH9_MODEL } },
    depth: 0,
    limit: 1,
  })
  const sh9 = sh9Docs[0]
  if (!sh9) throw new Error(`Product "${SH9_MODEL}" not found — cannot build the bundle`)
  console.log(`🎧 Bundled accessory: ${sh9.model} — $${sh9.price?.msrp ?? '?'} (${sh9.slug})`)

  // ── The campaign photograph ─────────────────────────────────────────────────
  const { docs: mediaDocs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: OFFER_IMAGE_FILENAME } },
    depth: 0,
    limit: 1,
  })
  const offerImage = mediaDocs[0]
  if (!offerImage) {
    throw new Error(`Media "${OFFER_IMAGE_FILENAME}" not found — upload it before running this`)
  }
  console.log(`🖼️  Offer image: ${offerImage.filename} (${offerImage.id})\n`)

  // ── Qualifying products ─────────────────────────────────────────────────────
  const { docs: candidates } = await payload.find({
    collection: 'products',
    where: {
      status: { equals: 'active' },
      'shopifyCollections.handle': { in: [...QUALIFYING_HANDLES] },
    },
    depth: 0,
    limit: 500,
    pagination: false,
  })

  console.log(`📊 ${candidates.length} active model(s) in ${QUALIFYING_HANDLES.join(' / ')}\n`)

  for (const product of candidates) {
    const label = product.modelLabel || product.model || product.slug
    const price = product.price?.msrp ?? null
    const existingPromo: any = product.promo

    // Not covered by the offer. If a previous run put our promo here, take it
    // back off rather than leaving it live.
    if (product.model && EXCLUDED_MODELS.includes(product.model as any)) {
      if (existingPromo?.title !== HEADLINE) {
        console.log(`⏭️  SKIP ${label} — not covered by the offer`)
        continue
      }

      console.log(`🧹 CLEAR ${label} — not covered by the offer, removing the SH-9 promo`)
      if (dryRun) {
        stats.cleared++
        continue
      }

      try {
        await withRetry(label, () =>
          payload.update({
          collection: 'products',
          id: product.id,
          data: {
            slug: product.slug,
            name: product.name,
            // Every field this script sets, explicitly returned to its default,
            // so nothing is left behind for the next editor to puzzle over.
            promo: {
              enabled: false,
              style: 'single',
              linkType: 'product',
              customUrl: null,
              eyebrow: null,
              title: null,
              message: null,
              bundleItems: [],
              bundleMedia: [],
              bundlePrice: null,
              priceNote: null,
              ctaLabel: null,
              sites: 'both',
              displayFrequency: 'session',
              delaySeconds: 2,
            },
          },
          context: { skipShopifySync: true },
          }),
        )
        stats.cleared++
      } catch (error) {
        console.error(`   ❌ Failed to clear ${label}:`, error)
        stats.errors++
      }
      continue
    }

    // Unpriced digitals are discontinued in this catalogue — the campaign page
    // drops them, and a bundle with no piano price has nothing to strike out.
    if (price == null || price <= 0) {
      console.log(`⏭️  SKIP ${label} — no price (discontinued)`)
      stats.skippedUnpriced++
      continue
    }

    const isOurs = existingPromo?.title === HEADLINE
    if (existingPromo?.enabled && !isOurs && !force) {
      console.log(
        `⚠️  SKIP ${label} — promo already enabled for "${existingPromo.title ?? '(untitled)'}" (use --force to replace)`,
      )
      stats.skippedConflict++
      continue
    }

    const separate = price + (sh9.price?.msrp ?? 0)
    console.log(
      `✅ ${isOurs ? 'UPDATE' : 'SET'} ${label} — separately $${separate.toLocaleString()} → $${price.toLocaleString()} (save $${(sh9.price?.msrp ?? 0).toLocaleString()})`,
    )

    if (dryRun) {
      stats.products++
      continue
    }

    try {
      await withRetry(label, () =>
        payload.update({
        collection: 'products',
        id: product.id,
        // slug and name are passed back unchanged: the collection's beforeChange
        // hook regenerates both when they are absent from the incoming data,
        // which on a partial update would rewrite the slug to "product".
        data: {
          slug: product.slug,
          name: product.name,
          promo: {
            enabled: true,
            style: 'bundle',
            linkType: 'custom',
            customUrl: DEALER_PATH,
            eyebrow: EYEBROW,
            title: HEADLINE,
            message:
              `Buy a new ${label} ${WINDOW} and a pair of Kawai SH-9 high-performance ` +
              `headphones comes with it — one per piano, at no extra cost, from your local ` +
              `Authorized Kawai dealer.`,
            bundleItems: [{ product: product.id }, { product: sh9.id }],
            bundleMedia: [{ image: offerImage.id }],
            bundlePrice: price,
            priceNote: PRICE_NOTE,
            ctaLabel: CTA_LABEL,
            sites: 'us',
            displayFrequency: 'session',
            delaySeconds: 4,
          },
        },
        // Marketing copy, not catalogue data — never push this to Shopify.
        context: { skipShopifySync: true },
        }),
      )
      stats.products++
    } catch (error) {
      console.error(`   ❌ Failed for ${label}:`, error)
      stats.errors++
    }
  }

  // ── Qualifying collections ──────────────────────────────────────────────────
  console.log('')
  const { docs: collections } = await payload.find({
    collection: 'collections',
    where: { handle: { in: [...QUALIFYING_HANDLES] } },
    depth: 0,
    limit: 10,
  })

  for (const collection of collections) {
    const existing: any = collection.successorPromo
    const isOurs = existing?.title === HEADLINE
    if (existing?.enabled && !isOurs && !force) {
      console.log(
        `⚠️  SKIP ${collection.handle} — promo already enabled for "${existing.title ?? '(untitled)'}" (use --force to replace)`,
      )
      stats.skippedConflict++
      continue
    }

    console.log(`✅ ${isOurs ? 'UPDATE' : 'SET'} /pianos/${collection.handle} — single-style SH-9 promo`)

    if (dryRun) {
      stats.collections++
      continue
    }

    try {
      await withRetry(collection.handle ?? String(collection.id), () =>
        payload.update({
        collection: 'collections',
        id: collection.id,
        data: {
          successorPromo: {
            enabled: true,
            style: 'single',
            ctaType: 'custom',
            ctaUrl: DEALER_PATH,
            eyebrow: EYEBROW,
            title: HEADLINE,
            message:
              `Every qualifying new ${collection.title} digital piano comes with a pair of Kawai ` +
              `SH-9 high-performance headphones — one per piano, at no extra cost, ${WINDOW}. ` +
              `Available at your local Authorized Kawai dealer.`,
            image: offerImage.id,
            ctaLabel: CTA_LABEL,
            sites: 'us',
            displayFrequency: 'session',
            delaySeconds: 4,
          },
        },
        }),
      )
      stats.collections++
    } catch (error) {
      console.error(`   ❌ Failed for ${collection.handle}:`, error)
      stats.errors++
    }
  }

  console.log('\n' + '='.repeat(56))
  console.log('📈 SUMMARY')
  console.log('='.repeat(56))
  console.log(`   ✅ Product promos:              ${stats.products}`)
  console.log(`   🧹 Cleared (not covered):       ${stats.cleared}`)
  console.log(`   ✅ Collection promos:           ${stats.collections}`)
  console.log(`   ⏭️  Skipped (no price):          ${stats.skippedUnpriced}`)
  console.log(`   ⚠️  Skipped (promo in use):      ${stats.skippedConflict}`)
  console.log(`   ❌ Errors:                      ${stats.errors}`)
  console.log('='.repeat(56))

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE — no changes made')
    console.log('   Run without --dry-run to apply')
  } else {
    console.log('\n✅ DONE')
    console.log('   Product pages revalidate themselves via the Products afterChange hook when')
    console.log('   saved in-app; from a script that call is a no-op, so the pages pick the promo')
    console.log('   up on their next ISR pass (1 hour) or via POST /api/revalidate.')
  }

  if (stats.errors > 0) {
    console.error(`\n⚠️  ${stats.errors} error(s) — check output above`)
    process.exit(1)
  }
}

const dryRun = process.argv.includes('--dry-run')
const force = process.argv.includes('--force')

run(dryRun, force)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal:', error)
    process.exit(1)
  })
