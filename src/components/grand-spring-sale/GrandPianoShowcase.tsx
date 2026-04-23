'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

function extractSpec(specs: GrandSaleProduct['specifications'], keywords: string[]): string | null {
  if (!specs) return null
  const normalized = keywords.map((k) => k.toLowerCase())
  const match = specs.find((s) => {
    const specName = (s.spec ?? '').toLowerCase()
    return normalized.some((k) => specName.includes(k))
  })
  return match?.details ?? match?.type ?? null
}

// Only GL-10 and GL-20 are baby grands; everything else is a full grand.
function getPianoType(product: GrandSaleProduct): 'baby-grand' | 'grand' {
  const model = (product.model ?? '').replace(/[-\s]/g, '').toUpperCase()
  if (/^GL10($|[^0-9])/i.test(model)) return 'baby-grand'
  if (/^GL20($|[^0-9])/i.test(model)) return 'baby-grand'
  return 'grand'
}

type TypeFilter = 'all' | 'baby-grand' | 'grand'

const TYPE_FILTERS: { key: TypeFilter; label: string; sub: string }[] = [
  { key: 'all',        label: 'All Models',  sub: 'Every grand on sale' },
  { key: 'baby-grand', label: 'Baby Grand',  sub: 'GL-10 · GL-20'       },
  { key: 'grand',      label: 'Grand Piano', sub: "6′ – 9′"             },
]

