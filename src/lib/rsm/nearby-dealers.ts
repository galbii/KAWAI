/**
 * Public-safe nearest-dealer projection + the visitor's post-submit choice.
 *
 * Dealer docs loaded for RSM routing carry the access-restricted `rsmEmail`, so
 * nothing out of that pipeline may reach the browser unprojected. Every dealer
 * a visitor sees passes through `toNearbyDealerOption`, which whitelists display
 * fields — `rsmEmail` has no route through it.
 *
 * Shared by the client modal, the public `getNearbyDealersForLead` action and
 * the email builder, so the list the visitor picks from is provably the same
 * list the RSM is shown.
 *
 * Pure types + mapping — safe to import from client components.
 */

import type { Dealer } from '@/payload-types'
import type { RankedDealer } from '@/lib/rsm/routing'

/** How many dealers the visitor picks from. The RSM email lists none of them. */
export const NEARBY_DEALER_COUNT = 5

/** One dealer as shown to the visitor and listed in the RSM email. */
export interface NearbyDealerOption {
  id: string
  name: string
  slug: string
  /** "St. Louis, MO" — prebuilt so consumers don't re-derive it. */
  location: string
  street: string
  city: string
  state: string
  zipCode: string
  phone: string | null
  /** Public dealer inbox — the address CC'd when the visitor picks this dealer. */
  email: string | null
  website: string | null
  /** Miles from the lead's ZIP, rounded to one decimal. */
  distance: number
  /**
   * Map pin position. Already public — /find-a-dealer plots every dealer from
   * the same coordinates. Null when the dealer was never geocoded, which the
   * routing filter excludes anyway.
   */
  latitude: number | null
  longitude: number | null
  shigeru: boolean
  acoustic: boolean
  digital: boolean
  professional: boolean
}

/**
 * What the visitor picked in the post-submit dealer modal.
 * Omit entirely when the modal flow didn't run (legacy submissions).
 */
export type LeadDealerChoice =
  | { kind: 'selected'; dealer: NearbyDealerOption }
  | { kind: 'unsure' }

/** Whitelist a routing `Dealer` down to the fields safe to send to a browser. */
export function toNearbyDealerOption(dealer: Dealer, distance: number): NearbyDealerOption {
  return {
    id: dealer.id,
    name: dealer.dealerName,
    slug: dealer.slug,
    location: [dealer.address?.city, dealer.address?.state].filter(Boolean).join(', '),
    street: dealer.address?.street ?? '',
    city: dealer.address?.city ?? '',
    state: dealer.address?.state ?? '',
    zipCode: dealer.address?.zipCode ?? '',
    phone: dealer.contactInfo?.phone ?? null,
    email: dealer.contactInfo?.email ?? null,
    website: dealer.contactInfo?.website ?? null,
    distance: Math.round(distance * 10) / 10,
    latitude: dealer.coordinates?.latitude ?? null,
    longitude: dealer.coordinates?.longitude ?? null,
    shigeru: dealer.shigeruKawaiDealer === true,
    acoustic: dealer.acousticPianoDealer === true,
    digital: dealer.digitalPianoDealer === true,
    professional: dealer.professionalProductDealer === true,
  }
}

/** Top-N ranked dealers, projected for the browser and the email. */
export function toNearbyDealerOptions(
  ranked: RankedDealer[],
  count: number = NEARBY_DEALER_COUNT,
): NearbyDealerOption[] {
  return ranked.slice(0, count).map(({ dealer, distance }) => toNearbyDealerOption(dealer, distance))
}

/**
 * Resolve a visitor-supplied dealer id against the options actually offered.
 *
 * The id arrives from the browser, so it is never trusted as a lookup key into
 * the dealer collection — an id outside the offered set degrades to "unsure"
 * rather than pulling an arbitrary dealer's contact details into a CC.
 */
export function resolveDealerChoice(
  options: NearbyDealerOption[],
  dealerId: string | null | undefined,
): LeadDealerChoice {
  if (!dealerId) return { kind: 'unsure' }
  const dealer = options.find((o) => o.id === dealerId)
  return dealer ? { kind: 'selected', dealer } : { kind: 'unsure' }
}

/**
 * The dealer inbox that should receive its own lead notification.
 *
 * Kept separate from the send so the test tool can *report* the address without
 * the dealer ever being emailed. Null when the visitor was unsure or the chosen
 * dealer has no public email on file — in both cases only the RSM is notified.
 */
export function dealerNotifyAddress(choice: LeadDealerChoice | undefined): string | null {
  if (choice?.kind !== 'selected') return null
  return choice.dealer.email ?? null
}
