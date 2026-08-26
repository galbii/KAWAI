'use client'

import { useState } from 'react'
import { TradeInCalculatorModal } from '@/components/trade-in/TradeInCalculatorModal'
import { RuledGround } from './RuledGround'

interface TradeInBandProps {
  phone?: string | null
  calendlyUrl?: string | null
  locationName?: string | null
}

/**
 * The trade-in offer, inverted to dark so it breaks the run of pearl sections
 * and echoes the calendar in the hero. Red text on this ground uses
 * kawai-red-400 — brand red is only ~3.6:1 on kawai-black (see CLAUDE.md).
 */
export function TradeInBand({ phone, calendlyUrl, locationName }: TradeInBandProps) {
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  return (
    <>
      <section className="relative bg-kawai-black overflow-hidden">
        <RuledGround tone="dark" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-20 md:py-24">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">

            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-6 h-px bg-kawai-red-400" aria-hidden />
                <span
                  className="text-kawai-red-400 uppercase"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.7rem', letterSpacing: '0.24em' }}
                >
                  Trade-In Bonus
                </span>
              </div>

              <h2
                className="text-kawai-pearl leading-[1.08] mb-5"
                style={{
                  fontFamily: 'var(--font-family-cormorant), Georgia, serif',
                  fontSize: 'clamp(1.9rem, 4vw, 3rem)',
                  fontWeight: 500,
                }}
              >
                The piano in the living room is worth more than you think.
              </h2>

              <p className="text-kawai-pearl/60 text-base md:text-lg leading-relaxed max-w-xl">
                Bring us any independent written appraisal and we&apos;ll beat it by{' '}
                <strong className="text-kawai-pearl font-semibold">$500</strong>, applied straight
                to your new Kawai. It stacks with the September rebate and with 0% financing — the
                trade-in is not an alternative to the sale price, it comes off on top of it.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-4 lg:items-end">
              <button
                onClick={() => setCalculatorOpen(true)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.14em] uppercase font-medium transition-colors rounded-sm w-full lg:w-auto"
              >
                Estimate my trade-in
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="text-center lg:text-right text-kawai-pearl/45 hover:text-kawai-red-400 text-sm transition-colors"
                >
                  Or call <span className="text-kawai-pearl/75">{phone}</span> for an estimate
                </a>
              )}
            </div>

          </div>
        </div>
      </section>

      <TradeInCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        phone={phone ?? null}
        calendlyUrl={calendlyUrl ?? null}
        locationName={locationName ?? null}
      />
    </>
  )
}
