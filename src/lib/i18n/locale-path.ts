/**
 * UI locale path-prefix helpers.
 *
 * Language lives in the URL path, country lives in the domain:
 *
 *   kawaius.com/pianos          → en-US
 *   ca.kawaius.com/pianos       → en-CA
 *   ca.kawaius.com/fr/pianos    → fr-CA
 *
 * English is the *unprefixed* default, so every existing URL keeps working
 * exactly as-is — important because the SEO remediation sprint's canonicals
 * and redirects are all keyed to those paths.
 *
 * These are pure string functions with no Next.js imports, so both the
 * middleware (server, edge-ish) and the LocaleSwitcher (client) can use them.
 */

export const UI_LOCALES = ['en', 'fr'] as const

export type UiLocale = (typeof UI_LOCALES)[number]

/** The locale that is served without a path prefix. */
export const DEFAULT_UI_LOCALE: UiLocale = 'en'

/** Locales that DO carry a path prefix (everything except the default). */
const PREFIXED_LOCALES = UI_LOCALES.filter((l) => l !== DEFAULT_UI_LOCALE)

export function isUiLocale(value: string): value is UiLocale {
  return (UI_LOCALES as readonly string[]).includes(value)
}

type ParsedLocalePath = {
  locale: UiLocale
  /** The pathname with any locale prefix removed — what the route tree sees. */
  pathname: string
}

/**
 * Splits a locale prefix off a pathname.
 *
 * Matches whole segments only, so `/french-horn` and `/fr-CA/...` are ordinary
 * routes rather than French ones.
 */
export function parseLocalePath(pathname: string): ParsedLocalePath {
  const [, firstSegment = ''] = pathname.split('/')
  const candidate = firstSegment.toLowerCase()

  if (!(PREFIXED_LOCALES as readonly string[]).includes(candidate)) {
    return { locale: DEFAULT_UI_LOCALE, pathname }
  }

  // Drop the leading "/" + segment. `/fr` and `/fr/` both collapse to "/".
  const rest = pathname.slice(firstSegment.length + 1)

  return {
    locale: candidate as UiLocale,
    pathname: rest === '' || rest === '/' ? '/' : rest,
  }
}

