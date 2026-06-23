'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Search, ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionForBrowser } from '@/lib/payload/queries'
import { FeaturedCollectionsCarousel } from '@/components/piano/featured-collections-carousel'
import type { NavCollection } from '@/lib/payload/products-navigation'
import { buildFeaturedMap, compareByFeatured } from '@/lib/piano/featured-sort'

export interface CatalogProduct {
  id: string
  model: string
  modelLabel?: string | null
  name?: string | null
  slug: string
  status?: string | null
  type?: string | null
  category?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null; currency?: string | null } | null
  priceCAD?: { price?: number | null; msrp?: number | null } | null
  salePrice?: number | null
  compareAtPrice?: number | null
  shopifyCollections?: Array<{ title: string; handle: string }> | null
  variations?: Array<{
    name: string
    price: number | null
    compareAtPrice: number | null
    priceCAD: number | null
    compareAtPriceCAD: number | null
    imageUrl: string | null
    available: boolean
  }> | null
}

interface Props {
  products: CatalogProduct[]
  collections?: CollectionForBrowser[]
  heading?: string | null
  category?: 'digital' | 'grand' | 'upright' | 'hybrid' | null
  site?: 'us' | 'cad'
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const

function formatCurrency(amount: number, currency = 'USD'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
  if (currency === 'CAD') return formatted.replace('CA$', 'CAD')
  return formatted
}

function formatPrice(price?: CatalogProduct['price']): string {
  if (!price?.msrp) return 'Contact for Price'
  return formatCurrency(price.msrp, price.currency ?? 'USD')
}

function parseYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}


const bannerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const bannerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const CATEGORY_LABELS: Record<string, string> = {
  digital: 'Digital Pianos',
  grand: 'Grand Pianos',
  upright: 'Upright Pianos',
  hybrid: 'Hybrid Pianos',
}