function matchesFilters(product: GrandSaleProduct, typeFilter: TypeFilter, query: string): boolean {
  if (typeFilter !== 'all' && getPianoType(product) !== typeFilter) return false
  if (query.trim()) {
    const q = query.toLowerCase()
    const haystack = [product.name, product.model, product.description].filter(Boolean).join(' ').toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

// ── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0  },
}

const staggerGrid = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const cardVariant = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// ── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOpenModal,
}: {
  product: GrandSaleProduct
  onOpenModal: (product: GrandSaleProduct) => void
}) {
  const length = extractSpec(product.specifications, ['length', 'cabinet length', 'piano length'])
  const action = extractSpec(product.specifications, ['action', 'key action'])
  const keys   = extractSpec(product.specifications, ['keys', 'keyboard range', 'number of keys'])

  const specs = [
    length && { label: 'Length', value: length },
    action && { label: 'Action', value: action },
    keys   && { label: 'Keys',   value: keys   },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  const fallbackSpecs = (product.highlights ?? [])
    .slice(0, 3)
    .map((h) => ({ label: 'Feature', value: h.highlight ?? '' }))
    .filter((h) => h.value)

  const displaySpecs = specs.length >= 2 ? specs.slice(0, 3) : fallbackSpecs.slice(0, 3)
  const pianoType    = getPianoType(product)

  return (
    <motion.article variants={cardVariant} className="group flex flex-col bg-white">

      {/* ── Image stage ── */}
      <div className="relative overflow-hidden bg-white" style={{ aspectRatio: '4/3' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name ?? product.model ?? ''}
            className="w-full h-full object-contain p-6 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-kawai-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />

        <p className="absolute bottom-3 left-4 text-kawai-charcoal/50 text-[10px] tracking-[0.28em] uppercase font-[family-name:var(--font-brand-sans)]">
          {pianoType === 'baby-grand' ? 'Baby Grand' : 'Grand Piano'}
        </p>

        <span className="absolute top-3 right-3 px-2.5 py-1 bg-kawai-red text-white text-[9px] tracking-[0.2em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
          In-Store Discount
        </span>

        {/* Gold reveal line on hover */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-[#d5c78c] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col flex-1 p-6 border-x border-b border-kawai-neutral/50">
        <p className="text-kawai-charcoal/40 text-[10px] tracking-[0.3em] uppercase mb-2 font-[family-name:var(--font-brand-sans)]">
          Kawai · {product.model}
        </p>

        <h3
          className="font-[family-name:var(--font-family-cormorant)] text-kawai-black leading-tight mb-4"
          style={{ fontSize: 'clamp(1.25rem, 2vw, 1.55rem)', fontWeight: 500 }}
        >
          {product.name ?? product.model}
        </h3>

        {displaySpecs.length > 0 && (
          <dl className="space-y-2 pt-4 border-t border-kawai-neutral/40 mb-5">
            {displaySpecs.map(({ label, value }) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-kawai-charcoal/40 text-[11px] tracking-[0.1em] uppercase font-[family-name:var(--font-brand-sans)]">
                  {label}
                </dt>
                <dd className="text-kawai-black text-[11px] font-medium text-right font-[family-name:var(--font-brand-sans)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto space-y-2">
          <button
            onClick={() => onOpenModal(product)}
            className="w-full inline-flex items-center justify-between px-5 py-3.5 bg-kawai-black hover:bg-kawai-charcoal text-white text-[10px] tracking-[0.22em] uppercase font-semibold transition-colors duration-200 font-[family-name:var(--font-brand-sans)] group/btn"
          >
            Explore Model
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <a
            href="#grand-lead-form"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('grand-lead-form')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full inline-flex items-center justify-center px-5 py-3 bg-kawai-red hover:bg-kawai-red/90 text-white text-[10px] tracking-[0.22em] uppercase font-semibold transition-all duration-200 font-[family-name:var(--font-brand-sans)]"
          >
            Request Pricing
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export function GrandPianoShowcase({ products }: GrandPianoShowcaseProps) {
  const [activeType,   setActiveType  ] = useState<TypeFilter>('all')
  const [searchQuery,  setSearchQuery ] = useState('')
  const [isStuck,      setIsStuck     ] = useState(false)
  const [modalProduct, setModalProduct] = useState<GrandSaleProduct | null>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

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

  const filtered       = products.filter((p) => matchesFilters(p, activeType, searchQuery))
  const hasProducts    = products.length > 0
  const babyGrandCount = products.filter((p) => getPianoType(p) === 'baby-grand').length
  const grandCount     = products.filter((p) => getPianoType(p) === 'grand').length
  const isFiltered     = activeType !== 'all' || !!searchQuery

  if (!hasProducts) {
    return (
      <section id="grand-showcase" className="py-24 bg-kawai-pearl/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-[family-name:var(--font-family-cormorant)] text-kawai-charcoal/40 text-2xl font-light">
            Grand piano collection coming soon.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="grand-showcase" className="bg-kawai-pearl">

      {/* ── Section header ─────────────────────────────────────────── */}
      <motion.div
        className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-10 md:pb-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-16">
          <div>
            <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-px w-10 bg-[#d5c78c]" />
              <SakuraIcon className="w-3 h-3 text-kawai-red/50" />
              <p className="text-kawai-charcoal/45 text-[10px] tracking-[0.32em] uppercase font-[family-name:var(--font-brand-sans)]">
                Grand Piano Collection · Spring 2026
              </p>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-black leading-none"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400 }}
            >
              Piano Availability
            </motion.h2>
          </div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-kawai-charcoal/50 text-sm leading-relaxed max-w-xs md:text-right font-[family-name:var(--font-brand-sans)] md:pb-1"
          >
            Every instrument available for in-store trial. Exclusive spring pricing applied at showroom.
          </motion.p>
        </div>
      </motion.div>

      {/* ── Sticky toolbar ─────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className={cn(
          'sticky z-20 bg-kawai-pearl backdrop-blur-md border-y border-kawai-neutral/60 transition-shadow duration-300',
          isStuck && 'shadow-[0_6px_24px_rgba(30,27,22,0.09)]',
        )}
        style={{ top: 'var(--header-bottom, 70px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">

          {/* Search input — full-width, prominent */}
          <div
            className={cn(
              'flex items-center gap-3 w-full bg-white border rounded-xl px-4 py-3.5 transition-all duration-200 shadow-sm',
              searchQuery
                ? 'border-kawai-red/40 ring-2 ring-kawai-red/10'
                : 'border-kawai-neutral hover:border-kawai-charcoal/30',
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <svg
              className="w-5 h-5 text-kawai-charcoal/40 flex-shrink-0 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model — GX-3, GL-10, SK-EX…"
              className="flex-1 bg-transparent border-0 text-sm text-kawai-black placeholder:text-kawai-charcoal/35 focus:outline-none font-[family-name:var(--font-brand-sans)]"
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => { setSearchQuery(''); inputRef.current?.focus() }}
                  className="w-6 h-6 rounded-full bg-kawai-charcoal/10 hover:bg-kawai-red hover:text-white text-kawai-charcoal/50 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Category selector — segmented control with sliding pill */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-kawai-black/[0.06] rounded-xl p-1 gap-0.5">
              {TYPE_FILTERS.map(({ key, label }) => {
                const count  = key === 'all' ? products.length : key === 'baby-grand' ? babyGrandCount : grandCount
                const active = activeType === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveType(key)}
                    className={cn(
                      'relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors duration-150 whitespace-nowrap font-[family-name:var(--font-brand-sans)]',
                      active ? 'text-kawai-black' : 'text-kawai-charcoal/50 hover:text-kawai-charcoal/80',
                    )}
                  >
                    {/* Sliding background pill */}
                    {active && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                    <span className={cn(
                      'relative z-10 text-[10px] tabular-nums font-medium transition-colors',
                      active ? 'text-kawai-red' : 'text-kawai-charcoal/30',
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Clear button — only when filtered */}
            <AnimatePresence>
              {isFiltered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.85, x: 8 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => { setActiveType('all'); setSearchQuery('') }}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-kawai-red text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-kawai-red/8 rounded-lg transition-colors flex-shrink-0 font-[family-name:var(--font-brand-sans)]"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Product grid ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-10 pb-20 md:pb-28">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-28"
            >
              <p className="font-[family-name:var(--font-family-cormorant)] text-kawai-charcoal/35 mb-5" style={{ fontSize: '2rem', fontWeight: 400 }}>
                No instruments found
              </p>
              <button
                className="text-kawai-red text-[10px] tracking-[0.25em] uppercase font-semibold hover:underline font-[family-name:var(--font-brand-sans)]"
                onClick={() => { setActiveType('all'); setSearchQuery('') }}
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="grid" initial="hidden" animate="visible" exit={{ opacity: 0 }}>
              {/* Result count */}
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="text-kawai-charcoal/40 text-[10px] tracking-[0.25em] uppercase mb-6 font-[family-name:var(--font-brand-sans)]"
              >
                {filtered.length} instrument{filtered.length !== 1 ? 's' : ''}
                {activeType !== 'all' && <> · {TYPE_FILTERS.find(f => f.key === activeType)?.label}</>}
              </motion.p>

              {/* Gallery grid with stagger */}
              <motion.div
                variants={staggerGrid}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-kawai-neutral/50"
              >
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={setModalProduct}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Media modal ────────────────────────────────────────────── */}
      {modalProduct && (
        <ProductMediaModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </section>
  )
}
