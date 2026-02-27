import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'

/**
 * Admin Media Proxy
 *
 * Problem: `handleEditImage` in MediaManagerModal fetches the image as a blob
 * so it can pass it to the ImageEditor. Images are served from Cloudflare R2
 * (cross-origin), so a direct browser fetch is blocked by CORS.
 *
 * Solution: Proxy the fetch server-side — no CORS restriction applies.
 * We validate the `id` param against the Payload `media` collection so this
 * cannot be used as a generic SSRF vector (only real media records are served).
 *
 * GET /api/admin/media-proxy?id=<mediaId>
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Look up the record — this both validates the ID and retrieves the real URL
  let media: { url?: string | null; filename?: string | null; mimeType?: string | null }
  try {
    const payload = await getPayloadClient()
    media = await payload.findByID({
      collection: 'media',
      id,
      depth: 0,
    })
  } catch {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }

  const imageUrl = media?.url
  if (!imageUrl) {
    return NextResponse.json({ error: 'Media has no URL' }, { status: 404 })
  }

  // Server-side fetch — bypasses browser CORS restriction
  let upstream: Response
  try {
    upstream = await fetch(imageUrl, { signal: AbortSignal.timeout(15_000) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from storage' }, { status: 502 })
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Storage returned ${upstream.status}` },
      { status: 502 },
    )
  }

  const contentType =
    upstream.headers.get('content-type') || media.mimeType || 'application/octet-stream'
  const buffer = await upstream.arrayBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${media.filename ?? 'image'}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  })
}

export const dynamic = 'force-dynamic'
