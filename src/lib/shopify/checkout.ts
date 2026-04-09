/**
 * Checkout URL and cart attribute helpers for UTM attribution.
 *
 * Client-only: reads from document.cookie via utm-tracking.ts.
 * Safe to import in 'use client' components; never import server-side.
 */

import { getStoredUTMParams } from './utm-tracking'
import type { UTMParams } from './utm-tracking'

// ============================================================================
// Types
// ============================================================================

export type CartAttribute = { key: string; value: string }

// ============================================================================
// URL helper
// ============================================================================

/**
 * Append stored first-touch UTM parameters to a Shopify checkout URL.
 *
 * Returns the original URL unchanged when:
 * - No UTM cookies exist (new session or SSR)
 * - All stored UTM values are empty strings
 *
 * @example
 * window.open(buildCheckoutUrl(cart.checkoutUrl), '_blank', 'noopener,noreferrer')
 */
export function buildCheckoutUrl(baseUrl: string): string {
  const params = getStoredUTMParams()
  if (!params) return baseUrl

  const utmString = Object.entries(params)
    .filter((entry): entry is [string, string] =>
      typeof entry[1] === 'string' && entry[1].length > 0,
    )
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  if (!utmString) return baseUrl

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}${utmString}`
}

// ============================================================================
// Cart attribute helper
// ============================================================================

/**
 * Build Shopify cart attributes from stored first-touch UTM parameters.
 *
 * The underscore prefix (_utm_*) keeps attributes hidden in the customer-facing
 * Shopify UI while still recording them on the order object — accessible in
 * Shopify admin, Flow automations, and order exports.
 *
 * Returns an empty array when no UTM cookies exist, making it safe to pass
 * directly to createCart() without any conditional at the call site:
 *
 * @example
 * const cart = await createCart(lines, getUTMCartAttributes())
 */
export function getUTMCartAttributes(): CartAttribute[] {
  const params = getStoredUTMParams()
  if (!params) return []

  const keys: Array<keyof UTMParams> = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ]

  return keys
    .filter(k => typeof params[k] === 'string' && (params[k] as string).length > 0)
    .map(k => ({ key: `_${k}`, value: params[k] as string }))
}
