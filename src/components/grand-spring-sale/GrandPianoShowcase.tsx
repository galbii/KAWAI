'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { GrandSaleProduct } from '@/lib/payload/queries'

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

function formatCurrency(n: number, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: decimals,
  }).format(n)
}

function calcMonthly(msrp: number) {
  return Math.ceil(msrp / 36)
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

function getPriceRange(products: GrandSaleProduct[]): [number, number] {
  const prices = products
    .map((p) => p.price?.msrp ?? 0)
    .filter((p) => p > 0)
  if (prices.length === 0) return [0, 100000]
  return [Math.min(...prices), Math.max(...prices)]
}

type FilterKey = 'all' | 'under-15k' | '15k-25k' | 'over-25k'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Models' },
  { key: 'under-15k', label: 'Under $15,000' },
  { key: '15k-25k', label: '$15K – $25K' },
  { key: 'over-25k', label: 'Over $25,000' },
]

function matchesFilter(product: GrandSaleProduct, filter: FilterKey): boolean {
  const msrp = product.price?.msrp ?? 0
  switch (filter) {
    case 'all': return true
    case 'under-15k': return msrp < 15000
    case '15k-25k': return msrp >= 15000 && msrp <= 25000
    case 'over-25k': return msrp > 25000
  }
}

function ProductCard({
  product,
  storeslug,
}: {
  product: GrandSaleProduct
  storeslug: string
}) {
  const msrp = product.price?.msrp ?? null
  const monthly = msrp ? calcMonthly(msrp) : null

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

  return (
    <div className="group bg-white border border-kawai-neutral/60 rounded-lg overflow-hidden hover:shadow-brand-medium hover:border-kawai-red/20 transition-all duration-300 flex flex-col">
      {/* Product image */}
      <div className="relative aspect-[4/3] bg-kawai-pearl overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name ?? product.model}
            className="w-full h-full object-contain p-6 group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-kawai-charcoal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </div>
        )}
        {/* Spring sale badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-kawai-red text-white text-[10px] tracking-[0.1em] uppercase font-medium rounded-sm">
            Spring Offer
          </span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Model */}
        <div className="mb-1">
          <span className="text-kawai-charcoal/50 text-xs tracking-[0.2em] uppercase">Kawai</span>
        </div>
        <h3 className="text-xl font-medium text-kawai-black mb-1 font-[family-name:var(--font-brand-serif)]">
          {product.name ?? product.model}
        </h3>
        <p className="text-kawai-charcoal/50 text-xs uppercase tracking-wider mb-4">
          {product.model}
        </p>

        {/* Specs */}
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
          {/* Pricing */}
          {msrp && msrp > 0 ? (
            <div className="mb-5 pt-4 border-t border-kawai-neutral/60">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-kawai-charcoal/50 text-xs mb-0.5">MSRP from</div>
                  <div className="text-2xl font-light text-kawai-black font-[family-name:var(--font-brand-serif)]">
                    {formatCurrency(msrp)}
                  </div>
                </div>
                {monthly && (
                  <div className="text-right">
                    <div className="text-kawai-charcoal/50 text-xs mb-0.5">or as low as</div>
                    <div className="text-kawai-red font-semibold text-lg">
                      {formatCurrency(monthly)}<span className="text-sm font-normal">/mo</span>
                    </div>
                    <div className="text-kawai-charcoal/40 text-[10px]">0% · 36 months†</div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* CTAs */}
          <div className="flex gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-kawai-black hover:bg-kawai-charcoal text-white text-sm font-medium tracking-wide transition-colors rounded-sm group/btn"
            >
              Explore Model
              <div className="w-5 h-5 rounded-full border border-white/30 group-hover/btn:border-white/60 group-hover/btn:bg-white/10 flex items-center justify-center transition-all">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
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

export function GrandPianoShowcase({ products, storeslug }: GrandPianoShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const filtered = products.filter((p) => matchesFilter(p, activeFilter))

  const [min, max] = getPriceRange(products)
  const hasProducts = products.length > 0

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
    <section id="grand-showcase" className="py-16 md:py-24 bg-white/88 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
            <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              Grand Piano Collection
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-light font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
            Find your instrument.
          </h2>
          <p className="text-kawai-charcoal/60 max-w-xl mx-auto">
            Every model below is eligible for 0% financing. Prices range from{' '}
            {formatCurrency(min)} to {formatCurrency(max)}.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={cn(
                'px-5 py-2 text-sm border rounded-sm transition-colors tracking-wide',
                activeFilter === key
                  ? 'bg-kawai-black text-white border-kawai-black'
                  : 'bg-white text-kawai-charcoal border-kawai-neutral hover:border-kawai-black/40',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-kawai-charcoal/50">
            No models in this price range. Try a different filter or{' '}
            <button
              className="underline text-kawai-red"
              onClick={() => setActiveFilter('all')}
            >
              view all models
            </button>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} storeslug={storeslug} />
            ))}
          </div>
        )}

        {/* Bottom note */}
        <p className="text-center text-kawai-charcoal/40 text-xs mt-10">
          †Monthly payment examples are illustrative at 0% APR for 36 months. Actual payment subject to credit approval.
          Prices shown are MSRP; contact us for current in-store pricing.
        </p>
      </div>
    </section>
  )
}
