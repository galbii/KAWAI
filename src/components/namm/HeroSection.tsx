'use client'

/**
 * NAMM 2026 Hero Section - Premium Minimal Design
 * Full viewport hero with continuous horizontal scrolling background
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/namm-utils'

// Background images from general folder
const HERO_IMAGES = [
  '/images/namm/general/TK7_7390.jpg',
  '/images/namm/general/CA98R_Side_Dynamic.jpg',
  '/images/namm/general/_MG_7325.jpg',
  '/images/namm/general/KAWAI_K_Serie_Detail-33(1).jpg',
  '/images/namm/general/018.jpg',
] as const

interface HeroSectionProps {
  /** Additional CSS classes */
  className?: string
  /** Scroll speed in pixels per second */
  scrollSpeed?: number
}

/**
 * NAMM 2026 Premium Hero Section
 *
 * Features:
 * - Continuous horizontal scrolling background of piano images
 * - Centered dual-logo composition (Kawai + NAMM)
 * - Minimal, elegant typography
 * - Dark gradient overlay for sophistication
 * - Apple-like premium aesthetic
 * - Fully responsive and accessible
 * - Respects prefers-reduced-motion
 *
 * Design Philosophy:
 * - Less is more - let the brand and imagery speak
 * - Premium luxury aesthetic
 * - Focus on visual impact over information density
 */
export default function HeroSection({
  className,
  scrollSpeed = 30, // pixels per second
}: HeroSectionProps) {
  const reducedMotion = prefersReducedMotion()
  const [nammLogoIndex, setNammLogoIndex] = useState(0)

  // NAMM logo variants for cycling
  const nammLogos = [
    '/images/namm/NS_Logo_White.png',
    '/images/namm/NS_Logo_Blue.png',
  ]

  // Cycle NAMM logo every 800ms
  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      setNammLogoIndex((prev) => {
        const newIndex = (prev + 1) % nammLogos.length
        const currentLogo = nammLogos[newIndex] ?? nammLogos[0]!
        console.log('[NAMM Logo] Cycling to index:', newIndex, '- Logo:', currentLogo)
        return newIndex
      })
    }, 800)

    return () => clearInterval(interval)
  }, [reducedMotion, nammLogos.length])

  // Handle smooth scroll to next section
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#featured-products')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-kawai-black',
        className
      )}
    >
      {/* Continuous Scrolling Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full overflow-hidden">
          {/* Scrolling container with duplicated images for seamless loop */}
          <motion.div
            className="absolute inset-0 flex"
            animate={
              reducedMotion
                ? {}
                : {
                    x: [0, -4800], // Move left by total width of image set (800px * 6 images)
                  }
            }
            transition={{
              duration: 100, // Slow, smooth scroll
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* First set of images */}
            {HERO_IMAGES.map((src, index) => (
              <div
                key={`set1-${index}`}
                className="relative h-full flex-shrink-0 w-[800px]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={index === 0}
                  quality={90}
                  className="object-cover"
                  sizes="800px"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {HERO_IMAGES.map((src, index) => (
              <div
                key={`set2-${index}`}
                className="relative h-full flex-shrink-0 w-[800px]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  quality={90}
                  className="object-cover"
                  sizes="800px"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dark gradient overlay for readability and sophistication */}
        <div className="absolute inset-0 bg-gradient-to-b from-kawai-black/50 via-kawai-black/60 to-kawai-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-kawai-black via-transparent to-transparent" />
      </div>

      {/* Main Content - Centered Composition */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* NAMM Logo - Small, Above */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-[80px] md:max-w-[100px]"
          >
            <Image
              key={nammLogoIndex}
              src={nammLogos[nammLogoIndex] ?? nammLogos[0]!}
              alt="The NAMM Show"
              width={600}
              height={200}
              priority
              className="w-full h-auto"
              unoptimized
            />
          </motion.div>

          {/* Kawai Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className="relative w-full max-w-md md:max-w-2xl"
          >
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="Kawai"
              width={800}
              height={200}
              priority
              className="w-full h-auto"
            />
          </motion.div>

          {/* "Experience" Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="text-2xl md:text-4xl lg:text-5xl font-light text-white tracking-wide -mt-4"
          >
            Experience
          </motion.div>

          {/* Event Details - Minimal Typography */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            className="space-y-2 md:space-y-3 pt-4"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 tracking-tight">
              January 22–24, 2026
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/70 font-light">
              Anaheim Convention Center
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-6"
          >
            <button
              onClick={scrollToNextSection}
              className="px-8 py-3 md:px-10 md:py-4 bg-white text-kawai-black text-base md:text-lg font-semibold rounded-md
                         hover:bg-kawai-pearl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Learn More
            </button>
            <button
              onClick={() => {
                const lineup = document.querySelector('#featured-products')
                if (lineup) {
                  lineup.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="px-8 py-3 md:px-10 md:py-4 bg-transparent text-white text-base md:text-lg font-semibold rounded-md
                         border-2 border-white hover:bg-white hover:text-kawai-black transition-all duration-300 hover:scale-105"
            >
              View Lineup
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
