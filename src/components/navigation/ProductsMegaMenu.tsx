'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
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
    externalCtaUrl: 'https://shigerukawai.com?utm_source=kawaiusa&utm_medium=navigation&utm_campaign=mega-menu&utm_content=shigeru-kawai',
  },
] as const

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
    <div className="flex">
      <div className="w-80 flex-shrink-0 border-r border-[#E8E4DF] py-10 px-8 space-y-3">
        <div className="h-3 w-28 bg-[#EDE9E3] rounded animate-pulse mb-8" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[68px] bg-[#F2EFE9] rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="flex-1 px-12 py-10">
        <div className="h-9 w-56 bg-[#EDE9E3] rounded animate-pulse mb-8" />
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
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const hasMedia = Boolean(imageUrl || videoId)
  const displayTitle = collection.heading || collection.title
  const sidebarKey = getSidebarKeyForCollection(collection)
  const collectionHref = `/pianos/${collection.handle}`

  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    if (!videoId) return
    const t = setTimeout(() => setIsPlaying(true), index * 600)
    return () => clearTimeout(t)
  }, [videoId, index])

  const handleCardClick = useCallback(() => {
    if (sidebarKey) onCategorySelect(sidebarKey)
    else onClose()
  }, [sidebarKey, onCategorySelect, onClose])

  return (
    <div className="group relative w-full">
      <button onClick={handleCardClick} className="relative w-full text-left block" aria-label={`Browse ${displayTitle}`}>
        <div className={cn('relative w-full overflow-hidden rounded-2xl bg-[#EAE6E0]', videoId ? 'aspect-video' : 'aspect-[4/3]')}>
          {imageUrl && (
            <motion.div animate={{ opacity: isPlaying && videoId ? 0 : 1 }} transition={{ duration: 0.6 }} className="absolute inset-0">
              <Image src={imageUrl} alt={displayTitle} fill sizes="(max-width: 1280px) 33vw, 500px" className="object-cover" />
            </motion.div>
          )}
          {videoId && isPlaying && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="absolute inset-0">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
                allow="autoplay; encrypted-media"
                className="absolute inset-0 w-full h-full pointer-events-none scale-[1.05]"
                style={{ border: 'none' }}
                title={displayTitle}
              />
            </motion.div>
          )}
          {!hasMedia && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-widest uppercase text-[#B8AFA6]">{displayTitle}</span>
            </div>
          )}
          {hasMedia && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none rounded-2xl" />}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/55 mb-1.5">
              {collection.productCount > 0 ? `${collection.productCount} Models` : 'Collection'}
            </p>
            <h3 className="text-lg font-bold text-white font-serif leading-tight">{displayTitle}</h3>
            {collection.subheading && <p className="text-sm text-white/60 mt-1 line-clamp-1">{collection.subheading}</p>}
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
        </div>
      </button>

      <Link href={collectionHref} onClick={onClose} className="mt-3.5 flex items-center justify-between px-0.5 group/cta" aria-label={`View all ${displayTitle} models`}>
        <span className="text-sm font-medium text-[#8A8078] group-hover/cta:text-[#A01829] transition-colors duration-150">Explore Collection</span>
        <ArrowRight className="h-4 w-4 text-[#B8AFA6] group-hover/cta:text-[#A01829] group-hover/cta:translate-x-0.5 transition-all duration-150" />
      </Link>
    </div>
  )
}

// ─── Collection Carousel (default view) ───────────────────────────────────────

const CARDS_PER_VIEW = 3

function CollectionCarousel({ collections, onClose, onCategorySelect }: {
  collections: NavCollection[]
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  const [idx, setIdx] = useState(0)
  const maxIdx = Math.max(0, Math.ceil(collections.length / CARDS_PER_VIEW) - 1)
  const visible = collections.slice(idx * CARDS_PER_VIEW, (idx + 1) * CARDS_PER_VIEW)

  return (
    <div>
      <div className="flex items-end justify-between mb-7">
        <h2 className="text-2xl font-bold text-[#2C2C2C] font-serif leading-none">Featured Collections</h2>
        <Link href="/pianos" onClick={onClose} className="group flex items-center gap-2 text-sm font-medium text-[#A01829]">
          Explore All
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#B8AFA6]">Select a piano family to explore.</p>
        </div>
      ) : (
        <>
          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={idx}
                className="grid grid-cols-3 gap-7"
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              >
                {visible.map((col, i) => (
                  <CollectionCarouselCard key={col.id} collection={col} onClose={onClose} onCategorySelect={onCategorySelect} index={i} />
                ))}
                {Array.from({ length: Math.max(0, CARDS_PER_VIEW - visible.length) }).map((_, i) => <div key={i} />)}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence>
              {idx > 0 && <NavArrow dir="left" onClick={() => setIdx((i) => i - 1)} offset="-left-6" />}
              {idx < maxIdx && <NavArrow dir="right" onClick={() => setIdx((i) => i + 1)} offset="-left-6" />}
            </AnimatePresence>
          </div>

          {maxIdx > 0 && (
            <div className="flex items-center gap-2 mt-5">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}>
                  <motion.div
                    animate={{ width: i === idx ? 28 : 8, backgroundColor: i === idx ? '#A01829' : '#C8C2BA' }}
                    transition={{ duration: 0.22 }}
                    className="h-1.5 rounded-full"
                  />
                </button>
              ))}
            </div>
          )}
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
          <Image src={product.image.url} alt={product.image.alt} fill sizes="(max-width: 1280px) 22vw, 280px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#C8C2BA]">No image</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-[#2C2C2C] leading-snug line-clamp-2 font-serif px-0.5">
        {product.model ?? product.title}
      </h3>
    </Link>
  )
}

