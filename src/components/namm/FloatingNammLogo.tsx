'use client'

/**
 * Floating NAMM Logo - Cycles between white and blue versions
 * Fixed position in bottom right corner
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/namm-utils'

export default function FloatingNammLogo() {
  const [nammLogoIndex, setNammLogoIndex] = useState(0)
  const reducedMotion = prefersReducedMotion()

  // NAMM logo variants for cycling
  const nammLogos = [
    '/images/namm/NS_Logo_White.png',
    '/images/namm/NS_Logo_Blue.png',
  ]

  // Cycle NAMM logo every 800ms
  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      setNammLogoIndex((prev) => (prev + 1) % nammLogos.length)
    }, 800) // Change every 800ms for faster cycling

    return () => clearInterval(interval)
  }, [reducedMotion, nammLogos.length])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
      className="fixed bottom-8 left-8 z-50 w-[120px] md:w-[160px]"
    >
      <Image
        key={nammLogoIndex}
        src={nammLogos[nammLogoIndex]}
        alt="The NAMM Show"
        width={600}
        height={200}
        priority
        className="w-full h-auto"
      />
    </motion.div>
  )
}
