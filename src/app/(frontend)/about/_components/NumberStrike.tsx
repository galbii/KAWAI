'use client'

import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'

type Props = {
  progress: MotionValue<number>
  /** Master-scroll range across which the count animates from 0 → target. */
  window: readonly [number, number]
  target: number
  suffix?: string
  decimals?: number
  reduce: boolean
  className?: string
}

function format(n: number, decimals: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * A scroll-coupled stat counter. The number ticks up as the user
 * scrolls through its window — unlike the old on-view-once Counter,
 * this one stays married to scroll position and can rewind.
 */
export default function NumberStrike({
  progress,
  window: w,
  target,
  suffix = '',
  decimals = 0,
  reduce,
  className,
}: Props) {
  const value = useTransform(progress, [w[0], w[1]], [0, target])
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.textContent = reduce ? format(target, decimals) + suffix : format(0, decimals) + suffix
  }, [reduce, target, decimals, suffix])

  useMotionValueEvent(value, 'change', (v) => {
    if (!ref.current || reduce) return
    ref.current.textContent = format(v, decimals) + suffix
  })

  return <span ref={ref} className={className} />
}
