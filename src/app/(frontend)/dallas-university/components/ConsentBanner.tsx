'use client'

import { useState, useEffect, useCallback } from 'react'
import Script from 'next/script'

interface ConsentPreferences {
  analytics: boolean
  advertising: boolean
  functional: boolean
  timestamp: number
}

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [consent, setConsent] = useState<ConsentPreferences | null>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  const updateConsentMode = useCallback((preferences: ConsentPreferences) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': preferences.advertising ? 'granted' : 'denied',
        'ad_user_data': preferences.advertising ? 'granted' : 'denied',
        'ad_personalization': preferences.advertising ? 'granted' : 'denied'
      })
    }
  }, [])

  const loadTrackingScripts = useCallback((preferences: ConsentPreferences) => {
    if (scriptsLoaded) return
    
    // Load Google Ads if advertising consent given
    if (preferences.advertising && typeof window !== 'undefined') {
      const gtagScript = document.createElement('script')
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=AW-755074614'
      gtagScript.async = true
      document.head.appendChild(gtagScript)

      gtagScript.onload = () => {
        if (window.gtag) {
          (window.gtag as (...args: unknown[]) => void)('js', new Date())
          window.gtag('config', 'AW-755074614')
        }
      }

      // Load Meta Pixel
      const fbqScript = document.createElement('script')
      fbqScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '783258114117252');
        fbq('track', 'PageView');
      `
      document.head.appendChild(fbqScript)
    }

    setScriptsLoaded(true)
  }, [scriptsLoaded])

  useEffect(() => {
    // Check for existing consent
    const storedConsent = localStorage.getItem('kawai_consent_preferences')
    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent) as ConsentPreferences
        // Check if consent is less than 1 year old
        const oneYear = 365 * 24 * 60 * 60 * 1000
        if (Date.now() - parsed.timestamp < oneYear) {
          setConsent(parsed)
          updateConsentMode(parsed)
          if (parsed.analytics || parsed.advertising) {
            loadTrackingScripts(parsed)
          }
          return
        }
      } catch {
        console.warn('Invalid consent preferences in localStorage')
      }
    }
    
    // Show banner if no valid consent found
    setShowBanner(true)
  }, [loadTrackingScripts, updateConsentMode])

  const handleConsent = (preferences: Partial<ConsentPreferences>) => {
    const consentData: ConsentPreferences = {
      analytics: preferences.analytics ?? false,
      advertising: preferences.advertising ?? false,
      functional: true, // Always granted for basic functionality
      timestamp: Date.now()
    }

    // Store consent
    localStorage.setItem('kawai_consent_preferences', JSON.stringify(consentData))
    setConsent(consentData)
    setShowBanner(false)

    // Update consent mode
    updateConsentMode(consentData)

    // Load tracking scripts if consent given
    if (consentData.analytics || consentData.advertising) {
      loadTrackingScripts(consentData)
    }

    // Send consent event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'consent_update',
        consent_analytics: consentData.analytics,
        consent_advertising: consentData.advertising
      })
    }
  }

  const handleAcceptAll = () => {
    handleConsent({ analytics: true, advertising: true })
  }

  const handleAcceptEssential = () => {
    handleConsent({ analytics: false, advertising: false })
  }

  const handleCustomize = () => {
    // For now, just show essential only. Later we'll add a full consent modal
    handleConsent({ analytics: true, advertising: false })
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-kawai-red shadow-lg z-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-playfair font-bold text-lg text-gray-900 mb-2">
                Cookie Consent
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze website traffic, 
                and provide personalized content. This includes analytics to understand our piano customers 
                and advertising to show you relevant content. You can manage your preferences at any time.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                By clicking &quot;Accept All&quot;, you consent to our use of cookies for analytics and advertising. 
                Essential cookies are always active for basic site functionality.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleCustomize}
                className="px-4 py-2 text-sm font-medium text-kawai-red border border-kawai-red rounded hover:bg-kawai-red hover:text-white transition-colors"
              >
                Analytics Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-kawai-red rounded hover:bg-red-700 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Consent management scripts - only load when needed */}
      {consent?.advertising && (
        <>
          <Script 
            id="google-ads-delayed"
            src="https://www.googletagmanager.com/gtag/js?id=AW-755074614" 
            strategy="afterInteractive"
          />
          <Script id="meta-pixel-delayed" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '783258114117252');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}
    </>
  )
}

// Helper function to check consent status
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const stored = localStorage.getItem('kawai_consent_preferences')
    if (!stored) return false
    
    const consent = JSON.parse(stored) as ConsentPreferences
    const oneYear = 365 * 24 * 60 * 60 * 1000
    
    return consent.analytics && (Date.now() - consent.timestamp < oneYear)
  } catch {
    return false
  }
}

export const hasAdvertisingConsent = (): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const stored = localStorage.getItem('kawai_consent_preferences')
    if (!stored) return false
    
    const consent = JSON.parse(stored) as ConsentPreferences
    const oneYear = 365 * 24 * 60 * 60 * 1000
    
    return consent.advertising && (Date.now() - consent.timestamp < oneYear)
  } catch {
    return false
  }
}

