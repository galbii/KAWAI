'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { OfferKey } from '@/lib/fall-promo/tokens'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'
import { scrollToPromoSection } from '@/lib/fall-promo/scroll'

/**
 * The campaign hero: one fixed headline over a photograph that changes, and an
 * offer index along the foot that decides which photograph it is.
 *
 * ── Why it is one thing now ───────────────────────────────────────────────
 * It used to be two. A carousel told the offers one way — rotating headline,
 * side arrows, a dot rail, a pause — and a band of glass cards laid over the
 * same photograph told them a second way, with nothing connecting the two: the
 * dots counted slides, the cards counted offers, and the slides and the offers
 * did not even line up (the rebates had a card and no slide).
 *
 * Here the index IS the carousel. Each offer owns a frame. The frame on stage
 * lights its cell, and an Ember line fills across that cell's top for as long
 * as the frame holds — the one piece of motion that runs on its own, and the
 * thing that replaces the dots, the arrows and the numbering. Pointing at a
 * cell (hover or keyboard focus) brings its frame up and holds it; choosing a
 * cell jumps to the section that explains the offer.
 *
 * The rotation opens on the campaign's key art, with no cell lit — the
 * photograph that says "fall" before any one offer does — then walks the
 * offers in page order.
 *
 * ── The fallboard ─────────────────────────────────────────────────────────
 * The index sits on solid Ink, below the picture rather than floating on it,
 * and the photograph dissolves into it through the same gradient that carries
 * the headline's contrast. Ivory on Ink is 15.01:1 and the dimmed cell names
 * (Ivory at 0.6) are still ~6:1, so nothing in the index depends on what the
 * photograph is doing. It is the black rail under a piano's keys: the
 * instrument above, the name in quiet type below.
 *
 * ── The headline is the page's h1 ─────────────────────────────────────────
 * It no longer rotates, so it no longer has to be an h2 with a visually hidden
 * h1 standing in for it. The offer names in the index are buttons, not
 * headings — each section below carries its own h2 for that offer.
 *
 * ── Copy rules carried over ───────────────────────────────────────────────
 * A cell carries an offer's name (from `OFFER_CHIPS`) and its scope line —
 * never a rate, a term or an amount. The financing figure needs its APR at the
 * same size beside it and a 40% subhead under it (§4.1/§4.2), and the place
 * that lockup can be set compliantly is the financing section, not here. The
 * compliance test reads these lines.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 * One orchestrated arrival — the headline a word at a time, then the line
 * under it, then the button — and after that only the frames and the line
 * filling under the lit cell. Under `prefers-reduced-motion` nothing advances
 * on its own and frames swap without a fade; pointing at a cell still changes
 * the picture, since that answers the reader's own action. WCAG 2.2.2: while
 * autoplay runs there is always a pause control.
 */

export interface PromoValueProp {
  /** Which offer this cell is for. Its name comes from `OFFER_CHIPS`. */
  offer: OfferKey
  /** One short line naming what the offer covers. Never a rate, term or amount. */
  detail: string
  /**
   * Retained for the campaign data and its compliance test. The index no
   * longer marks a phrase inside the line — one emphasised fragment per line
   * read as decoration once the names themselves carried the cell.
   */
  highlight?: string
  /** The `id` of the `<section>` this cell jumps to. */
  sectionId: string
}

/** A campaign photograph with its description. Also the shape `slides.ts` keeps its copy in. */
export interface PromoSlide {
  id: string
  eyebrow?: string
  title: string
  body?: string
  image: string
  imageAlt: string
}

/** An offer cell, with the photograph that stands for it. */
export interface PromoHeroOffer extends PromoValueProp {
  image: string
  imageAlt: string
  /**
   * CSS `object-position` for this frame. The stage is a wide, short crop, so
   * a photograph whose subject sits low in the frame needs pointing at it.
   */
  imagePosition?: string
}

/** How long a frame holds before the next one. */
const HOLD_MS = 6500

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/**
 * Spent where the words are, and nowhere else.
 *
 * On a phone the copy runs the full width at the foot, so the wash rises from
 * the bottom. From `lg` the copy is a left column, so the wash comes from the
 * left instead and the right half of every frame — where the instrument
 * usually is — runs clean. A short bottom band in both cases dissolves the
 * picture into the index below it.
 */
const PHOTO_GRADIENT =
  'linear-gradient(to top, rgba(29,27,24,1) 0%, rgba(29,27,24,0.9) 22%, rgba(29,27,24,0.7) 44%, rgba(29,27,24,0.25) 66%, rgba(29,27,24,0) 84%)'

