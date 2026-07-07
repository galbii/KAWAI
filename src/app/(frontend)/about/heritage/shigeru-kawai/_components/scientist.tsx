'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BrandEyebrow, BrandCTA, BrandArrowLink } from '@/components/brand'
import { EASE_OUT_EXPO } from '@/components/brand/motion'
import {
  hero,
  portrait,
  paradox,
  closing,
  type Milestone,
  type ParadoxPanel,
  type CrossLink,
} from '../_data'

/* ----------------------------------------------------------------------------
 * BlueprintGrid — a faint measured grid + corner ticks. The page's signature
 * motif: engineering-drawing restraint on a dark ground. Purely decorative.
 * ------------------------------------------------------------------------- */

function BlueprintGrid({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="sk-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sk-grid)" />
    </svg>
  )
}

/** Small corner tick marks — the technical-drawing frame accent. */
function CornerTicks({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const color = tone === 'light' ? 'border-white/30' : 'border-kawai-black/25'
  const base = 'pointer-events-none absolute h-3.5 w-3.5'
  return (
    <span aria-hidden>
      <span className={cn(base, 'left-0 top-0 border-l border-t', color)} />
      <span className={cn(base, 'right-0 top-0 border-r border-t', color)} />
      <span className={cn(base, 'bottom-0 left-0 border-b border-l', color)} />
      <span className={cn(base, 'bottom-0 right-0 border-b border-r', color)} />
    </span>
  )
}

/* ----------------------------------------------------------------------------
 * PortraitPlate — a quiet, labelled placeholder framed like a technical plate.
 * No portrait of Shigeru the man exists; a Kawai-supplied image drops in here.
 * ------------------------------------------------------------------------- */

export function PortraitPlate() {
  const reduce = useReducedMotion()
  return (
    <motion.figure
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.25 },
          })}
      className="relative mx-auto w-full max-w-sm"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/12 bg-gradient-to-br from-white/[0.04] to-transparent p-3">
        <div className="relative flex h-full w-full items-center justify-center rounded-sm border border-dashed border-white/15">
          <CornerTicks tone="light" />
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-10 w-10 text-white/25"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.25}
            >
              <circle cx="12" cy="9" r="3.25" />
              <path strokeLinecap="round" d="M5.5 19a6.5 6.5 0 0 1 13 0" />
            </svg>
            <span className="font-[family-name:var(--font-brand-serif)] text-base font-light tracking-wide text-white/45">
              {portrait.label}
            </span>
            <span className="font-[family-name:var(--font-brand-sans)] text-[10px] font-medium uppercase tracking-[0.24em] text-white/30">
              {portrait.note}
            </span>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-between font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-kawai-gold/80">
        <span>{portrait.caption}</span>
        <span aria-hidden className="tabular-nums text-white/35">
          Fig. 01
        </span>
      </figcaption>
    </motion.figure>
  )
}

/* ----------------------------------------------------------------------------
 * ScientistHero — the single <h1>. An editorial split: title block + portrait
 * plate, over a faint blueprint grid and a left measurement rule.
 * ------------------------------------------------------------------------- */

export function ScientistHero() {
  const reduce = useReducedMotion()
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section className="relative overflow-hidden bg-kawai-black text-white">
      <BlueprintGrid className="text-white/[0.05]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-kawai-black/40 via-transparent to-kawai-black"
      />

      <div className="container relative z-10 mx-auto px-6 pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          {/* Title block */}
          <div>
            <motion.div {...enter(0)} className="mb-7">
              <BrandEyebrow tone="gold">{hero.eyebrow}</BrandEyebrow>
            </motion.div>

            <motion.h1
              {...enter(0.08)}
              className="font-[family-name:var(--font-brand-serif)] text-[clamp(3rem,8vw,6rem)] font-light leading-[0.96] tracking-tight text-white"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              {...enter(0.16)}
              className="mt-5 font-[family-name:var(--font-brand-serif)] text-[clamp(1.15rem,2.6vw,1.7rem)] font-light italic text-kawai-gold/90"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              {...enter(0.24)}
              className="mt-7 flex items-center gap-4 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.26em] text-white/55"
            >
              <span aria-hidden className="block h-px w-8 bg-kawai-red-400/70" />
              <span className="tabular-nums">{hero.tenure}</span>
            </motion.div>

            <motion.p
              {...enter(0.32)}
              className="mt-8 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/75 sm:text-lg"
            >
              {hero.lede}
            </motion.p>
          </div>

          {/* Portrait plate */}
          <PortraitPlate />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * PullQuote — a verified line in his own words, set as a measured epigraph.
 * ------------------------------------------------------------------------- */

export function PullQuote({
  quote,
  tone = 'dark',
  className,
}: {
  quote: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  const reduce = useReducedMotion()
  const dark = tone === 'dark'
  return (
    <motion.blockquote
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 22 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-80px' },
            transition: { duration: 0.8, ease: EASE_OUT_EXPO },
          })}
      className={cn('relative mx-auto max-w-3xl pl-6', className)}
    >
      <span
        aria-hidden
        className={cn(
          'absolute left-0 top-1 block h-[calc(100%-0.5rem)] w-px',
          dark ? 'bg-kawai-gold/60' : 'bg-kawai-gold-on-light/60',
        )}
      />
      <p
        className={cn(
          'font-[family-name:var(--font-brand-serif)] text-[clamp(1.5rem,3.4vw,2.4rem)] font-light italic leading-[1.32]',
          dark ? 'text-white' : 'text-kawai-black',
        )}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <footer
        className={cn(
          'mt-5 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.26em]',
          dark ? 'text-kawai-gold/80' : 'text-kawai-gold-on-light',
        )}
      >
        Shigeru Kawai
      </footer>
    </motion.blockquote>
  )
}

