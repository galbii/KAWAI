'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LocationSectionProps {
  locationName?: string
  address?: string
  phone?: string
  spotsRemaining?: number
  onCTAClick?: () => void
}

function LocationSectionComponent({ locationName, address, phone, spotsRemaining = 20, onCTAClick }: LocationSectionProps) {
  if (!address) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Map and Info Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Google Maps Embed */}
            <div className="relative h-[400px] lg:h-[500px]">
              <iframe
                title={locationName ? `Map of ${locationName}` : 'Map of event location'}
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(address)}&zoom=15`}
                width="100%"
                height={500}
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Location Info */}
            <div className="p-8 lg:p-12 bg-gray-50 flex flex-col justify-center">
              {/* Kawai Logo with Location Name */}
              <div className="flex items-center gap-3 mb-8">
                <Image
                  src="/images/logos/kawai-logo-red-2x.png"
                  alt="Kawai Piano"
                  width={140}
                  height={28}
                  className="object-contain flex-shrink-0"
                  priority
                  quality={90}
                />
                {locationName && (
                  <div className="flex-shrink-0">
                    <div className="font-bold tracking-wide text-gray-900 text-xl sm:text-2xl">
                      {locationName.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6 mb-8">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Address</p>
                    <p className="text-gray-600 leading-relaxed">{address}</p>
                  </div>
                </div>

                {/* Phone */}
                {phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Phone</p>
                      <a
                        href={`tel:${phone}`}
                        className="text-kawai-red hover:text-kawai-red/80 transition-colors text-lg"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Get Directions Button */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-center mb-6"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Get Directions
              </a>

              {/* Divider */}
              <div className="h-px bg-gray-300 my-6"></div>

              {/* Spots Remaining */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Limited Spots Available</span>
                  <span className="text-2xl font-bold text-kawai-red">{spotsRemaining}/20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-kawai-red to-red-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(spotsRemaining / 20) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {spotsRemaining} spots left for this exclusive offer
                </p>
              </div>

              {/* Reserve CTA Button */}
              {onCTAClick && (
                <button
                  onClick={onCTAClick}
                  className="w-full bg-gradient-to-r from-kawai-red to-red-700 hover:from-kawai-red/90 hover:to-red-800 text-white px-8 py-5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  RESERVE MY FREE LESSON NOW
                </button>
              )}

              <p className="text-center text-sm text-gray-600 mt-4">
                🔒 No credit card required • No obligation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Memoize to prevent unnecessary re-renders of the map
export default memo(LocationSectionComponent)
