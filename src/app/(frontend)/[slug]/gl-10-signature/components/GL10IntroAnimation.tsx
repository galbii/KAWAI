'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GL10IntroAnimationProps {
  onComplete: () => void
}

export default function GL10IntroAnimation({ onComplete }: GL10IntroAnimationProps) {
  const [stage, setStage] = useState<'logo' | 'event' | 'complete'>('logo')

  useEffect(() => {
    // Stage 1: Show Kawai Logo + EST 1927 (3 seconds)
    const logoTimer = setTimeout(() => {
      setStage('event')
    }, 3000)

    return () => clearTimeout(logoTimer)
  }, [])

  useEffect(() => {
    if (stage === 'event') {
      // Stage 2: Show Baby Grand Sale Event (3 seconds)
      const eventTimer = setTimeout(() => {
        setStage('complete')
        onComplete()
      }, 3000)

      return () => clearTimeout(eventTimer)
    }
    return undefined
  }, [stage, onComplete])

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      >
        <source src="/assets/videos/Hero_compressed.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      {/* Content Container */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Stage 1: EST 1927 Only */}
          {stage === 'logo' && (
            <motion.div
              key="logo-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center"
            >
              {/* EST 1927 in Red - Larger and Centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-kawai-red text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-[0.3em] uppercase">
                  EST 1927
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Stage 2: Baby Grand Sale Event */}
          {stage === 'event' && (
            <motion.div
              key="event-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-8 px-4"
            >
              {/* Main Heading - Georgia Font, More Prominent */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="text-white text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-center leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Baby Grand
                <br />
                <span className="text-[#D4AF37]">Sale Event</span>
              </motion.h1>

              {/* CTA Text - Enhanced entrance */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2,
                  ease: [0.22, 1, 0.36, 1] // Custom easing for smooth entrance
                }}
                className="text-white text-2xl md:text-3xl lg:text-4xl tracking-wide"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                Reserve your spot now
              </motion.p>

              {/* Loading Spinner */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="mt-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="w-10 h-10 border-3 border-white/20 border-t-kawai-red rounded-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
