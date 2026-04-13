'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { MarketingI2LBlock, Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getImagePropsWithFallback } from '@/lib/fallbacks/media'
import { trackVideoInteraction, trackCTAClick, trackBlockImpression } from '@/lib/analytics/unified-tracking'

interface MarketingI2LRendererProps extends MarketingI2LBlock {}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function MarketingI2LRenderer({
  sectionLabel,
  subheading,
  logo,
  videos,
  settings,
  styling,
  impressionTracking,
}: MarketingI2LRendererProps & { impressionTracking?: any }) {
  // Validate videos
  if (!videos || videos.length === 0) {
    return null
  }

  // Extract settings with defaults
  const enableKeyboardNav = settings?.enableKeyboardNav ?? true

  // Extract styling with defaults
  const theme = styling?.theme ?? 'dark'

  // State management
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Refs
  const sectionRef = useRef<HTMLElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  // Constants
  const minSwipeDistance = 50
  const currentVideo = videos[currentIndex]
  const youtubeId = currentVideo ? extractYouTubeId(currentVideo.youtubeUrl || '') : null

  // Theme classes
  const themeClasses = {
    dark: {
      bg: 'bg-kawai-charcoal',
      text: 'text-kawai-pearl',
      textMuted: 'text-kawai-pearl/70',
      sectionLabel: 'text-kawai-red',
      thumbnailBg: 'bg-kawai-black/40',
      thumbnailBorder: 'border-kawai-pearl/10',
      thumbnailActive: 'border-kawai-red',
    },
    light: {
      bg: 'bg-white',
      text: 'text-kawai-black',
      textMuted: 'text-kawai-black/70',
      sectionLabel: 'text-kawai-red',
      thumbnailBg: 'bg-kawai-pearl',
      thumbnailBorder: 'border-kawai-black/10',
      thumbnailActive: 'border-kawai-red',
    },
  }

  const currentTheme = themeClasses[theme as keyof typeof themeClasses] || themeClasses.light

  // Block impression tracking
  useEffect(() => {
    trackBlockImpression({
      blockType: 'marketing-i2l',
      blockData: { impressionTracking: impressionTracking as any },
    })
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1))
  }, [videos.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }, [videos.length])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
    trackVideoInteraction({
      blockType: 'marketing-i2l',
      blockData: { videoTracking: (videos[index] as any)?.videoTracking },
      action: 'video_play',
      videoId: videos[index]?.youtubeUrl || '',
      videoTitle: videos[index]?.title || '',
    })
    // Scroll thumbnail into view
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[index] as HTMLElement
      thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [videos])

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    if (e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX)
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX)
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

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

  return (
    <section ref={sectionRef} className={cn('py-24 sm:py-32 lg:py-40', currentTheme.bg)}>
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-[1440px]">
        {/* Kawai Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center mb-12 lg:mb-20"
        >
          <div className="relative w-56 h-14 sm:w-64 sm:h-16 lg:w-80 lg:h-20 mb-6">
            <Image
              src="/images/logos/kawai-logo-red-2x.png"
              alt="Kawai Piano"
              fill
              className="object-contain"
              priority
            />
          </div>
          {subheading && (
            <p className={cn('text-center text-base sm:text-lg lg:text-xl max-w-3xl', currentTheme.textMuted)}>
              {subheading}
            </p>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Left Column: Current Video Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 order-2 lg:order-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              {currentVideo && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Section Label / Category Badge */}
                  <div className={cn('text-xs font-semibold tracking-[0.25em] uppercase mb-5 sm:mb-7', currentTheme.sectionLabel)}>
                    {currentVideo.eyebrowText || sectionLabel || 'Instrumental To Life'}
                  </div>

                  {/* Title */}
                  <h2 className={cn('text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-light font-serif leading-tight mb-6 sm:mb-8', currentTheme.text)}>
                    {currentVideo.title}
                  </h2>

                  {/* Description */}
                  {currentVideo.description && (
                    <p className={cn('text-base sm:text-lg md:text-xl leading-relaxed', currentTheme.textMuted)}>
                      {currentVideo.description}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thumbnail Carousel in Left Column - Only show if more than 1 video */}
            {videos.length > 1 && (
              <div
                className="w-full mt-8 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div
                  ref={thumbnailsRef}
                  className="flex gap-3 p-1"
                >
                  {videos.map((video, index) => {
                    const thumbYoutubeId = extractYouTubeId(video.youtubeUrl || '')
                    const thumbnailMedia = video.thumbnailOverride as Media | string | null | undefined
                    const thumbnailUrl =
                      thumbnailMedia && typeof thumbnailMedia === 'object' && 'url' in thumbnailMedia
                        ? thumbnailMedia.url
                        : thumbYoutubeId
                        ? `https://img.youtube.com/vi/${thumbYoutubeId}/mqdefault.jpg`
                        : null

                    return (
                      <button
                        key={index}
                        onClick={() => goToIndex(index)}
                        className={cn(
                          'relative flex-shrink-0 w-24 h-[54px] rounded-md overflow-hidden transition-all duration-300 border-2',
                          index === currentIndex
                            ? 'border-kawai-red ring-2 ring-kawai-red ring-offset-2 ring-offset-transparent scale-105'
                            : currentTheme.thumbnailBorder + ' hover:scale-105 opacity-50 hover:opacity-100'
                        )}
                      >
                        {thumbnailUrl && (
                          <Image
                            src={thumbnailUrl}
                            alt={video.title || `Video ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        )}

                        {/* Duration Badge */}
                        {video.duration && (
                          <div className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-kawai-black/80 text-white text-[9px] font-medium rounded">
                            {video.duration}
                          </div>
                        )}

                        {/* Play Icon Overlay */}
                        {index !== currentIndex && (
                          <div className="absolute inset-0 bg-kawai-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CTA Buttons - Below thumbnail carousel */}
            {currentVideo && (currentVideo.ctaText || (currentVideo as any).secondaryCtaText) && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cta-${currentIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-wrap items-center gap-4 mt-10"
                >
                  {/* Primary CTA */}
                  {currentVideo.ctaText && currentVideo.ctaUrl && (
                    <Link
                      href={currentVideo.ctaUrl}
                      target={currentVideo.ctaOpenInNewTab ? '_blank' : undefined}
                      rel={currentVideo.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={() => {
                        trackCTAClick({
                          blockType: 'marketing-i2l',
                          blockData: { ctaTracking: (currentVideo as any)?.ctaTracking },
                          ctaText: currentVideo?.ctaText || '',
                          destination: currentVideo?.ctaUrl || '',
                          additionalProps: { video_title: currentVideo?.title, video_category: currentVideo?.category },
                        })
                      }}
                      className={cn(
                        'inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-300 rounded-sm',
                        currentVideo.ctaVariant === 'outline'
                          ? 'border-2 border-kawai-pearl text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black'
                          : 'bg-kawai-red text-white hover:bg-kawai-red-700 shadow-brand-red-glow hover:shadow-lg hover:-translate-y-0.5'
                      )}
                    >
                      {currentVideo.ctaText}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  )}

                  {/* Secondary CTA */}
                  {(currentVideo as any).secondaryCtaText && (currentVideo as any).secondaryCtaUrl && (
                    <Link
                      href={(currentVideo as any).secondaryCtaUrl}
                      target={(currentVideo as any).secondaryCtaOpenInNewTab ? '_blank' : undefined}
                      rel={(currentVideo as any).secondaryCtaOpenInNewTab ? 'noopener noreferrer' : undefined}
                      className={cn(
                        'inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-300 rounded-sm border-2',
                        theme === 'dark'
                          ? 'border-kawai-pearl/50 text-kawai-pearl hover:border-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black'
                          : 'border-kawai-black/30 text-kawai-black hover:border-kawai-black hover:bg-kawai-black hover:text-kawai-pearl'
                      )}
                    >
                      {(currentVideo as any).secondaryCtaText}
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Right Column: Video Player */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 relative order-1 lg:order-2 min-w-0"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Video Container with Navigation Arrows */}
            <div className="relative group w-full max-w-full">
              {/* YouTube Embed - Using aspect-video for proper 16:9 ratio */}
              <div className="relative w-full max-w-full aspect-video rounded-xl shadow-brand-premium overflow-hidden bg-kawai-black">
                <AnimatePresence mode="wait">
                  {youtubeId && (
                    <motion.iframe
                      key={youtubeId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      src={`https://www.youtube.com/embed/${youtubeId}?modestbranding=1&rel=0`}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={currentVideo?.title || 'Video player'}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Arrows - Only show if more than 1 video */}
              {videos.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-kawai-black/70 hover:bg-kawai-red border border-white/20 hover:border-kawai-red rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg z-10 backdrop-blur-sm"
                    aria-label="Previous video"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-kawai-black/70 hover:bg-kawai-red border border-white/20 hover:border-kawai-red rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg z-10 backdrop-blur-sm"
                    aria-label="Next video"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
