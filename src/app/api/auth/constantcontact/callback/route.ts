/**
 * Constant Contact OAuth Callback Route
 *
 * Handles OAuth callback, exchanges code for tokens, and stores them securely
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactAuth } from '@/lib/constantcontact/auth';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { MemoryTokenStorage } from '@/lib/constantcontact/auth';

// In production, use database or encrypted session storage
const tokenStorage = new MemoryTokenStorage();

export async function GET(request: NextRequest) {
  try {
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

    // Exchange code for tokens
    const client = createConstantContactClient(tokenStorage);
    const tokenResponse = await client.completeOAuthFlow(code);

    if (!tokenResponse.success) {
      const errorMessage = tokenResponse.error?.[0]?.error_message || 'OAuth flow failed';
      return NextResponse.redirect(
        new URL(`/constantcontact-demo?error=token_exchange_failed&description=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }

    // Clear state cookie
    const response = NextResponse.redirect(
      new URL('/constantcontact-demo?success=true', request.url)
    );

    response.cookies.set('cc_oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Delete cookie
    });

    // Optionally set a session cookie to indicate successful authentication
    response.cookies.set('cc_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
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