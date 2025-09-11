import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 🚫 DISABLED: This endpoint was used for setup and is now disabled for security
  // See docs/CONSTANT_CONTACT_INTEGRATION.md for documentation
  return NextResponse.json({
    error: 'Endpoint disabled',
    message: 'This setup endpoint has been disabled for security.',
    documentation: 'See docs/CONSTANT_CONTACT_INTEGRATION.md for complete integration guide',
    current_config: 'SHOWROOM KAWAI list (ID: 40d1d690-8d9d-11f0-9bdc-fa163ea70839)',
    active_endpoint: '/api/test-contact for testing contact form submissions'
  }, { status: 403 })
  
  return NextResponse.json({
    message: 'Check your Constant Contact lists manually',
    instructions: [
      '1. Log into https://app.constantcontact.com',
      '2. Go to Contacts → Lists',
      '3. Note the list names you want to use',
      '4. Common list IDs to try:'
    ],
    common_list_ids: [
      { id: '1', name: 'General Interest (default)' },
      { id: '2', name: 'Customers' },
      { id: '3', name: 'Prospects' }
    ],
    current_config: {
      default_list_id: process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1',
      note: 'This is where your contacts currently go'
    },
    how_to_change: {
      step_1: 'Update your .env.local file',
      step_2: 'Change CONSTANT_CONTACT_DEFAULT_LIST_ID=your-desired-list-id',
      step_3: 'Restart your dev server'
    }
  })
}