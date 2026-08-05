'use server'

/**
 * DRY-RUN of the RSM lead-routing pipeline — INTERNAL TEST TOOL ONLY.
 *
 * Powers /zipcodetest2026kawaiamerica. Runs the exact same matching code as
 * `notifyRsmOfLead` (geocode → rank → walk to first rsmEmail) but sends
 * NOTHING — no Resend email, no HubSpot, no Shopify. It returns the routing
 * decision so the test page can display where a submission for a given
 * ZIP/postal code WOULD have gone.
 *
 * ⚠️ This action intentionally returns internal-only data (`rsmEmail`) to the
 * browser, which the production pipeline never does. It is therefore disabled
 * in production unless ZIP_TEST_TOOL_ENABLED=true is explicitly set. Delete
 * the page + this action when testing wraps up.
 */

import { z } from 'zod'
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import {
  classifyLeadCountry,
  getDealersForRsmRouting,
  rankRsmCandidates,
  findNearestRsm,
} from '@/lib/rsm/routing'
import type { Dealer } from '@/payload-types'
import type { DealerRegion } from '@/lib/utils/dealer-country'

/** How many nearest candidates to return for the map + table. */
const CANDIDATE_LIMIT = 10

export interface ZipTestCandidate {
  dealer: Dealer
  distance: number
  hasRsmEmail: boolean
}

export interface ZipTestResult {
  success: boolean
  message: string
  zip?: string
  country?: DealerRegion
  coords?: { lat: number; lng: number }
  /** The address the notification email would be sent to. */
  wouldSendTo?: string
  /** True when no candidate had an rsmEmail (or geocoding failed). */
  usedFallback?: boolean
  /** id of the dealer whose RSM would be emailed. */
  matchedDealerId?: string | null
  candidates?: ZipTestCandidate[]
  totalCandidates?: number
}

const zipSchema = z.string().trim().min(3).max(10)

function isToolEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ZIP_TEST_TOOL_ENABLED === 'true'
}

export async function testRsmRouting(zip: string): Promise<ZipTestResult> {
  if (!isToolEnabled()) {
    return { success: false, message: 'Test tool is disabled in production.' }
  }

  const parsed = zipSchema.safeParse(zip)
  if (!parsed.success) {
    return { success: false, message: 'Enter a valid ZIP or postal code (3–10 characters).' }
  }

  const fallback =
    process.env.LEAD_NOTIFY_FALLBACK_EMAIL ??
    process.env.RESEND_FROM_EMAIL ??
    '(fallback not configured)'

  const coords = await geocodeZipCode(parsed.data)
  if (!coords) {
    return {
      success: true,
      message: `Could not geocode "${parsed.data}" — the real pipeline would route this lead to the fallback inbox.`,
      zip: parsed.data,
      country: classifyLeadCountry(parsed.data),
      wouldSendTo: fallback,
      usedFallback: true,
      matchedDealerId: null,
      candidates: [],
      totalCandidates: 0,
    }
  }

  const country = classifyLeadCountry(parsed.data)
  const dealers = await getDealersForRsmRouting()
  const ranked = rankRsmCandidates(dealers, coords, country)
  const match = findNearestRsm(ranked)

  return {
    success: true,
    message: '',
    zip: parsed.data,
    country,
    coords,
    wouldSendTo: match?.rsmEmail ?? fallback,
    usedFallback: !match,
    matchedDealerId: match?.dealer.id ?? null,
    candidates: ranked.slice(0, CANDIDATE_LIMIT).map(({ dealer, distance }) => ({
      dealer,
      distance: Math.round(distance * 10) / 10,
      hasRsmEmail: Boolean(dealer.rsmEmail),
    })),
    totalCandidates: ranked.length,
  }
}
