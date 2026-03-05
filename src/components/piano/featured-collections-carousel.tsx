'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavCollection } from '@/lib/payload/products-navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeaturedCollectionsCarouselProps {
  collections: NavCollection[]
  eyebrow?: string
  heading?: string
  ctaText?: string
  ctaHref?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CARDS_PER_VIEW = 3

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/)
  return match?.[1] ?? null
}

// ─── Collection Card ──────────────────────────────────────────────────────────

function CollectionCard({
  collection,
  index = 0,
}: {
  collection: NavCollection
  index?: number
}) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const hasMedia = Boolean(imageUrl || videoId)
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`

  // Stagger autoplay: card 0 starts immediately, each subsequent card after 600ms extra
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!videoId) return
    const timer = setTimeout(() => setIsPlaying(true), index * 600)
    return () => clearTimeout(timer)
  }, [videoId, index])

  return (
    <div className="group relative w-full flex flex-col">
      {/* Card image area — links directly to the collection page */}
      <Link
        href={collectionHref}
        className="relative w-full block"
        aria-label={`Browse ${displayTitle} collection`}
      >
        {/* Media — aspect-video for YouTube, 4:3 for images */}
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-2xl bg-[#EAE6E0]',
            videoId ? 'aspect-video' : 'aspect-[4/3]'
          )}
        >
          {/* Thumbnail / fallback image — fades out once iframe is playing */}
          {imageUrl && (
            <motion.div
              animate={{ opacity: isPlaying && videoId ? 0 : 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrl}
                alt={displayTitle}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          )}

          {/* YouTube iframe — fades in when stagger timer fires */}
          {videoId && isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
                allow="autoplay; encrypted-media"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ border: 'none' }}
                title={displayTitle}
              />
            </motion.div>
          )}

          {/* No media fallback */}
          {!hasMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase text-[#B8AFA6]">
                {displayTitle}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          {hasMedia && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none rounded-2xl" />
          )}

          {/* Text overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/55 mb-1.5">
              {collection.pianoCategories && collection.pianoCategories.length > 0
                ? collection.pianoCategories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' · ')
                : collection.productCount > 0 ? `${collection.productCount} Models` : 'Collection'}
            </p>
            <h3 className="text-lg font-bold text-white font-serif leading-tight">
              {displayTitle}
            </h3>
            {collection.subheading && (
              <p className="text-sm text-white/60 mt-1 line-clamp-1">{collection.subheading}</p>
            )}
          </div>

          {/* Hover border ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
        </div>
      </Link>

      {/* CTA below card */}
      <Link
        href={collectionHref}
        className="mt-3.5 flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent text-[#8A8078] text-sm font-medium tracking-wide border border-[#E0DCD6] hover:border-[#A01829] hover:text-[#A01829] transition-colors duration-150"
        aria-label={`View all ${displayTitle} models`}
      >
        Explore Collection
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

// ─── Main Carousel Component ──────────────────────────────────────────────────

export function FeaturedCollectionsCarousel({
  collections,
  eyebrow = 'Kawai Piano',
  heading = 'Featured Collections',
  ctaText = 'Explore All',
  ctaHref = '/pianos',
}: FeaturedCollectionsCarouselProps) {
  const [idx, setIdx] = useState(0)
  const maxIdx = Math.max(0, Math.ceil(collections.length / CARDS_PER_VIEW) - 1)
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx((i) => Math.min(maxIdx, i + 1)), [maxIdx])
  const visible = collections.slice(idx * CARDS_PER_VIEW, (idx + 1) * CARDS_PER_VIEW)
  const hasPrev = idx > 0
  const hasNext = idx < maxIdx

  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const scrollMobile = useCallback((dir: 'left' | 'right') => {
    const el = mobileScrollRef.current
    if (!el) return
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : el.offsetWidth * 0.82
    el.scrollBy({ left: dir === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' })
  }, [])

  if (collections.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#A01829] mb-2">
                {eyebrow}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] font-serif leading-none">
                {heading}
              </h2>
            </div>
            <Link
              href={ctaHref}
              className="group flex items-center gap-2 text-sm font-medium text-[#A01829]"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-[#B8AFA6]">No featured collections available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#A01829] mb-2">
              {eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] font-serif leading-none">
              {heading}
            </h2>
          </div>
          <Link
            href={ctaHref}
            className="group flex items-center gap-2 text-sm font-medium text-[#A01829]"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile: native horizontal scroll */}
        <div className="lg:hidden">
          <div
            ref={mobileScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-6 px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {collections.map((collection, i) => (
              <div key={collection.id} className="w-[78vw] sm:w-[44vw] flex-shrink-0 snap-start">
                <CollectionCard collection={collection} index={i} />
              </div>
            ))}
          </div>

          {collections.length > 1 && (
            <div className="flex items-center justify-end gap-2 mt-3 px-1">
              <button
                onClick={() => scrollMobile('left')}
                aria-label="Previous collections"
                className="w-9 h-9 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollMobile('right')}
                aria-label="Next collections"
                className="w-9 h-9 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: paginated grid with arrows */}
        <div className="hidden lg:block relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              className="grid grid-cols-3 gap-8"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            >
              {visible.map((collection, i) => (
                <CollectionCard key={collection.id} collection={collection} index={i} />
              ))}
              {Array.from({ length: Math.max(0, CARDS_PER_VIEW - visible.length) }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {hasPrev && (
              <motion.button
                key="prev"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={prev}
                aria-label="Previous collections"
                className="absolute -left-5 top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.button>
            )}
            {hasNext && (
              <motion.button
                key="next"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={next}
                aria-label="Next collections"
                className="absolute -right-5 top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {maxIdx > 0 && (
            <div className="flex items-center gap-2 mt-8">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`}>
                  <motion.div
                    animate={{ width: i === idx ? 28 : 8, backgroundColor: i === idx ? '#A01829' : '#C8C2BA' }}
                    transition={{ duration: 0.22 }}
                    className="h-1.5 rounded-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
