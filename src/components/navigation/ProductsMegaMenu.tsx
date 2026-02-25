'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductTypeNav, NavProduct, NavCollection } from '@/lib/payload/products-navigation'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_CATEGORIES = [
  { label: 'Digital',  key: 'digital',  href: '/pianos/digital',  terms: ['digital'] },
  { label: 'Hybrid',   key: 'hybrid',   href: '/pianos/hybrid',   terms: ['hybrid'] },
  { label: 'Upright',  key: 'upright',  href: '/pianos/upright',  terms: ['upright'] },
  { label: 'Grand',    key: 'grand',    href: '/pianos/grand',    terms: ['grand', 'baby grand', 'baby-grand', 'gl series'] },
] as const

type SidebarKey = (typeof SIDEBAR_CATEGORIES)[number]['key']

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsMegaMenuProps {
  productTypes: ProductTypeNav[]
  collections: NavCollection[]
  isOpen: boolean
  onClose: () => void
  className?: string
  isLoading?: boolean
  isHeaderScrolled?: boolean
}

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? null
}

function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function getProductsForSidebarKey(
  productTypes: ProductTypeNav[],
  terms: readonly string[]
): NavProduct[] {
  return productTypes
    .filter((t) => terms.some((term) => t.type.toLowerCase().includes(term.toLowerCase())))
    .flatMap((t) => t.products)
}

function getSidebarKeyForCollection(collection: NavCollection): SidebarKey | null {
  const titleLower = collection.title.toLowerCase()
  const handleLower = collection.handle.toLowerCase()
  for (const cat of SIDEBAR_CATEGORIES) {
    if (cat.terms.some((term) =>
      titleLower.includes(term.toLowerCase()) || handleLower.includes(term.toLowerCase())
    )) {
      return cat.key
    }
  }
  return null
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
}: {
  collection: NavCollection
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  const thumbnail = collection.youtubeUrl ? getYouTubeThumbnail(collection.youtubeUrl) : null
  const imageUrl = thumbnail ?? collection.imageUrl ?? collection.mediaUrl ?? null
  const hasMedia = Boolean(imageUrl)
  const displayTitle = collection.heading || collection.title
  const sidebarKey = getSidebarKeyForCollection(collection)

  const handleClick = useCallback(() => {
    if (sidebarKey) {
      onCategorySelect(sidebarKey)
    } else {
      onClose()
    }
  }, [sidebarKey, onCategorySelect, onClose])

  return (
    <button
      onClick={handleClick}
      className="group relative w-full text-left block"
      aria-label={`Browse ${displayTitle} collection`}
    >
      {/* Media — natural aspect ratio, no flex trickery needed */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl bg-[#EAE6E0]',
          thumbnail ? 'aspect-video' : 'aspect-[4/3]'
        )}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={displayTitle}
              fill
              sizes="(max-width: 1280px) 33vw, 500px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            {thumbnail && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F7]/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                  <Play className="h-7 w-7 text-[#A01829] ml-0.5" fill="#A01829" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-[#B8AFA6]">
              {displayTitle}
            </span>
          </div>
        )}

        {hasMedia && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none rounded-2xl" />
        )}

        {/* Text overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/55 mb-1.5">
            {collection.productCount > 0 ? `${collection.productCount} Models` : 'Collection'}
          </p>
          <h3 className="text-lg font-bold text-white font-serif leading-tight">
            {displayTitle}
          </h3>
          {collection.subheading && (
            <p className="text-sm text-white/60 mt-1 line-clamp-1">{collection.subheading}</p>
          )}
        </div>

        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
      </div>

      {/* CTA below card */}
      <div className="mt-3.5 flex items-center justify-between px-0.5">
        <span className="text-sm font-medium text-[#8A8078] group-hover:text-[#A01829] transition-colors duration-150">
          Explore Collection
        </span>
        <ArrowRight className="h-4 w-4 text-[#B8AFA6] group-hover:text-[#A01829] group-hover:translate-x-0.5 transition-all duration-150" />
      </div>
    </button>
  )
}

// ─── Collection Carousel ──────────────────────────────────────────────────────

const CARDS_PER_VIEW = 3

