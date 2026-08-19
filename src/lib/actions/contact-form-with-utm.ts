/**
 * Contact Form Submission with UTM Tracking
 *
 * Example server action that demonstrates proper integration of:
 * - Form data processing
 * - UTM parameter tracking for attribution
 * - Customer upsert with tag merging
 * - Error handling
 *
 * This pattern should be used for all lead capture forms.
 */
'use server'

import { upsertCustomer, CustomerError } from '@/lib/shopify/customers'
import { siteTags } from '@/lib/shopify/site-tags'
import { sendMetaCAPIEvents, buildLeadEvent } from '@/lib/integrations/meta-capi'
import { headers } from 'next/headers'

/**
 * Result type for form submission
 */
interface ContactFormResult {
  success: boolean
  customerId?: string
  error?: string
  errors?: Array<{ field?: string[]; message: string }>
}

/**
 * Submit contact form with UTM attribution tracking
 *
 * @param formData - Form data from contact form
 * @returns Result object with success status
 *
 * @example
 * ```typescript
 * // In client component
 * 'use client'
 * import { submitContactFormWithUTM } from '@/lib/actions/contact-form-with-utm'
 * import { getUTMTags } from '@/lib/shopify/utm-tracking'
 *
 * export function ContactForm() {
 *   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
 *     e.preventDefault()
 *     const formData = new FormData(e.currentTarget)
 *
 *     // Get UTM tags from sessionStorage (client-side)
 *     const utmTags = getUTMTags()
 *
 *     // Add UTM tags as hidden form field
 *     formData.set('utmTags', JSON.stringify(utmTags))
 *
 *     const result = await submitContactFormWithUTM(formData)
 *     // Handle result...
 *   }
 * }
 * ```
 */
export async function submitContactFormWithUTM(
  formData: FormData
): Promise<ContactFormResult> {
  // ============================================================================
  // 1. Extract and Validate Form Data
  // ============================================================================

  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const storefront = formData.get('storefront') as string
  const inquiryType = formData.get('inquiryType') as string
  const message = formData.get('message') as string
  const subscribe = formData.get('subscribe') === 'true' || formData.get('subscribe') === 'on'

  // Get UTM tags from form (passed from client)
  const utmTagsJson = formData.get('utmTags') as string
  let utmTags: string[] = []
  if (utmTagsJson) {
    try {
      utmTags = JSON.parse(utmTagsJson)
    } catch (error) {
      console.warn('[Contact Form] Failed to parse UTM tags:', error)
    }
  }

  // Basic validation
  if (!email || !firstName || !storefront || !inquiryType) {
    return {
      success: false,
      error: 'Missing required fields. Please fill out all required fields.'
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Invalid email address. Please enter a valid email.'
    }
  }

  // ============================================================================
  // 2. Build Customer Tags
  // ============================================================================

  const tags: string[] = [
    // Location tag (from dealer/storefront selection)
    `location-${storefront}`,

    // Inquiry type tag
    `inquiry-${inquiryType}`,

    // Source tracking
    'source-contact-form',

    // Date tag (YYYY-MM format for temporal tracking)
    new Date().toISOString().slice(0, 7),

    // UTM attribution tags (if present)
    ...utmTags,

    // 'canada' when submitted on ca.kawaius.com (same US-store CRM)
    ...(await siteTags()),
  ]

  // ============================================================================
  // 3. Upsert Customer to Shopify
  // ============================================================================

  try {
    const customer = await upsertCustomer({
      email,
      firstName,
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      tags,
      ...(subscribe && {
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED' as const,
          marketingOptInLevel: 'SINGLE_OPT_IN' as const,
        }
      }),
      note: message ? `Contact form message: ${message}` : `Contact form submission from ${storefront} showroom`
    })

    console.log('[Contact Form] Customer synced to Shopify:', {
      customerId: customer.id,
      email: customer.email,
      tags: customer.tags,
      hasUTMs: utmTags.length > 0
    })

    // ============================================================================
    // 4. Meta CAPI — server-side Lead event (fire-and-forget)
    // ============================================================================

    const headersList = await headers()
    const sourceUrl = headersList.get('referer') ?? undefined

    sendMetaCAPIEvents([
      buildLeadEvent({
        email,
        ...(phone && { phone }),
        ...(sourceUrl && { sourceUrl }),
        dealerSlug: storefront,
        inquiryType,
      }),
    ]).catch((err) => console.error('[Contact Form] Meta CAPI error:', err))

    // ============================================================================
    // 5. Optional: Additional Integrations
    // ============================================================================

    // Send email notification
    // await sendEmailNotification({
    //   to: email,
    //   subject: 'Thank you for contacting KAWAI Piano',
    //   template: 'contact-confirmation',
    //   data: { firstName, storefront }
    // })

    // Post to Slack for sales team
    // await postToSlack({
    //   channel: 'leads',
    //   text: `New lead from ${storefront}: ${firstName} ${lastName} (${email})`,
    //   metadata: { inquiryType, hasUTMs: utmTags.length > 0 }
    // })

    // Track in analytics
    // await trackEvent({
    //   event: 'contact_form_submission',
    //   properties: {
    //     storefront,
    //     inquiryType,
    //     utmSource: utmTags.find(t => t.startsWith('utm-source-'))?.split('-')[2],
    //     utmMedium: utmTags.find(t => t.startsWith('utm-medium-'))?.split('-')[2]
    //   }
    // })

    return {
      success: true,
      customerId: customer.id
    }
  } catch (error) {
    // ============================================================================
    // 5. Error Handling
    // ============================================================================

    console.error('[Contact Form] Submission error:', error)

    // Handle Shopify CustomerError (validation errors)
    if (error instanceof CustomerError) {
      const mappedErrors = error.userErrors?.map(e => {
        const filteredField = e.field?.filter((f): f is string => typeof f === 'string')
        return {
          ...(filteredField && filteredField.length > 0 && { field: filteredField }),
          message: e.message
        }
      })
      return {
        success: false,
        error: 'Failed to submit form due to validation errors.',
        ...(mappedErrors && mappedErrors.length > 0 && { errors: mappedErrors })
      }
    }

    // Generic error (don't expose internal details)
    return {
      success: false,
      error: 'Failed to submit form. Please try again later.'
    }
  }
}

/**
 * Alternative: Simplified contact form without UTM tracking
 *
 * Use this if you don't need UTM attribution for a specific form.
 */
export async function submitContactFormSimple(
  formData: FormData
): Promise<ContactFormResult> {
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const storefront = formData.get('storefront') as string
  const inquiryType = formData.get('inquiryType') as string

  if (!email || !firstName || !storefront || !inquiryType) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    const customer = await upsertCustomer({
      email,
      firstName,
      tags: [
        `location-${storefront}`,
        `inquiry-${inquiryType}`,
        'source-contact-form',
        new Date().toISOString().slice(0, 7),
        ...(await siteTags()),
      ]
    })

    return { success: true, customerId: customer.id }
  } catch (error) {
    console.error('[Contact Form] Error:', error)
    return { success: false, error: 'Failed to submit form' }
  }
}
