'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BrandEyebrow, BrandCTA, BrandArrowLink } from '@/components/brand'
import { EASE_OUT_EXPO } from '@/components/brand/motion'
import {
  hirotakaHero,
  hirotakaThesis,
  hirotakaHonour,
  hirotakaSuccession,
  hirotakaClose,
  chapters,
  milestones,
  type Chapter,
} from '../_data'

/* ----------------------------------------------------------------------------
 * CornerMarks — the page's quiet signature. Thin L-shaped registration marks at
 * each corner, echoing an engineering drawing: precision framing warmth. Used on
 * the portrait slot, duality cards and media placeholders. Purely decorative.
 * ------------------------------------------------------------------------- */

function CornerMarks({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const c = tone === 'dark' ? 'border-white/25' : 'border-kawai-black/20'
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span className={cn('absolute left-0 top-0 h-4 w-4 border-l border-t', c)} />
      <span className={cn('absolute right-0 top-0 h-4 w-4 border-r border-t', c)} />
      <span className={cn('absolute bottom-0 left-0 h-4 w-4 border-b border-l', c)} />
      <span className={cn('absolute bottom-0 right-0 h-4 w-4 border-b border-r', c)} />
    </span>
  )
}

/* ----------------------------------------------------------------------------
 * MemorialHero — a restrained, dignified title spread on black. A serif name and
 * years sit beside a labelled portrait slot (no portrait of Hirotaka exists yet).
 * All text sits on solid colour, so no scrim is required. Carries the single h1.
 * ------------------------------------------------------------------------- */

export function MemorialHero() {
  const reduce = useReducedMotion()

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section className="relative overflow-hidden bg-kawai-black text-white">
      {/* faint engineered baseline grid */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '7.5rem 100%',
        }}
      />

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <motion.div {...enter(0)} className="mb-7">
              <BrandEyebrow tone="gold">{hirotakaHero.eyebrow}</BrandEyebrow>
            </motion.div>

            <motion.h1
              {...enter(0.08)}
              className="font-[family-name:var(--font-brand-serif)] text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[1.0] tracking-tight text-white"
            >
              {hirotakaHero.name}
            </motion.h1>

            <motion.p
              {...enter(0.14)}
              className="mt-5 font-[family-name:var(--font-brand-serif)] text-2xl font-light tracking-wide text-kawai-gold sm:text-3xl"
            >
              {hirotakaHero.years}
            </motion.p>

            <motion.p
              {...enter(0.18)}
              className="mt-2 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-white/55"
            >
              {hirotakaHero.role}
            </motion.p>

            <motion.p
              {...enter(0.24)}
              className="mt-8 max-w-xl border-l-2 border-kawai-red-400 pl-5 font-[family-name:var(--font-brand-serif)] text-lg font-light italic leading-relaxed text-white/85 sm:text-xl"
            >
              {hirotakaHero.dedication}
            </motion.p>

            <motion.div
              {...enter(0.32)}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
            >
              <BrandCTA href="#thesis" variant="red" showArrow={false}>
                His life’s work
              </BrandCTA>
              <BrandCTA href="/about/heritage" variant="outline">
                Back to Heritage
              </BrandCTA>
            </motion.div>
          </div>

          {/* Portrait slot — labelled placeholder until a Kawai image is supplied. */}
          <motion.figure
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.98 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 },
                })}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gradient-to-br from-white/[0.07] to-white/[0.02] ring-1 ring-white/12">
              <CornerMarks tone="dark" />
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <span className="font-[family-name:var(--font-brand-serif)] text-2xl font-light tracking-wide text-white/45">
                  {hirotakaHero.portraitLabel}
                </span>
                <span className="mt-3 font-[family-name:var(--font-brand-sans)] text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
                  {hirotakaHero.portraitSub}
                </span>
              </div>
            </div>
            <figcaption className="mt-4 text-center font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Third President of Kawai · 1989–2024
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * ThesisSection — the pearl statement that frames the page: "the machine and the
 * hand". A single wide column, quiet and editorial.
 * ------------------------------------------------------------------------- */

