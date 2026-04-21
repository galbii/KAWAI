'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StoresMapClient } from './StoresMapClient'
import type { StorefrontEntry, StorePin } from './stores-types'

interface Props {
  storefronts: StorefrontEntry[]
  pins: StorePin[]
}

function displayCity(name: string, city?: string): string {
  return name.replace(/^kawai\s+/i, '').trim() || city || name
}

function GridCard({
  storefront,
  index,
  isSelected,
  onSelect,
}: {
  storefront: StorefrontEntry
  index: number
  isSelected: boolean
  onSelect: () => void
}) {
  const ordinal = String(index + 1).padStart(2, '0')
  const city = displayCity(storefront.locationName, storefront.showroomInfo?.address)
  const typeBadge = storefront.locationText || `${city}'s Premier Piano Dealer`

  return (
    <button
      onClick={onSelect}
      className="group w-full text-left bg-white border border-kawai-neutral hover:border-kawai-red/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
      style={{ borderTop: `3px solid ${isSelected ? '#E11922' : '#E11922'}` }}
    >
      <div className="flex-1 p-6 lg:p-7 flex flex-col">
        {/* Top row: type badge + ordinal */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            {/* Kawai logo */}
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={56}
              height={17}
              className="h-3 w-auto mb-2"
            />
            <p
              className="text-kawai-red font-[family-name:var(--font-brand-sans)] font-bold uppercase leading-tight"
              style={{ fontSize: '0.58rem', letterSpacing: '0.22em' }}
            >
              {typeBadge}
            </p>
          </div>
          <span
            className="font-[family-name:var(--font-family-cormorant)] italic select-none leading-none flex-shrink-0"
            style={{ fontSize: '1.8rem', color: '#DEDAD6', lineHeight: 1 }}
          >
            {ordinal}
          </span>
        </div>

        {/* Red rule */}
        <div
          className="h-[2px] bg-kawai-red mb-4 transition-all duration-500"
          style={{ width: isSelected ? '48px' : '28px' }}
        />

        {/* City name */}
        <h3
          className="font-[family-name:var(--font-brand-sans)] text-kawai-black font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)' }}
        >
          {city}
        </h3>

        {/* Address + Phone */}
        <div className="space-y-1.5 mb-5 flex-1">
          {storefront.showroomInfo?.address && (
            <p
              className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/55 leading-relaxed"
              style={{ fontSize: '0.73rem' }}
            >
              {storefront.showroomInfo.address}
            </p>
          )}
          {storefront.showroomInfo?.phone && (
            <p
              className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/45"
              style={{ fontSize: '0.73rem' }}
            >
              {storefront.showroomInfo.phone}
            </p>
          )}
        </div>

        {/* Feature tags */}
        {storefront.features && storefront.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {storefront.features.slice(0, 4).map((f, i) => (
              <span
                key={i}
                className="inline-block border border-kawai-red/30 text-kawai-red font-[family-name:var(--font-brand-sans)] font-semibold uppercase px-2.5 py-1 rounded-full"
                style={{ fontSize: '0.52rem', letterSpacing: '0.14em', background: 'rgba(225,25,34,0.04)' }}
              >
                {f.title}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          className="flex items-center gap-3 pt-4 mt-auto"
          style={{ borderTop: '1px solid #EDEBE8' }}
        >
          <span
            className="text-kawai-red font-[family-name:var(--font-brand-sans)] font-bold uppercase tracking-[0.22em]"
            style={{ fontSize: '0.6rem' }}
          >
            Visit Showroom
          </span>
          <div className="flex-1 h-px bg-kawai-neutral group-hover:bg-kawai-red/20 transition-colors" />
          <svg
            className="text-kawai-red group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0"
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="flex-shrink-0 h-1 bg-kawai-red" />
      )}
    </button>
  )
}

export function StoresInteractiveSection({ storefronts, pins }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gridQuery, setGridQuery] = useState('')
  const mapSectionRef = useRef<HTMLDivElement>(null)

  const handleGridSelect = useCallback(
    (id: string) => {
      setSelectedId((prev) => (prev === id ? null : id))
      if (selectedId !== id) {
        setTimeout(() => {
          mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      }
    },
    [selectedId]
  )

  const filteredStorefronts = useMemo(() => {
    if (!gridQuery.trim()) return storefronts
    const q = gridQuery.toLowerCase()
    return storefronts.filter(
      (s) =>
        s.locationName.toLowerCase().includes(q) ||
        s.showroomInfo?.address?.toLowerCase().includes(q) ||
        displayCity(s.locationName).toLowerCase().includes(q)
    )
  }, [storefronts, gridQuery])

  return (
    <>
      {/* ── Grid section ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-14 md:py-20">
          {/* Section header + search */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10 mb-10 md:mb-14">
            <div className="flex-1">
              <p
                className="text-kawai-red font-[family-name:var(--font-brand-sans)] font-bold uppercase tracking-[0.4em] mb-2"
                style={{ fontSize: '0.58rem' }}
              >
                Official Kawai Showrooms
              </p>
              <h2
                className="font-[family-name:var(--font-family-cormorant)] italic text-kawai-black leading-[0.92]"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
              >
                All <span className="text-kawai-red">Locations</span>
              </h2>
            </div>

            {/* Search */}
            <div className="relative sm:w-72 flex-shrink-0">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'rgba(44,44,44,0.35)' }}
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search locations…"
                value={gridQuery}
                onChange={(e) => setGridQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-kawai-neutral focus:border-kawai-red focus:outline-none transition-colors font-[family-name:var(--font-brand-sans)] text-kawai-black placeholder-kawai-charcoal/35"
                style={{ fontSize: '0.77rem', borderRadius: '3px' }}
              />
            </div>
          </div>

          {filteredStorefronts.length === 0 ? (
            <p className="font-[family-name:var(--font-family-cormorant)] italic text-kawai-black/30 text-lg py-12">
              No locations match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
              {filteredStorefronts.map((storefront, i) => (
                <GridCard
                  key={storefront.id}
                  storefront={storefront}
                  index={i}
                  isSelected={selectedId === storefront.id}
                  onSelect={() => handleGridSelect(storefront.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Map section ── */}
      <section id="stores-map" ref={mapSectionRef} className="bg-kawai-pearl">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-12 md:py-16">
          <p
            className="text-kawai-red font-[family-name:var(--font-brand-sans)] font-bold uppercase tracking-[0.4em] mb-3"
            style={{ fontSize: '0.58rem' }}
          >
            Dealer Network
          </p>
          <h2
            className="font-[family-name:var(--font-family-cormorant)] italic text-kawai-black leading-[0.92] mb-5"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
          >
            Find Your Nearest
            <br />
            <span className="text-kawai-red">Official Kawai Store</span>
          </h2>
          <div className="w-10 h-[2px] bg-kawai-red" />
        </div>

        <div className="border-t border-kawai-neutral">
          <StoresMapClient
            pins={pins}
            selectedId={selectedId}
            onStoreSelect={setSelectedId}
          />
        </div>

        {/* No location near you */}
        <div className="bg-white" style={{ borderTop: '1px solid #EDEBE8' }}>
          <div className="mx-auto max-w-2xl px-6 py-14 md:py-16 flex flex-col items-center text-center gap-5">
            <p
              className="font-[family-name:var(--font-family-cormorant)] italic text-kawai-black leading-snug"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              No official showroom near you?
            </p>
            <p
              className="font-[family-name:var(--font-brand-sans)] text-kawai-charcoal/50 leading-relaxed max-w-sm"
              style={{ fontSize: '0.78rem' }}
            >
              Kawai's network of authorized dealers spans the country. Find a certified dealer near you for the same world-class instruments and expert guidance.
            </p>
            <Link
              href="/find-a-dealer"
              className="mt-1 inline-flex items-center gap-3 font-[family-name:var(--font-brand-sans)] font-bold uppercase tracking-[0.2em] text-white bg-kawai-red hover:bg-kawai-red/90 active:scale-[0.98] transition-all px-8 py-4"
              style={{ fontSize: '0.68rem', borderRadius: '2px' }}
            >
              Find a Local Authorized Dealer
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
