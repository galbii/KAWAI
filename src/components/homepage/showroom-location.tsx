'use client';

import { GoogleMapsEmbed } from '@next/third-parties/google';

export function ShowroomLocation() {

  const showroomInfo = {
    name: 'Kawai Piano Gallery St. Louis',
    address: '21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367',
    website: 'https://kawaipianostlouis.com/',
    phone: '636-265-2866',
    serviceArea: 'Serving St. Louis, St. Charles County, O\'Fallon, Wentzville & surrounding Missouri areas',
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
    <section className="relative bg-gradient-to-b from-white via-kawai-pearl/20 to-kawai-pearl/40">
      {/* Section Header */}
      <div className="container mx-auto px-6 pt-24 pb-16 text-center">
        <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
          Our Showroom
        </div>
        <h2 className="text-5xl md:text-6xl font-light font-serif text-kawai-black mb-8 leading-tight">
          Visit Our Lake St. Louis
          <span className="text-kawai-red block">Piano Gallery</span>
        </h2>
        <p className="text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
          Experience the artistry of Kawai pianos in Missouri's premier showroom. From intimate consultations 
          to comprehensive piano services, discover why discerning musicians choose our Lake St. Louis location.
        </p>
      </div>

      {/* Elegant Map Container */}
      <div className="container mx-auto px-6 pb-24">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Map Section */}
          <div className="grid lg:grid-cols-5 min-h-[600px]">
            {/* Map */}
            <div className="lg:col-span-3 relative">
              <GoogleMapsEmbed
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                height={600}
                width="100%"
                mode="place"
                q="21 Meadows Circle Drive, Suite 312, Lake St. Louis, MO 63367"
                zoom="15"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/5 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Information Panel */}
            <div className="lg:col-span-2 p-12 flex flex-col justify-center bg-gradient-to-br from-white to-kawai-pearl/30">
              {/* Showroom Title */}
              <div className="mb-8">
                <h3 className="text-3xl font-serif text-kawai-black mb-3 leading-tight">
                  {showroomInfo.name}
                </h3>
                <div className="w-16 h-px bg-kawai-red mb-6"></div>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-6 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
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

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
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

                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-kawai-red/10 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <svg className="w-3 h-3 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-kawai-black font-medium text-sm mb-1">Service Area</p>
                    <p className="text-kawai-black/70 text-xs leading-relaxed">
                      {showroomInfo.serviceArea}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mb-10">
                <h4 className="text-kawai-black font-medium text-sm mb-4">Showroom Hours</h4>
                <div className="space-y-2 text-sm text-kawai-black/70">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span>10:00am – 7:00pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00am – 6:00pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>1:00pm – 5:00pm</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <a 
                  href={`https://maps.google.com?q=${encodeURIComponent(showroomInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-kawai-red hover:bg-kawai-black text-white py-4 text-center font-medium transition-colors text-sm tracking-wide uppercase rounded-lg"
                >
                  Get Directions
                </a>
                <a 
                  href="/contact"
                  className="block w-full border-2 border-kawai-red text-kawai-red hover:bg-kawai-red hover:text-white py-4 text-center font-medium transition-colors text-sm tracking-wide uppercase rounded-lg"
                >
                  Schedule Visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-kawai-pearl py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif text-kawai-black mb-3">Expert Consultation</h3>
              <p className="text-kawai-black/70">Personalized guidance from certified Kawai specialists</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.5 8.25A2.25 2.25 0 0112.25 6v0A2.25 2.25 0 0110 8.25v7.5A2.25 2.25 0 0112.25 18v0a2.25 2.25 0 012.25-2.25h5.25A2.25 2.25 0 0122 13.5V8.25A2.25 2.25 0 0119.75 6H14.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif text-kawai-black mb-3">Full Service Center</h3>
              <p className="text-kawai-black/70">Tuning, repair, and maintenance by certified technicians</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kawai-red rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm4.64-1.96l3.54 3.54 5.66-5.66L17 9.08l-4.24 4.24-2.12-2.12L8.64 10.04z"/>
                </svg>
              </div>
              <h3 className="text-xl font-serif text-kawai-black mb-3">Financing Available</h3>
              <p className="text-kawai-black/70">Flexible payment options to make your piano dreams accessible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}