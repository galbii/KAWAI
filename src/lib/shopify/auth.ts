/**
 * Shopify OAuth Authentication
 *
 * Handles token acquisition and refresh using Client Credentials Grant
 * for server-to-server authentication without user interaction.
 *
 * @see https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant
 */

interface ShopifyTokenResponse {
  access_token: string
  scope: string
  expires_in: number // seconds
  associated_user_scope?: string
}

interface TokenCache {
  token: string
  expiresAt: number // timestamp
}

// In-memory token cache (consider using Redis in production)
let tokenCache: TokenCache | null = null

/**
 * Get a valid Admin API access token using Client Credentials Grant
 *
 * This function:
 * 1. Checks if we have a cached valid token
 * 2. If not, requests a new token using client credentials
 * 3. Caches the token for reuse (tokens are valid for 24 hours)
 *
 * @returns Valid Admin API access token
 * @throws Error if token acquisition fails
 */
export async function getAdminAccessToken(): Promise<string> {
  const clientId = process.env.SHOPIFY_APP_API_KEY
  const clientSecret = process.env.SHOPIFY_APP_CLIENT_SECRET
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN

  if (!clientId || !clientSecret || !storeDomain) {
    throw new Error('Missing Shopify credentials: SHOPIFY_APP_API_KEY, SHOPIFY_APP_CLIENT_SECRET, and SHOPIFY_STORE_DOMAIN are required')
  }

  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    console.log('[Shopify Auth] Using cached access token')
    return tokenCache.token
  }

  // Request new token using client credentials
  console.log('[Shopify Auth] Requesting new access token via client credentials grant')

  try {
    const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      throw new Error(
        `Failed to obtain access token: ${response.status} ${response.statusText}\n${errorText}`
      )
    }

    const tokenData: ShopifyTokenResponse = await response.json()

    // Cache the token (expires in 24 hours, we refresh 5 minutes early to be safe)
    const expiresIn = tokenData.expires_in || 86400 // Default to 24 hours
    const safetyBuffer = 300 // 5 minutes in seconds
    const expiresAt = Date.now() + (expiresIn - safetyBuffer) * 1000

    tokenCache = {
      token: tokenData.access_token,
      expiresAt,
    }

    console.log('[Shopify Auth] Successfully obtained new access token', {
      scope: tokenData.scope,
      expiresIn: `${expiresIn / 3600} hours`,
    })

    return tokenData.access_token
  } catch (error) {
    console.error('[Shopify Auth] Token acquisition failed:', error)

    throw new Error(
      `Failed to obtain Shopify Admin API access token: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Clear the token cache (useful for testing or forcing refresh)
 */
export function clearTokenCache(): void {
  tokenCache = null
  console.log('[Shopify Auth] Token cache cleared')
}

/**
 * Check if we have a valid cached token
 */
export function hasValidToken(): boolean {
  return tokenCache !== null && tokenCache.expiresAt > Date.now()
}
