'use client'

import { useEffect, useState } from 'react'
import { BookingModal } from './BookingModal'
import { DEADLINE_LONG, OFFER_PILLS, daysUntilDeadline } from './campaign'
import { RuledGround } from './RuledGround'
import type { HoursEntry } from './schedule'

interface BookingSectionProps {
  locationName?: string | null
  hours?: HoursEntry[] | null
  storeslug: string
}

/** Closing CTA. Restates the deadline as a count, which is the only new information left to give. */
export function BookingSection({ locationName, hours, storeslug }: BookingSectionProps) {
  const [open, setOpen] = useState(false)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    setDaysLeft(daysUntilDeadline())
  }, [])

  return (
    <>
      <section id="book" className="relative bg-kawai-black overflow-hidden scroll-mt-24">
        <RuledGround tone="dark" marginRule={false} />

        <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">

          <span
            className="block text-kawai-red-400 uppercase mb-7"
            style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.72rem', letterSpacing: '0.28em' }}
          >
            {daysLeft !== null && daysLeft > 0
              ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} of the program left`
              : `Program ends ${DEADLINE_LONG}`}
          </span>

          <h2
            className="text-kawai-pearl leading-[1.08] mb-6"
            style={{
              fontFamily: 'var(--font-family-cormorant), Georgia, serif',
              fontSize: 'clamp(2.1rem, 5vw, 3.4rem)',
              fontWeight: 500,
            }}
          >
            Pick a time and come play a few.
          </h2>

          <p className="text-kawai-pearl/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-11">
            Tell us roughly what you&apos;re after and we&apos;ll have the right instruments
            uncovered and in tune when you arrive
            {locationName ? <> at {locationName}</> : null}. Nothing to sign, no obligation —
            the rebate is held for you either way until {DEADLINE_LONG}.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-2.5 mb-11">
            {OFFER_PILLS.map((pill) => (
              <li
                key={pill}
                className="px-4 py-2 rounded-full border border-white/20 text-kawai-pearl/70 text-xs tracking-[0.12em] uppercase"
              >
                {pill}
              </li>
            ))}
          </ul>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 px-10 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-medium transition-colors rounded-sm"
          >
            Book an appointment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>

        </div>
      </section>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        locationName={locationName}
        hours={hours}
        storeslug={storeslug}
      />
    </>
  )
}
