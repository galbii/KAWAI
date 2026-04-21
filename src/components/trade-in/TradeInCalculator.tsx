'use client'

import { useState, useEffect, useRef } from 'react'
import type { GrandSaleProduct } from '@/lib/payload/queries'

interface TradeInCalculatorProps {
  products: GrandSaleProduct[]
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function useAnimatedValue(target: number, duration = 380) {
  const [current, setCurrent] = useState(target)
  const animRef = useRef<number | null>(null)
  const fromRef = useRef(target)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const start = fromRef.current
    const end = target
    const startTime = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setCurrent(Math.round(start + (end - start) * eased))
      if (t < 1) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [target, duration])

  return current
}

const APPRAISAL_MIN = 500
const APPRAISAL_MAX = 15000
const KAWAI_BONUS = 500
const FINANCING_MONTHS = 36

type FilterKey = 'all' | 'under-15k' | '15k-25k' | 'over-25k'
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'under-15k', label: 'Under $15k' },
  { key: '15k-25k', label: '$15k–$25k' },
  { key: 'over-25k', label: 'Over $25k' },
]
function matchesFilter(p: GrandSaleProduct, filter: FilterKey): boolean {
  const msrp = p.price?.msrp ?? 0
  if (filter === 'all') return true
  if (filter === 'under-15k') return msrp < 15000
  if (filter === '15k-25k') return msrp >= 15000 && msrp <= 25000
  if (filter === 'over-25k') return msrp > 25000
  return true
}

