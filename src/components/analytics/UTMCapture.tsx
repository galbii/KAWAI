/**
 * UTM Parameter Capture Component
 *
 * This component should be placed in the root layout to automatically
 * capture UTM parameters from URLs across the entire application.
 *
 * Features:
 * - Captures UTM parameters on page load
 * - Stores in sessionStorage for session-based attribution
 * - First-touch attribution (doesn't overwrite existing UTMs)
 * - SSR-safe implementation
 * - No visual output (analytics component)
 *
 * @example
 * ```typescript
 * // src/app/layout.tsx
 * import { UTMCapture } from '@/components/analytics/UTMCapture'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <UTMCapture />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { captureUTMParams, captureUTMParamsToSession } from '@/lib/shopify/utm-tracking'
import * as CookieConsent from 'vanilla-cookieconsent'

/**
 * UTM Capture Component
 *
 * Automatically captures UTM parameters from the URL on page load.
 * Only stores UTMs when the user has accepted analytics cookies.
 * For new visitors who later accept, CookieConsentBanner handles capture
 * in its onConsent callback.
 */
export function UTMCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) return
    // Always capture to sessionStorage — no consent required for session-scoped storage.
    // This preserves UTMs even if the user navigates before accepting the cookie banner.
    captureUTMParamsToSession(searchParams)
    // If consent already granted, also persist to 30-day cookies immediately.
    if (CookieConsent.acceptedCategory('analytics')) {
      captureUTMParams(searchParams)
    }
  }, [searchParams])

  // This component renders nothing - it's for analytics only
  return null
}

/**
 * Alternative: UTM Debug Display Component
 *
 * Shows current UTM parameters (useful for development/debugging).
 * Remove or hide in production.
 *
 * @example
 * ```typescript
 * // Show in development only
 * {process.env.NODE_ENV === 'development' && <UTMDebugDisplay />}
 * ```
 */
export function UTMDebugDisplay() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams) {
      captureUTMParams(searchParams)
    }
  }, [searchParams])

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // Get current UTM parameters from URL
  const utmParams: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (key.startsWith('utm_')) {
      utmParams[key] = value
    }
  })

  // Don't show if no UTMs
  if (Object.keys(utmParams).length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white text-xs p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="font-bold mb-2">UTM Parameters (Debug)</div>
      <div className="space-y-1">
        {Object.entries(utmParams).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="text-gray-400">{key}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
      <div className="text-gray-400 mt-2 pt-2 border-t border-gray-700">
        Tags will be applied to customer records
      </div>
    </div>
  )
}
