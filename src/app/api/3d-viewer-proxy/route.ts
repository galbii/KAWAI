import { NextRequest, NextResponse } from 'next/server'

/**
 * 3D Viewer Proxy API Route
 *
 * Purpose: Acts as a server-side proxy to fetch content from kawai-global.com
 * and strip the X-Frame-Options header that prevents iframe embedding.
 *
 * Problem: External 3D viewer sends X-Frame-Options: SAMEORIGIN header,
 * which blocks iframe embedding from different domains.
 *
 * Solution: Fetch content server-side, strip security headers, and serve
 * the content to our iframe with proper CORS headers.
 *
 * @example
 * GET /api/3d-viewer-proxy?model=ca901
 * Returns: HTML content from kawai-global.com without X-Frame-Options
 */

const VIEWER_ORIGIN = 'https://www.kawai-global.com'
const VIEWER_BASE = `${VIEWER_ORIGIN}/modelviewer/index.php`

export async function GET(request: NextRequest) {
  try {
    // Extract parameters from query string
    const searchParams = request.nextUrl.searchParams
    const model = searchParams.get('model')
    const asset = searchParams.get('asset')
    // The viewer's own JS fetches model assets (.glb, textures) at runtime via a
    // base64 "?_req=" handler on index.php. Those requests are relative, so they
    // resolve against THIS proxy URL and land here. kawai-global serves them
    // WITHOUT CORS headers, so they must stay same-origin (proxied) — we can't
    // point them straight at kawai-global from a <model-viewer> on our origin.
    const req = searchParams.get('_req')

    // Handle runtime model-asset requests (the "?_req=..." scheme)
    if (req) {
      const targetUrl = `${VIEWER_BASE}?_req=${encodeURIComponent(req)}`
      console.log('[3D Viewer Proxy] Fetching model asset:', targetUrl)

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KAWAI-Proxy/1.0)' },
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        console.error('[3D Viewer Proxy] Model asset fetch failed:', response.status)
        return NextResponse.json(
          { error: `Failed to fetch model asset: ${response.statusText}` },
          { status: response.status },
        )
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      const content = await response.arrayBuffer()

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000, immutable', // models are versioned in the path
        },
      })
    }

    // Handle asset requests (GLTF files, textures, etc.)
    if (asset) {
      // Ensure asset path starts with /modelviewer/ if it doesn't have a full path
      const assetPath = asset.startsWith('/modelviewer/')
        ? asset
        : `/modelviewer/${asset.replace(/^\/+/, '')}`

      const targetUrl = `https://www.kawai-global.com${assetPath}`
      console.log('[3D Viewer Proxy] Fetching asset:', targetUrl)

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KAWAI-Proxy/1.0)',
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout for large assets
      })

      if (!response.ok) {
        console.error('[3D Viewer Proxy] Asset fetch failed:', response.status)
        return NextResponse.json(
          { error: `Failed to fetch asset: ${response.statusText}` },
          { status: response.status }
        )
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream'
      const content = await response.arrayBuffer()

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache assets for 1 year
        },
      })
    }

    // Validate model parameter for HTML requests
    if (!model || typeof model !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "model" parameter' },
        { status: 400 }
      )
    }

    // Construct the target URL for HTML
    const targetUrl = `https://www.kawai-global.com/modelviewer/index.php?model=${encodeURIComponent(model)}`

    console.log('[3D Viewer Proxy] Fetching HTML:', targetUrl)

    // Fetch content from kawai-global.com
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KAWAI-Proxy/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    // Check if the fetch was successful
    if (!response.ok) {
      console.error('[3D Viewer Proxy] Fetch failed:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch 3D viewer: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'text/html'

    // Read the response body. We deliberately do NOT rewrite asset URLs:
    //   - Scripts (model-viewer, Draco) are absolute CDN URLs (jsdelivr, gstatic) and
    //     load directly — our CSP whitelists them (see src/lib/csp.ts).
    //   - The viewer's runtime model fetches use a relative "?_req=..." URL, which
    //     resolves against this proxy document and is handled by the `_req` branch above.
    // The only thing we change is stripping X-Frame-Options (done via the fresh response
    // below), which is the sole reason this proxy exists.
    const content = await response.text()

    // Create a new response with the proxied content
    // Strip X-Frame-Options and other security headers that prevent embedding
    const proxiedResponse = new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Add CORS headers to allow iframe embedding
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Cache the response for performance (15 minutes)
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        // Security headers for our own response
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // Explicitly do NOT set X-Frame-Options (that's the whole point!)
      },
    })

    console.log('[3D Viewer Proxy] Successfully proxied content for model:', model)

    return proxiedResponse

  } catch (error) {
    // Handle timeout and other errors
    console.error('[3D Viewer Proxy] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        error: 'Failed to load 3D viewer',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}

/**
 * Route segment config
 * - dynamic: Always execute at request time (not static)
 * - runtime: Use Node.js runtime for full fetch API support
 */
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
