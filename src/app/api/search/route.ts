import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const category = searchParams.get('category')

    // Validate query
    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          docs: [],
          totalDocs: 0,
          message: 'Query must be at least 2 characters'
        },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Build where clause with OR for title search
    const whereClause: any = {
      or: [
        { title: { like: query } },
        { title: { contains: query } },
      ],
    }

    // Optional category filter
    if (category && category !== 'all') {
      whereClause.and = [
        whereClause,
        { 'doc.value.category': { equals: category } }
      ]
    }

    const results = await payload.find({
      collection: 'search',
      where: whereClause,
      limit: 10,
      depth: 1,
      sort: '-priority',
    })

    return NextResponse.json({
      docs: results.docs,
      totalDocs: results.totalDocs,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
