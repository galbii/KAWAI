'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * The scene machinery behind the page's closing cinematic.
 *
 * Ported from /signup2's about-scroll — the windows, the asymmetric fade, the
 * timer-driven counter — and left mechanically identical so the choreography
 * needs no re-tuning. Only the theming moved: colour and type are the campaign's
 * and live in the scenes, not here.
 *
 * NOT imported from `signup2/_components`. That route is a conversion test and
 * is free to be rewritten or deleted without warning, so this is a copy rather
 * than a shared dependency.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

/**
 * Three scene windows on the cinematic's own 0 → 1 scroll.
 *
 * /signup2 runs five scenes and hands its outro the slice [0.405 → 1]; here the
 * outro IS the whole thing, so the same three scenes are re-spread across the
 * full range with the same ~1.5% crossfade overlap.
 */
export const SCENE_WINDOWS = {
  showrooms: [0.0, 0.37] as const,
  stats: [0.355, 0.7] as const,
  coda: [0.685, 1.0] as const,
}

/**
 * Whether a scene has been scrolled far enough into its window to be on screen.
 *
 * The hinge that makes content reveals *time-based* rather than scroll-scrubbed:
 * a scene flips active once progress passes `enter` into its window, and the
 * copy animates off the boolean, so a reveal always plays to completion no
 * matter where the reader stops — and replays on re-entry. Scroll still drives
 * the camera and the scene-to-scene crossfade; only the content is decoupled.
 */
export function useSceneActive(
  progress: MotionValue<number>,
  window: readonly [number, number],
  enter = 0.1,
): boolean {
  const [start, end] = window
  const enterAt = start + (end - start) * enter
  const [active, setActive] = useState(false)

  useMotionValueEvent(progress, 'change', (p) => {
    setActive((prev) => {
      const next = p >= enterAt && p <= end
      return prev === next ? prev : next
    })
  })

  useEffect(() => {
    setActive(progress.get() >= enterAt && progress.get() <= end)
  }, [enterAt, end, progress])

  return active
}

type SceneLayerProps = {
  progress: MotionValue<number>
  window: readonly [number, number]
  startVisible?: boolean
  endVisible?: boolean
  /** Portion of the window used to fade in (default 0.12 — fast). */
  fadeIn?: number
  /** Portion of the window used to fade out (default 0.18). */
  fadeOut?: number
  yOffset?: number
  className?: string
  children: ReactNode
}

/**
 * A full-viewport absolute layer pinned over the canvas.
 *
 * The fade is asymmetric on purpose: a quick in so the copy lands, a long hold
 * so it can be read, then a relaxed out so the next scene slides under it
 * cleanly. `inert` is toggled with visibility so a faded-out scene's buttons
 * stay out of the tab order.
 */
export function SceneLayer({
  progress,
  window: w,
  startVisible = false,
  endVisible = false,
  fadeIn = 0.12,
  fadeOut = 0.18,
  yOffset = 0,
  className = '',
  children,
}: SceneLayerProps) {
  const [start, end] = w
  const span = end - start
  const input = [start, start + span * fadeIn, end - span * fadeOut, end]
  const opacity = useTransform(progress, input, [startVisible ? 1 : 0, 1, 1, endVisible ? 1 : 0])
  const y = useTransform(progress, input, [yOffset, 0, 0, -yOffset / 2])

  const ref = useRef<HTMLDivElement>(null)
  useMotionValueEvent(opacity, 'change', (v) => {
    const el = ref.current
    if (!el) return
    const visible = v > 0.05
    if (visible && el.hasAttribute('inert')) el.removeAttribute('inert')
    if (!visible && !el.hasAttribute('inert')) el.setAttribute('inert', '')
  })

  useEffect(() => {
    const el = ref.current
    if (el && opacity.get() <= 0.05) el.setAttribute('inert', '')
  }, [opacity])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, willChange: 'opacity, transform' }}
      className={`pointer-events-auto absolute inset-0 flex ${className}`}
    >
      {children}
    </motion.div>
  )
}

type NumberStrikeProps = {
  active: boolean
  target: number
  suffix?: string
  decimals?: number
  reduce: boolean
  duration?: number
  /** Seconds to wait before counting, for a time-based stagger across a row. */
  delay?: number
  /** Thousands separator. Off for year values (1927, not 1,927). */
  grouping?: boolean
}

const format = (n: number, decimals: number, grouping: boolean) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  })

/**
 * A stat that counts up on a timer once its scene is active — never scrubbed to
 * scroll. It always reaches its target and holds, wherever the reader stops,
 * and resets when the scene is left so it replays on re-entry.
 *
 * It renders its final value on the server, unlike the /signup2 original, which
 * mounted empty. The figure is then in the HTML for a reader with no JavaScript
 * and for a crawler; the drop to zero happens on mount, far below the fold,
 * where nobody sees it.
 *
 * aria-hidden, because a ticking number is noise to a screen reader. Every
 * caller states the figure once in an sr-only line instead.
 */
export function NumberStrike({
  active,
  target,
  suffix = '',
  decimals = 0,
  reduce,
  duration = 1.2,
  delay = 0,
  grouping = true,
}: NumberStrikeProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const controls = useRef<ReturnType<typeof animate> | null>(null)

  useEffect(() => {
    const write = (n: number) => {
      if (ref.current) ref.current.textContent = format(n, decimals, grouping) + suffix
    }

    if (reduce) {
      write(target)
      return
    }

    controls.current?.stop()
    if (active) {
      controls.current = animate(0, target, {
        duration,
        delay,
        ease: EASE_OUT_EXPO,
        onUpdate: write,
      })
    } else {
      write(0)
    }
    return () => controls.current?.stop()
  }, [active, reduce, target, decimals, suffix, duration, delay, grouping])

  return (
    <span ref={ref} aria-hidden>
      {format(target, decimals, grouping) + suffix}
    </span>
  )
}

/**
 * The campaign's eyebrow: a tracked caps line between two Ember hairlines.
 *
 * Ember rather than Kawai red — the brand red fights the Ivory and Walnut this
 * page is built from, and the mark is graphic, so it is not carrying a contrast
 * obligation of its own.
 */
export function SceneEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="promo-label inline-flex items-center gap-2.5 text-[color:var(--ivory)]/75">
      <span aria-hidden className="block h-px w-5 shrink-0 bg-[color:var(--ember)]" />
      {children}
      <span aria-hidden className="block h-px w-5 shrink-0 bg-[color:var(--ember)]" />
    </span>
  )
}
