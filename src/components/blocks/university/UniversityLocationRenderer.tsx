'use client'

import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import { cn } from '@/lib/utils'

interface HourRow {
  dayLabel: string
  hoursText: string
  id?: string
}

interface UniversityLocationRendererProps {
  block: {
    heading?: string
    venueName?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    zip?: string
    phone?: string
    email?: string
    googleMapsEmbedUrl?: string
    hours?: HourRow[]
    showContactForm?: boolean
    constantContactFormId?: string
    contactFormHeading?: string
    contactFormDescription?: string
  }
}

// ── Icon components (inline SVG, no external dep) ────────────────────────────
function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
    </svg>
  )
}

// ── Constant Contact inline form ──────────────────────────────────────────────
function ConstantContactForm({
  formId,
  heading,
  description,
}: {
  formId: string
  heading?: string
  description?: string
}) {
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector('.ctct-inline-form')
      if (!el || el.children.length === 0) {
        setShowFallback(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Script
        id="ctct-form-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `var _ctct_m = "${formId}";` }}
      />
      <Script
        id="ctct-widget-script"
        src="https://static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js"
        strategy="afterInteractive"
        onError={() => setShowFallback(true)}
      />

      <div>
        {heading && (
          <h3 className="text-2xl font-serif text-kawai-black mb-2 leading-tight">{heading}</h3>
        )}
        <div className="w-12 h-px bg-kawai-red mb-5" />
        {description && (
          <p className="text-kawai-black/70 text-sm leading-relaxed mb-6">{description}</p>
        )}

        {!showFallback ? (
          <div
            dangerouslySetInnerHTML={{
              __html: `<div class="ctct-inline-form" data-form-id="${formId}"></div>`,
            }}
          />
        ) : (
          <div>
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Having trouble loading the form? Use this form instead.
              </p>
            </div>
            <form className="space-y-4" method="post">
              <div>
                <label htmlFor="cc-fallback-name" className="block text-sm font-medium text-kawai-black mb-1.5">
                  Name
                </label>
                <input
                  id="cc-fallback-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-kawai-neutral rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-kawai-red text-kawai-black"
                />
              </div>
              <div>
                <label htmlFor="cc-fallback-email" className="block text-sm font-medium text-kawai-black mb-1.5">
                  Email
                </label>
                <input
                  id="cc-fallback-email"
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-kawai-neutral rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-kawai-red text-kawai-black"
                />
              </div>
              <div>
                <label htmlFor="cc-fallback-message" className="block text-sm font-medium text-kawai-black mb-1.5">
                  Message
                </label>
                <textarea
                  id="cc-fallback-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about your piano interests…"
                  className="w-full px-4 py-3 border border-kawai-neutral rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-kawai-red text-kawai-black resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-kawai-red hover:bg-kawai-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors text-sm tracking-wide uppercase"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function UniversityLocationRenderer({ block }: UniversityLocationRendererProps) {
  const {
    heading,
    venueName,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    phone,
    email,
    googleMapsEmbedUrl,
    hours,
    showContactForm,
    constantContactFormId,
    contactFormHeading,
    contactFormDescription,
  } = block

  // Build a single-line address string for directions link
  const addressParts = [addressLine1, addressLine2, city, state, zip].filter(Boolean)
  const fullAddress = addressParts.join(', ')

  return (
    <section className="relative bg-white">
      {/* Section heading */}
      {heading && (
        <div className="container mx-auto px-6 pt-20 pb-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light font-serif text-kawai-black mb-4 leading-tight">
            {heading}
          </h2>
          <div className="w-16 h-px bg-kawai-red mx-auto" />
        </div>
      )}

      {/* Main two-column panel: Map left, info/form right */}
      <div className="container mx-auto px-6 pb-12">
        <div className="relative bg-white rounded-2xl shadow-brand-premium overflow-hidden">
          <div className="grid lg:grid-cols-5 min-h-[600px]">
            {/* ── Left: Google Maps ── */}
            <div className="lg:col-span-3 relative">
              {googleMapsEmbedUrl ? (
                <iframe
                  src={googleMapsEmbedUrl}
                  title="Location map"
                  width="100%"
                  height="600"
                  className="block border-0 w-full h-[400px] lg:h-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                /* Placeholder when no URL configured */
                <div className="w-full h-[400px] lg:h-full bg-kawai-pearl/60 flex items-center justify-center">
                  <div className="text-center space-y-2 text-kawai-black/40">
                    <PinIcon className="w-10 h-10 mx-auto" />
                    <p className="text-sm font-medium">Map embed URL not set</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Contact info or CC form ── */}
            <div className="lg:col-span-2 p-10 flex flex-col justify-center bg-white">
              {showContactForm && constantContactFormId ? (
                <ConstantContactForm
                  formId={constantContactFormId}
                  {...(contactFormHeading !== undefined && { heading: contactFormHeading })}
                  {...(contactFormDescription !== undefined && { description: contactFormDescription })}
                />
              ) : (
                /* Default: contact details + hours */
                <div className="space-y-7">
                  {venueName && (
                    <div>
                      <h3 className="text-2xl font-serif text-kawai-black leading-snug mb-1">
                        {venueName}
                      </h3>
                      <div className="w-12 h-px bg-kawai-red" />
                    </div>
                  )}

                  {/* Address */}
                  {fullAddress && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-kawai-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <PinIcon className="w-4 h-4 text-kawai-red" />
                      </div>
                      <div>
                        <p className="text-kawai-black font-medium text-sm mb-0.5">Address</p>
                        <p className="text-kawai-black/70 text-sm leading-relaxed">{fullAddress}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-kawai-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <PhoneIcon className="w-4 h-4 text-kawai-red" />
                      </div>
                      <div>
                        <p className="text-kawai-black font-medium text-sm mb-0.5">Phone</p>
                        <a
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          className="text-kawai-black/70 hover:text-kawai-red transition-colors text-sm"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {email && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-kawai-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <EmailIcon className="w-4 h-4 text-kawai-red" />
                      </div>
                      <div>
                        <p className="text-kawai-black font-medium text-sm mb-0.5">Email</p>
                        <a
                          href={`mailto:${email}`}
                          className="text-kawai-black/70 hover:text-kawai-red transition-colors text-sm break-all"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Get Directions button */}
                  {fullAddress && (
                    <a
                      href={`https://maps.google.com?q=${encodeURIComponent(fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full bg-kawai-red hover:bg-kawai-red-700 text-white py-3 text-center font-medium transition-colors text-sm tracking-wide uppercase rounded-lg"
                    >
                      Get Directions
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hours strip */}
      {hours && hours.length > 0 && (
        <div className="container mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl shadow-brand-medium p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-kawai-red/10 flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-4 h-4 text-kawai-red" />
              </div>
              <h3 className="text-xl font-serif text-kawai-black">Hours</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3">
              {hours.map((row, i) => (
                <div
                  key={row.id ?? i}
                  className={cn(
                    'flex justify-between items-baseline py-2 border-b border-kawai-neutral/60',
                    'text-sm',
                  )}
                >
                  <span className="text-kawai-black font-medium mr-4">{row.dayLabel}</span>
                  <span className="text-kawai-black/70 whitespace-nowrap">{row.hoursText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
