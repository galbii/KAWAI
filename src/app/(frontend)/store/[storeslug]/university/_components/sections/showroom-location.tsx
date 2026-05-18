'use client';

import type { LocationConfig } from '../../event.config';

interface ShowroomLocationProps {
  eventLocation: LocationConfig
}

export function ShowroomLocation({ eventLocation }: ShowroomLocationProps) {
  const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(`${eventLocation.address}, ${eventLocation.city}, ${eventLocation.state}`)}`;
  const embedSrc = eventLocation.googleMapsEmbedUrl
    ?? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(`${eventLocation.address}, ${eventLocation.city}, ${eventLocation.state}`)}&zoom=15`;

  return (
    <section
      className="relative border-t border-[rgba(77,25,121,0.1)]"
      style={{ background: '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 lg:pt-28 pb-20 lg:pb-28">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px w-8" style={{ background: '#4D1979' }} />
          <p className="text-[10px] tracking-[0.32em] uppercase font-[family-name:var(--font-brand-sans)]"
            style={{ color: 'rgba(77,25,121,0.6)' }}>
            Event Location
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-0" style={{ border: '1px solid rgba(77,25,121,0.1)' }}>

          {/* Map — 3 cols */}
          <div className="lg:col-span-3 relative" style={{ minHeight: '480px' }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: '360px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={embedSrc}
            />
          </div>

          {/* Info panel — 2 cols */}
          <div
            className="lg:col-span-2 flex flex-col"
            style={{ borderLeft: '1px solid rgba(77,25,121,0.1)' }}
          >
            {/* Venue + address */}
            <div className="p-8 lg:p-10" style={{ borderBottom: '1px solid rgba(77,25,121,0.08)' }}>
              <p className="text-[10px] tracking-[0.25em] uppercase mb-3 font-[family-name:var(--font-brand-sans)]"
                style={{ color: 'rgba(77,25,121,0.5)' }}>
                Venue
              </p>
              <h3
                className="font-[family-name:var(--font-family-cormorant)] mb-4 leading-snug"
                style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: 500, color: '#1a0d2e' }}
              >
                {eventLocation.venueName}
              </h3>
              <p className="text-sm font-[family-name:var(--font-brand-sans)]"
                style={{ color: 'rgba(26,13,46,0.45)' }}>
                {eventLocation.address}<br />
                {eventLocation.city}, {eventLocation.state} {eventLocation.zip}
              </p>

              {eventLocation.phone && (
                <a
                  href={`tel:${eventLocation.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-[family-name:var(--font-brand-sans)] transition-opacity hover:opacity-70"
                  style={{ color: '#4D1979' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.243 1.024-2.25 2.297-2.25h.256c.93 0 1.76.558 2.105 1.41l1.003 2.422a2.25 2.25 0 0 1-.512 2.503l-.7.665a12.013 12.013 0 0 0 5.164 5.165l.665-.7a2.25 2.25 0 0 1 2.503-.512l2.422 1.003c.853.345 1.41 1.175 1.41 2.105v.256c0 1.273-1.007 2.297-2.25 2.297C7.86 21 3 16.14 3 10.088v-.256c0-.083.003-.165.008-.247" />
                  </svg>
                  {eventLocation.phone}
                </a>
              )}
            </div>

            {/* Hours */}
            <div className="p-8 lg:p-10 flex-1" style={{ borderBottom: '1px solid rgba(77,25,121,0.08)' }}>
              <p className="text-[10px] tracking-[0.25em] uppercase mb-5 font-[family-name:var(--font-brand-sans)]"
                style={{ color: 'rgba(77,25,121,0.5)' }}>
                Event Hours
              </p>
              <div className="space-y-0">
                {eventLocation.hours.map((hour, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(77,25,121,0.06)' }}
                  >
                    <span
                      className="text-[13px] font-[family-name:var(--font-brand-sans)]"
                      style={{ color: hour.highlight ? '#4D1979' : 'rgba(26,13,46,0.5)' }}
                    >
                      {hour.day}
                    </span>
                    <span
                      className="text-[13px] font-medium font-[family-name:var(--font-brand-sans)]"
                      style={{ color: hour.highlight ? '#1a0d2e' : 'rgba(26,13,46,0.4)' }}
                    >
                      {hour.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Directions CTA */}
            <div className="p-8 lg:p-10">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.2em] uppercase font-semibold font-[family-name:var(--font-brand-sans)] transition-opacity hover:opacity-70"
                style={{ color: '#4D1979' }}
              >
                Get Directions
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
