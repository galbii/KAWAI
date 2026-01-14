/**
 * UTM Parameter Tracking for Marketing Attribution
 *
 * Captures UTM parameters from URLs and converts them to Shopify customer tags
 * for CRM attribution and campaign tracking.
 *
 * @example
 * ```typescript
 * // Capture UTMs on page load (client component)
 * import { captureUTMParams } from '@/lib/shopify/utm-tracking'
 *
 * const searchParams = new URLSearchParams(window.location.search)
 * captureUTMParams(searchParams)
 * ```
 *
 * @example
 * ```typescript
 * // Retrieve UTM tags in server action
 * import { getUTMTags } from '@/lib/shopify/utm-tracking'
 *
 * const utmTags = getUTMTags() // Client-side call before server action
 * await upsertCustomer({
 *   email: 'user@example.com',
 *   tags: [...utmTags, 'location-stlouis']
 * })
 * ```
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Standard UTM parameters for marketing attribution
 */
export interface UTMParams {
  /** Traffic source (e.g., 'google', 'facebook', 'newsletter') */
  utm_source?: string
  /** Marketing medium (e.g., 'cpc', 'email', 'social') */
  utm_medium?: string
  /** Campaign name (e.g., 'spring-sale-2025', 'product-launch') */
  utm_campaign?: string
  /** Ad content variant (e.g., 'hero-banner', 'sidebar-ad') */
  utm_content?: string
  /** Paid search keywords (e.g., 'digital-piano', 'kawai-ca99') */
  utm_term?: string
}

/**
 * Stored UTM data with metadata
 */
interface StoredUTMData {
  params: UTMParams
  capturedAt: number // Timestamp
  url: string // Original URL
}

// ============================================================================
// Constants
// ============================================================================

/**
 * sessionStorage key for UTM parameters
 */
const UTM_STORAGE_KEY = 'kawai_utm_params'

/**
 * Standard UTM parameter names
 */
const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term'
] as const

/**
 * Maximum length for UTM values (prevent tag bloat)
 */
const MAX_UTM_VALUE_LENGTH = 50

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if sessionStorage is available (SSR-safe)
 */
function isSessionStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false
    const test = '__storage_test__'
    window.sessionStorage.setItem(test, test)
    window.sessionStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize UTM value for use in Shopify tags
 *
 * Rules:
 * - Convert to lowercase
 * - Replace spaces with hyphens
 * - Remove special characters (keep alphanumeric and hyphens)
 * - Remove consecutive hyphens
 * - Trim to max length
 *
 * @example
 * sanitizeUTMValue('Google Ads 2025!') // 'google-ads-2025'
 * sanitizeUTMValue('Spring  Sale') // 'spring-sale'
 */
export function sanitizeUTMValue(value: string): string {
  return value
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, '-')
    // Remove special characters (keep alphanumeric and hyphens)
    .replace(/[^a-z0-9-]/g, '')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Truncate to max length
    .slice(0, MAX_UTM_VALUE_LENGTH)
}

/**
 * Convert UTM parameters to Shopify tag format
 *
 * Format: `utm-{param}-{value}`
 *
 * @example
 * formatUTMTag('utm_source', 'google') // 'utm-source-google'
 * formatUTMTag('utm_campaign', 'Spring Sale 2025') // 'utm-campaign-spring-sale-2025'
 */
function formatUTMTag(param: string, value: string): string {
  const sanitizedValue = sanitizeUTMValue(value)
  if (!sanitizedValue) return ''

  // Convert utm_source to utm-source
  const paramName = param.replace('utm_', '').toLowerCase()
  return `utm-${paramName}-${sanitizedValue}`
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Capture UTM parameters from URL and store in sessionStorage
 *
 * This should be called on every page load (client-side) to capture
 * UTM parameters from the URL. Uses first-touch attribution - once
 * UTMs are captured, they persist for the session.
 *
 * @param searchParams - URLSearchParams from URL or location.search
 * @returns Captured UTM parameters (if any)
 *
 * @example
 * ```typescript
 * // In root layout or _app.tsx
 * 'use client'
 * import { useEffect } from 'react'
 * import { useSearchParams } from 'next/navigation'
 * import { captureUTMParams } from '@/lib/shopify/utm-tracking'
 *
 * export function UTMCapture() {
 *   const searchParams = useSearchParams()
 *
 *   useEffect(() => {
 *     captureUTMParams(searchParams)
 *   }, [searchParams])
 *
 *   return null
 * }
 * ```
 */
export function captureUTMParams(searchParams: URLSearchParams): UTMParams | null {
  if (!isSessionStorageAvailable()) {
    console.warn('[UTM Tracking] sessionStorage not available')
    return null
  }

  // Check if UTMs are already captured (first-touch attribution)
  const existing = window.sessionStorage.getItem(UTM_STORAGE_KEY)
  if (existing) {
    console.log('[UTM Tracking] UTMs already captured for this session')
    return null
  }

  // Extract UTM parameters from URL
  const utmParams: UTMParams = {}
  let hasUTMs = false

  for (const param of UTM_PARAMS) {
    const value = searchParams.get(param)
    if (value && value.trim()) {
      utmParams[param] = value.trim()
      hasUTMs = true
    }
  }

  // Only store if at least one UTM parameter is present
  if (!hasUTMs) {
    return null
  }

  // Store in sessionStorage with metadata
  const storedData: StoredUTMData = {
    params: utmParams,
    capturedAt: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : ''
  }

  try {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(storedData))
    console.log('[UTM Tracking] UTM parameters captured:', utmParams)
    return utmParams
  } catch (error) {
    console.error('[UTM Tracking] Failed to store UTM parameters:', error)
    return null
  }
}

