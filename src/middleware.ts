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

  // Add the pathname to headers so server components can access it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Check CMS-managed redirects
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin
  const redirects = await getRedirects(baseUrl)
  const match = redirects.find((r) => r.from === pathname)

  if (match) {
    // Support both absolute URLs (https://...) and relative paths (/new-path)
    const destination = match.to.startsWith('http')
      ? match.to
      : new URL(match.to, request.url).toString()

    return NextResponse.redirect(destination, { status: Number(match.type) })
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
