'use client'

import { useState } from 'react'
import { BookingModal } from '@/components/trade-in/BookingModal'

interface GrandSpringBookingProps {
  locationName?: string | null
  calendlyUrl?: string | null
  storeslug?: string | null
}

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

export function GrandSpringBooking({ locationName, calendlyUrl, storeslug }: GrandSpringBookingProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="grand-lead-form" className="border-t border-white/10 py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-10 bg-kawai-red/40" />
            <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
            <div className="h-px w-10 bg-kawai-red/40" />
          </div>

          {/* Heading */}
          <h2
            className="font-[family-name:var(--font-family-cormorant)] font-normal text-kawai-black leading-tight mb-6"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
          >
            Ready to play one?
          </h2>

          <p className="text-kawai-charcoal/65 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12">
            Book an appointment and lock in your 0% financing, $500 trade-in bonus, and any in-store discounts before the offer ends May 17th.
          </p>

          {/* Offer pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              '0% financing · 36 months',
              '+$500 trade-in bonus',
              'Ends May 17, 2026',
            ].map((pill) => (
              <span
                key={pill}
                className="px-4 py-1.5 rounded-full border border-kawai-black/15 text-kawai-black/50 text-xs tracking-[0.15em] uppercase font-medium"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 px-10 py-5 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm tracking-[0.2em] uppercase font-medium transition-colors rounded-sm shadow-[0_4px_24px_rgba(225,25,34,0.35)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <span className="relative z-10">Book an Appointment</span>
            <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <p className="text-kawai-black/30 text-xs mt-5 tracking-wide">
            No commitment required — just come play.
          </p>

        </div>
      </section>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        calendlyUrl={calendlyUrl}
        locationName={locationName}
        storeslug={storeslug}
      />
    </>
  )
}
