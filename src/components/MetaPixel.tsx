'use client'

import Script from 'next/script'

interface MetaPixelProps {
  pixelId: string
}

export default function MetaPixel({ pixelId }: MetaPixelProps) {
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Meta Pixel tracking utility functions
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
    console.log('🎯 Meta Pixel event tracked:', eventName, parameters)
  }
}

export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, parameters)
    console.log('🎯 Meta Pixel custom event tracked:', eventName, parameters)
  }
}

// Specific tracking functions for common events
export const trackCompleteRegistration = (parameters?: {
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
  status?: string
}) => {
  trackEvent('CompleteRegistration', parameters)
}

export const trackSchedule = (parameters?: {
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
}) => {
  trackEvent('Schedule', parameters)
}

export const trackLead = (parameters?: {
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
}) => {
  trackEvent('Lead', parameters)
}

export const trackSubmitApplication = (parameters?: {
  content_name?: string
  content_category?: string
  value?: number
  currency?: string
  status?: string
}) => {
  trackEvent('SubmitApplication', parameters)
}