'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Search, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CatalogProduct {
  id: string
  model: string
  name?: string | null
  slug: string
  type?: string | null
  category?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null; currency?: string | null } | null
  salePrice?: number | null
  shopifyCollections?: Array<{ title: string; handle: string }> | null
}

interface Props {
  products: CatalogProduct[]
}

const CATEGORIES = ['All', 'Grand', 'Digital', 'Upright', 'Hybrid'] as const
type Category = (typeof CATEGORIES)[number]

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const

function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPrice(price?: CatalogProduct['price']): string {
  if (!price?.msrp) return 'Contact for Price'
  return formatCurrency(price.msrp, price.currency ?? 'USD')
}

function normalizeCategory(product: CatalogProduct): string {
  const raw = (product.type ?? product.category ?? '').toLowerCase()
  if (raw.includes('grand') || raw.includes('shigeru')) return 'Grand'
  if (raw.includes('digital')) return 'Digital'
  if (raw.includes('upright')) return 'Upright'
  if (raw.includes('hybrid') || raw.includes('anytime') || raw.includes('novus')) return 'Hybrid'
  return 'Other'
}

/** Derive unique collection titles across all products, sorted alphabetically */
function deriveCollections(products: CatalogProduct[]): string[] {
  const set = new Set<string>()
  for (const p of products) {
    for (const c of p.shopifyCollections ?? []) {
      if (c.title) set.add(c.title)
    }
  }
  return Array.from(set).sort()
}

/* ── Animation variants ────────────────────────────────────────── */

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(index * 0.04, 0.5),
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

/* ── Main Component ────────────────────────────────────────────── */

