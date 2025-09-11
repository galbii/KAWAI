import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 🚫 DISABLED: This endpoint was used for setup and is now disabled for security
  // See docs/CONSTANT_CONTACT_INTEGRATION.md for documentation
  return NextResponse.json({
    error: 'Endpoint disabled',
    message: 'This setup endpoint has been disabled for security.',
    documentation: 'See docs/CONSTANT_CONTACT_INTEGRATION.md for complete integration guide',
    integration_status: 'FULLY OPERATIONAL - using SHOWROOM KAWAI list',
    active_endpoint: '/api/test-contact for testing contact form submissions'
  }, { status: 403 })

  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const refreshToken = process.env.CONSTANT_CONTACT_REFRESH_TOKEN

  console.log('🔑 Attempting to get fresh access token...')
  console.log('Client ID:', clientId)
  console.log('Refresh Token (first 10 chars):', refreshToken?.substring(0, 10) + '...')

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ 
      error: 'Missing credentials',
      has_client_id: !!clientId,
      has_client_secret: !!clientSecret,
      has_refresh_token: !!refreshToken
    }, { status: 400 })
  }

  try {
    // Step 1: Get fresh access token
    console.log('📡 Making token refresh request...')
    const tokenResponse = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken || ''
      })
    })

    console.log('Token response status:', tokenResponse.status)
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token refresh failed:', errorText)
      
      return NextResponse.json({ 
        error: 'Token refresh failed',
        status: tokenResponse.status,
        response: errorText,
        suggestion: 'You may need to re-authorize your Constant Contact account'
      }, { status: tokenResponse.status })
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log('✅ Got fresh access token')

    // Step 2: Fetch lists
    console.log('📋 Fetching contact lists...')
    const listsResponse = await fetch('https://api.cc.email/v3/contact_lists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })

    if (!listsResponse.ok) {
      const errorData = await listsResponse.json().catch(() => ({}))
      console.error('Lists fetch failed:', errorData)
      return NextResponse.json({ 
        error: 'Failed to fetch lists',
        status: listsResponse.status,
        response: errorData
      }, { status: listsResponse.status })
    }

    const listsData = await listsResponse.json()
    
    console.log('\n📋 AVAILABLE CONSTANT CONTACT LISTS:')
    console.log('=====================================')
    
    if (listsData.lists && listsData.lists.length > 0) {
      listsData.lists.forEach((list: any, index: number) => {
        console.log(`${index + 1}. "${list.name}"`)
        console.log(`   • ID: ${list.list_id}`)
        console.log(`   • Members: ${list.membership_count}`)
        console.log(`   • Created: ${new Date(list.created_at).toLocaleDateString()}`)
        console.log(`   • Status: ${list.status}`)
        console.log('')
      })
    } else {
      console.log('No lists found or empty response')
    }
    
    console.log(`Current default list ID in .env: ${process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1'}`)

    return NextResponse.json({
      success: true,
      total_lists: listsData.lists?.length || 0,
      lists: listsData.lists?.map((list: any) => ({
        id: list.list_id,
        name: list.name,
        members: list.membership_count,
        status: list.status,
        created: list.created_at
      })) || [],
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