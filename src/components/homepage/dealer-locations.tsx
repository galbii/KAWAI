'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Storefront } from '@/payload-types';

interface DealerLocationsData {
  sectionLabel?: string
  sectionDescription?: string
  ctaSubheading?: string
  ctaButtonText?: string
  ctaButtonLink?: string
}

interface DealerLocationsProps {
  className?: string;
  locations?: Storefront[];
  data?: DealerLocationsData; // NEW: Accept CMS data
}

export function DealerLocations({ className = '', locations = [], data }: DealerLocationsProps) {
  // Use CMS data if provided, fallback to hardcoded
  const sectionLabel = data?.sectionLabel || 'Our Locations'
  const sectionDescription = data?.sectionDescription || 'Visit our Kawai Showrooms and experience our complete collection of acoustic and digital pianos with expert consultation.'
  const ctaSubheading = data?.ctaSubheading || "Can't find a location near you?"
  const ctaButtonText = data?.ctaButtonText || 'Find Your Perfect Piano'
  const ctaButtonLink = data?.ctaButtonLink || '/piano-finder'
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (locations.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} id="dealer-locations" className={`relative bg-[#F5F5F5] py-16 sm:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header with mobile optimization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="mb-4 sm:mb-6 flex justify-center">
            <Image
              src="/images/Kawai (Red)(2).png"
              alt="KAWAI"
              width={300}
              height={90}
              className="h-12 sm:h-16 md:h-20 w-auto"
              priority
            />
          </div>
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-6 sm:mb-8">
            {sectionLabel}
          </div>
          <p className="text-lg sm:text-xl text-kawai-black/70 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            {sectionDescription}
          </p>
        </motion.div>

        {/* Dealer Locations Grid - Mobile first approach */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
            >
              <Link
                href={`/store/${location.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 touch-manipulation h-[480px] flex flex-col block"
              >
              <div className="p-6 sm:p-8 flex flex-col h-full">
                {/* Location Header */}
                <div className="mb-4 sm:mb-6 flex-shrink-0">
                  <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-2 sm:mb-3">
                    {location.locationText || 'Kawai Showroom'}
                  </div>
                  {/* Small Kawai Logo above location name */}
                  <div className="mb-3 flex justify-start">
                    <Image
                      src="/images/Kawai (Red)(2).png"
                      alt="KAWAI"
                      width={60}
                      height={18}
                      className="h-3 w-auto"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-kawai-black mb-2 group-hover:text-kawai-red transition-colors leading-tight uppercase">
                    {location.locationName}
                  </h3>
                  <div className="w-12 h-px bg-kawai-red opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Location Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 h-[120px] flex-shrink-0">
                  {location.showroomInfo?.address && (
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-kawai-black/70 leading-relaxed line-clamp-2">
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
                      <p className="text-xs sm:text-sm text-kawai-black/70">
                        {location.showroomInfo.phone}
                      </p>
                    </div>
                  )}

                  {location.establishedText && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-kawai-red/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-kawai-red" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-kawai-black/70">
                        {location.establishedText.replace(/^Est\.\s*\d{4}\s*•\s*/, '')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                <div className="mb-4 sm:mb-6 h-[72px] flex-shrink-0 overflow-hidden">
                  {location.features && location.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {location.features.slice(0, 2).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-kawai-red/10 text-kawai-red text-xs font-medium rounded-full"
                        >
                          {feature.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visit Button */}
                <div className="pt-3 sm:pt-4 border-t border-kawai-pearl mt-auto flex-shrink-0">
                  <div className="flex items-center justify-between min-h-[44px]">
                    <span className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors">
                      Visit Showroom
                    </span>
                    <div className="w-8 h-8 sm:w-6 sm:h-6 bg-kawai-red/10 group-hover:bg-kawai-red rounded-full flex items-center justify-center transition-colors">
                      <svg 
                        className="w-4 h-4 sm:w-3 sm:h-3 text-kawai-red group-hover:text-white transition-colors transform group-hover:translate-x-0.5" 
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
            </motion.div>
          ))}
        </div>

        {/* Call to Action - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 sm:mt-16 px-4 sm:px-0"
        >
          <p className="text-kawai-black/70 mb-6 text-base sm:text-lg">
            {ctaSubheading}
          </p>
          <Link
            href={ctaButtonLink}
            className="inline-flex items-center space-x-2 bg-kawai-red hover:bg-kawai-black text-white px-6 sm:px-8 py-3 sm:py-4 font-medium transition-colors text-sm tracking-wide uppercase rounded-lg min-h-[44px] touch-manipulation"
          >
            <span>{ctaButtonText}</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}