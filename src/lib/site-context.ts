import 'server-only'
import { headers } from 'next/headers'

export type Site = 'us' | 'cad'
export type Locale = 'en-US' | 'en-CA'

export const SITE_URLS = {
  us: 'https://kawaius.com',
  cad: 'https://ca.kawaius.com',
} as const

export async function getSite(): Promise<Site> {
  const h = await headers()
  return (h.get('x-site') ?? 'us') as Site
}

// Maps the site discriminant to the Payload locale code used in payload.config.ts.
// Pass this into `payload.find({ locale })` and into cache keys so US and CA
// requests don't collide in the unstable_cache.
export function localeFromSite(site: Site): Locale {
  return site === 'cad' ? 'en-CA' : 'en-US'
}

export function getSiteName(site: Site): string {
  return site === 'cad' ? 'Kawai Canada' : 'Kawai America'
}

export function getSiteUrl(site: Site): string {
  return SITE_URLS[site]
}

/** Returns the alternates.languages object for use in Next.js Metadata hreflang tags */
export function getSiteAlternates(path: string) {
  return {
    'en-US': `${SITE_URLS.us}${path}`,
    'en-CA': `${SITE_URLS.cad}${path}`,
    'x-default': `${SITE_URLS.us}${path}`,
  }
}

/**
 * Full `alternates` object (self-referencing canonical + hreflang) for pages
 * using static `export const metadata` — where `getSite()` isn't available.
 * Canonical points at the US apex; hreflang covers the CA variant.
 */
export function getStaticAlternates(path: string) {
  return {
    canonical: `${SITE_URLS.us}${path}`,
    languages: getSiteAlternates(path),
  }
}
