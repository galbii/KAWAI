'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useQueryStates, parseAsString } from 'nuqs'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bluetooth, BookOpen, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductTypeNav, NavProduct, NavCollection } from '@/lib/payload/products-navigation'
import { getProductsByCollection } from '@/lib/actions/collection-products'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_CATEGORIES = [
  { label: 'Digital',       key: 'digital',       href: '/pianos/digital',       terms: ['digital'] },
  { label: 'Hybrid',        key: 'hybrid',         href: '/pianos/hybrid',        terms: ['hybrid'] },
  { label: 'Upright',       key: 'upright',        href: '/pianos/upright',       terms: ['upright'] },
  { label: 'Grand',         key: 'grand',          href: '/pianos/grand',         terms: ['grand', 'baby grand', 'baby-grand', 'gl series'] },
  {
    label: 'Shigeru Kawai',
    key: 'shigeru-kawai',
    href: '/pianos/shigeru-kawai',
    terms: [],
    bannerOnly: true as const,
    comingSoon: true as const,
  },
  {
    label: 'Accessories',
    key: 'accessories',
    href: '/pianos/accessories',
    terms: [],
    bannerOnly: true as const,
    accessoriesPanel: true as const,
  },
  {
    label: 'Apps & Software',
    key: 'apps-software',
    href: '/apps-software',
    terms: [],
    bannerOnly: true as const,
    appsPanel: true as const,
  },
] as const

const NAV_SESSION_KEY = 'kawai-nav-state'

const BANNER_SIZE_HEIGHT: Record<string, string> = {
  xxs:        'h-[150px]',
  xs:         'h-[250px]',
  small:      'h-[400px]',
  medium:     'h-[600px]',
  large:      'h-[800px]',
  fullscreen: 'h-screen',
}

