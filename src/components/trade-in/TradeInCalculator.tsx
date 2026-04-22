'use client'

import { useState } from 'react'
import type { GrandSaleProduct } from '@/lib/payload/queries'
import { BookingModal } from './BookingModal'

interface TradeInCalculatorProps {
  products: GrandSaleProduct[]
  calendlyUrl?: string | null
  locationName?: string | null
  storeslug?: string | null
}

function formatUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const APPRAISAL_MIN = 500
const APPRAISAL_MAX = 15000
const KAWAI_BONUS = 500

export function TradeInCalculator({ products: _, calendlyUrl, locationName, storeslug }: TradeInCalculatorProps) {
  const [appraisalValue, setAppraisalValue] = useState(3500)
  const [modalOpen, setModalOpen] = useState(false)

  const total = appraisalValue + KAWAI_BONUS
  const sliderPct = ((appraisalValue - APPRAISAL_MIN) / (APPRAISAL_MAX - APPRAISAL_MIN)) * 100

  return (
    <section id="trade-calculator" className="bg-kawai-black/90 backdrop-blur-md py-24 md:py-36">
      <style>{`
        .tc-range { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; border-radius: 0; cursor: pointer; outline: none; }
        .tc-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%;
          background: #E11922; margin-top: -13px; cursor: pointer;
          box-shadow: 0 0 0 4px rgba(225,25,34,0.18), 0 0 18px rgba(225,25,34,0.4);
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .tc-range:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 7px rgba(225,25,34,0.18), 0 0 28px rgba(225,25,34,0.55);
          transform: scale(1.1);
        }
        .tc-range::-moz-range-thumb {
          width: 28px; height: 28px; border-radius: 50%; background: #E11922; border: none;
          box-shadow: 0 0 0 4px rgba(225,25,34,0.18);
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-8 bg-kawai-red/35" />
          <span className="text-kawai-red/45 text-sm tracking-[0.3em] uppercase font-medium">
            Calculate Your Bonus
          </span>
        </div>

        {/* Slider section */}
        <div className="mb-16">
          <p className="text-kawai-pearl/30 text-sm tracking-[0.25em] uppercase text-center mb-10">
            What is your piano estimated at?
          </p>

          <div
            className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl tabular-nums leading-none text-center mb-12"
            style={{ fontSize: 'clamp(6rem, 18vw, 12rem)' }}
          >
            {formatUSD(appraisalValue)}
          </div>

          <input
            type="range"
            min={APPRAISAL_MIN}
            max={APPRAISAL_MAX}
            step={100}
            value={appraisalValue}
            onChange={(e) => setAppraisalValue(Number(e.target.value))}
            className="tc-range mb-4"
            style={{
              background: `linear-gradient(to right, #E11922 ${sliderPct}%, rgba(255,255,255,0.08) ${sliderPct}%)`,
            }}
          />
          <div className="flex justify-between text-kawai-pearl/30 text-sm tracking-wide">
            <span>{formatUSD(APPRAISAL_MIN)}</span>
            <span>{formatUSD(APPRAISAL_MAX)}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="border-t border-white/8 pt-12 space-y-5 mb-12">
          <div className="flex items-baseline justify-between">
            <span className="text-kawai-pearl/40 text-lg">Your piano estimate</span>
            <span
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-pearl/60 tabular-nums"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
            >
              {formatUSD(appraisalValue)}
            </span>
          </div>

          <div className="flex items-baseline justify-between py-5 px-5 -mx-5 rounded-sm"
            style={{ background: 'rgba(225,25,34,0.07)' }}>
            <span className="text-kawai-red/80 text-lg font-medium">Kawai Spring Bonus</span>
            <span
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-red tabular-nums"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
            >
              + {formatUSD(KAWAI_BONUS)}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-6 border-t border-white/8">
            <span className="text-kawai-pearl/50 text-base tracking-[0.2em] uppercase">Total trade-in credit</span>
            <span
              className="font-[family-name:var(--font-family-cormorant)] text-kawai-gold tabular-nums leading-none"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
            >
              {formatUSD(total)}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-kawai-pearl/30 text-sm text-center leading-relaxed mb-12 italic font-[family-name:var(--font-family-cormorant)]">
          Pianos will be appraised in the store based on market value and condition — Estimation may differ.
        </p>

        {/* CTA */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-between px-8 py-6 bg-kawai-red hover:bg-kawai-red/90 text-white text-base tracking-[0.2em] uppercase font-medium transition-colors group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          <span className="relative z-10">Claim Your Bonus</span>
          <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>

      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        calendlyUrl={calendlyUrl}
        locationName={locationName}
        storeslug={storeslug}
      />
    </section>
  )
}
