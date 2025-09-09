'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export function ShowroomLocation() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Set a timer to show fallback after 5 seconds if Constant Contact doesn't load
    const timer = setTimeout(() => {
      const formElement = document.querySelector('.ctct-inline-form');
      if (!formElement || formElement.children.length === 0) {
        console.log('Constant Contact form not loaded, showing fallback');
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const showroomInfo = {
    name: 'Kawai Piano Gallery Dallas',
    address: '601 W. Plano Parkway, Suite 153, Plano, TX 75075',
    website: 'https://www.kawaipianosdallas.com/',
    phone: '(972) 645-2514',
    serviceArea: 'Serving Dallas, Texas and surrounding areas',
    hours: [
      { day: 'Monday', time: '10:00 am–7:00 pm' },
      { day: 'Tuesday', time: '10:00 am–7:00 pm' },
      { day: 'Wednesday', time: '10:00 am–7:00 pm' },
      { day: 'Thursday', time: '10:00 am–7:00 pm' },
      { day: 'Friday', time: '10:00 am–7:00 pm' },
      { day: 'Saturday', time: '10:00 am–6:00 pm' },
      { day: 'Sunday', time: '1:00 pm–5:00 pm' }
    ]
  };

  return (
    <>
      {/* Constant Contact Active Forms - Universal Code */}
      <Script 
        id="ctct-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _ctct_m = "1cf63f1b41f15055378de822630a40df";
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
      
      <section className="relative bg-gradient-to-b from-white via-kawai-pearl/20 to-kawai-pearl/40">
        {/* Section Header */}
        <div className="container mx-auto px-6 pt-24 pb-8 text-center">
          <h2 className="text-5xl md:text-6xl font-light font-serif text-kawai-black mb-4 leading-tight">
            Contact Us
          </h2>
        </div>

        {/* Middle Section - Map and Contact Form */}
        <div className="container mx-auto px-6 pb-12">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-5 min-h-[600px]">
              {/* Map - Left Side */}
              <div className="lg:col-span-3 relative">
                <div className="w-full h-[600px]">
                  <iframe
                    width="100%"
                    height="600"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=601+W+Plano+Parkway+Suite+153+Plano+TX+75075&zoom=15`}
                  />
                </div>
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/5 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Contact Form - Right Side */}
              <div className="lg:col-span-2 p-12 flex flex-col justify-center bg-gradient-to-br from-white to-kawai-pearl/30">
                <div className="mb-8">
                  <h3 className="text-3xl font-serif text-kawai-black mb-3 leading-tight">
                    Get In Touch
                  </h3>
                  <div className="w-16 h-px bg-kawai-red mb-6"></div>
                  <p className="text-kawai-black/70 text-sm leading-relaxed mb-6">
                    Send us a message and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>
                
                {/* Constant Contact Form with Fallback */}
                {!showFallback ? (
                  <div 
                    dangerouslySetInnerHTML={{
                      __html: `
                        <!-- Begin Constant Contact Inline Form Code -->
                        <div class="ctct-inline-form" data-form-id="3ba8c9c8-796d-41fd-987f-7a506d7e03be"></div>
                        <!-- End Constant Contact Inline Form Code -->
                      `
                    }}
                  />
                ) : (
                  /* Fallback Contact Form */
                  <div>
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Having trouble loading the form? Use this contact form instead.
                      </p>
                    </div>
                    <form className="space-y-4" action="mailto:info@kawaipianosdallas.com" method="post" encType="text/plain">
                      <div>
                        <label htmlFor="fallback-name" className="block text-sm font-medium text-kawai-black mb-2">Name</label>
                        <input 
                          type="text" 
                          id="fallback-name"
                          name="name"
                          className="w-full px-4 py-3 border border-kawai-black/20 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="fallback-email" className="block text-sm font-medium text-kawai-black mb-2">Email</label>
                        <input 
                          type="email" 
                          id="fallback-email"
                          name="email"
                          className="w-full px-4 py-3 border border-kawai-black/20 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="fallback-phone" className="block text-sm font-medium text-kawai-black mb-2">Phone</label>
                        <input 
                          type="tel" 
                          id="fallback-phone"
                          name="phone"
                          className="w-full px-4 py-3 border border-kawai-black/20 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="fallback-message" className="block text-sm font-medium text-kawai-black mb-2">Message</label>
                        <textarea 
                          id="fallback-message"
                          name="message"
                          rows={4}
                          className="w-full px-4 py-3 border border-kawai-black/20 rounded-lg focus:ring-2 focus:ring-kawai-red focus:border-transparent resize-none"
                          placeholder="Tell us about your piano interests..."
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-kawai-red hover:bg-kawai-black text-white py-3 px-6 rounded-lg font-medium transition-colors text-sm tracking-wide uppercase"
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

        {/* Bottom Section - Contact Information */}
        <div className="container mx-auto px-6 pb-24">
          <div className="bg-white rounded-2xl shadow-2xl p-12 bg-gradient-to-br from-white to-kawai-pearl/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Showroom Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-kawai-black mb-3 leading-tight">
                  {showroomInfo.name}
                </h3>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-kawai-black font-medium text-sm mb-1">Address</p>
                    <p className="text-kawai-black/70 text-sm leading-relaxed">
                      {showroomInfo.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-kawai-black font-medium text-sm mb-1">Phone</p>
                    <a 
                      href={`tel:${showroomInfo.phone}`} 
                      className="text-kawai-black/70 hover:text-kawai-red transition-colors text-sm"
                    >
                      {showroomInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-kawai-black font-medium text-sm mb-1">Service Area</p>
                    <p className="text-kawai-black/70 text-sm leading-relaxed">
                      {showroomInfo.serviceArea}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="space-y-4">
                <h4 className="text-kawai-black font-medium text-sm mb-3">Hours</h4>
                <div className="space-y-2 text-sm text-kawai-black/70">
                  <div className="flex justify-between">
                    <span>Mon – Fri</span>
                    <span>10am – 7pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10am – 6pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>1pm – 5pm</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <a 
                  href={`https://maps.google.com?q=${encodeURIComponent(showroomInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-kawai-red hover:bg-kawai-black text-white py-3 text-center font-medium transition-colors text-sm tracking-wide uppercase rounded-lg"
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