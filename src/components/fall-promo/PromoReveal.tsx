'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, inView, scroll } from 'framer-motion'

/**
 * The campaign's scroll choreography, in two pieces: a reveal that plays a
 * section's parts in as it arrives, and the parallax that `PromoStage` has
 * always been plumbed for but nothing ever drove.
 *
 * ── One vocabulary ────────────────────────────────────────────────────────
 * The page opens with a carousel and closes with a pinned cinematic, and both
 * move on the same expo ease-out. The three offers between them used to simply
 * be there — the page performed at its two ends and stood still where the
 * offers are. These are that same motion language applied to the middle: the
 * curve is the cinematic's `EASE_OUT_EXPO`, and every reveal is time-based
 * off a one-shot trigger rather than scrubbed to scroll, which is the rule the
 * cinematic's own copy follows ("a reveal always plays to completion no matter
 * where the reader stops").
 *
 * ── Visible first, hidden only on purpose ─────────────────────────────────
 * Nothing renders hidden. The server HTML, a reader with no JavaScript, a
 * crawler and a reader who prefers reduced motion all get every word at full
 * opacity; this component only ever takes something AWAY after mount, and only
 * when it is below the fold and therefore not yet seen. A group already on
 * screen when the page loads (a reload mid-page, an anchor link) is left
 * exactly as it is rather than blinked out and played back.
 *
 * So it is also hydration-safe by construction: server and client render the
 * same plain `<div>`, and everything here happens in an effect.
 *
 * ── Marking parts ─────────────────────────────────────────────────────────
 * Descendants opt in with `data-reveal="<variant>"` — a plain attribute, so a
 * server component can mark its own markup without becoming a client one. They
 * play in DOM order, `STEP` apart. `data-reveal-delay="0.3"` adds to one part's
 * start without shifting the others, for a beat that belongs to its row (the
 * strike drawn through a price after the row has landed).
 */

const EASE = [0.16, 1, 0.3, 1] as const
const DURATION = 0.9
const STEP = 0.08

type Variant = 'rise' | 'lift' | 'fade' | 'slide' | 'wipe' | 'strike' | 'pop'

type Keyframes = Record<string, string | number>

/** Where each variant starts. Every one of them ends at the element's own style. */
const FROM: Record<Variant, Keyframes> = {
  // The default: a short rise, for type.
  rise: { opacity: 0, y: 18 },
  // A longer one, for a card that carries type of its own.
  lift: { opacity: 0, y: 36 },
  fade: { opacity: 0 },
  // Ledger rows: in from the side the eye reads them toward.
  slide: { opacity: 0, x: 28 },
  // Photographs: uncovered from the foot up, settling as they go. The leading
  // edge is straight; the tile's own rounded corners take over at rest.
  wipe: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 },
  // A strike-through drawn left to right — the site's price-reveal signature
  // (see `price-strike` in globals.css), done here on the ledger.
  strike: { scaleX: 0 },
  // A saving, arriving after the figure it qualifies.
  pop: { opacity: 0, scale: 0.9, y: 6 },
}

const TO: Record<Variant, Keyframes> = {
  rise: { opacity: 1, y: 0 },
  lift: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  slide: { opacity: 1, x: 0 },
  wipe: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  strike: { scaleX: 1 },
  pop: { opacity: 1, scale: 1, y: 0 },
}

/** Wipes run a touch longer: a photograph is uncovered, not dropped in. */
const DURATION_FOR: Partial<Record<Variant, number>> = { wipe: 1.25, strike: 0.6, pop: 0.55 }

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function variantOf(el: Element, fallback: Variant = 'rise'): Variant {
  const v = el.getAttribute('data-reveal')
  return v && v in FROM ? (v as Variant) : fallback
}

export function PromoReveal({
  children,
  className,
  self,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  /**
   * Animate the wrapper itself too, ahead of its parts — for a card that should
   * arrive as an object and then have its contents settle inside it.
   */
  self?: Variant
  /** Seconds before the first part plays, once the group is in view. */
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    // Already on screen at mount: leave it. Hiding it now would be a visible
    // flash, not an entrance.
    if (root.getBoundingClientRect().top < window.innerHeight * 0.92) return

    const parts = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const all: Array<{ el: HTMLElement; variant: Variant; at: number }> = []

    let at = delay
    if (self) {
      all.push({ el: root, variant: self, at })
      at += STEP * 1.5
    }
    parts.forEach((el, i) => {
      const extra = Number(el.getAttribute('data-reveal-delay') ?? 0) || 0
      all.push({ el, variant: variantOf(el), at: at + i * STEP + extra })
    })
    if (all.length === 0) return

    // Arm: jump every part to its start pose. Off screen, so unseen.
    for (const { el, variant } of all) animate(el, FROM[variant], { duration: 0 })

    let played = false
    const play = () => {
      if (played) return
      played = true
      for (const { el, variant, at: when } of all) {
        const run = animate(el, TO[variant], {
          duration: DURATION_FOR[variant] ?? DURATION,
          ease: EASE,
          delay: when,
        })
        // A clip-path at rest — even a full-size inset — clips the focus ring
        // of every control inside the tile. Drop it once the wipe is done.
        if (variant === 'wipe') void run.then(() => el.style.removeProperty('clip-path'))
      }
    }

    // Fire once the group is 15% up the viewport, not at its bottom edge —
    // there, the first parts would finish before the eye has reached them.
    const stop = inView(root, play, { margin: '0px 0px -15% 0px' })

    // A page printed before it is scrolled must not print blank sections.
    // Nothing has played yet, so the armed poses are the only inline styles
    // there are — clearing them restores the server render exactly.
    const onPrint = () => {
      if (played) return
      played = true
      for (const { el } of all) {
        for (const prop of ['opacity', 'transform', 'clip-path']) el.style.removeProperty(prop)
      }
    }
    window.addEventListener('beforeprint', onPrint)

    return () => {
      stop()
      window.removeEventListener('beforeprint', onPrint)
    }
  }, [self, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/**
 * Drives `--stage-shift` on the enclosing `PromoStage`, so its photograph
 * drifts against the page as the section passes through the viewport.
 *
 * `PromoStage` pre-scales its picture to 1.08 for exactly this and documents
 * the variable, but nothing ever set it — the stages were still frames. This is
 * the missing driver. It renders an empty, hidden span and finds its stage with
 * `closest()`, which keeps `PromoStage` a server component: the stage owns the
 * transform, this only supplies the number.
 *
 * The travel is ±3.5% of the stage's height. The 1.08 pre-scale leaves 4% of
 * slack at each edge, so the picture never shows its border; going further
 * would need a bigger pre-scale, and every point of that is resolution lost.
 *
 * Reduced motion: never attaches, and the variable stays unset, which is the
 * still frame the stage was designed to fall back to.
 */
export function StageParallax() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const stage = ref.current?.closest<HTMLElement>('[data-promo-stage]')
    if (!stage || prefersReducedMotion()) return

    return scroll(
      (progress: number) => {
        const travel = stage.offsetHeight * 0.035
        stage.style.setProperty('--stage-shift', `${((progress - 0.5) * 2 * travel).toFixed(1)}px`)
      },
      { target: stage, offset: ['start end', 'end start'] },
    )
  }, [])

  return <span ref={ref} hidden aria-hidden />
}
