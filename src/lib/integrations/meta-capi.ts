/**
 * Meta Conversions API (CAPI)
 *
 * Server-side companion to the browser Meta Pixel. Fires conversion events
 * directly from the server, bypassing iOS privacy restrictions and ad blockers.
 *
 * Required env vars:
 *   FACEBOOK_CAPI_ACCESS_TOKEN — generated in Meta Events Manager → Settings
 *   NEXT_PUBLIC_META_PIXEL_ID  — same pixel ID used by the browser pixel
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import { createHash } from 'crypto'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CAPIUserData {
  /** SHA-256 hashed, lowercase, trimmed email */
  em?: string[]
  /** SHA-256 hashed phone — digits only, no formatting */
  ph?: string[]
  /** ISO 3166-1 alpha-2 country code, lowercase (e.g. 'us') */
  country?: string[]
  /** User agent from request headers */
  client_user_agent?: string
  /** fbp cookie value (_fbp) */
  fbp?: string
  /** fbc cookie value (_fbc) */
  fbc?: string
}

interface CAPICustomData {
  dealer_slug?: string
  inquiry_type?: string
  piano_interest?: string
  currency?: string
  value?: number
  [key: string]: string | number | undefined
}

export interface CAPIEventPayload {
  /** Standard Meta event name: Lead, ViewContent, Contact, etc. */
  event_name: string
  /** Unix timestamp in seconds */
  event_time?: number
  /** Full URL where the conversion happened */
  event_source_url?: string
  user_data: CAPIUserData
  custom_data?: CAPICustomData
  /**
   * Deduplication key — must match the eventID sent from the browser pixel
   * for the same event so Meta doesn't double-count.
   */
  event_id?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hashEmail(email: string): string {
  return sha256(email.toLowerCase().trim())
}

function hashPhone(phone: string): string {
  // Meta requires digits only before hashing
  const digitsOnly = phone.replace(/\D/g, '')
  return sha256(digitsOnly)
}

// ---------------------------------------------------------------------------
// Core sender
// ---------------------------------------------------------------------------

/**
 * Send one or more events to Meta CAPI.
 * Fire-and-forget — never await this from a user-facing request path.
 *
 * @example
 * sendMetaCAPIEvents([{
 *   event_name: 'Lead',
 *   event_source_url: 'https://kawaipianos.com/store/st-louis',
 *   user_data: { em: [hashEmail(email)], ph: [hashPhone(phone)] },
 *   custom_data: { dealer_slug: 'st-louis', inquiry_type: 'piano-consultation' },
 * }]).catch(err => console.error('[CAPI]', err))
 */
export async function sendMetaCAPIEvents(events: CAPIEventPayload[]): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN

  if (!pixelId || !accessToken) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[CAPI] Skipped — NEXT_PUBLIC_META_PIXEL_ID or FACEBOOK_CAPI_ACCESS_TOKEN not set')
    }
    return
  }

  const now = Math.floor(Date.now() / 1000)

  const payload = {
    data: events.map((event) => ({
      ...event,
      event_time: event.event_time ?? now,
      action_source: 'website',
    })),
    // Test event code — set FACEBOOK_CAPI_TEST_CODE in dev to verify in Events Manager
    ...(process.env.FACEBOOK_CAPI_TEST_CODE && {
      test_event_code: process.env.FACEBOOK_CAPI_TEST_CODE,
    }),
  }

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Meta CAPI request failed: ${response.status} ${body}`)
  }

  if (process.env.NODE_ENV === 'development') {
    const body = await response.json()
    console.log('[CAPI] Events sent:', JSON.stringify(body, null, 2))
  }
}

// ---------------------------------------------------------------------------
// Convenience builders
// ---------------------------------------------------------------------------

/**
 * Build a Lead event payload from contact form data.
 * Call sendMetaCAPIEvents([buildLeadEvent(...)]) after a successful form submission.
 */
export function buildLeadEvent(options: {
  email: string
  phone?: string
  sourceUrl?: string
  dealerSlug?: string
  inquiryType?: string
  pianoInterest?: string
  eventId?: string
}): CAPIEventPayload {
  const userData: CAPIUserData = {
    em: [hashEmail(options.email)],
    country: ['us'],
  }

  if (options.phone) {
    userData.ph = [hashPhone(options.phone)]
  }

  const customData: CAPICustomData = {}
  if (options.dealerSlug) customData.dealer_slug = options.dealerSlug
  if (options.inquiryType) customData.inquiry_type = options.inquiryType
  if (options.pianoInterest) customData.piano_interest = options.pianoInterest

  return {
    event_name: 'Lead',
    user_data: userData,
    ...(options.sourceUrl && { event_source_url: options.sourceUrl }),
    ...(Object.keys(customData).length > 0 && { custom_data: customData }),
    ...(options.eventId && { event_id: options.eventId }),
  }
}
