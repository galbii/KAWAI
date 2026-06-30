'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from './motion'

type CountUpProps = {
  /** Final value to count to. */
  end: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** Seconds the count-up takes. */
  duration?: number
  className?: string
}

/**
 * Counts up to `end` the first time it scrolls into view. SSR renders the final
 * value (so crawlers and no-JS users see the real number); the client resets to
 * zero and animates once visible. Respects prefers-reduced-motion.
 */
export function CountUp({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  const format = (n: number) =>
    prefix +
    n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    if (!inView) {
      el.textContent = format(0)
      return
    }
    const controls = animate(0, end, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        el.textContent = format(v)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, end, decimals, prefix, suffix, duration])

  return (
    <span ref={ref} className={className}>
      {format(end)}
    </span>
  )
}
