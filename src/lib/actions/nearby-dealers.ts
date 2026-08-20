'use server'

/**
 * Public nearest-dealer lookup for the post-submit dealer picker.
 *
 * Runs the same geocode → rank pipeline as RSM routing so the five dealers a
 * visitor chooses from are exactly the five the RSM is shown — a mismatch would
 * let someone pick a dealer that never makes it into the notification.
 *
 * Public and unauthenticated by design: it returns the same information the
 * /find-a-dealer page already publishes. Every dealer is projected through
 * `toNearbyDealerOption`, so the access-restricted `rsmEmail` that
 * `getDealersForRsmRouting` loads can never ride along to the browser.
 */

import { z } from 'zod'
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import {
  classifyLeadCountry,
  getDealersForRsmRouting,
  rankRsmCandidates,
} from '@/lib/rsm/routing'
import {
  NEARBY_DEALER_COUNT,
  toNearbyDealerOptions,
  type NearbyDealerOption,
} from '@/lib/rsm/nearby-dealers'

const zipSchema = z.string().trim().min(3).max(10)

export interface NearbyDealersResult {
  /** Nearest dealers, closest first. Empty when the ZIP couldn't be resolved. */
  dealers: NearbyDealerOption[]
  /** Geocoded centre of the ZIP, for map/anchoring. Null when geocoding failed. */
  center: { lat: number; lng: number } | null
}

/**
 * The `NEARBY_DEALER_COUNT` dealers closest to a ZIP / postal code.
 *
 * Never throws — an empty list is a valid answer that the caller renders as
 * "we'll match you manually", and a lead must never be blocked by this lookup.
 */
export async function getNearbyDealersForLead(zip: string): Promise<NearbyDealersResult> {
  const parsed = zipSchema.safeParse(zip)
  if (!parsed.success) return { dealers: [], center: null }

  try {
    const coords = await geocodeZipCode(parsed.data)
    if (!coords) return { dealers: [], center: null }

    const dealers = await getDealersForRsmRouting()
    const ranked = rankRsmCandidates(dealers, coords, classifyLeadCountry(parsed.data))

    return { dealers: toNearbyDealerOptions(ranked, NEARBY_DEALER_COUNT), center: coords }
  } catch (err) {
    console.error('[nearby-dealers] Lookup failed:', err)
    return { dealers: [], center: null }
  }
}
