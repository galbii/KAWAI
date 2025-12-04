'use client'

/**
 * Floating NAMM Logo - Smooth crossfade between white and blue versions
 * Fixed position in bottom left corner with elegant fade transitions
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/namm-utils'

export default function FloatingNammLogo() {
  const [nammLogoIndex, setNammLogoIndex] = useState(0)
  const reducedMotion = prefersReducedMotion()

  // NAMM logo variants for cycling
  const nammLogos = [
    '/images/namm/NS_Logo_White.png',
    '/images/namm/NS_Logo_Blue.png',
  ]

  // Cycle NAMM logo every 4 seconds (slower, more elegant)
  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      setNammLogoIndex((prev) => (prev + 1) % nammLogos.length)
    }, 4000) // Changed from 800ms to 4000ms (4 seconds)

    return () => clearInterval(interval)
  }, [reducedMotion, nammLogos.length])

  // Get current logo with fallback to first logo (type-safe for strict mode)
  const currentLogo = nammLogos[nammLogoIndex] ?? nammLogos[0]!

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
      className="fixed bottom-8 left-8 z-50 w-[120px] md:w-[160px]"
    >
      {/* AnimatePresence enables exit animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={nammLogoIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2, // Slower fade (1.2 seconds)
            ease: [0.4, 0.0, 0.2, 1.0] // Smooth cubic-bezier easing
          }}
          className="absolute inset-0"
        >
          <Image
            src={currentLogo}
            alt="The NAMM Show"
            width={600}
            height={200}
            priority
            className="w-full h-auto"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
