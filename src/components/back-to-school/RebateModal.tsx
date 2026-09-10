'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import { RebateLedger, RebateFootnote } from './RebateLedger'
import { OSWALD, CORMORANT, DEADLINE_LONG, DATE_RANGE } from './campaign'

/**
 * The rebate ledger, in a dialog.
 *
 * On the simplified page the amounts are proof, not the argument — a visitor
 * who wants to know what a CA401 costs should be able to check and come
 * straight back to the form, rather than scroll past eighteen rows on the way
 * to it. So the ledger stops being a section and becomes something you open.
 *
 * z-[9010]/[9011] matches BookingModal and deliberately sits under the shared
 * ui/modal stack (9100/9101) that RebateModelModal uses, so tapping a row still
 * opens its detail card on top of this one.
 */

interface RebateModalProps {
  open: boolean
  onClose: () => void
  data: RebateCategory[]
  locationName?: string | null
  /** Called when a visitor asks to book from a model card — closes and hands off. */
  onBook?: () => void
}

export function RebateModal({ open, onClose, data, locationName, onBook }: RebateModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // The ledger's bar sticks to the top of THIS scroll container, not the page,
  // so a category change rewinds the dialog rather than the document.
  const resetScroll = useCallback(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [])

  const handleBook = useCallback(() => {
    onClose()
    onBook?.()
  }, [onClose, onBook])

  if (!open || !mounted || data.length === 0) return null

  return createPortal(
    <>
      <div
        className="btsm-overlay fixed inset-0 z-[9010] bg-kawai-black/55 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <div
        className="fixed inset-0 z-[9011] flex items-center justify-center p-0 sm:p-6 lg:p-10 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Back to School rebates"
      >
        <div
          className="btsm-panel pointer-events-auto w-full max-w-[1040px] bg-kawai-pearl overflow-hidden shadow-[0_40px_100px_rgba(30,27,22,0.34),0_12px_32px_rgba(30,27,22,0.16)] flex flex-col"
          style={{ maxHeight: '100dvh', height: '100%' }}
        >
          <div className="h-[4px] bg-kawai-red flex-shrink-0" />

          {/* Header */}
          <div className="flex-shrink-0 px-5 sm:px-8 pt-5 pb-4 border-b border-kawai-black/10 bg-kawai-pearl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-px bg-kawai-red" aria-hidden />
                  <span
                    className="text-kawai-red uppercase"
                    style={{ fontFamily: OSWALD, fontSize: '0.62rem', letterSpacing: '0.24em' }}
                  >
                    Instant Rebates · Ends {DEADLINE_LONG}
                  </span>
                </div>
                <h2
                  className="text-kawai-black uppercase mt-3"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: 'clamp(1.6rem, 4.2vw, 2.25rem)',
                    fontWeight: 600,
                    lineHeight: 0.94,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Our Rebates
                </h2>
                <p
                  className="text-kawai-charcoal/65 mt-2"
                  style={{ fontFamily: CORMORANT, fontStyle: 'italic', fontSize: '1.02rem', lineHeight: 1.3 }}
                >
                  {visibleCount} {visibleCount === 1 ? 'model' : 'models'} — tap any one for the
                  full card.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-kawai-charcoal/45 hover:text-kawai-pearl hover:bg-kawai-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-red"
                aria-label="Close rebates"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Ledger */}
          <div ref={bodyRef} className="relative overflow-y-auto flex-1 px-0 sm:px-8 pb-8">
            <RebateLedger
              data={data}
              stickyTopPx={0}
              onResetScroll={resetScroll}
              onBook={handleBook}
              onVisibleCountChange={setVisibleCount}
            />
            <RebateFootnote
              locationName={locationName}
              dateRange={DATE_RANGE}
              deadline={DEADLINE_LONG}
              className="mt-7 px-5 sm:px-0"
            />
          </div>

          {/* The way back to the one thing this page asks for. */}
          <div className="flex-shrink-0 px-5 sm:px-8 py-4 border-t border-kawai-black/12 bg-white">
            <button
              onClick={handleBook}
              className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
            >
              Book an appointment
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
