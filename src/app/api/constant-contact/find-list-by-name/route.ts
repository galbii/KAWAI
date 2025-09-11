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
    current_list: 'SHOWROOM KAWAI (ID: 40d1d690-8d9d-11f0-9bdc-fa163ea70839)',
    active_endpoint: '/api/test-contact for testing contact form submissions'
  }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const listName = searchParams.get('name') || 'showroom kawai'

  try {
    console.log(`🔍 Searching for Constant Contact list: "${listName}"`)
    
    const accessToken = await getConstantContactAccessToken()
    
    // Search for list by name using v3 API query parameter
    // Documentation: https://v3.developer.constantcontact.com/api_reference/index.html
    const searchUrl = new URL('https://api.cc.email/v3/contact_lists')
    searchUrl.searchParams.set('name', listName)
    
    console.log(`📡 Making API call to: ${searchUrl.toString()}`)
    
    const response = await fetch(searchUrl.toString(), {
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

    const searchResult = await response.json()
    
    console.log(`📊 Search results for "${listName}":`)
    
    if (searchResult.lists && searchResult.lists.length > 0) {
      const foundList = searchResult.lists[0] // First match
      console.log(`✅ FOUND: "${foundList.name}"`)
      console.log(`📋 List ID: ${foundList.list_id}`)
      console.log(`👥 Members: ${foundList.membership_count}`)
      console.log(`📅 Created: ${new Date(foundList.created_at).toLocaleDateString()}`)
      console.log(`🟢 Status: ${foundList.status}`)
      
      return NextResponse.json({
        success: true,
        found: true,
        list: {
          id: foundList.list_id,
          name: foundList.name,
          members: foundList.membership_count,
          status: foundList.status,
          created: foundList.created_at,
          description: foundList.description || null
        },
        instructions: [
          `To use this list, update your .env.local:`,
          `CONSTANT_CONTACT_DEFAULT_LIST_ID=${foundList.list_id}`,
          `Then restart your dev server`
        ]
      })
    } else {
      console.log(`❌ No list found with name: "${listName}"`)
      
      // Also try to get all lists to show available options
      const allListsResponse = await fetch('https://api.cc.email/v3/contact_lists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })
      
      let availableLists = []
      if (allListsResponse.ok) {
        const allListsData = await allListsResponse.json()
        availableLists = allListsData.lists?.map((list: any) => ({
          id: list.list_id,
          name: list.name,
          members: list.membership_count
        })) || []
      }
      
      return NextResponse.json({
        success: true,
        found: false,
        searched_for: listName,
        message: `No list found with exact name "${listName}"`,
        suggestions: [
          'Try searching for a partial name',
          'Check the available lists below',
          'Create the list in your Constant Contact dashboard first'
        ],
        available_lists: availableLists
      })
    }

  } catch (error) {
    // This code is unreachable since endpoint is disabled above
    return NextResponse.json({ 
      error: 'Endpoint disabled',
      message: 'This setup endpoint has been disabled for security.'
    }, { status: 403 })
  }
}