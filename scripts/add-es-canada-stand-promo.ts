#!/usr/bin/env tsx
/**
 * ES Series Canada bundle — free matching stand
 *
 * Canada-only offer: a new ES60, ES120 or ES920 comes with its matching designer
 * stand at no extra cost. The stand is the whole offer — no headphones.
 *
 *   • Each model's product page gets a BUNDLE-style promo — the piano and its
 *     stand with their CAD prices, the separate total struck through, and the
 *     piano's own price as the bundle price. The stand is the saving.
 *
 *   • The ES Series collection page gets a SINGLE-style promo naming the three
 *     models. The collection holds other ES models the offer does not cover, so
 *     it lists them rather than framing the whole series as a bundle.
 *
 * Canada only: `sites: 'cad'`. kawaius.com never shows these popups, and the
 * bundle reads CAD figures only (US prices are never shown on the CA site).
 *
 * Replaces the earlier ES60 "stand + SH-9 headphones" promo
 * (add-es60-canada-bundle-promo.ts) — that title is recognised as ours, so a
 * plain run overwrites it without --force.
 *
 * Goes through the Local API so field shapes and relationship ids are written
 * by Payload. Shopify sync is suppressed with `context.skipShopifySync` — this
 * is marketing copy, not catalogue data.
 *
 * Idempotent. Refuses to overwrite a promo that is already enabled for
 * something else unless --force is passed.
 *
 * Usage:
 *   bun --env-file=.env.local run promo:es-canada:dry-run
 *   bun --env-file=.env.local run promo:es-canada
 *   bun --env-file=.env.local run promo:es-canada -- --force
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Qualifying pianos and the stand each one ships with. ES920 maps to `HM-5`
 * (slug hm-5-designer-stand-es920) — the catalogue also carries an older `HM5`
 * duplicate at a different CAD price, which is deliberately not used.
 */
const OFFERS = [
  { piano: 'ES60', stand: 'HML-3', standName: 'HML-3 Designer Stand' },
  { piano: 'ES120', stand: 'HML-2', standName: 'HML-2 Designer Stand' },
  { piano: 'ES920', stand: 'HM-5', standName: 'HM-5 Designer Stand' },
] as const

const COLLECTION_HANDLE = 'es-series'

const EYEBROW = 'Canada Exclusive'
const CTA_LABEL = 'Find Your Local Dealer'
const DEALER_PATH = '/find-a-dealer'
const COLLECTION_HEADLINE = 'Free Stand with the ES60, ES120 & ES920'

/** Titles this script (or its ES60 predecessor) wrote — safe to overwrite without --force */
const headlineFor = (piano: string) => `Free Stand with the ${piano}`
const OWN_TITLES = new Set<string>([
  ...OFFERS.map((o) => headlineFor(o.piano)),
  COLLECTION_HEADLINE,
  'Free Stand & Headphones with the ES60',
])

const priceNoteFor = (piano: string, standName: string) =>
  `${standName} included at no charge with a new ${piano}, at participating Authorized Kawai ` +
  'dealers in Canada. Prices in CAD; your dealer sets the final price.'

/** Atlas WriteConflict (code 112) — the search-index afterChange hook collides with the save */
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

