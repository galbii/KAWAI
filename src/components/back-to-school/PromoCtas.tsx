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
 * CTA pair for the storefront promo section. The campaign page is the primary
 * action — the visitor hasn't seen the offer yet, so "Learn more" leads —
 * with a direct "Book now" text link for the already-decided, which opens the
 * campaign booking modal right here.
 */
export function PromoCtas({ storeslug, locationName, hours }: PromoCtasProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <Link
          href={`/store/${storeslug}/back-to-school`}
          className="inline-flex items-center gap-3 px-9 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-medium transition-colors rounded-sm"
        >
          Learn more
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="text-kawai-black/70 hover:text-kawai-red text-sm tracking-[0.1em] uppercase font-medium underline underline-offset-4 decoration-kawai-black/25 hover:decoration-kawai-red transition-colors"
        >
          Book now
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
