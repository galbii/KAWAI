/**
 * Constant Contact Initialization Route
 *
 * One-time setup route to initialize Constant Contact credentials from environment variables
 * This is required before the OAuth flow can work properly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeConstantContactCredentials } from '@/lib/constantcontact/credentials';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    console.log('Initializing Constant Contact credentials...');
    const credentials = await initializeConstantContactCredentials(payload);

    if (!credentials) {
      return NextResponse.json(
        {
          error: 'Failed to initialize credentials',
          details: 'Check that environment variables are set: CONSTANT_CONTACT_CLIENT_ID, CONSTANT_CONTACT_CLIENT_SECRET, CONSTANT_CONTACT_REDIRECT_URI'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Constant Contact credentials initialized successfully',
      data: {
        id: credentials.id,
        status: credentials.status,
        clientId: credentials.clientId.substring(0, 8) + '...', // Show partial for verification
        redirectUri: credentials.redirectUri
      }
    });

  } catch (error) {
    console.error('Initialization error:', error);

    return NextResponse.json(
      {
        error: 'Failed to initialize credentials',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check if credentials already exist
    const result = await payload.find({
      collection: 'constant-contact-settings',
      limit: 1,
    });

    const credentials = result.docs[0];

    if (credentials) {
      return NextResponse.json({
        success: true,
        message: 'Credentials already exist',
        data: {
          id: credentials.id,
          status: credentials.status,
          clientId: credentials.clientId?.substring(0, 8) + '...', // Show partial for verification
          redirectUri: credentials.redirectUri,
          hasAccessToken: !!credentials.accessToken,
          hasRefreshToken: !!credentials.refreshToken,
          lastTokenRefresh: credentials.lastTokenRefresh,
          errorMessage: credentials.errorMessage
        }
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No credentials found. Run POST to initialize.'
    });

  } catch (error) {
    console.error('Check credentials error:', error);

    return NextResponse.json(
      {
        error: 'Failed to check credentials',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}