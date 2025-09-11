import { NextRequest, NextResponse } from 'next/server'

/**
 * OAuth2 callback handler for Constant Contact re-authorization
 * Exchanges authorization code for new access + refresh tokens
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUri = `${siteUrl}/api/constant-contact/token-status/callback`

  // Handle authorization errors
  if (error) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Authorization Failed - KAWAI Piano</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .error { background: #fee; padding: 20px; border-radius: 8px; border: 1px solid #fcc; }
        .back-link { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>❌ Authorization Failed</h1>
    <div class="error">
        <p><strong>Error:</strong> ${error}</p>
        <p><strong>Description:</strong> ${searchParams.get('error_description') || 'User denied authorization'}</p>
    </div>
    <div class="back-link">
        <a href="/api/constant-contact/token-status">← Try Again</a>
    </div>
</body>
</html>`
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  // Missing authorization code
  if (!code) {
    return NextResponse.json({
      error: 'No authorization code provided',
      message: 'This endpoint requires an authorization code from Constant Contact'
    }, { status: 400 })
  }

  // Exchange code for tokens
  try {
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
    
    // Test the new tokens by fetching account info
    const testResponse = await fetch('https://api.cc.email/v3/account/summary', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Accept': 'application/json'
      }
    })

    const accountInfo = testResponse.ok ? await testResponse.json() : null

    // Return HTML page with new refresh token
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Authorization Successful - KAWAI Piano</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { background: #efe; padding: 20px; border-radius: 8px; border: 1px solid #cfc; margin: 20px 0; }
        .token-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; word-break: break-all; }
        .instructions { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .account-info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🎉 Authorization Successful!</h1>
    
    <div class="success">
        <h3>✅ New Constant Contact tokens generated successfully</h3>
        <p>Your Constant Contact integration has been re-authorized and is ready to use.</p>
    </div>

    ${accountInfo ? `
    <div class="account-info">
        <h3>📋 Connected Account</h3>
        <p><strong>Organization:</strong> ${accountInfo.organization_name || 'N/A'}</p>
        <p><strong>Email:</strong> ${accountInfo.email || 'N/A'}</p>
        <p><strong>Country:</strong> ${accountInfo.country_code || 'N/A'}</p>
    </div>
    ` : ''}

    <div class="instructions">
        <h3>🔧 Next Steps</h3>
        <ol>
            <li>Copy the refresh token below</li>
            <li>Update your <code>.env.local</code> file</li>
            <li>Restart your development server</li>
        </ol>
    </div>

    <h3>🔑 New Refresh Token</h3>
    <p>Copy this value to your <code>.env.local</code> file:</p>
    <div class="token-box">
        <strong>CONSTANT_CONTACT_REFRESH_TOKEN=</strong>${tokens.refresh_token}
    </div>

    <div class="instructions">
        <h3>📝 Update Environment File</h3>
        <p>Add or update this line in your <code>.env.local</code> file:</p>
        <div class="token-box">
CONSTANT_CONTACT_REFRESH_TOKEN=${tokens.refresh_token}
        </div>
        
        <p><strong>Then restart your server:</strong></p>
        <div class="token-box">
bun run dev
        </div>
    </div>

    <div class="success">
        <h3>🚀 Integration Status</h3>
        <p>✅ Your email capture popup will now successfully add subscribers to your SHOWROOM KAWAI list.</p>
        <p>✅ This refresh token is valid for approximately 6 months.</p>
        <p>✅ Access tokens will be automatically generated as needed.</p>
    </div>

    <p><a href="/api/constant-contact/token-status">← Check Token Status Again</a></p>
</body>
</html>`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })

  } catch (error) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Token Exchange Failed - KAWAI Piano</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .error { background: #fee; padding: 20px; border-radius: 8px; border: 1px solid #fcc; }
        .back-link { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>❌ Token Exchange Failed</h1>
    <div class="error">
        <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Failed to exchange authorization code for access tokens.</p>
    </div>
    <div class="back-link">
        <a href="/api/constant-contact/token-status">← Try Again</a>
    </div>
</body>
</html>`
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}