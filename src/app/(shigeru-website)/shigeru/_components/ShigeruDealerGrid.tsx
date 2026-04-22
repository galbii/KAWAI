'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// next/dynamic with ssr:false is required — MapLibre GL uses browser APIs
// that don't exist in Node.js. React.lazy does NOT bypass SSR in Next.js.
const ShigeruDealerMap = dynamic(() => import('./ShigeruDealerMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full bg-[#0e0e0e] border border-white/[0.06] flex items-center justify-center"
      style={{ height: '480px', borderRadius: '12px' }}
    >
      <span
        style={{ fontFamily: 'var(--font-oswald)', color: 'rgba(213,199,140,0.35)', fontSize: '11px', letterSpacing: '0.2em' }}
        className="uppercase"
      >
        Loading map…
      </span>
    </div>
  ),
})

export interface ShigeruDealerDoc {
  id: string
  dealerName: string
  isFeatured?: boolean | null
  description?: string | null
  address?: {
    street?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
  } | null
  contactInfo?: {
    phone?: string | null
    website?: string | null
    email?: string | null
  } | null
  coordinates?: {
    latitude?: number | null
    longitude?: number | null
  } | null
}

type Region = 'all' | 'us' | 'canada'

const f = { fontFamily: 'var(--font-oswald)' }

function DealerCard({ dealer }: { dealer: ShigeruDealerDoc }) {
  const city = dealer.address?.city
  const state = dealer.address?.state
  const location = [city, state].filter(Boolean).join(', ')
  const phone = dealer.contactInfo?.phone
  const website = dealer.contactInfo?.website

  return (
    <div
      className={[
        'group relative bg-[#0e0e0e] border transition-colors duration-300 p-6 flex flex-col gap-4',
        dealer.isFeatured
          ? 'border-kawai-gold/25 hover:border-kawai-gold/55'
          : 'border-white/[0.06] hover:border-white/[0.14]',
      ].join(' ')}
    >
      {dealer.isFeatured && (
        <span
          style={{ ...f, fontSize: '9px', letterSpacing: '0.3em' }}
          className="absolute top-4 right-4 text-kawai-gold/60 uppercase"
        >
          Featured
        </span>
      )}
      {dealer.isFeatured && (
        <span className="absolute left-0 top-4 bottom-4 w-px bg-kawai-gold/35" aria-hidden />
      )}

      <h3
        style={{ ...f, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 600 }}
        className="text-white/90 leading-tight pr-16"
      >
        {dealer.dealerName}
      </h3>

      {location && (
        <p
          style={{ ...f, fontSize: '10px', letterSpacing: '0.25em' }}
          className="text-kawai-gold/70 uppercase"
        >
          {location}
        </p>
      )}

      {dealer.description && (
        <p className="text-white/35 text-[13px] leading-relaxed">
          {dealer.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-auto pt-2 border-t border-white/[0.05]">
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="text-white/40 hover:text-white/80 text-[12px] transition-colors duration-200"
          >
            {phone}
          </a>
        )}
        {website && (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-kawai-gold/50 hover:text-kawai-gold text-[12px] tracking-wide transition-colors duration-200 flex items-center gap-1.5"
            style={f}
          >
            Visit Website
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1 8L8 1M8 1H3M8 1V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

export default function ShigeruDealerGrid({
  usDealers,
  canadaDealers,
}: {
  usDealers: ShigeruDealerDoc[]
  canadaDealers: ShigeruDealerDoc[]
}) {
  const [region, setRegion] = useState<Region>('all')

  const visibleDealers =
    region === 'us'
      ? usDealers
      : region === 'canada'
        ? canadaDealers
        : [...usDealers, ...canadaDealers]

  const tabs: { id: Region; label: string; count: number }[] = [
    { id: 'all', label: 'All Dealers', count: usDealers.length + canadaDealers.length },
    { id: 'us', label: 'United States', count: usDealers.length },
    { id: 'canada', label: 'Canada', count: canadaDealers.length },
  ]

  return (
    <div className="bg-[#0a0a0a] px-6 pt-6 pb-28">
      <div className="max-w-6xl mx-auto">

        {/* ── Filter tabs ── */}
        <div className="border-t border-white/[0.06] mb-8 pt-8 flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => {
            const active = region === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setRegion(tab.id)}
                style={{ ...f, borderRadius: '6px' }}
                className={[
                  'inline-flex items-center gap-2.5 px-5 py-2.5 text-[12px] font-semibold tracking-[0.08em] uppercase transition-all duration-200 border',
                  active
                    ? 'bg-kawai-gold/10 border-kawai-gold/45 text-kawai-gold'
                    : 'bg-transparent border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20',
                ].join(' ')}
              >
                {tab.label}
                <span
                  className={[
                    'text-[10px] tabular-nums px-1.5 py-0.5 rounded',
                    active ? 'bg-kawai-gold/20 text-kawai-gold' : 'bg-white/[0.06] text-white/30',
                  ].join(' ')}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Map ── */}
        <div className="mb-8">
          <ShigeruDealerMap dealers={visibleDealers} />
        </div>

        {/* ── Grid — keyed fade, no per-card exit jank ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={region}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {visibleDealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </motion.div>
        </AnimatePresence>

        {visibleDealers.length === 0 && (
          <div className="text-center py-20">
            <p style={f} className="text-white/25 text-[13px] tracking-[0.1em] uppercase">
              No dealers found
            </p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div className="mt-16 pt-10 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/35 text-[13px] leading-relaxed max-w-md">
            Can&rsquo;t find a dealer near you? Our team can help you locate the nearest
            Shigeru Kawai experience.
          </p>
          <Link
            href="/shigeru/contact"
            style={{ ...f, borderRadius: '6px' }}
            className="shrink-0 inline-flex items-center gap-2 border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold text-[12px] font-semibold tracking-[0.1em] uppercase px-7 py-3 transition-all duration-300 hover:bg-kawai-gold/[0.06]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