type SidebarKey = (typeof SIDEBAR_CATEGORIES)[number]['key']

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsMegaMenuProps {
  productTypes: ProductTypeNav[]
  collections: NavCollection[]
  allCollections?: NavCollection[]
  isOpen: boolean
  onClose: () => void
  className?: string
  isLoading?: boolean
  isHeaderScrolled?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

function getProductsForSidebarKey(productTypes: ProductTypeNav[], terms: readonly string[]): NavProduct[] {
  return productTypes
    .filter((t) => terms.some((term) => t.type.toLowerCase().includes(term.toLowerCase())))
    .flatMap((t) => t.products)
}

function getSidebarKeyForCollection(collection: NavCollection): SidebarKey | null {
  const titleLower = collection.title.toLowerCase()
  const handleLower = collection.handle.toLowerCase()
  for (const cat of SIDEBAR_CATEGORIES) {
    if (cat.terms.some((term) => titleLower.includes(term) || handleLower.includes(term))) {
      return cat.key
    }
  }
  return null
}

function getCollectionsForSidebarKey(collections: NavCollection[], key: SidebarKey): NavCollection[] {
  return collections.filter((col) => {
    if (col.pianoCategories && col.pianoCategories.length > 0) return col.pianoCategories.includes(key)
    return getSidebarKeyForCollection(col) === key
  })
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

const SCROLL_CLASS = 'flex gap-7 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:#C8C2BA_#EDE9E3] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#EDE9E3] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C2BA] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#A01829]'
const NAV_BTN_CLASS = 'absolute top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10'

function NavArrow({ dir, onClick, offset = '-left-5' }: { dir: 'left' | 'right'; onClick: () => void; offset?: string }) {
  return (
    <motion.button
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClick}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      className={cn(NAV_BTN_CLASS, dir === 'left' ? offset : offset.replace('left', 'right'))}
    >
      {dir === 'left' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </motion.button>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-8 px-10 py-0 border-b border-[#E8E4DF]">
        {[36, 52, 44, 60, 40, 96, 76].map((w, i) => (
          <div key={i} className="py-4">
            <div style={{ width: w }} className="h-2.5 bg-[#EDE9E3] rounded-full animate-pulse" />
          </div>
        ))}
      </div>
      <div className="px-12 py-8">
        <div className="h-8 w-52 bg-[#EDE9E3] rounded animate-pulse mb-7" />
        <div className="grid grid-cols-3 gap-7">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-[#EDE9E3] rounded-2xl animate-pulse" />
              <div className="h-3 w-20 bg-[#EDE9E3] rounded animate-pulse" />
              <div className="h-5 w-44 bg-[#EDE9E3] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Collection Carousel Card ─────────────────────────────────────────────────

function CollectionCarouselCard({
  collection,
  onClose,
  onCategorySelect,
  index = 0,
}: {
  collection: NavCollection
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
  index?: number
}) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  const imageUrl = collection.mediaUrl ?? thumbnail ?? collection.imageUrl ?? null
  const hasMedia = Boolean(imageUrl || videoId)
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`

  return (
    <div className="group relative w-full">
      <Link href={collectionHref} onClick={onClose} className="relative w-full text-left block" aria-label={`Browse ${displayTitle}`}>
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#EAE6E0] aspect-video">
          {imageUrl && (
            <Image src={imageUrl} alt={displayTitle} fill sizes="(max-width: 1280px) 33vw, 500px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          {!hasMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase text-[#B8AFA6]">{displayTitle}</span>
            </div>
          )}
          {hasMedia && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none rounded-2xl" />}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/70 mb-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {collection.productCount > 0 ? `${collection.productCount} Models` : 'Collection'}
            </p>
            <h3 className="text-xl font-bold text-white font-serif leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)' }}>{displayTitle}</h3>
            {collection.subheading && <p className="text-sm text-white/80 mt-1.5 line-clamp-1" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{collection.subheading}</p>}
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
        </div>
      </Link>

      <Link
        href={collectionHref}
        onClick={onClose}
        className="mt-4 flex items-center justify-center w-full py-2.5 bg-[#1E1B16] text-white text-sm font-semibold tracking-[0.07em] uppercase rounded-lg hover:bg-[#2C2C2C] transition-colors duration-200"
        aria-label={`View all ${displayTitle} models`}
      >
        Explore Collection
      </Link>
    </div>
  )
}

// ─── Collection Carousel (default view) ───────────────────────────────────────

function CollectionCarousel({ collections, onClose, onCategorySelect }: {
  collections: NavCollection[]
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#2C2C2C] font-serif leading-none">Featured Collections</h2>
      </div>

      {collections.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#B8AFA6]">Select a piano family to explore.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-8">
            {collections.length === 1 ? (
              <div className="col-start-2">
                <CollectionCarouselCard collection={collections[0]!} onClose={onClose} onCategorySelect={onCategorySelect} index={0} />
              </div>
            ) : (
              collections.map((col, i) => (
                <CollectionCarouselCard key={col.id} collection={col} onClose={onClose} onCategorySelect={onCategorySelect} index={i} />
              ))
            )}
          </div>

        </>
      )}
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClose }: { product: NavProduct; onClose: () => void }) {
  return (
    <Link href={`/products/${product.handle}`} onClick={onClose} className="block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white mb-4">
        {product.image ? (
          <Image src={product.image.url} alt={product.image.alt} fill sizes="(max-width: 1280px) 22vw, 280px" className="object-contain p-2" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#C8C2BA]">No image</span>
          </div>
        )}
      </div>
      <h3 className="text-[15px] font-semibold text-[#2C2C2C] leading-snug line-clamp-2 font-serif px-0.5">
        {product.model ?? product.title}
      </h3>
    </Link>
  )
}

// ─── Collection Top Banner ────────────────────────────────────────────────────
// Cinematic hero shown at the TOP of CategoryView when a collection tab is active.

function CollectionTopBanner({ collection, onClose }: { collection: NavCollection; onClose: () => void }) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  const imageUrl = collection.mediaUrl ?? thumbnail ?? collection.imageUrl ?? null
  const displayTitle = collection.heading || collection.title
  const collectionHref = `/pianos/${collection.handle}`

  return (
    <motion.div
      key={collection.handle}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative h-72 -mx-14 -mt-10 mb-8 overflow-hidden bg-[#111]"
    >
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={displayTitle}
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      {!imageUrl && <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B16] to-[#3a3530]" />}

      {/* Cinematic gradient — heavy left, fades right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10 pointer-events-none" />
      {/* Subtle bottom vignette for grounding */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        {/* Left — identity */}
        <div className="flex flex-col gap-1.5">
          {collection.productCount > 0 && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08, duration: 0.22 }}
              className="text-xs font-bold tracking-[0.28em] uppercase text-white/60 mb-0.5"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}
            >
              {collection.productCount} Models
            </motion.p>
          )}
          <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.26 }}
            className="text-4xl font-bold text-white font-serif leading-tight"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.5)' }}
          >
            {displayTitle}
          </motion.h3>
          {collection.subheading && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16, duration: 0.22 }}
              className="text-base text-white/70 leading-relaxed max-w-sm line-clamp-1 mt-1"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              {collection.subheading}
            </motion.p>
          )}
        </div>

        {/* Right — CTA */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.24 }}
        >
          <Link
            href={collectionHref}
            onClick={onClose}
            className="group flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/30 bg-white/10 hover:bg-[#A01829] hover:border-[#A01829] text-white text-[15px] font-semibold transition-all duration-200 backdrop-blur-sm flex-shrink-0 tracking-wide"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* Thin red accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#A01829] via-[#A01829]/60 to-transparent" />
    </motion.div>
  )
}

// ─── Collection Video Banner ───────────────────────────────────────────────────
// Cinematic strip shown at the bottom of CategoryView when a collection tab is active.

function CollectionVideoBanner({ collection, onClose, heightClass = 'h-44', externalCtaUrl, comingSoon }: { collection: NavCollection; onClose: () => void; heightClass?: string; externalCtaUrl?: string; comingSoon?: boolean }) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const displayTitle = collection.heading || collection.title
  const collectionHref = externalCtaUrl ?? `/pianos/${collection.handle}`
  const isExternal = Boolean(externalCtaUrl)

  return (
    <motion.div
      key={collection.handle}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={cn('mt-5 relative rounded-2xl overflow-hidden bg-[#111]', heightClass)}
    >
      {imageUrl && (
        <Image src={imageUrl} alt={displayTitle} fill sizes="100vw" className="object-cover" />
      )}
      {!imageUrl && !videoId && <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A]" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 pointer-events-none" />
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-serif font-semibold tracking-wide text-white/60">Coming Soon</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-between px-8">
        <div className="text-white min-w-0 mr-8">
          {collection.productCount > 0 && (
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-white/50 mb-1.5">{collection.productCount} Models</p>
          )}
          <h3 className="text-2xl font-bold font-serif leading-tight truncate">{displayTitle}</h3>
          {collection.subheading && <p className="text-[15px] text-white/60 mt-1 line-clamp-1">{collection.subheading}</p>}
        </div>
        {!comingSoon && (isExternal ? (
          <a
            href={collectionHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 hover:bg-[#A01829] border border-white/25 hover:border-[#A01829] rounded-full text-[15px] font-medium text-white transition-all duration-200 flex-shrink-0"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link
            href={collectionHref}
            onClick={onClose}
            className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 hover:bg-[#A01829] border border-white/25 hover:border-[#A01829] rounded-full text-[15px] font-medium text-white transition-all duration-200 flex-shrink-0"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Category View ─────────────────────────────────────────────────────────────
// Shown when a sidebar category is selected.
// Pill tabs: "All" (featured products) + one per tagged collection (fetched on demand).
// Bottom: video banner for the active collection.

// ─── Collection Footer ────────────────────────────────────────────────────────
// Sticky footer strip showing collection pills. Lives outside the scroll area.

function CollectionFooter({ collections, activeHandle, onSelect, onClose, categoryHref, categoryLabel }: {
  collections: NavCollection[]
  activeHandle: string
  onSelect: (handle: string) => void
  onClose: () => void
  categoryHref: string
  categoryLabel: string | null
}) {
  if (collections.length === 0) return null

  const ctaHref = categoryHref
  const ctaLabel = categoryLabel ? `Browse All ${categoryLabel}` : 'Browse All Products'

  return (
    <div className="flex-shrink-0 border-b border-[#E8E4DF] bg-[#FAF9F7] px-12 py-3.5">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#C8C2BA] whitespace-nowrap flex-shrink-0">
          Collections
        </span>
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0.5 flex-1">
          {collections.map((col) => {
            const label = col.heading || col.title
            const isActive = activeHandle === col.handle
            return (
              <button
                key={col.id}
                onClick={() => onSelect(isActive ? 'all' : col.handle)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-150',
                  isActive ? 'bg-[#A01829] text-white' : 'bg-[#F2EFE9] text-[#8A8078] hover:bg-[#EDE9E3] hover:text-[#2C2C2C]'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* CTA — bottom-right */}
        <Link
          href={ctaHref}
          onClick={onClose}
          className="group flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#E11922] hover:bg-[#C41019] rounded-full text-sm font-semibold text-white transition-colors duration-150 whitespace-nowrap ml-auto"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

// ─── Category View ─────────────────────────────────────────────────────────────

function CategoryView({ sidebarKey, collections, allTabProducts, categoryHref, label, onClose, activeCollectionHandle }: {
  sidebarKey: string
  collections: NavCollection[]
  allTabProducts: NavProduct[]
  categoryHref: string
  label: string
  onClose: () => void
  activeCollectionHandle: string
}) {
  const [fetchedProducts, setFetchedProducts] = useState<NavProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    if (activeCollectionHandle === 'all') { setFetchedProducts([]); return }
    let cancelled = false
    setIsLoadingProducts(true)
    getProductsByCollection(activeCollectionHandle)
      .then((products) => { if (!cancelled) setFetchedProducts(products) })
      .catch(() => { if (!cancelled) setFetchedProducts([]) })
      .finally(() => { if (!cancelled) setIsLoadingProducts(false) })
    return () => { cancelled = true }
  }, [activeCollectionHandle])

  const displayProducts = activeCollectionHandle === 'all' ? allTabProducts : fetchedProducts
  const activeCollection = collections.find((c) => c.handle === activeCollectionHandle)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect() }
  }, [updateScrollState, displayProducts])

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * ((el.offsetWidth - 56) / 3 + 28), behavior: 'smooth' })
  }, [])

  return (
    <div>
      {/* Collection banner — top, shown when a collection is selected */}
      <AnimatePresence mode="wait">
        {activeCollectionHandle !== 'all' && activeCollection && !isLoadingProducts && (
          <CollectionTopBanner key={activeCollection.handle} collection={activeCollection} onClose={onClose} />
        )}
      </AnimatePresence>

      {/* Product scroll */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeCollectionHandle}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        >
          {isLoadingProducts ? (
            <div className="flex gap-7">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[calc((100%-56px)/3)] flex-shrink-0 space-y-3">
                  <div className="aspect-[4/3] bg-[#EDE9E3] rounded-2xl animate-pulse" />
                  <div className="h-3.5 w-28 bg-[#EDE9E3] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-[#B8AFA6] mb-4">No products found.</p>
              <Link href={categoryHref} onClick={onClose} className="text-sm font-medium text-[#A01829] hover:underline">
                Browse all {label} pianos →
              </Link>
            </div>
          ) : (
            <div className="relative">
              <AnimatePresence>
                {canScrollLeft && <NavArrow dir="left" onClick={() => scrollBy(-1)} />}
              </AnimatePresence>
              <div ref={scrollRef} className={SCROLL_CLASS}>
                {displayProducts.map((product) => (
                  <div key={product.id} className="min-w-[calc((100%-56px)/3)] snap-start flex-shrink-0">
                    <ProductCard product={product} onClose={onClose} />
                  </div>
                ))}
              </div>
              <AnimatePresence>
                {canScrollRight && <NavArrow dir="right" onClick={() => scrollBy(1)} offset="-right-5" />}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}

// ─── Banner-Only View ─────────────────────────────────────────────────────────
// Shown for categories like Shigeru Kawai that render only a collection banner.

function BannerOnlyView({ label, href, externalCtaUrl, collectionHandle, collections, onClose, comingSoon }: {
  label: string
  href: string
  externalCtaUrl?: string
  collectionHandle: string
  collections: NavCollection[]
  onClose: () => void
  comingSoon?: boolean
}) {
  const collection = collections.find((c) => c.handle === collectionHandle)
  const heightClass = collection?.bannerSize ? (BANNER_SIZE_HEIGHT[collection.bannerSize] ?? 'h-[250px]') : 'h-[250px]'
  const ctaHref = externalCtaUrl ?? href
  const isExternal = Boolean(externalCtaUrl)

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#2C2C2C] font-serif leading-none">{label}</h2>
        {comingSoon ? (
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B8AFA6]">Coming Soon</span>
        ) : isExternal ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center gap-2 text-sm font-medium text-[#A01829]"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link href={ctaHref} onClick={onClose} className="group flex items-center gap-2 text-sm font-medium text-[#A01829]">
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Banner */}
      {collection ? (
        <CollectionVideoBanner collection={collection} onClose={onClose} heightClass={heightClass} {...(externalCtaUrl !== undefined && { externalCtaUrl })} {...(comingSoon && { comingSoon })} />
      ) : (
        <div className="flex items-center justify-center py-16">
          <Link href={href} onClick={onClose} className="text-sm font-medium text-[#A01829] hover:underline">
            Explore {label} →
          </Link>
        </div>
      )}

      {/* Post-banner CTA — only for comingSoon panels */}
      {comingSoon && (
        <motion.div
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-center mt-5"
        >
          <Link
            href="/pianos"
            onClick={onClose}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#E11922] hover:bg-[#C41019] rounded-full text-sm font-semibold text-white transition-colors duration-200"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

// ─── Accessories Panel ────────────────────────────────────────────────────────
// Shown when "Accessories" is selected in the sidebar.

function AccessoriesBannerView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      {/* Ornamental rule */}
      <div className="flex items-center gap-3 mb-8 w-full max-w-[260px]">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D5C78C]" />
        <div className="w-1 h-1 rounded-full bg-[#D5C78C]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D5C78C]" />
      </div>

      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B8AFA6] mb-3">
        Accessories
      </p>

      <h2 className="text-4xl font-serif text-[#1E1B16] leading-[1.1] mb-4">
        Coming Soon
      </h2>

      <p className="text-sm text-[#8A8078] leading-relaxed max-w-[220px] mb-8">
        Benches, pedals, headphones, and care essentials — curated for the discerning pianist.
      </p>

      <Link
        href="/pianos"
        onClick={onClose}
        className={cn(
          'group inline-flex items-center gap-2.5 px-6 py-2.5',
          'border border-[#2C2C2C] rounded-full',
          'text-xs font-semibold tracking-[0.12em] uppercase text-[#2C2C2C]',
          'hover:bg-[#2C2C2C] hover:text-white transition-all duration-200'
        )}
      >
        Explore Pianos
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>

      {/* Ornamental rule */}
      <div className="flex items-center gap-3 mt-8 w-full max-w-[260px]">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D5C78C]" />
        <div className="w-1 h-1 rounded-full bg-[#D5C78C]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D5C78C]" />
      </div>
    </motion.div>
  )
}

// ─── Apps & Software Panel ────────────────────────────────────────────────────
// Shown when "Apps & Software" is selected in the sidebar.

function AppsSoftwarePanelView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      {/* Ornamental rule */}
      <div className="flex items-center gap-3 mb-8 w-full max-w-[260px]">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D5C78C]" />
        <div className="w-1 h-1 rounded-full bg-[#D5C78C]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D5C78C]" />
      </div>

      <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B8AFA6] mb-3">
        Apps &amp; Software
      </p>

      <h2 className="text-4xl font-serif text-[#1E1B16] leading-[1.1] mb-4">
        Coming Soon
      </h2>

      {/* App icons */}
      <div className="flex items-center gap-8 mb-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE7] flex items-center justify-center">
            <Bluetooth className="h-5 w-5 text-[#8A8078]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#B8AFA6]">Piano Remote</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE7] flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-[#8A8078]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#B8AFA6]">PiaBookPlayer</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F0EDE7] flex items-center justify-center">
            <Music2 className="h-5 w-5 text-[#8A8078]" />
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#B8AFA6]">Aures Music</span>
        </div>
      </div>

      <p className="text-sm text-[#8A8078] leading-relaxed max-w-[220px] mb-5">
        Companion apps and software to elevate your playing experience.
      </p>

      <div className="flex items-center gap-2 mb-8">
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A01829] opacity-60" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[#A01829]" />
        </span>
        <span className="text-[11px] font-medium tracking-wide text-[#B8AFA6]">More details coming soon</span>
      </div>

      <Link
        href="/pianos"
        onClick={onClose}
        className={cn(
          'group inline-flex items-center gap-2.5 px-6 py-2.5',
          'border border-[#2C2C2C] rounded-full',
          'text-xs font-semibold tracking-[0.12em] uppercase text-[#2C2C2C]',
          'hover:bg-[#2C2C2C] hover:text-white transition-all duration-200'
        )}
      >
        Explore Pianos
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>

      {/* Ornamental rule */}
      <div className="flex items-center gap-3 mt-8 w-full max-w-[260px]">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#D5C78C]" />
        <div className="w-1 h-1 rounded-full bg-[#D5C78C]" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#D5C78C]" />
      </div>
    </motion.div>
  )
}

// ─── Top Tab Bar ──────────────────────────────────────────────────────────────

function TopTabBar({ selectedKey, onSelect, onClose, productTypes }: {
  selectedKey: SidebarKey | null
  onSelect: (key: SidebarKey | null) => void
  onClose: () => void
  productTypes: ProductTypeNav[]
}) {
  const availableCategories = SIDEBAR_CATEGORIES.filter(
    (cat) => 'bannerOnly' in cat || getProductsForSidebarKey(productTypes, cat.terms).length > 0
  )

  const tabs: { label: string; key: SidebarKey | null }[] = [
    { label: 'All', key: null },
    ...availableCategories.map((cat) => ({ label: cat.label, key: cat.key as SidebarKey })),
  ]

  return (
    <div className="flex items-stretch gap-0 px-12 bg-[#FAF9F7] border-b border-[#E8E4DF]">
      {tabs.map((tab) => {
        const isActive = selectedKey === tab.key
        const isAccessories = tab.key === 'accessories'
        return (
          <div key={tab.key ?? 'all'} className={cn('flex items-stretch', isAccessories && 'ml-5 pl-5 border-l border-[#E8E4DF]')}>
            <button
              onClick={() => onSelect(tab.key)}
              className={cn(
                'relative flex items-center px-5 py-5 text-[15px] whitespace-nowrap transition-colors duration-150 outline-none',
                isActive ? 'text-[#1E1B16] font-semibold' : 'text-[#9A9189] font-medium hover:text-[#2C2C2C]'
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="mega-menu-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#A01829] rounded-t-full"
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </button>
          </div>
        )
      })}

    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductsMegaMenu({
  productTypes,
  collections,
  allCollections,
  isOpen,
  onClose,
  className,
  isLoading = false,
  isHeaderScrolled = false,
}: ProductsMegaMenuProps) {
  const [menuState, setMenuState] = useQueryStates(
    {
      nav_cat: parseAsString.withDefault(''),
      nav_col: parseAsString.withDefault('all'),
    },
    { history: 'replace', shallow: true, clearOnDefault: true },
  )

  // Derive typed selectedKey — fall back to null if URL value isn't a valid category
  const selectedKey = (
    SIDEBAR_CATEGORIES.some((c) => c.key === menuState.nav_cat) ? menuState.nav_cat : null
  ) as SidebarKey | null

  const activeCollectionHandle = menuState.nav_col

  function setSelectedKey(key: SidebarKey | null) {
    if (key === null) {
      // Explicit "All" — clear persistence so reopening the menu doesn't re-restore
      try { sessionStorage.removeItem(NAV_SESSION_KEY) } catch { /* ignore */ }
    }
    setMenuState({ nav_cat: key ?? '', nav_col: 'all' })
  }

  function setActiveCollectionHandle(handle: string) {
    setMenuState({ nav_col: handle })
  }

  // Persist selected category + collection for the session so navigating to another page
  // and reopening the menu restores the last selection (nuqs resets on URL change).
  useEffect(() => {
    if (!menuState.nav_cat) return
    try {
      sessionStorage.setItem(
        NAV_SESSION_KEY,
        JSON.stringify({ nav_cat: menuState.nav_cat, nav_col: menuState.nav_col }),
      )
    } catch { /* sessionStorage unavailable */ }
  }, [menuState.nav_cat, menuState.nav_col])

  // Tracks whether we've already attempted a restore for this menu open — prevents
  // the effect from re-running after setMenuState updates nav_cat mid-session.
  const hasRestoredRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      hasRestoredRef.current = false // reset on close so next open can restore again
      return
    }
    if (hasRestoredRef.current || menuState.nav_cat) return
    try {
      const saved = sessionStorage.getItem(NAV_SESSION_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as { nav_cat?: string; nav_col?: string }
      if (parsed.nav_cat && SIDEBAR_CATEGORIES.some((c) => c.key === parsed.nav_cat)) {
        hasRestoredRef.current = true
        void setMenuState({ nav_cat: parsed.nav_cat, nav_col: parsed.nav_col ?? 'all' })
      }
    } catch { /* ignore */ }
  }, [isOpen, menuState.nav_cat, setMenuState])

  const selectedProducts = useMemo(() => {
    if (!selectedKey) return []
    const cat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)
    if (!cat) return []
    const products = getProductsForSidebarKey(productTypes, cat.terms)
    // Build a set of handles for this category's featured collections (featured: true)
    // so we can float products that belong to them to the top.
    const pool = allCollections ?? collections
    const featuredHandles = new Set(
      getCollectionsForSidebarKey(pool, selectedKey)
        .filter((c) => c.featured)
        .map((c) => c.handle)
    )
    if (featuredHandles.size === 0) return products
    return [...products].sort((a, b) => {
      const aInFeatured = a.collectionIds.some((h) => featuredHandles.has(h))
      const bInFeatured = b.collectionIds.some((h) => featuredHandles.has(h))
      if (aInFeatured && !bInFeatured) return -1
      if (!aInFeatured && bInFeatured) return 1
      return 0
    })
  }, [selectedKey, productTypes, collections, allCollections])

  const selectedCollections = useMemo(() => {
    if (!selectedKey) return []
    const pool = allCollections ?? collections
    return getCollectionsForSidebarKey(pool, selectedKey)
  }, [selectedKey, collections, allCollections])

  // Footer: all collections on "All" tab, category-filtered on a category tab.
  // Featured collections (cross-referenced from the featured-only `collections` prop) sort first.
  const footerCollections = useMemo(() => {
    const pool = allCollections ?? collections
    const featuredIds = new Set(collections.map((c) => c.id))
    const base = !selectedKey ? [...pool] : getCollectionsForSidebarKey(pool, selectedKey)
    return base.sort((a, b) => {
      const aFeatured = featuredIds.has(a.id) || a.featured
      const bFeatured = featuredIds.has(b.id) || b.featured
      if (aFeatured !== bFeatured) return aFeatured ? -1 : 1
      return (b.collectionPriority ?? 0) - (a.collectionPriority ?? 0)
    })
  }, [selectedKey, collections, allCollections])

  const selectedCat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)

  // When on "All" tab with a specific collection selected, look up the collection
  // so we can render the same CategoryView experience as category-specific tabs.
  const allViewActiveCollection = useMemo(() => {
    if (selectedKey !== null || activeCollectionHandle === 'all') return null
    const pool = allCollections ?? collections
    return pool.find((c) => c.handle === activeCollectionHandle) ?? null
  }, [selectedKey, activeCollectionHandle, allCollections, collections])

  const topOffset = isHeaderScrolled
    ? 'calc(112px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'
    : 'calc(128px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="products-mega-menu"
          initial={{ opacity: 0, scaleY: 0.97, y: -8 }}
          animate={{ opacity: 1, scaleY: 1, y: 0, top: topOffset }}
          exit={{ opacity: 0, scaleY: 0.97, y: -8 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: 'top center', left: '50%', x: '-50%' }}
          className={cn('fixed z-[60] w-[95vw] max-w-[1440px] bg-[#FAF9F7] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12),0_32px_80px_-8px_rgba(0,0,0,0.28)] overflow-hidden rounded-2xl', className)}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A01829]/30 to-transparent" />

          <div className="flex flex-col max-h-[75vh]">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <TopTabBar selectedKey={selectedKey} onSelect={setSelectedKey} onClose={onClose} productTypes={productTypes} />

                <CollectionFooter
                  collections={footerCollections}
                  activeHandle={activeCollectionHandle}
                  onSelect={setActiveCollectionHandle}
                  onClose={onClose}
                  categoryHref={selectedCat?.href ?? '/pianos'}
                  categoryLabel={selectedCat ? selectedCat.label : null}
                />

                <div className="min-w-0 px-14 py-10 bg-white overflow-y-auto flex-1">
                  <AnimatePresence mode="wait" initial={false}>
                    {selectedKey === null && allViewActiveCollection ? (
                      <motion.div
                        key={`all-collection-${activeCollectionHandle}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CategoryView
                          sidebarKey=""
                          collections={allCollections ?? collections}
                          allTabProducts={[]}
                          categoryHref={`/pianos/${activeCollectionHandle}`}
                          label={allViewActiveCollection.heading || allViewActiveCollection.title}
                          onClose={onClose}
                          activeCollectionHandle={activeCollectionHandle}
                        />
                      </motion.div>
                    ) : selectedKey === null ? (
                      <motion.div
                        key="carousel"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CollectionCarousel collections={collections} onClose={onClose} onCategorySelect={setSelectedKey} />
                      </motion.div>
                    ) : selectedCat && 'appsPanel' in selectedCat ? (
                      <motion.div
                        key="apps-panel"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <AppsSoftwarePanelView onClose={onClose} />
                      </motion.div>
                    ) : selectedCat && 'accessoriesPanel' in selectedCat ? (
                      <motion.div
                        key="accessories-panel"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <AccessoriesBannerView onClose={onClose} />
                      </motion.div>
                    ) : selectedCat && 'bannerOnly' in selectedCat ? (
                      <motion.div
                        key={`banner-${selectedKey}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <BannerOnlyView
                          label={selectedCat.label}
                          href={selectedCat.href}
                          {...('externalCtaUrl' in selectedCat && typeof selectedCat.externalCtaUrl === 'string' && { externalCtaUrl: selectedCat.externalCtaUrl })}
                          {...('comingSoon' in selectedCat && { comingSoon: selectedCat.comingSoon })}
                          collectionHandle={selectedCat.key}
                          collections={allCollections ?? collections}
                          onClose={onClose}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`category-${selectedKey}`}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {selectedCat && (
                          <CategoryView
                            sidebarKey={selectedKey}
                            collections={selectedCollections}
                            allTabProducts={selectedProducts}
                            categoryHref={selectedCat.href}
                            label={selectedCat.label}
                            onClose={onClose}
                            activeCollectionHandle={activeCollectionHandle}
                          />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8E4DF] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
