'use client'

import { useEffect, useRef } from 'react'
import { animate, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { EASE_OUT_EXPO } from './motion'

type Props = {
  progress: MotionValue<number>
  /**
   * Master-scroll range for the stat. Only the start (`window[0]`) matters:
   * it is the trigger point at which the count fires. The count then plays
   * to completion on a timer, so it always finishes even if the user stops
   * scrolling mid-scene.
   */
  window: readonly [number, number]
  target: number
  suffix?: string
  decimals?: number
  reduce: boolean
  className?: string
  /** Seconds the count-up takes once triggered. */
  duration?: number
}

function format(n: number, decimals: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * A stat counter that *fires on enter* rather than scrubbing to scroll.
 *
 * Once the scroll position reaches the trigger point (`window[0]`), the number
 * counts up to its target on a fixed timer and holds there — so it never
 * freezes at a half-finished value when the user pauses scrolling. Scrolling
 * back above the trigger resets it so the count replays on the next pass.
 */
export default function NumberStrike({
  progress,
  window: w,
  target,
  suffix = '',
  decimals = 0,
  reduce,
  className,
  duration = 1.1,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const playing = useRef(false)
  const controls = useRef<ReturnType<typeof animate> | null>(null)
  const trigger = w[0]

  const write = (n: number) => {
    if (ref.current) ref.current.textContent = format(n, decimals) + suffix
  }

  const fire = () => {
    if (playing.current) return
    playing.current = true
    controls.current?.stop()
    controls.current = animate(0, target, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: write,
    })
  }

  const reset = () => {
    if (!playing.current) return
    playing.current = false
    controls.current?.stop()
    write(0)
  }

  // Initial paint + fire-if-already-past (covers deep links / refresh mid-page).
  useEffect(() => {
    if (reduce) {
      write(target)
      return
    }
    write(0)
    if (progress.get() >= trigger) fire()
    return () => controls.current?.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, target, decimals, suffix])

  useMotionValueEvent(progress, 'change', (p) => {
    if (reduce) return
    if (p >= trigger) fire()
    else reset()
  })

  return <span ref={ref} className={className} />
}