export function ThesisSection() {
  const reduce = useReducedMotion()
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-90px' },
          transition: { duration: 0.75, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section id="thesis" className="scroll-mt-24 bg-kawai-pearl py-20 text-kawai-black md:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div {...reveal(0)} className="mb-6">
            <BrandEyebrow tone="red">{hirotakaThesis.eyebrow}</BrandEyebrow>
          </motion.div>
          <motion.h2
            {...reveal(0.06)}
            className="font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.04] tracking-tight text-kawai-black"
          >
            {hirotakaThesis.lead}
          </motion.h2>
          <motion.div {...reveal(0.12)} className="mt-8 space-y-5">
            {hirotakaThesis.body.map((para, i) => (
              <p
                key={i}
                className="font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-kawai-charcoal sm:text-lg"
              >
                {para}
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * LegacyChapter — the narrative spine. A numbered index column (sticky on large
 * screens) faces a narrative column, with optional duality cards, pull-quote,
 * media placeholder and cross-link. Tone alternates pearl ↔ black for rhythm.
 * Distinct from the heritage EraSection (image-split) and the founder film.
 * ------------------------------------------------------------------------- */

const CHAPTER_TONES = {
  pearl: {
    bg: 'bg-kawai-pearl text-kawai-black',
    index: 'text-kawai-black/12',
    kicker: 'text-kawai-gold-on-light',
    heading: 'text-kawai-black',
    lead: 'text-kawai-black/85',
    body: 'text-kawai-charcoal',
    eyebrow: 'red' as const,
    quote: 'text-kawai-black',
    quoteBorder: 'border-kawai-red',
    note: 'text-kawai-black/45',
    card: 'border-kawai-black/10 bg-white',
    cardLabel: 'text-kawai-red',
    cardHead: 'text-kawai-black',
    cardBody: 'text-kawai-charcoal',
    marks: 'light' as const,
    placeholderBg: 'from-kawai-neutral/40 to-kawai-neutral/15',
    placeholderText: 'text-kawai-charcoal/40',
    caption: 'text-kawai-black/45',
    link: 'red' as const,
  },
  black: {
    bg: 'bg-kawai-black text-white',
    index: 'text-white/[0.08]',
    kicker: 'text-kawai-gold',
    heading: 'text-white',
    lead: 'text-white/85',
    body: 'text-white/72',
    eyebrow: 'gold' as const,
    quote: 'text-white',
    quoteBorder: 'border-kawai-red-400',
    note: 'text-white/45',
    card: 'border-white/12 bg-white/[0.03]',
    cardLabel: 'text-kawai-red-400',
    cardHead: 'text-white',
    cardBody: 'text-white/72',
    marks: 'dark' as const,
    placeholderBg: 'from-white/[0.06] to-white/[0.02]',
    placeholderText: 'text-white/35',
    caption: 'text-white/45',
    link: 'light' as const,
  },
} as const

export function LegacyChapter({ chapter }: { chapter: Chapter }) {
  const reduce = useReducedMotion()
  const t = CHAPTER_TONES[chapter.tone]

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-90px' },
          transition: { duration: 0.75, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section id={chapter.id} className={cn('scroll-mt-24 py-20 md:py-28', t.bg)}>
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr] lg:gap-14">
          {/* Index column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div {...reveal(0)}>
              <div
                className={cn(
                  'font-[family-name:var(--font-brand-serif)] text-[clamp(4rem,9vw,7rem)] font-light leading-none tabular-nums',
                  t.index,
                )}
              >
                {chapter.index}
              </div>
              <div
                className={cn(
                  'mt-2 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em]',
                  t.kicker,
                )}
              >
                {chapter.kicker}
              </div>
            </motion.div>
          </div>

          {/* Narrative column */}
          <div className="max-w-2xl">
            <motion.div {...reveal(0.04)}>
              <BrandEyebrow tone={t.eyebrow}>{chapter.eyebrow}</BrandEyebrow>
              <h2
                className={cn(
                  'mt-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.06] tracking-tight',
                  t.heading,
                )}
              >
                {chapter.title}
              </h2>
              <p
                className={cn(
                  'mt-5 font-[family-name:var(--font-brand-serif)] text-xl font-light italic leading-snug',
                  t.lead,
                )}
              >
                {chapter.lead}
              </p>
            </motion.div>

            <motion.div {...reveal(0.08)} className="mt-6 space-y-5">
              {chapter.body.map((para, i) => (
                <p
                  key={i}
                  className={cn(
                    'font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed sm:text-base',
                    t.body,
                  )}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {chapter.duality && (
              <div className="mt-9 grid gap-5 sm:grid-cols-2">
                {chapter.duality.map((d, i) => (
                  <motion.div
                    key={d.label}
                    {...reveal(0.1 + i * 0.06)}
                    className={cn('relative rounded-lg border p-6', t.card)}
                  >
                    <CornerMarks tone={t.marks} />
                    <span
                      className={cn(
                        'font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em]',
                        t.cardLabel,
                      )}
                    >
                      {d.label}
                    </span>
                    <h3
                      className={cn(
                        'mt-2 font-[family-name:var(--font-brand-serif)] text-lg font-medium',
                        t.cardHead,
                      )}
                    >
                      {d.heading}
                    </h3>
                    <p
                      className={cn(
                        'mt-3 font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed',
                        t.cardBody,
                      )}
                    >
                      {d.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {chapter.media && (
              <motion.figure {...reveal(0.1)} className="mt-9">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <CornerMarks tone={t.marks} />
                  {chapter.media.image ? (
                    <Image
                      src={chapter.media.image}
                      alt={chapter.media.imageAlt ?? ''}
                      fill
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover object-center"
                    />
                  ) : (
                    <div
                      className={cn(
                        'flex h-full items-center justify-center bg-gradient-to-br',
                        t.placeholderBg,
                      )}
                    >
                      <span
                        className={cn(
                          'font-[family-name:var(--font-brand-serif)] text-base font-light tracking-wide',
                          t.placeholderText,
                        )}
                      >
                        {chapter.media.label}
                      </span>
                    </div>
                  )}
                </div>
                <figcaption
                  className={cn(
                    'mt-3 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em]',
                    t.caption,
                  )}
                >
                  {chapter.media.caption}
                </figcaption>
              </motion.figure>
            )}

            {chapter.pullquote && (
              <motion.blockquote
                {...reveal(0.12)}
                className={cn(
                  'mt-9 border-l-2 pl-5 font-[family-name:var(--font-brand-serif)] text-[clamp(1.15rem,2.4vw,1.6rem)] font-light italic leading-snug',
                  t.quoteBorder,
                  t.quote,
                )}
              >
                {chapter.pullquote}
                {chapter.pullquoteNote && (
                  <span
                    className={cn(
                      'mt-3 block font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase not-italic tracking-[0.24em]',
                      t.note,
                    )}
                  >
                    {chapter.pullquoteNote}
                  </span>
                )}
              </motion.blockquote>
            )}

            {chapter.link && (
              <motion.div {...reveal(0.14)} className="mt-8">
                <BrandArrowLink href={chapter.link.href} tone={t.link}>
                  {chapter.link.label}
                </BrandArrowLink>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Render the full chapter sequence. */
export function LegacyChapters() {
  return (
    <>
      {chapters.map((chapter) => (
        <LegacyChapter key={chapter.id} chapter={chapter} />
      ))}
    </>
  )
}

/* ----------------------------------------------------------------------------
 * HonourCallout — the Grand Cross. A centred, gold-accented interlude on black,
 * distinct from the chapters. The award is rendered as its own dignified plate.
 * ------------------------------------------------------------------------- */

export function HonourCallout() {
  const reduce = useReducedMotion()
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section className="relative overflow-hidden bg-kawai-charcoal py-24 text-white md:py-28">
      <div className="container relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div {...reveal(0)} className="flex justify-center">
          <BrandEyebrow tone="gold" centered>
            {hirotakaHonour.eyebrow}
          </BrandEyebrow>
        </motion.div>

        <motion.div
          {...reveal(0.06)}
          className="relative mx-auto mt-8 max-w-xl rounded-lg border border-kawai-gold/25 px-8 py-10"
        >
          <CornerMarks tone="dark" />
          <div className="font-[family-name:var(--font-brand-serif)] text-6xl font-light leading-none text-kawai-gold">
            {hirotakaHonour.year}
          </div>
          <h2 className="mt-5 font-[family-name:var(--font-brand-serif)] text-[clamp(1.5rem,3.2vw,2.15rem)] font-light leading-snug text-white">
            {hirotakaHonour.award}
          </h2>
        </motion.div>

        <motion.div {...reveal(0.12)} className="mt-9 space-y-5 text-left sm:text-center">
          {hirotakaHonour.body.map((para, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/75"
            >
              {para}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * EraTimeline — a compact vertical timeline of his tenure. Item titles are h3;
 * the section heading is provided by the wrapping Section (h2) in page.tsx.
 * ------------------------------------------------------------------------- */

export function EraTimeline() {
  const reduce = useReducedMotion()
  return (
    <ol className="relative mt-10 border-l border-kawai-black/12 pl-8">
      {milestones.map((m, i) => (
        <motion.li
          key={m.year}
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-60px' },
                transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: Math.min(i * 0.04, 0.3) },
              })}
          className="relative pb-9 last:pb-0"
        >
          <span
            aria-hidden
            className="absolute -left-[calc(2rem+1px)] top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-kawai-red ring-4 ring-kawai-pearl"
          />
          <div className="font-[family-name:var(--font-brand-serif)] text-2xl font-light tabular-nums text-kawai-red">
            {m.year}
          </div>
          <h3 className="mt-1 font-[family-name:var(--font-brand-serif)] text-lg font-medium text-kawai-black">
            {m.title}
          </h3>
          <p className="mt-2 max-w-xl font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed text-kawai-charcoal">
            {m.description}
          </p>
        </motion.li>
      ))}
    </ol>
  )
}

/* ----------------------------------------------------------------------------
 * SuccessionSection — the fourth generation. Dignified close to the narrative
 * before the CTA, with links to predecessor and successor.
 * ------------------------------------------------------------------------- */

export function SuccessionSection() {
  const reduce = useReducedMotion()
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-80px' },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section className="bg-white py-20 text-kawai-black md:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <motion.div {...reveal(0)} className="mb-6">
          <BrandEyebrow tone="red">{hirotakaSuccession.eyebrow}</BrandEyebrow>
        </motion.div>
        <motion.h2
          {...reveal(0.06)}
          className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.06] tracking-tight text-kawai-black"
        >
          {hirotakaSuccession.title}
        </motion.h2>
        <motion.p
          {...reveal(0.12)}
          className="mt-6 font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-kawai-charcoal sm:text-lg"
        >
          {hirotakaSuccession.body}
        </motion.p>
        <motion.div
          {...reveal(0.18)}
          className="mt-9 flex flex-col gap-x-10 gap-y-4 sm:flex-row sm:flex-wrap"
        >
          <BrandArrowLink href={hirotakaSuccession.successorHref} tone="red">
            {hirotakaSuccession.successorLabel}
          </BrandArrowLink>
          <BrandArrowLink href={hirotakaSuccession.predecessorHref} tone="red">
            {hirotakaSuccession.predecessorLabel}
          </BrandArrowLink>
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * ClosingCTA — dark, centred, gold eyebrow. Sends readers to the instruments.
 * ------------------------------------------------------------------------- */

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-kawai-black py-24 text-white md:py-28">
      <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <div className="mb-5 flex justify-center">
          <BrandEyebrow tone="gold" centered>
            {hirotakaClose.eyebrow}
          </BrandEyebrow>
        </div>
        <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-white">
          {hirotakaClose.title}
        </h2>
        <p className="mx-auto mb-10 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/72">
          {hirotakaClose.body}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <BrandCTA href="/pianos" variant="red">
            Explore the pianos
          </BrandCTA>
          <BrandCTA href="/find-a-dealer" variant="outline">
            Find a dealer
          </BrandCTA>
        </div>
        <div className="mt-10">
          <BrandArrowLink href="/about/heritage" tone="muted">
            Back to Heritage
          </BrandArrowLink>
        </div>
      </div>
    </section>
  )
}
