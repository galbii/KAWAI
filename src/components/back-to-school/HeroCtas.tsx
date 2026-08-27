'use client'

import { useState } from 'react'
import { BookingModal } from './BookingModal'
import type { HoursEntry } from './schedule'

interface HeroCtasProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * Hero CTA pair — booking is the primary action and opens the campaign booking
 * modal in place; the rebate ledger further down the page is the secondary,
 * reached by anchor.
 */
export function HeroCtas({ storeslug, locationName, hours }: HeroCtasProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.14em] uppercase font-medium transition-colors rounded-sm"
        >
          Book an appointment
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
        <a
          href="#rebates"
          className="inline-flex items-center justify-center sm:justify-start gap-2 text-kawai-black/70 hover:text-kawai-red text-sm tracking-[0.1em] uppercase font-medium underline underline-offset-4 decoration-kawai-black/25 hover:decoration-kawai-red transition-colors"
        >
          Or see the rebates
        </a>
      </div>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        storeslug={storeslug}
        locationName={locationName}
        hours={hours}
      />
    </>
  )
}
