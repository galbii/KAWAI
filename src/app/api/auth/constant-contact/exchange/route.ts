import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from('3561b5f4-c8b5-473a-a5c4-939c195f0569:fMhjSGYhFgZtr1J2lZGcWg').toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/api/auth/constant-contact/callback'
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      return NextResponse.json(
        { error: `Token exchange failed: ${tokenResponse.status} - ${errorText}` },
        { status: tokenResponse.status }
      )
    }

    const tokens = await tokenResponse.json()

    return NextResponse.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expires_in: tokens.expires_in,
      scope: tokens.scope
    })

  } catch (error) {
    console.error('OAuth exchange error:', error)
    return NextResponse.json(
      { error: `Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}