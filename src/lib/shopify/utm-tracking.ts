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
 * First-touch UTM cookie — set once and never overwritten.
 * Captures which channel originally brought this visitor.
 */
const UTM_COOKIE_FIRST = 'kawai-utm-first'

/**
 * Last-touch UTM cookie — always overwritten with the most recent UTM.
 * Captures which channel was active just before conversion.
 */
const UTM_COOKIE_LAST = 'kawai-utm-last'

/** @deprecated Renamed to kawai-utm-first. Read as fallback for existing cookies. */
const UTM_COOKIE_LEGACY = 'kawai-utm'

/**
 * Cookie max-age: 30 days in seconds
 */
const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

/**
 * sessionStorage key for pre-consent UTM capture.
 * Session-scoped so no cookie consent is required to write it.
 */
const UTM_SESSION_KEY = 'kawai-utm-session'

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
// Cookie Helpers
// ============================================================================

function isCookieAvailable(): boolean {
  return typeof document !== 'undefined'
}

function writeCookie(name: string, value: string): void {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${UTM_COOKIE_MAX_AGE}; path=/; SameSite=Lax${secure}`
}

function readCookie(name: string): string | null {
  if (!isCookieAvailable()) return null
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=')[1] ?? '') : null
}

function eraseCookie(name: string): void {
  if (!isCookieAvailable()) return
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`
}

// ============================================================================
// Utility Functions
// ============================================================================

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
 * Capture UTM parameters from URL.
 *
 * - First-touch (`kawai-utm-first`): written once, never overwritten.
 *   Captures which channel originally brought this visitor.
 * - Last-touch (`kawai-utm-last`): always overwritten.
 *   Captures which channel was active just before conversion.
 *
 * @param searchParams - URLSearchParams from URL or location.search
 * @returns Captured UTM parameters (if any UTMs were in the URL)
 */
