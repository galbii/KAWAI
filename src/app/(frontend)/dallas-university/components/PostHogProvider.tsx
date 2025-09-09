'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { postHogAnalytics } from './lib/posthog'
import { campaignAttribution, getAttributionForEvent } from './lib/campaign-attribution'
import { consentManager } from './lib/consent-manager'
import { POSTHOG_RETENTION_SETTINGS } from './lib/data-retention-config'

function PostHogProviderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Try to get bootstrap data from middleware
    const getBootstrapData = () => {
      if (typeof window === 'undefined') return null
      
      try {
        const bootstrapCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('ph_bootstrap_data='))
        
        if (bootstrapCookie) {
          const bootstrapData = JSON.parse(decodeURIComponent(bootstrapCookie.split('=')[1]))
          return bootstrapData
        }
      } catch (error) {
        console.warn('Failed to parse bootstrap data:', error)
      }
      
      return null
    }

    const bootstrapData = getBootstrapData()

    // Initialize PostHog using official pattern with bootstrap data
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // Manual control for intelligent page tracking
      capture_pageleave: true,
      // Enhanced privacy and compliance settings
      opt_out_capturing_by_default: !consentManager.hasConsent(),
      opt_out_capturing_persistence_type: 'localStorage',
      respect_dnt: true,
      // Heatmaps configuration
      enable_heatmaps: true,
      // Session recording with privacy controls and data retention
      session_recording: {
        ...POSTHOG_RETENTION_SETTINGS.session_recording,
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
          email: false, // Allow for lead qualification
          tel: true,
        },
        maskTextSelector: '.ph-mask-text, .sensitive, [data-private]',
        // Enhanced privacy settings
        // Automatically mask common sensitive selectors
        blockSelector: 'input[type="password"], [data-sensitive], .private-data'
      },
      // Performance and rate limiting
      rate_limiting: {
        events_per_second: 10,
        events_burst_limit: 100
      },
      // Data sanitization
      before_send: (event) => {
        // Add campaign attribution to all events
        if (event) {
          event.properties = {
            ...event.properties,
            ...getAttributionForEvent(false)
          }
        }
        return event
      },
      // Bootstrap data for immediate flag availability
      bootstrap: bootstrapData ? {
        distinctID: bootstrapData.distinctID,
        featureFlags: bootstrapData.featureFlags
      } : undefined,
      // Debug mode for development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug()
          setTimeout(() => campaignAttribution.debug(), 1000)
          
          if (bootstrapData) {
            console.log('PostHog bootstrapped with flags:', bootstrapData.featureFlags)
            console.log('Bootstrap timestamp:', bootstrapData.timestamp)
          }
        }
      }
    })

    // Initialize our custom analytics wrapper
    postHogAnalytics.init()
  }, [])

  useEffect(() => {
    // Track page views manually to avoid duplication with GA4
    // Only track if user shows engagement (scroll or time on page)
    let timeOnPage = 0
    let hasScrolled = false
    
    const timer = setInterval(() => {
      timeOnPage += 1
      if (timeOnPage > 10 && !hasScrolled) {
        // User has been on page for 10+ seconds, track pageview
        posthog.capture('$pageview', {
          $current_url: window.location.href,
          page_type: 'kawai_landing',
          time_based_pageview: true,
          // Campaign attribution now automatically included via validation system
          ...getAttributionForEvent(true)
        })
        clearInterval(timer)
      }
    }, 1000)

    const handleScroll = () => {
      if (!hasScrolled) {
        hasScrolled = true
        posthog.capture('$pageview', {
          $current_url: window.location.href,
          page_type: 'kawai_landing',
          scroll_based_pageview: true,
          // Campaign attribution now automatically included via validation system
          ...getAttributionForEvent(true)
        })
        clearInterval(timer)
      }
    }

    window.addEventListener('scroll', handleScroll, { once: true })

    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}


export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <PHProvider client={posthog}>
        <PostHogProviderInner>{children}</PostHogProviderInner>
      </PHProvider>
    </Suspense>
  )
}