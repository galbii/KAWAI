import type { Payload } from 'payload'

/**
 * Interface for Constant Contact credentials stored in the database
 */
export interface ConstantContactCredentials {
  id: string
  clientId: string
  clientSecret: string
  redirectUri: string
  baseUrl: string
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  scope?: string
  expiresAt?: string
  status: 'pending_authorization' | 'active' | 'expired' | 'refresh_failed' | 'error'
  lastSuccessfulRequest?: string
  lastTokenRefresh?: string
  errorMessage?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Interface for token response from Constant Contact OAuth2
 */
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

/**
 * Get Constant Contact credentials from database
 * Falls back to environment variables if no database record exists
 */
export async function getConstantContactCredentials(payload: Payload): Promise<ConstantContactCredentials | null> {
  try {
    // Try to get credentials from database first
    const result = await payload.find({
      collection: 'constant-contact-settings',
      limit: 1,
    })

    if (result.docs.length > 0) {
      return result.docs[0] as ConstantContactCredentials
    }

    // If no database record exists, check environment variables
    if (
      process.env.CONSTANT_CONTACT_CLIENT_ID &&
      process.env.CONSTANT_CONTACT_CLIENT_SECRET &&
      process.env.CONSTANT_CONTACT_REDIRECT_URI
    ) {
      // Create initial record from environment variables
      const status = process.env.CONSTANT_CONTACT_ACCESS_TOKEN ? 'active' as const : 'pending_authorization' as const;
      const initialCredentials = {
        clientId: process.env.CONSTANT_CONTACT_CLIENT_ID,
        clientSecret: process.env.CONSTANT_CONTACT_CLIENT_SECRET,
        redirectUri: process.env.CONSTANT_CONTACT_REDIRECT_URI,
        baseUrl: process.env.CONSTANT_CONTACT_BASE_URL || 'https://api.cc.email/v3',
        accessToken: process.env.CONSTANT_CONTACT_ACCESS_TOKEN,
        refreshToken: process.env.CONSTANT_CONTACT_REFRESH_TOKEN,
        tokenType: 'Bearer',
        scope: 'campaign_data contact_data offline_access',
        status,
      }

      // Create the initial record in the database
      const created = await payload.create({
        collection: 'constant-contact-settings',
        data: initialCredentials,
      })

      return created as ConstantContactCredentials
    }

    return null
  } catch (error) {
    console.error('Error getting Constant Contact credentials:', error)
    return null
  }
}

/**
 * Update Constant Contact tokens in the database
 */
export async function updateConstantContactTokens(
  payload: Payload,
  tokenResponse: TokenResponse
): Promise<ConstantContactCredentials | null> {
  try {
    // Get existing credentials
    const existingCredentials = await getConstantContactCredentials(payload)

    if (!existingCredentials) {
      throw new Error('No existing Constant Contact credentials found. Please initialize credentials first.')
    }

    // Calculate expiration time
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenResponse.expires_in)

    // Update the record
    const updated = await payload.update({
      collection: 'constant-contact-settings',
      id: existingCredentials.id,
      data: {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenType: tokenResponse.token_type,
        scope: tokenResponse.scope,
        expiresAt: expiresAt.toISOString(),
        status: 'active',
        lastTokenRefresh: new Date().toISOString(),
        errorMessage: '', // Clear any previous error
      },
    })

    return updated as ConstantContactCredentials
  } catch (error) {
    console.error('Error updating Constant Contact tokens:', error)

    // Try to update status to error if we have existing credentials
    try {
      const existingCredentials = await getConstantContactCredentials(payload)
      if (existingCredentials) {
        await payload.update({
          collection: 'constant-contact-settings',
          id: existingCredentials.id,
          data: {
            status: 'error',
            errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          },
        })
      }
    } catch (updateError) {
      console.error('Error updating error status:', updateError)
    }

    return null
  }
}

/**
 * Check if the current access token is expired or about to expire
 */
export function isTokenExpired(credentials: ConstantContactCredentials): boolean {
  if (!credentials.accessToken || !credentials.expiresAt) {
    return true
  }

  const expiresAt = new Date(credentials.expiresAt)
  const now = new Date()

  // Consider token expired if it expires within the next 5 minutes (buffer time)
  const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
  return (expiresAt.getTime() - now.getTime()) <= bufferTime
}

/**
 * Update the last successful request timestamp
 */
