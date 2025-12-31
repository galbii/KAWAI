'use client'

/**
 * ArtistsHero Component
 *
 * Fullscreen carousel hero for KAWAI Artists page
 * Displays featured artists from Payload CMS with smooth transitions
 */

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Artist, Media } from '@/payload-types'

interface ArtistsHeroProps {
  artists: Artist[]
}

const AUTO_PLAY_INTERVAL = 5000 // 5 seconds

export default function ArtistsHero({ artists }: ArtistsHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const totalSlides = artists.length

  // Don't render if no artists
  if (totalSlides === 0) return null

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

  const currentArtist = artists[currentSlide]

  // Safety check - should never happen due to early return above
  if (!currentArtist) {
    console.error('[ArtistsHero] currentArtist is undefined, slide:', currentSlide)
    return null
  }

  // Get image URL - prioritize heroImageUrl for featured artists
  const getImageUrl = (artist: Artist): string => {
    // First check for heroImageUrl (hero-specific high-res image)
    if (artist.heroImageUrl) {
      return artist.heroImageUrl
    }

    // Fall back to regular image
    if (artist.image && typeof artist.image === 'object') {
      return (artist.image as Media).url || artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
    }
    return artist.imageUrl || '/images/defaults/artist-placeholder.jpg'
  }

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-kawai-charcoal"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="Featured KAWAI Artists Carousel"
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
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-kawai-charcoal/60 via-kawai-charcoal/40 to-kawai-charcoal/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-kawai-charcoal/50 via-transparent to-kawai-charcoal/50 z-10" />

            {/* Artist Image */}
            <Image
              src={getImageUrl(currentArtist)}
              alt={currentArtist.name}
              fill
              priority={currentSlide === 0}
              className="object-cover"
              sizes="100vw"
            />
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
          {/* Genre Badge */}
          {currentArtist.genre && (
            <motion.div
              className="mb-6 inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kawai-red/90 text-white text-sm font-medium backdrop-blur-sm">
                {currentArtist.genre.charAt(0).toUpperCase() + currentArtist.genre.slice(1)}
              </span>
            </motion.div>
          )}

          {/* Artist Name */}
          <h1 className="mb-6 text-5xl font-light tracking-tight text-white md:text-7xl lg:text-8xl">
            {currentArtist.name}
          </h1>

          {/* Short Bio */}
          {currentArtist.shortBio && (
            <p className="mx-auto max-w-2xl text-base font-light text-gray-300 md:text-lg mb-12 leading-relaxed">
              {currentArtist.shortBio}
            </p>
          )}

          {/* CTA Button */}
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href={`/artists/${currentArtist.slug}`}
              className={cn(
                'group inline-flex items-center gap-3 px-8 py-4 rounded-full',
                'bg-white text-kawai-charcoal hover:bg-white/90',
                'font-semibold text-base',
                'transition-all duration-300',
                'shadow-lg hover:shadow-xl hover:shadow-white/20',
                'hover:scale-105'
              )}
            >
              <span>View Profile</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Secondary CTA - Explore All Artists */}
            <a
              href="#artists-grid"
              className={cn(
                'group inline-flex items-center gap-3 px-8 py-4 rounded-full',
                'border-2 border-white/30 text-white hover:bg-white/10',
                'font-semibold text-base',
                'transition-all duration-300',
                'backdrop-blur-sm',
                'hover:border-white/50'
              )}
            >
              <span>Explore All</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-y-1"
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

      {/* Navigation Controls - Only show if more than 1 artist */}
      {totalSlides > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 items-center justify-between px-4 md:px-8">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className={cn(
                'group flex h-12 w-12 items-center justify-center rounded-full',
                'border border-white/20 bg-kawai-charcoal/30 backdrop-blur-sm',
                'transition-all duration-300 hover:bg-white/10 hover:border-white/40',
                'focus:outline-none focus:ring-2 focus:ring-kawai-red'
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
                'border border-white/20 bg-kawai-charcoal/30 backdrop-blur-sm',
                'transition-all duration-300 hover:bg-white/10 hover:border-white/40',
                'focus:outline-none focus:ring-2 focus:ring-kawai-red'
              )}
              aria-label="Next artist"
            >
              <ChevronRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
            {artists.map((artist, index) => (
              <button
                key={artist.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  'group relative h-2 rounded-full transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-kawai-red',
                  currentSlide === index ? 'w-12 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                )}
                aria-label={`Go to ${artist.name}`}
                aria-current={currentSlide === index}
              >
                {/* Progress bar for active slide */}
                {currentSlide === index && isAutoPlaying && (
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-kawai-red"
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
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-kawai-charcoal/30 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-light text-white">
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-light text-white/50">/</span>
              <span className="text-sm font-light text-white/50">
                {String(totalSlides).padStart(2, '0')}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <motion.a
          href="#artists-grid"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-wider font-medium">Explore All Artists</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.a>
      </div>
    </section>
  )
}
