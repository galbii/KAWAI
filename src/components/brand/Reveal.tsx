'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE_OUT_EXPO } from './motion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds. */
  delay?: number
  /** Rise distance in px before settling. */
  y?: number
  /** Animation duration in seconds. */
  duration?: number
}

/**
 * Scroll-into-view fade + rise. Plays once when the element enters the
 * viewport. Respects prefers-reduced-motion (renders statically, no transform).
 * This is the page-level analogue of the About page's scene fades — the same
 * cinematic feel without the pinned-canvas scroll machinery.
 */
export function Reveal({ children, className, delay = 0, y = 28, duration = 0.7 }: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  )
}
