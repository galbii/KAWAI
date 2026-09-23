#!/usr/bin/env tsx
/**
 * KPM Dallas — surface violin/strings instruction
 *
 * Dallas hired a violin teacher (Hyun Jung Kim) but the school record still
 * described itself as piano-only in two places:
 *
 *   1. `instruments` listed only Piano. Adds Violin.
 *   2. `about` said "one-on-one individual piano lessons" — which already
 *      contradicted the school's own program rows ("Piano, strings, vocal, and
 *      guitar private Lesson", $40/$60/$80). Widened to match those rows.
 *
 * No new program row: the 30/45/60-minute private lesson entries already cover
 * strings, and violin is priced under them.
 *
 * Idempotent: skips instruments already listed, leaves `about` alone if it has
 * already been widened.
 *
 * Goes through the Local API (not the raw driver) so the collection's
 * afterChange hook fires and busts the `music-school-kpm-dallas` cache tag.
 *
 * Usage:
 *   bun --env-file=.env.local run content:dallas-violin:dry-run
 *   bun --env-file=.env.local run content:dallas-violin
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const SCHOOL_SLUG = 'kpm-dallas'

const ADD_INSTRUMENTS = ['Violin']

const OLD_ABOUT_FRAGMENT = 'weekly not-for-credit one-on-one individual piano lessons'
const NEW_ABOUT_FRAGMENT =
  'weekly not-for-credit one-on-one individual lessons in piano, strings, voice, and guitar'

type Instrument = { id?: string; instrument: string }

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run')
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'music-schools',
    where: { slug: { equals: SCHOOL_SLUG } },
    depth: 0,
    limit: 1,
  })

  const school = found.docs[0]
  if (!school) {
    console.error(`✗ No music school with slug "${SCHOOL_SLUG}" found. Aborting.`)
    process.exit(1)
  }

  const instruments: Instrument[] = ((school as any).instruments ?? []) as Instrument[]
  const existing = new Set(instruments.map((i) => i.instrument.toLowerCase()))
  const toAdd = ADD_INSTRUMENTS.filter((i) => !existing.has(i.toLowerCase()))

  const about: string = (school as any).about ?? ''
  const aboutNeedsUpdate = about.includes(OLD_ABOUT_FRAGMENT)
  const nextAbout = aboutNeedsUpdate
    ? about.replace(OLD_ABOUT_FRAGMENT, NEW_ABOUT_FRAGMENT)
    : about

  console.log(`\n── KPM Dallas (id: ${school.id}) ──────────────────────────\n`)
  console.log(`instruments: ${instruments.map((i) => i.instrument).join(', ') || '(none)'}`)
  console.log(
    `          → ${[...instruments.map((i) => i.instrument), ...toAdd].join(', ')}` +
      (toAdd.length === 0 ? '  (nothing to add)' : ''),
  )
  console.log('\nabout:')
  if (aboutNeedsUpdate) {
    console.log(`  before: …${OLD_ABOUT_FRAGMENT}…`)
    console.log(`  after:  …${NEW_ABOUT_FRAGMENT}…`)
  } else {
    console.log('  unchanged (fragment not found — already widened, or reworded since)')
  }
  console.log('')

  if (toAdd.length === 0 && !aboutNeedsUpdate) {
    console.log('Nothing to do.\n')
    process.exit(0)
  }

  if (isDryRun) {
    console.log('DRY RUN — no changes written.\n')
    process.exit(0)
  }

  await payload.update({
    collection: 'music-schools',
    id: school.id,
    data: {
      instruments: [...instruments, ...toAdd.map((instrument) => ({ instrument }))],
      about: nextAbout,
    } as any,
  })

  console.log('✓ Updated. Revalidation hook fired for tag `music-school-kpm-dallas`.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
