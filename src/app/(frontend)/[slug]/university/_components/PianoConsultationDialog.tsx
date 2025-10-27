'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useCalendlyEventListener } from 'react-calendly';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import { trackSubmitApplication } from '@/components/MetaPixel';
// PostHog import removed
import './types/calendly';

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PianoConsultationDialog({ isOpen, onClose }: PianoConsultationDialogProps) {
  // PostHog tracking removed
  const calendlyContainerRef = useRef<HTMLDivElement>(null);
  const [hasTrackedEvent, setHasTrackedEvent] = useState(false);

  // Set up Calendly event listeners for Meta Pixel tracking
  useCalendlyEventListener({
    onEventScheduled: (event) => {
      // Prevent duplicate tracking
      if (hasTrackedEvent) {
        console.log('⚠️ Event already tracked (Modal), skipping duplicate');
        return;
      }

      console.log('🎉 Calendly Event Scheduled via Modal (TSU Piano Sale):', event);
      console.log('📋 Event payload:', event.data?.payload);

      try {
        // Check if Meta Pixel is available
        if (typeof window !== 'undefined' && window.fbq) {
          const metaPixelData = {
            content_name: 'TSU Piano Sale Consultation',
            content_category: 'appointment_booking',
            value: 1000,
            currency: 'USD',
            status: 'calendly_booking_modal'
          };

          console.log('🎯 Meta Pixel (Modal): Firing SubmitApplication event with data:', metaPixelData);

          // Track the event using the utility function
          trackSubmitApplication(metaPixelData);

          console.log('✅ Meta Pixel SubmitApplication event fired successfully from Modal: ' + (+new Date()));

          // Mark as tracked
          setHasTrackedEvent(true);
        } else {
          console.warn('⚠️ Meta Pixel (window.fbq) not available - event not tracked (Modal)');
        }
      } catch (error) {
        console.error('❌ Error firing Meta Pixel event from Modal (non-blocking):', error);
      }
    },
    onProfilePageViewed: (event) => {
      console.log('📊 Calendly Profile Page Viewed (TSU Modal):', event);
    },
    onDateAndTimeSelected: (event) => {
      console.log('📅 Calendly Date/Time Selected (TSU Modal):', event);
    }
  });
  
  const initializeFallbackWidget = useCallback(() => {
    console.log('🔄 Initializing fallback Calendly widget...');
    
    // Initialize tracking
    // Calendly tracking removed
    
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds timeout (100 * 100ms)
    
    const waitForCalendly = () => {
      attempts++;
      
      if (window.Calendly && window.Calendly.initInlineWidget && calendlyContainerRef.current) {
        try {
          // Clear container first
          calendlyContainerRef.current.innerHTML = '';
          
          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/tsu-kawai-piano-sale',
            parentElement: calendlyContainerRef.current,
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'modal',
              utmCampaign: 'tsu-piano-sale-2025'
            }
          });
          
          console.log('✅ Fallback Calendly widget initialized successfully');
        } catch (error) {
          console.error('❌ Failed to initialize fallback Calendly widget:', error);
        }
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Waiting for Calendly for fallback widget... (${attempts}/${maxAttempts})`);
        setTimeout(waitForCalendly, 100);
      } else {
        console.error('❌ Calendly failed to load after 10 seconds timeout');
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
                  <a href="tel:+1-972-645-2514" 
                     style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Call (972) 645-2514
                  </a>
                </div>
              </div>
            </div>
          `;
        }
      }
    };
    
    waitForCalendly();
  }, []);

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
    
    // Clean up tracking
    // Calendly cleanup removed
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Modal opened tracking removed for basic setup

      // Use the preloaded widget instead of initializing a new one
      console.log('🚀 Using preloaded Calendly widget for instant display');
      movePreloadedWidget();
    }

    return () => {
      if (isOpen) {
        // Modal abandoned tracking removed for basic setup

        // Return the widget to the preloader when modal closes
        returnWidgetToPreloader();
      }
    };
  }, [isOpen, movePreloadedWidget, returnWidgetToPreloader]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[800px] p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Book Your Piano Consultation
        </DialogTitle>
        <div className="h-full overflow-hidden">
          {/* Calendly inline widget */}
          <div 
            ref={calendlyContainerRef}
            className="calendly-inline-widget-container" 
            style={{ 
              minWidth: '320px', 
              height: '100%',
              width: '100%',
              position: 'relative'
            }}
          >
            {/* Container will be populated by Calendly.initInlineWidget */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}