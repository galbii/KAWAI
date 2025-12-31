'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'

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

// Constant Contact integration removed - using Shopify Admin API only

/**
 * Send internal notification email via Resend (optional)
 * This notifies your team for immediate follow-up
 */
async function sendInternalNotification(contactData: ContactFormData, storefrontSlug?: string) {
  console.log('[Contact Form] New submission:', {
    name: `${contactData.firstName} ${contactData.lastName}`,
    email: contactData.email,
    phone: contactData.phone,
    inquiryType: contactData.inquiryType,
    location: storefrontSlug || 'unknown',
    timestamp: new Date().toISOString()
  })

  // TODO: Implement Resend email notification (optional)
  // if (process.env.RESEND_API_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       from: 'contact@kawai-pianos.com',
  //       to: 'sales@kawai-pianos.com',
  //       subject: `New Contact Form: ${contactData.inquiryType}`,
  //       html: `<p>New inquiry from ${contactData.firstName} ${contactData.lastName}</p>`
  //     })
  //   })
  // }
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

    // Extract storefront slug from form data
    const storefrontSlug = formData.get('storefrontSlug')?.toString() || ''

    // Shopify Admin API - Create or update customer with tags (OAuth)
    const isShopifyAdminEnabled = process.env.SHOPIFY_APP_API_KEY &&
                                  process.env.SHOPIFY_APP_CLIENT_SECRET &&
                                  process.env.SHOPIFY_STORE_DOMAIN

    if (!isShopifyAdminEnabled) {
      console.error('Shopify Admin API integration disabled - missing SHOPIFY_APP_API_KEY, SHOPIFY_APP_CLIENT_SECRET, or SHOPIFY_STORE_DOMAIN')
      return {
        success: false,
        message: 'Form submission failed: Shopify integration not configured. Please contact support.'
      }
    }

    try {
      // Build tags based on form data
      const tags: string[] = []

      // Only tag with storefront slug (no prefix)
      if (storefrontSlug) {
        tags.push(storefrontSlug)
      }

      // Create or update customer in Shopify using optimized upsert
      // This uses the customerSet mutation which handles create/update in ONE API call
      const customerInput: {
        email: string
        firstName: string
        lastName: string
        phone: string
        tags: string[]
        emailMarketingConsent?: { marketingState: 'SUBSCRIBED'; marketingOptInLevel: 'SINGLE_OPT_IN' }
        note?: string
      } = {
        email: contactData.email,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phone: contactData.phone,
        tags,
      }

      if (contactData.subscribeToUpdates) {
        customerInput.emailMarketingConsent = {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
        }
      }

      if (contactData.message) {
        customerInput.note = `Contact form inquiry: ${contactData.message}`
      }

      await upsertCustomer(customerInput)

      console.log(`[Contact Form] Successfully created/updated Shopify customer ${contactData.email} with tags:`, tags)
    } catch (error) {
      console.error('[Contact Form] Shopify Admin API integration failed:', error)

      return {
        success: false,
        message: 'Failed to submit your contact information. Please try again or contact us directly.',
        errors: {
          shopify: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      }
    }

    // Send internal notification (optional)
    await sendInternalNotification(contactData, storefrontSlug)

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