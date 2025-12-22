'use client'

/**
 * NAMM 2026 Carousel Slide - Custom slide with scrolling background
 * Integrates into NewsCarousel with same visual style as NAMM hero page
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Background images from NAMM hero (same as HeroSection)
const HERO_IMAGES = [
  '/images/namm/general/TK7_7390.jpg',
  '/images/namm/general/CA98R_Side_Dynamic.jpg',
  '/images/namm/general/_MG_7325.jpg',
  '/images/namm/general/KAWAI_K_Serie_Detail-33(1).jpg',
  '/images/namm/general/018.jpg',
  'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
] as const

// Mobile-optimized subset
const HERO_IMAGES_MOBILE = [
  '/images/namm/general/TK7_7390.jpg',
  '/images/namm/general/_MG_7325.jpg',
  '/images/namm/general/018.jpg',
  'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
] as const

interface NAMMCarouselSlideProps {
  /** Reduced motion preference */
  prefersReducedMotion?: boolean
}

/**
 * NAMM Carousel Slide with Scrolling Background
 *
 * Features same continuous horizontal scroll as NAMM hero page
 * Maintains visual consistency across carousel items
 */
export function NAMMCarouselSlide({ prefersReducedMotion = false }: NAMMCarouselSlideProps) {
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

  // Select images based on viewport
  const imagesToUse = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES
  const imageWidth = isMobile ? 400 : 800
  const imageQuality = isMobile ? 75 : 90

  return (
    <>
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
        .namm-scroll-container {
          will-change: transform;
          animation: ${isMobile ? 'scroll-mobile' : 'scroll-desktop'} ${isMobile ? '30s' : '60s'} linear infinite;
        }
        .namm-scroll-container.paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Continuous Scrolling Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full overflow-hidden">
          {/* Scrolling container with duplicated images for seamless loop */}
          <div
            className={cn(
              'absolute inset-0 flex namm-scroll-container',
              prefersReducedMotion && 'paused'
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

      {/* Darker gradient overlay for better text contrast in carousel */}
      <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/90 via-kawai-black/50 to-kawai-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/70 via-transparent to-transparent z-10" />

      {/* Category Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-8 right-8 sm:top-12 sm:right-12 lg:top-16 lg:right-16 z-20"
      >
        <span className="inline-block px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase bg-kawai-red/90 backdrop-blur-sm text-white rounded-full shadow-xl border border-white/10">
          EVENT
        </span>
      </motion.div>

      {/* Content Overlay - Bottom Left with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-16 right-8 sm:right-12 lg:right-1/3 z-20"
      >
        {/* Glassmorphism Container */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
          <div className="space-y-6">
            {/* Small Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="text-xs text-kawai-pearl tracking-[0.2em] uppercase font-medium">
                January 22–24, 2026
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-white leading-tight"
            >
              Visit Kawai at NAMM 2026
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl"
            >
              Experience exclusive piano innovations, live artist performances, and hands-on demonstrations at our booth in Anaheim Convention Center.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-4"
            >
              <Link
                href="/namm-2026"
                className="inline-flex items-center space-x-3 bg-white hover:bg-kawai-red text-kawai-black hover:text-white px-8 py-4 rounded-full font-medium text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-2xl group"
              >
                <span>Plan Your Visit</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
