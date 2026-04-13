'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import type { NavCollection } from '@/lib/payload/products-navigation'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeaturedCollectionsGridProps {
  collections: NavCollection[]
  eyebrow?: string
  heading?: string
  ctaText?: string
  ctaHref?: string
  columns?: '2' | '3' | '4'
  showCategoryFilter?: boolean
  browseCtaText?: string
  browseCtaHref?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  digital: 'Digital',
  grand: 'Grand',
  upright: 'Upright',
  hybrid: 'Hybrid',
  shigeru: 'Shigeru Kawai',
}

function getCategoryLabels(collection: NavCollection): string[] {
  if (!collection.pianoCategories?.length) return []
  return collection.pianoCategories.map((c) => CATEGORY_LABELS[c] ?? c)
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/)
  return match?.[1] ?? null
}

function getImageUrl(collection: NavCollection): string | null {
  if (collection.mediaUrl) return collection.mediaUrl
  if (collection.imageUrl) return collection.imageUrl
  // Fall back to YouTube thumbnail when no static image is set
  if (collection.youtubeUrl) {
    const videoId = extractYouTubeId(collection.youtubeUrl)
    if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
  return null
}

function hasVideo(collection: NavCollection): boolean {
  return Boolean(collection.youtubeUrl)
}

// ─── Grid column map ──────────────────────────────────────────────────────────

const GRID_COLS = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const

// Width for orphaned last-row items — matches the responsive grid column widths
// gap-4 (1rem) at sm, gap-5 (1.25rem) at md+
const LAST_ROW_ITEM_CLASS = {
  '2': 'w-full sm:w-[calc(50%_-_0.5rem)]',
  '3': 'w-full sm:w-[calc(50%_-_0.5rem)] lg:w-[calc(33.333%_-_0.833rem)]',
  '4': 'w-full sm:w-[calc(50%_-_0.5rem)] lg:w-[calc(25%_-_0.938rem)]',
} as const

// ─── Collection Card ──────────────────────────────────────────────────────────

function CollectionCard({ collection, index }: { collection: NavCollection; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const imageUrl = getImageUrl(collection)
  const displayTitle = collection.heading ?? collection.title
  const categoryLabels = getCategoryLabels(collection)
  const href = `/pianos/${collection.handle}`
  const showVideo = hasVideo(collection)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} className="group block relative overflow-hidden bg-kawai-black" style={{ aspectRatio: '4/3' }}>

        {/* ── Background image ── */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
          />
        ) : (
          /* Placeholder when no image */
          <div className="absolute inset-0 bg-kawai-charcoal flex items-center justify-center">
            <div className="opacity-10">
              <svg viewBox="0 0 120 80" className="w-24 h-auto" fill="currentColor" aria-hidden>
                <rect x="8" y="24" width="104" height="40" rx="2" opacity="0.6" />
                <rect x="12" y="27" width="8" height="33" rx="1" fill="white" />
                <rect x="22" y="27" width="5" height="21" rx="1" fill="#111" />
                <rect x="29" y="27" width="8" height="33" rx="1" fill="white" />
                <rect x="39" y="27" width="5" height="21" rx="1" fill="#111" />
                <rect x="46" y="27" width="8" height="33" rx="1" fill="white" />
                <rect x="56" y="27" width="8" height="33" rx="1" fill="white" />
                <rect x="66" y="27" width="5" height="21" rx="1" fill="#111" />
                <rect x="73" y="27" width="8" height="33" rx="1" fill="white" />
                <rect x="83" y="27" width="5" height="21" rx="1" fill="#111" />
                <rect x="90" y="27" width="8" height="33" rx="1" fill="white" />
                <rect x="100" y="27" width="5" height="21" rx="1" fill="#111" />
              </svg>
            </div>
          </div>
        )}

        {/* ── Gradient overlays ── */}
        {/* Bottom: text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
        {/* Hover: darken slightly */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500 pointer-events-none" />

        {/* ── Top: category chips + video indicator ── */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between z-10">
          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5">
            {categoryLabels.slice(0, 2).map((label) => (
              <span
                key={label}
                className="text-[9px] tracking-[0.2em] uppercase font-medium px-2 py-1 bg-black/40 backdrop-blur-sm text-white/70"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Video indicator */}
          {showVideo && (
            <span className="flex items-center gap-1 text-[9px] tracking-[0.15em] uppercase font-medium text-white/50 bg-black/40 backdrop-blur-sm px-2 py-1"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              <Play className="h-2.5 w-2.5" />
              Video
            </span>
          )}
        </div>

        {/* ── Bottom: title + count + CTA ── */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Title */}
          <h3
            className="text-white leading-tight mb-1.5 transition-transform duration-500 group-hover:-translate-y-1"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              textShadow: '0 1px 12px rgba(0,0,0,0.4)',
            }}
          >
            {displayTitle}
          </h3>

          {/* Product count */}
          <p
            className="text-white/45 text-xs mb-0 transition-all duration-500 group-hover:mb-4"
            style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
          >
            {collection.productCount > 0 ? `${collection.productCount} models` : 'Collection'}
          </p>

          {/* Subheading — only shown on hover */}
          {collection.subheading && (
            <p
              className="text-white/50 text-xs leading-relaxed mb-3 max-w-xs overflow-hidden max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-500"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {collection.subheading}
            </p>
          )}

          {/* Explore CTA — slides in on hover */}
          <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-500">
            <span
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-medium text-white border-b border-white/40 pb-px group-hover:border-white transition-colors duration-300"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Explore Collection
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── Category filter bar ──────────────────────────────────────────────────────

const CATEGORY_ORDER = ['digital', 'grand', 'upright', 'hybrid', 'shigeru'] as const

function CategoryFilterBar({
  available,
  selected,
  onSelect,
}: {
  available: string[]
  selected: string
  onSelect: (cat: string) => void
}) {
  const options = ['all', ...CATEGORY_ORDER.filter((c) => available.includes(c))]

  return (
    <div className="overflow-x-auto scrollbar-none -mx-6 md:-mx-10">
      <div className="flex items-center gap-2 px-6 md:px-10 pb-1 min-w-max">
        {options.map((cat) => {
          const isActive = selected === cat
          const label = cat === 'all' ? 'All' : (CATEGORY_LABELS[cat] ?? cat)
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                'px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
                isActive
                  ? 'bg-kawai-black text-white'
                  : 'border border-kawai-neutral text-kawai-charcoal/45 hover:border-kawai-charcoal/30 hover:text-kawai-black',
              )}
              style={{ fontFamily: 'var(--font-brand-sans)' }}
              aria-pressed={isActive}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FeaturedCollectionsGrid({
  collections,
  eyebrow = 'Kawai Piano',
  heading = 'Featured Collections',
  ctaText,
  ctaHref = '/pianos',
  columns = '3',
  showCategoryFilter = false,
  browseCtaText,
  browseCtaHref = '/pianos',
}: FeaturedCollectionsGridProps) {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (collections.length === 0) return null

  // Derive which categories are actually present in this collection set
  const availableCategories = Array.from(
    new Set(collections.flatMap((c) => c.pianoCategories ?? [])),
  )

  const rawFiltered =
    selectedCategory === 'all' || !showCategoryFilter
      ? collections
      : collections.filter((c) => c.pianoCategories?.includes(selectedCategory))

  // Fall back to all collections if the selected category yields nothing
  const filtered = rawFiltered.length > 0 ? rawFiltered : collections

  // Split into complete rows + orphaned last row (for centered partial rows)
  const colCount = parseInt(columns)
  const remainder = filtered.length % colCount
  const hasOrphanRow = remainder !== 0
  const mainItems = hasOrphanRow ? filtered.slice(0, filtered.length - remainder) : filtered
  const orphanItems = hasOrphanRow ? filtered.slice(filtered.length - remainder) : []

  return (
    <section className="py-16 md:py-24 bg-kawai-pearl">
      <div className="container mx-auto px-6 md:px-10 max-w-screen-2xl">

        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-8 md:mb-10"
        >
          <div>
            {eyebrow && (
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-6 h-px bg-kawai-red" />
                <p
                  className="text-[10px] tracking-[0.3em] uppercase font-medium text-kawai-charcoal/40"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  {eyebrow}
                </p>
              </div>
            )}
            <h2
              className="font-light text-kawai-black leading-tight"
              style={{
                fontFamily: 'var(--font-crimson), Georgia, serif',
                fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                letterSpacing: '-0.02em',
              }}
            >
              {heading}
            </h2>
          </div>

          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className={cn(
                'hidden sm:inline-flex items-center gap-2 flex-shrink-0 ml-8',
                'text-[10px] tracking-[0.2em] uppercase font-medium',
                'text-kawai-charcoal/45 hover:text-kawai-black transition-colors duration-200',
              )}
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {ctaText}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </motion.div>

        {/* ── Category filter ── */}
        {showCategoryFilter && availableCategories.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8 md:mb-10"
          >
            <CategoryFilterBar
              available={availableCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </motion.div>
        )}

        {/* ── Grid ── */}
        <div className={cn('grid gap-4 md:gap-5', GRID_COLS[columns])}>
          {mainItems.map((collection, i) => (
            <CollectionCard key={collection.id} collection={collection} index={i} />
          ))}
        </div>

        {/* ── Orphan row (centered when last row is incomplete) ── */}
        {orphanItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 mt-4 md:mt-5">
            {orphanItems.map((collection, i) => (
              <div key={collection.id} className={LAST_ROW_ITEM_CLASS[columns]}>
                <CollectionCard collection={collection} index={mainItems.length + i} />
              </div>
            ))}
          </div>
        )}


        {/* Mobile header CTA */}
        {ctaText && ctaHref && (
          <div className="sm:hidden mt-8 text-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/50 hover:text-kawai-black transition-colors duration-200"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {ctaText}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* ── Browse all button ── */}
        {browseCtaText && (
          <div className="mt-10 flex justify-center">
            <Link
              href={browseCtaHref}
              className="group relative inline-flex items-center gap-3 overflow-hidden border border-kawai-black px-10 py-4 transition-all duration-300 hover:bg-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black focus-visible:ring-offset-2"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              <span className="text-[11px] tracking-[0.25em] uppercase font-medium text-kawai-black transition-colors duration-300 group-hover:text-white">
                {browseCtaText}
              </span>
              <ArrowRight className="h-4 w-4 text-kawai-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
