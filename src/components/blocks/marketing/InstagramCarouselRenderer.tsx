"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { MarketingInstagramCarouselBlock } from '@/payload-types'
import { cn } from '@/lib/utils'

interface InstagramCarouselRendererProps extends MarketingInstagramCarouselBlock {}

// Type guard to validate Instagram URL (supports /p/, /reels/, /reel/, /tv/)
function isValidInstagramUrl(url: string | null | undefined): url is string {
  if (!url) return false
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reels?|tv)\/[\w-]+\/?$/.test(url)
}

export function InstagramCarouselRenderer({
  heading,
  subheading,
  instagramHandle,
  posts,
  settings,
  styling,
  ctaButton,
}: InstagramCarouselRendererProps) {
  // Validate posts
  if (!posts || posts.length === 0) {
    return null
  }

  // Filter valid posts
  const validPosts = posts.filter((post) => isValidInstagramUrl(post.instagramUrl))

  if (validPosts.length === 0) {
    return null
  }

  // Extract settings with defaults
  const autoPlay = settings?.autoPlay ?? false
  const autoPlayDuration = settings?.autoPlayDuration ?? 8000
  const enableLoop = settings?.enableLoop ?? true
  const showNavigationArrows = settings?.showNavigationArrows ?? true
  const showProgressIndicator = settings?.showProgressIndicator ?? true
  const enableKeyboardNav = settings?.enableKeyboardNav ?? true
  const enableTouchSwipe = settings?.enableTouchSwipe ?? true

  // Extract styling with defaults
  const theme = styling?.theme ?? 'light'
  const layout = styling?.layout ?? 'centered'
  const spacing = styling?.spacing ?? 'comfortable'

  // State management
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Refs
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  // Constants
  const minSwipeDistance = 50

  // Theme class mapping - Japanese-inspired colors
  const themeClasses = {
    light: 'bg-kawai-pearl text-kawai-charcoal',
    dark: 'bg-kawai-charcoal text-kawai-pearl',
    red: 'bg-gradient-to-br from-kawai-red/10 to-kawai-red/5 text-kawai-charcoal',
    transparent: 'bg-transparent text-kawai-charcoal',
  }

  // Spacing class mapping
  const spacingClasses = {
    compact: 'py-12 sm:py-16',
    comfortable: 'py-16 sm:py-24',
    spacious: 'py-24 sm:py-32 lg:py-40',
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isInView || validPosts.length <= 1 || !autoPlay || isHovered) return

    const slideTimer = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        enableLoop
          ? (prevIndex + 1) % validPosts.length
          : Math.min(prevIndex + 1, validPosts.length - 1)
      )
    }, autoPlayDuration)

    return () => clearTimeout(slideTimer)
  }, [isPlaying, currentIndex, isInView, validPosts.length, autoPlayDuration, autoPlay, enableLoop, isHovered])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      enableLoop
        ? prevIndex === 0
          ? validPosts.length - 1
          : prevIndex - 1
        : Math.max(prevIndex - 1, 0)
    )
    setIsPlaying(false)
  }, [validPosts.length, enableLoop])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      enableLoop
        ? (prevIndex + 1) % validPosts.length
        : Math.min(prevIndex + 1, validPosts.length - 1)
    )
    setIsPlaying(false)
  }, [validPosts.length, enableLoop])

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    setTouchEnd(null)
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX)
    }
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
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardNav, goToPrevious, goToNext])

  // Get current post
  const currentPost = validPosts[currentIndex]
  if (!currentPost) return null

  return (
    <section
        ref={sectionRef}
        className={cn(
          'relative w-full overflow-hidden transition-colors duration-700',
          themeClasses[theme as keyof typeof themeClasses],
          spacingClasses[spacing as keyof typeof spacingClasses]
        )}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Japanese minimalist typography */}
        {(heading || subheading || instagramHandle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 sm:mb-16 lg:mb-20 space-y-4"
          >
            {instagramHandle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5 text-kawai-red"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-sm font-medium tracking-wider uppercase opacity-80">
                  {instagramHandle}
                </span>
              </motion.div>
            )}

            {heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight">
                {heading}
              </h2>
            )}

            {subheading && (
              <p className="text-base sm:text-lg text-current/70 max-w-2xl mx-auto leading-relaxed">
                {subheading}
              </p>
            )}

            {/* Decorative line - inspired by shoji screens */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-kawai-red to-transparent"
            />
          </motion.div>
        )}

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Carousel */}
          <div
            className={cn(
              'relative mx-auto',
              layout === 'centered' && 'max-w-xl',
              layout === 'side-preview' && 'max-w-4xl',
              layout === 'full-width' && 'max-w-6xl'
            )}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Instagram Embed Container */}
            <div className="relative">
              <AnimatePresence mode="wait" custom={currentIndex}>
                <motion.div
                  key={currentIndex}
                  custom={currentIndex}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  {/* Category Badge */}
                  {currentPost.category && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                    >
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-kawai-red text-white text-xs font-medium tracking-wider uppercase rounded-full shadow-lg">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        {currentPost.category}
                      </span>
                    </motion.div>
                  )}

                  {/* Instagram Embed - Using iframe embed */}
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl">
                    {/* Instagram iframe embed */}
                    <div className="flex justify-center">
                      <iframe
                        src={`${currentPost.instagramUrl}embed/captioned/`}
                        className="w-full max-w-[540px] min-w-[326px] border-0"
                        style={{
                          height: '800px',
                          maxHeight: '90vh',
                        }}
                        frameBorder="0"
                        scrolling="no"
                        allowTransparency
                        allow="encrypted-media"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Caption - Japanese typography influence */}
                  {currentPost.caption && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-sm sm:text-base text-current/80 leading-relaxed max-w-lg mx-auto">
                        {currentPost.caption}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows - Minimal design */}
            {showNavigationArrows && validPosts.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  onClick={goToPrevious}
                  disabled={!enableLoop && currentIndex === 0}
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 lg:-translate-x-12',
                    'w-12 h-12 sm:w-14 sm:h-14',
                    'flex items-center justify-center',
                    'bg-white/90 backdrop-blur-sm',
                    'border border-black/10',
                    'rounded-full shadow-lg',
                    'transition-all duration-300',
                    'hover:bg-kawai-red hover:text-white hover:border-kawai-red hover:scale-110',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/90 disabled:hover:text-current disabled:hover:scale-100',
                    'group'
                  )}
                  aria-label="Previous post"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  onClick={goToNext}
                  disabled={!enableLoop && currentIndex === validPosts.length - 1}
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 lg:translate-x-12',
                    'w-12 h-12 sm:w-14 sm:h-14',
                    'flex items-center justify-center',
                    'bg-white/90 backdrop-blur-sm',
                    'border border-black/10',
                    'rounded-full shadow-lg',
                    'transition-all duration-300',
                    'hover:bg-kawai-red hover:text-white hover:border-kawai-red hover:scale-110',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/90 disabled:hover:text-current disabled:hover:scale-100',
                    'group'
                  )}
                  aria-label="Next post"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </>
            )}
          </div>

          {/* Progress Indicator - Minimalist dots */}
          {showProgressIndicator && validPosts.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
            >
              {validPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsPlaying(false)
                  }}
                  className={cn(
                    'transition-all duration-500 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 rounded-full',
                    index === currentIndex
                      ? 'w-8 h-2 bg-kawai-red shadow-lg shadow-kawai-red/30'
                      : 'w-2 h-2 bg-current/20 hover:bg-current/40'
                  )}
                  aria-label={`Go to post ${index + 1}`}
                  aria-current={index === currentIndex}
                />
              ))}

              {/* Counter text - refined typography */}
              <span className="ml-4 text-sm text-current/60 font-light tracking-wider tabular-nums">
                {currentIndex + 1} / {validPosts.length}
              </span>
            </motion.div>
          )}

          {/* CTA Button */}
          {ctaButton?.enabled && ctaButton.text && ctaButton.url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex justify-center mt-10 sm:mt-12"
            >
              <Link
                href={ctaButton.url}
                target={ctaButton.openInNewTab ? '_blank' : undefined}
                rel={ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'group relative inline-flex items-center gap-3',
                  'px-8 py-4 rounded-full',
                  'bg-kawai-charcoal text-white',
                  'font-medium text-sm tracking-wider uppercase',
                  'transition-all duration-500',
                  'hover:bg-kawai-red hover:shadow-xl hover:shadow-kawai-red/20 hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                  'overflow-hidden'
                )}
              >
                <span className="relative z-10">{ctaButton.text}</span>
                <svg
                  className="relative z-10 w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>

                {/* Subtle shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Keyboard hint - subtle and refined */}
        {enableKeyboardNav && validPosts.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-center mt-6 sm:mt-8"
          >
            <p className="text-xs text-current/40 font-light tracking-wider">
              Use arrow keys to navigate
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
