'use client'

import { useState } from 'react'
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'
import { BookingModal } from '@/components/trade-in/BookingModal'
import { DATE_RANGE } from './campaign'
import { RuledGround } from './RuledGround'

interface HoursEntry {
  day?: string | null
  time?: string | null
}

interface VisitSectionProps {
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

/**
 * Where to go and when they're open. The spring campaign carried two of these —
 * an "event details" card and a near-identical "visit us" card — so this page
 * keeps one and puts the map next to the hours where a visitor expects it.
 */
export function VisitSection({
  locationName,
  address,
  phone,
  hours,
  mapApiKey,
  directionsLink,
  storeslug,
  calendlyUrl,
}: VisitSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  const fallbackDirections = address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : null
  const resolvedDirections = directionsLink ?? fallbackDirections
  const mapSrc = address ? buildMapEmbedUrl(address, mapApiKey) : null

  return (
    <>
      <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
        <RuledGround />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-20 md:py-28">

          <div className="flex items-center gap-3 mb-10">
            <span className="w-6 h-px bg-kawai-red" aria-hidden />
            <span
              className="text-kawai-charcoal/50 uppercase"
              style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.7rem', letterSpacing: '0.24em' }}
            >
              Come Play Them
            </span>
          </div>

          <div className="bg-white border border-kawai-neutral/70 rounded-sm overflow-hidden shadow-[0_18px_50px_rgba(30,27,22,0.08)]">
            <div className="flex flex-col md:flex-row">

              {/* Details */}
              <div className="md:w-[44%] p-8 md:p-11 md:border-r border-kawai-neutral/60">
                <h2
                  className="text-kawai-black leading-[1.1]"
                  style={{
                    fontFamily: 'var(--font-family-cormorant), Georgia, serif',
                    fontSize: 'clamp(1.9rem, 3.6vw, 2.6rem)',
                    fontWeight: 500,
                  }}
                >
                  {locationName ?? 'Your Kawai showroom'}
                </h2>
                <p
                  className="text-kawai-red uppercase mt-2 mb-8"
                  style={{ fontFamily: 'var(--font-oswald), sans-serif', fontSize: '0.72rem', letterSpacing: '0.22em' }}
                >
                  {DATE_RANGE}
                </p>

                <div className="space-y-5 border-t border-kawai-neutral/60 pt-7">
                  {address && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-kawai-red mt-0.5 flex-shrink-0" aria-hidden />
                      <p className="text-kawai-charcoal/75 text-[0.95rem] leading-relaxed">{address}</p>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-kawai-red flex-shrink-0" aria-hidden />
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="text-kawai-charcoal/75 hover:text-kawai-red text-[0.95rem] transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  )}

                  {hours && hours.length > 0 && (
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-5 h-5 text-kawai-red mt-0.5 flex-shrink-0" aria-hidden />
                      <dl className="flex-1 text-sm space-y-1.5">
                        {hours.slice(0, 7).map((h, i) => (
                          <div key={i} className="flex justify-between gap-4 text-kawai-charcoal/55">
                            <dt className="min-w-[5.5rem]">{h.day}</dt>
                            <dd>{h.time}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>

                <div className="mt-9 space-y-3">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.14em] uppercase font-medium transition-colors rounded-sm"
                  >
                    Book an appointment
                  </button>
                  {resolvedDirections && (
                    <a
                      href={resolvedDirections}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-kawai-black/20 hover:border-kawai-black/45 text-kawai-black text-sm tracking-[0.14em] uppercase font-medium transition-colors rounded-sm"
                    >
                      <MapPinIcon className="w-4 h-4" aria-hidden />
                      Get directions
                    </a>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="md:w-[56%] relative bg-kawai-neutral/25 min-h-[340px] order-first md:order-last">
                {mapSrc && !mapError ? (
                  <>
                    {!mapLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-kawai-pearl/70">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-kawai-red" aria-hidden />
                        <span className="sr-only">Loading map</span>
                      </div>
                    )}
                    <iframe
                      src={mapSrc}
                      style={{ border: 0, minHeight: 340 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={() => setMapLoaded(true)}
                      onError={() => setMapError(true)}
                      title={`Map of ${locationName ?? 'the showroom'}`}
                      className="w-full h-full absolute inset-0"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <MapPinIcon className="w-9 h-9 text-kawai-red/30 mb-3" aria-hidden />
                    {address && <p className="text-kawai-charcoal/55 text-sm">{address}</p>}
                  </div>
                )}
              </div>

            </div>
          </div>

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
