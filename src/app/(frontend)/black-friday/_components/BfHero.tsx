'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { PromoHeroOffer } from '@/components/fall-promo'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import { scrollToPromoSection } from '@/lib/fall-promo/scroll'

/**
 * The Black Friday hero (kawai-black-friday-redesign v3, Nov 15 2026).
 *
 * Chance on v2: "just too boring". The v2 hero was the fall `PromoHeroCarousel`
 * in a darker coat: a dark photograph under a dark wash, so the first screen
 * read as an empty black box. This is the same hero rebuilt for Black Friday:
 * the photograph gets its own full-height panel instead of hiding behind the
 * copy, the headline is set big and bold, and the offer index becomes three
 * tiles that read as offers rather than as navigation.
 *
 * What it keeps, deliberately, from `PromoHeroCarousel`:
 *  - Every word, in the same order and the same elements (h1, p, span,
 *    button), so the page's rendered text is byte-identical to v2. The
 *    breakpoint visibility of "See the offer" (hidden under `sm`) is kept too,
 *    because a text diff reads what is displayed.
 *  - The behaviour: one frame per offer after the key art, the lit tile
 *    follows the frame, pointing at a tile holds its frame, choosing it jumps
 *    to the section, a pause control while autoplay runs (WCAG 2.2.2), and no
 *    autoplay, no fades and no push under `prefers-reduced-motion`.
 *
 * Decoration (the red bar over the headline, the tile numerals) is drawn by
 * `SaleStyles` with CSS, never as text, so it adds nothing a reader or a text
 * diff would see.
 */

/** How long a frame holds before the next one. Same as the fall hero. */
const HOLD_MS = 6500

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const COPY: Variants = {
  hide: {},
  show: { transition: { delayChildren: 0.15, staggerChildren: 0.12 } },
}

const LINE: Variants = {
  hide: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
}

