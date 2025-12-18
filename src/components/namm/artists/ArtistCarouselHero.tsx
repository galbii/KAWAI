'use client'

/**
 * ArtistCarouselHero Component
 *
 * Fullscreen carousel hero for NAMM 2026 Artists page
 * Design matches the ExperienceCarouselHero with artist-focused content
 */

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PERFORMANCES } from '../performances/performance-data'

interface ArtistSlide {
  id: string
  artistName: string
  genre?: string
  artistImage?: string
  performanceType: string
}

// Hero-specific image overrides
const HERO_IMAGE_OVERRIDES: Record<string, string> = {
  'David Snyder': 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/David%20Snyder%20Photo%202.jpg',
  'Sergio De Miguel': 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/sergio/sergiohero.jpg',
  'Artur Zakiyan': 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/artur/Artur%20Zakiyan%20Kawai-1%202.jpg',
  'Alec Van Khajadourian': 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/alec/Screenshot%202025-12-04%20at%2012.24.35%20AM.png'
}

// Get unique artists from performances data
const getUniqueArtists = (): ArtistSlide[] => {
  const artistMap = new Map<string, ArtistSlide>()

  PERFORMANCES.forEach((performance) => {
    if (!artistMap.has(performance.artistName)) {
      const slide: ArtistSlide = {
        id: performance.id,
        artistName: performance.artistName,
        performanceType: performance.performanceType
      }

      if (performance.genre !== undefined) {
        slide.genre = performance.genre
      }

      // Use hero-specific override if available, otherwise use performance image
      const heroOverride = HERO_IMAGE_OVERRIDES[performance.artistName]
      if (heroOverride !== undefined) {
        slide.artistImage = heroOverride
      } else if (performance.artistImage !== undefined) {
        slide.artistImage = performance.artistImage
      }

      artistMap.set(performance.artistName, slide)
    }
  })

  return Array.from(artistMap.values())
}

const ARTIST_SLIDES = getUniqueArtists()
const AUTO_PLAY_INTERVAL = 5000 // 5 seconds

export default function ArtistCarouselHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const totalSlides = ARTIST_SLIDES.length

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      handleNext()
    }, AUTO_PLAY_INTERVAL)

    return () => clearInterval(interval)
  }, [currentSlide, isAutoPlaying])

  const handlePrevious = useCallback(() => {
    setDirection('left')
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }, [totalSlides])

  const handleNext = useCallback(() => {
    setDirection('right')
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }, [totalSlides])

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 'right' : 'left')
    setCurrentSlide(index)
  }, [currentSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
        setIsAutoPlaying(false)
      } else if (e.key === 'ArrowRight') {
        handleNext()
        setIsAutoPlaying(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevious, handleNext])

  // Animation variants
  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.1
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }
    }
  }

  const currentArtist = ARTIST_SLIDES[currentSlide]

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black pt-16"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="NAMM 2026 Artist Lineup Carousel"
    >
      {/* Carousel Images */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10" />

            {/* Artist image or gradient background */}
            {currentArtist?.artistImage ? (
              <Image
                src={currentArtist.artistImage}
                alt={currentArtist.artistName}
                fill
                priority={currentSlide === 0}
                className={cn(
                  "object-cover",
                  currentArtist.artistName === 'Artur Zakiyan' ? 'object-[center_20%]' : ''
                )}
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <motion.div
          key={`content-${currentSlide}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl text-center"
        >
          <h1 className="mb-8 text-5xl font-light tracking-tight text-white md:text-7xl lg:text-8xl">
            {currentArtist?.artistName}
          </h1>

          <p className="mx-auto max-w-2xl text-base font-light text-gray-400 md:text-lg">
            Performing at NAMM 2026
          </p>

          {/* Learn More CTA Button */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href={`#performance-${currentArtist?.id || ''}`}
              className={cn(
                'group inline-flex items-center gap-3 px-8 py-4 rounded-full',
                'bg-white text-black hover:bg-white/90',
                'font-semibold text-base',
                'transition-all duration-300',
                'shadow-lg hover:shadow-xl hover:shadow-white/20',
                'hover:scale-105'
              )}
            >
              <span>View Performance</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-4 md:px-8">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className={cn(
            'group flex h-12 w-12 items-center justify-center rounded-full',
            'border border-white/20 bg-black/30 backdrop-blur-sm',
            'transition-all duration-300 hover:bg-white/10 hover:border-white/40',
            'focus:outline-none focus:ring-2 focus:ring-white/50'
          )}
          aria-label="Previous artist"
        >
          <ChevronLeft className="h-6 w-6 text-white transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className={cn(
            'group flex h-12 w-12 items-center justify-center rounded-full',
            'border border-white/20 bg-black/30 backdrop-blur-sm',
            'transition-all duration-300 hover:bg-white/10 hover:border-white/40',
            'focus:outline-none focus:ring-2 focus:ring-white/50'
          )}
          aria-label="Next artist"
        >
          <ChevronRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {ARTIST_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'group relative h-2 rounded-full transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-white/50',
              currentSlide === index ? 'w-12 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Go to ${ARTIST_SLIDES[index]?.artistName}`}
            aria-current={currentSlide === index}
          >
            {/* Progress bar for active slide */}
            {currentSlide === index && isAutoPlaying && (
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-white/50"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-30 hidden md:block">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-light text-white">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="text-sm font-light text-white/50">/</span>
          <span className="text-sm font-light text-white/50">
            {String(totalSlides).padStart(2, '0')}
          </span>
        </div>
      </div>

    </section>
  )
}