function CollectionCarousel({
  collections,
  onClose,
  onCategorySelect,
}: {
  collections: NavCollection[]
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  const [idx, setIdx] = useState(0)
  const maxIdx = Math.max(0, Math.ceil(collections.length / CARDS_PER_VIEW) - 1)
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx((i) => Math.min(maxIdx, i + 1)), [maxIdx])
  const visible = collections.slice(idx * CARDS_PER_VIEW, (idx + 1) * CARDS_PER_VIEW)
  const hasPrev = idx > 0
  const hasNext = idx < maxIdx

  if (collections.length === 0) {
    return (
      <div>
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#A01829] mb-2">
              Kawai Piano
            </p>
            <h2 className="text-2xl font-bold text-[#2C2C2C] font-serif leading-none">
              Featured Collections
            </h2>
          </div>
          <Link href="/pianos" onClick={onClose} className="group flex items-center gap-2 text-sm font-medium text-[#A01829]">
            Explore All
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[#B8AFA6]">Select a piano family to explore.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#A01829] mb-2">
            Kawai Piano
          </p>
          <h2 className="text-2xl font-bold text-[#2C2C2C] font-serif leading-none">
            Featured Collections
          </h2>
        </div>
        <Link
          href="/pianos"
          onClick={onClose}
          className="group flex items-center gap-2 text-sm font-medium text-[#A01829]"
        >
          Explore All
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Cards — natural aspect ratio drives the overall dropdown height */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            className="grid grid-cols-3 gap-7"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
          >
            {visible.map((collection) => (
              <CollectionCarouselCard
                key={collection.id}
                collection={collection}
                onClose={onClose}
                onCategorySelect={onCategorySelect}
              />
            ))}
            {Array.from({ length: Math.max(0, CARDS_PER_VIEW - visible.length) }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        <AnimatePresence>
          {hasPrev && (
            <motion.button
              key="prev"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={prev}
              aria-label="Previous"
              className="absolute -left-6 top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10"
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
              aria-label="Next"
              className="absolute -right-6 top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Dots */}
      {maxIdx > 0 && (
        <div className="flex items-center gap-2 mt-5">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}>
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
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onClose }: { product: NavProduct; onClose: () => void }) {
  return (
    <Link href={`/products/${product.handle}`} onClick={onClose} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F0EDE8] mb-4">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 1280px) 22vw, 280px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#C8C2BA]">No image</span>
          </div>
        )}

        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 bg-[#A01829] text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded-full">
              Featured
            </span>
          </div>
        )}

        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
      </div>

      <div className="space-y-1 px-0.5">
        <h3 className="text-sm font-semibold text-[#2C2C2C] group-hover:text-[#A01829] transition-colors duration-150 leading-snug line-clamp-2 font-serif">
          {product.model ?? product.title}
        </h3>
        <p className="text-sm text-[#8A8078] font-medium tabular-nums">{product.price.display}</p>
      </div>
    </Link>
  )
}

// ─── Category Product Grid ────────────────────────────────────────────────────

function CategoryProductGrid({
  sidebarKey,
  products,
  href,
  label,
  onClose,
}: {
  sidebarKey: string
  products: NavProduct[]
  href: string
  label: string
  onClose: () => void
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-[#B8AFA6] mb-4">No products found in this category.</p>
        <Link href="/pianos" onClick={onClose} className="text-sm font-medium text-[#A01829] hover:underline">
          Browse all pianos →
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#A01829] mb-2">
            Collection
          </p>
          <h2 className="text-2xl font-bold text-[#2C2C2C] font-serif leading-none">
            {label} Pianos
          </h2>
        </div>
        <Link
          href={href}
          onClick={onClose}
          className="group flex items-center gap-2 text-sm font-medium text-[#A01829]"
        >
          View All {label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={sidebarKey}
          className="grid grid-cols-3 gap-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} onClose={onClose} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  selectedKey,
  onSelect,
  onClose,
}: {
  selectedKey: SidebarKey | null
  onSelect: (key: SidebarKey | null) => void
  onClose: () => void
}) {
  return (
    <div className="w-80 flex-shrink-0 border-r border-[#E8E4DF] py-10 px-8 flex flex-col self-stretch">
      <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#B8AFA6] mb-6">
        Piano Families
      </p>

      <nav className="flex-1 space-y-2">
        {SIDEBAR_CATEGORIES.map((cat) => {
          const isSelected = selectedKey === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(isSelected ? null : (cat.key as SidebarKey))}
              className={cn(
                'w-full text-left px-5 py-[18px] rounded-xl transition-all duration-150',
                'flex items-center justify-between group',
                isSelected
                  ? 'bg-[#A01829] text-white shadow-sm'
                  : 'text-[#2C2C2C] hover:bg-[#F2EFE9]'
              )}
            >
              <span className="text-xl font-semibold leading-none tracking-tight">{cat.label}</span>
              {isSelected ? (
                <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-5 w-5 text-[#C8C2BA] group-hover:text-[#8A8078] transition-colors flex-shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-[#E8E4DF]">
        <Link
          href="/pianos"
          onClick={onClose}
          className="group flex items-center gap-2 text-sm font-medium text-[#8A8078] hover:text-[#A01829] transition-colors duration-150"
        >
          View All Pianos
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductsMegaMenu({
  productTypes,
  collections,
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

  // Only show collections that have been explicitly marked featured in the CMS.
  // No product-derived fallback — the Collections collection is the authoritative source.

  const selectedProducts = useMemo(() => {
    if (!selectedKey) return []
    const cat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)
    if (!cat) return []
    return getProductsForSidebarKey(productTypes, cat.terms)
  }, [selectedKey, productTypes])

  const selectedCat = SIDEBAR_CATEGORIES.find((c) => c.key === selectedKey)

  const handleSidebarSelect = useCallback((key: SidebarKey | null) => {
    setSelectedKey(key)
  }, [])

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
          className={cn(
            'fixed left-0 right-0 z-[60]',
            'bg-[#FAF9F7] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.14)]',
            'overflow-hidden',
            className
          )}
        >
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A01829]/30 to-transparent" />

          {/* Content — height is driven naturally by the cards' aspect ratios */}
          <div className="flex">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <Sidebar
                  selectedKey={selectedKey}
                  onSelect={handleSidebarSelect}
                  onClose={onClose}
                />

                <div className="flex-1 min-w-0 px-12 py-10">
                  <AnimatePresence mode="wait" initial={false}>
                    {selectedKey === null ? (
                      <motion.div
                        key="carousel"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CollectionCarousel
                          collections={collections}
                          onClose={onClose}
                          onCategorySelect={(key) => setSelectedKey(key)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`grid-${selectedKey}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        {selectedCat && (
                          <CategoryProductGrid
                            sidebarKey={selectedKey}
                            products={selectedProducts}
                            href={selectedCat.href}
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

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8E4DF] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