async function run(dryRun: boolean, force: boolean): Promise<void> {
  console.log('🇨🇦 ES Series Canada Stand Promo')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no DB changes)' : '✍️  LIVE (will modify database)'}`)
  if (force) console.log('   ⚠️  --force: will overwrite promos already enabled for something else')
  console.log('')

  const payload = await getPayload({ config })

  const findModel = async (model: string) => {
    const { docs } = await payload.find({
      collection: 'products',
      where: { model: { equals: model } },
      depth: 0,
      limit: 1,
    })
    const doc = docs[0]
    if (!doc) throw new Error(`Product "${model}" not found — cannot build the bundle`)
    return doc
  }

  const cad = (p: any): number | null => p.priceCAD?.price ?? p.priceCAD?.msrp ?? null
  const isOurs = (promo: any) => !promo?.enabled || OWN_TITLES.has(promo.title ?? '')

  let errors = 0
  const pianoIds: Record<string, string> = {}

  // ── Product pages ───────────────────────────────────────────────────────────
  for (const offer of OFFERS) {
    const [piano, stand] = await Promise.all([findModel(offer.piano), findModel(offer.stand)])
    pianoIds[offer.piano] = piano.id

    const pianoPrice = cad(piano)
    if (pianoPrice == null || pianoPrice <= 0) {
      console.error(`❌ ${offer.piano} has no CAD price — the bundle has nothing to price against`)
      errors++
      continue
    }
    const separate = pianoPrice + (cad(stand) ?? 0)
    console.log(
      `   ${offer.piano.padEnd(6)} CA$${pianoPrice} + ${offer.stand} CA$${cad(stand) ?? '?'} → bundle CA$${pianoPrice} (save CA$${separate - pianoPrice})`,
    )

    const headline = headlineFor(offer.piano)
    const existing: any = piano.promo
    if (!isOurs(existing) && !force) {
      console.log(`⚠️  SKIP ${offer.piano} — promo already enabled for "${existing.title ?? '(untitled)'}" (use --force to replace)\n`)
      continue
    }
    console.log(`✅ ${existing?.enabled ? 'UPDATE' : 'SET'} /products/${piano.slug} — stand bundle, Canada only\n`)
    if (dryRun) continue

    try {
      await withRetry(offer.piano, () =>
        payload.update({
          collection: 'products',
          id: piano.id,
          // slug and name passed back unchanged: beforeChange regenerates both
          // when absent, which on a partial update would rewrite the slug.
          data: {
            slug: piano.slug,
            name: piano.name,
            promo: {
              enabled: true,
              style: 'bundle',
              linkType: 'custom',
              customUrl: DEALER_PATH,
              eyebrow: EYEBROW,
              title: headline,
              message:
                `Buy a new Kawai ${offer.piano} digital piano and its matching ${offer.standName} ` +
                'comes with it — at no extra cost, from your local Authorized Kawai dealer.',
              bundleItems: [{ product: piano.id }, { product: stand.id }],
              bundleMedia: [],
              bundlePriceCAD: pianoPrice,
              priceNote: priceNoteFor(offer.piano, offer.standName),
              ctaLabel: CTA_LABEL,
              sites: 'cad',
              displayFrequency: 'session',
              delaySeconds: 4,
            },
          },
          context: { skipShopifySync: true },
        }),
      )
    } catch (error) {
      console.error(`   ❌ Failed for ${offer.piano}:`, error)
      errors++
    }
  }

  // ── ES Series collection page ───────────────────────────────────────────────
  const { docs: collections } = await payload.find({
    collection: 'collections',
    where: { handle: { equals: COLLECTION_HANDLE } },
    depth: 0,
    limit: 1,
  })
  const collection = collections[0]
  if (!collection) {
    console.log(`⚠️  SKIP collection — "${COLLECTION_HANDLE}" not found`)
  } else {
    const current: any = collection.successorPromo
    if (!isOurs(current) && !force) {
      console.log(`⚠️  SKIP /pianos/${COLLECTION_HANDLE} — promo already enabled for "${current.title ?? '(untitled)'}" (use --force to replace)`)
    } else {
      console.log(`✅ ${current?.enabled ? 'UPDATE' : 'SET'} /pianos/${COLLECTION_HANDLE} — single promo, Canada only`)
      if (!dryRun) {
        try {
          await withRetry(COLLECTION_HANDLE, () =>
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
                  title: COLLECTION_HEADLINE,
                  message:
                    'A new ES60, ES120 or ES920 comes with its matching designer stand at no extra cost, ' +
                    'at participating Authorized Kawai dealers in Canada.',
                  ctaLabel: CTA_LABEL,
                  sites: 'cad',
                  displayFrequency: 'session',
                  delaySeconds: 4,
                },
              },
            }),
          )
        } catch (error) {
          console.error(`   ❌ Failed for ${COLLECTION_HANDLE}:`, error)
          errors++
        }
      }
    }
  }

  if (dryRun) {
    console.log('\n🔍 DRY RUN COMPLETE — no changes made')
  } else {
    console.log('\n✅ DONE — pages pick the promo up on their next ISR pass or via POST /api/revalidate')
  }

  if (errors > 0) {
    console.error(`\n⚠️  ${errors} error(s) — check output above`)
    process.exit(1)
  }
}

run(process.argv.includes('--dry-run'), process.argv.includes('--force'))
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal:', error)
    process.exit(1)
  })
