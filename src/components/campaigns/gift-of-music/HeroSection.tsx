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
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content - Full width with proper container */}
      <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-8 py-20 sm:py-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-6xl mx-auto"
        >
          {/* Kawai Logo with Location Name */}
          {locationName && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center justify-center gap-4 sm:gap-6 mb-6"
            >
              <Image
                src="/images/logos/kawai-logo-red-2x.png"
                alt="Kawai Piano"
                width={200}
                height={40}
                className="object-contain flex-shrink-0 drop-shadow-2xl h-8 sm:h-12 w-auto"
                priority
                quality={90}
              />
              <div className="font-bold tracking-wide text-white text-3xl sm:text-4xl md:text-5xl drop-shadow-2xl">
                {locationName.toUpperCase()}
              </div>
            </motion.div>
          )}

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-12 leading-[1.1] drop-shadow-2xl"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kawai-gold via-yellow-300 to-kawai-gold">
              Give the Gift of Music
            </span>
          </motion.h1>

          {/* KMS Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <Image
              src="/images/kms/KMS Logo.png"
              alt="KMS Music School"
              width={500}
              height={70}
              className="h-12 sm:h-14 lg:h-16 w-auto mx-auto drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Urgency Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-kawai-red/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <span className="text-white font-semibold text-sm sm:text-base">
                ⏰ Only {spotsRemaining} spots remaining!
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            {onCTAClick && (
              <button
                onClick={onCTAClick}
                className="px-10 py-5 bg-gradient-to-r from-kawai-red to-red-700 hover:from-kawai-red/90 hover:to-red-800 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl min-w-[280px] border-2 border-white/20"
              >
                🎁 RESERVE MY FREE LESSON NOW
              </button>
            )}
            <button
              onClick={() => {
                const nextSection = document.querySelector('section')
                nextSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-white/80 hover:text-white font-semibold text-sm transition-colors flex items-center gap-2 group"
            >
              Learn More
              <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
