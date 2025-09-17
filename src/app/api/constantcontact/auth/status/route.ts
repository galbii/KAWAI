/**
 * Constant Contact Authentication Status Route
 *
 * Provides a lightweight endpoint for checking authentication status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/constantcontact/credentials';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check if we have a valid access token
    const accessToken = await getValidAccessToken(payload);

    if (accessToken) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        message: 'Valid authentication found'
      });
    } else {
      return NextResponse.json({
        success: true,
        authenticated: false,
        message: 'No valid authentication found'
      });
    }
  } catch (error) {
    console.error('Authentication status check error:', error);

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: 'Failed to check authentication status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}