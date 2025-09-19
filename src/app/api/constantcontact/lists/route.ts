/**
 * Constant Contact Lists API Route
 *
 * Handles operations for retrieving and managing contact lists
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { ConstantContactListManager } from '@/lib/constantcontact/lists';
import { getValidAccessToken } from '@/lib/constantcontact/credentials';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check authentication by getting valid access token
    const accessToken = await getValidAccessToken(payload);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please complete OAuth flow first or token has expired.' },
        { status: 401 }
      );
    }

    // Create client and list manager with database-managed token
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'raw';
    const searchName = searchParams.get('name');

    console.log(`📊 Lists API: Fetching lists (format: ${format}, search: ${searchName || 'none'})`);

    // Fetch lists (with optional name search)
    let response;
    if (searchName) {
      // Use the new search by name method
      const searchResponse = await listManager.findListByName(searchName);
      if (searchResponse.success && searchResponse.data) {
        // Convert single result to lists response format
        response = {
          success: true,
          status: searchResponse.status,
          data: {
            lists: [searchResponse.data],
            lists_count: 1
          }
        };
      } else {
        response = {
          success: true,
          status: searchResponse.status,
          data: {
            lists: [],
            lists_count: 0
          }
        };
      }
    } else {
      response = await listManager.getAllLists();
    }

    if (!response.success) {
      return NextResponse.json(
        {
          error: 'Failed to fetch lists',
          details: response.error
        },
        { status: response.status }
      );
    }

    // Format response based on request
    if (format === 'ui') {
      // Format for dropdown/selection UI
      const formattedLists = listManager.formatListsForUI(response.data?.lists || []);
      return NextResponse.json({
        success: true,
        data: formattedLists,
        count: formattedLists.length
      });
    }

    // Return raw response
    return NextResponse.json({
      success: true,
      data: response.data,
      count: response.data?.lists_count || 0
    });

  } catch (error) {
    console.error('Lists API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check authentication by getting valid access token
    const accessToken = await getValidAccessToken(payload);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please complete OAuth flow first or token has expired.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'List name is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Create client and list manager with database-managed token
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);

    // Create list
    const response = await listManager.createList(name.trim(), description);

    if (!response.success) {
      return NextResponse.json(
        {
          error: 'Failed to create list',
          details: response.error
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      message: 'List created successfully'
    });

  } catch (error) {
    console.error('Create list error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}