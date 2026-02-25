'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductTypeNav, NavProduct } from '@/lib/payload/products-navigation'

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Fixed sidebar piano families.
 * `terms` is matched against the DB category string (case-insensitive substring).
 */
const SIDEBAR_CATEGORIES = [
  { label: 'Digital',    key: 'digital',    href: '/pianos/digital',    terms: ['digital'] },
  { label: 'Hybrid',     key: 'hybrid',     href: '/pianos/hybrid',     terms: ['hybrid'] },
  { label: 'Upright',    key: 'upright',    href: '/pianos/upright',    terms: ['upright'] },
  { label: 'Grand',      key: 'grand',      href: '/pianos/grand',      terms: ['grand'] },
  { label: 'Baby Grand', key: 'baby-grand', href: '/pianos/baby-grand', terms: ['baby grand', 'gl series', 'baby-grand'] },
] as const

type SidebarKey = (typeof SIDEBAR_CATEGORIES)[number]['key']

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsMegaMenuProps {
  productTypes: ProductTypeNav[]
  isOpen: boolean
  onClose: () => void
  className?: string
  isLoading?: boolean
  isHeaderScrolled?: boolean
}

interface CollectionCard {
  label: string
  key: string
  href: string
  /** Product count from DB matching this category */
  count: number
  /** First YouTube URL found among featured products in this category */
  youtubeUrl: string | null
  /** Fallback product image */
  image: NavProduct['image']
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

function getProductsForSidebarKey(productTypes: ProductTypeNav[], terms: readonly string[]): NavProduct[] {
  return productTypes
    .filter((t) => terms.some((term) => t.type.toLowerCase().includes(term.toLowerCase())))
    .flatMap((t) => t.products)
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-12 min-h-[320px] gap-0">
      {/* Sidebar skeleton */}
      <div className="col-span-3 border-r border-[#E8E4DF] py-6 pr-6 space-y-2">
        <div className="h-3 w-32 bg-[#EDE9E3] rounded animate-pulse mb-5" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-[#F2EFE9] rounded-lg animate-pulse" />
        ))}
      </div>
      {/* Carousel skeleton */}
      <div className="col-span-9 pl-7 py-6">
        <div className="h-5 w-40 bg-[#EDE9E3] rounded animate-pulse mb-5" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-[#EDE9E3] rounded-xl animate-pulse" />
              <div className="h-3 w-20 bg-[#EDE9E3] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[#EDE9E3] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Collection Carousel Card ─────────────────────────────────────────────────

function CollectionCarouselCard({
  card,
  onClose,
  onCategorySelect,
}: {
  card: CollectionCard
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  const thumbnail = card.youtubeUrl ? getYouTubeThumbnail(card.youtubeUrl) : null
  const hasMedia = thumbnail || card.image

  return (
    <button
      onClick={() => {
        onCategorySelect(card.key as SidebarKey)
      }}
      className="group relative w-full text-left block"
      aria-label={`Browse ${card.label} collection`}
    >
      {/* Media container — 16:9 for YouTube, 4:3 for images */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-[#EAE6E0]',
          card.youtubeUrl ? 'aspect-video' : 'aspect-[4/3]'
        )}
      >
        {thumbnail ? (
          <>
            <Image
              src={thumbnail}
              alt={`${card.label} collection`}
              fill
              sizes="(max-width: 1280px) 33vw, 380px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F7]/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Play className="h-5 w-5 text-[#A01829] ml-0.5" fill="#A01829" />
              </div>
            </div>
          </>
        ) : card.image ? (
          <Image
            src={card.image.url}
            alt={card.image.alt || card.label}
            fill
            sizes="(max-width: 1280px) 33vw, 380px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] tracking-widest uppercase text-gray-300">
              {card.label}
            </span>
          </div>
        )}

        {/* Bottom gradient overlay */}
        {hasMedia && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none rounded-xl" />
        )}

        {/* Text overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/75 mb-0.5">
            {card.count > 0 ? `${card.count} Instruments` : 'Collection'}
          </p>
          <h3 className="text-base font-bold text-white font-serif leading-tight">
            {card.label} Pianos
          </h3>
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
      </div>

      {/* Explore CTA below card */}
      <div className="mt-2.5 flex items-center justify-between px-0.5">
        <span className="text-xs font-medium text-gray-500 group-hover:text-[#A01829] transition-colors duration-150">
          Explore Collection
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#A01829] group-hover:translate-x-0.5 transition-all duration-150" />
      </div>
    </button>
  )
}

// ─── Collection Carousel ──────────────────────────────────────────────────────

const CARDS_PER_VIEW = 3

function CollectionCarousel({
  cards,
  onClose,
  onCategorySelect,
}: {
  cards: CollectionCard[]
  onClose: () => void
  onCategorySelect: (key: SidebarKey) => void
}) {
  const [idx, setIdx] = useState(0)
  const maxIdx = Math.max(0, Math.ceil(cards.length / CARDS_PER_VIEW) - 1)

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx((i) => Math.min(maxIdx, i + 1)), [maxIdx])

  const visible = cards.slice(idx * CARDS_PER_VIEW, (idx + 1) * CARDS_PER_VIEW)
  const hasPrev = idx > 0
  const hasNext = idx < maxIdx

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A01829] mb-1">
            Kawai Collection
          </p>
          <h2 className="text-xl font-bold text-[#2C2C2C] font-serif leading-none">
            Piano Collections
          </h2>
        </div>
        <Link
          href="/pianos"
          onClick={onClose}
          className="group flex items-center gap-1.5 text-sm font-medium text-[#A01829]"
        >
          Explore All
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
          >
            {visible.map((card) => (
              <CollectionCarouselCard
                key={card.key}
                card={card}
                onClose={onClose}
                onCategorySelect={onCategorySelect}
              />
            ))}
            {/* Fill empty slots */}
            {Array.from({ length: Math.max(0, CARDS_PER_VIEW - visible.length) }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <AnimatePresence>
          {hasPrev && (
            <motion.button
              key="prev"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={prev}
              aria-label="Previous"
              className="absolute -left-5 top-[38%] -translate-y-1/2 w-9 h-9 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-gray-500 hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10"
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
              className="absolute -right-5 top-[38%] -translate-y-1/2 w-9 h-9 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-gray-500 hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Dots — only if more than one slide */}
      {maxIdx > 0 && (
        <div className="flex items-center gap-2 mt-4">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}>
              <motion.div
                animate={{ width: i === idx ? 20 : 8, backgroundColor: i === idx ? '#A01829' : '#C8C2BA' }}
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
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#F0EDE8] mb-3">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 1280px) 25vw, 220px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-gray-300">No image</span>
          </div>
        )}

        {product.isFeatured && (
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-block px-2 py-0.5 bg-[#A01829] text-[10px] font-bold tracking-[0.1em] uppercase text-white rounded-full">
              Featured
            </span>
          </div>
        )}

        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#A01829] transition-all duration-200 pointer-events-none" />
      </div>

      <div className="space-y-0.5 px-0.5">
        <h3 className="text-sm font-semibold text-[#2C2C2C] group-hover:text-[#A01829] transition-colors duration-150 leading-snug line-clamp-2 font-serif">
          {product.model ?? product.title}
        </h3>
        <p className="text-sm text-gray-500 font-medium tabular-nums">{product.price.display}</p>
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
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <p className="text-sm text-gray-400 mb-3">No products found in this category.</p>
        <Link
          href="/pianos"
          onClick={onClose}
          className="text-sm font-medium text-[#A01829] hover:underline"
        >
          Browse all pianos →
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A01829] mb-1">
            Collection
          </p>
          <h2 className="text-xl font-bold text-[#2C2C2C] font-serif leading-none">{label} Pianos</h2>
        </div>
        <Link
          href={href}
          onClick={onClose}
          className="group flex items-center gap-1.5 text-sm font-medium text-[#A01829]"
        >
          View All {label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Grid — max 3 columns, first row visible */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={sidebarKey}
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
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
  productTypes,
  selectedKey,
  onSelect,
  onClose,
}: {
  productTypes: ProductTypeNav[]
  selectedKey: SidebarKey | null
  onSelect: (key: SidebarKey | null) => void
  onClose: () => void
}) {
  return (
    <div className="col-span-3 border-r border-[#E8E4DF] py-6 pr-6 flex flex-col">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
        Piano Families
      </p>

      <nav className="flex-1 space-y-0.5">
        {SIDEBAR_CATEGORIES.map((cat) => {
          const products = getProductsForSidebarKey(productTypes, cat.terms)
          const count = products.length
          const isSelected = selectedKey === cat.key

          return (
            <button
              key={cat.key}
              onClick={() => onSelect(isSelected ? null : (cat.key as SidebarKey))}
              className={cn(
                'w-full text-left px-3.5 py-2.5 rounded-lg transition-all duration-150',
                'flex items-center justify-between group',
                isSelected
                  ? 'bg-[#A01829] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-[#F2EFE9] hover:text-[#2C2C2C]'
              )}
            >
              <div>
                <div className="text-sm font-semibold leading-tight">{cat.label}</div>
                {count > 0 && (
                  <div
                    className={cn(
                      'text-[11px] mt-0.5 tabular-nums',
                      isSelected ? 'text-white/65' : 'text-gray-400'
                    )}
                  >
                    {count} {count === 1 ? 'instrument' : 'instruments'}
                  </div>
                )}
              </div>

              {isSelected ? (
                /* selected: show a small checkmark or just arrow */
                <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-5 pt-4 border-t border-[#E8E4DF]">
        <Link
          href="/pianos"
          onClick={onClose}
          className="group flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#A01829] transition-colors duration-150"
        >
          View All Pianos
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

// We need ChevronRight locally since we use it in Sidebar
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
  isOpen,
  onClose,
  className,
  isLoading = false,
  isHeaderScrolled = false,
}: ProductsMegaMenuProps) {
  const [selectedKey, setSelectedKey] = useState<SidebarKey | null>(null)

  // Reset to carousel view every time the menu opens
  useEffect(() => {
    if (isOpen) setSelectedKey(null)
  }, [isOpen])

  // Build collection cards for the carousel (one per sidebar category)
  const collectionCards: CollectionCard[] = useMemo(() => {
    return SIDEBAR_CATEGORIES.map((cat) => {
      const allProducts = getProductsForSidebarKey(productTypes, cat.terms)
      const featured = allProducts.filter((p) => p.isFeatured)
      const pool = featured.length > 0 ? featured : allProducts

      // Prefer YouTube URL from the pool, then any product image
      const youtubeUrl = pool.find((p) => p.youtubeUrl)?.youtubeUrl ?? null
      const image = pool.find((p) => p.image)?.image ?? null

      return {
        label: cat.label,
        key: cat.key,
        href: cat.href,
        count: allProducts.length,
        youtubeUrl,
        image,
      }
    })
    // Show all categories (even empty ones), so the sidebar labels always match the carousel
  }, [productTypes])

  // Products for the currently-selected sidebar key
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="products-mega-menu"
          initial={{ opacity: 0, scaleY: 0.96, y: -6 }}
          animate={{
            opacity: 1,
            scaleY: 1,
            y: 0,
            top: isHeaderScrolled
              ? 'calc(112px + var(--announcement-bar-height, 0px))'
              : 'calc(128px + var(--announcement-bar-height, 0px))',
          }}
          exit={{ opacity: 0, scaleY: 0.96, y: -6 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: 'top center' }}
          className={cn(
            'fixed left-0 right-0 z-[60]',
            'bg-[#FAF9F7] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.11)]',
            'overflow-hidden',
            className
          )}
        >
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A01829]/25 to-transparent" />

          <div className="container mx-auto px-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-12 min-h-[320px] gap-0">
                {/* ── Always-visible sidebar ── */}
                <Sidebar
                  productTypes={productTypes}
                  selectedKey={selectedKey}
                  onSelect={handleSidebarSelect}
                  onClose={onClose}
                />

                {/* ── Main content area ── */}
                <div className="col-span-9 pl-8 py-6">
                  <AnimatePresence mode="wait" initial={false}>
                    {selectedKey === null ? (
                      /* VIEW 1: Collection carousel */
                      <motion.div
                        key="carousel"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <CollectionCarousel
                          cards={collectionCards}
                          onClose={onClose}
                          onCategorySelect={(key) => setSelectedKey(key)}
                        />
                      </motion.div>
                    ) : (
                      /* VIEW 2: Product grid for selected category */
                      <motion.div
                        key={`grid-${selectedKey}`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
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
              </div>
            )}
          </div>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E8E4DF] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
