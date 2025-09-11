import { NextRequest, NextResponse } from 'next/server'

async function getConstantContactAccessToken(): Promise<string> {
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const refreshToken = process.env.CONSTANT_CONTACT_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Constant Contact API credentials')
  }

  const response = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
  }

  const tokenData = await response.json()
  return tokenData.access_token
}

export async function GET(request: NextRequest) {
  // 🚫 DISABLED: This endpoint was used for setup and is now disabled for security
  // See docs/CONSTANT_CONTACT_INTEGRATION.md for documentation
  return NextResponse.json({
    error: 'Endpoint disabled',
    message: 'This setup endpoint has been disabled for security.',
    documentation: 'See docs/CONSTANT_CONTACT_INTEGRATION.md for integration details',
    active_endpoint: '/api/test-contact for testing contact form submissions'
  }, { status: 403 })

  try {
    console.log('📋 Fetching Constant Contact lists...')
    
    const accessToken = await getConstantContactAccessToken()
    
    // Fetch all lists from Constant Contact v3 API
    // Documentation: https://developer.constantcontact.com/api_reference/index.html
    const response = await fetch('https://api.cc.email/v3/contact_lists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Constant Contact API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const listsData = await response.json()
    
    console.log('📋 Available Constant Contact Lists:')
    listsData.lists?.forEach((list: any) => {
      console.log(`  • ${list.name} (ID: ${list.list_id}) - ${list.membership_count} members`)
    })

    return NextResponse.json({
      success: true,
      lists: listsData.lists,
      current_default: process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1'
    })

  } catch (error) {
    // This code is unreachable since endpoint is disabled above
    return NextResponse.json({ 
      error: 'Endpoint disabled',
      message: 'This setup endpoint has been disabled for security.'
    }, { status: 403 })
  }
}