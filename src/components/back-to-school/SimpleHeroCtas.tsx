'use client'

import { useState } from 'react'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import { RebateModal } from './RebateModal'

interface SimpleHeroCtasProps {
  rebates: RebateCategory[]
  locationName?: string | null
  bookHref?: string
}

/**
 * The simplified page's hero CTAs.
 *
 * The long page's pair sent one click into a booking modal and the other into a
 * scroll — so the catalog link spent the visitor's attention travelling. Here
 * the ask goes to the form waiting at the bottom of a short page, and the
 * catalog opens where they stand. Neither button takes them anywhere they have to find
 * their way back from.
 *
 * Its own RebateModal instance rather than a shared one: the modal renders
 * nothing at all while closed, so a second mount point costs nothing and saves
 * threading a context through the page for one boolean.
 */
export function SimpleHeroCtas({ rebates, locationName, bookHref = '#book' }: SimpleHeroCtasProps) {
  const [rebatesOpen, setRebatesOpen] = useState(false)

  function goToBooking() {
    document.querySelector(bookHref)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <a
          href={bookHref}
          className="group inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
        >
          Schedule a Tour
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </a>

        {rebates.length > 0 && (
          <button
            type="button"
            onClick={() => setRebatesOpen(true)}
            className="inline-flex items-center justify-center px-9 py-5 border border-kawai-pearl/45 text-kawai-pearl hover:bg-kawai-pearl hover:text-kawai-black text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-pearl"
          >
            Browse Catalog
          </button>
        )}
      </div>

      {/* Same friction-reducer the long page carries: the form is at the
          bottom of this one, so the line also says how far away it is. */}
      <p className="mt-4 text-sm text-kawai-pearl/60">
        Takes about a minute — pick a day and time that works. No obligation.
      </p>

      <RebateModal
        open={rebatesOpen}
        onClose={() => setRebatesOpen(false)}
        data={rebates}
        locationName={locationName ?? null}
        onBook={goToBooking}
      />
    </>
  )
}
