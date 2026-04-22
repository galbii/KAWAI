'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { GrandSaleProduct } from '@/lib/payload/queries'
import { ProductMediaModal } from './ProductMediaModal'

function SakuraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

interface GrandPianoShowcaseProps {
  products: GrandSaleProduct[]
  storeslug: string
}

function extractSpec(
  specs: GrandSaleProduct['specifications'],
  keywords: string[],
): string | null {
  if (!specs) return null
  const normalized = keywords.map((k) => k.toLowerCase())
  const match = specs.find((s) => {
    const specName = (s.spec ?? '').toLowerCase()
    return normalized.some((k) => specName.includes(k))
  })
  return match?.details ?? match?.type ?? null
}

// Classify a product as baby grand (< 6') or full grand (6'+) based on model name.
// GL series and GX-1/GX-2 are baby grands; GX-3+, SK series are full grands.
function getPianoType(product: GrandSaleProduct): 'baby-grand' | 'grand' {
  const model = (product.model ?? '').toUpperCase().trim()
  if (/^GL[-\s]?\d/i.test(model)) return 'baby-grand'
  if (/^GX[-\s]?[12]($|[^0-9])/i.test(model)) return 'baby-grand'
  return 'grand'
}

type TypeFilter = 'all' | 'baby-grand' | 'grand'

const TYPE_FILTERS: { key: TypeFilter; label: string; sub: string }[] = [
  { key: 'all',        label: 'All Models',   sub: 'Every grand on sale' },
  { key: 'baby-grand', label: 'Baby Grand',   sub: "4'10\" – 5'11\""    },
  { key: 'grand',      label: 'Grand Piano',  sub: "6' – 9'"             },
]

