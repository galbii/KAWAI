'use server'

import { z } from 'zod'

// Form validation schema matching your existing form
const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  preferredContact: z.enum(['phone', 'email', 'text']),
  inquiryType: z.enum(['general', 'piano-consultation', 'service', 'financing', 'scheduling']),
  pianoInterest: z.string().optional(),
  message: z.string().optional(),
  bestTimeToCall: z.string().optional(),
  subscribeToUpdates: z.boolean().optional(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface SubmissionResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/**
 * Get OAuth2 access token for Constant Contact API
 * This would typically be refreshed periodically and stored securely
 */
async function getConstantContactAccessToken(): Promise<string> {
  const clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
  const clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
  const refreshToken = process.env.CONSTANT_CONTACT_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Constant Contact API credentials in environment variables')
  }

  try {
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
  } catch (error) {
    console.error('Failed to get Constant Contact access token:', error)
    throw new Error('Authentication failed with Constant Contact API')
  }
}

/**
 * Create or update contact in Constant Contact
 */
async function createConstantContactContact(contactData: ContactFormData, accessToken: string) {
  const constantContactPayload = {
    email_address: {
      address: contactData.email,
      permission_to_send: contactData.subscribeToUpdates ? 'implicit' : 'not_set'
    },
    first_name: contactData.firstName,
    last_name: contactData.lastName,
    create_source: 'Contact',
    phone_numbers: [
      {
        phone_number: contactData.phone,
        kind: 'mobile'
      }
    ],
    // Add contact to appropriate list based on inquiry type
    list_memberships: [
      process.env.CONSTANT_CONTACT_DEFAULT_LIST_ID || '1'
    ]
  }

  // Note: Custom fields removed - they would need to be created in Constant Contact first
  // The basic contact information above will be stored in Constant Contact

  try {
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
  } catch (error) {
    console.error('Failed to create Constant Contact contact:', error)
    throw error
  }
}

/**
 * Send internal notification email (optional)
 * This could be to your team for immediate follow-up
 */
async function sendInternalNotification(contactData: ContactFormData) {
  // This could integrate with your preferred email service
  // For now, we'll just log it (replace with actual email service)
  console.log('New contact form submission:', {
    name: `${contactData.firstName} ${contactData.lastName}`,
    email: contactData.email,
    phone: contactData.phone,
    inquiryType: contactData.inquiryType,
    timestamp: new Date().toISOString()
  })

  // TODO: Implement actual email notification
  // This could use Resend, SendGrid, AWS SES, etc.
}

/**
 * Main server action for handling contact form submissions
 */
export async function submitContactForm(
  prevState: SubmissionResult | null,
  formData: FormData
): Promise<SubmissionResult> {
  try {
    // Extract and validate form data
    const rawData = {
      firstName: formData.get('firstName')?.toString() || '',
      lastName: formData.get('lastName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
      preferredContact: formData.get('preferredContact')?.toString() || '',
      inquiryType: formData.get('inquiryType')?.toString() || '',
      pianoInterest: formData.get('pianoInterest')?.toString() || undefined,
      message: formData.get('message')?.toString() || undefined,
      bestTimeToCall: formData.get('bestTimeToCall')?.toString() || undefined,
      subscribeToUpdates: formData.get('subscribeToUpdates') === 'true'
    }

    // Validate the data
    const validationResult = contactFormSchema.safeParse(rawData)
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach(error => {
        const path = error.path.join('.')
        errors[path] = error.message
      })

      return {
        success: false,
        message: 'Please check the form for errors',
        errors
      }
    }

    const contactData = validationResult.data

    // Check if Constant Contact integration is enabled
    const isConstantContactEnabled = process.env.CONSTANT_CONTACT_CLIENT_ID && 
                                   process.env.CONSTANT_CONTACT_CLIENT_SECRET && 
                                   process.env.CONSTANT_CONTACT_REFRESH_TOKEN

    if (isConstantContactEnabled) {
      try {
        // Get access token and create contact in Constant Contact
        const accessToken = await getConstantContactAccessToken()
        await createConstantContactContact(contactData, accessToken)
        
        console.log(`Successfully added contact ${contactData.email} to Constant Contact`)
      } catch (error) {
        console.error('Constant Contact integration failed, continuing with form submission:', error)
        // Don't fail the entire form submission if Constant Contact fails
      }
    } else {
      console.log('Constant Contact integration disabled - missing environment variables')
    }

    // Send internal notification
    await sendInternalNotification(contactData)

    return {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    }

  } catch (error) {
    console.error('Contact form submission error:', error)
    
    return {
      success: false,
      message: 'Something went wrong while submitting your message. Please try again or contact us directly.'
    }
  }
}

/**
 * Alternative server action with direct form data (for useFormState)
 */
export async function handleContactFormSubmission(formData: FormData): Promise<SubmissionResult> {
  return submitContactForm(null, formData)
}