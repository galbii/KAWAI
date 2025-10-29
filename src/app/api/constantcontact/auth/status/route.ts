/**
 * Constant Contact Authentication Status Route
 *
 * Provides detailed authentication status including expiration and re-auth requirements
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkAuthStatus } from '@/lib/constantcontact/auth-helpers';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Get comprehensive auth status
    const status = await checkAuthStatus(payload);

    return NextResponse.json({
      success: true,
      authenticated: status.authenticated,
      needs_reauth: status.needsReauth,
      auth_url: status.authUrl,
      expires_at: status.expiresAt,
      status: status.status,
      message: status.authenticated
        ? 'Valid authentication found'
        : status.needsReauth
          ? 'Re-authorization required'
          : 'No authentication found'
    });
  } catch (error) {
    console.error('Authentication status check error:', error);

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        needs_reauth: true,
        auth_url: '/api/auth/constantcontact/authorize',
        error: 'Failed to check authentication status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}