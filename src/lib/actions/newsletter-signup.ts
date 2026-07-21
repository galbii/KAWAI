'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'
import { getSite } from '@/lib/site-context'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  storefrontSlug: z.string().optional(),
})

export interface NewsletterSignupResult {
  success: boolean
  message: string
}

export async function submitNewsletterSignup(
  prevState: NewsletterSignupResult | null,
  formData: FormData,
): Promise<NewsletterSignupResult> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get('email')?.toString() || '',
    storefrontSlug: formData.get('storefrontSlug')?.toString() || undefined,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid email address.' }
  }

  const { email, storefrontSlug } = parsed.data

  const isShopifyAdminEnabled =
    process.env.SHOPIFY_APP_API_KEY &&
    process.env.SHOPIFY_APP_CLIENT_SECRET &&
    process.env.SHOPIFY_STORE_DOMAIN

  if (!isShopifyAdminEnabled) {
    console.error('[Newsletter Signup] Shopify Admin API not configured')
    return { success: false, message: 'Service unavailable. Please try again later.' }
  }

  const tags = ['footer-newsletter', 'source-footer']
  if (storefrontSlug) tags.push(storefrontSlug)

  // Signups from ca.kawaius.com go to the same US-store CRM — mark them so
  // Canadian leads are distinguishable.
  const site = await getSite()
  if (site === 'cad') tags.push('canada')

  try {
    await upsertCustomer({
      email,
      tags,
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    })

    return { success: true, message: "You're subscribed! Thank you for joining." }
  } catch (err) {
    console.error('[Newsletter Signup] Shopify error:', err)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}
