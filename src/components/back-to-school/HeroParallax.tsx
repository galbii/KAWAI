'use client'

import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * Drifts the hero's poster copy up and out while the footage behind it stays.
 * A pass-through wrapper: `children` is rendered on the server, so the h1 is
 * still in the initial HTML — only the transform is client work.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -90])
  const opacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  if (reduceMotion) {
    return (
      <div ref={ref} className="relative z-10 flex flex-col flex-1">
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="relative z-10 flex flex-col flex-1 will-change-transform"
    >
      {children}
    </motion.div>
  )
}