function CollectionBanner({
  collection,
  category,
}: {
  collection: CollectionForBrowser
  category?: string | null
}) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const videoId = collection.youtubeUrl ? parseYouTubeId(collection.youtubeUrl) : null
  const fallbackImage = collection.mediaUrl ?? collection.imageUrl ?? null
  const hasMedia = !!(videoId || fallbackImage)

  const categoryLabel = category ? (CATEGORY_LABELS[category] ?? null) : null
  const collectionHeading = collection.heading ?? null

  return (
    <section className="relative w-full overflow-hidden h-[480px]">
      {/* Video background */}
      {videoId && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            className={cn(
              'absolute top-1/2 left-1/2 w-[177.77777778vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-1000',
              isVideoLoaded ? 'opacity-100' : 'opacity-0',
            )}
            allow="autoplay; encrypted-media"
            onLoad={() => setIsVideoLoaded(true)}
            title={`${collection.title} video`}
          />
        </div>
      )}

      {/* Fallback image */}
      {!videoId && fallbackImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={fallbackImage}
            alt={collectionHeading ?? collection.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Dark base when no media */}
      {!hasMedia && <div className="absolute inset-0 z-0 bg-kawai-black" />}

      {/* Gradient — heavy on left for text, lighter right to show media */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.30) 100%)',
        }}
      />

      {/* Bottom fade to ensure text always readable */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Corner accent — top left only */}
      <div className="absolute top-0 left-0 w-16 h-16 z-20 opacity-25 pointer-events-none">
        <svg viewBox="0 0 100 100" className="text-white w-full h-full">
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Content — bottom-left, editorial layout */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 max-w-7xl mx-auto px-8 md:px-12 pb-12"
        variants={bannerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={bannerItemVariants}
          className="text-[11px] tracking-[0.38em] uppercase text-white/40 mb-4 font-[family-name:var(--font-brand-sans)]"
        >
          Kawai Piano Catalog
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={bannerItemVariants}
          className="w-14 h-px mb-6"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, transparent 100%)' }}
        />

        {/* Category name — primary headline */}
        {categoryLabel && (
          <motion.h1
            variants={bannerItemVariants}
            className="text-5xl md:text-6xl lg:text-7xl text-white leading-[1.02] mb-3 drop-shadow-2xl"
            style={{
              fontFamily: 'var(--font-brand-luxury)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {categoryLabel}
          </motion.h1>
        )}

        {/* Collection heading — secondary context */}
        {collectionHeading && (
          <motion.p
            variants={bannerItemVariants}
            className="text-lg md:text-xl text-white/65 mb-3 font-[family-name:var(--font-brand-sans)] drop-shadow-lg"
          >
            {collectionHeading}
          </motion.p>
        )}

        {/* Subheading */}
        {collection.subheading && (
          <motion.p
            variants={bannerItemVariants}
            className="text-sm text-white/50 max-w-2xl leading-relaxed font-[family-name:var(--font-brand-sans)]"
          >
            {collection.subheading}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}

function deriveCollections(products: CatalogProduct[]): Array<{ title: string; handle: string }> {
  const map = new Map<string, string>()
  for (const p of products) {
    for (const c of p.shopifyCollections ?? []) {
      if (c.title && !map.has(c.title)) map.set(c.title, c.handle)
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([title, handle]) => ({ title, handle }))
}

/* ── Animation variants ────────────────────────────────────────── */

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(index * 0.04, 0.5),
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

/* ── Mobile Filter Sheet ───────────────────────────────────────── */

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  search: string
  setSearch: (v: string) => void
  activeCollection: string
  setActiveCollection: (v: string) => void
  sort: string
  setSort: (v: string) => void
  showLegacy: boolean
  setShowLegacy: (v: boolean) => void
  visibleCollections: Array<{ title: string; handle: string }>
  resultCount: number
  onClearAll: () => void
  sortOptions: typeof SORT_OPTIONS[number][]
}

function MobileFilterSheet({
  isOpen,
  onClose,
  search,
  setSearch,
  activeCollection,
  setActiveCollection,
  sort,
  setSort,
  showLegacy,
  setShowLegacy,
  visibleCollections,
  resultCount,
  onClearAll,
  sortOptions,
}: MobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[201] bg-white rounded-t-2xl overflow-hidden"
            style={{ maxHeight: '88vh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 bg-kawai-neutral rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-kawai-neutral/60">
              <h2
                className="text-base text-kawai-black"
                style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
              >
                Filters
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClearAll}
                  className="text-[11px] uppercase tracking-[0.12em] text-kawai-charcoal/50 hover:text-kawai-black transition-colors font-[family-name:var(--font-brand-sans)]"
                >
                  Clear all
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto pb-28" style={{ maxHeight: 'calc(88vh - 120px)' }}>
              {/* Search */}
              <div className="px-5 pt-5 pb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/50 mb-2.5 font-[family-name:var(--font-brand-sans)]">
                  Search
                </p>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search size={14} className="text-kawai-charcoal/40" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by model or name…"
                    className={cn(
                      'w-full bg-kawai-pearl border border-kawai-neutral rounded-lg pl-9 pr-8 py-2.5 text-sm',
                      'text-kawai-black placeholder:text-kawai-charcoal/40',
                      'focus:outline-none focus:border-kawai-charcoal',
                      'font-[family-name:var(--font-brand-sans)] transition-colors duration-200',
                    )}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Collections */}
              {visibleCollections.length > 0 && (
                <>
                  <div className="h-px bg-kawai-neutral/50 mx-5" />
                  <div className="px-5 pt-4 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/50 mb-3 font-[family-name:var(--font-brand-sans)]">
                      Collection
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveCollection('All')}
                        className={cn(
                          'px-4 py-2 text-sm border transition-all duration-150 font-[family-name:var(--font-brand-sans)]',
                          activeCollection === 'All'
                            ? 'border-kawai-red text-kawai-red'
                            : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal',
                        )}
                      >
                        All
                      </button>
                      {visibleCollections.map((col) => (
                        <button
                          key={col.title}
                          onClick={() => setActiveCollection(col.title)}
                          className={cn(
                            'px-4 py-2 text-sm border transition-all duration-150 font-[family-name:var(--font-brand-sans)]',
                            activeCollection === col.title
                              ? 'border-kawai-red text-kawai-red'
                              : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal',
                          )}
                        >
                          {col.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="h-px bg-kawai-neutral/50 mx-5" />

              {/* Sort */}
              <div className="px-5 pt-4 pb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/50 mb-3 font-[family-name:var(--font-brand-sans)]">
                  Sort By
                </p>
                <div className="space-y-1">
                  {sortOptions.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => setSort(o.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors duration-150',
                        'font-[family-name:var(--font-brand-sans)]',
                        sort === o.value
                          ? 'bg-kawai-pearl text-kawai-black font-medium'
                          : 'text-kawai-charcoal hover:bg-kawai-pearl/60',
                      )}
                    >
                      <span>{o.label}</span>
                      {sort === o.value && (
                        <span className="w-4 h-4 rounded-full bg-kawai-black flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
                            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-kawai-neutral/50 mx-5" />

              {/* Show Legacy Products */}
              <div className="px-5 pt-4 pb-4">
                <button
                  onClick={() => setShowLegacy(!showLegacy)}
                  className="flex items-center gap-3 w-full text-left"
                >
                  <div className={cn(
                    'w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors duration-150',
                    showLegacy ? 'bg-kawai-black border-kawai-black' : 'border-kawai-neutral',
                  )}>
                    {showLegacy && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-kawai-black font-[family-name:var(--font-brand-sans)]">Show Legacy Products</p>
                    <p className="text-[10px] text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] mt-0.5">Include discontinued models</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Fixed CTA at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-kawai-neutral px-5 py-4">
              <button
                onClick={onClose}
                className={cn(
                  'w-full py-3.5 text-sm font-medium tracking-[0.06em]',
                  'bg-kawai-black text-white hover:bg-kawai-charcoal transition-colors duration-200',
                  'font-[family-name:var(--font-brand-sans)]',
                )}
              >
                Show {resultCount} {resultCount === 1 ? 'instrument' : 'instruments'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Main Component ────────────────────────────────────────────── */

export default function PianoPagesBrowser({ products, collections, heading, category, site = 'us' }: Props) {
  const [search, setSearch] = useState('')
  const [activeCollection, setActiveCollection] = useState<string>('All')
  const [sort, setSort] = useState<string>('default')
  const [showLegacy, setShowLegacy] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const sortOptions = [...SORT_OPTIONS]

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileFilterOpen])

  function scrollToBlock() {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Only scroll if we've scrolled past the top of the block
    if (rect.top >= 0) return
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-bottom').trim() || '70',
    )
    window.scrollTo({ top: window.scrollY + rect.top - headerH, behavior: 'smooth' })
  }

  function handleCollectionChange(col: string) {
    setActiveCollection(col)
    scrollToBlock()
  }

  // All collections passed in are already category-scoped — use them directly
  const visibleCollections = useMemo(() => {
    if (collections && collections.length > 0) {
      return collections
    }
    return deriveCollections(products)
  }, [collections, products])

  const activeCollectionHandle = useMemo(() => {
    if (activeCollection === 'All') return null
    return visibleCollections.find((c) => c.title === activeCollection)?.handle ?? null
  }, [activeCollection, visibleCollections])

  const activeCollectionObj = useMemo((): CollectionForBrowser | null => {
    if (activeCollection === 'All') return null
    const found = visibleCollections.find((c) => c.title === activeCollection)
    return (found as CollectionForBrowser | undefined) ?? null
  }, [activeCollection, visibleCollections])

  // Map of collection handle → priority for featured collections (used by default sort)
  const featuredPriorityMap = useMemo(
    () => buildFeaturedMap(collections ?? []),
    [collections],
  )

  const featuredCollections = useMemo((): NavCollection[] => {
    return (collections ?? [])
      .filter((c) => c.featured)
      .map((c) => ({
        id: c.handle,
        title: c.title,
        handle: c.handle,
        description: null,
        imageUrl: c.imageUrl ?? null,
        youtubeUrl: c.youtubeUrl ?? null,
        mediaUrl: c.mediaUrl ?? null,
        heading: c.heading ?? null,
        subheading: c.subheading ?? null,
        productCount: 0,
        collectionPriority: c.collectionPriority ?? 0,
        featured: c.featured === true,
        pianoCategories: c.pianoCategories ?? null,
      }))
  }, [collections])

  const filtered = useMemo(() => {
    let items = [...products]

    // Filter out legacy/discontinued unless user opted in
    if (!showLegacy) {
      items = items.filter((p) => p.status !== 'discontinued')
    }

    if (activeCollection !== 'All') {
      items = items.filter((p) =>
        (p.shopifyCollections ?? []).some((c) => c.title === activeCollection),
      )
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.model.toLowerCase().includes(q) ||
          (p.modelLabel ?? '').toLowerCase().includes(q) ||
          (p.name ?? '').toLowerCase().includes(q) ||
          (p.type ?? '').toLowerCase().includes(q),
      )
    }

    switch (sort) {
      case 'default':
        // Products in a featured collection float up (even at default priority 0),
        // then sort by the highest collectionPriority among their featured collections.
        items.sort((a, b) => compareByFeatured(a, b, featuredPriorityMap))
        break
      case 'name-asc':
        items.sort((a, b) => (a.model ?? '').localeCompare(b.model ?? ''))
        break
      case 'price-asc':
        items.sort((a, b) => (a.price?.msrp ?? 0) - (b.price?.msrp ?? 0))
        break
      case 'price-desc':
        items.sort((a, b) => (b.price?.msrp ?? 0) - (a.price?.msrp ?? 0))
        break
    }

    // Always float items with a price above items without one
    items.sort((a, b) => {
      const aMsrp = site === 'cad' ? (a.priceCAD?.price ?? a.priceCAD?.msrp ?? a.price?.msrp) : a.price?.msrp
      const bMsrp = site === 'cad' ? (b.priceCAD?.price ?? b.priceCAD?.msrp ?? b.price?.msrp) : b.price?.msrp
      const aHas = (aMsrp != null || a.salePrice != null) ? 0 : 1
      const bHas = (bMsrp != null || b.salePrice != null) ? 0 : 1
      return aHas - bHas
    })

    // Legacy/discontinued products always sort to the bottom
    if (showLegacy) {
      items.sort((a, b) => {
        const aLegacy = a.status === 'discontinued' ? 1 : 0
        const bLegacy = b.status === 'discontinued' ? 1 : 0
        return aLegacy - bLegacy
      })
    }

    return items
  }, [products, search, activeCollection, sort, showLegacy, site, featuredPriorityMap])

  const hasFilters = search.trim() !== '' || activeCollection !== 'All' || showLegacy

  const activeFilterCount = (activeCollection !== 'All' ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (showLegacy ? 1 : 0)

  const gridKey = `${activeCollection}|${search.trim()}|${sort}|${showLegacy}`

  function clearAll() {
    setSearch('')
    setActiveCollection('All')
    setShowLegacy(false)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-kawai-pearl">

      {/* ── Mobile filter sheet ──────────────────────────────────── */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        search={search} setSearch={setSearch}
        activeCollection={activeCollection} setActiveCollection={handleCollectionChange}
        sort={sort} setSort={setSort}
        showLegacy={showLegacy} setShowLegacy={setShowLegacy}
        visibleCollections={visibleCollections}
        resultCount={filtered.length}
        onClearAll={clearAll}
        sortOptions={sortOptions}
      />

      {/* ── Sticky header — H1 zone + controls ── */}
      <div
        className="sticky z-40 bg-white border-b border-kawai-neutral shadow-sm"
        style={{ top: 'var(--header-bottom, 70px)' }}
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* ── Desktop layout ───────────────────────────────────── */}
          <div className="hidden md:flex items-center h-18 gap-6">
            {/* Left: back link */}
            {(heading ?? category) ? (
              <Link
                href="/pianos"
                className="inline-flex items-center gap-1.5 text-sm text-kawai-charcoal/50 hover:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)] mr-auto flex-shrink-0"
              >
                <span>←</span>
                <span>All Pianos</span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {/* Search */}
            <div className="relative w-80 group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search size={16} className="text-kawai-charcoal/50" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by model or name…"
                className={cn(
                  'w-full h-11 bg-white pl-10 pr-9 text-sm rounded-sm border',
                  'text-kawai-black placeholder:text-kawai-charcoal/50',
                  'focus:outline-none focus:ring-0 font-[family-name:var(--font-brand-sans)]',
                  'transition-colors duration-200',
                  search ? 'border-kawai-black' : 'border-kawai-neutral hover:border-kawai-charcoal',
                )}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results count */}
            <AnimatePresence mode="wait">
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="text-sm font-medium text-kawai-charcoal font-[family-name:var(--font-brand-sans)] whitespace-nowrap"
              >
                {filtered.length} {filtered.length === 1 ? 'instrument' : 'instruments'}
              </motion.span>
            </AnimatePresence>

            {/* Divider */}
            <div className="h-6 w-px bg-kawai-charcoal/25 flex-shrink-0" />

            {/* Legacy toggle */}
            <button
              onClick={() => setShowLegacy(!showLegacy)}
              className="flex items-center gap-2 flex-shrink-0 group"
              title={showLegacy ? 'Hide legacy products' : 'Show legacy products'}
            >
              <div className={cn(
                'w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors duration-150',
                showLegacy ? 'bg-kawai-black border-kawai-black' : 'border-kawai-neutral group-hover:border-kawai-charcoal',
              )}>
                {showLegacy && (
                  <svg width="7" height="5" viewBox="0 0 8 6" fill="none" aria-hidden>
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-kawai-charcoal/60 group-hover:text-kawai-charcoal transition-colors font-[family-name:var(--font-brand-sans)] whitespace-nowrap">
                Legacy
              </span>
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-kawai-charcoal/25 flex-shrink-0" />

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={cn(
                  'appearance-none h-11 bg-white border border-kawai-neutral pl-4 pr-10 text-sm font-medium rounded-sm',
                  'text-kawai-charcoal focus:outline-none focus:ring-0 cursor-pointer',
                  'font-[family-name:var(--font-brand-sans)] hover:border-kawai-charcoal transition-colors',
                )}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-kawai-charcoal/60 pointer-events-none" />
            </div>
          </div>

          {/* ── Mobile layout ────────────────────────────────────── */}
          <div className="md:hidden py-3 space-y-2.5">
            {/* Row 0: Heading + back link */}
            {(heading ?? category) && (
              <div className="flex items-baseline gap-2 pb-0.5">
                <Link
                  href="/pianos"
                  className="text-xs text-kawai-charcoal/50 hover:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)] shrink-0"
                >
                  ← All Pianos
                </Link>
                <span className="text-kawai-neutral/60">·</span>
                <span
                  className="text-base text-kawai-black font-[family-name:var(--font-brand-luxury)] truncate"
                  style={{ fontWeight: 400 }}
                >
                  {heading ?? (category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Pianos' : '')}
                </span>
              </div>
            )}
            {/* Row 1: Search + Filter button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search size={16} className="text-kawai-charcoal/40" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by model or name…"
                  className="w-full h-12 bg-kawai-pearl border border-kawai-neutral rounded-xl pl-11 pr-10 text-base text-kawai-black placeholder:text-kawai-charcoal/40 focus:outline-none focus:border-kawai-charcoal font-[family-name:var(--font-brand-sans)]"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className={cn(
                  'flex-shrink-0 flex items-center gap-2 h-12 px-4 border rounded-xl text-sm transition-colors',
                  'font-[family-name:var(--font-brand-sans)]',
                  activeFilterCount > 0
                    ? 'border-kawai-black bg-kawai-black text-white'
                    : 'border-kawai-neutral text-kawai-charcoal bg-white',
                )}
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-kawai-red text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Collection row — inside sticky bar ───────────────────── */}
        {visibleCollections.length > 0 && (
          <div className="border-t border-kawai-neutral/40 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-1 overflow-x-auto scrollbar-none">
              <span className="text-xs uppercase tracking-[0.2em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] flex-shrink-0 mr-2">
                Collection
              </span>

              <button
                onClick={() => handleCollectionChange('All')}
                className={cn(
                  'flex-shrink-0 px-5 py-2 text-sm uppercase tracking-[0.12em] transition-colors duration-200 font-[family-name:var(--font-brand-sans)] border-b-2',
                  activeCollection === 'All' ? 'text-kawai-red border-kawai-red' : 'text-kawai-charcoal/60 border-transparent hover:text-kawai-charcoal',
                )}
              >
                All
              </button>

              {visibleCollections.map((col) => (
                <button
                  key={col.title}
                  onClick={() => handleCollectionChange(col.title)}
                  className={cn(
                    'flex-shrink-0 px-5 py-2 text-sm uppercase tracking-[0.12em] transition-colors duration-200 font-[family-name:var(--font-brand-sans)] border-b-2',
                    activeCollection === col.title ? 'text-kawai-red border-kawai-red' : 'text-kawai-charcoal/60 border-transparent hover:text-kawai-charcoal',
                  )}
                >
                  {col.title}
                </button>
              ))}

              {/* View Collection link */}
              <AnimatePresence>
                {activeCollectionHandle && (
                  <motion.a
                    key="view-link"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                    href={`/pianos/${activeCollectionHandle}`}
                    className={cn(
                      'flex-shrink-0 ml-auto flex items-center gap-1.5',
                      'px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]',
                      'border border-kawai-red/40 text-kawai-red',
                      'hover:bg-kawai-red hover:text-white hover:border-kawai-red',
                      'transition-all duration-200 font-[family-name:var(--font-brand-sans)]',
                    )}
                  >
                    View Collection
                    <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.a>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Active filter chips ──────────────────────────────────── */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-kawai-neutral/30 bg-white/95 overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-2 flex-wrap">
                {activeCollection !== 'All' && (
                  <FilterChip label={activeCollection} onRemove={() => setActiveCollection('All')} />
                )}
                {search && (
                  <FilterChip label={`"${search}"`} onRemove={() => setSearch('')} />
                )}
                <button
                  onClick={clearAll}
                  className="text-[10px] uppercase tracking-[0.15em] text-kawai-charcoal/40 hover:text-kawai-charcoal transition-colors font-[family-name:var(--font-brand-sans)] ml-1"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Collection Banner / Featured Carousel ───────────────── */}
      <AnimatePresence mode="wait">
        {activeCollectionObj ? (
          <motion.div
            key={activeCollectionObj.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <CollectionBanner collection={activeCollectionObj} category={category ?? null} />
          </motion.div>
        ) : featuredCollections.length > 0 ? (
          <motion.div
            key="featured-carousel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <FeaturedCollectionsCarousel
              collections={featuredCollections}
              eyebrow="Featured Collections"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Collection instrument count ──────────────────────────── */}
      <AnimatePresence>
        {activeCollectionObj && (
          <motion.div
            key={`count-${activeCollectionObj.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-8 md:px-12 pt-6 pb-2"
          >
            <p className="text-xs text-kawai-charcoal/40 tracking-[0.15em] uppercase font-[family-name:var(--font-brand-sans)]">
              {filtered.length} {filtered.length === 1 ? 'instrument' : 'instruments'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Product Grid ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={gridKey}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} site={site} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EmptyState hasFilters={hasFilters} onClear={clearAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── View Full Collection CTA ─────────────────────────────── */}
      <AnimatePresence>
        {activeCollectionHandle && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-6 pb-12 flex justify-center"
          >
            <Link
              href={`/pianos/${activeCollectionHandle}`}
              className="inline-flex items-center gap-3 px-12 py-4 text-base font-semibold tracking-[0.1em] uppercase bg-white text-kawai-black border-2 border-kawai-black hover:bg-kawai-pearl transition-colors duration-300 font-[family-name:var(--font-brand-sans)]"
            >
              Explore the Full Collection
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Filter chip ───────────────────────────────────────────────── */

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kawai-black/5 text-kawai-charcoal text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)]"
    >
      {label}
      <button
        onClick={onRemove}
        className="text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} />
      </button>
    </motion.span>
  )
}

/* ── Product Card ──────────────────────────────────────────────── */

function normalizeCategory(product: CatalogProduct): string {
  const raw = (product.category ?? product.type ?? '').toLowerCase()
  if (raw.includes('grand') || raw.includes('shigeru')) return 'Grand'
  if (raw.includes('digital') || raw.includes('concert artist')) return 'Digital'
  if (raw.includes('upright') || raw.includes('vertical')) return 'Upright'
  if (raw.includes('hybrid') || raw.includes('anytime') || raw.includes('novus') || raw.includes('aures')) return 'Hybrid'
  return 'Other'
}

function ProductCard({ product, index, site = 'us' }: { product: CatalogProduct; index: number; site?: 'us' | 'cad' }) {
  const [activeVariantIdx, setActiveVariantIdx] = useState(0)
  const category = normalizeCategory(product)
  const isLegacy = product.status === 'discontinued'

  const variants = product.variations ?? []
  const hasVariants = variants.length >= 2
  const activeVariant = hasVariants ? (variants[activeVariantIdx] ?? null) : null

  // Resolve price for the correct site
  const currency = site === 'cad' ? 'CAD' : (product.price?.currency ?? 'USD')
  const effectivePrice = site === 'cad'
    ? (activeVariant?.priceCAD ?? product.priceCAD?.price ?? product.priceCAD?.msrp ?? product.price?.msrp ?? null)
    : (activeVariant?.price ?? product.price?.msrp ?? null)
  const effectiveCompareAt = site === 'cad'
    ? (activeVariant?.compareAtPriceCAD ?? product.priceCAD?.msrp ?? null)
    : (activeVariant?.compareAtPrice ?? null)
  const hasPrice = effectivePrice != null
  const isOnSale = hasPrice && effectiveCompareAt != null && effectiveCompareAt > (effectivePrice ?? 0)

  // Resolved display values based on active variant
  const displayImageUrl = activeVariant?.imageUrl ?? product.imageUrl

  const visibleVariants = variants.slice(0, 5)
  const extraCount = variants.length > 5 ? variants.length - 5 : 0

  function prevVariant(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setActiveVariantIdx((i) => (i === 0 ? variants.length - 1 : i - 1))
  }

  function nextVariant(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setActiveVariantIdx((i) => (i + 1) % variants.length)
  }

  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible">
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col bg-kawai-pearl hover:bg-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-kawai-red h-full rounded-none"
      >
        {/* Image */}
        <div className={cn('relative aspect-square overflow-hidden bg-white', isLegacy && 'opacity-60 grayscale')}>
          {displayImageUrl ? (
            <Image
              src={displayImageUrl}
              alt={activeVariant?.name ?? product.name ?? product.model}
              fill
              className="object-contain p-10 transition-all duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F0EDE8]">
              <PianoSilhouette />
              <span className="text-[10px] uppercase tracking-[0.25em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
                {product.modelLabel ?? product.model}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3">
            {isLegacy ? (
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)] bg-kawai-red text-white">
                Legacy
              </span>
            ) : (
              <span
                className={cn(
                  'px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)]',
                  category === 'Grand' ? 'bg-kawai-gold/20 text-kawai-charcoal' : 'bg-kawai-black/5 text-kawai-charcoal',
                )}
              >
                {product.type ?? category}
              </span>
            )}
          </div>

          {isOnSale && !isLegacy && (
            <div className="absolute top-3 right-3">
              <span className="inline-block px-2 py-0.5 bg-kawai-red text-white text-[10px] uppercase tracking-[0.15em] font-semibold font-[family-name:var(--font-brand-sans)]">
                Sale
              </span>
            </div>
          )}

          {/* Variant controls */}
          {hasVariants && (
            <>
              {/* Arrow navigation — visible on hover */}
              <button
                onClick={prevVariant}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white text-kawai-black shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous variant"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextVariant}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white text-kawai-black shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next variant"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Variation thumbnail strip — always visible, elevated on hover */}
              <div className="absolute bottom-0 inset-x-0 pt-10 pb-3 bg-gradient-to-t from-white/85 via-white/40 to-transparent flex justify-center transition-opacity duration-300 opacity-80 group-hover:opacity-100">
                <div className="flex items-center gap-1.5">
                  {visibleVariants.map((v, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveVariantIdx(i) }}
                      className={cn(
                        'relative w-9 h-9 flex-shrink-0 bg-white overflow-hidden transition-all duration-300',
                        i === activeVariantIdx
                          ? 'ring-2 ring-kawai-black ring-offset-2 ring-offset-white opacity-100'
                          : 'ring-1 ring-kawai-neutral opacity-50 hover:opacity-80 hover:ring-kawai-charcoal/40',
                      )}
                      aria-label={`Select ${v.name} finish`}
                      title={v.name}
                    >
                      {v.imageUrl ? (
                        <Image
                          src={v.imageUrl}
                          alt={v.name}
                          fill
                          className="object-contain p-0.5"
                          sizes="36px"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={cn(
                            'absolute inset-0 flex items-center justify-center text-[7px] uppercase tracking-wide font-[family-name:var(--font-brand-sans)]',
                            i === activeVariantIdx
                              ? 'bg-kawai-black text-white'
                              : 'bg-kawai-charcoal/10 text-kawai-charcoal/50',
                          )}
                        >
                          {v.name.slice(0, 2)}
                        </div>
                      )}
                    </button>
                  ))}
                  {extraCount > 0 && (
                    <span className="text-[9px] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] pl-0.5 leading-none select-none">
                      +{extraCount}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-kawai-charcoal/50 mb-1 font-[family-name:var(--font-brand-sans)]">
            {product.modelLabel ?? product.model}
          </p>
          <h2
            className="text-2xl leading-tight text-kawai-black mb-auto"
            style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
          >
            {product.name ?? product.modelLabel ?? product.model}
          </h2>

          {/* Active finish + count */}
          {hasVariants && activeVariant ? (
            <div className="mt-2 flex items-center gap-2 min-h-[1.125rem]">
              <span className="w-[3px] h-[3px] rounded-full bg-kawai-charcoal/30 flex-shrink-0" />
              <p className="text-xs text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] tracking-wide leading-none truncate">
                {activeVariant.name}
              </p>
              <span className="ml-auto flex-shrink-0 text-[9px] uppercase tracking-[0.18em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
                {variants.length} finishes
              </span>
            </div>
          ) : product.shopifyCollections && product.shopifyCollections.length > 0 ? (
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] line-clamp-1">
              {product.shopifyCollections.slice(0, 2).map((c) => c.title).join(' · ')}
            </p>
          ) : null}

          <div className="my-4 h-px bg-kawai-neutral group-hover:bg-kawai-charcoal/20 transition-colors duration-300" />

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              {isOnSale ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-bold tracking-widest text-kawai-red uppercase font-[family-name:var(--font-brand-sans)]">MSRP</span>
                    <span className="text-[11px] text-kawai-charcoal/40 line-through font-[family-name:var(--font-brand-sans)]">
                      {formatCurrency(effectiveCompareAt ?? 0, currency)}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-kawai-red font-[family-name:var(--font-brand-sans)]">
                    {formatCurrency(effectivePrice ?? 0, currency)}
                  </p>
                </>
              ) : hasPrice ? (
                <>
                  <span className="text-[10px] font-bold tracking-widest text-kawai-red uppercase font-[family-name:var(--font-brand-sans)]">MSRP</span>
                  <p className="text-xl font-bold text-kawai-black font-[family-name:var(--font-brand-sans)]">
                    {formatCurrency(effectivePrice ?? 0, currency)}
                  </p>
                </>
              ) : (
                <p className="text-xs italic text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)]">Contact for Price</p>
              )}
            </div>

            <span
              className={cn(
                'flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em]',
                'font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/50',
                'group-hover:text-kawai-red transition-colors duration-300',
              )}
            >
              Discover
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                <path d="M7 1L10 4M10 4L7 7M10 4H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Empty State ───────────────────────────────────────────────── */

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-6xl text-kawai-black/8 mb-6 select-none" style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }} aria-hidden>
        ♩
      </p>
      <p className="text-2xl text-kawai-black mb-2" style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}>
        No instruments found
      </p>
      <p className="text-sm text-kawai-charcoal/60 mb-8 font-[family-name:var(--font-brand-sans)]">
        {hasFilters ? 'Try adjusting your search or filters.' : 'No products are currently available.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className={cn(
            'text-xs uppercase tracking-[0.2em] border border-kawai-neutral px-5 py-2',
            'text-kawai-charcoal hover:border-kawai-black hover:text-kawai-black',
            'transition-colors duration-200 font-[family-name:var(--font-brand-sans)]',
          )}
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

/* ── Piano silhouette placeholder ─────────────────────────────── */

function PianoSilhouette() {
  return (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden className="opacity-[0.15]">
      <rect x="2" y="2" width="52" height="24" rx="1.5" fill="#2C2C2C" />
      <rect x="2" y="28" width="52" height="8" rx="1.5" fill="#2C2C2C" />
      {[8, 16, 26, 34, 42].map((x) => (
        <rect key={x} x={x} y="2" width="5" height="14" rx="0.5" fill="white" />
      ))}
    </svg>
  )
}