const SIDE_GRADIENT =
  'linear-gradient(to right, rgba(29,27,24,0.9) 0%, rgba(29,27,24,0.78) 34%, rgba(29,27,24,0.35) 54%, rgba(29,27,24,0) 72%), ' +
  'linear-gradient(to top, rgba(29,27,24,1) 0%, rgba(29,27,24,0) 22%)'

const COPY: Variants = {
  hide: {},
  show: { transition: { delayChildren: 0.25, staggerChildren: 0.14 } },
}

const LINE: Variants = {
  hide: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
}

const TITLE: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const WORD: Variants = {
  hide: { opacity: 0, y: '0.3em', filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
}

/** Reduced motion: every variant resolves to the element as it is. */
const STILL: Variants = { hide: {}, show: {} }

export function PromoHeroCarousel({
  title,
  titleMark,
  body,
  ending,
  cta,
  keyArt,
  offers,
}: {
  /** The campaign name. Rendered as the page's h1. */
  title: string
  /**
   * A mark set as the headline's last word — "Fall for a [Kawai]". It must be
   * an image whose `alt` is the word it replaces, so the h1's text is still
   * the full campaign name. It rides the same word stagger as the rest.
   */
  titleMark?: React.ReactNode
  /** The line under it. */
  body?: string
  /** A short, plain deadline line beside the CTA. */
  ending?: string
  cta?: React.ReactNode
  /** The opening frame: the campaign photograph, before any offer is lit. */
  keyArt: { image: string; imageAlt: string; imagePosition?: string }
  /** One cell per offer, in page order. */
  offers: readonly PromoHeroOffer[]
}) {
  const prefersReduced = useReducedMotion()
  // The reduced-motion value comes from a media query the server cannot see.
  // Waiting for mount keeps the first client render identical to the server's.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduce = mounted && prefersReduced === true

  const frames = [keyArt, ...offers]
  const [frame, setFrame] = useState(0)
  const [playing, setPlaying] = useState(true)
  /** A cell is being pointed at: hold its frame, and hold the timer. */
  const [held, setHeld] = useState(false)
  /** Frames that have been on stage, so their images stay mounted. */
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

  // Mount the next frame's image a beat before it is needed, so the crossfade
  // never fades in a blank layer — but not all of them up front.
  const next = (frame + 1) % frames.length
  const mountedFrames = new Set([...seen, next])

  const activeOffer = frame - 1 // -1 while the key art is up

  const words = title.split(' ')

  return (
    <section
      aria-labelledby="promo-hero-title"
      className="relative flex w-full flex-col bg-[color:var(--ink)]"
    >
      {/* ── The stage ─────────────────────────────────────────────────── */}
      <div className="relative isolate flex min-h-[32rem] flex-1 flex-col justify-end overflow-hidden sm:min-h-[30rem] lg:h-[max(24rem,calc(100svh-20rem))] lg:max-h-[44rem] lg:min-h-0">
        {frames.map((f, i) =>
          mountedFrames.has(i) ? (
            <motion.div
              key={f.image}
              aria-hidden={i !== frame}
              className="absolute inset-0 -z-10"
              initial={false}
              animate={{ opacity: i === frame ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                // A slow push while the frame holds; reset off stage so it
                // starts from rest next time round.
                animate={{ scale: !reduce && i === frame ? 1.06 : 1 }}
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
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: f.imagePosition ?? 'center' }}
                />
              </motion.div>
            </motion.div>
          ) : null,
        )}

        <div aria-hidden className="absolute inset-0 -z-10 lg:hidden" style={{ background: PHOTO_GRADIENT }} />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 hidden lg:block"
          style={{ background: SIDE_GRADIENT }}
        />

        <motion.div
          variants={reduce ? STILL : COPY}
          initial="hide"
          animate="show"
          className="mx-auto w-full max-w-[104rem] px-6 pb-9 pt-24 sm:px-10 sm:pb-10 lg:px-16 lg:pb-10 lg:pt-10"
        >
          {/* Real spaces between the word spans, so the heading's text is the
              title unchanged. A blur rather than an overflow mask: a mask would
              crop .promo-photo-display's wide shadow into a box per word. */}
          <motion.h1
            id="promo-hero-title"
            variants={reduce ? STILL : TITLE}
            className="promo-display promo-photo-display max-w-[11ch] text-[color:var(--ivory)]"
            style={{ fontSize: 'clamp(3.1rem, 7.2vw, 6.75rem)', lineHeight: 0.98 }}
          >
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                {i > 0 && ' '}
                <motion.span variants={reduce ? STILL : WORD} className="inline-block">
                  {word}
                </motion.span>
              </Fragment>
            ))}
            {/* The mark always takes its own line — the brand as the
                headline's payoff, not a word that wraps there only when the
                measure happens to run out. The space stays in the text so the
                heading still reads "Fall for a Kawai". `mt` opens a little air
                above it, since the logotype has no descender to set against. */}
            {titleMark && (
              <>
                {' '}
                <motion.span
                  variants={reduce ? STILL : WORD}
                  className="mt-[0.2em] block w-fit"
                >
                  {titleMark}
                </motion.span>
              </>
            )}
          </motion.h1>

          {body && (
            <motion.p
              variants={reduce ? STILL : LINE}
              className="promo-lede promo-photo-text mt-5 !max-w-[48ch] text-[color:var(--ivory)]"
            >
              {body}
            </motion.p>
          )}

          {(cta || ending) && (
            <motion.div
              variants={reduce ? STILL : LINE}
              className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {cta}
              {ending && (
                <p className="promo-body promo-photo-text text-[0.95rem] text-[color:var(--ivory)]/85">
                  {ending}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* WCAG 2.2.2 — the frames change on their own, so they can be stopped. */}
        {mounted && !reduce && frames.length > 1 && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause the photographs' : 'Play the photographs'}
            className="promo-focus absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--ivory)]/25 text-[color:var(--ivory)] transition-colors duration-200 hover:border-[color:var(--ivory)]/60 sm:right-10 lg:right-16"
            style={{ backgroundColor: 'rgba(29, 27, 24, 0.62)' }}
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

      {/* ── The index ─────────────────────────────────────────────────── */}
      {offers.length > 0 && (
        <nav aria-label="The offers on this page" className="border-t border-[color:var(--ivory)]/12">
          <ul className="mx-auto grid w-full max-w-[104rem] sm:auto-cols-fr sm:grid-flow-col">
            {offers.map((offer, i) => {
              const lit = i === activeOffer
              return (
                <li
                  key={offer.offer}
                  className="border-t border-[color:var(--ivory)]/12 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0"
                >
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
                    // Keyboard focus only. A click also focuses the button, and
                    // holding the frame on that would leave the hero stopped
                    // after the reader has scrolled away from it.
                    onFocus={(e) => {
                      if (!e.currentTarget.matches(':focus-visible')) return
                      setHeld(true)
                      show(i + 1)
                    }}
                    onBlur={() => setHeld(false)}
                    className="promo-focus group relative block h-full w-full px-6 py-5 text-left [outline-offset:-4px] sm:px-8 sm:py-6 lg:px-10 lg:py-7"
                  >
                    {/* The line that replaces the dot rail. It fills over the
                        frame's hold while autoplay runs, and sits full when
                        the frame is being held by the reader. */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-[2px] overflow-hidden"
                    >
                      {lit && (
                        <motion.span
                          key={`${frame}-${autoplay}`}
                          className="block h-full origin-left bg-[color:var(--ember)]"
                          initial={{ scaleX: autoplay ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: autoplay ? HOLD_MS / 1000 : 0,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </span>

                    <span
                      // Inline size: .promo-h2 is unlayered CSS and outranks
                      // Tailwind's text-size utilities.
                      style={{ fontSize: 'clamp(1.35rem, 1.9vw, 1.85rem)' }}
                      className={`promo-h2 block leading-tight transition-colors duration-500 ${
                        lit
                          ? 'text-[color:var(--ivory)]'
                          : 'text-[color:var(--ivory)]/60 group-hover:text-[color:var(--ivory)]'
                      }`}
                    >
                      {OFFER_CHIPS[offer.offer]}
                    </span>
                    <span className="promo-body mt-1.5 block text-[0.92rem] leading-snug text-[color:var(--ivory)]/75 sm:mt-2 sm:text-[0.98rem]">
                      {offer.detail}
                    </span>
                    <span className="promo-body mt-4 hidden text-[0.88rem] font-semibold text-[color:var(--ivory)] underline decoration-[color:var(--ivory)]/30 underline-offset-[5px] transition-[text-decoration-color] duration-300 group-hover:decoration-[color:var(--ember)] sm:inline-block">
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
