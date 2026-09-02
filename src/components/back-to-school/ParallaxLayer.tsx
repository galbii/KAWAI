'use client'

import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

interface ParallaxLayerProps {
  children: ReactNode
  /** Pixels of travel at the section's entry and exit. */
  from?: number
  to?: number
  className?: string
  'aria-hidden'?: boolean
}

/**
 * Drifts a decorative layer against the scroll.
 *
 * The measured element is the outer wrapper, never the transformed one — using
 * the moving node as its own scroll target feeds its transform back into the
 * measurement.
 */
export function ParallaxLayer({
  children,
  from = 70,
  to = -70,
  className,
  ...rest
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [from, to])

  return (
    <div ref={ref} className={className} {...rest}>
      {reduceMotion ? (
        <div>{children}</div>
      ) : (
        <motion.div style={{ y }} className="will-change-transform">
          {children}
        </motion.div>
      )}
    </div>
  )
}
