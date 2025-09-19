/**
 * Constant Contact List Search by Name API Route
 *
 * Handles direct API-level searching for lists by exact name
 * This addresses the "SHOWROOM KAWAI" list access issue by using
 * Constant Contact's name query parameter for precise lookup
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { ConstantContactListManager } from '@/lib/constantcontact/lists';
import { getValidAccessToken } from '@/lib/constantcontact/credentials';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check authentication by getting valid access token
    const accessToken = await getValidAccessToken(payload);
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated. Please complete OAuth flow first or token has expired.',
          error_key: 'authentication_required'
        },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'List name is required and must be a non-empty string',
          error_key: 'validation_error'
        },
        { status: 400 }
      );
    }

    console.log(`🔍 API Search: Looking for list with exact name: "${name}"`);

    // Create client and list manager with database-managed token
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);

    // Search for list by name using the new API method
    const searchResponse = await listManager.findListByName(name.trim());

    if (!searchResponse.success) {
      console.error('API Search: Search request failed:', searchResponse.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to search for list',
          details: searchResponse.error,
          error_key: 'api_search_failed'
        },
        { status: searchResponse.status }
      );
    }

    // Handle search results
    if (searchResponse.data) {
      console.log(`✅ API Search: Found list "${searchResponse.data.name}" with ID: ${searchResponse.data.list_id}`);
      return NextResponse.json({
        success: true,
        found: true,
        data: {
          list_id: searchResponse.data.list_id,
          name: searchResponse.data.name,
          description: searchResponse.data.description,
          membership_count: searchResponse.data.membership_count,
          created_at: searchResponse.data.created_at,
          updated_at: searchResponse.data.updated_at
        },
        message: `Successfully found list: ${searchResponse.data.name}`
      });
    } else {
      console.log(`❌ API Search: No list found with name: "${name}"`);
      return NextResponse.json({
        success: true,
        found: false,
        data: null,
        searched_for: name,
        message: `No list found with exact name "${name}"`
      });
    }

  } catch (error) {
    console.error('API Search: Unexpected error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error during list search',
        details: error instanceof Error ? error.message : 'Unknown error',
        error_key: 'internal_error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests with list name in body',
      usage: 'POST /api/constantcontact/lists/search-by-name with { "name": "List Name" }'
    },
    { status: 405 }
  );
}