import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 300 // 5 minutes

/**
 * GET /api/storefronts/active
 *
 * Fetches all active storefronts for navigation display
 * Returns formatted data optimized for the StorefrontsMegaMenu component
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    const storefronts = await payload.find({
      collection: 'storefronts',
      where: {
        isActive: { equals: true }
      },
      sort: 'locationName',
      limit: 20,
      depth: 0 // Don't populate relationships for performance
    })

    // Format data for navigation component
    const formattedData = storefronts.docs.map((storefront) => ({
      id: storefront.id,
      slug: storefront.slug,
      locationName: storefront.locationName,
      locationText: storefront.locationText || '',
      establishedText: storefront.establishedText || '',
      showroomInfo: {
        address: storefront.showroomInfo?.address || '',
        phone: storefront.showroomInfo?.phone || ''
      },
      features: (storefront.features || []).slice(0, 2).map((feature) => ({
        title: feature.title || ''
      }))
    }))

    return NextResponse.json({
      success: true,
      data: formattedData,
      count: formattedData.length
    })
  } catch (error) {
    console.error('[API] Failed to fetch active storefronts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch storefronts',
        data: [],
        count: 0
      },
      { status: 500 }
    )
  }
}
