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

/**
 * Query params the upstream viewer understands, beyond `model`. Anything not
 * listed here is dropped rather than forwarded blindly.
 *
 * - region   Filters the finish/variant list to what that region sells. Only
 *            'GLOBAL' is recognised upstream; other values fall through to
 *            "no restriction" (all finishes shown). Dropping it is what let the
 *            ES60 offer a White finish we don't sell.
 * - inModal  Adds `body.in-modal`, which repositions the options panel to clear
 *            a modal close button. Purely cosmetic but we always frame it in a modal.
 * - finish   Preselects a variant code (e.g. 'W', 'E/P').
 * - pose     Preselects a camera pose.
 * - options  Preselects model option toggles (music rest, stand, ...).
 */
const FORWARDED_PARAMS = ['region', 'inModal', 'finish', 'pose', 'options'] as const

/**
 * Extensions the `?asset=` branch will serve: the viewer's own js/css plus the
 * model/texture formats it references.
 */
const ALLOWED_ASSET_EXTENSIONS = new Set([
  'js',
  'css',
  'map',
  'jpg',
  'jpeg',
  'png',
  'webp',
  'svg',
  'ktx2',
  'hdr',
  'bin',
  'gltf',
  'glb',
  'woff',
  'woff2',
  'ttf',
])

/**
 * Reject anything that isn't a plain relative asset path under /modelviewer/.
 * Mirrors `isSafeAssetPath` in /api/models/[...path]/route.ts.
 *
 * `asset` is caller-controlled, and the upstream origin is a hardcoded prefix
 * rather than a parsed URL — so without this, `?asset=../../<anything>` escapes
 * /modelviewer/ and turns this route into a read-through proxy for any path on
 * kawai-global.com.
 */
function isSafeViewerAssetPath(relativePath: string): boolean {
  const segments = relativePath.split('/')
  if (segments.length === 0 || segments.length > 8) return false

  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..') return false
    // Conservative allowlist — viewer asset names are alphanumeric plus . _ -
    if (!/^[A-Za-z0-9._-]+$/.test(segment)) return false
  }

  const filename = segments[segments.length - 1] ?? ''
  const extension = filename.split('.').pop()?.toLowerCase() ?? ''
  return ALLOWED_ASSET_EXTENSIONS.has(extension)
}

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

    // Handle asset requests: the viewer's own js/css (see the HTML rewrite below),
    // plus GLTF files and textures.
    if (asset) {
      // Accept both 'js/viewer-app.min.js' and '/modelviewer/js/viewer-app.min.js'
      const relativeAsset = asset.replace(/^\/+/, '').replace(/^modelviewer\//, '')

      if (!isSafeViewerAssetPath(relativeAsset)) {
        console.error('[3D Viewer Proxy] Rejected asset path:', asset)
        return NextResponse.json({ error: 'Invalid asset path' }, { status: 400 })
      }

      const targetUrl = `${VIEWER_ORIGIN}/modelviewer/${relativeAsset}`
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
          // Model assets carry a version in the filename (_2K_C, _v03) and are safe to
          // pin for a year. viewer-app.min.js / viewer-styles.css do NOT — pinning those
          // would mean an upstream viewer fix never reaches anyone.
          'Cache-Control': /\.(?:js|css|map)$/.test(relativeAsset)
            ? 'public, max-age=3600, stale-while-revalidate=86400'
            : 'public, max-age=31536000, immutable',
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

    // Construct the target URL for HTML, forwarding the supported viewer params.
    const targetParams = new URLSearchParams({ model })
    for (const key of FORWARDED_PARAMS) {
      const value = searchParams.get(key)
      if (value) targetParams.set(key, value)
    }

    const targetUrl = `${VIEWER_BASE}?${targetParams.toString()}`

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

    // Read the response body and repoint the viewer's OWN relative asset URLs.
    //
    // The upstream document references these three by relative path:
    //   <link rel="stylesheet"    href="css/viewer-styles.css">
    //   <link rel="modulepreload" href="js/viewer-app.min.js">
    //   <script type="module"      src="js/viewer-app.min.js" defer>
    // Upstream they resolve against /modelviewer/index.php. Here the document is
    // /api/3d-viewer-proxy, so they resolve to /api/js/... and /api/css/..., which
    // hit Payload's API catch-all and 404. viewer-app.min.js is what decrypts and
    // loads the model, so without this rewrite every model renders an empty viewer
    // and nothing surfaces an error — the document itself is a healthy 200.
    //
    // They cannot simply point at kawai-global either: it serves them with no
    // Access-Control-Allow-Origin, and a type="module" script is always fetched in
    // CORS mode, so it must stay same-origin. Hence the `?asset=` branch above.
    //
    // Everything else is deliberately left alone:
    //   - Scripts (model-viewer, Draco) are absolute CDN URLs (jsdelivr, gstatic) and
    //     load directly — our CSP whitelists them (see src/lib/csp.ts).
    //   - The viewer's runtime model fetches use a relative "?_req=..." URL, which
    //     resolves against this proxy document and is handled by the `_req` branch above.
    //   - Textures are built from location.pathname and resolve to /api/models/...
    //     (see src/app/api/models/[...path]/route.ts).
    //
    // NB: a <base> tag looks like the tidier fix and is wrong — it would also retarget
    // that query-only "?_req=..." fetch off this route and break model loading outright.
    const content = (await response.text()).replace(
      /\b(href|src)="((?:js|css)\/[^"]+)"/g,
      (_match: string, attr: string, assetPath: string) =>
        `${attr}="/api/3d-viewer-proxy?asset=${encodeURIComponent(assetPath)}"`,
    )

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
