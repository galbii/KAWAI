'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Form disabled for now
  return null;
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Debug timer to check if form loads
    const debugTimer = setTimeout(() => {
      const formElement = document.querySelector('.ctct-inline-form');
      if (!formElement || formElement.children.length === 0) {
        console.log('Constant Contact form not loaded in popup, checking for issues...');
        console.log('Form element:', formElement);
        console.log('Form children:', formElement?.children);
        setShowFallback(true);
      } else {
        console.log('Constant Contact form loaded successfully in popup');
      }
    }, 8000); // Give it 8 seconds to load

    return () => {
      clearTimeout(timer);
      clearTimeout(debugTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Constant Contact Universal Code - Same as working form */}
      <Script 
        id="ctct-script-popup"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _ctct_m = "1cf63f1b41f15055378de822630a40df";
          `
        }}
      />
      <Script 
        id="signupScript-popup"
        src="https://static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js"
        strategy="afterInteractive"
      />

      <div className="fixed inset-0 flex items-center justify-center bg-black/50" style={{ zIndex: 1000 }}>
        <div className="relative bg-white shadow-xl" style={{ width: '600px', height: 'auto', position: 'relative', zIndex: 1001 }}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-md"
            style={{ zIndex: 1002 }}
          >
            ×
          </button>

          {/* Constant Contact Inline Form with Fallback */}
          {!showFallback ? (
            <div 
              style={{ 
                padding: '20px',
                position: 'relative',
                zIndex: 'auto'
              }}
              dangerouslySetInnerHTML={{
                __html: `
                  <!-- Begin Constant Contact Inline Form Code -->
                  <div class="ctct-inline-form" data-form-id="3ba8c9c8-796d-41fd-987f-7a506d7e03be" style="position: relative; z-index: auto;"></div>
                  <!-- End Constant Contact Inline Form Code -->
                `
              }}
            />
          ) : (
            <div className="p-8 text-center">
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-semibold mb-2">Form Loading Issue Detected</p>
                <p className="text-yellow-700 text-sm">
                  The Constant Contact form failed to load. This might be due to:
                </p>
                <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside">
                  <li>Browser settings blocking external scripts</li>
                  <li>Ad blocker interference</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
                <form className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-gray-500 text-xs mt-4">
                  Fallback form - please check browser console for debugging info
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}