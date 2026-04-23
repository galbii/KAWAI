'use client'

import { useState } from 'react'
import { TradeInCalculatorModal } from '@/components/trade-in/TradeInCalculatorModal'

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

interface TradeInBannerProps {
  storeslug: string
  phone?: string | null
  calendlyUrl?: string | null
  locationName?: string | null
}

export function TradeInBanner({ storeslug: _, phone, calendlyUrl, locationName }: TradeInBannerProps) {
  const [calculatorOpen, setCalculatorOpen] = useState(false)

  return (
    <>
      <section className="border-y border-white/20 py-14 md:py-18">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl bg-white/30 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-8 py-10 md:px-12 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14">

            {/* Icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-kawai-black/8 border border-kawai-black/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-kawai-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
              </svg>
            </div>

            {/* Copy */}
            <div className="flex-1 min-w-0">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <SakuraIcon className="w-3.5 h-3.5 text-kawai-red/70" />
                <p className="text-kawai-red/70 text-xs tracking-[0.2em] uppercase font-semibold">
                  Trade-In Offer
                </p>
              </div>

              {/* Heading */}
              <h3 className="text-3xl md:text-[2.75rem] font-semibold font-[family-name:var(--font-brand-serif)] text-kawai-black leading-tight mb-4">
                Already have a piano? It&apos;s worth more here.
              </h3>

              {/* Body */}
              <p className="text-kawai-charcoal/80 text-lg leading-relaxed mb-5">
                We&apos;ll give you <strong className="text-kawai-black font-bold">$500 over any independent appraisal</strong>{' '}
                toward your new Kawai grand. No gimmicks — just a fair trade that makes upgrading easier.
              </p>

              {/* Best Price Guaranteed tag */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kawai-red text-white text-[0.65rem] tracking-[0.18em] uppercase font-semibold rounded-sm">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
                Best Price Guaranteed
              </span>
            </div>

            {/* CTA column */}
            <div className="flex-shrink-0 flex flex-col items-start md:items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setCalculatorOpen(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-kawai-black hover:bg-kawai-charcoal text-white text-sm tracking-[0.1em] uppercase font-semibold transition-colors rounded-sm whitespace-nowrap group w-full md:w-auto justify-between md:justify-start"
              >
                Calculate Bonus
                <div className="w-6 h-6 rounded-full border border-white/25 group-hover:border-white/50 group-hover:bg-white/10 flex items-center justify-center transition-all">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </button>

              {/* Phone sub-link */}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-kawai-charcoal/60 hover:text-kawai-red transition-colors group"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-kawai-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span className="text-sm">
                    Call <span className="font-medium text-kawai-charcoal/80 group-hover:text-kawai-red transition-colors">{phone}</span> to get an estimate
                  </span>
                </a>
              )}
            </div>

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
