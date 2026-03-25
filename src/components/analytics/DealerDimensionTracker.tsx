'use client'

/**
 * DealerDimensionTracker
 *
 * Reads the kawai-dealer-slug session cookie and broadcasts the dealer market
 * to all analytics platforms as a user-scoped dimension. This lets you segment
 * all GA4 events, PostHog sessions, and Meta pixel events by dealer location
 * without any changes to individual page components.
 *
 * - GA4: sets user_properties.dealer_slug so every subsequent event carries it
 * - PostHog: sets a person property so sessions are segmented in dashboards
 * - Meta Pixel: sends a ViewContent event with content_category = dealer_slug
 *   so Meta audience tools can segment by market
 *
 * Runs once per page load after consent is resolved.
 */

import { useEffect } from 'react'
import { useNavigationContext } from '@/contexts/NavigationContext'
import * as CookieConsent from 'vanilla-cookieconsent'
import { usePostHog } from 'posthog-js/react'

export function DealerDimensionTracker() {
  const { origin, isInitialized } = useNavigationContext()
  const posthog = usePostHog()

  useEffect(() => {
    if (!isInitialized || !origin.isDealerLocation || !origin.dealerSlug) return

    const slug = origin.dealerSlug

    // -----------------------------------------------------------------------
    // GA4 — user property (persists across all events in this session)
    // -----------------------------------------------------------------------
    if (CookieConsent.acceptedCategory('analytics') && window.gtag) {
      window.gtag('set', 'user_properties', { dealer_slug: slug })
    }

    // -----------------------------------------------------------------------
    // PostHog — person property (shows in PostHog people/cohort filters)
    // -----------------------------------------------------------------------
    if (CookieConsent.acceptedCategory('analytics') && posthog) {
      posthog.setPersonProperties({ dealer_slug: slug })
    }

    // -----------------------------------------------------------------------
    // Meta Pixel — custom event so Meta can build dealer-segmented audiences
    // -----------------------------------------------------------------------
    if (CookieConsent.acceptedCategory('marketing') && window.fbq) {
      window.fbq('trackCustom', 'DealerMarket', {
        dealer_slug: slug,
        content_category: slug,
      })
    }
  }, [isInitialized, origin.isDealerLocation, origin.dealerSlug, posthog])

  return null
}