function matchesFilters(
  product: GrandSaleProduct,
  typeFilter: TypeFilter,
  query: string,
): boolean {
  if (typeFilter !== 'all' && getPianoType(product) !== typeFilter) return false
  if (query.trim()) {
    const q = query.toLowerCase()
    const haystack = [product.name, product.model, product.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

function ProductCard({
  product,
  onOpenModal,
}: {
  product: GrandSaleProduct
  onOpenModal: (product: GrandSaleProduct) => void
}) {
  const length = extractSpec(product.specifications, ['length', 'cabinet length', 'piano length'])
  const action = extractSpec(product.specifications, ['action', 'key action'])
  const keys = extractSpec(product.specifications, ['keys', 'keyboard range', 'number of keys'])

  const specs = [
    length && { label: 'Length', value: length },
    action && { label: 'Action', value: action },
    keys && { label: 'Keys', value: keys },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  const fallbackSpecs = (product.highlights ?? [])
    .slice(0, 3)
    .map((h) => ({ label: 'Highlight', value: h.highlight ?? '' }))
    .filter((h) => h.value)

  const displaySpecs = specs.length >= 2 ? specs.slice(0, 3) : fallbackSpecs.slice(0, 3)

  const pianoType = getPianoType(product)

  return (
    <div className="group bg-white border border-kawai-neutral/60 rounded-lg overflow-hidden hover:shadow-brand-medium hover:border-kawai-red/20 transition-all duration-300 flex flex-col">
      {/* Product image */}
      <div className="relative aspect-[3/2] bg-white overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name ?? product.model}
            className="w-full h-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-kawai-charcoal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-2 py-1 bg-kawai-red text-white text-[10px] tracking-[0.1em] uppercase font-medium rounded-sm">
            In-Store Discount
          </span>
          <span className="px-2 py-1 bg-kawai-black/80 text-white text-[10px] tracking-[0.08em] uppercase font-medium rounded-sm">
            {pianoType === 'baby-grand' ? 'Baby Grand' : 'Grand Piano'}
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-kawai-charcoal/50 text-xs tracking-[0.2em] uppercase">Kawai</span>
        </div>
        <h3 className="text-xl font-medium text-kawai-black mb-1 font-[family-name:var(--font-brand-serif)]">
          {product.name ?? product.model}
        </h3>
        <p className="text-kawai-charcoal/50 text-xs uppercase tracking-wider mb-4">
          {product.model}
        </p>

        {displaySpecs.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mb-5 pt-4 border-t border-kawai-neutral/60">
            {displaySpecs.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-baseline gap-4">
                <span className="text-kawai-charcoal/50 text-xs">{label}</span>
                <span className="text-kawai-black text-xs font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">

          <div className="flex gap-3">
            <button
              onClick={() => onOpenModal(product)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-kawai-black hover:bg-kawai-charcoal text-white text-sm font-medium tracking-wide transition-colors rounded-sm group/btn"
            >
              Explore Model
              <div className="w-5 h-5 rounded-full border border-white/30 group-hover/btn:border-white/60 group-hover/btn:bg-white/10 flex items-center justify-center transition-all">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </button>
            <a
              href="#grand-lead-form"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('grand-lead-form')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white text-sm font-medium tracking-wide transition-colors rounded-sm"
            >
              Request Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GrandPianoShowcase({ products }: GrandPianoShowcaseProps) {
  const [activeType, setActiveType] = useState<TypeFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isStuck, setIsStuck] = useState(false)
  const [modalProduct, setModalProduct] = useState<GrandSaleProduct | null>(null)

  const stickyRef = useRef<HTMLDivElement>(null)

  // Detect when the toolbar becomes stuck so we can show a shadow
  useEffect(() => {
    const el = stickyRef.current
    if (!el) return
    const sentinel = document.createElement('div')
    sentinel.style.cssText = 'height:1px;margin-bottom:-1px;'
    el.parentElement?.insertBefore(sentinel, el)
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry) setIsStuck(!entry.isIntersecting) },
      { threshold: [1] },
    )
    observer.observe(sentinel)
    return () => { observer.disconnect(); sentinel.remove() }
  }, [])

  const filtered = products.filter((p) => matchesFilters(p, activeType, searchQuery))
  const hasProducts = products.length > 0

  const babGrandCount = products.filter((p) => getPianoType(p) === 'baby-grand').length
  const grandCount    = products.filter((p) => getPianoType(p) === 'grand').length

  if (!hasProducts) {
    return (
      <section id="grand-showcase" className="py-20 bg-white/88 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-kawai-charcoal/60">Grand piano collection coming soon. Contact us for availability.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="grand-showcase" className="bg-white/88 backdrop-blur-md">

      {/* ── Section header ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-20 pb-6 md:pb-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
            <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              Grand Piano Collection
            </p>
          </div>
          <h2 className="text-2xl md:text-4xl font-light font-[family-name:var(--font-brand-serif)] text-kawai-black mb-2 md:mb-4">
            Piano Availability
          </h2>
          <p className="text-kawai-charcoal/60 text-sm md:text-base max-w-xl mx-auto">
            Secure big discounts on our curated collection of grand and baby grand pianos.
          </p>
        </div>
      </div>

      {/* ── Sticky search + filter toolbar ──────────────────────── */}
      <div
        ref={stickyRef}
        className={cn(
          'sticky z-20 bg-white/95 backdrop-blur-md border-b border-kawai-neutral transition-shadow',
          isStuck && 'shadow-brand-medium',
        )}
        style={{ top: 'var(--header-bottom, 120px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-row gap-2 items-center">

            {/* Search input */}
            <div className="relative w-36 sm:flex-1 min-w-0 flex-shrink-0">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-kawai-charcoal/35 pointer-events-none"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, e.g. GX-3, GL-20…"
                className="w-full pl-10 pr-4 py-2.5 bg-kawai-pearl border border-kawai-neutral rounded-sm text-sm text-kawai-black placeholder:text-kawai-charcoal/35 focus:outline-none focus:border-kawai-red/40 focus:ring-1 focus:ring-kawai-red/20 transition font-[family-name:var(--font-brand-sans)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kawai-charcoal/40 hover:text-kawai-black transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Type filters */}
            <div className="flex gap-1.5 flex-shrink-0 overflow-x-auto scrollbar-none">
              {TYPE_FILTERS.map(({ key, label }) => {
                const count = key === 'all' ? products.length
                  : key === 'baby-grand' ? babGrandCount
                  : grandCount
                return (
                  <button
                    key={key}
                    onClick={() => setActiveType(key)}
                    className={cn(
                      'relative px-4 py-2.5 text-xs font-medium rounded-sm border transition-all tracking-wide whitespace-nowrap font-[family-name:var(--font-brand-sans)]',
                      activeType === key
                        ? 'bg-kawai-black text-white border-kawai-black'
                        : 'bg-white text-kawai-charcoal border-kawai-neutral hover:border-kawai-black/40 hover:text-kawai-black',
                    )}
                  >
                    {label}
                    <span className={cn(
                      'ml-1.5 text-[10px] tabular-nums',
                      activeType === key ? 'text-white/60' : 'text-kawai-charcoal/40',
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active filter context line */}
          {(activeType !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-kawai-neutral/60">
              <span className="text-kawai-charcoal/50 text-xs font-[family-name:var(--font-brand-sans)]">
                {filtered.length} model{filtered.length !== 1 ? 's' : ''} shown
                {activeType !== 'all' && (
                  <> · <span className="text-kawai-black font-medium">
                    {TYPE_FILTERS.find(f => f.key === activeType)?.label}
                    {' '}
                    <span className="font-normal text-kawai-charcoal/40">
                      ({TYPE_FILTERS.find(f => f.key === activeType)?.sub})
                    </span>
                  </span></>
                )}
                {searchQuery && (
                  <> · searching <span className="text-kawai-black font-medium">&ldquo;{searchQuery}&rdquo;</span></>
                )}
              </span>
              <button
                onClick={() => { setActiveType('all'); setSearchQuery('') }}
                className="ml-auto text-kawai-red text-xs hover:underline font-[family-name:var(--font-brand-sans)]"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Product grid ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-16 md:pb-24 pt-4 md:pt-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-kawai-charcoal/50 mb-3 font-[family-name:var(--font-brand-sans)]">
              No models match your search.
            </p>
            <button
              className="text-kawai-red text-sm underline font-[family-name:var(--font-brand-sans)]"
              onClick={() => { setActiveType('all'); setSearchQuery('') }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onOpenModal={setModalProduct} />
            ))}
          </div>
        )}

      </div>

      {/* ── Product media modal ─────────────────────────────────── */}
      {modalProduct && (
        <ProductMediaModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </section>
  )
}
