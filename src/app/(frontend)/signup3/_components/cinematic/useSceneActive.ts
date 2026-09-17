'use client'

import { useEffect, useState } from 'react'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'

/**
 * Returns whether a scene is "active" — i.e. the user has scrolled far enough
 * into its window for it to be on screen.
 *
 * This is the hinge that lets content reveals be *time-based* instead of
 * scroll-scrubbed: a scene flips active once `progress` passes `enter` into its
 * window and flips inactive when it leaves. Components animate off the boolean
 * (with a `transition`), so their reveal always plays to completion regardless
 * of where the user stops scrolling — and replays when the scene is re-entered.
 *
 * Scroll position still drives the background camera and the scene-to-scene
 * crossfades; only the content within a scene is decoupled.
 */
export function useSceneActive(
  progress: MotionValue<number>,
  window: readonly [number, number],
  enter = 0.1,
): boolean {
  const [start, end] = window
  const enterAt = start + (end - start) * enter

  const evaluate = (p: number) => p >= enterAt && p <= end

  const [active, setActive] = useState(false)

  useMotionValueEvent(progress, 'change', (p) => {
    setActive((prev) => {
      const next = evaluate(p)
      return prev === next ? prev : next
    })
  })

  // Sync on mount (covers deep links / refresh already inside the window).
  useEffect(() => {
    setActive(evaluate(progress.get()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterAt, end])

  return active
}
