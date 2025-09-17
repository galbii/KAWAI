/**
 * Constant Contact OAuth 2.0 Authentication Module
 * Enhanced with Payload CMS database integration
 *
 * Handles OAuth flow, token management, and automatic refresh with secure database storage
 */

import type { Payload } from 'payload'
import { getConstantContactCredentials, updateConstantContactTokens, type TokenResponse } from './credentials'

export interface ConstantContactTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number; // Unix timestamp when token expires
}

export interface TokenStorage {
  getTokens(): Promise<ConstantContactTokens | null>;
  setTokens(tokens: ConstantContactTokens): Promise<void>;
  removeTokens(): Promise<void>;
}

/**
 * In-memory token storage (for development/testing only)
 * In production, use database storage or secure session storage
 */
export class MemoryTokenStorage implements TokenStorage {
  private tokens: ConstantContactTokens | null = null;

  async getTokens(): Promise<ConstantContactTokens | null> {
    return this.tokens;
  }

  async setTokens(tokens: ConstantContactTokens): Promise<void> {
    this.tokens = tokens;
  }

  async removeTokens(): Promise<void> {
    this.tokens = null;
  }
}

export interface ConstantContactAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string;
}

export interface ConstantContactConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  baseUrl: string
}

export class ConstantContactAuth {
  private config: ConstantContactAuthConfig | null = null;
  private payload: Payload | null = null;
  private baseAuthUrl = 'https://authz.constantcontact.com/oauth2/default/v1';

  constructor(config?: ConstantContactAuthConfig, payload?: Payload) {
    if (config) {
      this.config = {
        ...config,
        scope: config.scope || 'campaign_data contact_data offline_access'
      };
    }
    this.payload = payload || null;
  }

  /**
   * Initialize auth configuration from database or environment variables
   */
  private async getConfig(): Promise<ConstantContactAuthConfig> {
    if (this.config) {
      return this.config
    }

    // Try to get config from database first
    if (this.payload) {
      const credentials = await getConstantContactCredentials(this.payload)
      if (credentials) {
        this.config = {
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          redirectUri: credentials.redirectUri,
          scope: 'campaign_data contact_data offline_access',
        }
        return this.config
      }
    }

    // Fall back to environment variables
    if (
      !process.env.CONSTANT_CONTACT_CLIENT_ID ||
      !process.env.CONSTANT_CONTACT_CLIENT_SECRET ||
      !process.env.CONSTANT_CONTACT_REDIRECT_URI
    ) {
      throw new Error('Constant Contact configuration not found in database or environment variables')
    }

    this.config = {
      clientId: process.env.CONSTANT_CONTACT_CLIENT_ID,
      clientSecret: process.env.CONSTANT_CONTACT_CLIENT_SECRET,
      redirectUri: process.env.CONSTANT_CONTACT_REDIRECT_URI,
      scope: 'campaign_data contact_data offline_access',
    }

    return this.config
  }

