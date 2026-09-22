import 'server-only'
import { headers } from 'next/headers'
import { DEFAULT_UI_LOCALE, isUiLocale, type UiLocale } from './i18n/locale-path'
import { FRENCH_ENABLED } from './i18n/flags'

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

/**
 * The UI language for this request, set by the middleware from the `/fr` path
 * prefix. This is the *interface* language (nav, buttons, labels) which the
 * Lingo.dev compiler swaps at build time — distinct from the Payload `Locale`
 * below, which selects CMS field values.
 *
 * Only ever 'fr' on the CA domain; the middleware refuses the prefix elsewhere.
 */
export async function getUiLocale(): Promise<UiLocale> {
  const h = await headers()
  const value = h.get('x-locale') ?? ''
  return isUiLocale(value) ? value : DEFAULT_UI_LOCALE
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
    // French is path-prefixed under the CA domain — country by domain,
    // language by path. Every page routes metadata through this helper, so
    // adding it here propagates fr-CA alternates across all routes at once.
    // Gated: advertising /fr before it renders French would publish duplicate
    // English content under a second set of URLs.
    ...(FRENCH_ENABLED ? { 'fr-CA': `${SITE_URLS.cad}/fr${path === '/' ? '' : path}` } : {}),
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
