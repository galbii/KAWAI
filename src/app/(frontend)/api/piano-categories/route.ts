import { NextRequest, NextResponse } from 'next/server'
import { getCachedPianoCategories, transformPianoCategoryToLegacy } from '@/lib/payload'

export async function GET(request: NextRequest) {
  try {
    const categories = await getCachedPianoCategories()
    
    // Transform to legacy format for existing components
    const transformedCategories = categories.map(transformPianoCategoryToLegacy)
    
    return NextResponse.json({
      success: true,
      data: transformedCategories,
      count: transformedCategories.length
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching piano categories:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch piano categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
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