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
const CACHE_TTL_MS = 30_000 // 30 seconds

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
  const site = host.startsWith('cad.') ? 'cad' : 'us'
  requestHeaders.set('x-site', site)

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
