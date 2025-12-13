'use client'

/**
 * NAMM 2026 Hero Section - Premium Minimal Design
 * Full viewport hero with continuous horizontal scrolling background
 * Optimized for mobile performance with CSS animations
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/namm-utils'

// Background images from general folder
const HERO_IMAGES = [
  '/images/namm/general/TK7_7390.jpg',
  '/images/namm/general/CA98R_Side_Dynamic.jpg',
  '/images/namm/general/_MG_7325.jpg',
  '/images/namm/general/KAWAI_K_Serie_Detail-33(1).jpg',
  '/images/namm/general/018.jpg',
  'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
] as const

// Mobile-optimized subset (fewer images for better performance)
const HERO_IMAGES_MOBILE = [
  '/images/namm/general/TK7_7390.jpg',
  '/images/namm/general/_MG_7325.jpg',
  '/images/namm/general/018.jpg',
  'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
] as const

// NAMM logo variants for cycling - defined outside component to prevent stale closures
const NAMM_LOGOS = [
  '/images/namm/NS_Logo_White.png',
  '/images/namm/NS_Logo_Blue.png',
] as const

interface HeroSectionProps {
  /** Additional CSS classes */
  className?: string
}

/**
 * NAMM 2026 Premium Hero Section
 *
 * Features:
 * - Continuous horizontal scrolling background of piano images
 * - Centered dual-logo composition (Kawai + NAMM)
 * - Minimal, elegant typography
 * - Apple-like premium aesthetic
 * - Fully responsive and accessible
 * - Respects prefers-reduced-motion
 * - Optimized CSS animations for mobile performance
 *
 * Design Philosophy:
 * - Less is more - let the brand and imagery speak
 * - Premium luxury aesthetic
 * - Focus on visual impact over information density
 * - Performance-first approach for mobile devices
 */
export default function HeroSection({
  className,
}: HeroSectionProps) {
  const reducedMotion = prefersReducedMotion()
  const [nammLogoIndex, setNammLogoIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cycle NAMM logo every 4 seconds with smooth fade
  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      setNammLogoIndex((prev) => {
        const newIndex = (prev + 1) % NAMM_LOGOS.length
        const currentLogo = NAMM_LOGOS[newIndex] ?? NAMM_LOGOS[0]!
        console.log('[NAMM Logo] Cycling to index:', newIndex, '- Logo:', currentLogo)
        return newIndex
      })
    }, 4000) // Changed from 800ms to 4000ms (4 seconds)

    return () => clearInterval(interval)
  }, [reducedMotion])

  // Handle smooth scroll to next section
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#booth-experience')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Select images based on viewport
  const imagesToUse = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES
  const imageWidth = isMobile ? 400 : 800
  const imageQuality = isMobile ? 75 : 90

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-kawai-black',
        'pt-16', // Account for fixed header height (h-16 = 64px)
        className
      )}
    >
      {/* CSS Keyframes for smooth scrolling */}
      <style jsx>{`
        @keyframes scroll-desktop {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-4000px, 0, 0);
          }
        }
        @keyframes scroll-mobile {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-1200px, 0, 0);
          }
        }
        .hero-scroll-container {
          will-change: transform;
          animation: ${isMobile ? 'scroll-mobile' : 'scroll-desktop'} ${isMobile ? '30s' : '60s'} linear infinite;
        }
        .hero-scroll-container.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Continuous Scrolling Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full overflow-hidden">
          {/* Scrolling container with duplicated images for seamless loop */}
          <div
            className={cn(
              'absolute inset-0 flex hero-scroll-container',
              reducedMotion && 'paused'
            )}
          >
            {/* First set of images */}
            {imagesToUse.map((src, index) => (
              <div
                key={`set1-${index}`}
                className="relative h-full flex-shrink-0"
                style={{ width: `${imageWidth}px` }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={index === 0}
                  quality={imageQuality}
                  className="object-cover"
                  sizes={`${imageWidth}px`}
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {imagesToUse.map((src, index) => (
              <div
                key={`set2-${index}`}
                className="relative h-full flex-shrink-0"
                style={{ width: `${imageWidth}px` }}
              >
                <Image
                  src={src}
                  alt=""
                  quality={imageQuality}
                  fill
                  className="object-cover"
                  sizes={`${imageWidth}px`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Centered Composition */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
          {/* NAMM Logo - Small, Above with smooth crossfade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-[80px] md:max-w-[100px] h-[27px] md:h-[33px] -mt-8 md:-mt-12"
          >
            {/* Subtle blur background */}
            <div className="absolute left-0 right-0 -inset-x-12 top-[-0.75rem] bottom-[-2rem] bg-black/20 backdrop-blur-md rounded-xl" />

            {/* AnimatePresence WITHOUT mode="wait" for true crossfade (both logos visible during transition) */}
            <AnimatePresence>
              <motion.div
                key={nammLogoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5, // 1.5 second smooth crossfade
                  ease: [0.4, 0.0, 0.2, 1.0] // Smooth cubic-bezier easing
                }}
                className="absolute inset-0"
              >
                <Image
                  src={NAMM_LOGOS[nammLogoIndex] ?? NAMM_LOGOS[0]!}
                  alt="The NAMM Show"
                  width={600}
                  height={200}
                  priority
                  className="w-full h-auto relative z-10"
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>
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

          {/* Decorative Line under Kawai Logo */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="w-24 md:w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
          />

          {/* "Instrumental to Life." Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide -mt-4 md:-mt-6"
            style={{
              fontFamily: 'BuenaParkJF, Georgia, serif',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)'
            }}
          >
            Instrumental to Life.
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
              className="px-8 py-3 md:px-10 md:py-4 bg-white text-kawai-black text-base md:text-lg font-semibold rounded-md hover:bg-kawai-pearl transition-all duration-300 hover:scale-105 shadow-lg text-center"
            >
              Learn More
            </button>
            <a
              href="https://kawai.us"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 md:px-10 md:py-4 bg-kawai-red text-white text-base md:text-lg font-semibold rounded-md hover:bg-kawai-red/90 transition-all duration-300 hover:scale-105 shadow-lg text-center"
            >
              Visit Kawai.us
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
