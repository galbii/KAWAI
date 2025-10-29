/**
 * Constant Contact OAuth Callback Route
 * Enhanced with Payload CMS database integration and return URL support
 *
 * Handles OAuth callback, exchanges code for tokens, stores them securely in database,
 * and redirects user back to their original location
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactAuthWithDatabase } from '@/lib/constantcontact/auth';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/constantcontact-demo?error=${error}&description=${errorDescription}`, request.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/constantcontact-demo?error=missing_parameters', request.url)
      );
    }

    // Validate state parameter to prevent CSRF attacks
    const storedState = request.cookies.get('cc_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/constantcontact-demo?error=invalid_state', request.url)
      );
    }

    // Create auth instance with database integration
    const auth = createConstantContactAuthWithDatabase(payload);

    // Validate state with constant-time comparison for security
    if (!auth.validateState(state, storedState)) {
      return NextResponse.redirect(
        new URL('/constantcontact-demo?error=invalid_state', request.url)
      );
    }

    // Complete OAuth2 flow and store tokens in database
    const result = await auth.completeOAuth2Flow(code, payload);

    if (!result.success) {
      return NextResponse.redirect(
        new URL(`/constantcontact-demo?error=token_exchange_failed&description=${encodeURIComponent(result.message)}`, request.url)
      );
    }

    // Get return URL from cookie (defaults to /admin if not found)
    const returnTo = request.cookies.get('cc_oauth_return')?.value || '/admin';

    // Redirect to original location with success parameter
    const redirectUrl = new URL(returnTo, request.url);
    redirectUrl.searchParams.set('auth_success', 'true');
    const response = NextResponse.redirect(redirectUrl);

    // Clear OAuth cookies
    response.cookies.set('cc_oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Delete cookie
    });

    response.cookies.set('cc_oauth_return', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Delete cookie
    });

    // Set a session cookie to indicate successful authentication
    response.cookies.set('cc_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);

    return NextResponse.redirect(
      new URL(`/constantcontact-demo?error=callback_error&description=${encodeURIComponent('An unexpected error occurred')}`, request.url)
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET for OAuth callback.' },
    { status: 405 }
  );
}