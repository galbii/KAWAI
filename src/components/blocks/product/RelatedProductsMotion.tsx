'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Scroll-entry motion primitives for the Related Products block.
 *
 * Server components compose these around server-rendered cards — data
 * fetching stays on the server, only the reveal choreography is client-side.
 * All variants collapse to static rendering under prefers-reduced-motion.
 */

const EASE_ELEGANT = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  /** Stagger offset in seconds — cards pass index * step */
  delay?: number
  className?: string
}

/** Fade + rise reveal, fired once when the element enters the viewport. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.7, ease: EASE_ELEGANT, delay }}
    >
      {children}
    </motion.div>
  )
}

interface RevealRuleProps {
  className?: string
}

/** Hairline rule that draws across from the left as the section enters view. */
export function RevealRule({ className }: RevealRuleProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className} aria-hidden="true" />
  }

  return (
    <motion.div
      className={`origin-left ${className ?? ''}`}
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.9, ease: EASE_ELEGANT }}
    />
  )
}
