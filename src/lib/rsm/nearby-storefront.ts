/**
 * Nearest official Kawai storefront to a lead — pure matching + projection.
 *
 * The lead funnel (/signup, /fall-financing, …) routes every submission to the
 * nearest independent dealer's RSM via ./routing, which reads only the
 * `dealers` collection. The Kawai-owned showrooms live in `storefronts`, so
 * before this module a lead next door to one was never pointed at it. This is
 * the storefront half of that match: given the lead's geocoded ZIP, which
 * showroom (if any) is close enough to market to them.
 *
 * A storefront owns a lead when either
 *   - the lead's ZIP is listed in its "Zip Codes Served" (explicit coverage
 *     outranks distance — the store has said "this ZIP is ours"), or
 *   - it is the CLOSEST location to the lead: nearer than every independent
 *     RSM-routable dealer, same country, and within
 *     {@link storefrontLeadRadiusMiles}. A dealer that is closer keeps the lead
 *     with its RSM, so a storefront never takes a lead from a nearer dealer.
 *
 * Dealer listings that sit on top of a storefront (within
 * {@link SAME_LOCATION_MILES} — e.g. the "Kawai Piano Gallery" entries at the
 * Houston and Plano showrooms) are the same place, not competitors, so they are
 * ignored when finding the nearest dealer. Same rule DealerMapBlock uses to
 * merge them on /find-a-dealer.
 *
 * Pure types + functions — safe to import from client components and tests.
 * Storefront contact details are already published on /store/[slug], so the
 * projection carries nothing that isn't public.
 */

import type { Storefront } from '@/payload-types'
import { calculateDistance } from '@/lib/utils/dealer-search'
import { classifyDealerCountry, type DealerRegion } from '@/lib/utils/dealer-country'

/**
 * How far a showroom reaches for a lead with no explicit ZIP coverage. A piano
 * is a drive-to purchase; 60 miles is roughly an hour, the same horizon the
 * storefront pages' "drive time" service-area copy works to.
 */
export const DEFAULT_STOREFRONT_LEAD_RADIUS_MILES = 60

/** Radius in miles. Override with LEAD_STOREFRONT_RADIUS_MILES (server only). */
export function storefrontLeadRadiusMiles(): number {
  const raw = Number(process.env.LEAD_STOREFRONT_RADIUS_MILES)
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_STOREFRONT_LEAD_RADIUS_MILES
}

/** A dealer this close to a storefront pin is the storefront itself. */
export const SAME_LOCATION_MILES = 0.6

/**
 * The storefront fields lead matching reads — the `select` for the loader.
 * Every group is optional because a `select`ed doc only carries what was asked for.
 */
export interface StorefrontForLeadRouting {
  id: Storefront['id']
  slug: Storefront['slug']
  locationName: Storefront['locationName']
  isActive?: Storefront['isActive']
  address?: Storefront['address'] | null
  showroomInfo?: Partial<Storefront['showroomInfo']> | null
  schemaData?: { geoCoordinates?: Storefront['schemaData']['geoCoordinates'] } | null
  serviceAreaCoverage?: { zipCodes?: string | null } | null
}

/** One showroom as shown to the visitor and named in the lead emails. */
export interface NearbyStorefrontOption {
  id: string
  slug: string
  /** Display name, e.g. "St. Louis". Storefronts are branded by city. */
  name: string
  /** "St. Louis, MO" */
  location: string
  phone: string | null
  /** Showroom inbox — the recipient of the storefront lead email. */
  email: string | null
  /** Miles from the lead's ZIP, one decimal. */
  distance: number
  /** True when matched by the store's own ZIP list rather than by distance. */
  coveredZip: boolean
  /** Storefront page, for the visitor CTA. */
  href: string
}

/** First five characters of a US ZIP, or the upper-cased, unspaced postal code. */
function normalizeZip(zip: string): string {
  const z = zip.trim().toUpperCase().replace(/[\s-]/g, '')
  return /^\d{9}$/.test(z) || /^\d{5}$/.test(z) ? z.slice(0, 5) : z
}

/**
 * Parse a "Zip Codes Served" textarea. Extracted by shape rather than split on
 * separators: editors use commas, spaces or newlines, and a Canadian postal
 * code ("M5V 2T6") contains a space of its own.
 */
