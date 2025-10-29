'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

export default function ConcertArtistHero() {
  const shouldReduceMotion = useReducedMotion()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 1.5,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.3
      }
    }
  }

  const eyebrowVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: [0.4, 0, 0.2, 1] as const }
    }
  }

  const h1Variants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0 : 1, ease: [0.4, 0, 0.2, 1] as const }
    }
  }

  const subheadingVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: [0.4, 0, 0.2, 1] as const }
    }
  }

  const scrollIndicatorVariants: Variants = {
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const
      }
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/concert-artist/hero-ca901.jpg"
          alt="Concert Artist Series Piano"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        <div className="max-w-5xl space-y-8">
          {/* Eyebrow */}
          <motion.p
            variants={eyebrowVariants}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-kawai-red"
          >
            Introducing
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={h1Variants}
            className="font-serif text-5xl font-bold leading-tight text-white md:text-7xl"
            style={{ fontFamily: 'Crimson Text, serif' }}
          >
            Concert Artist Series
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={subheadingVariants}
            className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl"
          >
            Authentic wooden keys. Shigeru Kawai sound. Four expressions.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          variants={scrollIndicatorVariants}
          animate={shouldReduceMotion ? {} : 'animate'}
        >
          <svg
            className="h-8 w-8 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
