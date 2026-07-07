'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import YouTubeEmbed from '@/components/ui/youtube-embed'
import { cn } from '@/lib/utils'
import { BrandEyebrow, BrandCTA } from '@/components/brand'
import { EASE_OUT_EXPO } from '@/components/brand/motion'
import {
  chapters,
  scoreCopy,
  filmCopy,
  storyImages,
  SPIRITOSO_VIDEO_ID,
  type Chapter,
} from './spiritoso-data'

/* ----------------------------------------------------------------------------
 * Hero — the title card. Koichi's portrait, a slow push-in, the film's name.
 * ------------------------------------------------------------------------- */

export function StoryHero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-kawai-black text-white"
    >
      <motion.div className="absolute inset-0" {...(reduce ? {} : { style: { y: imgY } })}>
        <Image
          src={storyImages.koichi}
          alt="Koichi Kawai"
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-[center_25%]"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
      <div aria-hidden className="absolute inset-0 bg-black/25" />

      <motion.div
        className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center"
        {...(reduce ? {} : { style: { opacity: fade } })}
      >
        <motion.div {...enter(0)} className="mb-7">
          <BrandEyebrow tone="gold" centered>
            Spiritoso · An Animated Story
          </BrandEyebrow>
        </motion.div>

        <motion.h1
          {...enter(0.1)}
          className="font-[family-name:var(--font-brand-serif)] text-[clamp(3rem,10vw,7.5rem)] font-light leading-[0.95] tracking-tight text-white"
        >
          Koichi Kawai
        </motion.h1>

        <motion.p
          {...enter(0.18)}
          className="mt-5 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.28em] text-kawai-gold"
        >
          Founder of Kawai · 1886–1955
        </motion.p>

        <motion.p
          {...enter(0.26)}
          className="mt-6 max-w-xl font-[family-name:var(--font-brand-serif)] text-[clamp(1.05rem,2.4vw,1.5rem)] font-light italic leading-snug text-kawai-gold/85"
        >
          The Animated Origins of a Legacy in Piano Craftsmanship
        </motion.p>

        <motion.p
          {...enter(0.32)}
          className="mt-7 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/75"
        >
          For nearly a century, Kawai has stood at the forefront of piano craftsmanship — blending
          traditional artisan skill with pioneering innovation. But every great enterprise begins
          with a single spark of inspiration.
        </motion.p>

        {!reduce && (
          <motion.div
            {...enter(0.5)}
            className="mt-12 flex flex-col items-center gap-2 text-white/50"
            aria-hidden
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Begin the story</span>
            <motion.span
              className="block h-8 w-px bg-gradient-to-b from-kawai-gold to-transparent"
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top' }}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * ChapterRail — the signature. A fixed timeline of years that tracks the
 * active chapter as the reader travels through Koichi's life.
 * ------------------------------------------------------------------------- */

export function ChapterRail() {
  const items = chapters.map((c) => ({ id: c.id, year: c.year }))
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
      aria-label="Story chapters"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-8"
    >
      <ul className="flex flex-col items-end gap-5">
        {items.map((it) => {
          const on = active === it.id
          return (
            <li key={it.id}>
              <a href={`#${it.id}`} className="group flex items-center justify-end gap-3">
                <span
                  className={cn(
                    'font-[family-name:var(--font-brand-serif)] text-sm tabular-nums transition-all duration-300',
                    on ? 'text-kawai-red' : 'text-white/35 group-hover:text-white/70',
                  )}
                >
                  {it.year}
                </span>
                <span
                  className={cn(
                    'block h-px transition-all duration-300',
                    on ? 'w-9 bg-kawai-red' : 'w-4 bg-white/30 group-hover:w-6',
                  )}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ----------------------------------------------------------------------------
 * StoryChapter — a full-bleed cinematic scene with a parallax image, a giant
 * watermark year, and the chapter narrative.
 * ------------------------------------------------------------------------- */

export function StoryChapter({ chapter, index }: { chapter: Chapter; index: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '12%'])

  const left = chapter.align === 'left'
  const num = String(index + 1).padStart(2, '0')

  return (
    <section
      id={chapter.id}
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-kawai-black py-28 text-white"
    >
      <motion.div className="absolute inset-0" {...(reduce ? {} : { style: { y: imgY } })}>
        <Image
          src={chapter.image}
          alt={chapter.imageAlt}
          fill
          sizes="100vw"
          className="scale-[1.15] object-cover object-center"
        />
      </motion.div>

      {/* Directional scrim keeps copy legible on its side; bottom vignette grounds it. */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0',
          left
            ? 'bg-gradient-to-r from-black/95 via-black/45 to-transparent'
            : 'bg-gradient-to-l from-black/95 via-black/45 to-transparent',
        )}
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

      {/* Giant watermark year */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-[6%] z-[1] font-[family-name:var(--font-brand-serif)] font-light leading-none text-white/15 text-[34vw] md:text-[22vw]',
          left ? 'right-[3%]' : 'left-[3%]',
        )}
      >
        {chapter.year}
      </span>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 36 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className={cn('max-w-xl', left ? 'mr-auto' : 'ml-auto')}
        >
          <BrandEyebrow tone="gold">{`Chapter ${num} · ${chapter.year}`}</BrandEyebrow>

          <h2 className="mt-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5.5vw,4rem)] font-light leading-[1.04] tracking-tight text-white">
            {chapter.name}
          </h2>
          <p className="mt-3 font-[family-name:var(--font-brand-serif)] text-xl font-light italic text-kawai-gold/90">
            {chapter.subtitle}
          </p>

          <div className="mt-7 space-y-5">
            {chapter.body.map((para, i) => (
              <p
                key={i}
                className="font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed text-white/80 sm:text-base"
              >
                {para}
              </p>
            ))}
          </div>

          {chapter.place && (
            <p className="mt-8 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              {chapter.place}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * EchigoMotif — a hand-drawn melodic phrase that draws itself in on view.
 * The unifying musical theme of the film, made visible.
 * ------------------------------------------------------------------------- */

function EchigoMotif() {
  const reduce = useReducedMotion()
  return (
    <svg
      viewBox="0 0 520 80"
      fill="none"
      className="h-16 w-full max-w-lg text-kawai-gold"
      aria-hidden
    >
      {/* staff line */}
      <line x1="0" y1="50" x2="520" y2="50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
      {/* melodic contour */}
      <motion.path
        d="M0 50 C 40 50, 55 24, 90 24 S 150 56, 185 40 S 250 12, 290 30 S 360 60, 400 38 S 470 18, 520 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={reduce ? {} : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      {[
        [90, 24],
        [185, 40],
        [290, 30],
        [400, 38],
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="4.5"
          fill="currentColor"
          initial={reduce ? false : { opacity: 0, scale: 0 }}
          whileInView={reduce ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.35, ease: EASE_OUT_EXPO }}
        />
      ))}
    </svg>
  )
}

/* ----------------------------------------------------------------------------
 * ScoreMovement — the hushed emotional climax: the Echigo Jishi melody.
 * ------------------------------------------------------------------------- */

export function ScoreMovement() {
  return (
    <section className="relative overflow-hidden bg-kawai-black py-28 text-white md:py-36">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="flex flex-col items-center"
        >
          <div className="mb-6">
            <BrandEyebrow tone="gold" centered>
              {scoreCopy.eyebrow}
            </BrandEyebrow>
          </div>
          <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.08] tracking-tight text-white">
            {scoreCopy.title}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-brand-serif)] text-lg font-light italic text-kawai-gold/90">
            {scoreCopy.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="my-12 flex justify-center"
        >
          <EchigoMotif />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="mx-auto max-w-2xl font-[family-name:var(--font-brand-serif)] text-[clamp(1.4rem,3vw,2.1rem)] font-light italic leading-[1.4] text-white"
        >
          {scoreCopy.quote}
        </motion.blockquote>

        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-left">
          {scoreCopy.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              className="font-[family-name:var(--font-brand-sans)] text-[15px] leading-relaxed text-white/72 sm:text-base"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------
 * SpiritosoFilm — the payoff: the animated short, or a cinematic poster until
 * the video is published.
 * ------------------------------------------------------------------------- */

export function SpiritosoFilm() {
  return (
    <section className="relative overflow-hidden bg-kawai-black py-24 md:py-28">
      <Image
        src={storyImages.luxeRoom}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div aria-hidden className="absolute inset-0 bg-kawai-black/55" />

      <div className="container relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="flex flex-col items-center"
        >
          <div className="mb-6">
            <BrandEyebrow tone="gold" centered>
              {filmCopy.eyebrow}
            </BrandEyebrow>
          </div>
          <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-white">
            {filmCopy.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/75">
            {filmCopy.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="mt-12 overflow-hidden rounded-xl ring-1 ring-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        >
          {SPIRITOSO_VIDEO_ID ? (
            <YouTubeEmbed videoId={SPIRITOSO_VIDEO_ID} title="Spiritoso — The Story of Koichi Kawai" />
          ) : (
            <FilmPoster />
          )}
        </motion.div>
      </div>
    </section>
  )
}

function FilmPoster() {
  return (
    <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-kawai-charcoal to-kawai-black">
      <Image
        src={storyImages.koichi}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="object-cover object-[center_25%] opacity-40"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-kawai-red/90 shadow-[0_8px_32px_rgba(225,25,34,0.5)]">
          <svg className="ml-1 h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="mt-5 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          Film Coming Soon
        </span>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * Coda — the close.
 * ------------------------------------------------------------------------- */

export function StoryCoda() {
  return (
    <section className="bg-kawai-black py-24 text-center text-white md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className="container mx-auto flex max-w-3xl flex-col items-center px-6"
      >
        <div className="mb-5">
          <BrandEyebrow tone="gold" centered>
            A Legacy That Endures
          </BrandEyebrow>
        </div>
        <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-white">
          Koichi&apos;s spirit, in every piano we build
        </h2>
        <p className="mx-auto mb-10 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/72">
          His son Shigeru, grandson Hirotaka, and great-grandson Kentaro have each carried the
          founding vision forward — and today Kawai is one of the most celebrated piano makers in the
          world.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <BrandCTA href="/company/our-philosophy" variant="red">
            Our Philosophy
          </BrandCTA>
          <BrandCTA href="/pianos" variant="outline">
            Explore Pianos
          </BrandCTA>
        </div>
      </motion.div>
    </section>
  )
}
