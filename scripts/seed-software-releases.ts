#!/usr/bin/env tsx
/**
 * Seed / refresh the `software-releases` collection.
 *
 * Source of truth for the initial import is src/lib/data/software-releases.seed.json,
 * extracted from Kawai Japan's published software-update table. After seeding, the
 * collection is maintained in the Payload admin — re-running this script only
 * touches models whose data actually differs, so hand edits to untouched models
 * survive.
 *
 * Upserts by `slug`. Uses the Payload Local API (so field validation applies) with
 * context.skipHook so a 55-model import does not fire 55 ISR revalidations; the
 * script revalidates once at the end instead.
 *
 * Usage:
 *   bun run seed:software:dry-run   # Preview — no DB changes
 *   bun run seed:software           # Execute
 */

import { getPayload } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

interface SeedDownload {
  label: string
  version: string
  fileUrl: string
  fileBytes: number | null
  instructionsUrl: string | null
}

interface SeedModel {
  slug: string
  model: string
  aliases: string[]
  category: 'digital' | 'hybrid' | 'anytime'
  series: string
  downloads: SeedDownload[]
}

function toDoc(m: SeedModel) {
  return {
    model: m.model,
    slug: m.slug,
    category: m.category,
    series: m.series,
    aliases: m.aliases.map((name) => ({ name })),
    downloads: m.downloads.map((d) => ({
      label: d.label,
      version: d.version,
      fileUrl: d.fileUrl,
      fileBytes: d.fileBytes,
      instructionsUrl: d.instructionsUrl,
    })),
    isActive: true,
  }
}

/** Compare only the fields this script owns, so admin-only edits aren't clobbered. */
function isUnchanged(existing: Record<string, unknown>, next: ReturnType<typeof toDoc>): boolean {
  const pick = (o: Record<string, unknown>) =>
    JSON.stringify({
      model: o.model,
      category: o.category,
      series: o.series,
      aliases: (o.aliases as { name?: string }[] | undefined)?.map((a) => a.name) ?? [],
      downloads:
        (o.downloads as SeedDownload[] | undefined)?.map((d) => ({
          label: d.label,
          version: d.version,
          fileUrl: d.fileUrl,
          fileBytes: d.fileBytes ?? null,
          instructionsUrl: d.instructionsUrl ?? null,
        })) ?? [],
    })
  return pick(existing) === pick(next as unknown as Record<string, unknown>)
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')

  console.log('🎹 Software Releases Seed')
  console.log(`   Mode: ${dryRun ? '🔍 DRY RUN (no DB changes)' : '✍️  LIVE (will modify database)'}\n`)

  const seedPath = path.resolve(__dirname, '../src/lib/data/software-releases.seed.json')
  const seed = JSON.parse(readFileSync(seedPath, 'utf-8')) as SeedModel[]
  console.log(`📦 ${seed.length} models in seed file\n`)

  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })

  let created = 0
  let updated = 0
  let skipped = 0
  let failed = 0

  for (const m of seed) {
    const next = toDoc(m)
    try {
      const found = await payload.find({
        collection: 'software-releases',
        where: { slug: { equals: m.slug } },
        limit: 1,
        depth: 0,
      })

      const existing = found.docs[0]

      if (!existing) {
        if (!dryRun) {
          await payload.create({
            collection: 'software-releases',
            data: next,
            context: { skipHook: true },
          })
        }
        created++
        console.log(`   + ${m.model}`)
        continue
      }

      if (isUnchanged(existing as unknown as Record<string, unknown>, next)) {
        skipped++
        continue
      }

      if (!dryRun) {
        await payload.update({
          collection: 'software-releases',
          id: existing.id,
          data: next,
          context: { skipHook: true },
        })
      }
      updated++
      console.log(`   ~ ${m.model}`)
    } catch (err) {
      failed++
      console.error(`   ! ${m.model}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  console.log(
    `\n📊 created ${created} · updated ${updated} · unchanged ${skipped} · failed ${failed}`,
  )

  if (!dryRun && (created > 0 || updated > 0)) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const secret = process.env.REVALIDATION_SECRET
    if (siteUrl && secret) {
      try {
        await fetch(`${siteUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret, tag: 'software-releases' }),
        })
        console.log('♻️  Revalidated /software')
      } catch (err) {
        console.warn('⚠️  Revalidation failed:', err instanceof Error ? err.message : err)
      }
    }
  }

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
