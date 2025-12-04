'use client'

/**
 * NAMM 2026 Booth Experience Hero Section
 * Immersive hero showcasing the booth experience
 */

import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ExperienceHeroProps {
  className?: string
}

export default function ExperienceHero({ className }: ExperienceHeroProps) {
  return (
    <section
      className={cn(
        'relative min-h-[70vh] flex items-center justify-center overflow-hidden',
        'bg-black',
        className
      )}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/namm/general/TK7_7390.jpg"
            alt="Kawai Booth at NAMM 2026"
            fill
            priority
            quality={90}
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
              Step Into the
              <span className="block text-[#C41E3A] mt-2">Kawai Experience</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light max-w-3xl leading-relaxed"
          >
            Immerse yourself in the ultimate piano showcase at NAMM 2026
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap gap-3 justify-center pt-4"
          >
            {[
              'Hands-On Demos',
              'Live Performances',
              'Expert Consultations',
              'Exclusive Offers',
            ].map((feature) => (
              <span
                key={feature}
                className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm md:text-base"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            <button
              onClick={() => {
                const section = document.querySelector('#interactive-features')
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="group px-8 py-4 bg-gradient-to-r from-[#E31937] to-[#FF3B55] text-white text-lg font-semibold rounded-md
                         hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Explore the Booth
            </button>
            <button
              onClick={() => {
                const section = document.querySelector('#schedule')
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-md
                         border-2 border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
            >
              View Schedule
            </button>
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            className="pt-8 border-t border-white/20"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-white/80">
              <div>
                <span className="text-sm uppercase tracking-wider text-white/60">Dates</span>
                <p className="text-lg font-semibold text-white">January 22-24, 2026</p>
              </div>
              <div className="hidden md:block w-px bg-white/20" />
              <div>
                <span className="text-sm uppercase tracking-wider text-white/60">Location</span>
                <p className="text-lg font-semibold text-white">Anaheim Convention Center</p>
              </div>
              <div className="hidden md:block w-px bg-white/20" />
              <div>
                <span className="text-sm uppercase tracking-wider text-white/60">Booth</span>
                <p className="text-lg font-semibold text-white">TBA</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            const section = document.querySelector('#interactive-features')
            section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          <span className="text-white/60 text-sm uppercase tracking-wider">Scroll</span>
          <svg
            className="w-6 h-6 text-white/60"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
