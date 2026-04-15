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
  showCategoryFilter?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTO_ROTATE_MS = 6000

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`

const CATEGORY_LABELS: Record<string, string> = {
  digital: 'Digital',
  grand: 'Grand',
  upright: 'Upright',
  hybrid: 'Hybrid',
  shigeru: 'Shigeru Kawai',
}

const CATEGORY_ORDER = ['digital', 'grand', 'upright', 'hybrid', 'shigeru'] as const

// ─── Animation variants ───────────────────────────────────────────────────────

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/)
  return match?.[1] ?? null
}

function getStaticImageUrl(collection: NavCollection): string | null {
  return collection.mediaUrl ?? collection.imageUrl ?? null
}

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

// ─── Corner accent ────────────────────────────────────────────────────────────

function CornerAccent({ className }: { className?: string }) {
  return (
    <div className={cn('absolute w-14 h-14 z-20 opacity-25 pointer-events-none', className)}>
      <svg viewBox="0 0 100 100" className="text-white w-full h-full">
        <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ─── Category filter bar ──────────────────────────────────────────────────────

function CategoryBar({
  available,
  selected,
  onSelect,
  ctaText,
  ctaHref,
  totalCount,
}: {
  available: string[]
  selected: string
  onSelect: (cat: string) => void
  ctaText: string
  ctaHref: string
  totalCount: number
}) {
  const options = ['all', ...CATEGORY_ORDER.filter((c) => available.includes(c))]

  return (
    <div className="bg-kawai-black border-b border-white/[0.08] flex items-center justify-between px-8 md:px-10 h-11">
      {/* Category pills */}
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
        {options.map((cat) => {
          const isActive = selected === cat
          const label = cat === 'all' ? 'All Collections' : (CATEGORY_LABELS[cat] ?? cat)
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                'relative shrink-0 px-4 h-11 text-[9px] tracking-[0.28em] uppercase font-medium transition-colors duration-150',
                'focus-visible:outline-none',
                'font-[family-name:var(--font-brand-sans)]',
                isActive ? 'text-white' : 'text-white/35 hover:text-white/65',
              )}
            >
              {label}
              {/* Active underline */}
              {isActive && (
                <motion.span
                  layoutId="cat-underline"
                  className="absolute bottom-0 left-4 right-4 h-px bg-kawai-red"
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Right: count + explore link */}
      <div className="flex items-center gap-5 shrink-0 pl-4">
        <span
          className="hidden md:block text-[9px] tracking-[0.2em] uppercase text-white/25 font-[family-name:var(--font-brand-sans)]"
        >
          {totalCount} {totalCount === 1 ? 'collection' : 'collections'}
        </span>
        <Link
          href={ctaHref}
          className="group flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase text-white/35 hover:text-white/70 transition-colors duration-200 font-[family-name:var(--font-brand-sans)]"
        >
          {ctaText}
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FeaturedCollectionsCarousel({
  collections,
  eyebrow = 'Featured Collections',
  ctaText = 'Explore All',
  ctaHref = '/pianos',
  showCategoryFilter = false,
}: FeaturedCollectionsCarouselProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  // Derive available categories from all collections
  const availableCategories = Array.from(
    new Set(collections.flatMap((c) => c.pianoCategories ?? [])),
  )

  // Filter collections by selected category
  const filtered =
    selectedCategory === 'all'
      ? collections
      : collections.filter((c) => c.pianoCategories?.includes(selectedCategory))

  const active = filtered.length > 0 ? filtered : collections
  const total = active.length

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total])

  // Reset slide index when category changes
  useEffect(() => { setIdx(0) }, [selectedCategory])

  // Derive videoId before the early return so hooks aren't called conditionally.
  // Guard against empty active array (when collections is empty).
  const currentCollection = total > 0 ? active[Math.min(idx, total - 1)] : undefined
  const videoId = currentCollection ? getVideoId(currentCollection) : null

  // Pause auto-rotation while a YouTube video is the background — cycling through
  // video slides remounts the iframe every 6 seconds (AnimatePresence uses a key
  // per slide), which re-initialises the full YouTube player environment each time.
  const effectivePaused = paused || !!videoId

  useEffect(() => {
    if (effectivePaused || total <= 1) return
    const t = setInterval(next, AUTO_ROTATE_MS)
    return () => clearInterval(t)
  }, [effectivePaused, next, total])

  if (collections.length === 0) return null

  const collection = active[Math.min(idx, active.length - 1)]!
  const imageUrl = videoId ? null : getStaticImageUrl(collection)
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`
  const categoryLabel = getCategoryLabel(collection)
  const idxDisplay = String(Math.min(idx, active.length - 1) + 1).padStart(2, '0')
  const totalDisplay = String(total).padStart(2, '0')

  return (
    <div className="w-full">
      {/* ── Category filter bar ─────────────────────────────────── */}
      {showCategoryFilter && availableCategories.length > 1 && (
        <CategoryBar
          available={availableCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          ctaText={ctaText}
          ctaHref={ctaHref}
          totalCount={active.length}
        />
      )}

      {/* ── Carousel ─────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden bg-kawai-black"
        style={{ height: 'clamp(480px, 65vh, 760px)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`bg-${selectedCategory}-${idx}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={displayTitle}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : videoId ? (
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
              <div className="absolute inset-0 bg-kawai-black" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Diagonal gradient overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Grain texture */}
        <div
          className="absolute inset-0 z-10 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: GRAIN_SVG }}
        />

        {/* Corner accents */}
        <CornerAccent className="top-0 left-0" />
        <CornerAccent className="bottom-0 right-0 rotate-180" />

        {/* Top bar — eyebrow only (explore link moves to filter bar when filter enabled) */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-8 md:px-10 pt-8 flex items-center justify-between">
            <p className="text-[9px] tracking-[0.35em] uppercase text-white/40 font-[family-name:var(--font-brand-sans)]">
              {eyebrow}
            </p>
            {!showCategoryFilter && (
              <Link
                href={ctaHref}
                className="group flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase text-white/40 hover:text-white/75 transition-colors duration-200 font-[family-name:var(--font-brand-sans)]"
              >
                {ctaText}
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-8 md:px-10 pb-10">
            <div className="flex items-end justify-between gap-8">

              {/* Left: staggered content */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`content-${selectedCategory}-${idx}`}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.p
                      variants={itemVariants}
                      className="text-[9px] tracking-[0.35em] uppercase text-white/45 mb-4 font-[family-name:var(--font-brand-sans)]"
                    >
                      {categoryLabel}
                    </motion.p>

                    <motion.div variants={itemVariants} className="w-10 h-px bg-white/30 mb-5" />

                    <motion.h2
                      variants={itemVariants}
                      className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.02] mb-3 drop-shadow-2xl"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        textShadow: '0 4px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      {displayTitle}
                    </motion.h2>

                    {collection.subheading && (
                      <motion.p
                        variants={itemVariants}
                        className="text-sm text-white/55 mb-6 max-w-md leading-relaxed font-[family-name:var(--font-brand-sans)] drop-shadow-lg"
                      >
                        {collection.subheading}
                      </motion.p>
                    )}

                    <motion.div variants={itemVariants} className={cn(!collection.subheading && 'mt-2')}>
                      <Link
                        href={collectionHref}
                        className="inline-flex items-center gap-2.5 px-6 py-3 text-[11px] uppercase tracking-[0.18em] border border-white/40 text-white hover:bg-white hover:text-kawai-black hover:border-white transition-all duration-250 font-[family-name:var(--font-brand-sans)]"
                      >
                        Explore Collection
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right: counter + nav */}
              {total > 1 && (
                <div className="flex-shrink-0 flex flex-col items-end gap-5 pb-1">
                  <div
                    className="text-white/30 font-[family-name:var(--font-brand-sans)] tabular-nums"
                    style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                  >
                    <span className="text-white/70">{idxDisplay}</span>
                    <span className="mx-1.5">/</span>
                    {totalDisplay}
                  </div>
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
                {active.map((col, i) => (
                  <button
                    key={`${col.id}-${i}`}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to ${col.heading || col.title}`}
                    className="flex-1 group relative h-px focus-visible:outline-none"
                  >
                    <div className="absolute inset-0 bg-white/18 group-hover:bg-white/30 transition-colors duration-150" />
                    {i === Math.min(idx, active.length - 1) && (
                      <motion.div
                        layoutId={`progress-fill-${selectedCategory}`}
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
    </div>
  )
}
