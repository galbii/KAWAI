import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 🚫 DISABLED: This endpoint was used for setup and is now disabled for security
  // See docs/CONSTANT_CONTACT_INTEGRATION.md for documentation
  return NextResponse.json({
    error: 'Endpoint disabled',
    message: 'This setup endpoint has been disabled for security.',
    documentation: 'See docs/CONSTANT_CONTACT_INTEGRATION.md for complete OAuth setup instructions',
    current_status: 'Integration is FULLY OPERATIONAL - no action needed',
    refresh_token_expires: 'Check documentation for renewal process (~6 months)'
  }, { status: 403 })
  
  return NextResponse.json({
    message: "To get your Constant Contact lists, you need fresh API access",
    
    problem: "Your refresh token has expired and needs to be renewed",
    
    solution_steps: [
      "1. Go to https://app.constantcontact.com/pages/dma/portal/",
      "2. Log into your Constant Contact account",
      "3. Go to 'My Applications' or 'Integrations'", 
      "4. Find your app (Client ID: 3561b5f4-c8b5-473a-a5c4-939c195f0569)",
      "5. Re-authorize or regenerate access tokens",
      "6. Update your .env.local with the new refresh token"
    ],
    
    alternative_approach: {
      message: "Or tell me which type of contacts you want to segment",
      options: [
        "All website contacts → General list (ID: 1)",
        "Piano buyers → Customers list", 
        "Service inquiries → Service list",
        "Consultation requests → Prospects list"
      ]
    },
    
    common_list_mapping: {
      "1": "General Interest (default - recommended for website forms)",
      "2": "Customers", 
      "3": "Prospects"
    },
    
    current_config: {
      list_id: process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1',
      note: "Your contacts currently go here"
    },
    
    api_reference: "https://developer.constantcontact.com/api_reference/index.html"
  })
}