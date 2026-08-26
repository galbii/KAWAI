'use client'

import { useEffect, useState } from 'react'
import { BookingModal } from '@/components/trade-in/BookingModal'
import { DEADLINE_SHORT, daysUntilDeadline } from './campaign'

interface DeadlineDockProps {
  storeslug: string
  locationName?: string | null
  calendlyUrl?: string | null
}

/**
 * A persistent countdown that books in one tap.
 *
 * The spring campaign's floating button opened a panel of links before it opened
 * anything useful. This one carries the single piece of information the page is
 * built around — how long is left — and its only action is the conversion.
 *
 * Visible only between the rebate ledger and the closing #book section: earlier
 * it sits on top of the hero calendar's circled deadline (the thing it restates),
 * and past #book it duplicates a full-size Book button 100px away.
 */
export function DeadlineDock({ storeslug, locationName, calendlyUrl }: DeadlineDockProps) {
  const [visible, setVisible] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    setDaysLeft(daysUntilDeadline())

    function onScroll() {
      const rebates = document.getElementById('rebates')
      const book = document.getElementById('book')
      const pastRebates = rebates
        ? rebates.getBoundingClientRect().top < window.innerHeight * 0.5
        : window.scrollY > window.innerHeight * 0.8
      const beforeBook = book ? book.getBoundingClientRect().top > window.innerHeight * 0.85 : true
      setVisible(pastRebates && beforeBook)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* bottom-24 on mobile clears the site's floating search pill */}
      <div
        className={`fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[9005] transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        aria-hidden={!visible}
      >
        {/* The border matters on the dark sections, where a bare kawai-black pill
            would dissolve into the background and leave the text floating. */}
        <div className="flex items-stretch bg-kawai-black border border-white/20 rounded-full overflow-hidden shadow-[0_10px_32px_rgba(30,27,22,0.32)]">
          <span className="flex items-center gap-2 pl-5 pr-4 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-kawai-red-400 flex-shrink-0" aria-hidden />
            <span className="text-kawai-pearl/85 text-xs tracking-[0.1em] whitespace-nowrap">
              {daysLeft !== null && daysLeft > 0
                ? `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`
                : `Ends ${DEADLINE_SHORT}`}
            </span>
          </span>

          <button
            onClick={() => setBookingOpen(true)}
            className="bg-kawai-red hover:bg-kawai-red-600 text-white text-xs tracking-[0.16em] uppercase font-semibold px-5 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            tabIndex={visible ? 0 : -1}
          >
            Book
          </button>
        </div>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        calendlyUrl={calendlyUrl}
        locationName={locationName}
        storeslug={storeslug}
      />
    </>
  )
}
