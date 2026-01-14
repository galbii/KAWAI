/**
 * React Hook for Constant Contact Authentication
 *
 * Provides proactive authentication checking and automatic redirect to OAuth flow
 * when tokens are expired or invalid
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AuthStatus {
  authenticated: boolean;
  needs_reauth: boolean;
  auth_url: string | null;
  expires_at: string | null;
  status: string | null;
}

export interface UseConstantContactAuthResult {
  isAuthenticated: boolean;
  isChecking: boolean;
  needsReauth: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  redirectToAuth: (returnTo?: string) => void;
}

/**
 * Hook to check Constant Contact authentication status
 * Optionally auto-redirects to OAuth flow when authentication is required
 *
 * @param options Configuration options
 * @param options.autoRedirect - Automatically redirect to auth flow if not authenticated (default: false)
 * @param options.checkOnMount - Check authentication status when component mounts (default: true)
 */
export function useConstantContactAuth(options: {
  autoRedirect?: boolean;
  checkOnMount?: boolean;
} = {}): UseConstantContactAuthResult {
  const { autoRedirect = false, checkOnMount = true } = options;

  const router = useRouter();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [needsReauth, setNeedsReauth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check authentication status with Constant Contact
   */
  const checkAuth = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/constant-contact/auth/status');
      const data: AuthStatus & { success: boolean; message?: string; error?: string } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to check authentication status');
      }

      setIsAuthenticated(data.authenticated);
      setNeedsReauth(data.needs_reauth);

      // Auto-redirect if enabled and reauth is needed
      if (autoRedirect && data.needs_reauth && data.auth_url) {
        console.log('Constant Contact: Re-authentication required, redirecting...');
        redirectToAuth(pathname);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Constant Contact auth check error:', errorMessage);
      setError(errorMessage);
      setIsAuthenticated(false);
      setNeedsReauth(true);
    } finally {
      setIsChecking(false);
    }
  }, [autoRedirect, pathname]);

  /**
   * Redirect to OAuth authorization flow
   * @param returnTo - URL to return to after authentication
   */
  const redirectToAuth = useCallback((returnTo?: string) => {
    const returnUrl = returnTo || pathname || '/admin';
    const authUrl = `/api/auth/constant-contact/authorize?return_to=${encodeURIComponent(returnUrl)}`;

    console.log('Constant Contact: Redirecting to auth flow...', {
      authUrl,
      returnUrl
    });

    // Use window.location for immediate redirect
    window.location.href = authUrl;
  }, [pathname]);

  // Check auth on mount if enabled
  useEffect(() => {
    if (checkOnMount) {
      checkAuth();
    }
  }, [checkOnMount, checkAuth]);

  return {
    isAuthenticated,
    isChecking,
    needsReauth,
    error,
    checkAuth,
    redirectToAuth,
  };
}

/**
 * Simpler hook that just checks auth status without automatic behavior
 */
export function useConstantContactAuthStatus() {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/constant-contact/auth/status');
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus(data);
        } else {
          throw new Error(data.error || 'Failed to check status');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  return { status, isLoading, error };
}
