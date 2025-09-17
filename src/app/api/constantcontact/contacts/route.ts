/**
 * Constant Contact Contacts API Route
 *
 * Handles operations for creating and managing contacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { ConstantContactListManager, CreateContactRequest } from '@/lib/constantcontact/lists';
import { getValidAccessToken } from '@/lib/constantcontact/credentials';
import { getPayload } from 'payload';
import config from '@/payload.config';

// Using database token storage managed by Payload CMS

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check authentication by getting valid access token
    const accessToken = await getValidAccessToken(payload);
    if (!accessToken) {
      console.error('Constant Contact API: No valid access token available');
      return NextResponse.json(
        { error: 'Not authenticated. Please complete OAuth flow first or token has expired.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Constant Contact API: Received contact submission:', {
      email: body.email_address,
      list_ids: body.list_ids,
      has_first_name: !!body.first_name,
      has_last_name: !!body.last_name,
      has_phone: !!body.phone_number
    });

    const {
      email_address,
      first_name,
      last_name,
      job_title,
      company_name,
      phone_number,
      list_ids
    } = body;

    // Validate required fields
    if (!email_address || typeof email_address !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!list_ids || !Array.isArray(list_ids) || list_ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one list ID is required' },
        { status: 400 }
      );
    }

    // Create client and list manager with database-managed token
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);

    // Validate email format
    if (!listManager.isValidEmail(email_address)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Prepare contact data
    const contactData: CreateContactRequest = {
      email_address: email_address.trim().toLowerCase(),
      first_name: first_name?.trim(),
      last_name: last_name?.trim(),
      job_title: job_title?.trim(),
      company_name: company_name?.trim(),
      phone_number: phone_number?.trim(),
      list_ids: list_ids.filter(id => typeof id === 'string' && id.trim().length > 0)
    };

    // Create or update contact
    console.log('Constant Contact API: Attempting to create/update contact with data:', contactData);
    const response = await listManager.createOrUpdateContact(contactData);

    if (!response.success) {
      console.error('Constant Contact API: Failed to create/update contact:', response.error);
      return NextResponse.json(
        {
          error: 'Failed to create/update contact',
          details: response.error
        },
        { status: response.status }
      );
    }

    console.log('Constant Contact API: Successfully created/updated contact');
    return NextResponse.json({
      success: true,
      data: response.data,
      message: 'Contact created/updated successfully'
    });

  } catch (error) {
    console.error('Constant Contact API: Unexpected error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const listId = searchParams.get('list_id');

    // Create client and list manager with database-managed token
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);

    if (email) {
      // Get contact by email
      if (!listManager.isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email address format' },
          { status: 400 }
        );
      }

      const response = await listManager.getContactByEmail(email);

      if (!response.success) {
        return NextResponse.json(
          {
            error: 'Failed to fetch contact',
            details: response.error
          },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        data: response.data
      });

    } else if (listId) {
      // Get contacts in a specific list
      const limit = parseInt(searchParams.get('limit') || '50');
      const response = await listManager.getContactsInList(listId, limit);

      if (!response.success) {
        return NextResponse.json(
          {
            error: 'Failed to fetch contacts in list',
            details: response.error
          },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        data: response.data
      });

    } else {
      return NextResponse.json(
        { error: 'Either email or list_id parameter is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Get contact error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}