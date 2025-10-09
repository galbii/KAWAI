'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GL10HeroProps {
  onBeginJourney: () => void
  className?: string
}

export default function GL10Hero({ onBeginJourney, className }: GL10HeroProps) {
  const [animationStage, setAnimationStage] = useState(0)

  // Animation sequence controller
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 500),   // Stage 1: GL-10 Baby Grand appears
      setTimeout(() => setAnimationStage(2), 1500),  // Stage 2: KAWAI Signature appears
      setTimeout(() => setAnimationStage(3), 2500)   // Stage 3: CTA appears
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/gl10-hero.jpg"
            alt="GL-10 Baby Grand Piano"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Warm Off-White Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-kawai-pearl/60 via-kawai-pearl/40 to-kawai-pearl/70" />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">

          {/* Stage 1: GL-10 Baby Grand */}
          <AnimatePresence>
            {animationStage >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-4"
              >
                <h1
                  className="font-serif font-light tracking-wider"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    color: '#8B7355', // Earthy gold
                    lineHeight: 1.2
                  }}
                >
                  GL-10 Baby Grand
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 2: KAWAI Signature */}
          <AnimatePresence>
            {animationStage >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-12"
              >
                <h2
                  className="font-sans font-semibold tracking-wide"
                  style={{
                    fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
                    lineHeight: 1.3,
                    color: '#C41E3A' // kawai-red for visibility
                  }}
                >
                  KAWAI Signature
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 3: CTA Button */}
          <AnimatePresence>
            {animationStage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <button
                  onClick={onBeginJourney}
                  className={cn(
                    'group relative px-8 py-4 rounded-full',
                    'bg-kawai-red text-white font-medium',
                    'transition-all duration-300',
                    'hover:bg-kawai-red/90 hover:shadow-xl hover:scale-105',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                    'text-lg tracking-wide'
                  )}
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)'
                  }}
                >
                  <span className="relative z-10">Begin Your Journey</span>

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {animationStage >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-white/80"
            >
              <span className="text-sm tracking-wider uppercase">Scroll to Explore</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
