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

    // Synonym expansion for better search results
    // Map user search terms to database-friendly terms
    const synonymMap: Record<string, string[]> = {
      'dealer': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'dealers': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'store': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'stores': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'showroom': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'showrooms': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'location': ['dealer', 'showroom', 'storefront', 'store', 'location'],
      'locations': ['dealer', 'showroom', 'storefront', 'store', 'location'],
    }

    // Check if query matches any synonym and expand search terms
    const expandedTerms: string[] = [query] // Always include original query
    const queryLower = query.toLowerCase().trim()

    // Add synonyms if matched
    if (synonymMap[queryLower]) {
      expandedTerms.push(...synonymMap[queryLower])
    }

    // Build comprehensive where clause using Payload query operators
    // - 'like' operator: matches documents where all words are present
    // - 'contains' operator: case-insensitive substring matching
    const whereClause: any = {
      or: expandedTerms.flatMap(term => [
        { title: { like: term } },        // Match all words in title
        { title: { contains: term } },    // Substring match in title
        { excerpt: { contains: term } },  // Substring match in excerpt
      ]),
    }

    const results = await payload.find({
      collection: 'search',
      where: whereClause,
      limit,
      depth: 2, // Include relationship data (doc.value)
      sort: '-priority', // Higher priority first (products = 20, pages = 10)
    })

    // Debug: Log raw search result
    console.log('\n=== SEARCH API DEBUG ===')
    console.log('Total results:', results.totalDocs)

    const firstResult = results.docs[0]
    if (firstResult) {
      console.log('First result structure:', {
        id: firstResult.id,
        title: firstResult.title,
        'doc.relationTo': firstResult.doc?.relationTo,
        'doc.value type': typeof firstResult.doc?.value,
        'doc.value is string': typeof firstResult.doc?.value === 'string',
        'doc.value (preview)': typeof firstResult.doc?.value === 'string'
          ? firstResult.doc.value
          : firstResult.doc?.value ? `[Object with keys: ${Object.keys(firstResult.doc.value).join(', ')}]` : 'undefined',
      })
    }

    // Transform to match SearchBar expected format
    const transformedResults = results.docs.map(doc => {
      // Check if doc.value is populated as an object or just an ID string
      const isPopulated = typeof doc.doc?.value === 'object' && doc.doc?.value !== null

      // Debug: Log product data structure
      if (doc.doc?.relationTo === 'products') {
        console.log(`\nProduct result [${doc.id}]:`, {
          title: doc.title,
          'productModel (denormalized)': (doc as any).productModel,
          'productType (denormalized)': (doc as any).productType,
          'productCategory (denormalized)': (doc as any).productCategory,
          'productImageUrl (denormalized)': (doc as any).productImageUrl,
          'productSlug (denormalized)': (doc as any).productSlug,
        })
      }

      return {
        id: doc.id,
        title: doc.title,
        doc: doc.doc,
        excerpt: doc.excerpt,
        category: doc.category,
        tags: doc.tags,
        // Include denormalized product fields
        productModel: (doc as any).productModel,
        productImageUrl: (doc as any).productImageUrl,
        productType: (doc as any).productType,
        productCategory: (doc as any).productCategory,
        productSlug: (doc as any).productSlug,
        // Include denormalized page fields
        pageSlug: (doc as any).pageSlug,
        // Include denormalized storefront fields
        storefrontSlug: (doc as any).storefrontSlug,
        storefrontLocationName: (doc as any).storefrontLocationName,
        storefrontLocationText: (doc as any).storefrontLocationText,
        storefrontEstablishedText: (doc as any).storefrontEstablishedText,
        storefrontAddress: (doc as any).storefrontAddress,
        storefrontPhone: (doc as any).storefrontPhone,
        storefrontCity: (doc as any).storefrontCity,
        storefrontRegion: (doc as any).storefrontRegion,
      }
    })

    console.log('=== END DEBUG ===\n')

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
