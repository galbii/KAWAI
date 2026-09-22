#!/usr/bin/env tsx
/**
 * Add the /software entry to the Resources mega-menu.
 *
 * The menu reads home-page.resourcesNav.links and only falls back to
 * DEFAULT_RESOURCE_LINKS when that array is empty, so the CMS copy needs the
 * entry too. Idempotent: skips if an entry for /software already exists.
 *
 * Talks to MongoDB directly rather than through the Payload Local API — same
 * approach as scripts/migrate-product-featured.ts. The home-page afterChange hook
 * calls Next's revalidateTag(), which throws outside a request context and rolls
 * the write back. This script POSTs to /api/revalidate at the end instead.
 *
 * Usage:
 *   bun run nav:software:dry-run
 *   bun run nav:software
 */

import { MongoClient } from 'mongodb'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

/* eslint-disable @typescript-eslint/no-explicit-any */

const ENTRY = {
  title: 'Software & Firmware',
  description:
    'Download the latest system software for Kawai digital, hybrid, AnyTime and AURES instruments.',
  href: '/software',
  icon: 'cpu',
  openInNewTab: false,
  enabled: true,
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')
  console.log('🎹 Resources nav — add /software')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN' : '✍️  LIVE'}\n`)

  const uri = process.env.DATABASE_URI
  if (!uri) throw new Error('DATABASE_URI not set (checked .env.local and .env)')

  const client = new MongoClient(uri)
  await client.connect()

  try {
    const col = client.db().collection('home-pages')
    const doc = (await col.findOne({})) as any
    if (!doc) throw new Error('home-page singleton not found')

    const links: any[] = Array.isArray(doc.resourcesNav?.links) ? [...doc.resourcesNav.links] : []
    console.log(`   Existing links: ${links.map((l) => l.href).join(', ') || '(none)'}`)

    if (links.some((l) => String(l?.href ?? '').replace(/\/$/, '') === '/software')) {
      console.log('\n✅ /software already present — nothing to do.')
      return
    }

    links.push(ENTRY)
    console.log(`   Appending — menu will have ${links.length} links`)

    if (dryRun) {
      console.log('\n🔍 Dry run — no changes written.')
      return
    }

    await col.updateOne({ _id: doc._id }, { $set: { 'resourcesNav.links': links } })
    console.log('\n✅ Added /software to the Resources menu.')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const secret = process.env.REVALIDATION_SECRET
    if (siteUrl && secret) {
      try {
        await fetch(`${siteUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, tag: 'home-page' }),
        })
        console.log('♻️  Revalidated home-page')
      } catch {
        console.warn('⚠️  Revalidation call failed — the nav refreshes within the hour regardless.')
      }
    }
  } finally {
    await client.close()
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
