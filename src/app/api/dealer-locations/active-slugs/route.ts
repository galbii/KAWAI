import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Query all active dealer locations and return only their slugs
    const result = await payload.find({
      collection: 'dealer-locations',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 100, // Adjust based on expected number of locations
      select: {
        slug: true
      },
      sort: 'locationName' // Sort alphabetically by location name
    })
    
    // Extract slugs from the results
    const slugs = result.docs.map(doc => doc.slug).filter(slug => slug) // Filter out any null/undefined slugs
    
    return NextResponse.json({
      success: true,
      slugs: slugs,
      count: slugs.length
    })
    
  } catch (error) {
    console.error('Error fetching active dealer location slugs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch active dealer location slugs',
        details: error instanceof Error ? error.message : 'Unknown error',
        slugs: [],
        count: 0
      }, 
      { status: 500 }
    )
  }
}

// Enable Edge Runtime for better performance (optional)
export const runtime = 'nodejs'

// Cache the response for 5 minutes since dealer locations don't change frequently
export const revalidate = 300