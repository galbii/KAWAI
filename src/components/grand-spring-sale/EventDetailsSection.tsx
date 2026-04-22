'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'
import { BookingModal } from '@/components/trade-in/BookingModal'

interface HoursEntry {
  day?: string | null
  time?: string | null
}

interface EventDetailsSectionProps {
  locationName?: string | null
  address?: string | null
  phone?: string | null
  hours?: HoursEntry[] | null
  mapApiKey?: string | null
  directionsLink?: string | null
  storeslug: string
  calendlyUrl?: string | null
}

function buildMapEmbedUrl(address: string, apiKey?: string | null): string {
  const encoded = encodeURIComponent(address)
  if (apiKey) return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encoded}&zoom=15`
  return `https://maps.google.com/maps?q=${encoded}&output=embed`
}

function buildDirectionsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

export function EventDetailsSection({
  locationName,
  address,
  phone,
  hours,
  mapApiKey,
  directionsLink,
  storeslug,
  calendlyUrl,
}: EventDetailsSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  const resolvedDirections = directionsLink ?? (address ? buildDirectionsUrl(address) : null)
  const mapSrc = address ? buildMapEmbedUrl(address, mapApiKey) : null

  const todayIndex = new Date().getDay()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = dayNames[todayIndex] ?? ''

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @keyframes eds-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .eds-live-dot { animation: eds-dot 2s ease-in-out infinite; }
      `}</style>

      <section className="relative py-16 md:py-24 overflow-hidden">

        {/* Thin red rule at very top — brand anchor */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-kawai-red" />

        <div className="relative max-w-6xl mx-auto px-6">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-white/10" aria-hidden />
            <span className="text-white/30 text-[0.65rem] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-brand-sans)]">
              Event Details
            </span>
            <div className="h-px flex-1 bg-white/10" aria-hidden />
          </div>

          {/* The Invitation Card */}
          <div className="bg-white rounded-sm overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">

            {/* Red header bar */}
            <div className="bg-kawai-red px-8 md:px-10 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="eds-live-dot w-2 h-2 rounded-full bg-white flex-shrink-0" aria-hidden />
                <span className="text-white text-xs tracking-[0.3em] uppercase font-medium font-[family-name:var(--font-brand-sans)]">
                  Now Booking · Spring Sale Event
                </span>
              </div>
              <span className="text-white/70 text-xs tracking-[0.15em] font-[family-name:var(--font-brand-sans)] hidden sm:block">
                May 1 – 17, 2026
              </span>
            </div>

            {/* Main split: info left, map right */}
            <div className="flex flex-col md:flex-row min-h-[480px] md:min-h-[80vh]">

              {/* Left: Event info */}
              <div className="order-2 md:order-1 md:w-[42%] flex flex-col p-8 md:p-12 md:border-r border-kawai-neutral/50">

                {/* KAWAI wordmark + event title */}
                <div className="mb-8 md:mb-10">
                  <Image
                    src="/images/logos/kawai-logo-red-2x.png"
                    alt="Kawai"
                    width={100}
                    height={20}
                    className="object-contain mb-4 md:w-[130px]"
                  />
                  <h2
                    className="font-kawai-script text-kawai-black leading-[1]"
                    style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)' }}
                  >
                    Grand Spring Sale
                  </h2>
                  <p className="text-kawai-charcoal/50 text-xs md:text-sm tracking-[0.25em] uppercase font-medium mt-2 font-[family-name:var(--font-brand-sans)]">
                    May 1 – 17, 2026
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-kawai-neutral/50 mb-7 md:mb-9" />

                {/* Location details */}
                <div className="space-y-4 md:space-y-6 flex-1">
                  {locationName && (
                    <p className="font-[family-name:var(--font-brand-serif)] text-kawai-black text-lg md:text-2xl leading-snug">
                      {locationName}
                    </p>
                  )}

                  {address && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-kawai-red mt-0.5 flex-shrink-0" />
                      <p className="text-kawai-charcoal/70 text-sm md:text-base leading-relaxed font-[family-name:var(--font-brand-sans)]">
                        {address}
                      </p>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 text-kawai-red flex-shrink-0" />
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="text-kawai-charcoal/70 text-sm md:text-base hover:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)]"
                      >
                        {phone}
                      </a>
                    </div>
                  )}

                  {hours && hours.length > 0 && (
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-kawai-red mt-0.5 flex-shrink-0" />
                      <div className="text-xs md:text-sm space-y-1.5 flex-1 font-[family-name:var(--font-brand-sans)]">
                        {hours.slice(0, 7).map((h, i) => {
                          const isToday = (h.day ?? '').toLowerCase().includes(todayName.toLowerCase())
                          return (
                            <div
                              key={i}
                              className={`flex justify-between gap-4 py-0.5 ${
                                isToday
                                  ? 'text-kawai-black font-semibold'
                                  : 'text-kawai-charcoal/45'
                              }`}
                            >
                              <span className="min-w-[5rem] md:min-w-[6rem]">{h.day}</span>
                              <span>{h.time}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="mt-8 md:mt-12 space-y-3">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 md:py-4 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm md:text-base tracking-[0.12em] uppercase font-medium transition-colors rounded-sm shadow-[0_4px_20px_rgba(225,25,34,0.3)] font-[family-name:var(--font-brand-sans)]"
                  >
                    Book an Appointment
                  </button>
                  <button
                    onClick={() => scrollTo('grand-showcase')}
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 md:py-4 border border-kawai-black/20 hover:border-kawai-black/40 text-kawai-black text-sm md:text-base tracking-[0.12em] uppercase font-medium transition-colors rounded-sm font-[family-name:var(--font-brand-sans)]"
                  >
                    Browse the Collection
                  </button>
                  {resolvedDirections && (
                    <a
                      href={resolvedDirections}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-kawai-charcoal/40 hover:text-kawai-red text-xs md:text-sm tracking-[0.12em] uppercase font-medium transition-colors font-[family-name:var(--font-brand-sans)]"
                    >
                      <MapPinIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Get Directions
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Map */}
              <div className="order-1 md:order-2 md:w-[58%] relative bg-kawai-neutral/30 min-h-[320px] border-b md:border-b-0 border-kawai-neutral/50">
                {mapSrc && !mapError ? (
                  <>
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-kawai-pearl/60">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-kawai-red mx-auto mb-2" />
                          <p className="text-kawai-charcoal/40 text-xs font-[family-name:var(--font-brand-sans)]">Loading map…</p>
                        </div>
                      </div>
                    )}
                    <iframe
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: 320 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={() => setMapLoaded(true)}
                      onError={() => setMapError(true)}
                      title={`Map of ${locationName ?? 'our showroom'}`}
                      className="w-full h-full absolute inset-0"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <MapPinIcon className="w-10 h-10 text-kawai-red/30 mb-3" />
                    {address && (
                      <>
                        <p className="text-kawai-charcoal/50 text-sm mb-4 font-[family-name:var(--font-brand-sans)]">{address}</p>
                        <a
                          href={resolvedDirections ?? `https://maps.google.com/?q=${encodeURIComponent(address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-kawai-red hover:text-kawai-black text-sm font-medium transition-colors font-[family-name:var(--font-brand-sans)]"
                        >
                          Open in Google Maps
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-white/20 text-xs mt-8 font-[family-name:var(--font-brand-sans)] tracking-wide">
            All models available to play in person · Discounts applied at time of purchase
          </p>

        </div>
      </section>

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
