/**
 * Arlington 2025 Booking API Route
 *
 * Handles lead capture for Arlington event bookings:
 * 1. Validates contact information
 * 2. Creates/finds "arlington2025" list in Constant Contact
 * 3. Adds contact to the list
 * 4. Returns contact data for Calendly prefill
 */

import { NextRequest, NextResponse } from 'next/server';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import { ConstantContactListManager, type CreateContactRequest } from '@/lib/constantcontact/lists';
import { getValidAccessToken } from '@/lib/constantcontact/credentials';
import { getPayload } from 'payload';
import config from '@/payload.config';

const ARLINGTON_LIST_NAME = 'ARLINGTON2025';
const ARLINGTON_LIST_DESCRIPTION = 'Arlington exclusive event bookings - November 2025';

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Check authentication
    const accessToken = await getValidAccessToken(payload);
    if (!accessToken) {
      console.error('Arlington Booking API: No valid access token available');
      return NextResponse.json(
        {
          error: 'CRM integration not configured',
          message: 'Contact submitted successfully (CRM offline)'
        },
        { status: 200 } // Non-blocking - allow booking to continue
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Arlington Booking API: Received booking submission:', {
      email: body.email,
      has_firstName: !!body.firstName,
      has_lastName: !!body.lastName,
      timestamp: new Date().toISOString()
    });

    const { email, firstName, lastName } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (!firstName || typeof firstName !== 'string') {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== 'string') {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      );
    }

    // Create client and list manager
    const client = createConstantContactClient(payload);
    const listManager = new ConstantContactListManager(client);

    // Validate email format
    if (!listManager.isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Step 1: Find or create the ARLINGTON2025 list
    console.log(`Arlington Booking API: Finding/creating ${ARLINGTON_LIST_NAME} list...`);

    const listsResponse = await listManager.getAllLists();
    if (!listsResponse.success) {
      console.error('Arlington Booking API: Failed to fetch lists:', listsResponse.error);
      // Non-blocking - allow booking to continue
      return NextResponse.json(
        {
          success: true,
          message: 'Contact captured (list creation pending)',
          data: { email, firstName, lastName }
        }
      );
    }

    let arlingtonListId: string | undefined;
    const existingList = listsResponse.data?.lists?.find(
      (list: { name: string }) => list.name.toUpperCase() === ARLINGTON_LIST_NAME
    );

    if (existingList && 'list_id' in existingList) {
      arlingtonListId = existingList.list_id as string;
      console.log(`Arlington Booking API: Found existing ${ARLINGTON_LIST_NAME} list:`, arlingtonListId);
    } else {
      // Create new list
      console.log(`Arlington Booking API: Creating new ${ARLINGTON_LIST_NAME} list...`);
      const createListResponse = await listManager.createList(
        ARLINGTON_LIST_NAME,
        ARLINGTON_LIST_DESCRIPTION
      );

      if (createListResponse.success && createListResponse.data && 'list_id' in createListResponse.data) {
        arlingtonListId = createListResponse.data.list_id as string;
        console.log(`Arlington Booking API: Created ${ARLINGTON_LIST_NAME} list:`, arlingtonListId);
      } else {
        console.error('Arlington Booking API: Failed to create list:', createListResponse.error);
        // Non-blocking - allow booking to continue
        return NextResponse.json(
          {
            success: true,
            message: 'Contact captured (list creation failed)',
            data: { email, firstName, lastName }
          }
        );
      }
    }

    // Step 2: Create/update contact and add to list
    if (!arlingtonListId) {
      console.error('Arlington Booking API: No list ID available');
      return NextResponse.json(
        {
          success: true,
          message: 'Contact captured (list assignment pending)',
          data: { email, firstName, lastName }
        }
      );
    }

    const contactData: CreateContactRequest = {
      email_address: email.trim().toLowerCase(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      list_ids: [arlingtonListId]
    };

    console.log('Arlington Booking API: Creating/updating contact with data:', {
      email: contactData.email_address,
      list_id: arlingtonListId
    });

    const contactResponse = await listManager.createOrUpdateContact(contactData);

    if (!contactResponse.success) {
      console.error('Arlington Booking API: Failed to create/update contact:', contactResponse.error);
      // Non-blocking - allow booking to continue
      return NextResponse.json(
        {
          success: true,
          message: 'Contact captured (CRM sync pending)',
          data: { email, firstName, lastName }
        }
      );
    }

    console.log('Arlington Booking API: Successfully added contact to ARLINGTON2025 list');

    return NextResponse.json({
      success: true,
      message: 'Contact successfully added to Arlington 2025 list',
      data: {
        email,
        firstName,
        lastName,
        listId: arlingtonListId,
        contactId: contactResponse.data?.contact_id
      }
    });

  } catch (error) {
    console.error('Arlington Booking API: Unexpected error:', error);

    // Non-blocking error handling - allow booking to continue
    return NextResponse.json(
      {
        success: true,
        message: 'Contact captured (processing error)',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    );
  }
}
