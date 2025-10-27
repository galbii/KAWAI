'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { InlineWidget } from 'react-calendly';
import useCalendlyTracking from '@/hooks/useCalendlyTracking';

/**
 * BookingSection Component
 *
 * Displays a Calendly booking widget for UTA x KAWAI Piano Sale consultations.
 * Integrates with Meta Pixel, PostHog, and Constant Contact for comprehensive tracking.
 *
 * Features:
 * - Lazy loading with Intersection Observer (performance optimization)
 * - Loading skeleton for better UX
 * - Comprehensive event tracking via useCalendlyTracking hook
 * - UTM parameters for campaign tracking
 * - React Calendly InlineWidget component (reliable React implementation)
 * - Customized Calendly branding (KAWAI red color scheme)
 */

// Calendly configuration
const CALENDLY_URL = 'https://calendly.com/kawaipianogallery/uta-x-kawai-piano-sale';
const CALENDLY_HEIGHT = '700px';

export default function BookingSection() {
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Memoize tracking config to prevent unnecessary re-renders and callback recreation
  // This prevents multiple event listeners from accumulating
  const trackingConfig = useMemo(() => ({
    eventName: 'UTA x KAWAI Piano Sale',
    posthogEventName: 'uta_piano_booking',
    metaPixel: {
      content_name: 'UTA x KAWAI Piano Sale Consultation',
      content_category: 'appointment_booking',
      value: 1000,
      currency: 'USD',
      status: 'calendly_booking'
    },
    constantContact: {
      enabled: true,
      targetList: 'UTA LEADS',
      createListIfMissing: true,
      showAuthPrompts: false
    },
    additionalData: {
      source: 'arlington-landing-page',
      campaign: 'uta-piano-sale-2025'
    }
  }), []); // Empty deps - config never changes

  // Set up comprehensive Calendly tracking with Meta Pixel, PostHog, and Constant Contact
  // This hook automatically listens for Calendly events and fires all tracking
  useCalendlyTracking(trackingConfig);

  // Intersection Observer for lazy loading
  // Only loads Calendly when the section is about to come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          console.log('📍 Booking section came into view, loading Calendly widget...');
          setShouldLoadCalendly(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px' // Pre-load when within 200px of viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle widget loading state
  useEffect(() => {
    if (!shouldLoadCalendly) return;

    // Show loading state for a brief moment while Calendly initializes
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('✅ Calendly widget ready');
    }, 1500);

    return () => clearTimeout(timer);
  }, [shouldLoadCalendly]);

  return (
    <section
      ref={sectionRef}
      id="booking-consultation"
      className="bg-kawai-pearl py-16"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div>
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-kawai-black mb-4">
              Schedule Your Piano Consultation
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-kawai-black/70 max-w-2xl mx-auto">
              Get personalized recommendations from our expert piano consultants. Select a convenient time for your one-on-one session.
            </p>
          </div>

          {/* Loading skeleton - shown before Calendly loads */}
          {!shouldLoadCalendly && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading booking calendar...</p>
                <p className="text-sm text-gray-500 mt-2">Preparing your consultation options</p>
              </div>
              {/* Calendar skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(35)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Calendly Widget - rendered when section comes into view */}
          {shouldLoadCalendly && (
            <div className="relative">
              {/* Loading overlay - shown briefly while widget initializes */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10 rounded-lg">
                  <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-600 text-sm font-medium">Loading calendar...</p>
                  </div>
                </div>
              )}

              {/* Calendly InlineWidget Component */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <InlineWidget
                  url={CALENDLY_URL}
                  styles={{
                    height: CALENDLY_HEIGHT,
                    minWidth: '320px',
                    width: '100%'
                  }}
                  pageSettings={{
                    backgroundColor: 'ffffff',
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: 'C41E3A', // KAWAI red
                    textColor: '2C2C2C' // KAWAI charcoal
                  }}
                  utm={{
                    utmSource: 'kawai-landing-page',
                    utmMedium: 'booking-section',
                    utmCampaign: 'uta-piano-sale-2025'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
