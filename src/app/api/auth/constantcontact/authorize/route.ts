/**
 * Constant Contact OAuth Authorization Route
 *
 * Initiates OAuth flow by redirecting to Constant Contact authorization server
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactAuth } from '@/lib/constantcontact/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = createConstantContactAuth();

    // Generate random state for CSRF protection
    const state = generateState();

    // Create authorization URL
    const authUrl = auth.getAuthorizationUrl(state);

    // Store state in session/cookie for validation in callback
    const response = NextResponse.redirect(authUrl);

    // Set secure httpOnly cookie with state
    response.cookies.set('cc_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    });

    return response;

  } catch (error) {
    console.error('OAuth authorization error:', error);

    return NextResponse.json(
      {
        error: 'Failed to initiate OAuth flow',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Generate random state parameter for OAuth security
 */
function generateState(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
}