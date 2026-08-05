import { NextRequest, NextResponse } from 'next/server'

/**
 * 3D Model Texture Proxy
 *
 * Companion to /api/3d-viewer-proxy. Serves the external texture files that
 * .gltf models reference.
 *
 * Why this path: the viewer's model loader derives its texture base URL from
 * the *document's own* pathname, not from any configurable base:
 *
 *   const basePath = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)
 *   const absoluteBaseUrl = location.origin + basePath + 'models/' + modelDir
 *   gltf.images[i].uri = absoluteBaseUrl + uri
 *
 * On kawai-global the document is /modelviewer/index.php, so textures resolve to
 * /modelviewer/models/<...>. Behind our proxy the document is
 * /api/3d-viewer-proxy, so they resolve to /api/models/<...> — this route.
 * The path is therefore dictated by the upstream viewer; do not move it without
 * also changing how the viewer HTML is served.
 *
 * Only .gltf models are affected (K-300 and friends, which ship 7 external JPGs).
 * .glb models embed their textures and load via the proxy's "?_req=" branch.
 *
 * Why proxy instead of rewriting the URLs to kawai-global directly: those images
 * are served with NO Access-Control-Allow-Origin header, and WebGL refuses to
 * upload a cross-origin texture without CORS. They must be same-origin.
 *
 * @example
 * GET /api/models/k_series/texture/backposts_2K.jpg
 *   → https://www.kawai-global.com/modelviewer/models/k_series/texture/backposts_2K.jpg
 */

const VIEWER_ORIGIN = 'https://www.kawai-global.com'
const MODELS_BASE = `${VIEWER_ORIGIN}/modelviewer/models`

/** Texture/geometry formats the viewer actually references. */
const ALLOWED_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'ktx2',
  'bin',
  'gltf',
  'glb',
  'hdr',
])

/**
 * Reject anything that isn't a plain relative asset path.
 * Guards against traversal (`..`), absolute paths, encoded separators, and
 * protocol-relative segments being smuggled into the upstream URL.
 */
function isSafeAssetPath(segments: string[]): boolean {
  if (segments.length === 0 || segments.length > 8) return false

  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..') return false
    // Conservative allowlist — model asset names are alphanumeric plus . _ -
    if (!/^[A-Za-z0-9._-]+$/.test(segment)) return false
  }

  const filename = segments[segments.length - 1] ?? ''
  const extension = filename.split('.').pop()?.toLowerCase() ?? ''
  return ALLOWED_EXTENSIONS.has(extension)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params

  if (!isSafeAssetPath(path)) {
    return NextResponse.json({ error: 'Invalid asset path' }, { status: 400 })
  }

  const targetUrl = `${MODELS_BASE}/${path.join('/')}`

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KAWAI-Proxy/1.0)' },
      signal: AbortSignal.timeout(30000),
    })

    if (!response.ok) {
      console.error('[3D Model Proxy] Upstream fetch failed:', response.status, targetUrl)
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
        // Same-origin is what makes these usable as WebGL textures, but the
        // header keeps them usable if the viewer is ever framed elsewhere.
        'Access-Control-Allow-Origin': '*',
        // Texture filenames are versioned upstream (e.g. _2K_C, _v03).
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[3D Model Proxy] Error:', targetUrl, error)
    return NextResponse.json(
      {
        error: 'Failed to fetch model asset',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 502 },
    )
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
