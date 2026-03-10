'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CollectionForBrowser } from '@/lib/payload/queries'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CollectionVideoCarouselProps {
  collections: CollectionForBrowser[]
  autoplayInterval?: number
  height?: 'medium' | 'large' | 'fullscreen'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse YouTube URL to extract video ID.
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, raw 11-char ID
 */
function parseYouTubeId(url: string): string | null {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct ID
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1] ?? null
  }

  return null
}

// ─── Height mapping ───────────────────────────────────────────────────────────

const heightClasses = {
  medium: 'h-[50vh] min-h-[400px]',
  large: 'h-[70vh] min-h-[500px]',
  fullscreen: 'h-screen',
} as const

// ─── Text alignment mapping ───────────────────────────────────────────────────

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
} as const

// ─── Text color mapping ───────────────────────────────────────────────────────

const colorClasses = {
  white: 'text-white',
  black: 'text-kawai-black',
  'kawai-red': 'text-kawai-red',
  'kawai-gold': 'text-[#D4AF37]',
} as const

// ─── Heading size mapping ─────────────────────────────────────────────────────

const headingSizeClasses = {
  small: 'text-3xl md:text-4xl lg:text-5xl',
  medium: 'text-4xl md:text-5xl lg:text-6xl',
  large: 'text-5xl md:text-6xl lg:text-7xl',
  xl: 'text-6xl md:text-7xl lg:text-8xl',
} as const

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

// ─── Individual Slide ─────────────────────────────────────────────────────────

interface SlideProps {
  collection: CollectionForBrowser
  isActive: boolean
  priority?: boolean
}