const TITLE: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const WORD: Variants = {
  hide: { opacity: 0, y: '0.35em' },
  show: { opacity: 1, y: '0em', transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
}

/**
 * Reduced motion: every element lands visible, at once.
 *
 * Not `{ hide: {}, show: {} }` (the fall hero's version). The reduced-motion
 * flag is only known after mount, so the first render has already applied
 * the moving variants' `hide` (opacity 0); an empty `show` then never brings
 * the words back, and under reduced motion the headline, line and button stay
 * invisible. An explicit visible `show` with no duration fixes that.
 */
const STILL: Variants = {
  hide: {},
  show: { opacity: 1, y: 0, transition: { duration: 0 } },
}

export function BfHero({
  title,
  titleMark,
  body,
  ending,
  cta,
  keyArt,
  offers,
}: {
  /** The headline words, rendered as the page's h1. */
  title: string
  /** The Kawai logotype as the headline's last word; its `alt` is the word. */
  titleMark?: React.ReactNode
  body?: string
  ending?: string
  cta?: React.ReactNode
  keyArt: { image: string; imageAlt: string; imagePosition?: string }
  offers: readonly PromoHeroOffer[]
}) {
  const prefersReduced = useReducedMotion()
  // The reduced-motion value comes from a media query the server cannot see;
  // waiting for mount keeps the first client render identical to the server's.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduce = mounted && prefersReduced === true

  const frames = [keyArt, ...offers]
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [held, setHeld] = useState(false)
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]))

  const autoplay = mounted && playing && !held && !reduce && frames.length > 1

  const show = useCallback((i: number) => {
    setFrame(i)
    setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
  }, [])

  useEffect(() => {
    if (!autoplay) return
    const t = setTimeout(() => show((frame + 1) % frames.length), HOLD_MS)
    return () => clearTimeout(t)
  }, [autoplay, frame, frames.length, show])

  const next = (frame + 1) % frames.length
  const mountedFrames = new Set([...seen, next])
  const activeOffer = frame - 1 // -1 while the key art is up
  const words = title.split(' ')

  return (
    <section aria-labelledby="promo-hero-title" className="bf-hero relative flex w-full flex-col">
      <div className="bf-hero-stage relative isolate grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
        {/* ── The photograph: a band on phones, a full-height panel from lg ── */}
        <div className="bf-hero-photo relative h-[14rem] overflow-hidden sm:h-[24rem] lg:col-start-2 lg:row-start-1 lg:h-auto lg:min-h-[min(44rem,calc(100svh-9rem))]">
          {frames.map((f, i) =>
            mountedFrames.has(i) ? (
              <motion.div
                key={f.image}
                aria-hidden={i !== frame}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: i === frame ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.9, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: !reduce && i === frame ? 1.07 : 1 }}
                  transition={{
                    duration: !reduce && i === frame ? (HOLD_MS + 1500) / 1000 : 0,
                    ease: 'linear',
                  }}
                >
                  <Image
                    src={f.image}
                    alt={f.imageAlt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-cover"
                    style={{ objectPosition: f.imagePosition ?? 'center' }}
                  />
                </motion.div>
              </motion.div>
            ) : null,
          )}
          <div aria-hidden className="bf-hero-photo-fade pointer-events-none absolute inset-0" />

          {/* WCAG 2.2.2: the frames change on their own, so they can be stopped. */}
          {mounted && !reduce && frames.length > 1 && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause the photographs' : 'Play the photographs'}
              className="promo-focus absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition-colors duration-200 hover:border-white/70 lg:bottom-6 lg:right-6"
            >
              {playing ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* ── The words ─────────────────────────────────────────────────── */}
        <motion.div
          variants={reduce ? STILL : COPY}
          initial="hide"
          animate="show"
          className="bf-hero-copy relative z-10 -mt-16 flex flex-col justify-center px-5 pb-10 sm:-mt-20 sm:px-10 sm:pb-12 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:py-16 lg:pl-16 lg:pr-12 xl:pl-24"
        >
          <motion.h1
            id="promo-hero-title"
            variants={reduce ? STILL : TITLE}
            className="bf-display bf-hero-title text-white"
          >
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                {i > 0 && ' '}
                <motion.span variants={reduce ? STILL : WORD} className="inline-block">
                  {word}
                </motion.span>
              </Fragment>
            ))}
            {titleMark && (
              <>
                {' '}
                <motion.span variants={reduce ? STILL : WORD} className="mt-[0.12em] block w-fit">
                  {titleMark}
                </motion.span>
              </>
            )}
          </motion.h1>

          {body && (
            <motion.p
              variants={reduce ? STILL : LINE}
              className="promo-lede bf-hero-body mt-6 !max-w-[44ch] text-white/85"
            >
              {body}
            </motion.p>
          )}

          {(cta || ending) && (
            <motion.div
              variants={reduce ? STILL : LINE}
              className="bf-hero-cta mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              {cta}
              {ending && (
                <p className="promo-body bf-hero-ending text-[0.95rem] text-white/85">{ending}</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── The offers: three tiles, lit with the frame ───────────────── */}
      {offers.length > 0 && (
        <nav aria-label="The offers on this page" className="bf-hero-index">
          <ul className="mx-auto grid w-full max-w-[104rem] gap-px sm:auto-cols-fr sm:grid-flow-col">
            {offers.map((offer, i) => {
              const lit = i === activeOffer
              return (
                <li key={offer.offer} className="bf-tile-li">
                  <button
                    type="button"
                    aria-current={lit ? 'true' : undefined}
                    onClick={() => scrollToPromoSection(offer.sectionId, reduce)}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== 'mouse') return
                      setHeld(true)
                      show(i + 1)
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') setHeld(false)
                    }}
                    onFocus={(e) => {
                      if (!e.currentTarget.matches(':focus-visible')) return
                      setHeld(true)
                      show(i + 1)
                    }}
                    onBlur={() => setHeld(false)}
                    className="bf-tile promo-focus group relative block h-full w-full px-5 py-5 text-left [outline-offset:-4px] sm:px-8 sm:py-8 lg:px-10 lg:py-9"
                  >
                    {/* The line that replaces the dot rail: it fills over the
                        frame's hold, and sits full while the frame is held. */}
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[4px] overflow-hidden">
                      {lit && (
                        <motion.span
                          key={`${frame}-${autoplay}`}
                          className="bf-tile-progress block h-full origin-left"
                          initial={{ scaleX: autoplay ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: autoplay ? HOLD_MS / 1000 : 0, ease: 'linear' }}
                        />
                      )}
                    </span>

                    <span className="bf-display bf-tile-name block">{OFFER_CHIPS[offer.offer]}</span>
                    <span className="promo-body bf-tile-detail mt-2 block text-[0.95rem] leading-snug sm:text-[1.02rem]">
                      {offer.detail}
                    </span>
                    <span className="promo-body bf-tile-cta mt-5 hidden text-[0.9rem] font-semibold sm:inline-block">
                      See the offer
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </section>
  )
}
