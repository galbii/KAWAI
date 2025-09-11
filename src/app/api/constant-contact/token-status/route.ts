import { NextRequest, NextResponse } from 'next/server'

/**
 * Check Constant Contact token status and provide re-authorization if needed
 * This endpoint helps diagnose token issues and provides easy re-authorization
 */
export async function GET(request: NextRequest) {
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const refreshToken = process.env.CONSTANT_CONTACT_REFRESH_TOKEN
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Check environment configuration
  const hasCredentials = !!(clientId && clientSecret && refreshToken)
  
  if (!hasCredentials) {
    return NextResponse.json({
      status: 'misconfigured',
      message: 'Missing Constant Contact credentials',
      missing: {
        client_id: !clientId,
        client_secret: !clientSecret,
        refresh_token: !refreshToken
      },
      action: 'Set up Constant Contact API credentials in environment variables'
    }, { status: 400 })
  }

  // Test token validity
  try {
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

    if (tokenResponse.ok) {
      // Token is valid
      return NextResponse.json({
        status: 'healthy',
        message: '✅ Constant Contact integration is working perfectly',
        last_tested: new Date().toISOString(),
        token_valid: true
      })
    } else {
      // Token refresh failed - provide re-authorization
      const errorData = await tokenResponse.json().catch(() => ({}))
      
      if (tokenResponse.status === 400) {
        // Refresh token expired - provide re-auth URL
        const authUrl = new URL('https://authz.constantcontact.com/oauth2/default/v1/authorize')
        authUrl.searchParams.set('client_id', clientId!)
        authUrl.searchParams.set('redirect_uri', `${siteUrl}/api/constant-contact/token-status/callback`)
        authUrl.searchParams.set('response_type', 'code')
        authUrl.searchParams.set('scope', 'contact_data')
        authUrl.searchParams.set('state', 'refresh-expired')

        return NextResponse.json({
          status: 'expired',
          message: '🔑 Refresh token expired - re-authorization required',
          error_details: errorData,
          action: 'Click the authorization URL to re-authorize',
          authorization_url: authUrl.toString(),
          instructions: [
            '1. Click the authorization URL below',
            '2. Log into your Constant Contact account',
            '3. Grant permissions to your application',
            '4. Copy the new refresh token to your .env.local file',
            '5. Restart your application'
          ]
        }, { status: 401 })
      } else {
        // Other error
        return NextResponse.json({
          status: 'error',
          message: `❌ Token refresh failed: ${tokenResponse.status}`,
          error_details: errorData,
          action: 'Check your Constant Contact API credentials'
        }, { status: tokenResponse.status })
      }
    }
  } catch (error) {
    return NextResponse.json({
      status: 'network_error',
      message: '🌐 Network error connecting to Constant Contact',
      error: error instanceof Error ? error.message : 'Unknown error',
      action: 'Check your internet connection and try again'
    }, { status: 503 })
  }
}