'use client'

import { useState } from 'react'
import { BookingModal } from './BookingModal'
import type { HoursEntry } from './schedule'

interface HeroCtasProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
  /** 'dark' when the row sits over the hero video rather than on the paper. */
  tone?: 'light' | 'dark'
}

/**
 * The hero's CTA pair. Booking is the primary action and opens the campaign
 * booking modal in place; "Learn more" is a matched secondary that drops the
 * visitor into the rebate ledger.
 *
 * Both are the same size and shape — a text link beside a filled button reads
 * as an afterthought, and the ledger is where most of the page's argument is.
 */
export function HeroCtas({ storeslug, locationName, hours, tone = 'light' }: HeroCtasProps) {
  const [open, setOpen] = useState(false)

  const secondary =
    tone === 'dark'
      ? 'border-kawai-pearl/45 text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black focus-visible:outline-kawai-pearl'
      : 'border-kawai-black/30 text-kawai-black hover:bg-kawai-black hover:text-kawai-pearl focus-visible:outline-kawai-black'

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
        >
          Book an appointment
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <a
          href="#rebates"
          className={`inline-flex items-center justify-center px-9 py-5 border text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${secondary}`}
        >
          Learn more
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
