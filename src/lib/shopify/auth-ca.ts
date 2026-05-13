/**
 * Shopify OAuth Authentication — Canada Store
 *
 * Separate token cache for the Canada Shopify store.
 * Reads SHOPIFY_CA_* env vars to avoid collisions with the US store token.
 */

interface ShopifyTokenResponse {
  access_token: string
  scope: string
  expires_in: number
  associated_user_scope?: string
}

interface TokenCache {
  token: string
  expiresAt: number
}

let caTokenCache: TokenCache | null = null

export async function getAdminAccessTokenCA(): Promise<string> {
  const clientId = process.env.SHOPIFY_CA_APP_API_KEY
  const clientSecret = process.env.SHOPIFY_CA_APP_CLIENT_SECRET
  const storeDomain = process.env.SHOPIFY_CA_STORE_DOMAIN

  console.log(`[AuthCA:DEBUG] clientId=${clientId ? 'SET' : 'MISSING'} clientSecret=${clientSecret ? 'SET' : 'MISSING'} storeDomain=${storeDomain || 'MISSING'}`)
  if (!clientId || !clientSecret || !storeDomain) {
    throw new Error(
      'Missing Canada Shopify credentials: SHOPIFY_CA_APP_API_KEY, SHOPIFY_CA_APP_CLIENT_SECRET, and SHOPIFY_CA_STORE_DOMAIN are required'
    )
  }

  if (caTokenCache && caTokenCache.expiresAt > Date.now()) {
    console.log('[Shopify Auth CA] Using cached access token')
    return caTokenCache.token
  }

  console.log('[Shopify Auth CA] Requesting new access token via client credentials grant')

  try {
    const tokenEndpoint = `https://${storeDomain}/admin/oauth/access_token`

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response')
      throw new Error(
        `Failed to obtain CA access token: ${response.status} ${response.statusText}\n${errorText}`
      )
    }

    const tokenData: ShopifyTokenResponse = await response.json()

    const expiresIn = tokenData.expires_in || 86400
    const safetyBuffer = 300
    const expiresAt = Date.now() + (expiresIn - safetyBuffer) * 1000

    caTokenCache = { token: tokenData.access_token, expiresAt }

    console.log('[Shopify Auth CA] Successfully obtained new access token', {
      scope: tokenData.scope,
      expiresIn: `${expiresIn / 3600} hours`,
    })

    return tokenData.access_token
  } catch (error) {
    console.error('[Shopify Auth CA] Token acquisition failed:', error)
    throw new Error(
      `Failed to obtain Canada Shopify Admin API access token: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export function clearTokenCacheCA(): void {
  caTokenCache = null
  console.log('[Shopify Auth CA] Token cache cleared')
}

export function hasValidTokenCA(): boolean {
  return caTokenCache !== null && caTokenCache.expiresAt > Date.now()
}
