'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import RebateModelModal from '@/components/rebates/RebateModelModal'
import { formatPrice } from '@/lib/utils'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'
import { Reveal } from './Choreography'

/**
 * The rebate program as a price ledger — one line per model — instead of the
 * shared RebateSchedule's full product cards. Eighteen photo cards with two
 * buttons each ran ~5,600px on desktop and ~10,000px on phones; a family
 * scanning for "what does the CA401 cost now" needs a table, not a catalog.
 * Photography lives in the detail modal, one tap away on every row.
 *
 * Each row shows a single savings figure (MSRP − final price) so the math
 * reconciles with the two prices beside it; the rebate breakdown is in the
 * modal and the footnote.
 *
 * Rows reveal in a short stagger as the ledger arrives, and re-stagger when the
 * category changes — the filter reads as the table being re-set rather than
 * swapped.
 *
 * Search and the category tabs are one fused sticky control. A visitor who
 * already knows the model they want ("CA401") should not have to guess which
 * category it files under, and a ledger this long is exactly where a name
 * search beats scrolling — so the field sits above the tabs and narrows
 * whatever the tabs have already selected. The tab counts restate themselves
 * against the query, which is how the visitor learns where the matches are.
 *
 * The ledger owns the control bar and the table and nothing else: the heading,
 * the closing CTA and the legal footnote belong to whatever frames it. That is
 * what lets RebateSection show it in the page's flow and RebateModal show the
 * identical table inside a dialog.
 */

interface RebateLedgerProps {
  data: RebateCategory[]
  /**
   * Where the fused search/tab bar sticks, in px from the top of its scroll
   * container. 70 on the page (the site header is fixed at 71px); 0 inside a
   * modal, whose own scroll container starts under its header.
   */
  stickyTopPx?: number
  /**
   * Return the visitor to the top of the ledger after a category change made
   * while the bar is stuck. Switching to a shorter category otherwise strands
   * them below the whole table.
   */
  onResetScroll?: () => void
  /** Opens the booking surface from a model's detail card. */
  onBook?: () => void
  /**
   * Reports how many rows are currently showing, so a frame can put the count
   * in its heading. The ledger owns the filter state, so it is the only thing
   * that knows.
   */
  onVisibleCountChange?: (count: number) => void
}

type SelectedModel = { product: RebateProduct; categoryLabel: string; isShigeru: boolean }

