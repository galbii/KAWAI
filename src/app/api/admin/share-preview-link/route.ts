import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'

/**
 * Map a collection slug → public URL prefix used to render its documents.
 * Add new collections here. Keep in sync with the `path:` value used in each
 * collection's `admin.preview` / `admin.livePreview` URL builders.
 */
const PATH_PREFIX_BY_COLLECTION: Record<string, string> = {
  posts: '/blog/',
  pages: '/',
  artists: '/artists/',
}

/**
 * GET /api/admin/share-preview-link?collection=<slug>&slug=<doc-slug>
 *
 * Returns a shareable preview URL with PREVIEW_SECRET embedded. Anyone with
 * the returned URL can view the draft via /api/preview without logging in.
 *
 * Requires an authenticated CMS user — the secret must never be exposed to
 * the public client. To revoke all outstanding share links, rotate
 * PREVIEW_SECRET in the environment.
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadClient()

    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const collection = request.nextUrl.searchParams.get('collection')
    const slug = request.nextUrl.searchParams.get('slug')
    if (!collection || !slug) {
      return NextResponse.json({ error: 'Missing collection or slug' }, { status: 400 })
    }

    const prefix = PATH_PREFIX_BY_COLLECTION[collection]
    if (!prefix) {
      return NextResponse.json(
        { error: `Share links are not configured for collection "${collection}"` },
        { status: 400 },
      )
    }

    const secret = process.env.PREVIEW_SECRET
    if (!secret) {
      return NextResponse.json(
        { error: 'PREVIEW_SECRET is not configured on the server' },
        { status: 500 },
      )
    }

    const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const params = new URLSearchParams({
      slug,
      collection,
      path: `${prefix}${slug}`,
      previewSecret: secret,
    })

    return NextResponse.json({ url: `${siteURL}/api/preview?${params.toString()}` })
  } catch (error) {
    console.error('[share-preview-link] error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