  /**
   * Generate authorization URL for OAuth flow with security best practices
   */
  async getAuthorizationUrl(state?: string): Promise<string> {
    const config = await this.getConfig()

    // Generate a secure random state parameter if not provided
    const stateParam = state || this.generateSecureState()

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope!,
      state: stateParam,
    })

    return `${this.baseAuthUrl}/authorize?${params.toString()}`
  }

  /**
   * Exchange authorization code for access tokens
   */
  async exchangeCodeForTokens(code: string): Promise<ConstantContactTokens> {
    const config = await this.getConfig()

    const response = await fetch(`${this.baseAuthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      })
    });

    if (!response.ok) {
      let errorMessage = `Token exchange failed: ${response.status} ${response.statusText}`

      try {
        const errorData = await response.json()
        if (errorData.error_description) {
          errorMessage += ` - ${errorData.error_description}`
        }
      } catch {
        // If we can't parse the error response, use the basic error message
      }

      throw new Error(errorMessage)
    }

    const tokens = await response.json();

    // Validate the response has required fields
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid token response: missing access_token or refresh_token')
    }

    // Add expiration timestamp
    const expiresAt = Date.now() + (tokens.expires_in * 1000);

    return {
      ...tokens,
      expires_at: expiresAt
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<ConstantContactTokens> {
    const config = await this.getConfig()

    const response = await fetch(`${this.baseAuthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      let errorMessage = `Token refresh failed: ${response.status} ${response.statusText}`

      try {
        const errorData = await response.json()
        if (errorData.error_description) {
          errorMessage += ` - ${errorData.error_description}`
        }
        if (errorData.error === 'invalid_grant') {
          errorMessage += ' (Refresh token may be expired or invalid - re-authorization required)'
        }
      } catch {
        // If we can't parse the error response, use the basic error message
      }

      throw new Error(errorMessage)
    }

    const tokens = await response.json();

    // Validate the response has required fields
    if (!tokens.access_token) {
      throw new Error('Invalid token refresh response: missing access_token')
    }

    // Add expiration timestamp
    const expiresAt = Date.now() + (tokens.expires_in * 1000);

    return {
      ...tokens,
      refresh_token: tokens.refresh_token || refreshToken, // Some providers don't return new refresh token
      expires_at: expiresAt
    };
  }

  /**
   * Check if token is expired or will expire soon (within 5 minutes)
   */
  isTokenExpired(tokens: ConstantContactTokens): boolean {
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return tokens.expires_at < fiveMinutesFromNow;
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidAccessToken(tokens: ConstantContactTokens): Promise<ConstantContactTokens> {
    if (this.isTokenExpired(tokens)) {
      return await this.refreshAccessToken(tokens.refresh_token);
    }
    return tokens;
  }

  /**
   * Generate a secure random state parameter for OAuth2 security
   */
  private generateSecureState(): string {
    // Generate a cryptographically secure random string
    const array = new Uint8Array(32)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array)
    } else {
      // Fallback for Node.js environment
      const nodeCrypto = require('crypto')
      const randomBytes = nodeCrypto.randomBytes(32)
      for (let i = 0; i < 32; i++) {
        array[i] = randomBytes[i]
      }
    }

    // Convert to base64url (URL-safe base64)
    return Buffer.from(array)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }

  /**
   * Validate state parameter to prevent CSRF attacks (with constant-time comparison)
   */
  validateState(receivedState: string, expectedState: string): boolean {
    // Use constant-time comparison to prevent timing attacks
    if (receivedState.length !== expectedState.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < receivedState.length; i++) {
      result |= receivedState.charCodeAt(i) ^ expectedState.charCodeAt(i)
    }

    return result === 0
  }

  /**
   * Complete OAuth2 flow and store tokens in database
   * This method combines token exchange and database storage
   */
  async completeOAuth2Flow(
    code: string,
    payload: Payload
  ): Promise<{ success: boolean; message: string; tokens?: TokenResponse }> {
    try {
      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code)

      // Convert to TokenResponse format for database storage
      const tokenResponse: TokenResponse = {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
        scope: tokens.scope,
      }

      // Store tokens in database
      const updatedCredentials = await updateConstantContactTokens(payload, tokenResponse)

      if (!updatedCredentials) {
        throw new Error('Failed to store tokens in database')
      }

      return {
        success: true,
        message: 'OAuth2 flow completed successfully',
        tokens: tokenResponse,
      }
    } catch (error) {
      console.error('OAuth2 flow error:', error)

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred during OAuth2 flow',
      }
    }
  }

  /**
   * Get authorization URL with database integration
   * This is the main method to use for initiating OAuth2 flow
   */
  async getAuthorizationUrlWithDatabase(
    payload: Payload,
    state?: string
  ): Promise<{ url: string; state: string }> {
    // Set the payload instance for configuration
    this.payload = payload

    const stateParam = state || this.generateSecureState()
    const url = await this.getAuthorizationUrl(stateParam)

    return {
      url,
      state: stateParam,
    }
  }

  /**
   * Revoke access token (logout)
   */
  async revokeToken(accessToken: string): Promise<boolean> {
    const config = await this.getConfig()

    try {
      const response = await fetch('https://authz.constantcontact.com/oauth2/default/v1/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          token: accessToken,
          token_type_hint: 'access_token',
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Token revocation error:', error)
      return false
    }
  }
}

/**
 * Create auth instance with environment variables (legacy compatibility)
 */
export function createConstantContactAuth(): ConstantContactAuth {
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID;
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET;
  const redirectUri = process.env.CONSTANT_CONTACT_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing required Constant Contact environment variables');
  }

  return new ConstantContactAuth({
    clientId,
    clientSecret,
    redirectUri,
    scope: 'campaign_data contact_data offline_access'
  });
}

/**
 * Create auth instance with Payload CMS integration (recommended)
 */
export function createConstantContactAuthWithDatabase(payload: Payload): ConstantContactAuth {
  return new ConstantContactAuth(undefined, payload);
}