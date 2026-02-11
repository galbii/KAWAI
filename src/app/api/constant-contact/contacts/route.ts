/**
 * Constant Contact Contacts API Route
 *
 * Handles contact creation and updates with automatic token refresh.
 * Used by booking blocks (CalendlyEmbed, BookingModal) to capture leads.
 *
 * Features:
 * - Automatic token refresh via getValidAccessToken()
 * - Contact upsert with conflict handling
 * - Smart list membership merging
 * - Re-auth flow when refresh token expires
 */

import { NextRequest, NextResponse } from 'next/server'
import { createConstantContactClient } from '@/lib/constantcontact/client'
import { ConstantContactListManager, type CreateContactRequest } from '@/lib/constantcontact/lists'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * POST /api/constant-contact/contacts
 *
 * Create or update a contact with list memberships
 *
 * Request body should match CreateContactRequest interface:
 * {
 *   email_address: string (required)
 *   first_name?: string
 *   last_name?: string
 *   job_title?: string
 *   company_name?: string
 *   phone_number?: string
 *   list_ids: string[] (required - at least one list ID)
 *   custom_fields?: Array<{ custom_field_id: string, value: string }>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    // Parse request body
    const contactData: CreateContactRequest = await request.json()

    // Validate required fields
    if (!contactData.email_address || !contactData.email_address.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email address is required'
        },
        { status: 400 }
      )
    }

    if (!contactData.list_ids || contactData.list_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one list ID is required'
        },
        { status: 400 }
      )
    }

    // Initialize Constant Contact client and list manager
    // Client automatically handles token refresh via getValidAccessToken()
    const client = createConstantContactClient(payload)
    const listManager = new ConstantContactListManager(client)

    // Create or update contact (handles conflicts automatically)
    console.log('Constant Contact API: Creating/updating contact:', {
      email: contactData.email_address,
      lists: contactData.list_ids.length
    })

    const result = await listManager.createOrUpdateContact(contactData)

    if (result.success) {
      console.log('Constant Contact API: Successfully processed contact')
      return NextResponse.json({
        success: true,
        data: result.data,
        message: 'Contact successfully added to mailing list'
      })
    } else {
      console.error('Constant Contact API: Failed to process contact:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          status: result.status
        },
        { status: result.status || 500 }
      )
    }
  } catch (error) {
    console.error('Constant Contact API: Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
