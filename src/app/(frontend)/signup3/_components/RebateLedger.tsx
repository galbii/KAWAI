'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import RebateModelModal from '@/components/rebates/RebateModelModal'
import { RuledGround, BTS_CONTAINER, SectionHead, Reveal } from '@/components/back-to-school'
import { formatPrice } from '@/lib/utils'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'
import { rebatesCopy } from './campaign'
import { SignUpButton } from './CampaignCtas'
import { useOfferModal } from './OfferModalContext'

interface RebateLedgerProps {
  data: RebateCategory[]
}

type SelectedModel = { product: RebateProduct; categoryLabel: string; isShigeru: boolean }

/**
 * The rebate program as a price ledger — one line per model — instead of the
 * RebateSchedule product cards /signup2 uses. Eighteen photo cards with two
 * buttons each ran ~5,600px on desktop and ~10,000px on phones; a visitor
 * scanning for "what does the CA401 cost now" needs a table, not a catalog.
 * Photography lives in the detail modal, one tap away on every row.
 *
 * This is the Back to School ledger without the storefront: the closing CTA
 * opens the national dealer sign-up popup rather than a store's booking
 * calendar, and the footnote carries the Summer Savings terms. The section
 * furniture (ruled ground, SectionHead, row reveals) is the shared campaign
 * vocabulary, so the two pages read as one type system.
 *
 * Each row shows a single savings figure (MSRP − final price) so the math
 * reconciles with the two prices beside it; the breakdown is in the modal.
 */
export function RebateLedger({ data }: RebateLedgerProps) {
  const [selected, setSelected] = useState<SelectedModel | null>(null)
  const [activeSlug, setActiveSlug] = useState<string>('all')
  const filterBarRef = useRef<HTMLDivElement>(null)
  const offer = useOfferModal()

  // Sign-up from inside a model card: close the card first so the two dialogs
  // never stack, then open the offer popup.
  function signUpFromModel() {
    setSelected(null)
    offer.open()
  }

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

  return (
    <>
      <section
        id="rebates"
        className="relative bg-kawai-pearl border-t border-kawai-black/10 scroll-mt-24"
      >
        <RuledGround animate />

        <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
          <SectionHead
            eyebrow={rebatesCopy.eyebrow}
            title={rebatesCopy.headline}
            subhead={rebatesCopy.subhead}
            aside={rebatesCopy.aside}
            meta={`${visibleCount} ${visibleCount === 1 ? 'model' : 'models'}`}
            className="mb-10"
          />

          {/* Segmented category bar, fused to the top of the ledger. Sticky at
              70px — the site header is fixed at 71px tall, so the bar tucks in
              just under it and stays reachable while scrolling the table. It
              must live OUTSIDE the ledger's card or sticky would be inert. */}
          <div
            ref={filterBarRef}
            role="group"
            aria-label="Filter models by category"
            className="sticky top-[70px] z-20 grid bg-kawai-black shadow-[0_12px_28px_rgba(30,27,22,0.22)]"
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
                  className={`relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2.5 px-1 py-3.5 sm:py-5 uppercase border-r border-kawai-pearl/15 last:border-r-0 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kawai-red-400 ${
                    active
                      ? 'text-kawai-pearl'
                      : 'text-kawai-pearl/50 hover:text-kawai-pearl hover:bg-white/5'
                  }`}
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

          <div className="bg-white border border-kawai-black/12 border-t-0 shadow-[0_18px_50px_rgba(30,27,22,0.08)]">
            {visibleData.map((category) => (
              <div key={category.slug}>
                {/* The category name labels a group of rows, not a document
                    section — a heading per group would flood screen-reader
                    heading navigation (see the Accessibility notes). */}
                <div className="flex items-baseline justify-between gap-4 px-5 sm:px-8 py-3.5 bg-kawai-pearl border-y border-kawai-black/10">
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
                    {category.products.length}{' '}
                    {category.products.length === 1 ? 'model' : 'models'}
                  </span>
                </div>

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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      </Reveal>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mt-10">
            <div className="flex-shrink-0">
              <SignUpButton />
            </div>
            <p className="text-kawai-charcoal/50 text-xs leading-relaxed max-w-2xl">
              {rebatesCopy.disclaimer}
            </p>
          </div>
        </div>
      </section>

      <RebateModelModal
        product={selected?.product ?? null}
        isOpen={selected !== null}
        categoryLabel={selected?.categoryLabel ?? ''}
        isShigeru={selected?.isShigeru ?? false}
        variant="campaign"
        onSignUp={signUpFromModel}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
