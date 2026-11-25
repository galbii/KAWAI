'use server'

import { z } from 'zod'
import { upsertCustomer } from '@/lib/shopify/customers'
import { siteTags } from '@/lib/shopify/site-tags'
import { routeLead } from '@/lib/rsm/resolve-lead-owner'
import { leadAttributionTags } from '@/lib/rsm/lead-owner'

/**
 * Tags that attribute a lead to a location and an owner, from one routing of
 * its ZIP (src/lib/rsm/resolve-lead-owner.ts — the same routing the lead
 * notification email and the HubSpot `rsm` field use):
 *
 *   - Showroom: the storefront slug (the same tag the storefront contact form
 *     writes, e.g. "st-louis") plus a generic `storefront-lead`, when an
 *     official Kawai showroom is in range.
 *   - Dealer: `dealer-{slug}` for the nearest brick-and-mortar dealer — the
 *     same dealer pool the RSM notification routes on, and the same tag format
 *     the lead funnel's dealer picker writes, so per-dealer lead counts can be
 *     read straight off Shopify customer tags.
 *   - Owner (kawai-lead-rsm-holiday v2): `rsm-{owner}` for whoever the lead is
 *     routed to — the RSM's name (or address when no name is on file), the
 *     Canada region, the showroom, the fallback inbox, or on a store holiday
 *     page that store ("rsm-kawai-dallas").
 *
 * Never throws — a failed lookup just means fewer tags.
 */
async function leadRoutingTags(
  zip: string | undefined,
  storeSlug?: string | undefined,
): Promise<string[]> {
  if (!zip) return []
  try {
    const route = await routeLead(zip, { storeSlug })
    return leadAttributionTags({
      storefrontSlug: route.storefront?.slug,
      nearestDealerSlug: route.ranked[0]?.dealer.slug,
      owner: route.owner,
    })
  } catch (err) {
    console.error('[signup-lead-shopify] Location lookup failed:', err)
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
 * @param options.storeSlug - A store holiday page's slug: the lead is
 *                 attributed (`rsm-*` tag) to that store, whose inbox it goes to.
 * @returns `{ success }` — never rejects; failures are logged and swallowed.
 */
export async function upsertSignupLeadToShopify(
  values: Record<string, string>,
  tags: string[] = [],
  options: { storeSlug?: string } | null = {},
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
    const [site, location] = await Promise.all([
      siteTags(),
      leadRoutingTags(zip, typeof options?.storeSlug === 'string' ? options.storeSlug.slice(0, 100) : undefined),
    ])
    const mergedTags = [
      ...new Set([...tags.map((t) => t.trim()).filter(Boolean), ...site, ...location]),
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
