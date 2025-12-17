'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  className?: string
  locationName?: string
  spotsRemaining?: number
  onCTAClick?: () => void
}

export default function HeroSection({ className, locationName, spotsRemaining = 20, onCTAClick }: HeroSectionProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background Image - Full viewport height */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pub-8da77878131e4c099bb045b914814926.r2.dev/kawaimusicshool/kawaichristmas/christmas2.png"
          alt="Christmas Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Enhanced overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/45 to-black/65" />
      </div>

      {/* Content - Full width with proper container */}
      <div className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-8 py-32 sm:py-40">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* ZONE 1: BRAND + VALUE PROPOSITION */}

          {/* Kawai Logo with Location Name */}
          {locationName && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-12"
            >
              <Image
                src="/images/logos/kawai-logo-red-2x.png"
                alt="Kawai Piano"
                width={200}
                height={40}
                className="object-contain flex-shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] h-10 sm:h-14 w-auto"
                priority
                quality={90}
              />
              <div className="font-bold tracking-wide text-white text-3xl sm:text-4xl md:text-5xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                {locationName.toUpperCase()}
              </div>
            </motion.div>
          )}

          {/* Main Heading + Subheading (tight grouping) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 sm:mb-16"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)] px-4 mb-6 sm:mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-kawai-gold via-yellow-300 to-kawai-gold filter drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                Give the Gift of Music
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] px-4">
              Start your musical journey with{' '}
              <span className="font-semibold text-kawai-gold">free enrollment, free registration,</span>{' '}
              and a{' '}
              <span className="font-semibold text-kawai-gold">complimentary first lesson</span>
              {' '}— our gift to you this holiday season!
            </p>
          </motion.div>

          {/* ZONE 2: PROVIDER + URGENCY */}

          {/* KMS Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-10 sm:mb-14"
          >
            <Image
              src="/images/kms/KMS Logo.png"
              alt="KMS Music School"
              width={500}
              height={70}
              className="h-14 sm:h-16 lg:h-20 w-auto mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
              priority
            />
          </motion.div>

          {/* Urgency Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-kawai-red/95 backdrop-blur-md rounded-full shadow-[0_8px_24px_rgba(196,30,58,0.4)] border-2 border-white/30 mb-4">
              <span className="text-white font-semibold text-base sm:text-lg">
                ⏰ Only {spotsRemaining} spots remaining — Offer ends January 3rd
              </span>
            </div>

            {/* Holiday Special Price */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-white/60 text-xl sm:text-2xl line-through font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                $150
              </span>
              <span className="text-kawai-red text-3xl sm:text-4xl font-bold drop-shadow-[0_4px_16px_rgba(196,30,58,0.6)]">
                $0
              </span>
              <span className="text-kawai-gold text-2xl sm:text-3xl font-bold drop-shadow-[0_4px_12px_rgba(212,175,55,0.5)]">
                Holiday Special!
              </span>
            </div>
          </motion.div>

          {/* ZONE 3: ACTION + TRUST */}

          {/* CTA Buttons - Side by Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
          >
            {onCTAClick && (
              <button
                onClick={onCTAClick}
                className="w-full sm:flex-1 px-8 py-5 bg-gradient-to-r from-kawai-red to-red-700 hover:from-kawai-red/90 hover:to-red-800 text-white rounded-xl font-bold text-lg sm:text-xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-[0_12px_32px_rgba(196,30,58,0.5)] hover:shadow-[0_16px_40px_rgba(196,30,58,0.6)] border-2 border-white/20"
              >
                Reserve My Free Lesson
              </button>
            )}
            <button
              onClick={() => {
                const nextSection = document.querySelector('section')
                nextSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:flex-1 px-8 py-5 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white border-2 border-white/40 hover:border-white/60 rounded-xl font-bold text-lg sm:text-xl transition-all transform hover:scale-105 hover:-translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2 group"
            >
              See What's Included
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