export function RebateLedger({
  data,
  stickyTopPx = 70,
  onResetScroll,
  onBook,
  onVisibleCountChange,
}: RebateLedgerProps) {
  const [selected, setSelected] = useState<SelectedModel | null>(null)
  const [activeSlug, setActiveSlug] = useState<string>('all')
  const [query, setQuery] = useState('')
  const filterBarRef = useRef<HTMLDivElement>(null)

  function selectCategory(slug: string) {
    setActiveSlug(slug)
    const bar = filterBarRef.current
    if (bar && bar.getBoundingClientRect().top <= stickyTopPx + 2) onResetScroll?.()
  }

  // What a visitor types here is a model — "CA401", "GX", "K-300" — or, less
  // often, a word from the full product name ("grand", "hybrid").
  //
  // Short queries search the model label only. Two letters against the full
  // name is almost all noise: "es" appears inside "Series" and "Digital Piano",
  // so it would return the whole ledger rather than the ES line. From three
  // characters on, a query is specific enough that matching the name is worth
  // more than it costs.
  const trimmedQuery = query.trim().toLowerCase()

  function matchesQuery(product: RebateProduct, q: string): boolean {
    if (!q) return true
    const haystack =
      q.length < 3
        ? `${product.label} ${product.model}`
        : `${product.label} ${product.model} ${product.name} ${product.note ?? ''}`
    return haystack.toLowerCase().includes(q)
  }

  // Category filter + search + cheapest-first sort. 'all' keeps every group
  // visible so the ledger still reads as the full program at a glance; a group
  // the search empties out drops away rather than leaving a bare header.
  const visibleData = useMemo(() => {
    const filtered = activeSlug === 'all' ? data : data.filter((c) => c.slug === activeSlug)
    return filtered
      .map((category) => ({
        ...category,
        products: category.products
          .filter((product) => matchesQuery(product, trimmedQuery))
          .sort((a, b) => a.yourPrice - b.yourPrice),
      }))
      .filter((category) => category.products.length > 0)
  }, [data, activeSlug, trimmedQuery])

  // Tab counts are counted against the query, not the whole program — a tab
  // reading 0 while searching is the answer to "is it in there?", so it stays
  // clickable and simply dims.
  const counts = useMemo(() => {
    const byCategory: Record<string, number> = {}
    let total = 0
    for (const category of data) {
      const n = category.products.filter((product) => matchesQuery(product, trimmedQuery)).length
      byCategory[category.slug] = n
      total += n
    }
    return { byCategory, total }
  }, [data, trimmedQuery])

  const visibleCount = useMemo(
    () => visibleData.reduce((n, category) => n + category.products.length, 0),
    [visibleData],
  )

  useEffect(() => {
    onVisibleCountChange?.(visibleCount)
  }, [visibleCount, onVisibleCountChange])

  if (data.length === 0) return null

  return (
    <>
      {/* Segmented category bar, fused to the top of the ledger. It must live
          OUTSIDE the ledger's overflow-hidden card or sticky would be inert. */}
      <div
        ref={filterBarRef}
        className="sticky z-20 bg-kawai-black shadow-[0_12px_28px_rgba(30,27,22,0.22)]"
        style={{ top: `${stickyTopPx}px` }}
      >
        {/* Search. The magnifier and the field share a row with the clear
            control so the whole thing reads as one instrument, in the same
            condensed caps the tabs under it are set in. */}
        <div className="flex items-center gap-3.5 px-5 sm:px-8 border-b border-kawai-pearl/15">
          <MagnifyingGlassIcon
            className="w-[1.05rem] h-[1.05rem] text-kawai-pearl/40 flex-shrink-0"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a model — CA401, K-300, GX-2…"
            aria-label="Search rebate models by name"
            autoComplete="off"
            className="flex-1 min-w-0 bg-transparent py-3.5 sm:py-4 text-kawai-pearl placeholder:text-kawai-pearl/35 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
            style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
            }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="flex items-center gap-1.5 flex-shrink-0 py-1.5 text-kawai-pearl/50 hover:text-kawai-pearl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red-400"
            >
              <span
                className="hidden sm:inline uppercase"
                style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.18em',
                }}
              >
                Clear
              </span>
              <XMarkIcon className="w-4 h-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Filter models by category"
          className="grid"
          style={{ gridTemplateColumns: `repeat(${data.length + 1}, minmax(0, 1fr))` }}
        >
          {[
            { slug: 'all', label: 'All', count: counts.total },
            ...data.map((c) => ({
              slug: c.slug,
              label: c.label,
              count: counts.byCategory[c.slug] ?? 0,
            })),
          ].map((tab) => {
            const active = activeSlug === tab.slug
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => selectCategory(tab.slug)}
                aria-pressed={active}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 px-1 py-3.5 sm:py-5 uppercase border-r border-kawai-pearl/15 last:border-r-0 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kawai-red-400 ${
                  active
                    ? 'text-kawai-pearl'
                    : 'text-kawai-pearl/50 hover:text-kawai-pearl hover:bg-white/5'
                } ${tab.count === 0 ? 'opacity-40' : ''}`}
                style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: '0.78rem',
                  letterSpacing: '0.18em',
                }}
              >
                {tab.label}
                <span
                  className={active ? 'text-kawai-red-400' : 'text-kawai-pearl/30'}
                  style={{ fontSize: '0.68rem' }}
                >
                  {tab.count}
                </span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] bg-kawai-red transition-transform duration-300 ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* The count is the search's only feedback for a screen reader — the
          ledger itself just silently gets shorter. */}
      <p aria-live="polite" className="sr-only">
        {visibleCount} {visibleCount === 1 ? 'model' : 'models'} shown
      </p>

      <div className="bg-white border border-kawai-black/12 border-t-0 shadow-[0_18px_50px_rgba(30,27,22,0.08)]">
        {visibleData.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p
              className="bts-display text-kawai-black mb-3"
              style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)' }}
            >
              No models match “{query.trim()}”
            </p>
            <p className="text-kawai-charcoal/60 text-sm mb-7 max-w-md mx-auto leading-relaxed">
              Every Kawai in the September program is in this ledger — try the model number on its
              own, or clear the search to see all of them.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setActiveSlug('all')
              }}
              className="inline-flex items-center justify-center px-7 py-4 border border-kawai-black/30 text-kawai-black hover:bg-kawai-black hover:text-kawai-pearl text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
            >
              Clear search
            </button>
          </div>
        ) : null}

        {visibleData.map((category) => (
          <div key={category.slug}>
            <h3 className="flex items-baseline justify-between gap-4 px-5 sm:px-8 py-3.5 bg-kawai-pearl border-y border-kawai-black/10">
              <span
                className="text-kawai-black uppercase"
                style={{
                  fontFamily: 'var(--font-oswald), sans-serif',
                  fontSize: '0.85rem',
                  letterSpacing: '0.24em',
                }}
              >
                {category.label}
              </span>
              <span className="text-kawai-charcoal/45 text-xs tracking-[0.14em] uppercase">
                {category.products.length} {category.products.length === 1 ? 'model' : 'models'}
              </span>
            </h3>

            <ul>
              {category.products.map((product, i) => {
                const saving = Math.max(product.msrp - product.yourPrice, 0)
                return (
                  <Reveal
                    as="li"
                    // Capped so a long category doesn't leave its last rows
                    // waiting on a ladder the visitor has already scrolled past.
                    delay={Math.min(i, 6) * 0.05}
                    key={`${activeSlug}-${product.slug}`}
                    className="border-b border-kawai-black/8 last:border-b-0"
                  >
                    <button
                      onClick={() =>
                        setSelected({
                          product,
                          categoryLabel: category.label,
                          isShigeru: category.slug === 'shigeru',
                        })
                      }
                      className="bts-row group relative w-full grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_minmax(0,1.4fr)_auto_minmax(0,1fr)_auto] items-center gap-x-4 sm:gap-x-6 px-5 sm:px-8 py-4 text-left hover:bg-kawai-pearl/70 focus-visible:bg-kawai-pearl/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kawai-red transition-colors"
                    >
                      <span
                        className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 bg-kawai-pearl/70 overflow-hidden"
                        aria-hidden
                      >
                        {product.imageUrl && (
                          <Image
                            src={product.imageUrl}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </span>

                      <span className="min-w-0">
                        <span
                          className="block text-kawai-black leading-tight"
                          style={{
                            fontFamily: 'var(--font-oswald), sans-serif',
                            fontSize: '1.15rem',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {product.label}
                        </span>
                        {product.note && (
                          <span className="block text-kawai-charcoal/50 text-xs mt-0.5 truncate">
                            {product.note}
                          </span>
                        )}
                      </span>

                      <span
                        className="hidden sm:block text-kawai-red whitespace-nowrap uppercase"
                        style={{
                          fontFamily: 'var(--font-oswald), sans-serif',
                          fontSize: '0.82rem',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {saving > 0 ? `Save ${formatPrice(saving, product.currency)}` : ''}
                      </span>

                      <span className="text-right whitespace-nowrap">
                        {product.msrp > product.yourPrice && (
                          <span className="block sm:inline sm:mr-3 text-kawai-charcoal/40 text-xs sm:text-sm line-through">
                            {formatPrice(product.msrp, product.currency)}
                          </span>
                        )}
                        <span
                          className="text-kawai-black"
                          style={{
                            fontFamily: 'var(--font-oswald), sans-serif',
                            fontSize: '1.2rem',
                          }}
                        >
                          {formatPrice(product.yourPrice, product.currency)}
                        </span>
                        {/* Mobile drops the Save column — restate it under the price */}
                        {saving > 0 && (
                          <span className="block sm:hidden text-kawai-red text-[0.7rem] font-semibold">
                            Save {formatPrice(saving, product.currency)}
                          </span>
                        )}
                      </span>

                      <svg
                        className="hidden sm:block w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-1 transition-all"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <RebateModelModal
        product={selected?.product ?? null}
        isOpen={selected !== null}
        categoryLabel={selected?.categoryLabel ?? ''}
        isShigeru={selected?.isShigeru ?? false}
        variant="campaign"
        onSignUp={() => {
          setSelected(null)
          onBook?.()
        }}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

/**
 * The program's terms, stated once. Both the section and the modal close on
 * this, so it lives beside the ledger rather than being retyped in each.
 */
export function RebateFootnote({
  locationName,
  dateRange,
  deadline,
  className = '',
}: {
  locationName?: string | null | undefined
  dateRange: string
  deadline: string
  className?: string
}) {
  return (
    <p className={`text-kawai-charcoal/50 text-xs leading-relaxed ${className}`}>
      Savings shown are off MSRP and include the additional rebate, taken off the price at the
      counter on qualifying new Kawai pianos
      {locationName
        ? ` at ${locationName.includes('Kawai') ? locationName : `Kawai ${locationName}`}`
        : ''}
      . Rebate amounts vary by model. Back to School program runs {dateRange}; rebates end{' '}
      {deadline}. 0% financing for 36 months is subject to credit approval. Trade-in bonus requires
      a written independent appraisal.
    </p>
  )
}
