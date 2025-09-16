'use client';

import { useState, useEffect, useRef } from 'react';
// import { LoadingSkeleton } from '../ui/loading-skeleton';
// Calendly tracking imports removed
// Calendly debug utilities removed
import '../types/calendly';

export default function BookingSection() {
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [shouldLoadCalendly, setShouldLoadCalendly] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const calendlyContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Calendly when section should load
  useEffect(() => {
    if (!shouldLoadCalendly) return;

    // Capture ref value at the beginning to avoid stale closure warnings
    const containerElement = calendlyContainerRef.current;

    console.log('🔄 Starting standalone Calendly initialization...');
    console.log('Container ref available:', !!containerElement);

    // Initialize tracking first
    // Calendly tracking initialization removed
    
    // Add error handlers for common issues
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('ReCaptcha') || errorMessage.includes('recaptcha')) {
        console.warn('🔒 ReCAPTCHA issue detected. This is usually caused by:');
        console.warn('- Ad blockers blocking Google domains');
        console.warn('- Network restrictions');
        console.warn('- Privacy extensions');
        console.warn('- Corporate firewall settings');
        console.warn('The booking form should still work, but may require manual verification.');
      }
      originalError.apply(console, args);
    };
    
    const initializeWidget = () => {
      console.log('🔧 Attempting standalone widget initialization...');
      console.log('Window.Calendly available:', !!window.Calendly);
      console.log('Container available:', !!calendlyContainerRef.current);
      console.log('initInlineWidget method:', !!window.Calendly?.initInlineWidget);
      
      if (calendlyContainerRef.current && window.Calendly && window.Calendly.initInlineWidget) {
        console.log('🚀 Initializing Calendly inline widget standalone');
        
        try {
          // Safe DOM cleanup - only clear if container has content
          if (calendlyContainerRef.current.hasChildNodes()) {
            console.log('🧹 Cleaning existing content from container...');
            // Use safer cleanup method
            while (calendlyContainerRef.current.firstChild) {
              calendlyContainerRef.current.removeChild(calendlyContainerRef.current.firstChild);
            }
          }
          
          // Wait a moment for DOM to settle
          setTimeout(() => {
            if (calendlyContainerRef.current && window.Calendly?.initInlineWidget) {
              try {
                console.log('🚀 Initializing Calendly widget...');
                
                // Initialize the Calendly widget
                window.Calendly.initInlineWidget({
                  url: 'https://calendly.com/kawaipianogallery/utd-x-kawai-piano-sale',
                  parentElement: calendlyContainerRef.current,
                  utm: {
                    utmSource: 'kawai-landing-page',
                    utmMedium: 'booking-section',
                    utmCampaign: 'utd-piano-sale-2025'
                  }
                });
                
                console.log('📞 Calendly initInlineWidget called, waiting for content...');
                
                // Don't set loaded immediately - wait for actual content
                checkForWidgetContent();
                
              } catch (initError) {
                console.error('❌ Failed during Calendly widget initialization:', initError);
                setIsCalendlyLoaded(false);
              }
            }
          }, 100); // Small delay to ensure DOM is ready
          
          // Function to check if widget content actually appeared
          const checkForWidgetContent = () => {
            let attempts = 0;
            const maxAttempts = 50; // 10 seconds
            
            const checkContent = () => {
              attempts++;
              
              if (!calendlyContainerRef.current) {
                console.log('❌ Container ref lost');
                return;
              }
              
              // Look for Calendly iframe or widget content
              const iframe = calendlyContainerRef.current.querySelector('iframe');
              const calendlyDiv = calendlyContainerRef.current.querySelector('.calendly-wrapper');
              const hasContent = calendlyContainerRef.current.children.length > 0;
              
              console.log(`🔍 Content check ${attempts}:`, {
                hasIframe: !!iframe,
                hasCalendlyDiv: !!calendlyDiv,
                totalChildren: calendlyContainerRef.current.children.length,
                innerHTML: calendlyContainerRef.current.innerHTML.slice(0, 200)
              });
              
              if (iframe || calendlyDiv || (hasContent && attempts > 10)) {
                console.log('✅ Calendly widget content detected!');
                setIsCalendlyLoaded(true);
                
                // Check for any ReCAPTCHA errors in the widget
                setTimeout(() => {
                  const errorMessages = calendlyContainerRef.current?.querySelectorAll('[class*="error"], [class*="warning"]');
                  if (errorMessages && errorMessages.length > 0) {
                    console.warn('⚠️ Potential issues detected in Calendly widget:', Array.from(errorMessages).map(el => el.textContent));
                  }
                }, 2000);
                
                return;
              }
              
              if (attempts >= maxAttempts) {
                console.error('❌ Calendly widget content never appeared');
                console.error('This might be due to:');
                console.error('- Network connectivity issues');
                console.error('- ReCAPTCHA loading problems');
                console.error('- Invalid Calendly URL');
                console.error('- CSP or security policy blocks');
                setIsCalendlyLoaded(false);
                return;
              }
              
              // Keep checking
              setTimeout(checkContent, 200);
            };
            
            checkContent();
          };
          
        } catch (error) {
          console.error('❌ Failed to prepare container for Calendly widget:', error);
          setIsCalendlyLoaded(false);
        }
      } else {
        console.warn('⚠️ Missing dependencies for standalone widget initialization:');
        console.warn('  - Container exists:', !!calendlyContainerRef.current);
        console.warn('  - Calendly object exists:', !!window.Calendly);
        console.warn('  - initInlineWidget method exists:', !!window.Calendly?.initInlineWidget);
        
        // If container exists but Calendly doesn't, keep trying
        if (calendlyContainerRef.current && !window.Calendly) {
          console.log('⏳ Container ready, waiting for Calendly script...');
        }
      }
    };
    
    // Wait for Calendly script to be available
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds total
    
    const waitForCalendly = () => {
      attempts++;
      console.log(`⏳ Attempt ${attempts}: Waiting for Calendly object...`);
      
      if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
        console.log('✅ Calendly object and methods now available!');
        initializeWidget();
      } else if (attempts >= maxAttempts) {
        console.error('❌ Calendly never became available after maximum attempts');
        console.error('Final state:', {
          windowCalendly: !!window.Calendly,
          initInlineWidget: !!window.Calendly?.initInlineWidget,
          container: !!calendlyContainerRef.current
        });
        setIsCalendlyLoaded(false);
      } else {
        // Keep trying every 100ms
        setTimeout(waitForCalendly, 100);
      }
    };
    
    // Start waiting for Calendly
    waitForCalendly();

    return () => {
      // Clean up tracking
      // Calendly cleanup removed
      
      // Safe DOM cleanup on unmount - use captured ref value
      if (containerElement) {
        try {
          // Clear container content safely
          while (containerElement.firstChild) {
            containerElement.removeChild(containerElement.firstChild);
          }
          console.log('🧹 Cleaned up Calendly container on unmount');
        } catch (cleanupError) {
          console.warn('⚠️ Error during cleanup (non-critical):', cleanupError);
        }
      }
    };
  }, [shouldLoadCalendly]);

  // Intersection observer for lazy loading (disabled for debugging - loads immediately)
  useEffect(() => {
    // For debugging: load immediately instead of waiting for intersection
    console.log('🔄 Loading Calendly immediately for debugging...');
    setShouldLoadCalendly(true);
    
    // Original intersection observer code (commented out for debugging)
    /*
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('📍 Booking section came into view');
          setShouldLoadCalendly(true);
        }
      },
      { 
        threshold: 0.3,
        rootMargin: '100px' // Pre-load when within 100px of viewport
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
    */
  }, []);



  return (
    <section ref={sectionRef} id="booking-consultation" className="bg-white py-16">
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

          {/* Enhanced loading state with skeleton */}
          {!shouldLoadCalendly && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="w-8 h-8 border-2 border-kawai-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading booking calendar...</p>
                <p className="text-sm text-gray-500 mt-2">Enhanced with preloaded resources</p>
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

          {/* Calendly Widget Container - only show when ready to load */}
          {shouldLoadCalendly && (
            <div className="calendly-widget-wrapper">
              {/* Calendly inline widget begin */}
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/kawaipianogallery/utd-x-kawai-piano-sale"
                style={{minWidth: '320px', height: '700px'}}
              />
              <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
              {/* Calendly inline widget end */}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}