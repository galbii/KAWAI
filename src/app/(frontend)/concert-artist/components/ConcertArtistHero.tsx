'use client'

import { useEffect, useState } from 'react'
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

  const ctaVariants: Variants = {
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

  const handleExploreCollection = () => {
    const modelGridSection = document.getElementById('model-grid')
    if (modelGridSection) {
      modelGridSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: 'none' }}
        onLoadedData={(e) => {
          const video = e.target as HTMLVideoElement
          video.currentTime = 13.10
          video.play().catch(() => {
            // Fallback if autoplay fails
          })
        }}
      >
        <source src="/videos/CA.webm" type="video/webm" />
        <source src="/videos/CA.mp4" type="video/mp4" />
      </video>
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/60 z-[5]" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-start px-6 pt-48 md:pt-56 lg:pt-64 pb-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        <div className="max-w-6xl space-y-6">
          {/* Eyebrow */}
          <motion.p
            variants={eyebrowVariants}
            className="text-xs sm:text-sm font-light uppercase tracking-[0.3em] text-white/70"
          >
            KAWAI Concert Artist Series
          </motion.p>

          {/* Brand Positioning */}
          <motion.div
            variants={h1Variants}
            className="space-y-4"
          >
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] text-white tracking-tight">
              The Sound of Mastery
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={subheadingVariants}
            className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-white/80 tracking-wide"
          >
            From First Touch to Final Bow
          </motion.p>

          {/* Separator */}
          <motion.div
            variants={ctaVariants}
            className="flex justify-center pt-2"
          >
            <div className="w-24 h-px bg-white/30" />
          </motion.div>

          {/* Value Proposition */}
          <motion.p
            variants={ctaVariants}
            className="mx-auto max-w-3xl text-sm sm:text-base font-light leading-relaxed text-white/70 tracking-wide"
          >
            100% wooden keys. Shigeru Kawai SK-EX concert grand sampling. 97 years of Japanese craftsmanship.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={ctaVariants}
            className="flex justify-center items-center pt-8"
          >
            <button
              onClick={handleExploreCollection}
              className="group relative px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-medium tracking-wider uppercase text-white border border-white/40 hover:border-white/80 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">Explore the Collection</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500" />
            </button>
          </motion.div>
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