/* ----------------------------------------------------------------------------
 * ParadoxSplit — the thesis, rendered as two panels held apart by a rule.
 * ------------------------------------------------------------------------- */

export function ParadoxSplit() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-kawai-black py-20 text-white md:py-28">
      <BlueprintGrid className="text-white/[0.04]" />
      <div className="container relative z-10 mx-auto px-6">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <BrandEyebrow tone="gold" centered>
              {paradox.eyebrow}
            </BrandEyebrow>
          </div>
          <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.06] tracking-tight text-white">
            {paradox.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/72 sm:text-lg">
            {paradox.intro}
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-px overflow-hidden rounded-sm border border-white/12 bg-white/12 md:grid-cols-2">
          {paradox.panels.map((panel: ParadoxPanel, i) => (
            <Reveal key={panel.kicker} delay={i * 0.1} className="bg-kawai-black">
              <div className="relative flex h-full flex-col p-8 md:p-10">
                <CornerTicks tone="light" />
                <span className="font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.28em] text-kawai-gold/85">
                  {panel.kicker}
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-brand-serif)] text-2xl font-light leading-snug text-white md:text-3xl">
                  {panel.heading}
                </h3>
                <p className="mt-5 font-[family-name:var(--font-brand-serif)] text-lg font-light italic leading-snug text-kawai-gold/90">
                  &ldquo;{panel.quote}&rdquo;
                </p>
                <p className="mt-5 font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed text-white/75">
                  {panel.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * BlueprintFigure — an atmosphere image framed as a measured plate (never a
 * portrait). Scrim + caption bar keep any overlaid text legible.
 * ------------------------------------------------------------------------- */

export function BlueprintFigure({
  image,
  alt,
  label,
  figNumber,
  tone = 'dark',
  priority = false,
}: {
  image: string
  alt: string
  label: string
  figNumber: string
  tone?: 'dark' | 'light'
  priority?: boolean
}) {
  const reduce = useReducedMotion()
  const dark = tone === 'dark'
  return (
    <motion.figure
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-60px' },
            transition: { duration: 0.85, ease: EASE_OUT_EXPO },
          })}
      className={cn(
        'relative overflow-hidden rounded-sm border p-2',
        dark ? 'border-white/12 bg-white/[0.03]' : 'border-kawai-black/12 bg-kawai-black/[0.02]',
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 560px"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <CornerTicks tone="light" />
      </div>
      <figcaption
        className={cn(
          'flex items-center justify-between px-1 pt-2.5 font-[family-name:var(--font-brand-sans)] text-[10px] font-semibold uppercase tracking-[0.24em]',
          dark ? 'text-white/55' : 'text-kawai-charcoal/70',
        )}
      >
        <span>{label}</span>
        <span aria-hidden className="tabular-nums">
          {figNumber}
        </span>
      </figcaption>
    </motion.figure>
  )
}

/* ----------------------------------------------------------------------------
 * MilestoneLedger — the modernizer in dates. A precise, tabular timeline.
 * Milestone names are NOT headings (they render as text under the section h2).
 * ------------------------------------------------------------------------- */

export function MilestoneLedger({ milestones }: { milestones: readonly Milestone[] }) {
  return (
    <ol className="mt-4 border-t border-kawai-black/12">
      {milestones.map((m: Milestone, i) => (
        <Reveal key={m.year + m.title} delay={Math.min(i * 0.05, 0.3)}>
          <li className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-b border-kawai-black/12 py-6 md:grid-cols-[8rem_1fr] md:gap-x-10 md:py-7">
            <span className="font-[family-name:var(--font-brand-serif)] text-2xl font-light tabular-nums leading-none text-kawai-red md:text-3xl">
              {m.year}
            </span>
            <div>
              <span className="font-[family-name:var(--font-brand-sans)] text-[13px] font-semibold uppercase tracking-[0.16em] text-kawai-black">
                {m.title}
              </span>
              <p className="mt-2 font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed text-kawai-charcoal">
                {m.body}
              </p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}

/* ----------------------------------------------------------------------------
 * ClosingCoda — thesis restated, cross-links, and the CTAs.
 * ------------------------------------------------------------------------- */

export function ClosingCoda() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-kawai-black py-24 text-white md:py-28">
      <BlueprintGrid className="text-white/[0.04]" />
      <Reveal className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <div className="mb-5">
          <BrandEyebrow tone="gold" centered>
            {closing.eyebrow}
          </BrandEyebrow>
        </div>
        <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-white">
          {closing.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/75">
          {closing.body}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <BrandCTA href="/pianos" variant="red">
            Explore the Pianos
          </BrandCTA>
          <BrandCTA href="/find-a-dealer" variant="outline">
            Find a Dealer
          </BrandCTA>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-9">
          {closing.links.map((link: CrossLink) => (
            <BrandArrowLink key={link.href} href={link.href} tone="muted">
              {link.label}
            </BrandArrowLink>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * Local Reveal re-export wrapper — used inside client sections above so we keep
 * one motion vocabulary. Mirrors the shared brand Reveal, guarded for reduced
 * motion, but usable inside these client components without prop drilling.
 * ------------------------------------------------------------------------- */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  )
}