export function TradeInCalculator({ products }: TradeInCalculatorProps) {
  const grandProducts = products.filter((p) => (p.price?.msrp ?? 0) > 0)

  const defaultProduct = grandProducts[0] ?? null
  const [appraisalValue, setAppraisalValue] = useState(3500)
  const [selectedProductId, setSelectedProductId] = useState(defaultProduct?.id ?? '')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const selectedProduct = grandProducts.find((p) => p.id === selectedProductId) ?? defaultProduct
  const grandMsrp = selectedProduct?.price?.msrp ?? 9595

  const totalCredit = appraisalValue + KAWAI_BONUS
  const balance = Math.max(grandMsrp - totalCredit, 0)
  const monthly = balance > 0 ? Math.ceil(balance / FINANCING_MONTHS) : 0

  const animCredit = useAnimatedValue(totalCredit)
  const animBalance = useAnimatedValue(balance)
  const animMonthly = useAnimatedValue(monthly)

  const sliderPercent = ((appraisalValue - APPRAISAL_MIN) / (APPRAISAL_MAX - APPRAISAL_MIN)) * 100

  return (
    <section id="trade-calculator" className="bg-kawai-black/90 backdrop-blur-md py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-8 bg-kawai-red/40" />
          <span className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
            Your Trade-In Math
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — controls */}
          <div>
            <h2
              className="font-[family-name:var(--font-family-cormorant)] font-normal text-white mb-3 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              Run the numbers
              <br />
              <span className="text-kawai-pearl/40">before you come in.</span>
            </h2>
            <p className="text-kawai-pearl/45 text-base leading-relaxed mb-12">
              Use your best estimate for your piano&apos;s value. The actual appraisal happens
              in-store — this is just to show you what&apos;s possible.
            </p>

            {/* Appraisal value slider */}
            <div className="mb-10">
              <div className="flex justify-between items-baseline mb-4">
                <label className="text-kawai-pearl/50 text-sm tracking-wide">
                  My piano is worth approximately
                </label>
                <span
                  className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl"
                  style={{ fontSize: '1.75rem' }}
                >
                  {formatUSD(appraisalValue)}
                </span>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={APPRAISAL_MIN}
                  max={APPRAISAL_MAX}
                  step={100}
                  value={appraisalValue}
                  onChange={(e) => setAppraisalValue(Number(e.target.value))}
                  className="w-full h-1 appearance-none cursor-pointer rounded-none"
                  style={{
                    background: `linear-gradient(to right, #E11922 0%, #E11922 ${sliderPercent}%, rgba(255,255,255,0.1) ${sliderPercent}%, rgba(255,255,255,0.1) 100%)`,
                    // Thumb styling via global CSS is ideal; using inline style as fallback
                  }}
                />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #E11922;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 0 3px rgba(225,25,34,0.2);
                  }
                  input[type=range]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #E11922;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                  }
                `}</style>
              </div>
              <div className="flex justify-between text-kawai-pearl/25 text-xs mt-2">
                <span>{formatUSD(APPRAISAL_MIN)}</span>
                <span>{formatUSD(APPRAISAL_MAX)}</span>
              </div>
            </div>

            {/* Grand model selector */}
            {grandProducts.length > 0 && (
              <div>
                <label className="text-kawai-pearl/50 text-sm tracking-wide block mb-4">
                  I&apos;m interested in
                </label>

                {/* Price-range filter chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {FILTERS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveFilter(key)}
                      className={`px-3.5 py-1.5 text-xs tracking-[0.08em] uppercase rounded-sm border transition-colors ${
                        activeFilter === key
                          ? 'bg-kawai-red border-kawai-red text-white'
                          : 'bg-white/5 border-white/15 text-kawai-pearl/50 hover:border-white/30 hover:text-kawai-pearl/70'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Filtered product list */}
                <div className="space-y-1.5">
                  {grandProducts
                    .filter((p) => matchesFilter(p, activeFilter))
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-sm border text-left transition-colors ${
                          selectedProductId === p.id
                            ? 'bg-white/8 border-kawai-red/40 text-kawai-pearl'
                            : 'bg-white/3 border-white/8 text-kawai-pearl/60 hover:bg-white/5 hover:border-white/15 hover:text-kawai-pearl/80'
                        }`}
                      >
                        <span className="text-sm">{p.name ?? p.model}</span>
                        {p.price?.msrp ? (
                          <span className="flex items-baseline gap-1.5">
                            <span className="text-kawai-red text-[0.65rem] tracking-[0.12em] uppercase font-medium">MSRP</span>
                            <span className={`font-[family-name:var(--font-family-cormorant)] text-base tabular-nums ${selectedProductId === p.id ? 'text-kawai-pearl' : 'text-kawai-pearl/40'}`}>
                              {formatUSD(p.price.msrp)}
                            </span>
                          </span>
                        ) : null}
                      </button>
                    ))}
                  {grandProducts.filter((p) => matchesFilter(p, activeFilter)).length === 0 && (
                    <p className="text-kawai-pearl/30 text-sm py-2 px-1">No models in this range.</p>
                  )}
                  <button
                    onClick={() => setSelectedProductId('')}
                    className={`w-full flex items-center px-4 py-3 rounded-sm border text-left transition-colors ${
                      selectedProductId === ''
                        ? 'bg-white/8 border-kawai-red/40 text-kawai-pearl'
                        : 'bg-white/3 border-white/8 text-kawai-pearl/40 hover:bg-white/5 hover:border-white/15 hover:text-kawai-pearl/60'
                    }`}
                  >
                    <span className="text-sm">Not sure yet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — the ledger */}
          <div>
            <div
              className="border border-white/8 rounded-lg p-8 md:p-10"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              {/* Ledger header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/8">
                <span className="text-kawai-pearl/30 text-xs tracking-[0.3em] uppercase">
                  Trade-In Summary
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-kawai-red animate-pulse" />
              </div>

              {/* Line items */}
              <div className="space-y-0">
                {/* Appraisal */}
                <div className="flex justify-between items-baseline py-3.5 border-b border-white/5">
                  <span className="text-kawai-pearl/45 text-sm">Your piano (estimated)</span>
                  <span className="text-kawai-pearl/70 font-[family-name:var(--font-family-cormorant)] text-xl tabular-nums">
                    {formatUSD(appraisalValue)}
                  </span>
                </div>

                {/* Bonus */}
                <div className="flex justify-between items-baseline py-3.5 border-b border-white/5">
                  <div>
                    <span className="text-kawai-pearl/45 text-sm">Kawai Spring bonus</span>
                    <span className="ml-2 text-kawai-red/60 text-xs">ends May 17</span>
                  </div>
                  <span className="text-kawai-pearl/70 font-[family-name:var(--font-family-cormorant)] text-xl tabular-nums">
                    + {formatUSD(KAWAI_BONUS)}
                  </span>
                </div>

                {/* Total credit */}
                <div className="flex justify-between items-baseline py-4 border-b border-kawai-gold/20 mb-1">
                  <span className="text-kawai-pearl/70 text-sm font-medium">Total trade-in credit</span>
                  <span
                    className="font-[family-name:var(--font-family-cormorant)] text-kawai-gold"
                    style={{ fontSize: '1.6rem' }}
                  >
                    {formatUSD(animCredit)}
                  </span>
                </div>

                {/* Grand price */}
                {selectedProduct && (
                  <>
                    <div className="flex justify-between items-baseline py-3.5 border-b border-white/5 mt-1">
                      <span className="text-kawai-pearl/45 text-sm">
                        {selectedProduct.name ?? selectedProduct.model}
                      </span>
                      <span className="text-kawai-pearl/70 font-[family-name:var(--font-family-cormorant)] text-xl tabular-nums">
                        {formatUSD(grandMsrp)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline py-3.5 border-b border-white/5">
                      <span className="text-kawai-pearl/45 text-sm">After your trade-in</span>
                      <span className="text-kawai-pearl/70 font-[family-name:var(--font-family-cormorant)] text-xl tabular-nums">
                        − {formatUSD(Math.min(totalCredit, grandMsrp))}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline py-4 border-b border-white/10 mb-1">
                      <span className="text-kawai-pearl/70 text-sm font-medium">Balance</span>
                      <span
                        className="font-[family-name:var(--font-family-cormorant)] text-white"
                        style={{ fontSize: '1.6rem' }}
                      >
                        {formatUSD(animBalance)}
                      </span>
                    </div>
                  </>
                )}

                {/* Monthly payment — the reveal */}
                <div className="pt-5">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-kawai-pearl/40 text-xs tracking-wide mb-1">
                        0% financing / 36 months
                      </div>
                      <div className="text-kawai-pearl/60 text-sm">Your monthly payment</div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-[family-name:var(--font-family-cormorant)] text-kawai-red leading-none tabular-nums"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
                      >
                        {monthly === 0 ? '$0' : formatUSD(animMonthly)}
                      </div>
                      {monthly > 0 && (
                        <div className="text-kawai-pearl/30 text-xs mt-1">/month†</div>
                      )}
                      {monthly === 0 && (
                        <div className="text-kawai-red/50 text-xs mt-1">Fully covered by trade-in</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href="#appraisal-form"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('appraisal-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="mt-8 w-full flex items-center justify-between px-6 py-4 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm tracking-[0.08em] uppercase font-medium transition-colors rounded-sm group"
              >
                <span>Begin appraisal request</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

            {/* Disclaimer */}
            <p className="text-kawai-pearl/20 text-xs mt-4 leading-relaxed">
              †Estimates are illustrative. Trade-in value based on in-store certified appraisal.
              0% APR / 36-month financing subject to credit approval.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
