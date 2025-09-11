import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Constant Contact Manual Setup</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .step { background: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .code-box { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; word-break: break-all; }
          .copy-btn { background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px; }
          input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
          button { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
          .result { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 10px 0; display: none; }
          .error { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 10px 0; display: none; }
        </style>
      </head>
      <body>
        <h1>Constant Contact Manual Setup</h1>
        
        <div class="step">
          <h3>Step 1: Authorization URL</h3>
          <p>Copy this URL and open it in a new browser tab:</p>
          <div class="code-box">
            https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=3561b5f4-c8b5-473a-a5c4-939c195f0569&response_type=code&redirect_uri=http://localhost:3000/api/auth/constant-contact/callback&scope=contact_data offline_access&state=ccv3setup
            <button class="copy-btn" onclick="copyToClipboard('https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=3561b5f4-c8b5-473a-a5c4-939c195f0569&response_type=code&redirect_uri=http://localhost:3000/api/auth/constant-contact/callback&scope=contact_data offline_access&state=ccv3setup')">Copy</button>
          </div>
          <p><strong>If the URL doesn't work:</strong></p>
          <ul>
            <li>Make sure you're logged into Constant Contact</li>
            <li>Check that your app exists in the Developer Portal</li>
            <li>Verify the redirect URI matches exactly</li>
          </ul>
        </div>

        <div class="step">
          <h3>Step 2: Get Authorization Code</h3>
          <p>After authorizing, you'll be redirected to a URL like:</p>
          <div class="code-box">
            http://localhost:3000/api/auth/constant-contact/callback?code=AUTHORIZATION_CODE_HERE
          </div>
          <p>Copy the <strong>code</strong> parameter from that URL and paste it below:</p>
          <input type="text" id="authCode" placeholder="Paste authorization code here..." />
          <button onclick="exchangeToken()">Get Refresh Token</button>
        </div>

        <div id="result" class="result">
          <h3>✅ Success! Your Environment Variables:</h3>
          <div id="envVars"></div>
        </div>

        <div id="error" class="error">
          <h3>❌ Error:</h3>
          <div id="errorMessage"></div>
        </div>

        <script>
          function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(function() {
              alert('Copied to clipboard!');
            });
          }

          async function exchangeToken() {
            const code = document.getElementById('authCode').value.trim();
            
            if (!code) {
              showError('Please enter the authorization code');
              return;
            }

            try {
              const response = await fetch('/api/auth/constant-contact/exchange', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code })
              });

              const data = await response.json();

              if (response.ok) {
                showSuccess(data);
              } else {
                showError(data.error || 'Unknown error occurred');
              }
            } catch (error) {
              showError('Network error: ' + error.message);
            }
          }

          function showSuccess(data) {
            const envVars = \`
CONSTANT_CONTACT_CLIENT_ID=3561b5f4-c8b5-473a-a5c4-939c195f0569
CONSTANT_CONTACT_CLIENT_SECRET=fMhjSGYhFgZtr1J2lZGcWg
CONSTANT_CONTACT_REFRESH_TOKEN=\${data.refresh_token}
CONSTANT_CONTACT_DEFAULT_LIST_ID=1
            \`.trim();

            document.getElementById('envVars').innerHTML = \`
              <div class="code-box">\${envVars}</div>
              <button class="copy-btn" onclick="copyToClipboard('\${envVars}')">Copy All</button>
              <p><strong>Next steps:</strong></p>
              <ol>
                <li>Copy the environment variables above to your .env.local file</li>
                <li>Restart your development server: <code>bun run dev</code></li>
                <li>Delete this manual setup route for security</li>
                <li>Test your contact form</li>
              </ol>
            \`;
            
            document.getElementById('result').style.display = 'block';
            document.getElementById('error').style.display = 'none';
          }

          function showError(message) {
            document.getElementById('errorMessage').textContent = message;
            document.getElementById('error').style.display = 'block';
            document.getElementById('result').style.display = 'none';
          }
        </script>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}