export async function updateLastSuccessfulRequest(
  payload: Payload,
  credentialsId: string
): Promise<void> {
  try {
    await payload.update({
      collection: 'constant-contact-settings',
      id: credentialsId,
      data: {
        lastSuccessfulRequest: new Date().toISOString(),
        status: 'active', // Ensure status is active on successful request
      },
    })
  } catch (error) {
    console.error('Error updating last successful request:', error)
  }
}

/**
 * Update credentials status and error message
 */
export async function updateCredentialsStatus(
  payload: Payload,
  credentialsId: string,
  status: ConstantContactCredentials['status'],
  errorMessage?: string
): Promise<void> {
  try {
    await payload.update({
      collection: 'constant-contact-settings',
      id: credentialsId,
      data: {
        status,
        errorMessage: errorMessage || '',
      },
    })
  } catch (error) {
    console.error('Error updating credentials status:', error)
  }
}

/**
 * Initialize Constant Contact credentials from environment variables
 * This is useful for setting up the initial configuration
 */
export async function initializeConstantContactCredentials(payload: Payload): Promise<ConstantContactCredentials | null> {
  try {
    // Check if credentials already exist
    const existing = await payload.find({
      collection: 'constant-contact-settings',
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log('Constant Contact credentials already exist in database')
      return existing.docs[0] as ConstantContactCredentials
    }

    // Validate required environment variables
    if (
      !process.env.CONSTANT_CONTACT_CLIENT_ID ||
      !process.env.CONSTANT_CONTACT_CLIENT_SECRET ||
      !process.env.CONSTANT_CONTACT_REDIRECT_URI
    ) {
      throw new Error('Missing required Constant Contact environment variables (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)')
    }

    // Create initial credentials record
    const initialData = {
      clientId: process.env.CONSTANT_CONTACT_CLIENT_ID,
      clientSecret: process.env.CONSTANT_CONTACT_CLIENT_SECRET,
      redirectUri: process.env.CONSTANT_CONTACT_REDIRECT_URI,
      baseUrl: process.env.CONSTANT_CONTACT_BASE_URL || 'https://api.cc.email/v3',
      tokenType: 'Bearer',
      scope: 'campaign_data contact_data offline_access',
      status: 'pending_authorization' as const,
      notes: 'Initialized from environment variables. Complete OAuth2 flow to obtain access tokens.',
    }

    // Add tokens if they exist in environment variables
    if (process.env.CONSTANT_CONTACT_ACCESS_TOKEN) {
      Object.assign(initialData, {
        accessToken: process.env.CONSTANT_CONTACT_ACCESS_TOKEN,
        status: 'active' as const,
      })
    }

    if (process.env.CONSTANT_CONTACT_REFRESH_TOKEN) {
      Object.assign(initialData, {
        refreshToken: process.env.CONSTANT_CONTACT_REFRESH_TOKEN,
      })
    }

    const created = await payload.create({
      collection: 'constant-contact-settings',
      data: initialData,
    })

    console.log('Constant Contact credentials initialized successfully')
    return created as ConstantContactCredentials
  } catch (error) {
    console.error('Error initializing Constant Contact credentials:', error)
    return null
  }
}

/**
 * Get valid access token, refreshing if necessary
 * This is the main function to use when making API calls
 */
export async function getValidAccessToken(payload: Payload): Promise<string | null> {
  try {
    const credentials = await getConstantContactCredentials(payload)

    if (!credentials) {
      console.error('No Constant Contact credentials found')
      return null
    }

    // If token is not expired, return it
    if (!isTokenExpired(credentials) && credentials.accessToken) {
      return credentials.accessToken
    }

    // If token is expired but we have a refresh token, try to refresh
    if (credentials.refreshToken) {
      console.log('Access token expired, attempting to refresh...')

      // Import auth utilities (will be created next)
      const { ConstantContactAuth } = await import('./auth')
      const auth = new ConstantContactAuth()

      try {
        const tokenResponse = await auth.refreshAccessToken(credentials.refreshToken)
        const updatedCredentials = await updateConstantContactTokens(payload, tokenResponse)

        if (updatedCredentials?.accessToken) {
          console.log('Access token refreshed successfully')
          return updatedCredentials.accessToken
        }
      } catch (refreshError) {
        console.error('Failed to refresh access token:', refreshError)
        await updateCredentialsStatus(payload, credentials.id, 'refresh_failed',
          refreshError instanceof Error ? refreshError.message : 'Failed to refresh token'
        )
      }
    }

    // If we get here, we need to re-authorize
    await updateCredentialsStatus(payload, credentials.id, 'expired',
      'Access token expired and refresh failed. Re-authorization required.'
    )

    return null
  } catch (error) {
    console.error('Error getting valid access token:', error)
    return null
  }
}