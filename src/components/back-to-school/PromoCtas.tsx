'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookingModal } from './BookingModal'
import type { HoursEntry } from './schedule'

interface PromoCtasProps {
  storeslug: string
  locationName?: string | null
  hours?: HoursEntry[] | null
}

/**
 * CTA pair for the storefront promo. The campaign page leads — the visitor
 * hasn't seen the offer yet — with booking beside it, at the same weight, for
 * anyone who is already decided. Both are buttons: a text link next to a filled
 * one reads as an afterthought, and booking is the conversion.
 */
export function PromoCtas({ storeslug, locationName, hours }: PromoCtasProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <Link
          href={`/store/${storeslug}/back-to-school`}
          className="group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
        >
          Learn more
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center px-9 py-5 border border-kawai-pearl/45 text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
        >
          Book an appointment
        </button>
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
