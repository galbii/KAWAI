'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SeasonMark } from './SeasonMark'

/**
 * The campaign hero — the homepage hero carousel, in the Fall Promo palette.
 *
 * Deliberately a close copy of `LayoutHeroCarouselRenderer`'s staging rather
 * than a new idea: full-height stage, one slide at a time crossfaded, a slow
 * Ken Burns push on the photograph, a frosted content panel at bottom-left,
 * a dot rail and a pause control. What changes is the palette — Ink for
 * kawai-black, Ivory for white, Ember for kawai-red — and the type, which is
 * the campaign's Fraunces and Instrument Sans.
 *
 * It is a separate component rather than a reuse of the homepage renderer
 * because that one is bound to a Payload block shape and to the main site's
 * brand tokens. Feeding it fabricated block data to get campaign slides out
 * would couple this campaign to a CMS schema it does not use, and every colour
 * would still need overriding. The staging was the part worth keeping.
 *
 * ── The one deliberate departure: no card ─────────────────────────────────
 * The homepage puts its copy in a frosted panel — `bg-white/10`, blurred,
 * bordered, rounded. Two reasons that is not repeated here.
 *
 * It does not survive the art. Measured against a blown-out frame, white at
 * 0.10 leaves body copy at 2.82:1; it passes on the homepage only because the
 * video behind it is a dark stage, and this campaign's key art is a bright,
 * warm, high-key room. Tinting the panel dark enough to fix that (Ink at 0.62)
 * works, but then a hard-edged rectangle covers the half of the photograph the
 * photograph was chosen for.
 *
 * And blur cannot rescue it. `backdrop-filter: blur()` removes detail but does
 * not change the mean luminance behind the glyphs, so a more transparent,
 * blurrier panel is not a more legible one — it just looks like it should be.
 * There is no version of the frosted card that is both minimal and compliant.
 *
 * So the card is gone and the scrims carry the contrast instead. A gradient has
 * no edge to cover the picture with: it is strongest exactly where the words
 * are and absent where they are not, which is the same budget spent somewhere
 * the reader cannot see it being spent.
 *
 * ── Motion ────────────────────────────────────────────────────────────────
 * `prefers-reduced-motion` disables autoplay outright, not merely the
 * transition — a carousel that advances on its own is motion however gently it
 * fades. The pause control is always present while autoplay is on (WCAG 2.2.2).
 */

export interface PromoSlide {
  /** Stable key, also the dot's accessible label. */
  id: string
  /** Small tracked-out line above the headline. */
  eyebrow?: string
  /** Fraunces, regular weight, sentence case. Never all caps, never bold. */
  title: string
  /** One or two lines under the headline. */
  body?: string
  /** Background photograph. Local path or R2 URL. */
  image: string
  /** Describes the photograph for anyone who cannot see it. */
  imageAlt: string
  /** Renders the Season Mark above the headline. */
  seasonMark?: boolean
}

const AUTOPLAY_MS = 7000

/**
 * What the value-prop band costs the stage, and what gets out of its way.
 *
 * One table rather than offsets scattered across three elements, because these
 * numbers are only correct relative to each other: `chrome` must clear the
 * band, and `copy` must clear the chrome. Change the band's height and all
 * three move together.
 *
 * Below `sm` the band is one card tall and swipes sideways, so the mobile
 * figures are a card plus its gutter rather than three cards stacked — a
 * stacked band is most of a phone's hero (see the note in PromoValueProps).
 *
 * The stage is `min-h-[600px]`, so the mobile budget is the tight one: 600px
 * less the 11rem the copy is lifted by leaves ~424px for the lockup at 27% and
 * the slide copy above it. Verify on a short viewport before raising these.
 */
const BAND = {
  /** The band itself, pinned to the foot of the stage. */
  band: 'bottom-4 sm:bottom-8',
  /** Dot rail and pause control, lifted above the band. */
  chrome: 'bottom-[16rem] sm:bottom-[11rem]',
  /** The slide copy column, lifted above the chrome. */
  copy: 'pb-[18.5rem] sm:bottom-[13rem] lg:bottom-[13.5rem]',
  /**
   * The stage grows on a phone rather than compressing to fit.
   *
   * Three stacked cards, a dot rail, the slide copy and the brand lockup do not
   * share a 667px screen. `h-screen` alone would force them to overlap, so the
   * mobile stage is allowed to run past the viewport and the band sits at the
   * fold — a short scroll, which is how a band under a hero asks to be read
   * anyway. From `sm` the cards are side by side, the band is one card tall
   * again, and the original 600px floor returns.
   */
  stage: 'min-h-[820px] sm:min-h-[600px]',
  /**
   * The lockup moves up out of the copy's way.
   *
   * At 27% it sits where the lifted slide copy now starts, and both are z-20 —
   * they would simply overlap. Phones-only, like the lockup itself.
   */
  lockup: 'top-[8%]',
} as const

