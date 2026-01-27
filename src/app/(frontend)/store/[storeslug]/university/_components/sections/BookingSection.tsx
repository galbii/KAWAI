'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { InlineWidget } from 'react-calendly';
import useCalendlyTracking, { type CalendlyPrefillData } from '@/hooks/useCalendlyTracking';
import QuickContactForm from '../QuickContactForm';

/**
 * BookingSection Component
 *
 * Two-step booking process for TSU event:
 * 1. Quick contact form to capture lead data (validates locally, no API call)
 * 2. Calendly widget with prefilled data for appointment booking
 * 3. After Calendly booking completes → Submit to Constant Contact (TSU2025 list)
 *
 * Features:
 * - Lead capture before Calendly (increases conversion + better UX with prefill)
 * - Single Constant Contact submission AFTER Calendly booking (via useCalendlyTracking)
 * - Comprehensive event tracking: Meta Pixel, PostHog, Constant Contact
 * - Prefilled Calendly form for seamless booking experience
 * - UTM parameters for campaign attribution
 *
 * Flow:
 * Form Submit → Validate → Store in State → Show Calendly (prefilled) →
 * User Books → useCalendlyTracking fires → Constant Contact + Analytics
 */

// Calendly configuration
const CALENDLY_URL = 'https://calendly.com/kawaipianogallery/tsu-kawai-piano-sale';
const CALENDLY_HEIGHT = '700px';

export default function BookingSection() {
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [prefillData, setPrefillData] = useState<CalendlyPrefillData | undefined>(undefined);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Memoize tracking config to prevent unnecessary re-renders and callback recreation
  // This prevents multiple event listeners from accumulating
  const trackingConfig = useMemo(() => ({
    eventName: 'TSU Piano Sale',
    posthogEventName: 'tsu_piano_booking',
    metaPixel: {
      content_name: 'TSU Piano Sale Consultation',
      content_category: 'appointment_booking',
      value: 1000,
      currency: 'USD',
      status: 'calendly_booking'
    },
    constantContact: {
      enabled: true,
      targetList: 'TSU2025',
      createListIfMissing: true,
      showAuthPrompts: false,
      listDescription: 'TSU Piano Sale 2025 - Event consultation bookings'
    },
    additionalData: {
      source: 'university-landing-page',
      campaign: 'tsu-piano-sale-2025'
    }
  }), []); // Empty deps - config never changes

  // Set up comprehensive Calendly tracking with Meta Pixel, PostHog, and Constant Contact
  // This hook automatically listens for Calendly events and fires all tracking
  // Pass prefill data for tracking purposes
  useCalendlyTracking(trackingConfig, prefillData);

  // Handle form submission success
  // Note: Form only validates locally - NO Constant Contact submission yet
  // Constant Contact submission happens AFTER Calendly booking via useCalendlyTracking hook
  const handleFormSuccess = (data: { email: string; firstName: string; lastName: string }) => {
    console.log('BookingSection: Form validated, storing data and showing Calendly:', data);
    console.log('BookingSection: Storing prefill data with email:', data.email);

    // Store prefill data for:
    // 1. Calendly widget (better UX with prefilled form)
    // 2. useCalendlyTracking hook (submits to Constant Contact after booking)
    const prefillDataToStore = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    setPrefillData(prefillDataToStore);
    console.log('BookingSection: prefillData state updated:', prefillDataToStore);

    // Hide form and show Calendly
    setShowForm(false);
    setShouldLoadCalendly(true);
  };

  // Handle skip option (if they want to book without form)
  const handleSkip = () => {
    console.log('BookingSection: User skipped form, showing Calendly without prefill');
    setShowForm(false);
    setShouldLoadCalendly(true);
  };

  // Intersection Observer for lazy loading - no longer needed since we show form first
  // The form is lightweight and can be rendered immediately
  // Calendly only loads after form submission

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
              RSVP
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-kawai-black/70 max-w-2xl mx-auto">
              {showForm
                ? 'Lock in exclusive event pricing by claiming your appointment slot today.'
                : 'Get personalized recommendations from our expert piano consultants. Select a convenient time for your one-on-one session.'}
            </p>
          </div>

          {/* Step 1: Contact Form - shown first */}
          {showForm && (
            <QuickContactForm
              onSuccess={handleFormSuccess}
              onSkip={handleSkip}
            />
          )}

          {/* Loading state - shown while waiting for Calendly to load */}
          {!showForm && shouldLoadCalendly && isLoading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Preparing your personalized booking experience...</p>
                <p className="text-sm text-gray-500 mt-2">
                  {prefillData?.firstName && `Welcome, ${prefillData.firstName}!`}
                </p>
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

          {/* Step 2: Calendly Widget - rendered after form submission */}
          {!showForm && shouldLoadCalendly && (() => {
            // Build prefill object only with defined values (strict mode requirement)
            const prefillObject: Record<string, string> = {};
            if (prefillData?.email) {
              prefillObject.email = prefillData.email;
            }
            if (prefillData?.firstName) {
              prefillObject.firstName = prefillData.firstName;
            }
            if (prefillData?.lastName) {
              prefillObject.lastName = prefillData.lastName;
            }
            if (prefillData?.firstName && prefillData?.lastName) {
              prefillObject.name = `${prefillData.firstName} ${prefillData.lastName}`;
            }

            return (
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

                {/* Calendly InlineWidget Component with Prefill */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                  <InlineWidget
                    url={CALENDLY_URL}
                    {...(Object.keys(prefillObject).length > 0 ? { prefill: prefillObject } : {})}
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
                      utmCampaign: 'tsu-piano-sale-2025'
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
