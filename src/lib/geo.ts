import { headers } from 'next/headers'

/**
 * Visitor's ISO 3166-1 alpha-2 country code, resolved at the Cloudflare edge
 * via the `cf-ipcountry` request header.
 *
 * Returns `null` when the country cannot be determined — local dev (no
 * Cloudflare in front), unknown IPs (`XX`), or Tor exit nodes (`T1`).
 * Callers should treat `null` as "unknown" and decide whether to fail open
 * or closed for their use case.
 *
 * NOTE: reading a request header opts the calling page into dynamic rendering
 * (no ISR / edge cache). That's inherent to any per-visitor geo decision.
 */
export async function getRequestCountry(): Promise<string | null> {
  const h = await headers()
  const cc = h.get('cf-ipcountry')?.toUpperCase()
  if (!cc || cc === 'XX' || cc === 'T1') return null
  return cc
}

/** Countries where warranty registration (and its HubSpot lead generation) is offered. */
export const WARRANTY_COUNTRIES = ['US', 'CA'] as const

/**
 * Whether warranty registration is available for the given country.
 * Fails OPEN on `null` (unknown country) so a missing edge header never
 * blocks a legitimate visitor.
 */
export function isWarrantyEligibleCountry(country: string | null): boolean {
  if (country === null) return true
  return (WARRANTY_COUNTRIES as readonly string[]).includes(country)
}