export function captureUTMParams(searchParams: URLSearchParams): UTMParams | null {
  if (!isCookieAvailable()) {
    console.warn('[UTM Tracking] document.cookie not available')
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

  if (!hasUTMs) return null

  const storedData: StoredUTMData = {
    params: utmParams,
    capturedAt: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : '',
  }

  const serialized = JSON.stringify(storedData)

  try {
    // First-touch: only write if no first-touch cookie exists yet
    // Also accept the legacy 'kawai-utm' cookie as equivalent
    const hasFirstTouch = readCookie(UTM_COOKIE_FIRST) !== null || readCookie(UTM_COOKIE_LEGACY) !== null
    if (!hasFirstTouch) {
      writeCookie(UTM_COOKIE_FIRST, serialized)
    }

    // Last-touch: always overwrite
    writeCookie(UTM_COOKIE_LAST, serialized)

    console.log('[UTM Tracking] UTM parameters captured:', utmParams)
    return utmParams
  } catch (error) {
    console.error('[UTM Tracking] Failed to store UTM parameters:', error)
    return null
  }
}

/**
 * Retrieve first-touch UTM parameters.
 * Falls back to the legacy `kawai-utm` cookie for existing users.
 */
export function getStoredUTMParams(): UTMParams | null {
  if (!isCookieAvailable()) return null

  try {
    const raw = readCookie(UTM_COOKIE_FIRST) ?? readCookie(UTM_COOKIE_LEGACY)
    if (!raw) return null
    const data: StoredUTMData = JSON.parse(raw)
    return data.params
  } catch (error) {
    console.error('[UTM Tracking] Failed to retrieve first-touch UTM parameters:', error)
    return null
  }
}

/**
 * Retrieve last-touch UTM parameters (the most recent campaign that touched this visitor).
 */
export function getLastTouchUTMParams(): UTMParams | null {
  if (!isCookieAvailable()) return null

  try {
    const raw = readCookie(UTM_COOKIE_LAST)
    if (!raw) return null
    const data: StoredUTMData = JSON.parse(raw)
    return data.params
  } catch (error) {
    console.error('[UTM Tracking] Failed to retrieve last-touch UTM parameters:', error)
    return null
  }
}

/**
 * Convert first-touch UTM parameters to Shopify customer tags.
 * Tags format: `utm-source-google`, `utm-medium-cpc`, etc.
 */
export function getUTMTags(): string[] {
  const params = getStoredUTMParams()
  if (!params) return []

  const tags: string[] = []
  for (const [param, value] of Object.entries(params)) {
    if (value) {
      const tag = formatUTMTag(param, value)
      if (tag) tags.push(tag)
    }
  }

  return tags
}

/**
 * Returns both first-touch and last-touch UTM tags for Shopify.
 *
 * First-touch tags: `utm-source-google` (which channel found them)
 * Last-touch tags:  `utm-last-source-email` (which channel converted them)
 *
 * Use this instead of getUTMTags() on form submissions so Shopify has the
 * full attribution picture.
 */
export function getAllUTMTags(): string[] {
  const firstParams = getStoredUTMParams()
  const lastParams = getLastTouchUTMParams()
  const tags = new Set<string>()

  if (firstParams) {
    for (const [param, value] of Object.entries(firstParams)) {
      if (value) {
        const tag = formatUTMTag(param, value)
        if (tag) tags.add(tag)
      }
    }
  }

  if (lastParams) {
    for (const [param, value] of Object.entries(lastParams)) {
      if (value) {
        // Prefix last-touch tags with 'last-' to distinguish from first-touch
        const tag = formatUTMTag(`last-${param}`, value)
        if (tag) tags.add(tag)
      }
    }
  }

  return Array.from(tags)
}

/**
 * Clear all UTM cookies (first-touch, last-touch, and legacy).
 * Useful for testing or manual session reset.
 */
export function clearUTMParams(): void {
  try {
    eraseCookie(UTM_COOKIE_FIRST)
    eraseCookie(UTM_COOKIE_LAST)
    eraseCookie(UTM_COOKIE_LEGACY)
    console.log('[UTM Tracking] UTM parameters cleared')
  } catch (error) {
    console.error('[UTM Tracking] Failed to clear UTM parameters:', error)
  }
}

/**
 * Get UTM tracking metadata (for debugging)
 */
export function getUTMMetadata(): StoredUTMData | null {
  if (!isCookieAvailable()) return null

  try {
    const raw = readCookie(UTM_COOKIE_FIRST) ?? readCookie(UTM_COOKIE_LEGACY)
    if (!raw) return null
    return JSON.parse(raw)
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
// Session Storage (Pre-Consent Capture)
// ============================================================================

/**
 * Capture UTM parameters to sessionStorage without requiring cookie consent.
 * sessionStorage is session-scoped and cleared when the tab closes, so it
 * doesn't require the same consent as persistent cookies.
 *
 * Call this unconditionally on page load. Call persistSessionUTMsToCookies()
 * once the user grants analytics consent.
 */
export function captureUTMParamsToSession(searchParams: URLSearchParams): UTMParams | null {
  if (typeof window === 'undefined') return null

  const utmParams: UTMParams = {}
  let hasUTMs = false

  for (const param of UTM_PARAMS) {
    const value = searchParams.get(param)
    if (value && value.trim()) {
      utmParams[param] = value.trim()
      hasUTMs = true
    }
  }

  if (!hasUTMs) return null

  try {
    // Only write first-touch — don't overwrite if session already has UTMs
    if (!sessionStorage.getItem(UTM_SESSION_KEY)) {
      sessionStorage.setItem(
        UTM_SESSION_KEY,
        JSON.stringify({ params: utmParams, capturedAt: Date.now(), url: window.location.href }),
      )
    }
    // Always update last-touch (separate key)
    sessionStorage.setItem(
      `${UTM_SESSION_KEY}-last`,
      JSON.stringify({ params: utmParams, capturedAt: Date.now(), url: window.location.href }),
    )
    return utmParams
  } catch {
    return null
  }
}

/**
 * Persist any UTMs captured in sessionStorage to 30-day cookies.
 * Call this once the user grants analytics consent so attribution is
 * preserved even if they accepted cookies after navigating away from
 * the landing URL.
 */
export function persistSessionUTMsToCookies(): void {
  if (typeof window === 'undefined') return

  try {
    const firstRaw = sessionStorage.getItem(UTM_SESSION_KEY)
    const lastRaw = sessionStorage.getItem(`${UTM_SESSION_KEY}-last`)

    if (firstRaw) {
      const { params } = JSON.parse(firstRaw) as StoredUTMData
      const sp = new URLSearchParams()
      for (const [k, v] of Object.entries(params)) {
        if (v) sp.set(k, v)
      }
      captureUTMParams(sp)
    }

    // Sync last-touch cookie if it differs from first-touch
    if (lastRaw) {
      const { params } = JSON.parse(lastRaw) as StoredUTMData
      const serialized = JSON.stringify({ params, capturedAt: Date.now(), url: window.location.href })
      writeCookie(UTM_COOKIE_LAST, serialized)
    }
  } catch {
    // silently fail — attribution is best-effort
  }
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
  return {
    tags: getAllUTMTags(),
    firstTouchTags: getUTMTags(),
    hasUTMs: hasStoredUTMs(),
    params: getStoredUTMParams(),
    lastTouchParams: getLastTouchUTMParams(),
    clear: clearUTMParams,
  }
}
