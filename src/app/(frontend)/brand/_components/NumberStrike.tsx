'use client'

import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import { EASE_OUT_EXPO } from './motion'

type Props = {
  /** When true, the count fires and plays to completion on a timer. */
  active: boolean
  target: number
  suffix?: string
  decimals?: number
  reduce: boolean
  className?: string
  /** Seconds the count-up takes. */
  duration?: number
  /** Seconds to wait before counting (for time-based stagger across a row). */
  delay?: number
}

function format(n: number, decimals: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * A stat counter that counts up on a *timer* once its scene is active — never
 * scrubbed to scroll. It always reaches its target (and holds) regardless of
 * where the user stops scrolling, and resets when the scene is left so it can
 * replay on re-entry.
 */
export default function NumberStrike({
  active,
  target,
  suffix = '',
  decimals = 0,
  reduce,
  className,
  duration = 1.2,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const controls = useRef<ReturnType<typeof animate> | null>(null)

  const write = (n: number) => {
    if (ref.current) ref.current.textContent = format(n, decimals) + suffix
  }

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce, target, decimals, suffix, duration, delay])

  return <span ref={ref} className={className} />
}
