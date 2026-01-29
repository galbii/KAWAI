import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Temporary debug endpoint to check Pages collection
 * DELETE THIS FILE after debugging
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  try {
    const payload = await getPayload({ config })

    if (!slug) {
      // Return all pages with their status
      const allPages = await payload.find({
        collection: 'pages',
        limit: 100,
        depth: 0,
      })

      return NextResponse.json({
        totalDocs: allPages.totalDocs,
        pages: allPages.docs.map((page) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          _status: page._status,
          category: page.category,
          publishedAt: page.publishedAt,
          updatedAt: page.updatedAt,
          createdAt: page.createdAt,
        })),
      })
    }

    // Query for specific slug without filters
    const pageNoFilter = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 0,
    })

    // Query with published filter
    const pageWithFilter = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 0,
    })

    // Check for storefront conflicts
    const storefrontCheck = await payload.find({
      collection: 'storefronts',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      depth: 0,
    })

    return NextResponse.json({
      slug,
      queries: {
        noFilter: {
          found: pageNoFilter.totalDocs > 0,
          totalDocs: pageNoFilter.totalDocs,
          page: pageNoFilter.docs[0] || null,
        },
        withPublishedFilter: {
          found: pageWithFilter.totalDocs > 0,
          totalDocs: pageWithFilter.totalDocs,
          page: pageWithFilter.docs[0] || null,
        },
        storefrontConflict: {
          found: storefrontCheck.totalDocs > 0,
          totalDocs: storefrontCheck.totalDocs,
          storefront: storefrontCheck.docs[0] || null,
        },
      },
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
