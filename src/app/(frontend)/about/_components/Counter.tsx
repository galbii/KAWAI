'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Split a stat string like "2.4M+" into its numeric target and trailing suffix. */
function parseValue(value: string): { target: number; suffix: string; decimals: number } {
  const match = value.match(/^([\d.,]+)(.*)$/)
  if (!match) return { target: 0, suffix: value, decimals: 0 }
  const numeric = (match[1] ?? '').replace(/,/g, '')
  const suffix = match[2] ?? ''
  const fraction = numeric.split('.')[1]
  return { target: parseFloat(numeric) || 0, suffix, decimals: fraction ? fraction.length : 0 }
}

function format(n: number, decimals: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** Animates a numeric stat from zero to its target the first time it scrolls into view. */
export default function Counter({ value, className }: { value: string; className?: string }) {
  const { target, suffix, decimals } = parseValue(value)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(() => format(reduce ? target : 0, decimals))

  useEffect(() => {
    if (reduce) {
      setDisplay(format(target, decimals))
      return
    }
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v, decimals)),
    })
    return () => controls.stop()
  }, [inView, reduce, target, decimals])

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}
