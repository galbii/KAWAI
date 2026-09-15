#!/usr/bin/env tsx
/**
 * KPM Dallas — Makeup Lesson Policy Emphasis
 *
 * Surfaces the makeup-lesson rule as its own "Makeup Lessons" section on
 * /store/dallas/music-school/policies instead of leaving it buried inside the
 * generic "Missed Lessons" entry.
 *
 * What it does:
 *   1. Populates `makeupLessonPolicy` + `makeupOptions` on KPM Dallas. Both are
 *      currently empty, so `hasMakeup` is false and the dedicated section in
 *      policies/page.tsx never renders.
 *   2. Rewrites the existing "Missed Lessons" policy body so it no longer
 *      implies every 24-hour cancellation is reschedulable — the one-per-month
 *      cap is new and contradicts the old wording.
 *
 * Goes through the Local API (not the raw driver) so the collection's
 * afterChange hook fires and busts the `music-school-kpm-dallas` cache tag.
 *
 * Usage:
 *   bun --env-file=.env.local run policy:dallas-makeup:dry-run
 *   bun --env-file=.env.local run policy:dallas-makeup
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const SCHOOL_NAME = 'KPM Dallas'
const MISSED_LESSONS_TITLE = 'Missed Lessons'

const MAKEUP_LESSON_POLICY =
  "Only one makeup lesson per month may be rescheduled. To qualify, the cancellation must be made at least 24 hours in advance — lessons cancelled with less than 24 hours' notice are not eligible for a rescheduled makeup."

const MAKEUP_OPTIONS = [
  { option: 'One makeup per month' },
  { option: '24-hour advance notice required' },
]

const MISSED_LESSONS_BODY =
  "Lessons cancelled with at least 24 hours' advance notice may be rescheduled — limited to one makeup lesson per month — or covered by a substitute teacher. Lessons missed without 24-hour advance notice are non-refundable; makeup provided via Recorded Video. Group class absences are non-refundable with no makeup."

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run')
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'music-schools',
    where: { schoolName: { equals: SCHOOL_NAME } },
    depth: 0,
    limit: 1,
  })

  const school = found.docs[0]
  if (!school) {
    console.error(`✗ No music school named "${SCHOOL_NAME}" found. Aborting.`)
    process.exit(1)
  }

  const policies: Array<{ id?: string; title: string; body: string }> =
    (school as any).policies ?? []

  const target = policies.find((p) => p.title === MISSED_LESSONS_TITLE)
  if (!target) {
    console.error(
      `✗ "${MISSED_LESSONS_TITLE}" policy not found on ${SCHOOL_NAME}. Aborting rather than guessing.`,
    )
    process.exit(1)
  }

  const nextPolicies = policies.map((p) =>
    p.title === MISSED_LESSONS_TITLE ? { ...p, body: MISSED_LESSONS_BODY } : p,
  )

  console.log(`\n── ${SCHOOL_NAME} (id: ${school.id}) ──────────────────────\n`)
  console.log('makeupLessonPolicy')
  console.log(`  before: ${JSON.stringify((school as any).makeupLessonPolicy ?? null)}`)
  console.log(`  after:  ${JSON.stringify(MAKEUP_LESSON_POLICY)}\n`)
  console.log('makeupOptions')
  console.log(`  before: ${JSON.stringify((school as any).makeupOptions ?? [])}`)
  console.log(`  after:  ${JSON.stringify(MAKEUP_OPTIONS.map((o) => o.option))}\n`)
  console.log(`policies["${MISSED_LESSONS_TITLE}"].body`)
  console.log(`  before: ${target.body}`)
  console.log(`  after:  ${MISSED_LESSONS_BODY}\n`)

  if (isDryRun) {
    console.log('DRY RUN — no changes written.\n')
    process.exit(0)
  }

  await payload.update({
    collection: 'music-schools',
    id: school.id,
    data: {
      makeupLessonPolicy: MAKEUP_LESSON_POLICY,
      makeupOptions: MAKEUP_OPTIONS,
      policies: nextPolicies,
    } as any,
  })

  console.log('✓ Updated. Revalidation hook fired for tag `music-school-kpm-dallas`.\n')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
