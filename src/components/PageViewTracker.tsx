'use client'

import { usePostHog } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (!pathname) return

    const url = searchParams.toString()
      ? `${window.origin}${pathname}?${searchParams.toString()}`
      : `${window.origin}${pathname}`

    // PostHog
    if (posthog) {
      posthog.capture('$pageview', { $current_url: url })
    }

    // GA4 — explicit page_view on every SPA navigation.
    // GTM fires once on initial HTML load; subsequent Next.js client-side
    // route changes are invisible to GTM without this call.
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: url,
        page_title: document.title,
      })
    }

    // Meta Pixel — fbq() is called once on consent grant (CookieConsentBanner.tsx).
    // Re-fire PageView on every navigation so Meta sees the full session.
    if (window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams, posthog])

  return null
}
