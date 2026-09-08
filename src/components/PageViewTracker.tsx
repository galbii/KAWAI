'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

// GA4 page views: handled by GTM's History Change trigger.
// PostHog page views: handled natively via capture_pageview: true.
// Meta Pixel: kept here until Pixel is migrated to GTM.
// HubSpot: the tracking code only counts the initial hard load, so every
// client-side navigation has to be reported manually (see below).
export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (!pathname) return
    if (window.fbq) window.fbq('track', 'PageView')

    // HubSpot's loader already tracks the entry page itself — reporting it again
    // here would double-count every landing. Only the navigations that follow.
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    const _hsq = (window._hsq = window._hsq ?? [])
    const query = searchParams?.toString()
    _hsq.push(['setPath', query ? `${pathname}?${query}` : pathname])
    _hsq.push(['trackPageView'])
  }, [pathname, searchParams])

  return null
}
