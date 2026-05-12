import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'

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

    const payload = await getPayloadClient()

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

    // Piano category terms → collectionPianoCategories value.
    // When matched, every collection tagged with that category is returned
    // regardless of whether the collection title mentions the term.
    const pianoCategoryMap: Record<string, string> = {
      'grand': 'grand',
      'grand piano': 'grand',
      'grand pianos': 'grand',
      'upright': 'upright',
      'upright piano': 'upright',
      'upright pianos': 'upright',
      'digital': 'digital',
      'digital piano': 'digital',
      'digital pianos': 'digital',
      'hybrid': 'hybrid',
      'hybrid piano': 'hybrid',
      'hybrid pianos': 'hybrid',
      'novus': 'hybrid',
      'aures': 'hybrid',
      'anytime': 'hybrid',
      'shigeru': 'shigeru',
      'shigeru kawai': 'shigeru',
      'sk series': 'shigeru',
      'sk-series': 'shigeru',
    }

    // Check if query matches any synonym and expand search terms
    const expandedTerms: string[] = [query] // Always include original query
    const queryLower = query.toLowerCase().trim()

    // Add synonyms if matched
    if (synonymMap[queryLower]) {
      expandedTerms.push(...synonymMap[queryLower])
    }

    // Detect piano category terms — used below to match collectionPianoCategories
    const matchedPianoCategory = pianoCategoryMap[queryLower] ?? null

    // Model number normalization: generate dash ↔ no-dash variants so that
    // "es60" and "es-60" (or "ca401" / "ca-401") return the same results.
    // Iterate over a snapshot so newly added terms don't re-process themselves.
    for (const term of [...expandedTerms]) {
      const withDash = term.match(/^([a-zA-Z]+)-(\d+)$/)
      if (withDash) expandedTerms.push(`${withDash[1]}${withDash[2]}`)

      const withoutDash = term.match(/^([a-zA-Z]+)(\d+)$/)
      if (withoutDash) expandedTerms.push(`${withoutDash[1]}-${withoutDash[2]}`)
    }

    // Deduplicate — prevents duplicate where conditions for the same term
    const uniqueTerms = [...new Set(expandedTerms.map(t => t.toLowerCase()))]

    // Build comprehensive where clause using Payload query operators
    // - 'like' operator: matches documents where all words are present
    // - 'contains' operator: case-insensitive substring matching
    const whereClause: any = {
      or: [
        ...uniqueTerms.flatMap(term => [
          { title: { like: term } },                          // Match all words in title
          { title: { contains: term } },                      // Substring match in title
          { excerpt: { contains: term } },                    // Substring match in excerpt
          // Storefront-specific fields (not included in title/excerpt)
          { storefrontLocationName: { contains: term } },     // Match location name
          { storefrontCity: { contains: term } },             // Match city (e.g. "Chicago")
          { storefrontAddress: { contains: term } },          // Match address
          { storefrontSlug: { contains: term } },             // Match slug (e.g. "st-louis")
          { collectionHandle: { contains: term } },            // Match collection handle (e.g. "ms-2c")
          { collectionTitle: { contains: term } },             // Match collection title
          // Artist-specific fields
          { artistShortBio: { contains: term } },             // Match artist bio
          { artistGenre: { contains: term } },                // Match genre (e.g. "jazz")
          { artistInstrument: { contains: term } },           // Match instrument type
        ]),
        // Piano category term: return every collection tagged with the matched category.
        // "grand pianos" → all collections where collectionPianoCategories contains 'grand'.
        ...(matchedPianoCategory
          ? [{ collectionPianoCategories: { contains: matchedPianoCategory } }]
          : []),
      ],
    }

    const results = await payload.find({
      collection: 'search',
      where: whereClause,
      limit,
      depth: 2,
      sort: '-priority', // Higher priority first (products = 20, pages = 10)
    })

    // Transform to match SearchBar expected format
    const transformedResults = results.docs.map(doc => {
      // Transform tags from array format [{tag: string}] to string[]
      let transformedTags: string[] = []
      if (Array.isArray(doc.tags)) {
        transformedTags = doc.tags
          .map((t: any) => typeof t === 'string' ? t : t?.tag)
          .filter((t: any): t is string => typeof t === 'string')
      }

      return {
        id: doc.id,
        title: doc.title,
        doc: doc.doc,
        excerpt: doc.excerpt,
        category: doc.category,
        tags: transformedTags,
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
        // Include denormalized collection fields
        collectionHandle: (doc as any).collectionHandle,
        collectionTitle: (doc as any).collectionTitle,
        collectionPianoCategories: (doc as any).collectionPianoCategories,
        // Include denormalized artist fields
        artistSlug: (doc as any).artistSlug,
        artistImageUrl: (doc as any).artistImageUrl,
        artistInstrument: (doc as any).artistInstrument,
        artistGenre: (doc as any).artistGenre,
        artistShortBio: (doc as any).artistShortBio,
      }
    })

    return NextResponse.json({
      results: transformedResults,
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
