#!/usr/bin/env tsx
/**
 * Dallas "Back to School" signup campaign — add Violin as a study option.
 *
 * Kawai Music School Dallas teaches violin (Hyun Jung Kim joined the faculty),
 * but the campaign form only offered Piano / Voice / Both. This adds Violin to
 * the "Which would you like to study?" dropdown and relabels "Both" to
 * "More than one", which no longer reads correctly once there are three
 * instruments. The stored value stays `both` so submissions already in the
 * inbox remain comparable — only the label the visitor sees changes.
 *
 * Five places on the page name the instruments in prose; all five are updated
 * so the copy matches the option list:
 *   - hero.subheading            ("study piano or voice one-on-one")
 *   - What's included → Instruments row  ("Piano and Voice")
 *   - faculty intro              ("teach piano and voice at every level")
 *   - meta.description           (search snippet)
 *   - promoModal.body            (popup on the music-school page)
 *
 * Idempotent: if a `violin` option is already on the question, nothing is
 * written. Safe to re-run.
 *
 * Goes through the Local API (not the raw driver) so the collection's
 * afterChange hook fires. That hook revalidates `signup-campaign-{slug}`,
 * which nothing actually caches under — the page's data lives under
 * `signup-campaigns-{storeslug}` — so this script busts the real tags itself
 * against the live site when --revalidate is passed.
 *
 * Usage:
 *   bun --env-file=.env.local run signup:violin:dry-run
 *   bun --env-file=.env.local run signup:violin
 *   bun --env-file=.env.local run signup:violin -- --revalidate
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'

const CAMPAIGN_SLUG = 'back-to-school'
const STORE_SLUG = 'dallas'
const QUESTION_NAME = 'instrument'
const LIVE_SITE = 'https://kawaius.com'

const NEW_OPTION = { label: 'Violin', value: 'violin' }

/** Prose rewrites: [where it lives, from, to]. Applied only on an exact match. */
const COPY = {
  heroSubheading: {
    from: 'Start the school year at the bench. Book a free trial lesson, skip the enrollment fee, and study piano or voice one-on-one with professional instructors.',
    to: 'Start the school year at the bench. Book a free trial lesson, skip the enrollment fee, and study piano, voice, or violin one-on-one with professional instructors.',
  },
  instrumentsRow: { from: 'Piano and Voice', to: 'Piano, Voice, and Violin' },
  facultyIntro: {
    from: 'Our Dallas faculty teach piano and voice at every level — from a first lesson to competition preparation.',
    to: 'Our Dallas faculty teach piano, voice, and violin at every level — from a first lesson to competition preparation.',
  },
  metaDescription: {
    from: 'Free trial lesson, no enrollment fee, and student discounts toward piano purchase and rental. Piano and voice lessons with professional instructors in Dallas.',
    to: 'Free trial lesson, no enrollment fee, and student discounts toward piano purchase and rental. Piano, voice, and violin lessons with professional instructors in Dallas.',
  },
  promoModalBody: {
    from: 'Free trial lesson, no enrollment fee, and student discounts toward piano purchase and rental. Piano and voice.',
    to: 'Free trial lesson, no enrollment fee, and student discounts toward piano purchase and rental. Piano, voice, and violin.',
  },
} as const

type Option = { id?: string; label?: string | null; value?: string | null }
type Question = { id?: string; name?: string | null; label?: string | null; options?: Option[] }

const changes: string[] = []

