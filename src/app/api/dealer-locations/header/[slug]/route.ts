import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface DealerLocationHeaderData {
  locationName: string
  slug: string
}

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    
    // Query the DealerLocations collection by slug - only get header-relevant fields
    const result = await payload.find({
      collection: 'dealer-locations',
      where: {
        and: [
          {
            slug: {
              equals: slug
            }
          },
          {
            isActive: {
              equals: true
            }
          }
        ]
      },
      limit: 1,
      select: {
        locationName: true,
        slug: true
      }
    })
    
    const dealerLocation = result.docs[0]

    if (dealerLocation) {
      
      const headerData: DealerLocationHeaderData = {
        locationName: dealerLocation.locationName,
        slug: dealerLocation.slug
      }
      
      return NextResponse.json({
        success: true,
        data: headerData
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Dealer location not found or inactive' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching dealer location header data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dealer location header data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Cache the response for 5 minutes since dealer locations don't change frequently
export const revalidate = 300