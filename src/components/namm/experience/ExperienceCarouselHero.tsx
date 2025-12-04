'use client'

// WIP: This component will be enhanced with real NAMM booth images and additional features
// Current version uses placeholder images and basic carousel functionality

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselSlide {
  id: number
  image: string
  alt: string
}

// WIP: Replace with actual NAMM booth images
const PLACEHOLDER_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    image: '/images/namm/booth-placeholder-1.jpg',
    alt: 'Kawai NAMM Booth Overview'
  },
  {
    id: 2,
    image: '/images/namm/booth-placeholder-2.jpg',
    alt: 'Kawai Grand Piano Display'
  },
  {
    id: 3,
    image: '/images/namm/booth-placeholder-3.jpg',
    alt: 'Kawai Digital Piano Collection'
  },
  {
    id: 4,
    image: '/images/namm/booth-placeholder-4.jpg',
    alt: 'Kawai Interactive Experience Zone'
  }
]

const AUTO_PLAY_INTERVAL = 5000 // 5 seconds

export default function ExperienceCarouselHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const totalSlides = PLACEHOLDER_SLIDES.length

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

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="NAMM 2026 Booth Experience Carousel"
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
          {/* WIP: Using placeholder - replace with actual R2-optimized images */}
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 z-10" />

            {/* Placeholder background - will be replaced with actual images */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

            {/* WIP: Uncomment when actual images are available
            <Image
              src={PLACEHOLDER_SLIDES[currentSlide].image}
              alt={PLACEHOLDER_SLIDES[currentSlide].alt}
              fill
              priority={currentSlide === 0}
              className="object-cover"
              sizes="100vw"
            />
            */}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4">
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl text-center"
        >
          <h1 className="mb-6 text-5xl font-light tracking-tight text-white md:text-7xl lg:text-8xl">
            Experience the Kawai Booth
            <br />
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              at NAMM 2026
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg font-light text-gray-300 md:text-xl lg:text-2xl">
            Step into innovation. Discover our latest pianos and revolutionary technology.
          </p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-light uppercase tracking-widest text-gray-400">
                Explore
              </span>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
            </div>
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
          aria-label="Previous slide"
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
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {PLACEHOLDER_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'group relative h-2 rounded-full transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-white/50',
              currentSlide === index ? 'w-12 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
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

      {/* Auto-play indicator */}
      <div className="absolute left-8 top-8 z-30 hidden md:block">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-sm">
          <div
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              isAutoPlaying ? 'bg-green-400' : 'bg-white/30'
            )}
          />
          <span className="text-xs font-light uppercase tracking-widest text-white/70">
            {isAutoPlaying ? 'Auto' : 'Paused'}
          </span>
        </div>
      </div>
    </section>
  )
}
