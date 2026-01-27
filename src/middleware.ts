import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Add the pathname to headers so server components can access it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  const { pathname } = request.nextUrl

  // Check if this is a potential old storefront URL (/{slug} format, not already /store/)
  const slugMatch = pathname.match(/^\/([a-z0-9-]+)(?:\/.*)?$/)

  if (slugMatch && !pathname.startsWith('/store/')) {
    const slug = slugMatch[1]

    // Exclude known non-storefront routes
    const excludedPaths = [
      'admin', 'api', 'pianos', 'products', 'artists', 'blog', 'find-a-dealer',
      'storefronts', 'cart', 'about', 'contact', 'privacy', 'terms', 'namm',
      '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'images', 'fonts'
    ]

    // Check if this is a sub-route that might be a storefront sub-page
    const isSubRoute = pathname.includes('/', 1) // Has more than one slash
    const basePath = isSubRoute ? (pathname.split('/')[1] || slug) : slug

    if (basePath && !excludedPaths.includes(basePath)) {
      try {
        // Check if this slug is a storefront by calling the API
        const apiUrl = new URL('/api/storefronts/active-slugs', request.url)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2s timeout

        const response = await fetch(apiUrl.toString(), {
          signal: controller.signal,
          headers: {
            'x-middleware-fetch': 'true',
          },
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const storefrontSlugs: string[] = data.slugs || []

          // If this slug matches a storefront, redirect to /store/{slug}
          if (storefrontSlugs.includes(basePath)) {
            const newPath = pathname.replace(`/${basePath}`, `/store/${basePath}`)
            const redirectUrl = new URL(newPath, request.url)

            // Preserve query parameters
            redirectUrl.search = request.nextUrl.search

            console.log(`[Middleware] Redirecting ${pathname} -> ${newPath}`)

            return NextResponse.redirect(redirectUrl, { status: 308 }) // 308 = Permanent Redirect
          }
        }
      } catch (error) {
        // On timeout or error, let the request continue (fail open)
        console.error('Error checking storefront in middleware:', error)
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
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
     * - store (already on new path)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|store).*)',
  ],
}
