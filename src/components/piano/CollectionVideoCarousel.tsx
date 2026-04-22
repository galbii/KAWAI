'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionForBrowser } from '@/lib/payload/queries'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CollectionVideoCarouselProps {
  collections: CollectionForBrowser[]
  category?: string | null
  autoplayInterval?: number
  height?: 'medium' | 'large' | 'fullscreen'
}

const CATEGORY_LABELS: Record<string, string> = {
  digital: 'Digital Pianos',
  grand: 'Grand Pianos',
  upright: 'Upright Pianos',
  hybrid: 'Hybrid Pianos',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1] ?? null
  }
  return null
}

const heightClasses = {
  medium: 'h-[50vh] min-h-[420px]',
  large: 'h-[70vh] min-h-[520px]',
  fullscreen: 'h-screen',
} as const

// ─── Animation variants ───────────────────────────────────────────────────────

const slideContentVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─── Background slide (media only) ───────────────────────────────────────────

function MediaSlide({
  collection,
  isActive,
  priority = false,
  overlayOpacity,
}: {
  collection: CollectionForBrowser
  isActive: boolean
  priority?: boolean
  overlayOpacity: number
}) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoId = collection.youtubeUrl ? parseYouTubeId(collection.youtubeUrl) : null
  const fallbackImage = collection.mediaUrl ?? collection.imageUrl ?? null
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : fallbackImage

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-[900ms] ease-in-out',
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0',
      )}
      aria-hidden={!isActive}
    >
      {/* YouTube */}
      {videoId && (
        <div className="absolute inset-0 overflow-hidden bg-black">
          {thumbnailUrl && (
            <div className={cn('absolute inset-0 transition-opacity duration-700', isVideoLoaded ? 'opacity-0' : 'opacity-100')}>
              <Image src={thumbnailUrl} alt={collection.title} fill className="object-cover" sizes="100vw" priority={priority} />
            </div>
          )}
          {isActive && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
              className={cn(
                'absolute top-1/2 left-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000',
                isVideoLoaded ? 'opacity-100' : 'opacity-0',
              )}
              allow="autoplay; loop"
              onLoad={() => setIsVideoLoaded(true)}
              title={`${collection.title} video`}
            />
          )}
        </div>
      )}

      {/* Static image */}
      {!videoId && fallbackImage && (
        <div className="absolute inset-0">
          <Image src={fallbackImage} alt={collection.title} fill className="object-cover" sizes="100vw" priority={priority} />
        </div>
      )}

      {/* Dark base */}
      {!videoId && !fallbackImage && <div className="absolute inset-0 bg-kawai-black" />}

      {/* Gradient overlay — heavier left for text, lighter right */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, rgba(0,0,0,${(overlayOpacity / 100) * 0.85}) 0%, rgba(0,0,0,${(overlayOpacity / 100) * 0.5}) 50%, rgba(0,0,0,${(overlayOpacity / 100) * 0.35}) 100%)`,
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CollectionVideoCarousel({
  collections,
  category,
  autoplayInterval = 4000,
  height = 'large',
}: CollectionVideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const total = collections.length
  const goTo = useCallback((index: number) => setActiveIndex(((index % total) + total) % total), [total])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (total <= 1 || isPaused) return
    const t = setInterval(() => setActiveIndex((i) => (i + 1) % total), autoplayInterval)
    return () => clearInterval(t)
  }, [total, isPaused, autoplayInterval])

  useEffect(() => {
    const el = containerRef.current
    if (!el || total <= 1) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    }
    el.addEventListener('keydown', handleKey)
    return () => el.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext, total])

  if (total === 0) return null

  const collection = collections[activeIndex] ?? collections[0]!
  const categoryLabel = category ? (CATEGORY_LABELS[category] ?? null) : null
  const overlayOpacity = collection.overlayOpacity ?? 50
const displayTitle = collection.heading ?? collection.title
  const idxDisplay = String(activeIndex + 1).padStart(2, '0')
  const totalDisplay = String(total).padStart(2, '0')

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden bg-black', heightClasses[height])}
      tabIndex={total > 1 ? 0 : undefined}
      aria-label="Collection carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Background media slides */}
      {collections.map((col, i) => (
        <MediaSlide
          key={col.handle}
          collection={col}
          isActive={i === activeIndex}
          priority={i === 0}
          overlayOpacity={overlayOpacity}
        />
      ))}

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-14 h-14 z-20 opacity-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="text-white w-full h-full">
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Fixed content overlay — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 z-20 max-w-7xl mx-auto px-10 md:px-14 pb-16">
        <div className="flex items-end justify-between gap-8">

          {/* Left column: category (fixed) + collection (animated) */}
          <div className="flex-1 min-w-0">

            {/* Category heading — fixed, dominant */}
            {categoryLabel ? (
              <h1
                className="text-7xl md:text-8xl lg:text-9xl text-white leading-[0.92] mb-5"
                style={{
                  fontFamily: 'var(--font-brand-sans)',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                }}
              >
                {categoryLabel}
              </h1>
            ) : (
              <p
                className="text-4xl md:text-5xl text-white leading-none mb-5"
                style={{ fontFamily: 'var(--font-brand-sans)', fontWeight: 900, letterSpacing: '-0.03em' }}
              >
                Kawai Pianos
              </p>
            )}

            {/* Kawai-red accent bar */}
            <div className="w-12 h-[3px] bg-kawai-red mb-6" />

            {/* Per-slide collection info — animated */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                variants={slideContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-2xl md:text-3xl text-white/70 mb-2 leading-snug"
                  style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400, fontStyle: 'italic' }}
                >
                  {displayTitle}
                </motion.p>

                {collection.subheading && (
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-white/45 mb-6 max-w-lg leading-relaxed font-[family-name:var(--font-brand-sans)]"
                  >
                    {collection.subheading}
                  </motion.p>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column: counter + nav */}
          {total > 1 && (
            <div className="flex-shrink-0 flex flex-col items-end gap-5 pb-1">
              <div
                className="text-white/25 tabular-nums font-[family-name:var(--font-brand-sans)]"
                style={{ fontSize: '13px', letterSpacing: '0.1em' }}
              >
                <span className="text-white/60">{idxDisplay}</span>
                <span className="mx-2">/</span>
                {totalDisplay}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  aria-label="Previous collection"
                  className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/50 hover:border-white/55 hover:text-white transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next collection"
                  className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/50 hover:border-white/55 hover:text-white transition-all duration-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress bars */}
        {total > 1 && (
          <div className="flex gap-1.5 mt-10" role="tablist">
            {collections.map((col, i) => {
              const isActive = i === activeIndex
              const isCompleted = i < activeIndex
              return (
                <button
                  key={col.handle}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ${col.heading ?? col.title}`}
                  onClick={() => goTo(i)}
                  className="flex-1 h-[3px] overflow-hidden focus-visible:outline-none cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  {isCompleted && <div className="h-full w-full bg-white/50" />}
                  {isActive && (
                    <div
                      key={`progress-${activeIndex}`}
                      className="h-full w-full bg-white"
                      style={{
                        transformOrigin: 'left center',
                        transform: 'scaleX(0)',
                        animation: `kawaiProgressFill ${autoplayInterval}ms linear forwards`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>


      <style>{`
        @keyframes kawaiProgressFill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
