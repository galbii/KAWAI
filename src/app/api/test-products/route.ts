import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Fetch products directly
    const products = await payload.find({
      collection: 'products',
      limit: 5,
      depth: 0,
    })

    console.log('\n=== PRODUCTS COLLECTION TEST ===')
    console.log('Total products:', products.totalDocs)

    if (products.docs[0]) {
      console.log('First product:', {
        id: products.docs[0].id,
        model: products.docs[0].model,
        name: products.docs[0].name,
        imageUrl: products.docs[0].imageUrl,
        category: products.docs[0].category,
        slug: products.docs[0].slug,
      })
    }

    // Fetch search collection
    const searchDocs = await payload.find({
      collection: 'search',
      limit: 5,
      depth: 0, // No population
    })

    console.log('\nSearch collection (depth: 0):')
    if (searchDocs.docs[0]) {
      console.log('First search doc:', {
        id: searchDocs.docs[0].id,
        title: searchDocs.docs[0].title,
        'doc.relationTo': searchDocs.docs[0].doc?.relationTo,
        'doc.value': searchDocs.docs[0].doc?.value, // Should be just an ID
      })
    }

    // Fetch search collection with depth
    const searchDocsPopulated = await payload.find({
      collection: 'search',
      limit: 5,
      depth: 2, // With population
    })

    console.log('\nSearch collection (depth: 2):')
    if (searchDocsPopulated.docs[0]) {
      const firstDoc = searchDocsPopulated.docs[0]
      console.log('First search doc (populated):', {
        id: firstDoc.id,
        title: firstDoc.title,
        'doc.relationTo': firstDoc.doc?.relationTo,
        'doc.value type': typeof firstDoc.doc?.value,
        'doc.value preview': typeof firstDoc.doc?.value === 'string'
          ? `ID: ${firstDoc.doc.value}`
          : firstDoc.doc?.value
          ? `Object with keys: ${Object.keys(firstDoc.doc.value).join(', ')}`
          : 'undefined',
      })

      // If populated, try to access product fields
      if (typeof firstDoc.doc?.value === 'object' && firstDoc.doc.value !== null) {
        console.log('Product data from populated value:', {
          model: (firstDoc.doc.value as any).model,
          imageUrl: (firstDoc.doc.value as any).imageUrl,
          category: (firstDoc.doc.value as any).category,
        })
      }
    }
    console.log('=== END TEST ===\n')

    return NextResponse.json({
      productsCount: products.totalDocs,
      searchDocsCount: searchDocs.totalDocs,
      firstProduct: products.docs[0] ? {
        model: products.docs[0].model,
        imageUrl: products.docs[0].imageUrl,
        category: products.docs[0].category,
      } : null,
      firstSearchDoc: searchDocsPopulated.docs[0] ? {
        title: searchDocsPopulated.docs[0].title,
        valueType: typeof searchDocsPopulated.docs[0].doc?.value,
        isPopulated: typeof searchDocsPopulated.docs[0].doc?.value === 'object',
      } : null,
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json(
      { error: 'Test failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
