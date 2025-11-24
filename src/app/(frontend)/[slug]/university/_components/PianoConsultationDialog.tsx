'use client';

import { useEffect, useState, useMemo } from 'react';
import { InlineWidget } from 'react-calendly';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import useCalendlyTracking, { type CalendlyPrefillData } from '@/hooks/useCalendlyTracking';
import QuickContactForm from './QuickContactForm';

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PianoConsultationDialog Component
 *
 * Two-step booking process for popup/modal consultations:
 * 1. Quick contact form to capture lead data (validates locally, no API call)
 * 2. Calendly widget with prefilled data for appointment booking
 * 3. After Calendly booking completes → Submit to Constant Contact (TSU2025 list)
 *
 * Features:
 * - Lead capture before Calendly (increases conversion + better UX with prefill)
 * - Single Constant Contact submission AFTER Calendly booking (via useCalendlyTracking)
 * - Comprehensive event tracking: Meta Pixel, PostHog, Constant Contact
 * - Preloaded widget support for instant display
 * - Fallback widget initialization if preload fails
 *
 * Flow:
 * Dialog Opens → Show Form → User Submits → Store Data → Show Calendly (prefilled) →
 * User Books → useCalendlyTracking fires → Constant Contact + Analytics
 */

export default function PianoConsultationDialog({ isOpen, onClose }: PianoConsultationDialogProps) {
  // Two-step flow state
  const [showForm, setShowForm] = useState(true);
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const [prefillData, setPrefillData] = useState<CalendlyPrefillData | undefined>(undefined);
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

  // Memoize tracking config to prevent unnecessary re-renders
  // Only enable tracking when modal is actually open to prevent duplicate events
  const trackingConfig = useMemo(() => ({
    eventName: 'TSU Piano Sale',
    posthogEventName: 'tsu_piano_booking_modal',
    enabled: isOpen, // Only track when modal is open
    metaPixel: {
      content_name: 'TSU Piano Sale Consultation (Modal)',
      content_category: 'appointment_booking',
      value: 1000,
      currency: 'USD',
      status: 'calendly_booking_modal'
    },
    constantContact: {
      enabled: true,
      targetList: 'TSU2025',
      createListIfMissing: true,
      showAuthPrompts: false,
      listDescription: 'TSU Piano Sale 2025 - Event consultation bookings'
    },
    additionalData: {
      source: 'university-modal-popup',
      campaign: 'tsu-piano-sale-2025'
    }
  }), [isOpen]);

  // Set up comprehensive Calendly tracking
  // Only active when we have prefillData and Calendly is loaded
  const { resetTracking } = useCalendlyTracking(trackingConfig, prefillData);

  // Handle form submission success
  // Note: Form only validates locally - NO Constant Contact submission yet
  // Constant Contact submission happens AFTER Calendly booking via useCalendlyTracking hook
  const handleFormSuccess = (data: { email: string; firstName: string; lastName: string }) => {
    console.log('PianoConsultationDialog: Form validated, storing data and showing Calendly:', data);

    // Store prefill data for:
    // 1. Calendly widget (better UX with prefilled form)
    // 2. useCalendlyTracking hook (submits to Constant Contact after booking)
    setPrefillData({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Hide form and show Calendly
    setShowForm(false);
    setShouldLoadCalendly(true);
  };

  // Handle skip option (if they want to book without form)
  const handleSkip = () => {
    console.log('PianoConsultationDialog: User skipped form, showing Calendly without prefill');
    setShowForm(false);
    setShouldLoadCalendly(true);
  };

  // Handle Calendly loading state
  useEffect(() => {
    if (!shouldLoadCalendly) return;

    // Show loading state for a brief moment while Calendly initializes
    const timer = setTimeout(() => {
      setIsCalendlyLoading(false);
      console.log('✅ Calendly widget ready');
    }, 1500);

    return () => clearTimeout(timer);
  }, [shouldLoadCalendly]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Reset to initial state
      setShowForm(true);
      setShouldLoadCalendly(false);
      setPrefillData(undefined);
      setIsCalendlyLoading(true);

      // Reset tracking state to allow future bookings to fire events
      resetTracking();
      console.log('🔄 Modal closed - tracking state reset');
    }
  }, [isOpen, resetTracking]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[800px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {showForm ? 'Secure Your Consultation Spot' : 'Book Your Piano Consultation'}
        </DialogTitle>
        <div className="h-full overflow-hidden">
          {/* Step 1: Contact Form - shown first */}
          {showForm && (
            <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-kawai-pearl to-white">
              <div className="w-full max-w-md">
                <QuickContactForm
                  onSuccess={handleFormSuccess}
                  onSkip={handleSkip}
                />
              </div>
            </div>
          )}

          {/* Loading state - shown while waiting for Calendly to load */}
          {!showForm && shouldLoadCalendly && isCalendlyLoading && (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-3 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-600 font-medium">Loading your personalized calendar...</p>
                {prefillData?.firstName && (
                  <p className="text-sm text-gray-500">Welcome, {prefillData.firstName}!</p>
                )}
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

            console.log('📋 Prefill data for modal Calendly:', prefillObject);

            return (
              <div className="relative h-full">
                {/* Loading overlay - shown briefly while widget initializes */}
                {isCalendlyLoading && (
                  <div className="absolute inset-0 bg-white/95 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-gray-600 text-sm font-medium">Loading calendar...</p>
                    </div>
                  </div>
                )}

                {/* Calendly InlineWidget Component with Prefill */}
                <div className="h-full">
                  <InlineWidget
                    url="https://calendly.com/kawaipianogallery/tsu-kawai-piano-sale"
                    {...(Object.keys(prefillObject).length > 0 ? { prefill: prefillObject } : {})}
                    styles={{
                      height: '100%',
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
                      utmMedium: 'modal',
                      utmCampaign: 'tsu-piano-sale-2025'
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
