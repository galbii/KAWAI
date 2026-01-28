import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Validate query
    if (!query || query.length < 2) {
      return NextResponse.json(
        {
          results: [],
          totalDocs: 0,
          message: 'Query must be at least 2 characters'
        },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Build comprehensive where clause using Payload query operators
    // - 'like' operator: matches documents where all words are present
    // - 'contains' operator: case-insensitive substring matching
    const whereClause: any = {
      or: [
        { title: { like: query } },        // Match all words in title
        { title: { contains: query } },    // Substring match in title
        { excerpt: { contains: query } },  // Substring match in excerpt
      ],
    }

    const results = await payload.find({
      collection: 'search',
      where: whereClause,
      limit,
      depth: 2, // Include relationship data (doc.value)
      sort: '-priority', // Higher priority first (products = 20, pages = 10)
    })

    // Transform to match SearchBar expected format
    const transformedResults = results.docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      doc: doc.doc, // Contains { relationTo: 'products' | 'pages', value: {...} }
      excerpt: doc.excerpt,
      category: doc.category,
      tags: doc.tags,
    }))

    return NextResponse.json({
      results: transformedResults, // Must be 'results' not 'docs'
      totalDocs: results.totalDocs,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      {
        results: [],
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
