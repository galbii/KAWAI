'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

// GA4 page views: handled by GTM's History Change trigger.
// PostHog page views: handled natively via capture_pageview: true.
// Meta Pixel: kept here until Pixel is migrated to GTM.
export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    if (window.fbq) window.fbq('track', 'PageView')
  }, [pathname, searchParams])

  return null
}
