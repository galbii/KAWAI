/**
 * Checkout URL and cart attribute helpers for UTM + click ID attribution.
 *
 * Client-only: reads from document.cookie and sessionStorage.
 * Safe to import in 'use client' components; never import server-side.
 */

import { getStoredUTMParams } from './utm-tracking'
import type { UTMParams } from './utm-tracking'

// ============================================================================
// Types
// ============================================================================

export type CartAttribute = { key: string; value: string }

// ============================================================================
// Click ID helpers
// ============================================================================

/**
 * Read the current page's gclid / fbclid from sessionStorage.
 * These are written by captureClickIds() on every page load.
 */
function getStoredClickIds(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem('kawai-click-ids')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Capture gclid and fbclid from the current URL into sessionStorage.
 * Call this from UTMCapture on every page load — click IDs only appear
 * on the landing page URL, so they must be stored immediately.
 */
export function captureClickIds(searchParams: URLSearchParams): void {
  if (typeof window === 'undefined') return
  const ids: Record<string, string> = getStoredClickIds()

  const gclid = searchParams.get('gclid')
  const fbclid = searchParams.get('fbclid')

  // First-touch only — don't overwrite an existing click ID
  if (gclid && !ids.gclid) ids.gclid = gclid
  if (fbclid && !ids.fbclid) ids.fbclid = fbclid

  if (gclid || fbclid) {
    try {
      sessionStorage.setItem('kawai-click-ids', JSON.stringify(ids))
    } catch {
      // silently fail
    }
  }
}

// Matches unresolved Google Ads / Meta ValueTrack placeholders e.g. {campaign}, {keyword}
const UNRESOLVED_PLACEHOLDER = /\{[^}]+\}/

function isResolved(value: string): boolean {
  return !UNRESOLVED_PLACEHOLDER.test(value)
}

// ============================================================================
// URL helper
// ============================================================================

/**
 * Append stored UTM parameters and click IDs (gclid, fbclid) to a Shopify
 * checkout URL so the ad platform can attribute the resulting order.
 *
 * @example
 * window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')
 */
export function buildCheckoutUrl(baseUrl: string): string {
  const utmParams = getStoredUTMParams()
  const clickIds = getStoredClickIds()

  const entries: [string, string][] = []

  if (utmParams) {
    for (const [k, v] of Object.entries(utmParams)) {
      if (typeof v === 'string' && v.length > 0 && isResolved(v)) entries.push([k, v])
    }
  }

  for (const [k, v] of Object.entries(clickIds)) {
    if (v) entries.push([k, v])
  }

  if (entries.length === 0) return baseUrl

  const qs = entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}${qs}`
}

// ============================================================================
// Cart attribute helper
// ============================================================================

/**
 * Build Shopify cart attributes from stored UTM parameters and click IDs.
 *
 * The underscore prefix (_utm_*, _gclid, _fbclid) keeps attributes hidden
 * in the customer-facing Shopify UI while recording them on the order —
 * accessible in Shopify admin, Flow automations, and order exports.
 *
 * @example
 * const cart = await createCart(lines, getUTMCartAttributes())
 */
export function getUTMCartAttributes(): CartAttribute[] {
  const attrs: CartAttribute[] = []

  const utmParams = getStoredUTMParams()
  if (utmParams) {
    const keys: Array<keyof UTMParams> = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ]
    for (const k of keys) {
      const v = utmParams[k]
      if (typeof v === 'string' && v.length > 0 && isResolved(v)) {
        attrs.push({ key: `_${k}`, value: v })
      }
    }
  }

  const clickIds = getStoredClickIds()
  for (const [k, v] of Object.entries(clickIds)) {
    if (v) attrs.push({ key: `_${k}`, value: v })
  }

  return attrs
}
