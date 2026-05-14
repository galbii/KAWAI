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

export interface CatalogProduct {
  id: string
  model: string
  modelLabel?: string | null
  name?: string | null
  slug: string
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
  collectionsForBrowser?: CollectionForBrowser[]
  pageHeading?: string | undefined
  site?: 'us' | 'cad'
}

const CATEGORIES = ['All', 'Grand', 'Shigeru', 'Digital', 'Upright', 'Hybrid', 'Accessories'] as const
type Category = (typeof CATEGORIES)[number]

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

const bannerHeightClasses: Record<string, string> = {
  xxs: 'h-[150px]',
  xs: 'h-[250px]',
  small: 'h-[400px]',
  medium: 'h-[600px]',
  large: 'h-[800px]',
  fullscreen: 'h-screen min-h-[600px]',
}

const bannerColorClasses: Record<string, string> = {
  white: 'text-white',
  black: 'text-kawai-black',
  'kawai-red': 'text-kawai-red',
  'kawai-gold': 'text-[#D4AF37]',
}

const bannerAlignmentClasses: Record<string, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

const bannerHeadingSizeClasses: Record<string, string> = {
  small: 'text-2xl md:text-3xl lg:text-4xl',
  medium: 'text-3xl md:text-4xl lg:text-5xl',
  large: 'text-4xl md:text-5xl lg:text-6xl',
  xl: 'text-5xl md:text-6xl lg:text-7xl',
}

const bannerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const bannerItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

