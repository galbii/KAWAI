/**
 * Constant Contact API v3 Client
 *
 * Handles API requests with automatic token refresh, rate limiting, and error handling
 */

import { ConstantContactAuth, ConstantContactTokens, TokenStorage, createConstantContactAuth } from './auth';

export interface ConstantContactError {
  error_key: string;
  error_message: string;
  error_details?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ConstantContactError[];
  success: boolean;
  status: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Rate limiter for Constant Contact API (40 requests per 10 seconds)
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 40;
  private readonly windowMs = 10000; // 10 seconds

  async waitForAvailableSlot(): Promise<void> {
    const now = Date.now();

    // Remove requests older than the window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    // If we're at the limit, wait until the oldest request expires
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest) + 100; // Add 100ms buffer

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForAvailableSlot(); // Recursive call to check again
      }
    }

    // Record this request
    this.requests.push(now);
  }

  getStatus(): { available: number; resetTime: number } {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);

    return {
      available: this.maxRequests - this.requests.length,
      resetTime: this.requests.length > 0 ? Math.min(...this.requests) + this.windowMs : now
    };
  }
}

export class ConstantContactClient {
  private auth: ConstantContactAuth;
  private tokenStorage: TokenStorage;
  private rateLimiter: RateLimiter;
  private baseUrl = 'https://api.cc.email/v3';

  constructor(tokenStorage: TokenStorage) {
    this.auth = createConstantContactAuth();
    this.tokenStorage = tokenStorage;
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Make authenticated API request with automatic token refresh and rate limiting
   */
  async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Wait for rate limit
      await this.rateLimiter.waitForAvailableSlot();

      // Get valid access token
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return {
          success: false,
          status: 401,
          error: [{ error_key: 'unauthorized', error_message: 'No valid access token available' }]
        };
      }

      // Make request
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      // Handle rate limit response
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 10000;

        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.makeRequest<T>(endpoint, options); // Retry
      }

      // Parse response
      let responseData: any = null;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle success
      if (response.ok) {
        return {
          success: true,
          status: response.status,
          data: responseData
        };
      }

      // Handle API errors
      const errors = Array.isArray(responseData) ? responseData :
                    responseData?.error ? [responseData.error] :
                    [{ error_key: 'api_error', error_message: responseData || `HTTP ${response.status}` }];

      return {
        success: false,
        status: response.status,
        error: errors
      };

    } catch (error) {
      return {
        success: false,
        status: 500,
        error: [{
          error_key: 'network_error',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }]
      };
    }
  }

  /**
   * GET request helper
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request helper
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * PUT request helper
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Get valid tokens, refreshing if necessary
   */
  private async getValidTokens(): Promise<ConstantContactTokens | null> {
    try {
      const tokens = await this.tokenStorage.retrieve();
      if (!tokens) {
        return null;
      }

      // Check if token needs refresh
      if (this.auth.isTokenExpired(tokens)) {
        const newTokens = await this.auth.refreshAccessToken(tokens.refresh_token);
        await this.tokenStorage.store(newTokens);
        return newTokens;
      }

      return tokens;
    } catch (error) {
      console.error('Error getting valid tokens:', error);
      return null;
    }
  }

  /**
   * Check if client is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.tokenStorage.retrieve();
    return tokens !== null;
  }

  /**
   * Clear stored tokens (logout)
   */
  async clearAuthentication(): Promise<void> {
    await this.tokenStorage.clear();
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): { available: number; resetTime: number } {
    return this.rateLimiter.getStatus();
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(state?: string): string {
    return this.auth.getAuthorizationUrl(state);
  }

  /**
   * Complete OAuth flow with authorization code
   */
  async completeOAuthFlow(code: string): Promise<ApiResponse<ConstantContactTokens>> {
    try {
      const tokens = await this.auth.exchangeCodeForTokens(code);
      await this.tokenStorage.store(tokens);

      return {
        success: true,
        status: 200,
        data: tokens
      };
    } catch (error) {
      return {
        success: false,
        status: 400,
        error: [{
          error_key: 'oauth_error',
          error_message: error instanceof Error ? error.message : 'OAuth flow failed'
        }]
      };
    }
  }
}

/**
 * Create client instance with token storage
 */
export function createConstantContactClient(tokenStorage: TokenStorage): ConstantContactClient {
  return new ConstantContactClient(tokenStorage);
}