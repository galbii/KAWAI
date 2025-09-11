import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 🚫 DISABLED: This endpoint was used for setup and is now disabled for security
  // See docs/CONSTANT_CONTACT_INTEGRATION.md for documentation
  return NextResponse.json({
    error: 'Endpoint disabled',
    message: 'This demo endpoint has been disabled for security.',
    documentation: 'See docs/CONSTANT_CONTACT_INTEGRATION.md for complete list search examples',
    current_list: 'SHOWROOM KAWAI (ID: 40d1d690-8d9d-11f0-9bdc-fa163ea70839)',
    integration_status: 'FULLY OPERATIONAL'
  }, { status: 403 })
  
  return NextResponse.json({
    message: 'Demo: How to find your Showroom Kawai list ID using Constant Contact v3 API',
    
    when_you_have_fresh_token: {
      method_1_exact_search: {
        url: 'https://api.cc.email/v3/contact_lists?name=showroom kawai',
        description: 'Search by exact list name',
        response_will_contain: {
          list_id: 'UUID format like: 12345678-1234-1234-1234-123456789abc',
          name: 'showroom kawai',
          membership_count: 'number of contacts',
          status: 'active/deleted/etc'
        }
      },
      
      method_2_partial_search: {
        note: 'If exact name fails, try variations',
        variations_to_try: [
          'showroom kawai',
          'Showroom Kawai', 
          'showroom',
          'kawai',
          'Kawai Showroom'
        ]
      },
      
      method_3_get_all_lists: {
        url: 'https://api.cc.email/v3/contact_lists',
        description: 'Get all lists and find yours manually'
      }
    },
    
    immediate_solutions: {
      option_1: 'Check https://app.constantcontact.com → Contacts → Lists',
      option_2: 'Try common list IDs like "1", "2", "3" first',
      option_3: 'Create new list if it doesn\'t exist'
    },
    
    current_status: {
      problem: 'Refresh token expired - need to re-authorize',
      current_list_id: process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1',
      forms_working: 'Yes - they work without Constant Contact API'
    },
    
    next_steps_when_ready: [
      '1. Get fresh Constant Contact API access',
      '2. Use the search endpoint above to find your list ID', 
      '3. Update .env.local: CONSTANT_CONTACT_DEFAULT_LIST_ID=your-list-uuid',
      '4. Restart your dev server'
    ]
  })
}