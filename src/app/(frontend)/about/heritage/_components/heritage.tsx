'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BrandEyebrow, BrandCTA, BrandArrowLink } from '@/components/brand'
import { EASE_OUT_EXPO } from '@/components/brand/motion'
import { heritageHero, eras, generations, type Era, type Generation } from '../_data'

/* ----------------------------------------------------------------------------
 * HeritageRail — a fixed archive index that tracks the active era as the reader
 * travels down the page. The timeline-driven signature of the page.
 * ------------------------------------------------------------------------- */

export function HeritageRail() {
  const items = eras.map((e) => ({ id: e.id, years: e.years }))
  const [active, setActive] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    items.forEach((it) => {
      const el = document.getElementById(it.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <nav
      aria-label="Heritage timeline"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-8"
    >
      <ul className="flex flex-col gap-5">
        {items.map((it) => {
          const on = active === it.id
          return (
            <li key={it.id}>
              <a href={`#${it.id}`} className="group flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    'block h-px transition-all duration-300',
                    on ? 'w-9 bg-kawai-red' : 'w-4 bg-kawai-black/25 group-hover:w-6',
                  )}
                />
                <span
                  className={cn(
                    'font-[family-name:var(--font-brand-serif)] text-sm tabular-nums transition-colors duration-300',
                    on ? 'text-kawai-red' : 'text-kawai-black/40 group-hover:text-kawai-black/70',
                  )}
                >
                  {it.years}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ----------------------------------------------------------------------------
 * HeritageHero — an editorial, pearl-toned title spread. Distinct from the dark
 * cinematic founder film: a magazine-cover split of serif headline and a framed
 * archival image. No text sits over the image, so no scrim is required.
 * ------------------------------------------------------------------------- */

export function HeritageHero() {
  const reduce = useReducedMotion()

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section className="relative overflow-hidden bg-kawai-pearl text-kawai-black">
      {/* faint archival watermark year */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-[family-name:var(--font-brand-serif)] text-[38vw] font-light leading-none text-kawai-black/[0.03] lg:text-[26vw]"
      >
        1927
      </span>

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <motion.div {...enter(0)} className="mb-6">
              <BrandEyebrow tone="red">{heritageHero.eyebrow}</BrandEyebrow>
            </motion.div>

            <motion.h1
              {...enter(0.08)}
              className="font-[family-name:var(--font-brand-serif)] text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[1.0] tracking-tight text-kawai-black"
            >
              {heritageHero.title}
            </motion.h1>

            <motion.p
              {...enter(0.14)}
              className="mt-5 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.28em] text-kawai-gold-on-light"
            >
              {heritageHero.kicker}
            </motion.p>

            <motion.p
              {...enter(0.2)}
              className="mt-7 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-kawai-charcoal sm:text-lg"
            >
              {heritageHero.lead}
            </motion.p>

            <motion.div {...enter(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <BrandCTA href="#origins" variant="red" showArrow={false}>
                Begin the story
              </BrandCTA>
              <BrandCTA href="/about/heritage/koichi-kawai" variant="dark-outline">
                Meet the founder
              </BrandCTA>
            </motion.div>
          </div>

          <motion.figure
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.98 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 1, ease: EASE_OUT_EXPO, delay: 0.15 },
                })}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_30px_80px_rgba(30,27,22,0.22)] ring-1 ring-kawai-black/10">
              <Image
                src={heritageHero.image}
                alt={heritageHero.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
            <figcaption className="mt-4 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-kawai-black/45">
              Kawai · Hamamatsu, Japan
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * EraSection — an editorial era chapter: framed image on one side, narrative on
 * the other, with optional pull-quote and SEO-tuned Q&A asides. Tone alternates
 * pearl ↔ black down the page for rhythm.
 * ------------------------------------------------------------------------- */

const ERA_TONES = {
  pearl: {
    bg: 'bg-kawai-pearl text-kawai-black',
    heading: 'text-kawai-black',
    lead: 'text-kawai-black/85',
    body: 'text-kawai-charcoal',
    eyebrow: 'red' as const,
    quote: 'text-kawai-black',
    quoteBorder: 'border-kawai-red',
    asideHead: 'text-kawai-black',
    asideBody: 'text-kawai-charcoal',
    asideBorder: 'border-kawai-black/10',
    caption: 'text-kawai-black/45',
    ring: 'ring-kawai-black/10',
  },
  white: {
    bg: 'bg-white text-kawai-black',
    heading: 'text-kawai-black',
    lead: 'text-kawai-black/85',
    body: 'text-kawai-charcoal',
    eyebrow: 'red' as const,
    quote: 'text-kawai-black',
    quoteBorder: 'border-kawai-red',
    asideHead: 'text-kawai-black',
    asideBody: 'text-kawai-charcoal',
    asideBorder: 'border-kawai-black/10',
    caption: 'text-kawai-black/45',
    ring: 'ring-kawai-black/10',
  },
  black: {
    bg: 'bg-kawai-black text-white',
    heading: 'text-white',
    lead: 'text-white/85',
    body: 'text-white/72',
    eyebrow: 'gold' as const,
    quote: 'text-white',
    // kawai-red-400 (not kawai-red) for AA contrast on dark backgrounds
    quoteBorder: 'border-kawai-red-400',
    asideHead: 'text-white',
    asideBody: 'text-white/72',
    asideBorder: 'border-white/12',
    caption: 'text-white/45',
    ring: 'ring-white/12',
  },
} as const

export function EraSection({ era }: { era: Era }) {
  const reduce = useReducedMotion()
  const t = ERA_TONES[era.tone]
  const imageLeft = era.imageSide === 'left'

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
    <section id={era.id} className={cn('scroll-mt-24 py-20 md:py-28', t.bg)}>
      <div className="container mx-auto px-6">
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
          )}
        >
          {/* Image column */}
          <motion.figure
            {...reveal(0.05)}
            className={cn('relative', imageLeft ? 'lg:order-1' : 'lg:order-2')}
          >
            <div className={cn('relative aspect-[5/4] overflow-hidden rounded-lg shadow-xl ring-1', t.ring)}>
              <Image
                src={era.image}
                alt={era.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            <figcaption className={cn('mt-3 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em]', t.caption)}>
              {era.years}
            </figcaption>
          </motion.figure>

          {/* Copy column */}
          <div className={cn('max-w-xl', imageLeft ? 'lg:order-2' : 'lg:order-1')}>
            <motion.div {...reveal(0)}>
              <BrandEyebrow tone={t.eyebrow}>{era.eyebrow}</BrandEyebrow>

              <h2 className={cn('mt-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.06] tracking-tight', t.heading)}>
                {era.title}
              </h2>

              <p className={cn('mt-5 font-[family-name:var(--font-brand-serif)] text-xl font-light italic leading-snug', t.lead)}>
                {era.lead}
              </p>
            </motion.div>

            <motion.div {...reveal(0.08)} className="mt-6 space-y-5">
              {era.body.map((para, i) => (
                <p
                  key={i}
                  className={cn('font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed sm:text-base', t.body)}
                >
                  {para}
                </p>
              ))}
            </motion.div>

            {era.pullquote && (
              <motion.blockquote
                {...reveal(0.12)}
                className={cn('mt-9 border-l-2 pl-5 font-[family-name:var(--font-brand-serif)] text-[clamp(1.15rem,2.4vw,1.6rem)] font-light italic leading-snug', t.quoteBorder, t.quote)}
              >
                {era.pullquote}
              </motion.blockquote>
            )}

            {era.asides && era.asides.length > 0 && (
              <div className="mt-10 space-y-6">
                {era.asides.map((aside) => (
                  <motion.div
                    key={aside.question}
                    {...reveal(0.06)}
                    className={cn('rounded-lg border p-6', t.asideBorder)}
                  >
                    <h3 className={cn('font-[family-name:var(--font-brand-serif)] text-lg font-medium', t.asideHead)}>
                      {aside.question}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {aside.answer.map((para, i) => (
                        <p
                          key={i}
                          className={cn('font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed', t.asideBody)}
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {era.id === 'origins' && (
              <motion.div {...reveal(0.1)} className="mt-8">
                <BrandArrowLink href="/about/heritage/koichi-kawai" tone="red">
                  The full story of the founder
                </BrandArrowLink>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * GenerationTrio — three cards for the three generations. Names render as
 * styled text (NOT headings) so screen-reader heading navigation stays clean.
 * ------------------------------------------------------------------------- */

export function GenerationTrio() {
  const reduce = useReducedMotion()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {generations.map((g: Generation, i) => (
        <motion.article
          key={g.name}
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 26 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-70px' },
                transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: i * 0.08 },
              })}
          className="flex flex-col rounded-lg border border-kawai-black/10 bg-white p-7"
        >
          <span className="font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-kawai-red">
            {g.ordinal}
          </span>
          {/* Name is intentionally a <div>, not a heading (card item, not a section). */}
          <div className="mt-2 font-[family-name:var(--font-brand-serif)] text-2xl font-light text-kawai-black">
            {g.name}
          </div>
          <span className="mt-1 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.2em] text-kawai-black/45">
            {g.tenure}
          </span>
          <p className="mt-4 font-[family-name:var(--font-brand-serif)] text-base font-light italic text-kawai-gold-on-light">
            {g.theme}
          </p>
          <p className="mt-3 font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed text-kawai-charcoal">
            {g.blurb}
          </p>
          {g.href && (
            <div className="mt-auto pt-6">
              <BrandArrowLink href={g.href} tone="red">
                {`Read ${g.name}’s story`}
              </BrandArrowLink>
            </div>
          )}
        </motion.article>
      ))}
    </div>
  )
}
