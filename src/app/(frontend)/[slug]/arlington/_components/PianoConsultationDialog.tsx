'use client';

import { useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import './types/calendly';

interface CalendlyPrefillData {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface PianoConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: CalendlyPrefillData;
}

export default function PianoConsultationDialog({ isOpen, onClose, prefillData }: PianoConsultationDialogProps) {
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  // NOTE: Tracking is handled globally by BookingSection's useCalendlyTracking hook
  // useCalendlyEventListener is a GLOBAL listener that hears ALL Calendly events on the page
  // Adding another listener here would cause duplicate tracking (5x SubmitApplication events)
  // The modal is just another UI for the same Calendly booking - no separate tracking needed
  
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
          
          // Build prefill object only with defined values (strict mode requirement)
          const prefillObject: Record<string, string> = {};
          if (prefillData?.email) {
            prefillObject.email = prefillData.email;
          }
          if (prefillData?.firstName && prefillData?.lastName) {
            prefillObject.name = `${prefillData.firstName} ${prefillData.lastName}`;
          }

          window.Calendly.initInlineWidget({
            url: 'https://calendly.com/kawaipianogallery/uta-x-kawai-piano-sale',
            parentElement: calendlyContainerRef.current,
            ...(Object.keys(prefillObject).length > 0 ? { prefill: prefillObject } : {}),
            utm: {
              utmSource: 'kawai-landing-page',
              utmMedium: 'modal',
              utmCampaign: 'uta-piano-sale-2025'
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
                  <a href="https://calendly.com/kawaipianogallery/uta-x-kawai-piano-sale"
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log('🚀 Using preloaded Calendly widget for instant display');
      movePreloadedWidget();
    }

    return () => {
      if (isOpen) {
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