/** Rewrite `current` to the mapped value, recording it. Unknown text is left alone. */
function rewrite(where: string, current: string | null | undefined, rule: { from: string; to: string }) {
  if (current === rule.to) return current
  if (current !== rule.from) {
    console.log(`  ! ${where} — text has changed since this script was written, left as-is:`)
    console.log(`      "${current ?? '(empty)'}"`)
    return current
  }
  changes.push(`${where}:\n      - ${rule.from}\n      + ${rule.to}`)
  return rule.to
}

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run')
  const shouldRevalidate = process.argv.includes('--revalidate')
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'signup-campaigns',
    where: { slug: { equals: CAMPAIGN_SLUG } },
    depth: 0,
    limit: 2,
  })

  if (found.docs.length > 1) {
    console.error(`✗ ${found.docs.length} campaigns share the slug "${CAMPAIGN_SLUG}". Aborting.`)
    process.exit(1)
  }

  const campaign = found.docs[0] as any
  if (!campaign) {
    console.error(`✗ No signup campaign with slug "${CAMPAIGN_SLUG}" found. Aborting.`)
    process.exit(1)
  }

  console.log(`\n── ${campaign.title} (id: ${campaign.id}) ──────────────────\n`)

  const questions: Question[] = campaign.form?.questions ?? []
  const question = questions.find((q) => q.name === QUESTION_NAME)
  if (!question) {
    console.error(`✗ No question named "${QUESTION_NAME}" on this campaign. Aborting.`)
    process.exit(1)
  }

  const options: Option[] = question.options ?? []
  console.log(`"${question.label}" currently offers: ${options.map((o) => o.label).join(' · ')}\n`)

  if (options.some((o) => o.value === NEW_OPTION.value)) {
    console.log('Violin is already an option. Nothing to do.\n')
    process.exit(0)
  }

  // Violin sits next to the other instruments, ahead of the two catch-alls.
  const voiceIndex = options.findIndex((o) => o.value === 'voice')
  const insertAt = voiceIndex === -1 ? options.length : voiceIndex + 1
  const nextOptions: Option[] = [
    ...options.slice(0, insertAt),
    NEW_OPTION,
    ...options.slice(insertAt),
  ].map((o) => (o.value === 'both' && o.label === 'Both' ? { ...o, label: 'More than one' } : o))

  changes.push(
    `question "${question.label}":\n      - ${options.map((o) => o.label).join(' · ')}\n      + ${nextOptions.map((o) => o.label).join(' · ')}`,
  )

  const nextQuestions = questions.map((q) =>
    q.name === QUESTION_NAME ? { ...q, options: nextOptions } : q,
  )

  const nextBlocks = (campaign.blocks ?? []).map((block: any) => {
    if (block.blockType === 'signup-details') {
      return {
        ...block,
        items: (block.items ?? []).map((item: any) =>
          item.label === 'Instruments'
            ? { ...item, value: rewrite('Instruments row', item.value, COPY.instrumentsRow) }
            : item,
        ),
      }
    }
    if (block.blockType === 'signup-instructors') {
      return { ...block, intro: rewrite('faculty intro', block.intro, COPY.facultyIntro) }
    }
    return block
  })

  const data = {
    hero: {
      ...campaign.hero,
      subheading: rewrite('hero subheading', campaign.hero?.subheading, COPY.heroSubheading),
    },
    blocks: nextBlocks,
    form: { ...campaign.form, questions: nextQuestions },
    meta: {
      ...campaign.meta,
      description: rewrite('meta description', campaign.meta?.description, COPY.metaDescription),
    },
    promoModal: {
      ...campaign.promoModal,
      body: rewrite('promo modal body', campaign.promoModal?.body, COPY.promoModalBody),
    },
  }

  console.log('Changes:\n')
  for (const c of changes) console.log(`  • ${c}\n`)

  if (isDryRun) {
    console.log('DRY RUN — no changes written.\n')
    process.exit(0)
  }

  await payload.update({ collection: 'signup-campaigns', id: campaign.id, data: data as any })
  console.log('✓ Campaign updated.\n')

  if (shouldRevalidate) {
    const secret = process.env.REVALIDATION_SECRET
    if (!secret) {
      console.log('! REVALIDATION_SECRET not set — skipping live cache bust.\n')
      process.exit(0)
    }
    for (const body of [
      { secret, tag: `signup-campaigns-${STORE_SLUG}` },
      { secret, tag: 'signup-campaigns' },
      { secret, path: `/store/${STORE_SLUG}/signup/${CAMPAIGN_SLUG}` },
    ]) {
      const res = await fetch(`${LIVE_SITE}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      console.log(`  revalidate ${JSON.stringify(body.tag ?? body.path)} → ${res.status}`)
    }
    console.log('')
  } else {
    console.log('Pass --revalidate to bust the live cache, or wait out the 1h ISR window.\n')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