function CollectionBanner({ collection }: { collection: CollectionForBrowser }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const videoId = collection.youtubeUrl ? parseYouTubeId(collection.youtubeUrl) : null
  const fallbackImage = collection.mediaUrl ?? collection.imageUrl ?? null

  const safeBannerSize = 'small'
  const safeTextColor = collection.textColor ?? 'white'
  const safeTextAlignment = collection.textAlignment ?? 'center'
  const safeOverlayOpacity = collection.overlayOpacity ?? 50
  const safeHeadingSize = collection.headingSize ?? 'medium'
  const safeFontFamily = collection.fontFamily ?? 'serif'

  const hasMedia = !!(videoId || fallbackImage)
  const hasContent = !!(collection.heading || collection.subheading)

  // Render nothing if no media and no content
  if (!hasMedia && !hasContent) return null

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        bannerHeightClasses[safeBannerSize] ?? bannerHeightClasses.xs,
      )}
    >
      {/* YouTube video background — full-cover 16:9 technique */}
      {videoId && (
        <div className="absolute inset-0 z-0">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            className={cn(
              'absolute top-1/2 left-1/2 w-[177.77777778vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none',
              'transition-opacity duration-1000',
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
          <Image src={fallbackImage} alt={collection.heading ?? collection.title} fill className="object-cover" sizes="100vw" priority />
        </div>
      )}

      {/* Dark background when no media */}
      {!hasMedia && (
        <div className="absolute inset-0 z-0 bg-kawai-black" />
      )}

      {/* Gradient overlay + grain */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,${safeOverlayOpacity / 100 * 0.7}) 0%, rgba(0,0,0,${safeOverlayOpacity / 100 * 0.5}) 50%, rgba(0,0,0,${safeOverlayOpacity / 100 * 0.8}) 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 z-20 opacity-30">
        <svg viewBox="0 0 100 100" className={bannerColorClasses[safeTextColor] ?? 'text-white'}>
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16 z-20 opacity-30 rotate-180">
        <svg viewBox="0 0 100 100" className={bannerColorClasses[safeTextColor] ?? 'text-white'}>
          <line x1="0" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        className={cn(
          'relative z-30 container mx-auto px-6 md:px-12 h-full flex flex-col justify-center',
          bannerAlignmentClasses[safeTextAlignment] ?? bannerAlignmentClasses.center,
        )}
        variants={bannerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {collection.heading && (
          <motion.h2
            variants={bannerItemVariants}
            className={cn(
              'font-bold leading-[1.1] mb-4 drop-shadow-2xl',
              bannerHeadingSizeClasses[safeHeadingSize] ?? bannerHeadingSizeClasses.medium,
              bannerColorClasses[safeTextColor] ?? 'text-white',
              safeFontFamily === 'serif' ? 'tracking-tight' : 'tracking-wide',
            )}
            style={{
              fontFamily: safeFontFamily === 'serif' ? 'Playfair Display, serif' : 'Inter, sans-serif',
              textShadow: '0 4px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {collection.heading}
          </motion.h2>
        )}

        {collection.heading && collection.subheading && (
          <motion.div
            variants={bannerItemVariants}
            className={cn(
              'w-12 h-[2px] mb-4',
              safeTextAlignment === 'center' && 'mx-auto',
              safeTextAlignment === 'right' && 'ml-auto',
            )}
            style={{
              background: `linear-gradient(90deg, ${safeTextColor === 'kawai-red' ? '#C41E3A' : safeTextColor === 'kawai-gold' ? '#D4AF37' : safeTextColor === 'black' ? '#1a1a1a' : '#ffffff'} 0%, transparent 100%)`,
            }}
          />
        )}

        {collection.subheading && (
          <motion.p
            variants={bannerItemVariants}
            className={cn(
              'text-base md:text-lg leading-relaxed max-w-2xl font-light tracking-wide opacity-90 drop-shadow-lg',
              bannerColorClasses[safeTextColor] ?? 'text-white',
            )}
            style={{ fontFamily: 'Inter, sans-serif', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            {collection.subheading}
          </motion.p>
        )}

      </motion.div>
    </section>
  )
}

function normalizeCategory(product: CatalogProduct): string {
  // Check canonical type field first (exact match — this is the source of truth)
  const type = product.type?.toLowerCase()
  if (type === 'accessory') return 'Accessories'
  if (type === 'grand') return 'Grand'
  if (type === 'shigeru') return 'Shigeru'
  if (type === 'digital') return 'Digital'
  if (type === 'upright') return 'Upright'
  if (type === 'hybrid') return 'Hybrid'
  // Fallback: scan the free-form category text field from Shopify taxonomy
  const cat = (product.category ?? '').toLowerCase()
  if (cat.includes('grand')) return 'Grand'
  if (cat.includes('shigeru')) return 'Shigeru'
  if (cat.includes('digital') || cat.includes('concert artist')) return 'Digital'
  if (cat.includes('upright') || cat.includes('vertical')) return 'Upright'
  if (cat.includes('hybrid') || cat.includes('anytime') || cat.includes('novus') || cat.includes('aures')) return 'Hybrid'
  return 'Other'
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
  activeCategory: Category
  onCategoryChange: (cat: Category) => void
  activeCollection: string
  setActiveCollection: (v: string) => void
  sort: string
  setSort: (v: string) => void
  visibleCollections: Array<{ title: string; handle: string }>
  resultCount: number
  itemLabel: string
  onClearAll: () => void
  sortOptions: typeof SORT_OPTIONS[number][]
}

function MobileFilterSheet({
  isOpen,
  onClose,
  search,
  setSearch,
  activeCategory,
  onCategoryChange,
  activeCollection,
  setActiveCollection,
  sort,
  setSort,
  visibleCollections,
  resultCount,
  itemLabel,
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

              <div className="h-px bg-kawai-neutral/50 mx-5" />

              {/* Category */}
              <div className="px-5 pt-4 pb-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-kawai-charcoal/50 mb-3 font-[family-name:var(--font-brand-sans)]">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => onCategoryChange(cat)}
                      className={cn(
                        'px-4 py-2 text-sm border transition-all duration-150 font-[family-name:var(--font-brand-sans)]',
                        activeCategory === cat
                          ? 'bg-kawai-black border-kawai-black text-white'
                          : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
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
                Show {resultCount} {itemLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Main Component ────────────────────────────────────────────── */

export function PianosBrowser({ products, collectionsForBrowser, pageHeading, site = 'us' }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeCollection, setActiveCollection] = useState<string>('All')
  const [sort, setSort] = useState<string>('default')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const filterPanelRef = useRef<HTMLDivElement>(null)

  const sortOptions = [...SORT_OPTIONS]

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setIsFiltersOpen(false)
      }
    }
    if (isFiltersOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFiltersOpen])

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

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat)
    setActiveCollection('All')
    scrollToBlock()
  }

  function handleCollectionChange(col: string) {
    setActiveCollection(col)
    scrollToBlock()
  }

  const visibleCollections = useMemo(() => {
    // Accessories don't have Shopify collections — suppress the filter entirely
    if (activeCategory === 'Accessories') return []
    if (collectionsForBrowser && collectionsForBrowser.length > 0) {
      if (activeCategory === 'All') return collectionsForBrowser
      const catLower = activeCategory.toLowerCase()
      return collectionsForBrowser.filter((c) =>
        (c.pianoCategories ?? []).includes(catLower),
      )
    }
    return deriveCollections(products)
  }, [collectionsForBrowser, products, activeCategory])

  const activeCollectionHandle = useMemo(() => {
    if (activeCollection === 'All') return null
    return visibleCollections.find((c) => c.title === activeCollection)?.handle ?? null
  }, [activeCollection, visibleCollections])

  const activeCollectionObj = useMemo(() => {
    if (activeCollection === 'All') return null
    return visibleCollections.find((c) => c.title === activeCollection) ?? null
  }, [activeCollection, visibleCollections])

  const featuredCollections = useMemo((): NavCollection[] => {
    return (collectionsForBrowser ?? [])
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
  }, [collectionsForBrowser])

  // Map of collection handle → priority for featured collections (used by default sort)
  const featuredPriorityMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of collectionsForBrowser ?? []) {
      if (c.featured) map.set(c.handle, c.collectionPriority ?? 0)
    }
    return map
  }, [collectionsForBrowser])

  const filtered = useMemo(() => {
    let items = [...products]

    if (activeCategory !== 'All') {
      items = items.filter((p) => normalizeCategory(p) === activeCategory)
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
      case 'default': {
        // Accessories always sort after pianos in the "All" view.
        // Within pianos: sort by the highest collectionPriority among featured collections.
        items.sort((a, b) => {
          const aIsAccessory = (a.type ?? '').toLowerCase() === 'accessory'
          const bIsAccessory = (b.type ?? '').toLowerCase() === 'accessory'
          if (aIsAccessory !== bIsAccessory) return aIsAccessory ? 1 : -1
          const aMax = Math.max(0, ...(a.shopifyCollections ?? []).map((c) => featuredPriorityMap.get(c.handle) ?? 0))
          const bMax = Math.max(0, ...(b.shopifyCollections ?? []).map((c) => featuredPriorityMap.get(c.handle) ?? 0))
          return bMax - aMax
        })
        break
      }
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

    return items
  }, [products, search, activeCategory, activeCollection, sort, featuredPriorityMap])

  const hasFilters = search.trim() !== '' || activeCategory !== 'All' || activeCollection !== 'All'

  const activeFilterCount = (activeCategory !== 'All' ? 1 : 0) +
    (activeCollection !== 'All' ? 1 : 0) +
    (search.trim() ? 1 : 0)

  const gridKey = `${activeCategory}|${activeCollection}|${search.trim()}|${sort}`

  const itemLabel = activeCategory === 'Accessories'
    ? filtered.length === 1 ? 'accessory' : 'accessories'
    : filtered.length === 1 ? 'instrument' : 'instruments'

  function clearAll() {
    setSearch('')
    setActiveCategory('All')
    setActiveCollection('All')
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-kawai-pearl">

      {/* ── Mobile filter sheet ──────────────────────────────────── */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        search={search} setSearch={setSearch}
        activeCategory={activeCategory} onCategoryChange={handleCategoryChange}
        activeCollection={activeCollection} setActiveCollection={handleCollectionChange}
        sort={sort} setSort={setSort}
        visibleCollections={visibleCollections}
        resultCount={filtered.length}
        itemLabel={itemLabel}
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
          <div className="hidden md:flex items-center h-18 gap-5">

            {/* Search — minimal underline */}
            <div className="relative group w-72">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search size={16} className="text-kawai-charcoal/50" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models…"
                className={cn(
                  'w-full h-11 bg-white pl-10 pr-9 text-sm rounded-sm',
                  'text-kawai-black placeholder:text-kawai-charcoal/50',
                  'focus:outline-none focus:ring-0 font-[family-name:var(--font-brand-sans)]',
                  'transition-colors duration-200 border',
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

            {/* Spacer */}
            <div className="flex-1" />

            {/* Results count */}
            <AnimatePresence mode="wait">
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium text-kawai-charcoal font-[family-name:var(--font-brand-sans)] whitespace-nowrap tabular-nums"
              >
                {filtered.length} {itemLabel}
              </motion.span>
            </AnimatePresence>

            {/* Filters button + dropdown */}
            <div className="relative flex-shrink-0" ref={filterPanelRef}>
              <button
                onClick={() => setIsFiltersOpen((v) => !v)}
                aria-expanded={isFiltersOpen}
                aria-haspopup="true"
                className={cn(
                  'flex items-center gap-2.5 h-11 px-5 text-sm uppercase tracking-[0.12em] font-semibold',
                  'border-2 transition-all duration-200 font-[family-name:var(--font-brand-sans)]',
                  'focus-visible:outline-2 focus-visible:outline-kawai-red',
                  isFiltersOpen || activeFilterCount > 0
                    ? 'bg-kawai-black border-kawai-black text-white'
                    : 'border-kawai-charcoal text-kawai-charcoal hover:border-kawai-black hover:text-kawai-black',
                )}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15, type: 'spring', bounce: 0.3 }}
                      className="flex items-center justify-center w-5 h-5 rounded-full bg-kawai-red text-white text-[10px] font-bold leading-none"
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Filter dropdown panel */}
              <AnimatePresence>
                {isFiltersOpen && (
                  <motion.div
                    key="filter-panel"
                    initial={{ opacity: 0, scale: 0.97, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, y: -6 }}
                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 top-[calc(100%+10px)] w-[480px] bg-white border border-kawai-neutral shadow-[0_12px_48px_-8px_rgba(0,0,0,0.13)] z-50"
                  >
                    <div className="p-6 space-y-6">

                      {/* Category */}
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-kawai-charcoal/40 mb-3 font-[family-name:var(--font-brand-sans)]">
                          Category
                        </p>
                        <LayoutGroup id="filter-panel-cats">
                          <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => { handleCategoryChange(cat) }}
                                className={cn(
                                  'relative px-4 py-2 text-xs uppercase tracking-[0.1em] border transition-colors duration-150',
                                  'font-[family-name:var(--font-brand-sans)] focus-visible:outline-2 focus-visible:outline-kawai-red',
                                  activeCategory === cat
                                    ? 'border-kawai-black bg-kawai-black text-white'
                                    : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal',
                                )}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </LayoutGroup>
                      </div>

                      {/* Collection */}
                      {visibleCollections.length > 0 && (
                        <div>
                          <div className="h-px bg-kawai-neutral/50 -mx-6 mb-6" />
                          <p className="text-[9px] uppercase tracking-[0.25em] text-kawai-charcoal/40 mb-3 font-[family-name:var(--font-brand-sans)]">
                            Collection
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleCollectionChange('All')}
                              className={cn(
                                'px-4 py-2 text-xs uppercase tracking-[0.1em] border transition-colors duration-150',
                                'font-[family-name:var(--font-brand-sans)]',
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
                                onClick={() => handleCollectionChange(col.title)}
                                className={cn(
                                  'px-4 py-2 text-xs uppercase tracking-[0.1em] border transition-colors duration-150',
                                  'font-[family-name:var(--font-brand-sans)]',
                                  activeCollection === col.title
                                    ? 'border-kawai-red text-kawai-red'
                                    : 'border-kawai-neutral text-kawai-charcoal hover:border-kawai-charcoal',
                                )}
                              >
                                {col.title}
                              </button>
                            ))}
                          </div>

                          {/* View Collection link */}
                          <AnimatePresence>
                            {activeCollectionHandle && (
                              <motion.a
                                key="view-col"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.18 }}
                                href={`/pianos/${activeCollectionHandle}`}
                                className="inline-flex items-center gap-1.5 mt-4 text-[10px] uppercase tracking-[0.15em] text-kawai-red hover:underline font-[family-name:var(--font-brand-sans)]"
                              >
                                View full collection
                                <svg viewBox="0 0 16 16" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.a>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-kawai-neutral/60">
                      <button
                        onClick={() => { clearAll() }}
                        className="text-[10px] uppercase tracking-[0.15em] text-kawai-charcoal/40 hover:text-kawai-charcoal transition-colors font-[family-name:var(--font-brand-sans)]"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setIsFiltersOpen(false)}
                        className={cn(
                          'flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-[0.12em]',
                          'bg-kawai-black text-white hover:bg-kawai-charcoal transition-colors duration-150',
                          'font-[family-name:var(--font-brand-sans)]',
                        )}
                      >
                        Done
                        <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-kawai-charcoal/25 flex-shrink-0" />

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={cn(
                  'appearance-none h-11 bg-white border border-kawai-neutral pl-4 pr-10 text-sm font-medium',
                  'text-kawai-charcoal focus:outline-none focus:ring-0 cursor-pointer rounded-sm',
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
          <div className="md:hidden py-3">
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
                {activeCategory !== 'All' && (
                  <FilterChip label={activeCategory} onRemove={() => setActiveCategory('All')} />
                )}
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

      {/* ── Featured Collections Carousel — always first ────────── */}
      {featuredCollections.length > 0 && !activeCollectionObj && (
        <FeaturedCollectionsCarousel
          collections={featuredCollections}
          eyebrow="Featured Collections"
          heading="Shop by Collection"
        />
      )}

      {/* ── Collection Banner (selected collection hero) ────────── */}
      <AnimatePresence mode="wait">
        {activeCollectionObj && (
          <motion.div
            key={activeCollectionObj.title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <CollectionBanner collection={activeCollectionObj} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collection Title ────────────────────────────────────── */}
      <AnimatePresence>
        {activeCollectionObj && (
          <motion.div
            key={`title-${activeCollectionObj.title}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-7xl mx-auto px-6 pt-10 pb-2"
          >
            <div className="flex items-baseline gap-4">
              <h2
                className="text-4xl md:text-5xl lg:text-6xl text-kawai-black"
                style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 700 }}
              >
                {activeCollectionObj.title}
              </h2>
              <span className="text-sm text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)]">
                {filtered.length} {itemLabel}
              </span>
            </div>
            {(activeCollectionObj as CollectionForBrowser).subheading && (
              <p className="mt-2 text-sm text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] max-w-2xl">
                {(activeCollectionObj as CollectionForBrowser).subheading}
              </p>
            )}
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

function ProductCard({ product, index, site = 'us' }: { product: CatalogProduct; index: number; site?: 'us' | 'cad' }) {
  const [activeVariantIdx, setActiveVariantIdx] = useState(0)
  const category = normalizeCategory(product)

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
        <div className="relative aspect-square overflow-hidden bg-white">
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
            <span
              className={cn(
                'px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)]',
                category === 'Grand'
                  ? 'bg-kawai-gold/20 text-kawai-charcoal'
                  : category === 'Accessories'
                    ? 'bg-kawai-charcoal/10 text-kawai-charcoal/70'
                    : 'bg-kawai-black/5 text-kawai-charcoal',
              )}
            >
              {category === 'Accessories' ? 'Accessory' : (product.type ?? category)}
            </span>
          </div>

          {isOnSale && (
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
