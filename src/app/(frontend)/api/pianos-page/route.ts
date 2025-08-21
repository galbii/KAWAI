import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the Payload singleton endpoint URL from the environment
    const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const singletonUrl = `${baseUrl}/api/pianos-page/singleton`
    
    // Fetch from the Payload singleton endpoint
    const response = await fetch(singletonUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Force fresh data for testing
    })
    
    if (!response.ok) {
      throw new Error(`Payload API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error fetching pianos page data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch pianos page data' 
      },
      { status: 500 }
    )
  }
}