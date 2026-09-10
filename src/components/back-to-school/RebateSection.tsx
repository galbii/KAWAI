'use client'

import { useCallback, useState } from 'react'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import { BookingModal } from './BookingModal'
import { RebateLedger, RebateFootnote } from './RebateLedger'
import { DEADLINE_LONG, DATE_RANGE } from './campaign'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import type { HoursEntry } from './schedule'

interface RebateSectionProps {
  data: RebateCategory[]
  locationName?: string | null
  hours?: HoursEntry[] | null
  storeslug: string
}

/**
 * The rebate ledger in the page's flow: heading, table, then the ask and the
 * program's terms.
 *
 * The table itself is {@link RebateLedger} — /back-to-school2 shows the same
 * one inside a modal, so the only thing this file decides is how it is framed
 * and where booking happens from.
 */
export function RebateSection({ data, locationName, hours, storeslug }: RebateSectionProps) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)

  const openBooking = useCallback(() => setBookingOpen(true), [])
  // The bar sticks under the fixed 71px site header, so a category change made
  // while it is stuck returns the visitor to the top of the section.
  const resetScroll = useCallback(() => {
    document.getElementById('rebates')?.scrollIntoView({ behavior: 'auto' })
  }, [])

  if (data.length === 0) return null

  return (
    <>
      <section
        id="rebates"
        className="relative bg-kawai-pearl border-t border-kawai-black/10 scroll-mt-24"
      >
        <RuledGround animate />

        <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
          <SectionHead
            eyebrow="Instant Rebates"
            title="Our Rebates"
            subhead="Up to $4,500 across new digital, upright, and grand pianos"
            meta={`${visibleCount} ${visibleCount === 1 ? 'model' : 'models'} · Ends ${DEADLINE_LONG}`}
            className="mb-10"
          />

          <RebateLedger
            data={data}
            stickyTopPx={70}
            onResetScroll={resetScroll}
            onBook={openBooking}
            onVisibleCountChange={setVisibleCount}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mt-10">
            <button
              onClick={openBooking}
              className="group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
            >
              Book an appointment
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <RebateFootnote
              locationName={locationName}
              dateRange={DATE_RANGE}
              deadline={DEADLINE_LONG}
              className="max-w-2xl"
            />
          </div>
        </div>
      </section>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        locationName={locationName}
        hours={hours}
        storeslug={storeslug}
      />
    </>
  )
}
