'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import type { NavCollection } from '@/lib/payload/products-navigation'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeaturedCollectionsCarouselProps {
  collections: NavCollection[]
  eyebrow?: string
  heading?: string
  ctaText?: string
  ctaHref?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTO_ROTATE_MS = 6000

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/)
  return match?.[1] ?? null
}

/**
 * Returns the static image URL if one is explicitly set (mediaUrl or imageUrl).
 * Does NOT fall back to the YouTube thumbnail — use getVideoId() for that path.
 */
function getStaticImageUrl(collection: NavCollection): string | null {
  return collection.mediaUrl ?? collection.imageUrl ?? null
}

/**
 * Returns the YouTube video ID — prioritized over static images.
 * Static image is used only when no YouTube URL is set.
 */
function getVideoId(collection: NavCollection): string | null {
  return collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
}

function getCategoryLabel(collection: NavCollection): string {
  if (collection.pianoCategories && collection.pianoCategories.length > 0) {
    return collection.pianoCategories
      .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
      .join(' · ')
  }
  if (collection.productCount > 0) return `${collection.productCount} Models`
  return 'Collection'
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FeaturedCollectionsCarousel({
  collections,
  eyebrow = 'Featured Collections',
  ctaText = 'Explore All',
  ctaHref = '/pianos',
}: FeaturedCollectionsCarouselProps) {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = collections.length

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const t = setInterval(next, AUTO_ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, next, total])

  if (total === 0) return null

  const collection = collections[idx]!
  const videoId = getVideoId(collection)
  const imageUrl = videoId ? null : getStaticImageUrl(collection)
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`
  const categoryLabel = getCategoryLabel(collection)
  const idxDisplay = String(idx + 1).padStart(2, '0')
  const totalDisplay = String(total).padStart(2, '0')

  return (
    <section
      className="relative w-full overflow-hidden bg-kawai-black"
      style={{ height: 'clamp(500px, 62vh, 720px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background — crossfade between slides ─────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${idx}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {imageUrl ? (
            /* Static image (mediaUrl or imageUrl takes priority) */
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : videoId ? (
            /* YouTube embed — full-cover 16:9 letterbox technique */
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                key={videoId}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: 'max(100%, 177.78vh)', height: 'max(100%, 56.25vw)' }}
                title={displayTitle}
              />
            </div>
          ) : (
            /* No media at all */
            <div className="absolute inset-0 bg-kawai-black" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ──────────────────────────────────────── */}
      {/* Bottom: for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-10" />
      {/* Left edge: adds painterly depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none z-10" />
      {/* Top: subtle vignette so top-bar text reads */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-10" />

      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-8 md:px-10 pt-8 flex items-center justify-between">
          <p
            className="text-[9px] tracking-[0.35em] uppercase text-white/45 font-[family-name:var(--font-brand-sans)]"
          >
            {eyebrow}
          </p>
          <Link
            href={ctaHref}
            className="group flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase text-white/45 hover:text-white/80 transition-colors duration-200 font-[family-name:var(--font-brand-sans)]"
          >
            {ctaText}
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* ── Bottom content ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-8 md:px-10 pb-10">

          {/* Title + CTA row */}
          <div className="flex items-end justify-between gap-8">

            {/* Left: category + title + subheading + CTA */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`content-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Category eyebrow */}
                  <p className="text-[9px] tracking-[0.35em] uppercase text-white/45 mb-4 font-[family-name:var(--font-brand-sans)]">
                    {categoryLabel}
                  </p>

                  {/* Collection title */}
                  <h2
                    className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.02] mb-3"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {displayTitle}
                  </h2>

                  {/* Subheading */}
                  {collection.subheading && (
                    <p className="text-sm text-white/55 mb-6 max-w-md leading-relaxed font-[family-name:var(--font-brand-sans)]">
                      {collection.subheading}
                    </p>
                  )}

                  {/* CTA */}
                  <Link
                    href={collectionHref}
                    className={cn(
                      'inline-flex items-center gap-2.5',
                      'px-6 py-3 text-[11px] uppercase tracking-[0.18em]',
                      'border border-white/40 text-white',
                      'hover:bg-white hover:text-kawai-black hover:border-white',
                      'transition-all duration-250 font-[family-name:var(--font-brand-sans)]',
                      !collection.subheading && 'mt-2',
                    )}
                  >
                    Explore Collection
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: counter + prev/next */}
            {total > 1 && (
              <div className="flex-shrink-0 flex flex-col items-end gap-5 pb-1">
                {/* Counter */}
                <div
                  className="text-white/30 font-[family-name:var(--font-brand-sans)] tabular-nums"
                  style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                >
                  <span className="text-white/70">{idxDisplay}</span>
                  <span className="mx-1.5">/</span>
                  {totalDisplay}
                </div>

                {/* Prev / Next */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    aria-label="Previous collection"
                    className="w-9 h-9 border border-white/25 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white transition-all duration-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next collection"
                    className="w-9 h-9 border border-white/25 flex items-center justify-center text-white/60 hover:border-white/60 hover:text-white transition-all duration-200"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress bars */}
          {total > 1 && (
            <div className="flex gap-1 mt-8">
              {collections.map((col, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to ${col.heading || col.title}`}
                  className="flex-1 group relative h-px focus-visible:outline-none"
                >
                  {/* Track */}
                  <div className="absolute inset-0 bg-white/18 group-hover:bg-white/30 transition-colors duration-150" />
                  {/* Fill */}
                  {i === idx && (
                    <motion.div
                      layoutId="progress-fill"
                      className="absolute inset-0 bg-white/75"
                      transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