/**
 * The scrim under the slide copy.
 *
 * This ran on phones only for a while, and desktop showed the photographs bare
 * at the client's direction. That is recorded here rather than deleted, because
 * the reason it came back is the reason it should not go away again: type over
 * a bare photograph has no contrast floor at all. Against the bright autumn
 * frames this campaign runs, Ivory copy measured roughly 1.1:1 — not merely
 * short of the 4.5:1 WCAG AA asks for, but genuinely hard to read, which is
 * exactly what came back from looking at it.
 *
 * Shadows cannot fix that, and it is worth being precise about why: 1.4.3
 * compares text colour to background colour and ignores text-shadow entirely.
 * `.promo-photo-text` and `.promo-photo-display` below make the words easier to
 * READ; they do not move the number. Only something behind the glyphs does.
 *
 * One gradient, monotonic, and gone by 96% up. It holds its weight far higher
 * than the version that ran on phones, and the reason is the value-prop band:
 * that band lifted the slide copy by 13rem, so on a 900px stage the copy now
 * spans roughly 23% to 53% up the frame instead of sitting at its foot. The old
 * curve had fallen to 0.46 by 52% — 2.58:1 — which put the headline, the
 * topmost line of the block, in the weakest part of the scrim. That is why more
 * text-shadow kept not fixing it.
 *
 * Ivory needs the scrim at 0.64 for 4.5:1 and 0.77 for 7:1, so the stops hold
 * 0.88 to 38% and 0.72 to 58%, which covers the whole copy block with margin:
 * 12.33:1 at the foot, 10.51:1 at 38%, 5.93:1 at 58%. Above that it falls away
 * quickly and the top ~40% of every frame is the photograph untouched.
 *
 * If the band is ever removed and the copy drops back to `bottom-12`, this
 * curve becomes heavier than it needs to be — the stops come back down with it.
 *
 * If the pictures ever need to run bare again, the remedies that do NOT cost
 * the contrast are: art-direct per slide so the lower-left quarter of each
 * photograph is genuinely dark, or move the copy off the image into a band
 * beneath it. Turning the gradient off and adding more shadow is not one of
 * them.
 */
const PHOTO_GRADIENT =
  'linear-gradient(to top, rgba(29,27,24,0.93) 0%, rgba(29,27,24,0.88) 38%, rgba(29,27,24,0.72) 58%, rgba(29,27,24,0.34) 74%, rgba(29,27,24,0.10) 88%, rgba(29,27,24,0) 96%)'

/**
 * Every control on the stage — arrows and pause — shares one treatment, tinted
 * with Ink rather than the homepage's translucent white.
 *
 * The arrows sit at mid-height, which is exactly where both scrims are at their
 * weakest: the bottom gradient has fallen to ~0.30 and the side gradient is
 * fully transparent by the right edge. A white-at-0.10 fill puts an Ivory glyph
 * at 2.01:1 there, under the 3:1 that 1.4.11 asks of a meaningful control. Ink
 * at 0.62 — the same fill the content panel uses — gives 6.24:1 against a
 * blown-out frame, so the controls stay readable whatever photograph loads.
 *
 * The pause button could get away with the lighter fill, since it sits low
 * enough to be inside the 0.80 scrim. It uses this one anyway: two nearly
 * identical glass treatments on one stage reads as an inconsistency rather than
 * a distinction.
 */
const CONTROL =
  'promo-focus flex items-center justify-center rounded-full border ' +
  'border-[color:var(--ivory)]/25 text-[color:var(--ivory)] shadow-lg backdrop-blur-xl ' +
  'transition-colors duration-200 hover:border-[color:var(--ivory)]/50'
const CONTROL_FILL = { backgroundColor: 'rgba(29, 27, 24, 0.62)' }