export function parseServedZips(raw: string | null | undefined): Set<string> {
  const codes = (raw ?? '').match(/\b(\d{5}(?:-\d{4})?|[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d)\b/g)
  return new Set((codes ?? []).map(normalizeZip))
}

function coordsOf(sf: StorefrontForLeadRouting): { lat: number; lng: number } | null {
  const lat = sf.schemaData?.geoCoordinates?.latitude
  const lng = sf.schemaData?.geoCoordinates?.longitude
  if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) return null
  return { lat, lng }
}

/** Whitelist a storefront down to the fields the browser and emails need. */
export function toNearbyStorefrontOption(
  sf: StorefrontForLeadRouting,
  distance: number,
  coveredZip: boolean,
): NearbyStorefrontOption {
  return {
    id: sf.id,
    slug: sf.slug,
    name: sf.locationName,
    location: [sf.address?.city, sf.address?.state].filter(Boolean).join(', '),
    phone: sf.showroomInfo?.phone ?? null,
    email: sf.showroomInfo?.email ?? null,
    distance: Math.round(distance * 10) / 10,
    coveredZip,
    href: `/store/${sf.slug}`,
  }
}

/**
 * The showroom that should be marketed to this lead, or null.
 *
 * Explicit ZIP coverage wins over distance (nearest covering store if several
 * list the same ZIP); otherwise the nearest same-country showroom inside the
 * radius. Inactive and ungeocoded storefronts never match.
 */
export function findNearestStorefront(
  storefronts: StorefrontForLeadRouting[],
  coords: { lat: number; lng: number },
  leadZip: string,
  leadCountry: DealerRegion,
  radiusMiles: number = DEFAULT_STOREFRONT_LEAD_RADIUS_MILES,
  /**
   * Distance to the nearest independent dealer (see
   * {@link nearestIndependentDealerMiles}). A storefront farther than this
   * loses the lead to that dealer's RSM. Null/omitted — no dealer to compare.
   */
  nearestDealerMiles: number | null = null,
): NearbyStorefrontOption | null {
  const zip = normalizeZip(leadZip)

  const ranked = storefronts
    .filter((sf) => sf.isActive !== false && Boolean(sf.slug))
    .map((sf) => {
      const at = coordsOf(sf)
      return {
        sf,
        at,
        covers: parseServedZips(sf.serviceAreaCoverage?.zipCodes).has(zip),
      }
    })
    // A covering store may be ungeocoded and still match — its own ZIP list
    // is the authority. A distance match needs a real pin and the same country.
    .filter(({ sf, at, covers }) =>
      covers || (at !== null && classifyDealerCountry(sf.address?.country) === leadCountry),
    )
    .map(({ sf, at, covers }) => ({
      sf,
      covers,
      distance: at ? calculateDistance(coords.lat, coords.lng, at.lat, at.lng) : 0,
    }))
    .sort((a, b) => Number(b.covers) - Number(a.covers) || a.distance - b.distance)

  const best = ranked[0]
  if (!best) return null
  if (!best.covers) {
    if (best.distance > radiusMiles) return null
    // Closest wins. A tie goes to the storefront.
    if (nearestDealerMiles !== null && best.distance > nearestDealerMiles) return null
  }
  return toNearbyStorefrontOption(best.sf, best.distance, best.covers)
}

/**
 * Miles to the nearest dealer that is a real alternative to a storefront: the
 * first entry of an already distance-sorted, RSM-routable dealer list that is
 * not a duplicate listing of a storefront. Null when there is none.
 */
export function nearestIndependentDealerMiles(
  rankedDealers: ReadonlyArray<{
    dealer: { coordinates?: { latitude?: number | null; longitude?: number | null } | null }
    distance: number
  }>,
  storefronts: StorefrontForLeadRouting[],
): number | null {
  const pins = storefronts
    .filter((sf) => sf.isActive !== false)
    .map(coordsOf)
    .filter((p): p is { lat: number; lng: number } => p !== null)

  for (const { dealer, distance } of rankedDealers) {
    const lat = dealer.coordinates?.latitude
    const lng = dealer.coordinates?.longitude
    const isStorefront =
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      pins.some((p) => calculateDistance(lat, lng, p.lat, p.lng) <= SAME_LOCATION_MILES)
    if (!isStorefront) return distance
  }
  return null
}
