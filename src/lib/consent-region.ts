/**
 * Consent region helper (client-side).
 *
 * Google Consent Mode gates Google tags (GA4, Google Ads) by region natively —
 * Google does its own geo lookup, so no cookie is needed there. PostHog and the
 * Meta Pixel have no equivalent, so `middleware.ts` reads Cloudflare's
 * `cf-ipcountry` header and writes the `kawai-consent-region` cookie
 * (`'eu'` = EEA/UK/CH, `'row'` = rest of world). We read it here to decide
 * whether those two tools capture by default (opt-out model) or wait for
 * explicit opt-in (EEA/UK/CH, where GDPR/UK-GDPR/FADP require it).
 *
 * Fails OPEN: when the cookie is absent (e.g. a page served straight from
 * Cloudflare's edge cache without running middleware), we treat the visitor as
 * unrestricted and capture. Google tags stay correctly gated regardless, since
 * Consent Mode's region logic runs server-side at Google.
 */
export const CONSENT_REGION_COOKIE = 'kawai-consent-region'

export function isConsentRestricted(): boolean {
  if (typeof document === 'undefined') return false
  const match = document.cookie.match(/(?:^|;\s*)kawai-consent-region=([^;]*)/)
  return match?.[1] === 'eu'
}
