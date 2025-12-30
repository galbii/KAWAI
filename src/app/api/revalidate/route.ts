import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * On-Demand Revalidation API Route
 *
 * This route is called by Payload CMS hooks (e.g., afterChange) to trigger
 * immediate revalidation of statically generated pages when content changes.
 *
 * Security: Requires a secret token to prevent unauthorized revalidation requests.
 *
 * Usage:
 * POST /api/revalidate
 * Body: { secret: string, slug?: string, path?: string, type?: string }
 *
 * Examples:
 * - Revalidate storefront: { secret: "...", slug: "st-louis", type: "storefront" }
 * - Revalidate specific path: { secret: "...", path: "/st-louis" }
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { secret, slug, path, type } = body

    // Validate secret token
    const revalidationSecret = process.env.REVALIDATION_SECRET

    if (!revalidationSecret) {
      console.error('[Revalidation] REVALIDATION_SECRET not configured in environment')
      return NextResponse.json(
        {
          revalidated: false,
          error: 'Revalidation not configured'
        },
        { status: 500 }
      )
    }

    if (secret !== revalidationSecret) {
      console.warn('[Revalidation] Invalid revalidation secret provided')
      return NextResponse.json(
        {
          revalidated: false,
          error: 'Invalid secret'
        },
        { status: 401 }
      )
    }

    // Determine path to revalidate
    let pathToRevalidate: string

    if (path) {
      // Direct path provided
      pathToRevalidate = path
    } else if (slug && type) {
      // Construct path based on type and slug
      switch (type) {
        case 'storefront':
          pathToRevalidate = `/${slug}`
          break
        case 'product':
          pathToRevalidate = `/products/${slug}`
          break
        case 'post':
          pathToRevalidate = `/blog/${slug}`
          break
        case 'landing-page':
          // Landing pages use dealer/campaign slug pattern
          const [dealerSlug, campaignSlug] = slug.split('/')
          if (!dealerSlug || !campaignSlug) {
            throw new Error('Landing page requires dealer and campaign slugs separated by "/"')
          }
          pathToRevalidate = `/${dealerSlug}/${campaignSlug}`
          break
        default:
          pathToRevalidate = `/${slug}`
      }
    } else if (slug) {
      // Default: assume it's a storefront or simple page
      pathToRevalidate = `/${slug}`
    } else {
      return NextResponse.json(
        {
          revalidated: false,
          error: 'Missing required parameters: provide either "path" or "slug"'
        },
        { status: 400 }
      )
    }

    // Clear application-level cache (if you have a custom cache utility)
    // This is important if you're using in-memory caching like the one in lib/payload.ts
    if (typeof global !== 'undefined' && (global as any).payloadCache) {
      const cacheKey = type === 'storefront' ? `storefront-${slug}` : slug
      ;(global as any).payloadCache.delete(cacheKey)
      console.log(`[Revalidation] Cleared application cache for key: ${cacheKey}`)
    }

    // Revalidate the path using Next.js on-demand revalidation
    revalidatePath(pathToRevalidate)

    console.log(`[Revalidation] Successfully revalidated path: ${pathToRevalidate} (type: ${type || 'unknown'}, slug: ${slug || 'N/A'})`)

    return NextResponse.json({
      revalidated: true,
      path: pathToRevalidate,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Revalidation] Error during revalidation:', error)

    return NextResponse.json(
      {
        revalidated: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

// GET method for testing/debugging (only in development)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'GET method only available in development' },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  if (!path || !secret) {
    return NextResponse.json({
      message: 'Revalidation API - Development Mode',
      usage: 'POST /api/revalidate with body: { secret, slug?, path?, type? }',
      example: {
        storefront: { secret: 'your-secret', slug: 'st-louis', type: 'storefront' },
        product: { secret: 'your-secret', slug: 'gx-7-blak', type: 'product' },
        post: { secret: 'your-secret', slug: 'my-blog-post', type: 'post' },
        customPath: { secret: 'your-secret', path: '/custom/path' }
      }
    })
  }

  // Allow testing via GET in development
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ secret, path }),
      headers: { 'Content-Type': 'application/json' }
    })
  )
}
