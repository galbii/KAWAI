import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 🚫 DISABLED: This endpoint was used for OAuth setup and is now disabled for security  
  // See docs/CONSTANT_CONTACT_INTEGRATION.md for documentation
  return NextResponse.json({
    error: 'Endpoint disabled',
    message: 'This OAuth setup endpoint has been disabled for security.',
    documentation: 'See docs/CONSTANT_CONTACT_INTEGRATION.md for complete integration guide',
    current_status: 'Integration is FULLY OPERATIONAL with SHOWROOM KAWAI list',
    note: 'OAuth setup only needed when refresh token expires (~6 months)'
  }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/constant-contact/reauth`

  if (!code) {
    // Step 1: Generate authorization URL
    const authUrl = new URL('https://authz.constantcontact.com/oauth2/default/v1/authorize')
    authUrl.searchParams.set('client_id', clientId!)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'contact_data')
    authUrl.searchParams.set('state', 'lists-check')

    return NextResponse.json({
      message: 'Authorization required',
      authorization_url: authUrl.toString(),
      instructions: [
        '1. Click the authorization URL below',
        '2. Log into your Constant Contact account',
        '3. Grant permissions',
        '4. You will be redirected back and see your lists'
      ]
    })
  }

  // Step 2: Exchange code for token
  try {
    console.log('🔑 Exchanging authorization code for token...')
    
    const tokenResponse = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code || '',
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`Token exchange failed: ${tokenResponse.status} - ${error}`)
    }

    const tokens = await tokenResponse.json()
    console.log('✅ Got fresh tokens!')

    // Step 3: Fetch lists immediately
    const listsResponse = await fetch('https://api.cc.email/v3/contact_lists', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json'
      }
    })

    if (!listsResponse.ok) {
      throw new Error(`Lists fetch failed: ${listsResponse.status}`)
    }

    const listsData = await listsResponse.json()

    console.log('\n📋 YOUR CONSTANT CONTACT LISTS:')
    console.log('=====================================')
    
    const simplifiedLists = listsData.lists?.map((list: any, index: number) => {
      const info = {
        id: list.list_id,
        name: list.name,
        members: list.membership_count,
        status: list.status
      }
      
      console.log(`${index + 1}. "${list.name}" (ID: ${list.list_id})`)
      console.log(`   • ${list.membership_count} members • Status: ${list.status}`)
      
      return info
    }) || []

    // Return HTML page showing the results
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Your Constant Contact Lists</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .list { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .list-id { font-weight: bold; color: #007cba; }
        .members { color: #666; }
        .token { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .important { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>🎉 Your Constant Contact Lists</h1>
    
    <div class="important">
        <h3>📝 Update Your Environment Variable</h3>
        <p>Copy this refresh token to your <code>.env.local</code> file:</p>
        <code>CONSTANT_CONTACT_REFRESH_TOKEN=${tokens.refresh_token}</code>
    </div>

    <h2>Available Lists (${simplifiedLists.length} total)</h2>
    
    ${simplifiedLists.map((list: any, index: number) => `
        <div class="list">
            <div class="list-id">List ${index + 1}: "${list.name}" (ID: ${list.id})</div>
            <div class="members">${list.members} members • ${list.status}</div>
        </div>
    `).join('')}

    <div class="token">
        <h3>🔧 To Use a Specific List</h3>
        <p>Update your <code>.env.local</code> file with the List ID you want:</p>
        <code>CONSTANT_CONTACT_DEFAULT_LIST_ID=your-chosen-list-id</code>
        <p><small>Current default: ${process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1'}</small></p>
    </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (error) {
    // This code is unreachable since endpoint is disabled above
    return NextResponse.json({ 
      error: 'Endpoint disabled',
      message: 'This OAuth setup endpoint has been disabled for security.'
    }, { status: 403 })
  }
}