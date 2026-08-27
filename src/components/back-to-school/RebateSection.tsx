'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import RebateModelModal from '@/components/rebates/RebateModelModal'
import { BookingModal } from './BookingModal'
import { formatPrice } from '@/lib/utils'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'
import { DEADLINE_LONG, DATE_RANGE } from './campaign'
import { RuledGround } from './RuledGround'
import type { HoursEntry } from './schedule'

interface RebateSectionProps {
  data: RebateCategory[]
  locationName?: string | null
  hours?: HoursEntry[] | null
  storeslug: string
}

type SelectedModel = { product: RebateProduct; categoryLabel: string; isShigeru: boolean }

/**
 * The rebate program as a price ledger — one line per model — instead of the
 * shared RebateSchedule's full product cards. Eighteen photo cards with two
 * buttons each ran ~5,600px on desktop and ~10,000px on phones; a family
 * scanning for "what does the CA401 cost now" needs a table, not a catalog.
 * Photography lives in the detail modal, one tap away on every row.
 *
 * Each row shows a single savings figure (MSRP − final price) so the math
 * reconciles with the two prices beside it; the instant-rebate breakdown is in
 * the modal and the footnote.
 */
export function RebateSection({ data, locationName, hours, storeslug }: RebateSectionProps) {
  const [selected, setSelected] = useState<SelectedModel | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [activeSlug, setActiveSlug] = useState<string>('all')
  const filterBarRef = useRef<HTMLDivElement>(null)

  // Switching to a shorter category while deep in the table would strand the
  // visitor below it — snap back to the top of the ledger whenever the bar is
  // in its stuck state (i.e. they've scrolled into the list).
  function selectCategory(slug: string) {
    setActiveSlug(slug)
    const bar = filterBarRef.current
    if (bar && bar.getBoundingClientRect().top <= 72) {
      document.getElementById('rebates')?.scrollIntoView({ behavior: 'auto' })
    }
  }

  // Category filter + cheapest-first sort. 'all' keeps every group visible so
  // the ledger still reads as the full program at a glance.
  const visibleData = useMemo(() => {
    const filtered = activeSlug === 'all' ? data : data.filter((c) => c.slug === activeSlug)
    return filtered.map((category) => ({
      ...category,
      products: [...category.products].sort((a, b) => a.yourPrice - b.yourPrice),
    }))
  }, [data, activeSlug])

  const visibleCount = useMemo(
    () => visibleData.reduce((n, category) => n + category.products.length, 0),
    [visibleData],
  )

  if (data.length === 0) return null

  function openBooking() {
    setSelected(null)
    setBookingOpen(true)
  }

  return (
    <>
      <section
        id="rebates"
        className="relative bg-kawai-pearl border-t border-kawai-black/10 scroll-mt-24"
      >
        <RuledGround />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-kawai-red" aria-hidden />
            <span
              className="text-kawai-charcoal/50 uppercase"
              style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.24em',
              }}
            >
              Instant Rebates
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 mb-10">
            <h2
              className="text-kawai-black leading-[1.1]"
              style={{
                fontFamily: 'var(--font-family-cormorant), Georgia, serif',
                fontSize: 'clamp(1.9rem, 4vw, 2.8rem)',
                fontWeight: 500,
              }}
            >
              Every model in the program.
            </h2>
            <p
              className="text-kawai-red uppercase pb-1.5"
              style={{
                fontFamily: 'var(--font-oswald), sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
              }}
            >
              {visibleCount} {visibleCount === 1 ? 'model' : 'models'} · Rebates end {DEADLINE_LONG}
            </p>
          </div>

          {/* Segmented category bar, fused to the top of the ledger. Sticky at
              70px — the site header is fixed at 71px tall, so the bar tucks in
              just under it and stays reachable while scrolling the table. It
              must live OUTSIDE the ledger's overflow-hidden card or sticky
              would be inert. */}
          <div
            ref={filterBarRef}
            role="group"
            aria-label="Filter models by category"
            className="sticky top-[70px] z-20 grid bg-white border border-kawai-neutral/70 rounded-t-sm overflow-hidden shadow-[0_10px_24px_rgba(30,27,22,0.10)]"
            style={{ gridTemplateColumns: `repeat(${data.length + 1}, minmax(0, 1fr))` }}
          >
            {[
              { slug: 'all', label: 'All', count: data.reduce((n, c) => n + c.products.length, 0) },
              ...data.map((c) => ({ slug: c.slug, label: c.label, count: c.products.length })),
            ].map((tab) => {
              const active = activeSlug === tab.slug
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => selectCategory(tab.slug)}
                  aria-pressed={active}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1 py-3 sm:py-4 uppercase border-r border-kawai-neutral/60 last:border-r-0 transition-colors ${
                    active
                      ? 'bg-kawai-black text-kawai-pearl'
                      : 'bg-white text-kawai-charcoal/70 hover:bg-kawai-pearl/70 hover:text-kawai-black'
                  }`}
                  style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.7rem', letterSpacing: '0.14em' }}
                >
                  {tab.label}
                  <span
                    className={active ? 'text-kawai-red-400' : 'text-kawai-charcoal/40'}
                    style={{ fontSize: '0.66rem' }}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="bg-white border border-t-0 border-kawai-neutral/70 rounded-b-sm overflow-hidden shadow-[0_18px_50px_rgba(30,27,22,0.08)]">
            {visibleData.map((category) => (
              <div key={category.slug}>
                <h3 className="flex items-baseline justify-between gap-4 px-5 sm:px-8 py-3 bg-kawai-pearl/70 border-b border-kawai-neutral/60">
                  <span
                    className="text-kawai-black uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald), sans-serif',
                      fontSize: '0.8rem',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {category.label}
                  </span>
                  <span className="text-kawai-charcoal/45 text-xs tracking-[0.12em] uppercase">
                    {category.products.length} {category.products.length === 1 ? 'model' : 'models'}
                  </span>
                </h3>

                <ul>
                  {category.products.map((product) => {
                    const saving = Math.max(product.msrp - product.yourPrice, 0)
                    return (
                      <li key={product.slug} className="border-b border-kawai-neutral/50 last:border-b-0">
                        <button
                          onClick={() =>
                            setSelected({
                              product,
                              categoryLabel: category.label,
                              isShigeru: category.slug === 'shigeru',
                            })
                          }
                          className="group w-full grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_minmax(0,1.4fr)_auto_minmax(0,1fr)_auto] items-center gap-x-4 sm:gap-x-6 px-5 sm:px-8 py-3.5 text-left hover:bg-kawai-pearl/60 focus-visible:bg-kawai-pearl/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kawai-red transition-colors"
                        >
                          <span
                            className="relative w-12 h-12 flex-shrink-0 bg-kawai-pearl/60 rounded-sm overflow-hidden"
                            aria-hidden
                          >
                            {product.imageUrl && (
                              <Image
                                src={product.imageUrl}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-contain"
                              />
                            )}
                          </span>

                          <span className="min-w-0">
                            <span
                              className="block text-kawai-black leading-tight"
                              style={{
                                fontFamily: 'var(--font-oswald), sans-serif',
                                fontSize: '1.05rem',
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

                          <span className="hidden sm:block text-kawai-red text-sm font-semibold whitespace-nowrap">
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
                                fontSize: '1.05rem',
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
                            className="hidden sm:block w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mt-8">
            <button
              onClick={openBooking}
              className="inline-flex items-center justify-center px-8 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.14em] uppercase font-medium transition-colors rounded-sm flex-shrink-0"
            >
              Book an appointment
            </button>
            <p className="text-kawai-charcoal/50 text-xs leading-relaxed max-w-2xl">
              Savings shown are off MSRP and include the instant rebate, taken off the price at the
              counter on qualifying new Kawai pianos
              {locationName ? ` at ${locationName}` : ''}. Back to School program runs {DATE_RANGE};
              rebates end {DEADLINE_LONG}. 0% financing for 36 months is subject to credit approval.
              Trade-in bonus requires a written independent appraisal.
            </p>
          </div>
        </div>
      </section>

      <RebateModelModal
        product={selected?.product ?? null}
        isOpen={selected !== null}
        categoryLabel={selected?.categoryLabel ?? ''}
        isShigeru={selected?.isShigeru ?? false}
        onSignUp={openBooking}
        onClose={() => setSelected(null)}
      />

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        locationName={locationName}
        hours={hours}
        storeslug={storeslug}
      />
    </>
  )
}
