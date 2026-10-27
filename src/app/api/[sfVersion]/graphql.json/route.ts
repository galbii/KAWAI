/**
 * Same-origin Storefront API proxy for Shopify consent + tracking cookies.
 *
 * Shopify's Customer Privacy API (loaded by `src/lib/shopify/analytics.ts`)
 * POSTs to `/api/{unstable|YYYY-MM}/graphql.json` on the storefront's own
 * origin. Proxying it to the store lets Shopify's HttpOnly tracking cookies
 * (`_shopify_analytics`, `_shopify_marketing`, …) land first-party on
 * kawaius.com, which replaced the retired `_shopify_y` / `_shopify_s` cookies.
 *
 * Only `consentManagement` queries are forwarded — this is not a general
 * Storefront API proxy. Cart and catalog traffic keep going direct to Shopify.
 *
 * Header handling follows Hydrogen's `sfapi-proxy` interceptor.
 */

import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const VERSION_RE = /^(unstable|\d{4}-\d{2})$/
const CONSENT_QUERY_RE = /^\s*query(\s+\w+)?\s*\{\s*consentManagement\s*\{/
const MAX_BODY_BYTES = 8 * 1024

const FORWARDED_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'origin',
  'referer',
  'user-agent',
  'shopify-storefront-consent-management',
  'x-shopify-uniquetoken',
  'x-shopify-visittoken',
]

// Only Shopify's own cookies go upstream — not GA/PostHog/HubSpot/Meta ones
const SHOPIFY_COOKIE_RE = /^(_shopify_|_tracking_consent$|_landing_page$|_orig_referrer$)/

const FORWARDED_RESPONSE_HEADERS = ['content-type', 'server-timing']

function shopifyCookies(cookieHeader: string | null): string {
  if (!cookieHeader) return ''
  return cookieHeader
    .split(';')
    .map(c => c.trim())
    .filter(c => SHOPIFY_COOKIE_RE.test(c.split('=')[0] ?? ''))
    .join('; ')
}

function getStore(host: string) {
  return host.startsWith('ca.')
    ? {
        domain: process.env.NEXT_PUBLIC_SHOPIFY_CA_STORE_DOMAIN || process.env.SHOPIFY_CA_STORE_DOMAIN,
        token: process.env.NEXT_PUBLIC_SHOPIFY_CA_STOREFRONT_ACCESS_TOKEN,
      }
    : {
        domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN,
        token: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      }
}

function reject(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sfVersion: string }> }
) {
  const { sfVersion } = await params
  if (!VERSION_RE.test(sfVersion)) return reject(404, 'Not found')

  const body = await request.text()
  if (body.length > MAX_BODY_BYTES) return reject(413, 'Payload too large')

  let query: unknown
  try {
    query = (JSON.parse(body) as { query?: unknown }).query
  } catch {
    return reject(400, 'Invalid JSON')
  }
  if (typeof query !== 'string' || !CONSENT_QUERY_RE.test(query)) {
    return reject(403, 'Only consentManagement queries are proxied')
  }

  const store = getStore(request.headers.get('host') ?? '')
  if (!store.domain || !store.token) return reject(503, 'Shopify store not configured')

  const headers = new Headers()
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }
  const cookie = shopifyCookies(request.headers.get('cookie'))
  if (cookie) headers.set('cookie', cookie)
  // The token is the matching store's public one regardless of what the
  // browser sent, so a US token can never be replayed against the CA store.
  headers.set('X-Shopify-Storefront-Access-Token', store.token)

  const buyerIp =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (buyerIp) headers.set('Shopify-Storefront-Buyer-IP', buyerIp)

  let upstream: Response
  try {
    upstream = await fetch(`https://${store.domain}/api/${sfVersion}/graphql.json`, {
      method: 'POST',
      headers,
      body,
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return reject(502, 'Shopify unavailable')
  }

  const responseHeaders = new Headers({
    'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
  })
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name)
    if (value) responseHeaders.set(name, value)
  }
  // Shopify sets host-only cookies (no Domain attribute), so passing them
  // through scopes them to whichever kawaius.com host made the request.
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append('Set-Cookie', cookie)
  }

  // Buffered (the payload is tiny) so the response carries a Content-Length
  // and completes cleanly; the consent API reads tokens off this request's
  // resource-timing entry, which only exists once the response finishes.
  return new Response(await upstream.text(), { status: upstream.status, headers: responseHeaders })
}
