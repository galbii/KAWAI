/**
 * RSM lead routing — shared matching pipeline.
 *
 * Server-only (imports the Payload Local API and selects the access-restricted
 * `rsmEmail` field). Used by two consumers that must stay in lockstep:
 *
 *   - `notifyRsmOfLead` (src/lib/actions/notify-rsm-of-lead.ts) — the real
 *     notification send on signup form submissions.
 *   - `testRsmRouting` (src/lib/actions/test-rsm-routing.ts) — the dry-run
 *     used by the internal /zipcodetest2026kawaiamerica test page.
 *
 * Never import from client components — `rsmEmail` must not reach the browser
 * outside the explicitly internal test tool.
 */

import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { classifyDealerCountry, type DealerRegion } from '@/lib/utils/dealer-country'
import type { Dealer } from '@/payload-types'

/** US ZIP (12345 / 12345-6789) vs Canadian postal (A1A 1A1) → lead's country. */
export function classifyLeadCountry(zip: string): DealerRegion {
  return /^\d{5}(-\d{4})?$/.test(zip) ? 'us' : 'canada'
}

/**
 * Cached loader for the dealer fields RSM routing needs — including the
 * access-restricted `rsmEmail`, which the Local API returns because server-side
 * reads run with overrideAccess. Tagged 'dealers' so dealer edits bust it.
 * (contactInfo + product-line flags are included for the test page's map popups.)
 */
export const getDealersForRsmRouting = unstable_cache(
  async (): Promise<Dealer[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'dealers',
        where: { isActive: { equals: true } },
        select: {
          dealerName: true,
          slug: true,
          address: true,
          coordinates: true,
          contactInfo: true,
          rsmEmail: true,
          region: true,
          ecommerceDealer: true,
          dealerType: true,
          shigeruKawaiDealer: true,
          acousticPianoDealer: true,
          professionalProductDealer: true,
          digitalPianoDealer: true,
        },
        depth: 0,
        limit: 1000,
      })
      return result.docs as Dealer[]
    } catch (err) {
      console.error('[rsm-routing] Failed to load dealers:', err)
      return []
    }
  },
  ['rsm-routing-active-dealers'],
  { tags: ['dealers'], revalidate: 3600 },
)

export interface RankedDealer {
  dealer: Dealer
  distance: number
}

export interface RsmMatch {
  rsmEmail: string
  dealer: Dealer
  distance: number
}

/**
 * All RSM-routable dealers sorted nearest-first.
 * Excludes ungeocoded dealers (the 0,0 fallback would place them off the coast
 * of Africa), e-commerce accounts, technicians, and dealers in the wrong country.
 */
export function rankRsmCandidates(
  dealers: Dealer[],
  coords: { lat: number; lng: number },
  leadCountry: DealerRegion,
): RankedDealer[] {
  return dealers
    .filter((d) => {
      const lat = d.coordinates?.latitude
      const lng = d.coordinates?.longitude
      if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) {
        return false
      }
      if (d.ecommerceDealer) return false
      if (d.dealerType !== 'dealer' && d.dealerType !== 'branch') return false
      return classifyDealerCountry(d.address?.country) === leadCountry
    })
    .map((dealer) => ({
      dealer,
      distance: calculateDistance(
        coords.lat,
        coords.lng,
        dealer.coordinates!.latitude!,
        dealer.coordinates!.longitude!,
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Nearest ranked dealer that actually has an `rsmEmail`, or null.
 * RSMs are territorial, so walking past a dealer with no rsmEmail to the next
 * nearest almost always lands on the same person.
 */
export function findNearestRsm(candidates: RankedDealer[]): RsmMatch | null {
  for (const { dealer, distance } of candidates) {
    if (dealer.rsmEmail) {
      return { rsmEmail: dealer.rsmEmail, dealer, distance }
    }
  }
  return null
}
