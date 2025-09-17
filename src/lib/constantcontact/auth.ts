/**
 * Constant Contact OAuth 2.0 Authentication Module
 *
 * Handles OAuth flow, token management, and automatic refresh
 */

export interface ConstantContactTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number; // Unix timestamp when token expires
}

export interface ConstantContactAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope?: string;
}

export class ConstantContactAuth {
  private config: ConstantContactAuthConfig;
  private baseAuthUrl = 'https://authz.constantcontact.com/oauth2/default/v1';

  constructor(config: ConstantContactAuthConfig) {
    this.config = {
      ...config,
      scope: config.scope || 'contact_data'
    };
  }

  /**
   * Generate authorization URL for OAuth flow
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope!,
      state: state || this.generateState()
    });

    return `${this.baseAuthUrl}/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access tokens
   */
  async exchangeCodeForTokens(code: string): Promise<ConstantContactTokens> {
    const response = await fetch(`${this.baseAuthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for tokens: ${response.status} ${error}`);
    }

    const tokens = await response.json();

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
    const response = await fetch(`${this.baseAuthUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh token: ${response.status} ${error}`);
    }

    const tokens = await response.json();

    // Add expiration timestamp
    const expiresAt = Date.now() + (tokens.expires_in * 1000);

    return {
      ...tokens,
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
   * Generate random state parameter for OAuth security
   */
  private generateState(): string {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
  }

  /**
   * Validate state parameter to prevent CSRF attacks
   */
  validateState(receivedState: string, expectedState: string): boolean {
    return receivedState === expectedState;
  }
}

/**
 * Create auth instance with environment variables
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
    redirectUri
  });
}

/**
 * Token storage interface (implement based on your storage solution)
 */
export interface TokenStorage {
  store(tokens: ConstantContactTokens): Promise<void>;
  retrieve(): Promise<ConstantContactTokens | null>;
  clear(): Promise<void>;
}

/**
 * Simple in-memory token storage (for development/demo)
 * In production, use database or encrypted session storage
 */
export class MemoryTokenStorage implements TokenStorage {
  private tokens: ConstantContactTokens | null = null;

  async store(tokens: ConstantContactTokens): Promise<void> {
    this.tokens = tokens;
  }

  async retrieve(): Promise<ConstantContactTokens | null> {
    return this.tokens;
  }

  async clear(): Promise<void> {
    this.tokens = null;
  }
}