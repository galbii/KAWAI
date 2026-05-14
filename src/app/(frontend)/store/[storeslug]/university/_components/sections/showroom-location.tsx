'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import type { LocationConfig } from '../../event.config';

interface ShowroomLocationProps {
  eventLocation: LocationConfig
}

export function ShowroomLocation({ eventLocation }: ShowroomLocationProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const formElement = document.querySelector('.ctct-inline-form');
      if (!formElement || formElement.children.length === 0) {
        console.log('Constant Contact form not loaded, showing fallback');
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        id="ctct-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _ctct_m = "${eventLocation.constantContactFormId ?? '1cf63f1b41f15055378de822630a40df'}";
          `
        }}
      />
      <Script
        id="signupScript"
        src="https://static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js"
        strategy="afterInteractive"
        onError={() => {
          console.warn('Failed to load Constant Contact script');
          setShowFallback(true);
        }}
      />

      <section
        className="relative border-t border-[rgba(77,25,121,0.12)]"
        style={{ backgroundColor: '#FAFAFE' }}
      >
        <div className="container mx-auto px-6 pt-24 pb-8 text-center">
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(26,13,46,0.45)' }}>
            Find Us
          </p>
          <h2 className="font-heading italic text-[#1a0d2e] text-5xl md:text-6xl leading-tight mb-0">
            Contact Us
          </h2>
        </div>

        <div className="container mx-auto px-6 pb-12">
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ backgroundColor: '#F4F0FB', borderColor: 'rgba(77,25,121,0.15)' }}
          >
            <div className="grid lg:grid-cols-5 min-h-[600px]">
              <div className="lg:col-span-3 relative">
                <div
                  className="w-full h-[600px] overflow-hidden"
                  style={{ borderRight: '1px solid rgba(77,25,121,0.15)', borderRadius: 0 }}
                >
                  <iframe
                    width="100%"
                    height="600"
                    style={{ border: 0, display: 'block' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={eventLocation.googleMapsEmbedUrl ?? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(eventLocation.address)}&zoom=15`}
                  />
                </div>
              </div>

              <div className="lg:col-span-2 p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="font-heading italic text-[#1a0d2e] text-3xl leading-tight mb-3">
                    Get In Touch
                  </h3>
                  <div className="w-16 h-px mb-6" style={{ backgroundColor: '#4D1979' }} />
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#3a2060' }}>
                    Send us a message and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {!showFallback ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `
                        <!-- Begin Constant Contact Inline Form Code -->
                        <div class="ctct-inline-form" data-form-id="${eventLocation.constantContactFormId ?? '3ba8c9c8-796d-41fd-987f-7a506d7e03be'}"></div>
                        <!-- End Constant Contact Inline Form Code -->
                      `
                    }}
                  />
                ) : (
                  <div>
                    <div
                      className="mb-4 p-3 rounded-lg border"
                      style={{ backgroundColor: 'rgba(77,25,121,0.05)', borderColor: 'rgba(77,25,121,0.15)' }}
                    >
                      <p className="text-sm" style={{ color: 'rgba(26,13,46,0.65)' }}>
                        Having trouble loading the form? Use this contact form instead.
                      </p>
                    </div>
                    <form className="space-y-4" action="mailto:info@kawaipianosdallas.com" method="post" encType="text/plain">
                      <div>
                        <label htmlFor="fallback-name" className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(26,13,46,0.45)' }}>Name</label>
                        <input
                          type="text"
                          id="fallback-name"
                          name="name"
                          className="w-full px-4 py-3 rounded focus:outline-none transition-colors"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(77,25,121,0.15)',
                            color: '#1a0d2e',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.5)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.15)')}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="fallback-email" className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(26,13,46,0.45)' }}>Email</label>
                        <input
                          type="email"
                          id="fallback-email"
                          name="email"
                          className="w-full px-4 py-3 rounded focus:outline-none transition-colors"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(77,25,121,0.15)',
                            color: '#1a0d2e',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.5)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.15)')}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="fallback-phone" className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(26,13,46,0.45)' }}>Phone</label>
                        <input
                          type="tel"
                          id="fallback-phone"
                          name="phone"
                          className="w-full px-4 py-3 rounded focus:outline-none transition-colors"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(77,25,121,0.15)',
                            color: '#1a0d2e',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.5)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.15)')}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="fallback-message" className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(26,13,46,0.45)' }}>Message</label>
                        <textarea
                          id="fallback-message"
                          name="message"
                          rows={4}
                          className="w-full px-4 py-3 rounded focus:outline-none transition-colors resize-none"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(77,25,121,0.15)',
                            color: '#1a0d2e',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.5)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(77,25,121,0.15)')}
                          placeholder="Tell us about your piano interests..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        style={{
                          background: '#4D1979',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: 600,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          padding: '14px 32px',
                          border: 'none',
                          width: '100%',
                          cursor: 'pointer',
                        }}
                      >
                        Send Email
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-24">
          <div
            className="rounded-2xl p-12 border"
            style={{ backgroundColor: '#F4F0FB', borderColor: 'rgba(77,25,121,0.15)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="space-y-4">
                <h3 className="font-heading italic text-[#1a0d2e] text-xl leading-tight mb-3">
                  {eventLocation.venueName}
                </h3>
                <div className="flex items-start space-x-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
                    style={{ backgroundColor: 'rgba(77,25,121,0.12)' }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#4D1979' }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(26,13,46,0.45)' }}>Address</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#3a2060' }}>
                      {eventLocation.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
                    style={{ backgroundColor: 'rgba(77,25,121,0.12)' }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#4D1979' }}>
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(26,13,46,0.45)' }}>Phone</p>
                    <a
                      href={`tel:${eventLocation.phone}`}
                      className="transition-colors text-sm"
                      style={{ color: '#3a2060' }}
                    >
                      {eventLocation.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
                    style={{ backgroundColor: 'rgba(77,25,121,0.12)' }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#4D1979' }}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(26,13,46,0.45)' }}>Service Area</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#3a2060' }}>
                      {eventLocation.venueName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(26,13,46,0.45)' }}>Event Hours</p>
                <div className="space-y-0 text-sm">
                  {eventLocation.hours.map((hour, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2"
                      style={{
                        borderBottom: '1px solid rgba(77,25,121,0.08)',
                        backgroundColor: hour.highlight ? 'rgba(77,25,121,0.10)' : 'transparent',
                        paddingLeft: hour.highlight ? '8px' : undefined,
                        paddingRight: hour.highlight ? '8px' : undefined,
                      }}
                    >
                      <span style={{ color: '#3a2060' }}>{hour.day}</span>
                      <span style={{ color: '#1a0d2e' }}>{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`https://maps.google.com?q=${encodeURIComponent(eventLocation.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    background: '#4D1979',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '14px 32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
