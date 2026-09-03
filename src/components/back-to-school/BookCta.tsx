'use client'

import { useState } from 'react'
import { BookingModal } from './BookingModal'
import type { HoursEntry } from './schedule'

interface BookCtaProps {
  storeslug: string
  locationName?: string | null | undefined
  hours?: HoursEntry[] | null | undefined
  /** Override where the section needs to name the action differently. */
  label?: string
  /** 'dark' when the button sits on kawai-black rather than the paper. */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * The page's one conversion, on its own.
 *
 * The other CTA components on this page are pairs — a primary beside a matched
 * secondary — which is right where the visitor still has somewhere else to go.
 * Under a section that has just finished explaining itself there is nowhere
 * else to send them, so this is the button alone.
 *
 * A client island rather than a prop on the section: it exists so the sections
 * that use it can stay server-rendered, with only the modal's state on the
 * client.
 */
export function BookCta({
  storeslug,
  locationName,
  hours,
  label = 'Book an appointment',
  tone = 'light',
  className = '',
}: BookCtaProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
          tone === 'dark' ? 'focus-visible:outline-kawai-pearl' : 'focus-visible:outline-kawai-black'
        } ${className}`}
      >
        {label}
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </button>

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
