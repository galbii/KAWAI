'use client'

import { useState } from 'react'
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import { RebateModal } from './RebateModal'
import { OFFERS, DATE_RANGE, DEADLINE_LONG } from './campaign'
import { RuledGround, BTS_CONTAINER } from './RuledGround'
import { SectionHead } from './SectionHead'
import { Reveal } from './Choreography'
import type { HoursEntry } from './schedule'

/**
 * Where to go, and what you get for going — side by side, in one section.
 *
 * The long page said these across four sections (a visit card, three offers
 * given a paragraph each, a trade-in band, and a set of how-to-claim steps) and
 * restated the same three figures in three different places on the way down.
 * A visitor deciding whether to spend a Saturday on this needs two facts: is
 * this store near me, and what comes off the price. Both fit on one screen.
 *
 * The rebate amounts are the one thing that genuinely needs room, so they are
 * behind a button rather than below the fold — see RebateModal.
 */

interface StoreAndOffersProps {
  locationName?: string | null
  address?: string | null
  phone?: string | null
  hours?: HoursEntry[] | null
  mapApiKey?: string | null
  directionsLink?: string | null
  rebates: RebateCategory[]
  /** Anchor the CTAs point at — the form lives there. */
  bookHref?: string
}

function buildMapEmbedUrl(address: string, apiKey?: string | null): string {
  const encoded = encodeURIComponent(address)
  if (apiKey) return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encoded}&zoom=15`
  return `https://maps.google.com/maps?q=${encoded}&output=embed`
}

/** Which offer opens the ledger. Matched on the figure, which campaign.ts owns. */
const REBATE_OFFER_VALUE = '$4,500'

export function StoreAndOffers({
  locationName,
  address,
  phone,
  hours,
  mapApiKey,
  directionsLink,
  rebates,
  bookHref = '#book',
}: StoreAndOffersProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [rebatesOpen, setRebatesOpen] = useState(false)

  // The wordmark beside the heading already says Kawai, so a stored name like
  // "Kawai Dallas" or "Dallas Piano Gallery" must not repeat it in the lockup.
  const displayName =
    (locationName ?? '')
      .replace(/piano gallery/gi, '')
      .replace(/kawai/gi, '')
      .trim() || 'Showroom'

  const fallbackDirections = address
    ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
    : null
  const resolvedDirections = directionsLink ?? fallbackDirections
  const mapSrc = address ? buildMapEmbedUrl(address, mapApiKey) : null
  const hasRebates = rebates.length > 0

  function goToBooking() {
    document.querySelector(bookHref)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="relative bg-kawai-pearl border-t border-kawai-black/10">
        <RuledGround animate />

        <div className={`relative ${BTS_CONTAINER} py-14 md:py-20`}>
          <SectionHead
            eyebrow="Our location"
            title={displayName}
            logo
            subhead={DATE_RANGE}
            className="mb-10"
          />

          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-start">
            {/* ── Where ── */}
            <Reveal className="bg-white border border-kawai-black/12 border-t-[3px] border-t-kawai-red shadow-[0_18px_50px_rgba(30,27,22,0.08)]">
              <div className="p-7 sm:p-9">
                <div className="space-y-5">
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
                  <div className="mt-7 pt-6 border-t border-kawai-black/10">
                    <p className="bts-eyebrow text-kawai-charcoal/45 mb-3">Opening hours</p>
                    <dl className="text-sm">
                      {hours.slice(0, 7).map((h, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-4 py-1.5 border-b border-kawai-black/8 last:border-b-0"
                        >
                          <dt className="text-kawai-charcoal/60 min-w-[5.5rem]">{h.day}</dt>
                          <dd className="bts-num text-kawai-black">{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="relative bg-kawai-neutral/25 h-[260px] sm:h-[300px] border-t border-kawai-black/10">
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

              {resolvedDirections && (
                <a
                  href={resolvedDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 border-t border-kawai-black/10 text-kawai-black/70 hover:text-kawai-red text-sm tracking-[0.12em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kawai-red"
                >
                  <MapPinIcon className="w-4 h-4" aria-hidden />
                  Get directions
                </a>
              )}
            </Reveal>

            {/* ── What ── */}
            <div>
              <p className="bts-eyebrow text-kawai-red mb-5">Ends {DEADLINE_LONG}</p>

              <ul className="border-t border-kawai-black/12">
                {OFFERS.map(({ prefix, value, label, detail }, i) => {
                  const opensLedger = value === REBATE_OFFER_VALUE && hasRebates
                  return (
                    <Reveal
                      as="li"
                      key={label}
                      delay={i * 0.08}
                      className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-6 border-b border-kawai-black/12"
                    >
                      <span className="min-w-[7.5rem]">
                        {prefix ? (
                          <span className="bts-eyebrow block text-kawai-charcoal/50 mb-1">
                            {prefix}
                          </span>
                        ) : null}
                        <span
                          className="bts-display block text-kawai-red leading-none"
                          style={{ fontSize: 'clamp(2.4rem, 5.2vw, 3.6rem)' }}
                        >
                          {value}
                        </span>
                      </span>

                      <span className="flex-1 min-w-[12rem]">
                        <span
                          className="bts-display block text-kawai-black"
                          style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)' }}
                        >
                          {label}
                        </span>
                        <span className="block text-kawai-charcoal/70 text-[0.95rem] leading-relaxed mt-1">
                          {detail}
                        </span>

                        {opensLedger && (
                          <button
                            type="button"
                            onClick={() => setRebatesOpen(true)}
                            className="group mt-3 inline-flex items-center gap-2.5 text-kawai-red hover:text-kawai-red-600 text-sm tracking-[0.16em] uppercase font-semibold underline underline-offset-4 decoration-kawai-red/30 hover:decoration-kawai-red transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
                          >
                            See rebates
                            <svg
                              className="w-4 h-4 transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.75}
                              aria-hidden
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </button>
                        )}
                      </span>
                    </Reveal>
                  )
                })}
              </ul>

              <Reveal delay={0.26} className="mt-8">
                <a
                  href={bookHref}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-5 bg-kawai-red hover:bg-kawai-red-600 text-white text-sm tracking-[0.18em] uppercase font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
                >
                  Book an appointment
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

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
