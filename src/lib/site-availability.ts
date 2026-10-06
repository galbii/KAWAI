import type { Where } from 'payload'
import type { Site } from '@/lib/site-context'

/**
 * Per-document site availability (kawaius.com vs ca.kawaius.com).
 *
 * Any collection can opt in by adding `siteAvailabilityField()` (from
 * `@/lib/payload/fields`). A document is then served on:
 *
 * | `siteAvailability` | kawaius.com | ca.kawaius.com |
 * |--------------------|-------------|----------------|
 * | `all` / unset      | ✅          | ✅             |
 * | `us`               | ✅          | ❌             |
 * | `cad`              | ❌          | ✅             |
 *
 * Restricting is expressed as "not exclusive to the OTHER site" rather than
 * "equals this site or all" on purpose: documents saved before the field
 * existed have no `siteAvailability` key in Mongo at all, and `not_equals`
 * keeps them. The entire existing catalog therefore stays on both sites with
 * no backfill migration — the same trick as `src/lib/products/visibility.ts`.
 *
 * Pure module (no `server-only`, no `next/headers`) so it can be used from
 * collection configs, middleware, route handlers, and client components alike.
 */

export type SiteAvailability = 'all' | Site

export const SITE_AVAILABILITY_FIELD = 'siteAvailability'

export const SITE_AVAILABILITY_OPTIONS: ReadonlyArray<{ label: string; value: SiteAvailability }> = [
  { label: 'All sites (US + Canada)', value: 'all' },
  { label: 'US only (kawaius.com)', value: 'us' },
  { label: 'Canada only (ca.kawaius.com)', value: 'cad' },
]

const ALL_SITES: readonly Site[] = ['us', 'cad']

const OTHER_SITE: Record<Site, Site> = { us: 'cad', cad: 'us' }

/**
 * Resolve the site from a request Host header. The single source of truth for
 * the domain → site rule — middleware uses it to set `x-site`, and route
 * handlers outside the middleware matcher (`/api/*`) call it directly.
 */
export function siteFromHost(host: string | null | undefined): Site {
  return (host ?? '').startsWith('ca.') ? 'cad' : 'us'
}

/**
 * The Payload `Where` fragment that keeps only documents available on `site`.
 * Spread into an `and: [...]` alongside the query's other conditions.
 *
 * `field` defaults to `siteAvailability`; pass a dotted path when the field is
 * nested (e.g. inside a group).
 */
export function availableOnSite(site: Site, field: string = SITE_AVAILABILITY_FIELD): Where {
  return { [field]: { not_equals: OTHER_SITE[site] } }
}

/** Shape of the subset of a document these helpers read. */
export type SiteAvailabilityBearing = {
  siteAvailability?: SiteAvailability | string | null | undefined
}

/**
 * Sites a document is served on. Anything other than an explicit `us`/`cad`
 * (missing, null, `all`, an unknown legacy value) means both — failing open
 * keeps a typo from silently de-listing a product.
 */
export function sitesFor(doc: SiteAvailabilityBearing | null | undefined): Site[] {
  const value = doc?.siteAvailability
  return value === 'us' || value === 'cad' ? [value] : [...ALL_SITES]
}

/**
 * In-memory equivalent of `availableOnSite`, for filtering an already-fetched
 * list or gating a single document (e.g. the product detail page).
 */
export function isAvailableOnSite(doc: SiteAvailabilityBearing | null | undefined, site: Site): boolean {
  return sitesFor(doc).includes(site)
}

/**
 * The one site a restricted document lives on, or `null` when it is on both.
 * Used to redirect cross-site visitors and to drop hreflang alternates.
 */
export function exclusiveSite(doc: SiteAvailabilityBearing | null | undefined): Site | null {
  const sites = sitesFor(doc)
  return sites.length === 1 ? (sites[0] ?? null) : null
}
