'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookingModal } from '@/components/trade-in/BookingModal'

interface CampaignNavigatorProps {
  storeslug: string
  calendlyUrl?: string | null
  locationName?: string | null
}

function SakuraBlossom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

const CAMPAIGNS = [
  {
    key: 'grand-spring-sale',
    href: (slug: string) => `/store/${slug}/grand-spring-sale`,
    label: 'Grand Spring Sale',
    benefit: '0% financing on all Grand and Baby Grand Pianos',
    tag: 'Financing',
  },
  {
    key: 'trade',
    href: (slug: string) => `/store/${slug}/trade`,
    label: '$500 Bonus',
    benefit: 'Up to $500 when you trade in any piano',
    tag: 'Trade-In',
  },
]

export function CampaignNavigator({ storeslug, calendlyUrl, locationName }: CampaignNavigatorProps) {
  const [open, setOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[9005] flex items-center gap-2.5 pl-3 pr-4 py-2.5 bg-white border border-kawai-neutral shadow-brand-premium hover:shadow-brand-medium hover:border-kawai-red/20 transition-all rounded-full group"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-label="View spring offers"
      >
        <SakuraBlossom className="w-5 h-5 text-kawai-red flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-kawai-black text-sm font-medium">Spring Offers</span>
        <div className="w-1.5 h-1.5 rounded-full bg-kawai-red animate-pulse flex-shrink-0" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9006] bg-kawai-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Spring offers"
              className="fixed bottom-0 left-0 right-0 sm:left-auto sm:bottom-6 sm:right-6 z-[9006] w-full sm:w-96 bg-white rounded-t-2xl sm:rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(30,27,22,0.18)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Handle (mobile sheet indicator) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-8 h-1 rounded-full bg-kawai-neutral" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-kawai-neutral/50">
                <div className="flex items-center gap-2">
                  <SakuraBlossom className="w-4 h-4 text-kawai-red" />
                  <span className="text-kawai-black font-semibold text-sm">Spring Offers</span>
                  <span className="text-kawai-charcoal/35 text-xs">· ends May 17</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-kawai-charcoal/35 hover:text-kawai-black hover:bg-kawai-neutral/40 transition-colors rounded-full"
                  aria-label="Close"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Campaign rows */}
              <div className="px-3 py-3 space-y-2">
                {CAMPAIGNS.map(({ key, href, label, benefit, tag }) => (
                  <a
                    key={key}
                    href={href(storeslug)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-3 px-4 py-4 rounded-lg border border-kawai-neutral/50 hover:border-kawai-red/30 hover:bg-kawai-pearl/60 transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[0.6rem] tracking-[0.15em] uppercase font-semibold text-kawai-charcoal/35">{tag}</span>
                      </div>
                      <p className="text-kawai-black text-sm font-semibold leading-tight">{label}</p>
                      <p className="text-kawai-red text-xs font-medium mt-0.5">{benefit}</p>
                    </div>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full border border-kawai-neutral/60 group-hover:border-kawai-red group-hover:bg-kawai-red flex items-center justify-center transition-all">
                      <svg className="w-3 h-3 text-kawai-charcoal/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>

              {/* Book Now CTA */}
              <div className="px-3 pb-3">
                <button
                  onClick={() => { setOpen(false); setBookingOpen(true) }}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm tracking-[0.15em] uppercase font-semibold transition-colors rounded-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span className="relative z-10">Book Now</span>
                  <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              {/* Footer */}
              <p className="text-kawai-charcoal/30 text-[0.65rem] text-center pb-4 pt-1 px-5">
                May 1–17, 2026 · Financing subject to credit approval
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
