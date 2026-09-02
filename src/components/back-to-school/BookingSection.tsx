'use client'

import { useEffect, useState } from 'react'
import { BookingModal } from './BookingModal'
import { DEADLINE_LONG, OFFER_PILLS, daysUntilDeadline } from './campaign'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { Reveal } from './Choreography'
import type { HoursEntry } from './schedule'

interface BookingSectionProps {
  locationName?: string | null
  hours?: HoursEntry[] | null
  storeslug: string
}

/**
 * The close. Everything above has argued the program; this asks for the visit
 * and names what the visitor gets for asking — the official invitation, which
 * is a real artifact (see the confirmation email in back-to-school-booking.ts),
 * not a figure of speech.
 *
 * The countdown restates the deadline as a count, which is the only new
 * information left to give.
 */
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

        <div className={`relative ${BTS_CONTAINER} py-20 md:py-32 text-center`}>
          <Reveal as="p" className="bts-eyebrow text-kawai-red-400 mb-8">
            {daysLeft !== null && daysLeft > 0
              ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} of the program left`
              : `Program ends ${DEADLINE_LONG}`}
          </Reveal>

          <h2 className="bts-display text-kawai-pearl mx-auto" style={{ fontSize: 'clamp(2.8rem, 9vw, 7rem)' }}>
            <Reveal as="span" variant="line" className="block" delay={0.06}>
              See you soon!
            </Reveal>
          </h2>

          <Reveal
            as="p"
            delay={0.16}
            className="bts-serif text-kawai-pearl/85 mt-6 max-w-2xl mx-auto"
            style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.8rem)', lineHeight: 1.35 }}
          >
            Book your appointment to receive an official invitation.
          </Reveal>

          <Reveal as="p" delay={0.24} className="text-kawai-pearl/60 text-base md:text-lg leading-relaxed max-w-xl mx-auto mt-8 mb-10">
            Pick a day and a time and the invitation lands in your inbox — the date, the address,
            and a link that drops it straight into your calendar. Tell us roughly what you&apos;re
            after and we&apos;ll have those pianos uncovered and in tune when you arrive
            {locationName ? <> at {locationName}</> : null}.
          </Reveal>

          <Reveal as="ul" delay={0.3} className="flex flex-wrap items-center justify-center gap-2.5 mb-11">
            {OFFER_PILLS.map((pill) => (
              <li
                key={pill}
                className="px-4 py-2 border border-kawai-pearl/25 text-kawai-pearl/70 text-xs tracking-[0.12em] uppercase"
              >
                {pill}
              </li>
            ))}
          </Reveal>

          <Reveal delay={0.36}>
            <button
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-3 px-11 py-6 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.22em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
            >
              Book an appointment
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Reveal>
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