/**
 * Retrieve stored UTM parameters from sessionStorage
 *
 * @returns Stored UTM parameters or null if none found
 */
export function getStoredUTMParams(): UTMParams | null {
  if (!isSessionStorageAvailable()) {
    return null
  }

  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY)
    if (!stored) {
      return null
    }

    const data: StoredUTMData = JSON.parse(stored)
    return data.params
  } catch (error) {
    console.error('[UTM Tracking] Failed to retrieve UTM parameters:', error)
    return null
  }
}

/**
 * Convert stored UTM parameters to Shopify customer tags
 *
 * This should be called when submitting forms to include UTM tags
 * in the customer record for attribution tracking.
 *
 * @returns Array of formatted tag strings (e.g., ['utm-source-google', 'utm-medium-cpc'])
 *
 * @example
 * ```typescript
 * // In server action or form submission
 * const utmTags = getUTMTags()
 *
 * await upsertCustomer({
 *   email: 'user@example.com',
 *   firstName: 'John',
 *   tags: [
 *     ...utmTags,              // UTM attribution tags
 *     'location-stlouis',      // Location tag
 *     'inquiry-consultation'   // Inquiry type tag
 *   ]
 * })
 * ```
 */
export function getUTMTags(): string[] {
  const params = getStoredUTMParams()
  if (!params) {
    return []
  }

  const tags: string[] = []

  for (const [param, value] of Object.entries(params)) {
    if (value) {
      const tag = formatUTMTag(param, value)
      if (tag) {
        tags.push(tag)
      }
    }
  }

  console.log('[UTM Tracking] Generated tags:', tags)
  return tags
}

/**
 * Clear stored UTM parameters
 *
 * Useful for testing or manual session reset.
 * Normally, UTMs clear automatically when the browser tab closes.
 */
export function clearUTMParams(): void {
  if (!isSessionStorageAvailable()) {
    return
  }

  try {
    window.sessionStorage.removeItem(UTM_STORAGE_KEY)
    console.log('[UTM Tracking] UTM parameters cleared')
  } catch (error) {
    console.error('[UTM Tracking] Failed to clear UTM parameters:', error)
  }
}

/**
 * Get UTM tracking metadata (for debugging)
 *
 * @returns UTM data with capture metadata or null
 */
export function getUTMMetadata(): StoredUTMData | null {
  if (!isSessionStorageAvailable()) {
    return null
  }

  try {
    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY)
    if (!stored) {
      return null
    }

    return JSON.parse(stored)
  } catch (error) {
    console.error('[UTM Tracking] Failed to retrieve UTM metadata:', error)
    return null
  }
}

/**
 * Check if UTM parameters are currently stored
 */
export function hasStoredUTMs(): boolean {
  return getStoredUTMParams() !== null
}

// ============================================================================
// React Hook (Optional)
// ============================================================================

/**
 * React hook for accessing UTM tags in client components
 *
 * @returns Object with UTM tags and helper functions
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useUTMTracking } from '@/lib/shopify/utm-tracking'
 *
 * export function ContactForm() {
 *   const { tags, hasUTMs } = useUTMTracking()
 *
 *   console.log('Current UTM tags:', tags)
 *   console.log('Has UTMs:', hasUTMs)
 *
 *   // Use in form submission...
 * }
 * ```
 */
export function useUTMTracking() {
  // Note: This would require React imports and useState/useEffect
  // Keeping it simple as a utility function instead
  // Users can call getUTMTags() directly when needed

  return {
    tags: getUTMTags(),
    hasUTMs: hasStoredUTMs(),
    params: getStoredUTMParams(),
    clear: clearUTMParams
  }
}
