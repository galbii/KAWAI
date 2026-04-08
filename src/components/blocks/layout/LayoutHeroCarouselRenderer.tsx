"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { LayoutHeroCarouselBlock, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/fallbacks/media'
import { trackCTAClick, trackBlockImpression } from '@/lib/analytics/unified-tracking'

interface LayoutHeroCarouselRendererProps extends LayoutHeroCarouselBlock {
  headingLevel?: 'h1' | 'h2' | 'h3'
}

export function LayoutHeroCarouselRenderer({
  slides,
  settings,
  styling,
  impressionTracking,
  headingLevel = 'h3',
}: LayoutHeroCarouselRendererProps & { impressionTracking?: any }) {
  // Validate slides
  if (!slides || slides.length === 0) {
    return null
  }

  // Extract settings with defaults
  const autoPlayDuration = settings?.autoPlayDuration ?? 7000
  const enableAutoPlay = settings?.enableAutoPlay ?? true
  const enableLoop = settings?.enableLoop ?? true
  const enableKeyboardNav = settings?.enableKeyboardNav ?? true
  const enableTouchSwipe = settings?.enableTouchSwipe ?? true
  const showNavigationDots = settings?.showNavigationDots ?? true
  const showPlayPauseButton = settings?.showPlayPauseButton ?? true
  const enableKenBurnsEffect = settings?.enableKenBurnsEffect ?? true

  // Extract styling with defaults
  const height = styling?.height ?? 'screen'
  const contentPosition = styling?.contentPosition ?? 'bottom-left'
  const overlayStyle = styling?.overlayStyle ?? 'glassmorphism'

  // State management
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(enableAutoPlay)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Refs
  const sectionRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Constants
  const minSwipeDistance = 50

  // Height class mapping
  const heightClasses = {
    screen: 'h-screen min-h-[600px] max-h-[900px]',
    large: 'h-[900px] min-h-[600px]',
    medium: 'h-[700px] min-h-[500px]',
    small: 'h-[500px] min-h-[400px]',
  }

  // Content position class mapping
  const positionClasses = {
    'bottom-left': 'bottom-8 left-8 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-16 right-8 sm:right-12 lg:right-1/3',
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2 right-auto max-w-3xl',
    'bottom-right': 'bottom-8 right-8 sm:bottom-12 sm:right-12 lg:bottom-16 lg:right-16 left-8 sm:left-12 lg:left-1/3',
    'center-left': 'top-1/2 -translate-y-1/2 left-8 sm:left-12 lg:left-16 right-8 sm:right-12 lg:right-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4xl w-full px-8',
    'center-right': 'top-1/2 -translate-y-1/2 right-8 sm:right-12 lg:right-16 left-8 sm:left-12 lg:left-1/2',
    'top-left': 'top-8 left-8 sm:top-12 sm:left-12 lg:top-16 lg:left-16 right-8 sm:right-12 lg:right-1/3',
    'top-center': 'top-8 left-1/2 -translate-x-1/2 right-auto max-w-3xl',
    'top-right': 'top-8 right-8 sm:top-12 sm:right-12 lg:top-16 lg:right-16 left-8 sm:left-12 lg:left-1/3',
  }

  // Overlay style class mapping
  const overlayClasses = {
    glassmorphism: 'backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl',
    gradient: 'bg-gradient-to-t from-kawai-black/80 to-kawai-black/40 rounded-2xl p-8 sm:p-10 lg:p-12',
    solid: 'bg-kawai-black/90 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-2xl',
    none: 'p-4',
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isInView || slides.length <= 1 || !enableAutoPlay) return

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        enableLoop
          ? (prevIndex + 1) % slides.length
          : Math.min(prevIndex + 1, slides.length - 1)
      )
    }, autoPlayDuration)

    return () => clearTimeout(slideTimer)
  }, [isPlaying, currentIndex, isInView, slides.length, autoPlayDuration, enableAutoPlay, enableLoop])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      enableLoop
        ? (prevIndex === 0 ? slides.length - 1 : prevIndex - 1)
        : Math.max(prevIndex - 1, 0)
    )
  }, [slides.length, enableLoop])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      enableLoop
        ? (prevIndex + 1) % slides.length
        : Math.min(prevIndex + 1, slides.length - 1)
    )
  }, [slides.length, enableLoop])

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    setTouchEnd(null)
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX)
    }
    setIsPlaying(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX)
    }
  }

  const onTouchEnd = () => {
    if (!enableTouchSwipe || !touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }

    setTimeout(() => setIsPlaying(enableAutoPlay), 2000)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, enableKeyboardNav, goToPrevious, goToNext])

  // Reduced motion support
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reset image loaded state when slide changes
  useEffect(() => {
    setImageLoaded(false)
  }, [currentIndex])

  useEffect(() => {
    trackBlockImpression({
      blockType: 'layout-hero-carousel',
      blockData: { impressionTracking: impressionTracking as any },
      position: 0,
    })
  }, [])

  const TitleTag = motion[headingLevel] as typeof motion.h3

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden',
        heightClasses[height as keyof typeof heightClasses]
      )}
    >
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              ease: 'easeInOut',
            }}
            className="absolute inset-0"
          >
            {(() => {
              const currentSlide = slides[currentIndex]
              if (!currentSlide) return null

              // Extract media from slide - it can be a Media object or string (ID)
              // When properly configured with imageField, it should be a full Media object
              const slideMedia = currentSlide.backgroundImage as Media | string | null | undefined

              // Get image props with fallback handling
              const imageProps = getImagePropsWithFallback(
                slideMedia,
                '/images/defaults/hero-fallback.jpg',
                'hero',
                {
                  fill: true,
                  className: 'object-cover',
                  sizes: '100vw',
                  priority: currentIndex === 0,
                  context: {
                    type: 'hero'
                  }
                }
              )

              return (
                <>
                  {/* Background Image with Optional Ken Burns Effect */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: enableKenBurnsEffect && imageLoaded ? 1.05 : 1,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : autoPlayDuration / 1000,
                      ease: 'linear',
                    }}
                  >
                    <Image
                      {...imageProps}
                      alt={currentSlide.title || 'Hero slide'}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </motion.div>

                  {/* Gradient Overlays for Better Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-kawai-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/60 via-transparent to-transparent" />


                  {/* Content Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={cn(
                      'absolute z-20',
                      positionClasses[contentPosition as keyof typeof positionClasses]
                    )}
                  >
                    {/* Overlay Container */}
                    <div className={overlayClasses[overlayStyle as keyof typeof overlayClasses]}>
                      <div className="space-y-6">
                        {/* Small Label */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <span className="text-xs text-kawai-pearl tracking-[0.2em] uppercase font-medium">
                            {currentSlide.category || 'Featured'}
                          </span>
                        </motion.div>

                        {/* Title */}
                        <TitleTag
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light font-serif text-white leading-tight"
                        >
                          {currentSlide.title}
                        </TitleTag>

                        {/* Description */}
                        {currentSlide.description && (
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl"
                          >
                            {currentSlide.description}
                          </motion.p>
                        )}

                        {/* CTA Button */}
                        {currentSlide.ctaText && currentSlide.ctaLink && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="pt-4"
                          >
                            <Link
                              href={currentSlide.ctaLink}
                              target={currentSlide.ctaOpenInNewTab ? '_blank' : undefined}
                              rel={currentSlide.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-kawai-red px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all duration-500 ease-out hover:bg-kawai-red/90 hover:shadow-[0_8px_32px_rgba(196,30,58,0.5)] hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-kawai-red/50 focus:ring-offset-2 focus:ring-offset-transparent"
                              onClick={() => {
                                const slide = slides[currentIndex]
                                trackCTAClick({
                                  blockType: 'layout-hero-carousel',
                                  blockData: { ctaTracking: (slide as any).ctaTracking },
                                  ctaText: slide?.ctaText || '',
                                  destination: slide?.ctaLink || '',
                                  position: currentIndex,
                                  additionalProps: { slide_title: slide?.title, slide_category: slide?.category },
                                })
                              }}
                            >
                              <span className="relative z-10">{currentSlide.ctaText}</span>
                              <svg
                                className="relative z-10 h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                              </svg>
                              {/* Hover shine effect */}
                              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[800ms] ease-out group-hover:translate-x-full skew-x-12" />
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )
            })()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots - Bottom Center */}
        {showNavigationDots && slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsPlaying(false)
                  setTimeout(() => setIsPlaying(enableAutoPlay), 2000)
                }}
                className={cn(
                  'transition-all duration-300 rounded-full',
                  index === currentIndex
                    ? 'w-12 h-3 bg-white shadow-lg'
                    : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>
        )}

        {/* Play/Pause Button - Bottom Right */}
        {showPlayPauseButton && enableAutoPlay && slides.length > 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-30 w-12 h-12 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
            aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
          >
            {isPlaying ? (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        )}
      </div>
    </section>
  )
}
