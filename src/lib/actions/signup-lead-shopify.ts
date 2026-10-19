'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'
import { siteTags } from '@/lib/shopify/site-tags'
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import { matchStorefrontForLead } from '@/lib/rsm/routing'

/** Applied to every lead that lands in an official showroom's area. */
const STOREFRONT_LEAD_TAG = 'storefront-lead'

/**
 * Tags that put a lead in its nearest Kawai showroom's Shopify segment: the
 * storefront slug (the same tag the storefront contact form writes, e.g.
 * "st-louis") plus a generic `storefront-lead`. Empty when no showroom is in
 * range. Never throws — a failed lookup just means no showroom tag.
 */
async function storefrontTags(zip: string | undefined): Promise<string[]> {
  if (!zip) return []
  try {
    const coords = await geocodeZipCode(zip)
    if (!coords) return []
    const storefront = await matchStorefrontForLead(coords, zip)
    return storefront ? [storefront.slug, STOREFRONT_LEAD_TAG] : []
  } catch (err) {
    console.error('[signup-lead-shopify] Storefront lookup failed:', err)
    return []
  }
}

/**
 * Signup offer lead → Shopify upsert (additive to the HubSpot submission).
 *
 * The /signup + /signup2 offer modals submit to HubSpot as their primary CRM
 * (see {@link TwoStepHubSpotForm}). This action mirrors that lead into Shopify
 * via {@link upsertCustomer} — the same `customerSet`-style upsert the rest of
 * the site uses — so an offer signup also becomes a tagged Shopify customer.
 *
 * Called fire-and-forget from the form's `onComplete` hook: it never throws and
 * always resolves to a result object, so a Shopify hiccup can never block or
 * fail the HubSpot submission the visitor is actually waiting on.
 */

const leadSchema = z.object({
  firstname: z.string().trim().optional(),
  lastname: z.string().trim().optional(),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  zip: z.string().trim().optional(),
})

function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_APP_API_KEY &&
      process.env.SHOPIFY_APP_CLIENT_SECRET &&
      process.env.SHOPIFY_STORE_DOMAIN,
  )
}

/**
 * Upsert an offer-form lead into Shopify.
 *
 * @param values - Raw HubSpot form values (firstname/lastname/email/phone/zip).
 * @param tags   - Source/campaign tags to attach (e.g. ['summer-savings-event']).
 * @returns `{ success }` — never rejects; failures are logged and swallowed.
 */
export async function upsertSignupLeadToShopify(
  values: Record<string, string>,
  tags: string[] = [],
): Promise<{ success: boolean }> {
  try {
    if (!isShopifyConfigured()) {
      console.error('[signup-lead-shopify] Shopify Admin API not configured — skipping upsert')
      return { success: false }
    }

    const parsed = leadSchema.safeParse(values)
    if (!parsed.success) {
      console.error('[signup-lead-shopify] Invalid lead payload:', parsed.error.issues)
      return { success: false }
    }

    const { firstname, lastname, email, phone, zip } = parsed.data
    // siteTags() adds 'canada' when submitted on ca.kawaius.com (same US-store CRM)
    const [site, storefront] = await Promise.all([siteTags(), storefrontTags(zip)])
    const mergedTags = [
      ...new Set([...tags.map((t) => t.trim()).filter(Boolean), ...site, ...storefront]),
    ]

    await upsertCustomer({
      email,
      ...(firstname ? { firstName: firstname } : {}),
      ...(lastname ? { lastName: lastname } : {}),
      ...(phone ? { phone } : {}),
      tags: mergedTags,
      // Submitting the offer form is an opt-in to the savings program.
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED' as const,
        marketingOptInLevel: 'SINGLE_OPT_IN' as const,
      },
      note: zip ? `Signup offer lead — ZIP ${zip}` : 'Signup offer lead',
    })

    return { success: true }
  } catch (err) {
    // Fire-and-forget contract: log, never throw — HubSpot is the primary CRM.
    console.error('[signup-lead-shopify] Upsert failed:', err)
    return { success: false }
  }
}
