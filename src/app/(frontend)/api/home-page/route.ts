import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 300

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Fetch the HomePage singleton data
    const result = await payload.find({
      collection: 'home-page',
      limit: 1,
      depth: 2 // Populate media relationships and their nested relationships
    })
    
    if (result.docs.length > 0) {
      return NextResponse.json({
        success: true,
        data: result.docs[0]
      }, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Home page not found' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch home page data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}