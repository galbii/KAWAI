import 'server-only'
import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

export type ResolvedRedirect = { from: string; to: string; type: '301' | '302' }

// Maps Payload collection slugs → URL path prefixes
const COLLECTION_PATHS: Record<string, string> = {
  pages: '',         // /about, /contact (catch-all)
  products: '/products', // /products/gx-7-blak
  storefronts: '/store', // /store/st-louis
  posts: '/blog',    // /blog/my-post
}

/**
 * Resolves all active redirects from Payload, populating internal references
 * to their real URL paths. Cached with tag-based invalidation.
 */
const getActiveRedirects = unstable_cache(
  async (): Promise<ResolvedRedirect[]> => {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'redirects',
      where: { isActive: { equals: true } },
      depth: 1, // Populate references so we can read their slugs
      limit: 1000,
    })

    const resolved: ResolvedRedirect[] = []

    for (const doc of result.docs) {
      const from = doc.from
      let to: string | null = null

      if (doc.to?.type === 'reference' && doc.to.reference) {
        // Polymorphic relationship — narrow by relationTo then read slug
        const ref = doc.to.reference as { relationTo?: string; value?: unknown } | null

        if (
          ref &&
          typeof ref === 'object' &&
          ref.relationTo &&
          typeof ref.value === 'object' &&
          ref.value !== null
        ) {
          const slug = (ref.value as Record<string, unknown>).slug
          if (typeof slug === 'string') {
            const prefix = COLLECTION_PATHS[ref.relationTo] ?? ''
            to = prefix ? `${prefix}/${slug}` : `/${slug}`
          }
        }
      } else {
        // Custom URL — use as-is
        to = doc.to?.url ?? null
      }

      if (from && to) {
        resolved.push({
          from,
          to,
          type: (doc.redirectType as '301' | '302') ?? '301',
        })
      }
    }

    return resolved
  },
  ['active-redirects'],
  { tags: ['redirects'], revalidate: 3600 },
)

export async function GET() {
  try {
    const redirects = await getActiveRedirects()
    return NextResponse.json(redirects, {
      headers: {
        // Tells downstream (including middleware) to consider this fresh for 30s
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    console.error('[Redirects API] Failed to load redirects:', err)
    return NextResponse.json([], { status: 500 })
  }
}
