import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.json(
      { error: `OAuth error: ${error}` },
      { status: 400 }
    )
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    )
  }

  try {
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
      throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`)
    }

    const tokens = await tokenResponse.json()

    // Return the tokens in a user-friendly format
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Constant Contact OAuth Success</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .token-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .copy-btn { background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px; }
            code { background: #e9ecef; padding: 2px 5px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="success">
            <h2>✅ OAuth Authentication Successful!</h2>
            <p>Your Constant Contact integration is now ready. Copy the values below to your <code>.env.local</code> file:</p>
          </div>

          <h3>Environment Variables:</h3>
          <div class="token-box">
            <strong>CONSTANT_CONTACT_CLIENT_ID=</strong>3561b5f4-c8b5-473a-a5c4-939c195f0569
            <button class="copy-btn" onclick="copyToClipboard('3561b5f4-c8b5-473a-a5c4-939c195f0569')">Copy</button>
          </div>
          
          <div class="token-box">
            <strong>CONSTANT_CONTACT_CLIENT_SECRET=</strong>fMhjSGYhFgZtr1J2lZGcWg
            <button class="copy-btn" onclick="copyToClipboard('fMhjSGYhFgZtr1J2lZGcWg')">Copy</button>
          </div>

          <div class="token-box">
            <strong>CONSTANT_CONTACT_REFRESH_TOKEN=</strong>${tokens.refresh_token}
            <button class="copy-btn" onclick="copyToClipboard('${tokens.refresh_token}')">Copy</button>
          </div>

          <div class="token-box">
            <strong>CONSTANT_CONTACT_DEFAULT_LIST_ID=</strong>1
            <button class="copy-btn" onclick="copyToClipboard('1')">Copy</button>
          </div>

          <h3>Token Details:</h3>
          <div class="token-box">
            <strong>Access Token (expires in 24h):</strong><br>
            <small>${tokens.access_token}</small>
          </div>

          <div class="token-box">
            <strong>Token Type:</strong> ${tokens.token_type}<br>
            <strong>Expires In:</strong> ${tokens.expires_in} seconds (${Math.floor(tokens.expires_in / 3600)} hours)<br>
            <strong>Scope:</strong> ${tokens.scope}
          </div>

          <h3>Next Steps:</h3>
          <ol>
            <li>Copy all the environment variables above to your <code>.env.local</code> file</li>
            <li>Restart your development server: <code>bun run dev</code></li>
            <li>Test your contact form - it should now submit to Constant Contact</li>
            <li><strong>Important:</strong> Delete this callback route file for security</li>
          </ol>

          <script>
            function copyToClipboard(text) {
              navigator.clipboard.writeText(text).then(function() {
                alert('Copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: `Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}