'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type RevealProps = {
  children: ReactNode
  /** Seconds of delay before the reveal begins — use to stagger siblings. */
  delay?: number
  /** Distance in px the element travels up into place. */
  y?: number
  className?: string
}

/**
 * Scroll-triggered entrance: fade + slide-up, fired once when the element
 * enters the viewport. Collapses to a static, fully-visible render when the
 * visitor prefers reduced motion.
 */
export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const reduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}
