import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Email capture validation schema
const emailCaptureSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().optional().default('unknown'),
  subscribeToUpdates: z.boolean().optional().default(true)
})

type EmailCaptureData = z.infer<typeof emailCaptureSchema>

interface SubmissionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/**
 * Get OAuth2 access token for Constant Contact API
 */
async function getConstantContactAccessToken(): Promise<string> {
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const refreshToken = process.env.CONSTANT_CONTACT_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Constant Contact API credentials')
  }

  const response = await fetch('https://authz.constantcontact.com/oauth2/default/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
  }

  const tokenData = await response.json()
  return tokenData.access_token
}

/**
 * Create contact in Constant Contact (email-only version)
 */
async function createConstantContactContact(emailData: EmailCaptureData, accessToken: string) {
  const constantContactPayload = {
    email_address: {
      address: emailData.email,
      permission_to_send: emailData.subscribeToUpdates ? 'implicit' : 'not_set'
    },
    create_source: 'Contact',
    list_memberships: [
      process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '40d1d690-8d9d-11f0-9bdc-fa163ea70839'
    ]
  }

  const response = await fetch('https://api.cc.email/v3/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(constantContactPayload)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Constant Contact API error: ${response.status} - ${JSON.stringify(errorData)}`)
  }

  return await response.json()
}

/**
 * Log email capture for internal tracking
 */
async function logEmailCapture(emailData: EmailCaptureData) {
  console.log('📧 Email capture submission:', {
    email: emailData.email,
    source: emailData.source,
    subscribeToUpdates: emailData.subscribeToUpdates,
    timestamp: new Date().toISOString()
  })
}

/**
 * Main API route for email capture
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the email capture data
    const validationResult = emailCaptureSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.errors.forEach(error => {
        const path = error.path.join('.')
        errors[path] = error.message
      })

      return NextResponse.json({
        success: false,
        message: 'Please check the form for errors',
        errors
      }, { status: 400 })
    }

    const emailData = validationResult.data

    // Check if Constant Contact integration is enabled
    const isConstantContactEnabled = process.env.CONSTANT_CONTACT_CLIENT_ID && 
                                   process.env.CONSTANT_CONTACT_CLIENT_SECRET && 
                                   process.env.CONSTANT_CONTACT_REFRESH_TOKEN

    if (isConstantContactEnabled) {
      try {
        // Get access token and create contact in Constant Contact
        const accessToken = await getConstantContactAccessToken()
        await createConstantContactContact(emailData, accessToken)
        
        console.log(`✅ Successfully added email ${emailData.email} to SHOWROOM KAWAI list`)
      } catch (error) {
        console.error('Constant Contact integration failed, continuing with email capture:', error)
        // Don't fail the entire email capture if Constant Contact fails
      }
    } else {
      console.log('Constant Contact integration disabled - missing environment variables')
    }

    // Log the email capture
    await logEmailCapture(emailData)

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive updates about our exclusive piano events and new arrivals.'
    })

  } catch (error) {
    console.error('Email capture error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.'
    }, { status: 500 })
  }
}