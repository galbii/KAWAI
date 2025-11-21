'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import useCalendlyTracking, { type CalendlyPrefillData } from '@/hooks/useCalendlyTracking';
import QuickContactForm from './QuickContactForm';
import './types/calendly';

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
 * 3. After Calendly booking completes → Submit to Constant Contact (TSU LEADS list)
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
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  // Two-step flow state
  const [showForm, setShowForm] = useState(true);
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const [prefillData, setPrefillData] = useState<CalendlyPrefillData | undefined>(undefined);
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

  // Memoize tracking config to prevent unnecessary re-renders
  const trackingConfig = useMemo(() => ({
    eventName: 'TSU Piano Sale',
    posthogEventName: 'tsu_piano_booking_modal',
    metaPixel: {
      content_name: 'TSU Piano Sale Consultation (Modal)',
      content_category: 'appointment_booking',
      value: 1000,
      currency: 'USD',
      status: 'calendly_booking_modal'
    },
    constantContact: {
      enabled: true,
      targetList: 'TSU LEADS',
      createListIfMissing: true,
      showAuthPrompts: false
    },
    additionalData: {
      source: 'university-modal-popup',
      campaign: 'tsu-piano-sale-2025'
    }
  }), []);

  // Set up comprehensive Calendly tracking
  // Only active when we have prefillData and Calendly is loaded
  useCalendlyTracking(trackingConfig, prefillData);

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

  const initializeFallbackWidget = useCallback(() => {
    console.log('🔄 Initializing fallback Calendly widget...');

    let attempts = 0;
    const maxAttempts = 100; // 10 seconds timeout (100 * 100ms)

    const waitForCalendly = () => {
      attempts++;

      if (window.Calendly && window.Calendly.initInlineWidget && calendlyContainerRef.current) {
        try {
          // Clear container first
          calendlyContainerRef.current.innerHTML = '';

          // Build prefill object if data available
          const prefillConfig: Record<string, string> = {};
          if (prefillData?.email) prefillConfig.email = prefillData.email;
          if (prefillData?.firstName) prefillConfig.firstName = prefillData.firstName;
          if (prefillData?.lastName) prefillConfig.lastName = prefillData.lastName;
          if (prefillData?.firstName && prefillData?.lastName) {
            prefillConfig.name = `${prefillData.firstName} ${prefillData.lastName}`;
          }

          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/tsu-kawai-piano-sale',
            parentElement: calendlyContainerRef.current,
            ...(Object.keys(prefillConfig).length > 0 ? { prefill: prefillConfig } : {}),
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'modal',
              utmCampaign: 'tsu-piano-sale-2025'
            }
          });

          console.log('✅ Fallback Calendly widget initialized successfully with prefill:', prefillConfig);
          setIsCalendlyLoading(false);
        } catch (error) {
          console.error('❌ Failed to initialize fallback Calendly widget:', error);
          setIsCalendlyLoading(false);
        }
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Waiting for Calendly for fallback widget... (${attempts}/${maxAttempts})`);
        setTimeout(waitForCalendly, 100);
      } else {
        console.error('❌ Calendly failed to load after 10 seconds timeout');
        setIsCalendlyLoading(false);
        if (calendlyContainerRef.current) {
          calendlyContainerRef.current.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background: #f9f9f9; padding: 40px;">
              <div style="text-align: center;">
                <h3 style="color: #dc2626; margin-bottom: 16px; font-size: 18px;">Unable to load booking calendar</h3>
                <p style="color: #6b7280; margin-bottom: 24px; font-size: 14px;">Please try one of these alternatives:</p>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <a href="https://calendly.com/kawaipianogallery/tsu-kawai-piano-sale"
                     target="_blank"
                     style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Book directly on Calendly →
                  </a>
                  <a href="tel:+1-713-904-0001"
                     style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Call (713) 904-0001
                  </a>
                </div>
              </div>
            </div>
          `;
        }
      }
    };

    waitForCalendly();
  }, [prefillData]);

  const movePreloadedWidget = useCallback(() => {
    const preloadedWidget = document.getElementById('calendly-preloaded-widget');
    const modalContainer = calendlyContainerRef.current;

    console.log('🔍 Checking for preloaded widget...', {
      preloadedWidget: !!preloadedWidget,
      modalContainer: !!modalContainer,
      preloadedContent: preloadedWidget?.innerHTML?.length || 0
    });

    if (preloadedWidget && modalContainer && preloadedWidget.innerHTML.trim().length > 0) {
      // Move the preloaded widget content to the modal
      const widgetContent = preloadedWidget.innerHTML;
      modalContainer.innerHTML = widgetContent;

      // Apply modal-specific styles
      modalContainer.style.width = '100%';
      modalContainer.style.height = '100%';
      modalContainer.style.position = 'relative';
      modalContainer.style.minWidth = '320px';

      console.log('✅ Preloaded widget moved to modal - instant display!');
      setIsCalendlyLoading(false);
    } else {
      console.warn('⚠️ Preloaded widget not ready, initializing new widget...');
      // Fallback: initialize a new widget
      initializeFallbackWidget();
    }
  }, [initializeFallbackWidget]);

  const returnWidgetToPreloader = useCallback(() => {
    const preloadedWidget = document.getElementById('calendly-preloaded-widget');
    const modalContainer = calendlyContainerRef.current;

    if (preloadedWidget && modalContainer) {
      // Return the widget content to the preloader
      preloadedWidget.innerHTML = modalContainer.innerHTML;
      modalContainer.innerHTML = '';

      console.log('🔄 Widget returned to preloader for next use');
    }
  }, []);

  // Handle dialog open/close and Calendly loading
  useEffect(() => {
    if (isOpen && shouldLoadCalendly) {
      // Use the preloaded widget instead of initializing a new one
      console.log('🚀 Using preloaded Calendly widget for instant display');
      setIsCalendlyLoading(true);
      movePreloadedWidget();
    }

    return () => {
      if (isOpen && shouldLoadCalendly) {
        // Return the widget to the preloader when modal closes
        returnWidgetToPreloader();
      }
    };
  }, [isOpen, shouldLoadCalendly, movePreloadedWidget, returnWidgetToPreloader]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      // Reset to initial state
      setShowForm(true);
      setShouldLoadCalendly(false);
      setPrefillData(undefined);
      setIsCalendlyLoading(true);
    }
  }, [isOpen]);

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
          {!showForm && shouldLoadCalendly && (
            <div
              ref={calendlyContainerRef}
              className="calendly-inline-widget-container"
              style={{
                minWidth: '320px',
                height: '100%',
                width: '100%',
                position: 'relative',
                display: isCalendlyLoading ? 'none' : 'block'
              }}
            >
              {/* Container will be populated by Calendly */}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
