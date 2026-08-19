'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'
import { siteTags } from '@/lib/shopify/site-tags'

/**
 * Newsletter Popup Signup Server Action
 *
 * Creates or updates a Shopify customer from the newsletter popup modal.
 * Always applies the 'newsletter' tag + any custom tags configured in the CMS.
 *
 * @example
 * ```tsx
 * const result = await submitNewsletterPopupSignup(null, formData)
 * ```
 */

const newsletterPopupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  customTags: z.string().optional(), // Comma-separated tags from Payload CMS block config
})

export interface NewsletterPopupSignupResult {
  success: boolean
  message: string
}

export async function submitNewsletterPopupSignup(
  prevState: NewsletterPopupSignupResult | null,
  formData: FormData,
): Promise<NewsletterPopupSignupResult> {
  const parsed = newsletterPopupSchema.safeParse({
    email: formData.get('email')?.toString() || '',
    firstName: formData.get('firstName')?.toString() || undefined,
    lastName: formData.get('lastName')?.toString() || undefined,
    customTags: formData.get('customTags')?.toString() || undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid submission.',
    }
  }

  const isShopifyAdminEnabled =
    process.env.SHOPIFY_APP_API_KEY &&
    process.env.SHOPIFY_APP_CLIENT_SECRET &&
    process.env.SHOPIFY_STORE_DOMAIN

  if (!isShopifyAdminEnabled) {
    console.error('[Newsletter Popup] Shopify Admin API not configured')
    return { success: false, message: 'Service unavailable. Please try again later.' }
  }

  const { email, firstName, lastName, customTags } = parsed.data

  // Always tag with 'newsletter' + source, then any CMS-configured custom tags
  const tags: string[] = ['newsletter', 'source-newsletter-popup']

  if (customTags) {
    const extras = customTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    tags.push(...extras)
  }

  // 'canada' when submitted on ca.kawaius.com (same US-store CRM)
  tags.push(...(await siteTags()))

  try {
    await upsertCustomer({
      email,
      ...(firstName && firstName.trim() ? { firstName: firstName.trim() } : {}),
      ...(lastName && lastName.trim() ? { lastName: lastName.trim() } : {}),
      tags,
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    })

    console.log('[Newsletter Popup] Subscribed:', email, { tags })

    return { success: true, message: "You're subscribed! Welcome to the Kawai community." }
  } catch (err) {
    console.error('[Newsletter Popup] Shopify error:', err)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}
