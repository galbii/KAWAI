'use server'

/**
 * Lead Funnel — server actions
 *
 * Powers the modular <LeadFunnelPopup>. Three actions, one per funnel step
 * that touches the backend:
 *
 *   1. submitLeadContact   — step 1: upsert the lead into Shopify with email
 *                            marketing consent + source tags.
 *   2. findNearestDealers  — step 2: geocode a ZIP and return the 5 nearest
 *                            active dealers (haversine), slimmed for the client.
 *   3. attachDealerToLead  — step 2 selection: tag the Shopify customer with
 *                            the chosen dealer for routing.
 *
 * Reuses existing infrastructure: upsertCustomer (Shopify Admin),
 * geocodeZipCode + searchDealers (dealer locator), getPayloadClient (Local API).
 */

import { z } from 'zod'
import { unstable_cache } from 'next/cache'
import { upsertCustomer } from '@/lib/shopify/customers'
import { getPayloadClient } from '@/lib/payload/queries'
import { geocodeZipCode, searchDealers } from '@/lib/utils/dealer-search'
import type { Dealer } from '@/payload-types'
import type { NearestDealer } from '@/components/lead-funnel/types'

// ─── Shared helpers ──────────────────────────────────────────────────────────

function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_APP_API_KEY &&
      process.env.SHOPIFY_APP_CLIENT_SECRET &&
      process.env.SHOPIFY_STORE_DOMAIN,
  )
}

/** Normalize a free-text tag string ("a, b") into a clean array. */
function parseTags(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

// ─── 1. Submit contact (step 1) ──────────────────────────────────────────────

const contactSchema = z.object({
  firstName: z.string().min(1, 'Please enter your first name'),
  lastName: z.string().min(1, 'Please enter your last name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  consent: z
    .string()
    .refine((v) => v === 'true', 'Please agree to receive marketing communications'),
  /** Comma-separated source tags from the funnel config. */
  customTags: z.string().optional(),
})

export interface LeadContactResult {
  success: boolean
  message: string
}

export async function submitLeadContact(formData: FormData): Promise<LeadContactResult> {
  const parsed = contactSchema.safeParse({
    firstName: formData.get('firstName')?.toString() ?? '',
    lastName: formData.get('lastName')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    phone: formData.get('phone')?.toString() ?? '',
    consent: formData.get('consent')?.toString() ?? '',
    customTags: formData.get('customTags')?.toString() ?? undefined,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid submission.' }
  }

  if (!isShopifyConfigured()) {
    console.error('[Lead Funnel] Shopify Admin API not configured')
    return { success: false, message: 'Service unavailable. Please try again later.' }
  }

  const { firstName, lastName, email, phone, customTags } = parsed.data

  const tags = ['lead-funnel', 'newsletter', ...parseTags(customTags)]

  try {
    await upsertCustomer({
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      tags,
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
      },
    })

    console.log('[Lead Funnel] Lead captured:', email, { tags })
    return { success: true, message: 'Got it!' }
  } catch (err) {
    console.error('[Lead Funnel] Shopify upsert error:', err)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}

// ─── 2. Find nearest dealers (step 2) ────────────────────────────────────────

/**
 * Cached loader for active dealers with the slim fields the locator needs.
 * Tagged 'dealers' so the existing dealer revalidation busts it.
 */
const getActiveDealersForFunnel = unstable_cache(
  async (): Promise<Dealer[]> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'dealers',
        where: { isActive: { equals: true } },
        select: {
          dealerName: true,
          slug: true,
          address: true,
          coordinates: true,
          contactInfo: true,
          isActive: true,
          isFeatured: true,
        },
        depth: 0,
        limit: 1000,
      })
      return result.docs as Dealer[]
    } catch (err) {
      console.error('[Lead Funnel] Failed to load dealers:', err)
      return []
    }
  },
  ['lead-funnel-active-dealers'],
  { tags: ['dealers'], revalidate: 3600 },
)

const zipSchema = z
  .string()
  .trim()
  .min(3, 'Please enter a valid ZIP or postal code')
  .max(10, 'Please enter a valid ZIP or postal code')

export interface NearestDealersResult {
  success: boolean
  message: string
  dealers: NearestDealer[]
}

export async function findNearestDealers(zip: string): Promise<NearestDealersResult> {
  const parsed = zipSchema.safeParse(zip)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? 'Invalid ZIP code.',
      dealers: [],
    }
  }

  const coords = await geocodeZipCode(parsed.data)
  if (!coords) {
    return {
      success: false,
      message: "We couldn't find that ZIP code. Please double-check and try again.",
      dealers: [],
    }
  }

  const dealers = await getActiveDealersForFunnel()
  if (dealers.length === 0) {
    return { success: false, message: 'No dealers are available right now.', dealers: [] }
  }

  // searchDealers sorts by distance when fromCoordinates is provided. No
  // maxDistance cap so we always surface the 5 closest (nationwide fallback).
  const results = searchDealers(dealers, '', {
    fromCoordinates: { lat: coords.lat, lng: coords.lng },
  }).slice(0, 5)

  const nearest: NearestDealer[] = results.map(({ dealer, distance }) => ({
    slug: dealer.slug,
    dealerName: dealer.dealerName,
    city: dealer.address?.city ?? null,
    state: dealer.address?.state ?? null,
    phone: dealer.contactInfo?.phone ?? null,
    distance: Math.round((distance ?? 0) * 10) / 10,
  }))

  return { success: true, message: '', dealers: nearest }
}

// ─── 3. Attach chosen dealer to lead (step 2 selection) ──────────────────────

const attachSchema = z.object({
  email: z.string().email(),
  dealerSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
})

export interface AttachDealerResult {
  success: boolean
}

export async function attachDealerToLead(
  email: string,
  dealerSlug: string,
): Promise<AttachDealerResult> {
  const parsed = attachSchema.safeParse({ email, dealerSlug })
  if (!parsed.success || !isShopifyConfigured()) {
    return { success: false }
  }

  try {
    // upsertCustomer appends tags (does not replace), so this adds the dealer
    // routing tag to the lead created in step 1.
    await upsertCustomer({
      email: parsed.data.email,
      tags: [`dealer-${parsed.data.dealerSlug}`],
    })
    console.log('[Lead Funnel] Dealer attached:', parsed.data.email, parsed.data.dealerSlug)
    return { success: true }
  } catch (err) {
    console.error('[Lead Funnel] Failed to attach dealer:', err)
    return { success: false }
  }
}
