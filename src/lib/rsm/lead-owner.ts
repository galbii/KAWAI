/**
 * Who owns a lead, as a label for CRM attribution (kawai-lead-rsm-holiday v2,
 * Nov 25, 2026): the HubSpot Find a Dealer form's hidden `rsm` field and the
 * Shopify customer's `rsm-*` tag carry the same label.
 *
 * The owner is whoever the lead notification is addressed to
 * (`resolveLeadRecipient`), so attribution can never disagree with who was
 * emailed:
 *
 *   rsm        matched RSM          → directory name, else the address
 *   canada     Canada west/east     → directory name, else 'Canada West' / 'Canada East'
 *   storefront Kawai showroom       → 'Kawai {Showroom}'
 *   fallback   unmatched / no geo   → directory name, else the address
 *   store      store holiday page   → 'Kawai {Store}' (the page's own inbox)
 *
 * Pure: no Payload, no env. Server-only by use (it reads the RSM directory):
 * labels are computed on the server and sent straight to HubSpot / Shopify,
 * never back to the browser.
 */
import type { LeadRecipient } from './lead-envelopes'
import { rsmNameFor } from './rsm-directory'

export type LeadOwner =
  | { kind: 'rsm'; email: string }
  | { kind: 'canada'; region: 'west' | 'east'; email: string }
  | { kind: 'storefront'; name: string; email: string }
  | { kind: 'fallback'; email: string }
  | { kind: 'store'; name: string }

/** 'Dallas' → 'Kawai Dallas'; a name that already says Kawai is kept. */
export function kawaiName(name: string): string {
  const n = name.trim()
  return /^kawai\b/i.test(n) ? n : `Kawai ${n}`
}

/** Map a resolved recipient (who gets the email) to its owner. */
export function ownerFromRecipient(
  recipient: LeadRecipient,
  { storefrontName, matchedRsmEmail }: { storefrontName?: string | null | undefined; matchedRsmEmail?: string | null | undefined },
): LeadOwner {
  if (recipient.kind === 'storefront') {
    return { kind: 'storefront', name: storefrontName?.trim() || recipient.to, email: recipient.to }
  }
  if (recipient.canadaOverride) {
    return { kind: 'canada', region: recipient.canadaRegion ?? 'west', email: recipient.to }
  }
  if (matchedRsmEmail && recipient.to === matchedRsmEmail) {
    return { kind: 'rsm', email: recipient.to }
  }
  return { kind: 'fallback', email: recipient.to }
}

/** The owner's label for HubSpot `rsm` / the Shopify tag. '' only when there is no address at all. */
export function leadOwnerLabel(owner: LeadOwner): string {
  switch (owner.kind) {
    case 'store':
      return kawaiName(owner.name)
    case 'storefront':
      return kawaiName(owner.name)
    case 'canada':
      return rsmNameFor(owner.email) ?? (owner.region === 'east' ? 'Canada East' : 'Canada West')
    case 'rsm':
    case 'fallback':
      return rsmNameFor(owner.email) ?? owner.email.trim()
  }
}

/** Shopify tags are capped at 255 characters. */
const SHOPIFY_TAG_MAX = 255

/**
 * 'Jane Doe' → 'rsm-jane-doe'; 'Kawai St. Louis' → 'rsm-kawai-st-louis';
 * 'jdoe@kawaius.com' → 'rsm-jdoe-kawaius-com'. Null for an empty label.
 */
export function rsmShopifyTag(label: string | null | undefined): string | null {
  const slug = (label ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (!slug) return null
  return `rsm-${slug}`.slice(0, SHOPIFY_TAG_MAX).replace(/-+$/, '')
}

/** Applied to every lead that lands in an official showroom's area. */
export const STOREFRONT_LEAD_TAG = 'storefront-lead'

/**
 * The Shopify tags one routed lead earns: showroom slug + `storefront-lead`
 * (when a showroom is in range), `dealer-{slug}` for the nearest dealer, and
 * `rsm-{owner}` for whoever the lead was routed to.
 */
export function leadAttributionTags({
  storefrontSlug,
  nearestDealerSlug,
  owner,
}: {
  storefrontSlug?: string | null | undefined
  nearestDealerSlug?: string | null | undefined
  owner: LeadOwner
}): string[] {
  const ownerTag = rsmShopifyTag(leadOwnerLabel(owner))
  return [
    ...(storefrontSlug ? [storefrontSlug, STOREFRONT_LEAD_TAG] : []),
    ...(nearestDealerSlug ? [`dealer-${nearestDealerSlug}`] : []),
    ...(ownerTag ? [ownerTag] : []),
  ]
}
