/**
 * Auth Helper Utilities for Constant Contact Integration
 *
 * Provides convenient functions for authentication checks and redirects
 */

import type { Payload } from 'payload';
import { getConstantContactCredentials, isTokenExpired } from './credentials';
import { ReauthRequiredError } from './errors';

/**
 * Authentication status response
 */
export interface AuthStatus {
  authenticated: boolean;
  needsReauth: boolean;
  authUrl: string | null;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'refresh_failed' | 'pending_authorization' | 'error' | null;
}

/**
 * Check authentication status without attempting to refresh
 * Useful for proactive checks before making API calls
 */
export async function checkAuthStatus(payload: Payload): Promise<AuthStatus> {
  try {
    const credentials = await getConstantContactCredentials(payload);

    if (!credentials) {
      return {
        authenticated: false,
        needsReauth: true,
        authUrl: getAuthUrlWithReturn(),
        expiresAt: null,
        status: null,
      };
    }

    const expired = isTokenExpired(credentials);
    const needsReauth =
      expired ||
      credentials.status === 'expired' ||
      credentials.status === 'refresh_failed' ||
      credentials.status === 'pending_authorization' ||
      !credentials.accessToken ||
      !credentials.refreshToken;

    return {
      authenticated: !needsReauth && credentials.status === 'active',
      needsReauth,
      authUrl: needsReauth ? getAuthUrlWithReturn() : null,
      expiresAt: credentials.expiresAt || null,
      status: credentials.status,
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return {
      authenticated: false,
      needsReauth: true,
      authUrl: getAuthUrlWithReturn(),
      expiresAt: null,
      status: 'error',
    };
  }
}

/**
 * Get the authorization URL with an optional return URL
 * @param returnTo - The URL to return to after authorization (relative or absolute)
 * @param baseUrl - Base URL for the application (defaults to environment or localhost)
 */
export function getAuthUrlWithReturn(returnTo?: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const authPath = '/api/auth/constantcontact/authorize';

  if (!returnTo) {
    return `${base}${authPath}`;
  }

  // Ensure returnTo is properly encoded
  const encodedReturn = encodeURIComponent(returnTo);
  return `${base}${authPath}?return_to=${encodedReturn}`;
}

/**
 * Extract return URL from request query parameters
 * Validates that return URL is safe (same origin)
 */
export function getReturnUrl(
  searchParams: URLSearchParams,
  defaultReturn: string = '/admin'
): string {
  const returnTo = searchParams.get('return_to');

  if (!returnTo) {
    return defaultReturn;
  }

  // Decode the return URL
  const decodedReturn = decodeURIComponent(returnTo);

  // Security: Only allow relative URLs or same-origin absolute URLs
  try {
    // If it's a relative URL, it's safe
    if (decodedReturn.startsWith('/') && !decodedReturn.startsWith('//')) {
      return decodedReturn;
    }

    // If it's an absolute URL, check it's same origin
    const returnUrl = new URL(decodedReturn);
    const currentOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const currentUrl = new URL(currentOrigin);

    if (returnUrl.origin === currentUrl.origin) {
      return decodedReturn;
    }

    // Different origin - use default for security
    console.warn('Return URL has different origin, using default:', decodedReturn);
    return defaultReturn;
  } catch (error) {
    // Invalid URL - use default
    console.warn('Invalid return URL, using default:', decodedReturn);
    return defaultReturn;
  }
}

/**
 * Check if error requires re-authentication and get auth URL
 */
export function handleAuthError(error: unknown): { needsReauth: boolean; authUrl?: string } {
  if (ReauthRequiredError.isReauthRequired(error)) {
    return {
      needsReauth: true,
      authUrl: error.authUrl,
    };
  }

  return {
    needsReauth: false,
  };
}

/**
 * Create a redirect response for re-authentication
 * Used in API routes that detect expired tokens
 */
export function createReauthRedirectResponse(returnTo?: string) {
  const authUrl = getAuthUrlWithReturn(returnTo);

  return {
    reauth_required: true,
    message: 'Re-authorization required. Please authenticate with Constant Contact.',
    auth_url: authUrl,
    action: 'redirect',
  };
}

/**
 * Helper to determine if a Payload response indicates auth issues
 */
export function isAuthError(status: number): boolean {
  return status === 401 || status === 403;
}