export function PromoHeroCarousel({
  slides,
  cta,
  lockup,
  valueProps,
}: {
  slides: readonly PromoSlide[]
  /** The conversion action, rendered on every slide — it is the same ask. */
  cta?: React.ReactNode
  /**
   * A band overlaid on the foot of the stage — `PromoValueProps` in practice.
   *
   * Campaign-level like the lockup, and rendered outside the slide's
   * AnimatePresence for the same reason: it says the same thing on every slide,
   * so fading it out and back in every seven seconds is motion that carries no
   * information.
   *
   * Passing it REARRANGES THE STAGE. The band occupies the bottom of the frame,
   * which is where the dot rail, the pause control and the copy column all sit,
   * so all three lift clear of it by `BAND` below. That is why this is a slot
   * on the carousel rather than something a caller renders over the hero
   * itself: the clearance has to be decided in the same file as the chrome it
   * moves, or the two drift and the band lands on the dots.
   */
  valueProps?: React.ReactNode
  /**
   * The campaign lockup. Phones only.
   *
   * Rendered outside the slide's AnimatePresence, so it holds still while the
   * slides change behind it — it identifies the campaign, not the slide.
   *
   * It does not appear from `sm` up, where the site header is in view and
   * already carries the Kawai mark; a second one centred on the hero was the
   * same brand stated twice on one screen. `pointer-events-none` so it never
   * intercepts the arrows beneath it.
   */
  lockup?: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const touchStart = useRef<number | null>(null)
  const stageRef = useRef<HTMLElement>(null)

  const many = slides.length > 1
  const autoplay = many && playing && !reduce

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  )

  useEffect(() => {
    if (!autoplay) return
    const t = setTimeout(() => go(index + 1), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [autoplay, index, go])

  // Arrow keys only while the stage holds focus — bound to the window they
  // would steal arrow scrolling from the rest of the page.
  useEffect(() => {
    const el = stageRef.current
    if (!el || !many) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      go(index + (e.key === 'ArrowRight' ? 1 : -1))
      setPlaying(false)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [index, go, many])

  const slide = slides[index]
  if (!slide) return null

  return (
    <section
      ref={stageRef}
      tabIndex={-1}
      aria-roledescription="carousel"
      aria-label="Fall offers"
      className={`relative h-screen max-h-[900px] w-full overflow-hidden bg-[color:var(--ink)] ${
        valueProps ? BAND.stage : 'min-h-[600px]'
      }`}
      onTouchStart={(e) => {
        touchStart.current = e.targetTouches[0]?.clientX ?? null
        setPlaying(false)
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current
        const end = e.changedTouches[0]?.clientX
        touchStart.current = null
        if (start == null || end == null || Math.abs(start - end) <= 50) return
        go(index + (start > end ? 1 : -1))
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: !reduce && loaded ? 1.05 : 1 }}
            transition={{ duration: reduce ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              onLoad={() => setLoaded(true)}
            />
          </motion.div>

          {/* Every breakpoint now — see the note above. Spent across the
              bottom where the words are and gone by 84% up, so the top of the
              frame is the photograph and nothing else. */}
          <div className="absolute inset-0" style={{ background: PHOTO_GRADIENT }} />
        </motion.div>
      </AnimatePresence>

      {/* Low in the frame, phones only — see the note on the prop. */}
      {lockup && (
        <div
          className={`pointer-events-none absolute inset-x-6 z-20 sm:hidden ${
            valueProps ? BAND.lockup : 'top-[27%]'
          }`}
        >
          {lockup}
        </div>
      )}

      {/* On a phone the lockup is centred horizontally and sits low in the
          frame, over the gradient: a left-aligned column reads as misaligned
          when there is no second column to balance it, and low is where the
          scrim is strongest. From `sm` up it returns to bottom-left, which is
          the homepage's position. Bottom padding clears the dot rail. */}
      <div
        className={`absolute inset-x-12 inset-y-0 z-20 flex flex-col justify-end text-center sm:inset-x-auto sm:inset-y-auto sm:left-12 sm:right-12 sm:block sm:pb-0 sm:text-left lg:left-16 lg:right-1/3 ${
          valueProps ? BAND.copy : 'pb-24 sm:bottom-12 lg:bottom-16'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.3 }}
          >
            <div className="space-y-6">
              {slide.seasonMark && (
                <div className="flex justify-center text-[color:var(--ivory)] sm:block">
                  <SeasonMark size={34} />
                </div>
              )}

              {/* Ivory, not Harvest Gold. Gold is 4.41:1 even under a 0.88
                  scrim — it never clears AA over a photograph at any strength
                  the picture can survive. The guidelines sanction it as text on
                  Ink, and a scrimmed photograph is not Ink. */}
              {slide.eyebrow && (
                <p className="promo-label promo-photo-text text-[color:var(--ivory)]/85">{slide.eyebrow}</p>
              )}

              {/* h2, not h1 — the titles rotate, so the page owns its own h1. */}
              <h2 className="promo-display promo-photo-display text-[color:var(--ivory)]">{slide.title}</h2>

              {/* promo-lede caps its own measure, so centring needs mx-auto.
                  The shadow is what carries this line now that the scrim is
                  gone — see the note on .promo-photo-text. */}
              {slide.body && (
                <p className="promo-lede promo-photo-text mx-auto text-[color:var(--ivory)] sm:mx-0">
                  {slide.body}
                </p>
              )}

              {cta && <div className="flex justify-center pt-2 sm:block">{cta}</div>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The offer band, overlaid on the foot of the frame. Outside the slide's
          AnimatePresence, so it holds still while the pictures change behind
          it. `inset-x-6` on a phone and `inset-x-12` up, matching the copy
          column's gutter so the band's edges line up with the words above. */}
      {valueProps && (
        <div
          className={`absolute inset-x-6 z-20 sm:inset-x-12 lg:inset-x-16 ${BAND.band}`}
          // The stage advances a slide on any horizontal swipe over 50px, and
          // that handler is on the <section>, so a touch that scrolls the
          // band's card row would bubble up to it and change the picture
          // underneath mid-swipe. Stopping both ends here is what keeps the two
          // gestures separate: swiping the photograph still moves the carousel,
          // swiping the cards only moves the cards.
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {valueProps}
        </div>
      )}

      {/* Side arrows at every size. On a phone they are smaller and tucked
          tight to the edge, and the copy below carries a wider inset to clear
          them — the two would otherwise overlap, since the copy is centred and
          runs the full width. */}
      {many && (
        <>
          <button
            type="button"
            onClick={() => {
              go(index - 1)
              setPlaying(false)
            }}
            aria-label="Previous slide"
            className={`${CONTROL} absolute left-1.5 top-1/2 z-30 h-10 w-10 -translate-y-1/2 sm:left-6 sm:h-12 sm:w-12 lg:left-8`}
            style={CONTROL_FILL}
          >
            <svg
              className="h-5 w-5 -translate-x-[1px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              go(index + 1)
              setPlaying(false)
            }}
            aria-label="Next slide"
            className={`${CONTROL} absolute right-1.5 top-1/2 z-30 h-10 w-10 -translate-y-1/2 sm:right-6 sm:h-12 sm:w-12 lg:right-8`}
            style={CONTROL_FILL}
          >
            <svg
              className="h-5 w-5 translate-x-[1px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot rail, bottom centre — the homepage's placement and proportions. */}
      {many && (
        <ul
          className={`absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 ${
            valueProps ? BAND.chrome : 'bottom-8'
          }`}
        >
          {slides.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  go(i)
                  setPlaying(false)
                }}
                aria-label={s.title}
                aria-current={i === index}
                className={`promo-focus block h-3 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-12 bg-[color:var(--ivory)] shadow-lg'
                    : 'w-3 bg-[color:var(--ivory)]/40 hover:bg-[color:var(--ivory)]/60'
                }`}
              />
            </li>
          ))}
        </ul>
      )}

      {/* WCAG 2.2.2 — anything that moves on its own needs a stop. */}
      {many && !reduce && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause the slideshow' : 'Play the slideshow'}
          className={`${CONTROL} absolute right-8 z-30 h-12 w-12 sm:right-12 ${
            valueProps ? BAND.chrome : 'bottom-8 sm:bottom-12'
          }`}
          style={CONTROL_FILL}
        >
          {playing ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Announces the change so the dots do not have to carry it. */}
      <p aria-live="polite" className="sr-only">
        {`Slide ${index + 1} of ${slides.length}: ${slide.title}`}
      </p>
    </section>
  )
}
