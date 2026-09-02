'use client'

import { useState } from 'react'
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { BookingModal } from './BookingModal'
import { DATE_RANGE } from './campaign'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'
import type { HoursEntry } from './schedule'

interface VisitSectionProps {
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
  if (apiKey) return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encoded}&zoom=15`
  return `https://maps.google.com/maps?q=${encoded}&output=embed`
}

/**
 * Where to go and when they're open. The spring campaign carried two of these —
 * an "event details" card and a near-identical "visit us" card — so this page
 * keeps one and puts the map next to the hours where a visitor expects it.
 *
 * The showroom's name is the section heading now rather than a line inside the
 * panel: the storefront is the thing running the sale, so it gets stated at the
 * same scale as everything else the page shouts.
 */
export function VisitSection({
  locationName,
  address,
  phone,
  hours,
  mapApiKey,
  directionsLink,
  storeslug,
}: VisitSectionProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)

  // The wordmark beside the heading already says Kawai, so a stored name like
  // "Kawai Dallas" or "Dallas Piano Gallery" must not repeat it in the lockup.
  const displayName =
    (locationName ?? '')
      .replace(/piano gallery/gi, '')
      .replace(/kawai/gi, '')
      .trim() || 'Showroom'

  const fallbackDirections = address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : null
  const resolvedDirections = directionsLink ?? fallbackDirections
  const mapSrc = address ? buildMapEmbedUrl(address, mapApiKey) : null

  return (
    <>
      <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
        <RuledGround animate />

        <div className={`relative ${BTS_CONTAINER} py-16 md:py-24`}>
          <SectionHead
            eyebrow="Our location"
            title={displayName}
            logo
            subhead={DATE_RANGE}
            className="mb-10"
          />

          <Reveal
            delay={0.1}
            className="bg-white border border-kawai-black/12 shadow-[0_18px_50px_rgba(30,27,22,0.08)]"
          >
            <div className="flex flex-col md:flex-row">
              {/* Details */}
              <div className="md:w-[42%] p-8 md:p-11 md:border-r border-kawai-black/10 border-t-[3px] border-t-kawai-red">
                <div className="space-y-6">
                  {address && (
                    <div className="flex items-start gap-3.5">
                      <MapPinIcon className="w-5 h-5 text-kawai-red mt-0.5 flex-shrink-0" aria-hidden />
                      <p className="text-kawai-black text-[1.05rem] leading-relaxed">{address}</p>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-3.5">
                      <PhoneIcon className="w-5 h-5 text-kawai-red flex-shrink-0" aria-hidden />
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="text-kawai-black hover:text-kawai-red text-[1.05rem] transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  )}
                </div>

                {hours && hours.length > 0 && (
                  <div className="mt-8 pt-7 border-t border-kawai-black/10">
                    <p className="bts-eyebrow text-kawai-charcoal/45 mb-4">Opening hours</p>
                    <dl className="text-sm">
                      {hours.slice(0, 7).map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-4 py-2 border-b border-kawai-black/8 last:border-b-0"
                        >
                          <dt className="text-kawai-charcoal/60 min-w-[5.5rem]">{h.day}</dt>
                          <dd className="bts-num text-kawai-black">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                <div className="mt-9 space-y-4">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full inline-flex items-center justify-center px-6 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
                  >
                    Book an appointment
                  </button>
                  {resolvedDirections && (
                    <a
                      href={resolvedDirections}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 text-kawai-black/70 hover:text-kawai-red text-sm tracking-[0.12em] uppercase font-semibold underline underline-offset-4 decoration-kawai-black/25 hover:decoration-kawai-red transition-colors"
                    >
                      <MapPinIcon className="w-4 h-4" aria-hidden />
                      Get directions
                    </a>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="md:w-[58%] relative bg-kawai-neutral/25 min-h-[340px] md:min-h-[520px] order-first md:order-last">
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
                      style={{ border: 0 }}
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
          </Reveal>
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
