import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Use the same approach as the HomePage collection's singleton endpoint
    const result = await payload.find({
      collection: 'home-page',
      limit: 1,
      depth: 2 // Populate media relationships and their nested relationships
    })
    
    if (result.docs.length > 0) {
      return NextResponse.json(result.docs[0])
    } else {
      return NextResponse.json(
        { error: 'Home page not found' }, 
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching home page singleton data:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}