export function PianosBrowser({ products }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [activeCollection, setActiveCollection] = useState<string>('All')
  const [sort, setSort] = useState<string>('default')

  const collections = useMemo(() => deriveCollections(products), [products])

  const filtered = useMemo(() => {
    let items = [...products]

    // Category filter
    if (activeCategory !== 'All') {
      items = items.filter((p) => normalizeCategory(p) === activeCategory)
    }

    // Collection filter
    if (activeCollection !== 'All') {
      items = items.filter((p) =>
        (p.shopifyCollections ?? []).some((c) => c.title === activeCollection),
      )
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.model.toLowerCase().includes(q) ||
          (p.name ?? '').toLowerCase().includes(q) ||
          (p.type ?? '').toLowerCase().includes(q),
      )
    }

    // Sort
    switch (sort) {
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

    return items
  }, [products, search, activeCategory, activeCollection, sort])

  const hasFilters =
    search.trim() !== '' || activeCategory !== 'All' || activeCollection !== 'All'

  // Stable filter key drives AnimatePresence grid transitions
  const gridKey = `${activeCategory}|${activeCollection}|${search.trim()}|${sort}`

  function clearAll() {
    setSearch('')
    setActiveCategory('All')
    setActiveCollection('All')
  }

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <header className="border-b border-kawai-neutral bg-kawai-pearl">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-xs uppercase tracking-[0.3em] text-kawai-charcoal/60 mb-2 font-[family-name:var(--font-brand-sans)]"
              >
                Kawai Collection
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-6xl md:text-7xl lg:text-8xl leading-none text-kawai-black"
                style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
              >
                Pianos
              </motion.h1>
            </div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative md:w-72 lg:w-96 group"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by model or name…"
                className={cn(
                  'w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm',
                  'text-kawai-black placeholder:text-kawai-charcoal/40',
                  'focus:outline-none focus:ring-0',
                  'font-[family-name:var(--font-brand-sans)]',
                  'transition-colors duration-200',
                  search
                    ? 'border-kawai-black'
                    : 'border-kawai-neutral group-hover:border-kawai-charcoal',
                )}
              />
              <div className="absolute right-0 bottom-2 flex items-center">
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="text-kawai-charcoal/50 hover:text-kawai-black transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <Search size={14} className="text-kawai-charcoal/40" />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Category + Collection Filter Bar ──────────────────── */}
        <div className="max-w-7xl mx-auto px-6 pb-0">
          {/* Category tabs row */}
          <div className="flex items-center justify-between border-t border-kawai-neutral pt-4 pb-4 gap-4">
            <LayoutGroup id="category-tabs">
              <nav className="flex items-center gap-1 flex-wrap" aria-label="Piano categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'relative px-4 py-1.5 text-xs uppercase tracking-[0.15em] font-medium',
                      'transition-colors duration-200 font-[family-name:var(--font-brand-sans)]',
                      'focus-visible:outline-2 focus-visible:outline-kawai-red focus-visible:outline-offset-2',
                      activeCategory === cat
                        ? 'text-kawai-pearl'
                        : 'text-kawai-charcoal hover:text-kawai-black',
                    )}
                  >
                    {/* Animated background pill */}
                    {activeCategory === cat && (
                      <motion.span
                        layoutId="cat-pill"
                        className="absolute inset-0 bg-kawai-black"
                        style={{ borderRadius: 0 }}
                        transition={{ type: 'spring', bounce: 0.18, duration: 0.42 }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                ))}
              </nav>
            </LayoutGroup>

            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Results count */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={filtered.length}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] whitespace-nowrap"
                >
                  {filtered.length} {filtered.length === 1 ? 'instrument' : 'instruments'}
                </motion.span>
              </AnimatePresence>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={cn(
                    'appearance-none text-xs bg-transparent border-0 border-b border-kawai-neutral pb-1 pr-5',
                    'text-kawai-charcoal focus:outline-none focus:ring-0 cursor-pointer',
                    'font-[family-name:var(--font-brand-sans)] hover:border-kawai-charcoal transition-colors',
                  )}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={10}
                  className="absolute right-0 bottom-2 text-kawai-charcoal/40 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Collection filter row — only if collections exist */}
          {collections.length > 0 && (
            <div className="border-t border-kawai-neutral/50 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] flex-shrink-0">
                Collection
              </span>
              <div className="flex items-center gap-2 flex-nowrap">
                {['All', ...collections].map((col) => (
                  <button
                    key={col}
                    onClick={() => setActiveCollection(col)}
                    className={cn(
                      'relative flex-shrink-0 px-3 py-1 text-[10px] uppercase tracking-[0.12em]',
                      'transition-colors duration-200 font-[family-name:var(--font-brand-sans)]',
                      activeCollection === col
                        ? 'text-kawai-red'
                        : 'text-kawai-charcoal/60 hover:text-kawai-charcoal',
                    )}
                  >
                    {col}
                    {/* Animated underline */}
                    {activeCollection === col && (
                      <motion.span
                        layoutId="collection-underline"
                        className="absolute bottom-0 left-3 right-3 h-px bg-kawai-red"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active filter chips */}
          <AnimatePresence>
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-kawai-neutral/50 overflow-hidden"
              >
                <div className="py-3 flex items-center gap-2 flex-wrap">
                  {activeCategory !== 'All' && (
                    <FilterChip
                      label={activeCategory}
                      onRemove={() => setActiveCategory('All')}
                    />
                  )}
                  {activeCollection !== 'All' && (
                    <FilterChip
                      label={activeCollection}
                      onRemove={() => setActiveCollection('All')}
                    />
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
      </header>

      {/* ── Product Grid ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={gridKey}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-kawai-neutral"
            >
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-kawai-black/5 text-kawai-charcoal text-[10px] uppercase tracking-[0.12em] font-[family-name:var(--font-brand-sans)]"
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

function ProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  const category = normalizeCategory(product)
  const hasPrice = !!product.price?.msrp
  const isOnSale = product.salePrice != null && hasPrice

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col bg-kawai-pearl hover:bg-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-kawai-red h-full"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name ?? product.model}
              fill
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F0EDE8]">
              <PianoSilhouette />
              <span className="text-[10px] uppercase tracking-[0.25em] text-kawai-charcoal/30 font-[family-name:var(--font-brand-sans)]">
                {product.model}
              </span>
            </div>
          )}

          {/* Category badge — top-left */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]',
                'font-[family-name:var(--font-brand-sans)]',
                category === 'Grand'
                  ? 'bg-kawai-gold/20 text-kawai-charcoal'
                  : 'bg-kawai-black/5 text-kawai-charcoal',
              )}
            >
              {product.type ?? category}
            </span>
          </div>

          {/* SALE badge — top-right */}
          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="inline-block px-2 py-0.5 bg-kawai-red text-white text-[10px] uppercase tracking-[0.15em] font-semibold font-[family-name:var(--font-brand-sans)]">
                Sale
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-6">
          {/* Model number */}
          <p className="text-[10px] uppercase tracking-[0.3em] text-kawai-charcoal/50 mb-1 font-[family-name:var(--font-brand-sans)]">
            {product.model}
          </p>

          {/* Product name */}
          <h2
            className="text-xl leading-snug text-kawai-black mb-auto"
            style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
          >
            {product.name ?? product.model}
          </h2>

          {/* Collections (if any) */}
          {product.shopifyCollections && product.shopifyCollections.length > 0 && (
            <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] line-clamp-1">
              {product.shopifyCollections
                .slice(0, 2)
                .map((c) => c.title)
                .join(' · ')}
            </p>
          )}

          {/* Divider */}
          <div className="my-4 h-px bg-kawai-neutral group-hover:bg-kawai-charcoal/20 transition-colors duration-300" />

          {/* Price + CTA row */}
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
              {isOnSale ? (
                <>
                  {/* Struck-through MSRP */}
                  <p className="text-[11px] text-kawai-charcoal/40 line-through font-[family-name:var(--font-brand-sans)]">
                    {formatPrice(product.price)}
                  </p>
                  {/* Sale price — prominent */}
                  <p className="text-sm font-semibold text-kawai-red font-[family-name:var(--font-brand-sans)]">
                    {formatCurrency(product.salePrice!, product.price?.currency ?? 'USD')}
                  </p>
                </>
              ) : (
                <p
                  className={cn(
                    'text-sm font-medium font-[family-name:var(--font-brand-sans)]',
                    hasPrice ? 'text-kawai-black' : 'text-kawai-charcoal/60 italic text-xs',
                  )}
                >
                  {formatPrice(product.price)}
                </p>
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
              <svg
                width="11"
                height="8"
                viewBox="0 0 11 8"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                <path
                  d="M7 1L10 4M10 4L7 7M10 4H1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
      <p
        className="text-6xl text-kawai-black/8 mb-6 select-none"
        style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
        aria-hidden
      >
        ♩
      </p>
      <p
        className="text-2xl text-kawai-black mb-2"
        style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
      >
        No instruments found
      </p>
      <p className="text-sm text-kawai-charcoal/60 mb-8 font-[family-name:var(--font-brand-sans)]">
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'No products are currently available.'}
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
    <svg
      width="56"
      height="40"
      viewBox="0 0 56 40"
      fill="none"
      aria-hidden
      className="opacity-[0.15]"
    >
      <rect x="2" y="2" width="52" height="24" rx="1.5" fill="#2C2C2C" />
      <rect x="2" y="28" width="52" height="8" rx="1.5" fill="#2C2C2C" />
      {/* White keys */}
      {[8, 16, 26, 34, 42].map((x) => (
        <rect key={x} x={x} y="2" width="5" height="14" rx="0.5" fill="white" />
      ))}
    </svg>
  )
}