// ─── Collection Video Banner ───────────────────────────────────────────────────
// Cinematic strip shown at the bottom of CategoryView when a collection tab is active.

function CollectionVideoBanner({ collection, onClose, heightClass = 'h-36', externalCtaUrl }: { collection: NavCollection; onClose: () => void; heightClass?: string; externalCtaUrl?: string }) {
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const displayTitle = collection.heading || collection.title
  const collectionHref = externalCtaUrl ?? `/pianos/${collection.handle}`
  const isExternal = Boolean(externalCtaUrl)

  const [isPlaying, setIsPlaying] = useState(false)
  useEffect(() => {
    if (!videoId) return
    setIsPlaying(false)
    const t = setTimeout(() => setIsPlaying(true), 400)
    return () => clearTimeout(t)
  }, [videoId, collection.handle])

  return (
    <motion.div
      key={collection.handle}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={cn('mt-5 relative rounded-2xl overflow-hidden bg-[#111]', heightClass)}
    >
      {imageUrl && (
        <motion.div animate={{ opacity: isPlaying && videoId ? 0 : 1 }} transition={{ duration: 0.6 }} className="absolute inset-0">
          <Image src={imageUrl} alt={displayTitle} fill sizes="100vw" className="object-cover" />
        </motion.div>
      )}
      {videoId && isPlaying && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media"
            className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ border: 'none', aspectRatio: '16/9' }}
            title={displayTitle}
          />
        </motion.div>
      )}
      {!imageUrl && !videoId && <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A]" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-between px-8">
        <div className="text-white min-w-0 mr-6">
          {collection.productCount > 0 && (
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50 mb-1">{collection.productCount} Models</p>
          )}
          <h3 className="text-xl font-bold font-serif leading-tight truncate">{displayTitle}</h3>
          {collection.subheading && <p className="text-sm text-white/60 mt-0.5 line-clamp-1">{collection.subheading}</p>}
        </div>
        {isExternal ? (
          <a
            href={collectionHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/10 hover:bg-[#A01829] border border-white/25 hover:border-[#A01829] rounded-full text-sm font-medium text-white transition-all duration-200 flex-shrink-0"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        ) : (
          <Link
            href={collectionHref}
            onClick={onClose}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-white/10 hover:bg-[#A01829] border border-white/25 hover:border-[#A01829] rounded-full text-sm font-medium text-white transition-all duration-200 flex-shrink-0"
          >
            View Collection
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

// ─── Category View ─────────────────────────────────────────────────────────────
// Shown when a sidebar category is selected.
// Pill tabs: "All" (featured products) + one per tagged collection (fetched on demand).
// Bottom: video banner for the active collection.

function CategoryView({ sidebarKey, collections, allTabProducts, categoryHref, label, onClose }: {
  sidebarKey: string
  collections: NavCollection[]
  allTabProducts: NavProduct[]
  categoryHref: string
  label: string
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState('all')
  const [fetchedProducts, setFetchedProducts] = useState<NavProduct[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    setActiveTab('all')
    setFetchedProducts([])
  }, [sidebarKey])

  useEffect(() => {
    if (activeTab === 'all') { setFetchedProducts([]); return }
    let cancelled = false
    setIsLoadingProducts(true)
    getProductsByCollection(activeTab)
      .then((products) => { if (!cancelled) setFetchedProducts(products) })
      .catch(() => { if (!cancelled) setFetchedProducts([]) })
      .finally(() => { if (!cancelled) setIsLoadingProducts(false) })
    return () => { cancelled = true }
  }, [activeTab])

  const displayProducts = activeTab === 'all' ? allTabProducts : fetchedProducts
  const activeCollection = collections.find((c) => c.handle === activeTab)

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
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#2C2C2C] font-serif leading-none">{label} Pianos</h2>
        <Link href={categoryHref} onClick={onClose} className="group flex items-center gap-2 text-sm font-medium text-[#A01829]">
          Browse All {label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Collection pill tabs */}
      {collections.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', ...collections.map((c) => c.handle)].map((tab) => {
            const col = collections.find((c) => c.handle === tab)
            const tabLabel = tab === 'all' ? 'All' : (col?.heading || col?.title || tab)
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap',
                  activeTab === tab ? 'bg-[#A01829] text-white' : 'bg-[#F2EFE9] text-[#8A8078] hover:bg-[#EDE9E3] hover:text-[#2C2C2C]'
                )}
              >
                {tabLabel}
              </button>
            )
          })}
        </div>
      )}

      {/* Product scroll */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
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

      {/* Collection video banner */}
      <AnimatePresence>
        {activeTab !== 'all' && activeCollection && !isLoadingProducts && (
          <CollectionVideoBanner collection={activeCollection} onClose={onClose} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Banner-Only View ─────────────────────────────────────────────────────────
// Shown for categories like Shigeru Kawai that render only a collection banner.

function BannerOnlyView({ label, href, externalCtaUrl, collectionHandle, collections, onClose }: {
  label: string
  href: string
  externalCtaUrl?: string
  collectionHandle: string
  collections: NavCollection[]
  onClose: () => void
}) {
  const collection = collections.find((c) => c.handle === collectionHandle)
  const heightClass = collection?.bannerSize ? (BANNER_SIZE_HEIGHT[collection.bannerSize] ?? 'h-[250px]') : 'h-[250px]'
  const ctaHref = externalCtaUrl ?? href
  const isExternal = Boolean(externalCtaUrl)

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#2C2C2C] font-serif leading-none">{label}</h2>
        {isExternal ? (
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
      {collection ? (
        <CollectionVideoBanner collection={collection} onClose={onClose} heightClass={heightClass} {...(externalCtaUrl !== undefined && { externalCtaUrl })} />
      ) : (
        <div className="flex items-center justify-center py-16">
          <Link href={href} onClick={onClose} className="text-sm font-medium text-[#A01829] hover:underline">
            Explore {label} →
          </Link>
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ selectedKey, onSelect, onClose, productTypes }: {
  selectedKey: SidebarKey | null
  onSelect: (key: SidebarKey | null) => void
  onClose: () => void
  productTypes: ProductTypeNav[]
}) {
  const availableCategories = SIDEBAR_CATEGORIES.filter(
    (cat) => 'bannerOnly' in cat || getProductsForSidebarKey(productTypes, cat.terms).length > 0
  )

  return (
    <div className="w-80 flex-shrink-0 border-r border-[#E8E4DF] py-10 px-8 flex flex-col self-stretch">
      <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#B8AFA6] mb-6">Piano Families</p>

      <nav className="flex-1 space-y-2">
        {availableCategories.map((cat) => {
          const isSelected = selectedKey === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(isSelected ? null : (cat.key as SidebarKey))}
              className={cn(
                'w-full text-left px-5 py-[18px] rounded-xl transition-all duration-150',
                'flex items-center justify-between group',
                isSelected ? 'bg-[#A01829] text-white shadow-sm' : 'text-[#2C2C2C] hover:bg-[#F2EFE9]'
              )}
            >
              <span className="text-xl font-semibold leading-none tracking-tight">{cat.label}</span>
              {isSelected
                ? <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
                : <ChevronRight className="h-5 w-5 text-[#C8C2BA] group-hover:text-[#8A8078] transition-colors flex-shrink-0" />}
            </button>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-[#E8E4DF]">
        <Link href="/pianos" onClick={onClose} className="group flex items-center gap-2 text-sm font-medium text-[#8A8078] hover:text-[#A01829] transition-colors duration-150">
          View All Pianos
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
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
  const [selectedKey, setSelectedKey] = useState<SidebarKey | null>(null)

  useEffect(() => {
    if (isOpen) setSelectedKey(null)
  }, [isOpen])

  const selectedProducts = useMemo(() => {
    if (!selectedKey) return []
    const cat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)
    return cat ? getProductsForSidebarKey(productTypes, cat.terms) : []
  }, [selectedKey, productTypes])

  const selectedCollections = useMemo(() => {
    if (!selectedKey) return []
    const pool = allCollections ?? collections
    return getCollectionsForSidebarKey(pool, selectedKey)
  }, [selectedKey, collections, allCollections])

  const selectedCat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)

  const topOffset = isHeaderScrolled
    ? 'calc(112px + var(--announcement-bar-height, 0px))'
    : 'calc(128px + var(--announcement-bar-height, 0px))'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="products-mega-menu"
          initial={{ opacity: 0, scaleY: 0.97, y: -8 }}
          animate={{ opacity: 1, scaleY: 1, y: 0, top: topOffset }}
          exit={{ opacity: 0, scaleY: 0.97, y: -8 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: 'top center' }}
          className={cn('fixed left-0 right-0 z-[60] bg-[#FAF9F7] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.14)] overflow-hidden', className)}
        >
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A01829]/30 to-transparent" />

          <div className="flex">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <Sidebar selectedKey={selectedKey} onSelect={setSelectedKey} onClose={onClose} productTypes={productTypes} />

                <div className="flex-1 min-w-0 px-12 py-10 bg-white">
                  <AnimatePresence mode="wait" initial={false}>
                    {selectedKey === null ? (
                      <motion.div
                        key="carousel"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CollectionCarousel collections={collections} onClose={onClose} onCategorySelect={setSelectedKey} />
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
                          {...('externalCtaUrl' in selectedCat && { externalCtaUrl: selectedCat.externalCtaUrl })}
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
