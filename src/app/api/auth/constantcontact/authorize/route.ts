/**
 * Constant Contact OAuth Authorization Route
 * Enhanced with Payload CMS database integration and return URL support
 *
 * Initiates OAuth flow by redirecting to Constant Contact authorization server
 * Accepts optional 'return_to' query parameter to redirect user after auth
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactAuthWithDatabase } from '@/lib/constantcontact/auth';
import { getReturnUrl } from '@/lib/constantcontact/auth-helpers';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const auth = createConstantContactAuthWithDatabase(payload);

    // Get return URL from query parameters (validated for security)
    const searchParams = request.nextUrl.searchParams;
    const returnTo = getReturnUrl(searchParams, '/admin');

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

    // Store return URL in secure cookie (if provided)
    if (returnTo) {
      response.cookies.set('cc_oauth_return', returnTo, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600 // 10 minutes
      });
    }

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