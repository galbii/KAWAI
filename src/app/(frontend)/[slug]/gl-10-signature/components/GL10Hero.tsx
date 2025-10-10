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
  const [showLogo, setShowLogo] = useState<'show' | 'hide' | 'done'>('show')

  // Animation sequence controller - KAWAI fades in, then out, then rest appears
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 200),    // Stage 1: KAWAI Logo fades in
      setTimeout(() => setShowLogo('hide'), 1200),    // Hide KAWAI logo after 1s visible
      setTimeout(() => {
        setShowLogo('done')
        setAnimationStage(2)                          // Stage 2: Show Signature Event
      }, 2000),                                        // Total 2s before next content
      setTimeout(() => setAnimationStage(3), 2200),   // Stage 3: GL-10 + Body text (200ms after stage 2)
      setTimeout(() => setAnimationStage(4), 2400)    // Stage 4: CTA button (200ms after stage 3)
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
          {/* Stone Brown Gradient Overlay - matches signature popup */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900" />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Stage 1: KAWAI Logo - Fades in, then out */}
          <AnimatePresence mode="wait">
            {showLogo !== 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: showLogo === 'show' ? 1 : 0,
                  y: showLogo === 'show' ? 0 : -30
                }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="flex justify-center mb-8"
              >
                <Image
                  src="/images/logos/kawai-logo-red.png"
                  alt="KAWAI"
                  width={120}
                  height={30}
                  priority
                  className="w-auto h-6 md:h-8"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 2: BABY GRAND (White) */}
          <AnimatePresence>
            {animationStage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="mb-4"
              >
                <h1
                  className="font-serif font-light tracking-wide"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    color: '#FFFFFF',
                    lineHeight: 1.2
                  }}
                >
                  BABY GRAND
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 3: Signature Sale + Body Text */}
          <AnimatePresence>
            {animationStage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <h2
                  className="font-serif font-normal tracking-wide"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    color: '#D4AF37',
                    lineHeight: 1.3
                  }}
                >
                  Signature Sale
                </h2>

                <p
                  className="text-lg md:text-xl lg:text-2xl font-light max-w-3xl mx-auto"
                  style={{
                    color: '#FFFFFF'
                  }}
                >
                  Claim your invitation to get access to free delivery and tuning as well as exclusive invitational pricing.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stage 4: CTA Button */}
          <AnimatePresence>
            {animationStage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="pt-6"
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
                  <span className="relative z-10">Claim Your Invite</span>

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
        {animationStage >= 4 && (
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
