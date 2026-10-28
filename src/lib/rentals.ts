/**
 * Shared copy + helpers for the storefront rental program. Used by the
 * Storefronts schema (field defaults), the storefront rental section, and the
 * /store/[storeslug]/rentals inquiry page, so the program's selling points
 * read the same everywhere.
 */

/**
 * Key benefits supplied by Kawai. Also the fallback for storefronts saved
 * before the `rentalHighlights` field existed (no key in Mongo → empty array).
 */
export const DEFAULT_RENTAL_HIGHLIGHTS: readonly string[] = [
  'Brand-new acoustic and digital pianos are available for rental — exclusively through Kawai-owned stores.',
  'If you decide to purchase your rental piano, the first six months of rental fees can be applied toward the down payment.',
  'Visit the showroom to compare models and choose the instrument that best fits your needs.',
  'An ideal option for those who are beginning their musical journey.',
  'A great way to start — try renting first and experience the quality of Kawai.',
]

export const DEFAULT_RENTAL_CTA_TEXT = 'Schedule a Rental'

/** Values for the inquiry form's "rental type" select. */
export const RENTAL_TYPES = ['monthly', 'event', 'facility'] as const
export type RentalType = (typeof RENTAL_TYPES)[number]

export const RENTAL_TYPE_LABELS: Record<RentalType, string> = {
  monthly: 'Monthly home rental',
  event: 'Event rental (concert, recital, wedding…)',
  facility: 'Facility / venue rental',
}

export const RENTAL_PIANO_TYPES = ['upright', 'grand', 'digital', 'unsure'] as const
export type RentalPianoType = (typeof RENTAL_PIANO_TYPES)[number]

export const RENTAL_PIANO_TYPE_LABELS: Record<RentalPianoType, string> = {
  upright: 'Acoustic upright',
  grand: 'Acoustic grand',
  digital: 'Digital piano',
  unsure: 'Not sure yet — help me choose',
}

/** Anchor of the inquiry form on the rentals page. */
export const RENTAL_INQUIRY_ANCHOR = 'inquiry'

export function rentalInquiryHref(
  storeslug: string,
  type?: RentalType,
  piano?: RentalPianoType | null,
): string {
  const params = new URLSearchParams()
  if (type && type !== 'monthly') params.set('type', type)
  if (piano) params.set('piano', piano)
  const query = params.size > 0 ? `?${params.toString()}` : ''
  return `/store/${storeslug}/rentals${query}#${RENTAL_INQUIRY_ANCHOR}`
}

/** Form value for a rate's category, when the form offers it. */
export function rentalPianoTypeOf(category: string | null): RentalPianoType | null {
  return category && (RENTAL_PIANO_TYPES as readonly string[]).includes(category)
    ? (category as RentalPianoType)
    : null
}

/** Highlights to render: the store's own list, or Kawai's defaults when empty. */
export function resolveRentalHighlights(
  highlights: Array<{ text?: string | null }> | null | undefined,
): string[] {
  const own = (highlights ?? [])
    .map((h) => h.text?.trim() ?? '')
    .filter((t) => t.length > 0)
  return own.length > 0 ? own : [...DEFAULT_RENTAL_HIGHLIGHTS]
}
