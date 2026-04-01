'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
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

const AUTO_ROTATE_MS = 5000
const CARD_HEIGHT = 420 // px — fixed height so all cards are identical size

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/)
  return match?.[1] ?? null
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({
  eyebrow,
  heading,
  ctaText,
  ctaHref,
}: {
  eyebrow: string
  heading: string
  ctaText: string
  ctaHref: string
}) {
  return (
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
  const [paused, setPaused] = useState(false)
  const total = collections.length

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total])

  // Auto-rotate — pauses on hover
  useEffect(() => {
    if (paused || total <= 1) return
    const t = setInterval(next, AUTO_ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, next, total])

  if (total === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Header eyebrow={eyebrow} heading={heading} ctaText={ctaText} ctaHref={ctaHref} />
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-[#B8AFA6]">No featured collections available.</p>
          </div>
        </div>
      </section>
    )
  }

  const collection = collections[idx]!
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Header eyebrow={eyebrow} heading={heading} ctaText={ctaText} ctaHref={ctaHref} />

        {/* Single-card slot — fixed height so all cards are the same size */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="group"
            >
              {/* Card image */}
              <Link
                href={collectionHref}
                aria-label={`Browse ${displayTitle} collection`}
                className="block"
              >
                <div
                  className="relative w-full overflow-hidden rounded-2xl bg-[#EAE6E0]"
                  style={{ height: CARD_HEIGHT }}
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={displayTitle}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
                    />
                  )}
                  {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs tracking-widest uppercase text-[#B8AFA6]">
                        {displayTitle}
                      </span>
                    </div>
                  )}
                  {imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  )}

                  {/* Text overlay — bottom left */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/60 mb-2">
                      {collection.pianoCategories && collection.pianoCategories.length > 0
                        ? collection.pianoCategories
                            .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                            .join(' · ')
                        : collection.productCount > 0
                          ? `${collection.productCount} Models`
                          : 'Collection'}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
                      {displayTitle}
                    </h3>
                    {collection.subheading && (
                      <p className="text-base text-white/70 mt-2 max-w-xl">{collection.subheading}</p>
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
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next — overlaid on card */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous collection"
                className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-colors"
                style={{ top: CARD_HEIGHT / 2, transform: 'translateY(-50%)' }}
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next collection"
                className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-colors"
                style={{ top: CARD_HEIGHT / 2, transform: 'translateY(-50%)' }}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex items-center gap-2 mt-6">
            {collections.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`}>
                <motion.div
                  animate={{
                    width: i === idx ? 28 : 8,
                    backgroundColor: i === idx ? '#A01829' : '#C8C2BA',
                  }}
                  transition={{ duration: 0.22 }}
                  className="h-1.5 rounded-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
