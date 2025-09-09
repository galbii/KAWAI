'use client';

import { useEffect } from 'react';
import './types/calendly';

export default function CalendlyPreloader() {
  useEffect(() => {
    // Resource preloader - warm up Calendly servers and cache resources
    const preloadCalendlyResources = () => {
      console.log('🚀 Preloading Calendly resources for faster modal loading...');
      
      // Create invisible iframe to preload the booking page and warm up servers
      const preloadFrame = document.createElement('iframe');
      preloadFrame.src = 'https://calendly.com/kawaipianogallery/utd-x-kawai-piano-sale?utm_source=kawai-landing-page&utm_medium=preload&utm_campaign=utd-piano-sale-2025';
      preloadFrame.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        z-index: -1;
        border: none;
      `;
      preloadFrame.setAttribute('aria-hidden', 'true');
      preloadFrame.setAttribute('tabindex', '-1');
      
      // Add frame to DOM to trigger resource loading
      document.body.appendChild(preloadFrame);
      
      // Set up cleanup - remove preload frame after resources are cached
      const cleanup = () => {
        if (preloadFrame.parentNode) {
          preloadFrame.parentNode.removeChild(preloadFrame);
          console.log('✅ Calendly preload frame cleaned up');
        }
      };
      
      // Clean up after 10 seconds (resources should be cached by then)
      setTimeout(cleanup, 10000);
      
      // Also clean up if user navigates away
      window.addEventListener('beforeunload', cleanup, { once: true });
      
      console.log('✅ Calendly resource preloading initiated');
    };
    
    // Start preloading after a short delay to not block initial page load
    const timeoutId = setTimeout(preloadCalendlyResources, 2000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything visible - it's purely for resource preloading
  return null;
}