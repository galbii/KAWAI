/**
 * Constant Contact List Search API Route
 *
 * Search for a contact list by name using Constant Contact API.
 * Used by ensureShowroomKawaiList() and ensureListExists() for list discovery.
 *
 * POST /api/constant-contact/lists/search-by-name
 * Body: { name: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createConstantContactClient } from '@/lib/constantcontact/client'
import { ConstantContactListManager } from '@/lib/constantcontact/lists'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    // Parse request body
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'List name is required'
        },
        { status: 400 }
      )
    }

    // Initialize client and list manager
    // Client automatically handles token refresh via getValidAccessToken()
    const client = createConstantContactClient(payload)
    const listManager = new ConstantContactListManager(client)

    // Search for list by name
    console.log('Constant Contact API: Searching for list:', name)
    const result = await listManager.findListByName(name)

    if (result.success && result.data) {
      console.log('Constant Contact API: Found list:', result.data.name, 'ID:', result.data.list_id)
      return NextResponse.json({
        success: true,
        data: result.data
      })
    } else if (result.success && !result.data) {
      // List not found
      console.log('Constant Contact API: List not found:', name)
      return NextResponse.json({
        success: false,
        error: 'List not found',
        list_name: name
      }, { status: 404 })
    } else {
      console.error('Constant Contact API: Search failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error
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
