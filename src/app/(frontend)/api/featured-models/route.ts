import { NextRequest, NextResponse } from 'next/server'
import { getCachedFeaturedModels, transformFeaturedModelToLegacy } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const models = await getCachedFeaturedModels()
    
    // Transform to legacy format for existing components
    const transformedModels = models.map(transformFeaturedModelToLegacy)
    
    return NextResponse.json({
      success: true,
      data: transformedModels,
      count: transformedModels.length
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching featured models:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured models',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, {
    status: 405
  })
}