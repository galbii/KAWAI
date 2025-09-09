import React from 'react';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { DealerLocation } from '@/payload-types';

interface DealerLocationsProps {
  className?: string;
}

export async function DealerLocations({ className = '' }: DealerLocationsProps) {
  let dealerLocations: DealerLocation[] = [];

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'dealer-locations',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 10,
      sort: '-updatedAt'
    });
    
    dealerLocations = result.docs as DealerLocation[];
  } catch (error) {
    console.error('Failed to fetch dealer locations:', error);
  }

  if (dealerLocations.length === 0) {
    return null;
  }

  return (
    <section className={`relative bg-gradient-to-b from-kawai-pearl/20 to-white py-24 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6">
            Our Locations
          </div>
          <h2 className="text-5xl md:text-6xl font-light font-serif text-kawai-black mb-8 leading-tight">
            Find Your Nearest
            <span className="text-kawai-red block">Piano Gallery</span>
          </h2>
          <p className="text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed">
            Visit our authorized Kawai storefronts and experience our complete collection of acoustic and digital pianos in person.
          </p>
        </div>

        {/* Dealer Locations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dealerLocations.map((location) => (
            <Link
              key={location.id}
              href={`/${location.slug}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="p-8">
                {/* Location Header */}
                <div className="mb-6">
                  <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-3">
                    {location.locationText || 'Authorized Dealer'}
                  </div>
                  <h3 className="text-2xl font-serif text-kawai-black mb-2 group-hover:text-kawai-red transition-colors">
                    {location.locationName}
                  </h3>
                  <div className="w-12 h-px bg-kawai-red opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Location Details */}
                <div className="space-y-4 mb-6">
                  {location.showroomInfo?.address && (
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-kawai-black/70 leading-relaxed">
                        {location.showroomInfo.address}
                      </p>
                    </div>
                  )}

                  {location.showroomInfo?.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-kawai-black/70">
                        {location.showroomInfo.phone}
                      </p>
                    </div>
                  )}

                  {location.establishedText && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <p className="text-sm text-kawai-black/70">
                        {location.establishedText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                {location.features && location.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-kawai-black mb-3">Services & Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
                        >
                          {feature.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visit Button */}
                <div className="pt-4 border-t border-kawai-pearl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors">
                      Visit Showroom
                    </span>
                    <div className="w-6 h-6 bg-kawai-red/10 group-hover:bg-kawai-red rounded-full flex items-center justify-center transition-colors">
                      <svg 
                        className="w-3 h-3 text-kawai-red group-hover:text-white transition-colors transform group-hover:translate-x-0.5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-kawai-black/70 mb-6">
            Can't find a location near you?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-kawai-red hover:bg-kawai-black text-white px-8 py-4 font-medium transition-colors text-sm tracking-wide uppercase rounded-lg"
          >
            <span>Find Authorized Storefronts</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}