'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import RebateModelModal from '@/components/rebates/RebateModelModal'
import { BookingModal } from '@/components/trade-in/BookingModal'
import { formatPrice } from '@/lib/utils'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'
import { DEADLINE_LONG, DATE_RANGE } from './campaign'
import { RuledGround } from './RuledGround'

interface RebateSectionProps {
  data: RebateCategory[]
  locationName?: string | null
  calendlyUrl?: string | null
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
export function RebateSection({ data, locationName, calendlyUrl, storeslug }: RebateSectionProps) {
  const [selected, setSelected] = useState<SelectedModel | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  const modelCount = useMemo(
    () => data.reduce((n, category) => n + category.products.length, 0),
    [data],
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
              {modelCount} models · Rebates end {DEADLINE_LONG}
            </p>
          </div>

          <div className="bg-white border border-kawai-neutral/70 rounded-sm overflow-hidden shadow-[0_18px_50px_rgba(30,27,22,0.08)]">
            {data.map((category) => (
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
        calendlyUrl={calendlyUrl}
        locationName={locationName}
        storeslug={storeslug}
      />
    </>
  )
}
