'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'

/**
 * Simple Customer Signup Server Action
 *
 * Creates or updates a Shopify customer with minimal information (email, firstName, lastName).
 * Tracks dealer location via tags and applies custom tags from CMS.
 *
 * @example
 * ```tsx
 * // From a form component
 * const result = await submitSimpleCustomerSignup(null, formData)
 * ```
 */

// Validation schema for simple customer signup
const simpleSignupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  storefrontSlug: z.string().min(1, 'Storefront location is required'),
  customTags: z.string().optional() // Comma-separated tags from Payload CMS
})

type SimpleSignupData = z.infer<typeof simpleSignupSchema>

interface SignupResult {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/**
 * Main server action for handling simple customer signup
 *
 * @param prevState - Previous form state (for useFormState)
 * @param formData - Form data from submission
 * @returns Result with success status and message
 */
export async function submitSimpleCustomerSignup(
  prevState: SignupResult | null,
  formData: FormData
): Promise<SignupResult> {
  try {
    // Extract form data
    const rawData = {
      firstName: formData.get('firstName')?.toString() || '',
      lastName: formData.get('lastName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      storefrontSlug: formData.get('storefrontSlug')?.toString() || '',
      customTags: formData.get('customTags')?.toString() || ''
    }

    // Validate the data
    const validationResult = simpleSignupSchema.safeParse(rawData)

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        errors[path] = issue.message
      })

      return {
        success: false,
        message: 'Please check the form for errors',
        errors
      }
    }

    const signupData = validationResult.data

    // Check if Shopify Admin API is configured
    const isShopifyAdminEnabled =
      process.env.SHOPIFY_APP_API_KEY &&
      process.env.SHOPIFY_APP_CLIENT_SECRET &&
      process.env.SHOPIFY_STORE_DOMAIN

    if (!isShopifyAdminEnabled) {
      console.error('[Simple Signup] Shopify Admin API not configured')
      return {
        success: false,
        message: 'Service unavailable. Please try again later or contact support.'
      }
    }

    try {
      // Build tags array: location slug + custom tags from CMS
      const tags: string[] = []

      // Add location tag (storefront slug)
      tags.push(signupData.storefrontSlug)

      // Parse and add custom tags if provided
      if (signupData.customTags) {
        const customTagsArray = signupData.customTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
        tags.push(...customTagsArray)
      }

      // Create or update customer in Shopify using optimized upsert
      // This handles both new and existing customers in ONE API call
      const customer = await upsertCustomer({
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        tags, // Location slug + custom tags
      })

      console.log(
        `[Simple Signup] Successfully created/updated customer ${signupData.email}`,
        {
          tags,
          storefrontSlug: signupData.storefrontSlug
        }
      )

      return {
        success: true,
        message: 'Thank you for signing up! We\'ll be in touch soon.'
      }

    } catch (error) {
      console.error('[Simple Signup] Shopify Admin API error:', error)

      return {
        success: false,
        message: 'Failed to complete signup. Please try again.',
        errors: {
          shopify: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      }
    }

  } catch (error) {
    console.error('[Simple Signup] Unexpected error:', error)

    return {
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.'
    }
  }
}
