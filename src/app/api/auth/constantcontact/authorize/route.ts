/**
 * Constant Contact OAuth Authorization Route
 * Enhanced with Payload CMS database integration
 *
 * Initiates OAuth flow by redirecting to Constant Contact authorization server
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactAuthWithDatabase } from '@/lib/constantcontact/auth';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const auth = createConstantContactAuthWithDatabase(payload);

    // Generate authorization URL with secure state parameter
    const { url: authUrl, state } = await auth.getAuthorizationUrlWithDatabase(payload);

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