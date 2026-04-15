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
        <span className="hidden md:block text-[9px] tracking-[0.2em] uppercase text-white/25 font-[family-name:var(--font-brand-sans)]">
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
  const safeIdx = Math.min(idx, active.length - 1)
  const idxDisplay = String(safeIdx + 1).padStart(2, '0')
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

      {/* ── Split-screen carousel ────────────────────────────────── */}
      <section
        className="relative overflow-visible bg-gradient-to-r from-stone-50 via-white to-stone-50 py-10 lg:py-14"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Secondary gradient — matches ProductHeroBlock */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-white to-stone-50/30 pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 items-start">

            {/* ── LEFT: floating white card ──────────────────────── */}
            <div className={cn(
              'space-y-5 order-2 lg:order-1 lg:col-span-5 lg:col-start-1',
              'pt-6 lg:pt-0',
              'lg:sticky lg:top-8 lg:self-start',
              'lg:bg-white lg:rounded-2xl lg:px-8 lg:py-8',
              'lg:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]',
              'lg:border lg:border-gray-100/80',
            )}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`content-${selectedCategory}-${idx}`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  {/* Eyebrow */}
                  <motion.p
                    variants={itemVariants}
                    className="text-[9px] tracking-[0.35em] uppercase text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]"
                  >
                    {eyebrow} · {categoryLabel}
                  </motion.p>

                  {/* Red rule */}
                  <motion.div
                    variants={itemVariants}
                    className="w-10 h-px bg-kawai-red"
                  />

                  {/* Title */}
                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl md:text-4xl lg:text-5xl text-kawai-black leading-[1.05]"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {displayTitle}
                  </motion.h2>

                  {/* Subheading */}
                  {collection.subheading && (
                    <motion.p
                      variants={itemVariants}
                      className="text-sm text-kawai-charcoal/60 max-w-md leading-relaxed font-[family-name:var(--font-brand-sans)]"
                    >
                      {collection.subheading}
                    </motion.p>
                  )}

                  {/* CTA */}
                  <motion.div variants={itemVariants}>
                    <Link
                      href={collectionHref}
                      className={cn(
                        'inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full',
                        'text-[11px] uppercase tracking-[0.18em]',
                        'bg-gradient-to-r from-kawai-red to-red-600 text-white',
                        'hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-kawai-red/20',
                        'transition-all duration-300',
                        'w-full lg:w-auto',
                        'font-[family-name:var(--font-brand-sans)]',
                      )}
                    >
                      Explore Collection
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>

                  {/* Counter + nav arrows — desktop only */}
                  {total > 1 && (
                    <motion.div
                      variants={itemVariants}
                      className="hidden lg:flex items-center gap-3 pt-1"
                    >
                      <span
                        className="tabular-nums text-[11px] text-kawai-charcoal/40 tracking-[0.1em] font-[family-name:var(--font-brand-sans)]"
                      >
                        <span className="text-kawai-black font-medium">{idxDisplay}</span>
                        <span className="mx-1.5">/</span>
                        {totalDisplay}
                      </span>
                      <div className="flex gap-2 ml-auto">
                        <button
                          onClick={prev}
                          aria-label="Previous collection"
                          className="w-9 h-9 border border-kawai-neutral flex items-center justify-center text-kawai-charcoal/50 hover:border-kawai-black hover:text-kawai-black transition-all duration-200 rounded-sm"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={next}
                          aria-label="Next collection"
                          className="w-9 h-9 border border-kawai-neutral flex items-center justify-center text-kawai-charcoal/50 hover:border-kawai-black hover:text-kawai-black transition-all duration-200 rounded-sm"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Progress bars — desktop only */}
                  {total > 1 && (
                    <motion.div variants={itemVariants} className="hidden lg:flex gap-1 pt-1">
                      {active.map((col, i) => (
                        <button
                          key={`${col.id}-${i}`}
                          onClick={() => setIdx(i)}
                          aria-label={`Go to ${col.heading || col.title}`}
                          className="flex-1 group relative h-px focus-visible:outline-none"
                        >
                          <div className="absolute inset-0 bg-kawai-neutral/40 group-hover:bg-kawai-neutral/70 transition-colors duration-150" />
                          {i === safeIdx && (
                            <motion.div
                              layoutId={`progress-fill-${selectedCategory}`}
                              className="absolute inset-0 bg-kawai-red"
                              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                            />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Explore all link — desktop only, visible when category filter not shown */}
                  {!showCategoryFilter && (
                    <motion.div variants={itemVariants}>
                      <Link
                        href={ctaHref}
                        className="group inline-flex items-center gap-1.5 text-[9px] tracking-[0.25em] uppercase text-kawai-charcoal/40 hover:text-kawai-charcoal transition-colors duration-200 font-[family-name:var(--font-brand-sans)]"
                      >
                        {ctaText}
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT: image / video panel ─────────────────────── */}
            <div
              className={cn(
                'order-1 lg:order-2 lg:col-span-7 lg:col-start-6 lg:row-start-1',
                'relative overflow-hidden rounded-xl lg:rounded-2xl',
                'w-full aspect-[4/3] lg:aspect-auto lg:h-[680px]',
                'group',
              )}
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
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
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
                    <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
                      <span className="text-sm text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)] tracking-widest uppercase">
                        No media
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Mobile dot indicators — overlaid on image, hidden on desktop */}
              {total > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 lg:hidden z-10 flex gap-1.5">
                  {active.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-200',
                        i === safeIdx ? 'w-4 bg-kawai-red' : 'w-1.5 bg-white/70',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
