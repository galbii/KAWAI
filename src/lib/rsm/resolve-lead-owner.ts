/**
 * Route a lead's ZIP to its owner — the one implementation behind the lead
 * notification email, the HubSpot `rsm` field and the Shopify `rsm-*` tag
 * (kawai-lead-rsm-holiday v2, Nov 25, 2026), so the three can never disagree.
 *
 * Server-only (Payload Local API, access-restricted `rsmEmail`). Never import
 * from a client component. Nothing here is a server action; the callers are.
 */
import { geocodeZipCode } from '@/lib/utils/dealer-search'
import {
  classifyLeadCountry,
  findNearestRsm,
  getDealersForRsmRouting,
  matchStorefrontForLead,
  rankRsmCandidates,
  type RankedDealer,
  type RsmMatch,
} from '@/lib/rsm/routing'
import type { NearbyStorefrontOption } from '@/lib/rsm/nearby-storefront'
import { isStorefrontEmailEnabled, resolveLeadRecipient, type LeadRecipient } from '@/lib/rsm/lead-envelopes'
import { holidayStoreFor } from '@/app/(frontend)/store/[storeslug]/holiday-sale-event/store-inbox'
import { leadOwnerLabel, ownerFromRecipient, type LeadOwner } from '@/lib/rsm/lead-owner'

export interface LeadRoute {
  /** Null when the ZIP could not be geocoded (the lead then goes to Canada / fallback). */
  coords: { lat: number; lng: number } | null
  /** RSM-routable dealers, nearest first. */
  ranked: RankedDealer[]
  match: RsmMatch | null
  storefront: NearbyStorefrontOption | null
  /** Who the notification email is addressed to. */
  recipient: LeadRecipient
  /** Who the lead is attributed to (HubSpot `rsm`, Shopify tag). */
  owner: LeadOwner
}

/**
 * The unmatched-lead inbox. `||`, not `??`: a present-but-blank env var is an
 * empty string that `??` would pass through as a '' recipient.
 */
export function leadFallbackInbox(fromAddress: string | undefined = process.env.RESEND_FROM_EMAIL): string {
  return process.env.LEAD_NOTIFY_FALLBACK_EMAIL?.trim() || fromAddress || ''
}

/** A store holiday page's own owner ('Kawai Dallas'), or null for any other slug. */
function storeOwnerFor(storeSlug: string | undefined): LeadOwner | null {
  const store = storeSlug ? holidayStoreFor(storeSlug) : null
  return store ? { kind: 'store', name: store.name } : null
}

/**
 * Geocode → nearest same-country RSM dealer → storefront area → recipient
 * (storefront / Canada west-east / matched RSM / fallback) → owner.
 *
 * `storeSlug` (a store holiday page) overrides only the OWNER: those leads go
 * to the page's store inbox, so they are attributed to that store. The
 * location facts (storefront, nearest dealer) are still computed for tags.
 */
export async function routeLead(
  zip: string,
  { fallback = leadFallbackInbox(), storeSlug }: { fallback?: string; storeSlug?: string | undefined } = {},
): Promise<LeadRoute> {
  let ranked: RankedDealer[] = []
  let match: RsmMatch | null = null
  let storefront: NearbyStorefrontOption | null = null
  const coords = await geocodeZipCode(zip)
  if (coords) {
    const [dealers, sf] = await Promise.all([getDealersForRsmRouting(), matchStorefrontForLead(coords, zip)])
    ranked = rankRsmCandidates(dealers, coords, classifyLeadCountry(zip))
    match = findNearestRsm(ranked)
    storefront = sf
  }

  const recipient = resolveLeadRecipient({
    zip,
    storefrontEmail: storefront?.email,
    storefrontRouting: isStorefrontEmailEnabled(),
    matchedRsmEmail: match?.rsmEmail,
    fallback,
  })
  const owner =
    storeOwnerFor(storeSlug) ??
    ownerFromRecipient(recipient, { storefrontName: storefront?.name, matchedRsmEmail: match?.rsmEmail })

  return { coords, ranked, match, storefront, recipient, owner }
}

/** Just the owner. A store holiday page answers without geocoding. */
export async function resolveLeadOwner(zip: string, { storeSlug }: { storeSlug?: string | undefined } = {}): Promise<LeadOwner> {
  return storeOwnerFor(storeSlug) ?? (await routeLead(zip)).owner
}

/** The owner's label for HubSpot `rsm`, or null when there is none. */
export async function resolveLeadOwnerLabel(
  zip: string,
  options: { storeSlug?: string | undefined } = {},
): Promise<string | null> {
  return leadOwnerLabel(await resolveLeadOwner(zip, options)) || null
}
