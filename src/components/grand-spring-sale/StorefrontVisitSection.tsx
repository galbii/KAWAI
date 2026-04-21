'use client'

import { useState } from 'react'
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'

function SakuraIcon({ className }: { className?: string }) {
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

interface HoursEntry {
  day?: string | null
  hours?: string | null
}

interface StorefrontVisitSectionProps {
  locationName?: string | null
  address?: string | null
  phone?: string | null
  hours?: HoursEntry[] | null
  mapApiKey?: string | null
  directionsLink?: string | null
  storeslug: string
}

function buildMapEmbedUrl(address: string, apiKey?: string | null): string {
  const encoded = encodeURIComponent(address)
  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encoded}&zoom=15`
  }
  return `https://maps.google.com/maps?q=${encoded}&output=embed`
}

function buildDirectionsUrl(address: string): string {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

export function StorefrontVisitSection({
  locationName,
  address,
  phone,
  hours,
  mapApiKey,
  directionsLink,
  storeslug,
}: StorefrontVisitSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  const resolvedDirections = directionsLink ?? (address ? buildDirectionsUrl(address) : null)
  const mapSrc = address ? buildMapEmbedUrl(address, mapApiKey) : null

  const todayIndex = new Date().getDay()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = dayNames[todayIndex] ?? ''

  const todayHours = hours?.find((h) =>
    (h.day ?? '').toLowerCase().includes(todayName.toLowerCase()),
  )

  return (
    <section className="py-16 md:py-24 border-t border-white/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
            <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              Come See Us
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
            Play before you decide.
          </h2>
          <p className="text-kawai-charcoal/60 max-w-lg mx-auto text-lg">
            Every instrument in this offer is on our showroom floor. No commitment required —
            just come play a Kawai grand and feel the difference for yourself.
          </p>
        </div>

        {/* Content grid */}
        <div className="bg-white rounded-xl shadow-brand-medium overflow-hidden border border-kawai-neutral/60">
          <div className="md:flex">
            {/* Location info panel */}
            <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-medium text-kawai-black mb-6 font-[family-name:var(--font-brand-serif)]">
                  {locationName ?? 'Our Showroom'}
                </h3>

                <div className="space-y-5">
                  {address && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-kawai-red mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-kawai-black/80 text-sm leading-relaxed">{address}</p>
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-kawai-red flex-shrink-0" />
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="text-kawai-black/80 text-sm hover:text-kawai-red transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  )}

                  {hours && hours.length > 0 && (
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-5 h-5 text-kawai-red mt-0.5 flex-shrink-0" />
                      <div className="text-sm space-y-1">
                        {todayHours && (
                          <p className="text-kawai-black font-medium">
                            Today: <span className="font-normal">{todayHours.hours}</span>
                          </p>
                        )}
                        {hours.slice(0, 7).map((h, i) => (
                          <div
                            key={i}
                            className={`flex justify-between gap-6 ${
                              (h.day ?? '').toLowerCase().includes(todayName.toLowerCase())
                                ? 'text-kawai-black font-medium'
                                : 'text-kawai-charcoal/60'
                            }`}
                          >
                            <span className="min-w-[5rem]">{h.day}</span>
                            <span>{h.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 space-y-3">
                {resolvedDirections && (
                  <a
                    href={resolvedDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-kawai-red hover:bg-kawai-red/90 text-white text-sm font-medium tracking-wide transition-colors rounded-sm group"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    Get Directions
                    <div className="w-5 h-5 rounded-full border border-white/30 group-hover:border-white/60 group-hover:bg-white/10 flex items-center justify-center transition-all ml-auto">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </a>
                )}
                <a
                  href="#grand-lead-form"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('grand-lead-form')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-kawai-black/20 text-kawai-black hover:border-kawai-black/50 text-sm font-medium tracking-wide transition-colors rounded-sm"
                >
                  Schedule a Visit
                </a>
              </div>
            </div>

            {/* Map panel */}
            <div className="md:w-3/5 relative bg-kawai-pearl/40 min-h-[320px] md:min-h-[460px]">
              {mapSrc && !mapError ? (
                <>
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-kawai-red mx-auto mb-2" />
                        <p className="text-kawai-charcoal/50 text-xs">Loading map…</p>
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
                  <MapPinIcon className="w-12 h-12 text-kawai-red/30 mb-4" />
                  {address && (
                    <>
                      <p className="text-kawai-charcoal/60 text-sm mb-4">{address}</p>
                      <a
                        href={resolvedDirections ?? `https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-black text-sm font-medium transition-colors"
                      >
                        Open in Google Maps
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      </div>
    </section>
  )
}