function CarouselSlide({ collection, isActive, priority = false }: SlideProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const videoId = collection.youtubeUrl ? parseYouTubeId(collection.youtubeUrl) : null
  const fallbackImage = collection.mediaUrl ?? collection.imageUrl ?? null
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : fallbackImage

  const safeTextAlignment = (collection.textAlignment as keyof typeof alignmentClasses) ?? 'left'
  const safeTextColor = (collection.textColor as keyof typeof colorClasses) ?? 'white'
  const safeOverlayOpacity = collection.overlayOpacity ?? 50
  const safeHeadingSize = (collection.headingSize as keyof typeof headingSizeClasses) ?? 'large'

  const heading = collection.heading ?? collection.title
  const subheading = collection.subheading

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-[800ms] ease-in-out',
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      )}
      aria-hidden={!isActive}
    >
      {/* YouTube video background */}
      {videoId && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {/* Thumbnail shown until iframe loads */}
          {thumbnailUrl && (
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-700',
                isVideoLoaded ? 'opacity-0' : 'opacity-100'
              )}
            >
              <Image
                src={thumbnailUrl}
                alt={heading}
                fill
                className="object-cover"
                sizes="100vw"
                priority={priority}
              />
            </div>
          )}

          {/* Full-cover iframe — only mount when slide has been active at least once */}
          {isActive && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
              className={cn(
                'absolute top-1/2 left-1/2',
                'w-[177.77777778vh] min-w-full h-[56.25vw] min-h-full',
                '-translate-x-1/2 -translate-y-1/2',
                'pointer-events-none',
                'transition-opacity duration-1000',
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              )}
              allow="autoplay; loop"
              onLoad={() => setIsVideoLoaded(true)}
              title={`${heading} collection video`}
            />
          )}
        </div>
      )}

      {/* Fallback image background (no video) */}
      {!videoId && fallbackImage && (
        <div className="absolute inset-0">
          <Image
            src={fallbackImage}
            alt={heading}
            fill
            className="object-cover"
            sizes="100vw"
            priority={priority}
          />
        </div>
      )}

      {/* No media: dark base */}
      {!videoId && !fallbackImage && <div className="absolute inset-0 bg-kawai-black" />}

      {/* Gradient + noise overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0, 0, 0, ${(safeOverlayOpacity / 100) * 0.7}) 0%,
              rgba(0, 0, 0, ${(safeOverlayOpacity / 100) * 0.5}) 50%,
              rgba(0, 0, 0, ${(safeOverlayOpacity / 100) * 0.8}) 100%
            )
          `,
        }}
      >
        {/* Subtle grain — wabi-sabi texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        key={isActive ? 'active' : 'inactive'}
        className={cn(
          'relative z-20 h-full container mx-auto px-6 md:px-12',
          'flex flex-col justify-end pb-16 md:pb-20',
          alignmentClasses[safeTextAlignment] ?? alignmentClasses.left
        )}
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        {heading && (
          <motion.h2
            variants={itemVariants}
            className={cn(
              'font-bold leading-[1.1] tracking-tight mb-4',
              'drop-shadow-2xl',
              'font-[family-name:var(--font-brand-luxury)]',
              headingSizeClasses[safeHeadingSize] ?? headingSizeClasses.large,
              colorClasses[safeTextColor] ?? colorClasses.white
            )}
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)' }}
          >
            {heading}
          </motion.h2>
        )}

        {/* Decorative divider */}
        {heading && subheading && (
          <motion.div
            variants={itemVariants}
            className={cn(
              'w-16 h-[2px] mb-4',
              safeTextAlignment === 'center' && 'mx-auto',
              safeTextAlignment === 'right' && 'ml-auto'
            )}
            style={{
              background: `linear-gradient(90deg, ${
                safeTextColor === 'kawai-red'
                  ? '#E11922'
                  : safeTextColor === 'kawai-gold'
                    ? '#D4AF37'
                    : safeTextColor === 'black'
                      ? '#1a1a1a'
                      : '#ffffff'
              } 0%, transparent 100%)`,
            }}
          />
        )}

        {subheading && (
          <motion.p
            variants={itemVariants}
            className={cn(
              'text-lg md:text-xl lg:text-2xl',
              'leading-relaxed max-w-2xl',
              'font-light tracking-wide mb-8',
              'opacity-90 drop-shadow-lg',
              colorClasses[safeTextColor] ?? colorClasses.white
            )}
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            {subheading}
          </motion.p>
        )}

        {/* Explore CTA */}
        <motion.div variants={itemVariants}>
          <Link
            href={`/pianos/${collection.handle}`}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'text-sm font-semibold tracking-wide',
              'bg-kawai-red text-white hover:bg-kawai-red-700',
              'transition-colors duration-300 rounded'
            )}
          >
            Explore Collection
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CollectionVideoCarousel({
  collections,
  autoplayInterval = 6000,
  height = 'large',
}: CollectionVideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = collections.length

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total)
    },
    [total]
  )

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  // Auto-advance
  useEffect(() => {
    if (total <= 1 || isPaused) return

    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total)
    }, autoplayInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [total, isPaused, autoplayInterval])

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current
    if (!el || total <= 1) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }

    el.addEventListener('keydown', handleKey)
    return () => el.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext, total])

  // Nothing to render
  if (total === 0) return null

  const isSingle = total === 1
  const firstCollection = collections[0]
  if (!firstCollection) return null

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden bg-black', heightClasses[height])}
      tabIndex={isSingle ? undefined : 0}
      aria-label="Collection video carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Slides */}
      {collections.map((collection, i) => (
        <CarouselSlide
          key={collection.handle}
          collection={collection}
          isActive={i === activeIndex}
          priority={i === 0}
        />
      ))}

      {/* Arrow controls — only when multiple slides */}
      {!isSingle && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous collection"
            className={cn(
              'absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30',
              'w-11 h-11 flex items-center justify-center rounded-full',
              'bg-black/40 hover:bg-black/60 text-white',
              'transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white'
            )}
          >
            <svg viewBox="0 0 16 16" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={goNext}
            aria-label="Next collection"
            className={cn(
              'absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30',
              'w-11 h-11 flex items-center justify-center rounded-full',
              'bg-black/40 hover:bg-black/60 text-white',
              'transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white'
            )}
          >
            <svg viewBox="0 0 16 16" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2"
            role="tablist"
            aria-label="Carousel slides"
          >
            {collections.map((collection, i) => (
              <button
                key={collection.handle}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to slide ${i + 1}: ${collection.heading ?? collection.title}`}
                onClick={() => goTo(i)}
                className="p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded"
              >
                <motion.div
                  animate={{
                    width: i === activeIndex ? 24 : 8,
                    backgroundColor: i === activeIndex ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)',
                  }}
                  transition={{ duration: 0.22 }}
                  className="h-1.5 rounded-full"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
