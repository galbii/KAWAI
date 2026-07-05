import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { ResolvedRedirect } from '@/app/(frontend)/api/redirects-list/route'

// ---------------------------------------------------------------------------
// Module-level redirect cache
//
// This runs in the same long-lived Node.js/Bun process, so module-level
// state persists across requests (unlike V8 Edge isolates on Vercel).
// For Vercel Edge deployments, replace with Vercel KV or Edge Config.
// ---------------------------------------------------------------------------
let _cache: ResolvedRedirect[] | null = null
let _cacheTime = 0
const CACHE_TTL_MS = 300_000 // 5 minutes

// EEA + UK + Switzerland — jurisdictions that require prior opt-in consent for
// analytics/advertising cookies. Everywhere else (US, Canada, rest of world)
// uses the opt-out model. Consumed client-side via the kawai-consent-region
// cookie to gate PostHog + Meta Pixel (see src/lib/consent-region.ts).
const RESTRICTED_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES',
  'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
])

async function getRedirects(baseUrl: string): Promise<ResolvedRedirect[]> {
  const now = Date.now()
  if (_cache !== null && now - _cacheTime < CACHE_TTL_MS) {
    return _cache
  }

  try {
    const res = await fetch(`${baseUrl}/api/redirects-list`, {
      // Skip Next.js Data Cache — we manage our own TTL above
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    _cache = await res.json()
    _cacheTime = now
    return _cache ?? []
  } catch (err) {
    console.error('[Middleware] Failed to fetch redirects:', err)
    return _cache ?? [] // Serve stale cache rather than failing hard
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block unauthenticated access to /api/access
  if (pathname === '/api/access') {
    const token = request.cookies.get('payload-token')
    if (!token) {
      return NextResponse.json({ errors: [{ message: 'Unauthorized' }] }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Require Payload dashboard login to view /terms
  if (pathname === '/terms') {
    const token = request.cookies.get('payload-token')
    if (!token) {
      const loginUrl = new URL('/admin', request.url)
      loginUrl.searchParams.set('redirect', '/terms')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Add the pathname to headers so server components can access it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Detect domain — used by layouts, metadata, sitemap, and robots for site-specific rendering
  const host = request.headers.get('host') ?? ''
  const site = host.startsWith('ca.') ? 'cad' : 'us'
  requestHeaders.set('x-site', site)

  // Shigeru Kawai pages are US-only — redirect CA visitors to the US domain
  if (site === 'cad' && pathname.startsWith('/shigeru')) {
    return NextResponse.redirect(`https://kawaius.com${pathname}`, { status: 302 })
  }

  // Check CMS-managed redirects
  // Normalize pathname by stripping trailing slash (except root "/") so that
  // /old-page/ matches a stored redirect of /old-page
  const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin
  const redirects = await getRedirects(baseUrl)
  const match = redirects.find((r) => r.from === normalizedPathname)

  if (match) {
    // Support both absolute URLs (https://...) and relative paths (/new-path)
    const destination = match.to.startsWith('http')
      ? match.to
      : new URL(match.to, request.url).toString()

    return NextResponse.redirect(destination, { status: Number(match.type) })
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Dealer context cookie — readable server-side via cookies() and client-side via document.cookie.
  // Set when entering a storefront, clear when returning to the homepage.
  if (pathname.startsWith('/store/')) {
    const slug = pathname.split('/')[2]
    if (slug) {
      response.cookies.set('kawai-dealer-slug', slug, {
        path: '/',
        sameSite: 'lax',
        // No httpOnly — NavigationContext reads this client-side via document.cookie
        // No maxAge — session cookie, cleared when browser closes
      })
    }
  } else if (pathname === '/' || pathname === '') {
    response.cookies.delete('kawai-dealer-slug')
  }

  // Consent region cookie — exposes EEA/UK/CH status to client-side tracking
  // (PostHog, Meta Pixel) which, unlike Google Consent Mode, can't gate by
  // region on their own. Cloudflare provides the visitor country via
  // cf-ipcountry ('XX' = unknown/Tor). No httpOnly — read via document.cookie,
  // same pattern as kawai-dealer-slug above.
  const country = request.headers.get('cf-ipcountry')?.toUpperCase()
  if (country && country !== 'XX') {
    response.cookies.set(
      'kawai-consent-region',
      RESTRICTED_COUNTRIES.has(country) ? 'eu' : 'row',
      { path: '/', sameSite: 'lax' },
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) — but explicitly include /api/access
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/access',
    '/terms',
  ],
}
