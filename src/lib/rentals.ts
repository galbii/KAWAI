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

/**
 * Models Kawai stores regularly have available to rent. Matched against the
 * product catalogue by `model`; a store can replace the list in the admin.
 */
export const DEFAULT_RENTAL_MODELS: readonly string[] = ['GL-10', 'K-300', 'K-15', 'CN201', 'CA401']

export interface FeaturedFinish {
  name: string
  /** Catalogue model the finish is shown on, e.g. 'GL-10'. Empty = unspecified. */
  model: string
  description: string
  /** Variant name to borrow a product photo from, e.g. /snow white/i. */
  variantMatch: string | null
  /** Bundled photo for finishes the catalogue has no image of. */
  defaultImage: string | null
  /** Show "contact the store for availability" instead of a stock promise. */
  contactForAvailability: boolean
  /** Panel colour when there is no photo. */
  swatch: string
}

/** Finishes each store features — the fallback when a store hasn't set its own. */
export const DEFAULT_FEATURED_FINISHES: readonly FeaturedFinish[] = [
  {
    name: 'Snow White',
    model: 'GL-10',
    description: 'A polished white baby grand that lights up any room.',
    variantMatch: 'snow white',
    defaultImage: null,
    contactForAvailability: false,
    swatch: '#F4F2EE',
  },
  {
    name: 'Ferrari Red',
    model: 'GL-10',
    description: 'The GL-10 baby grand in Ferrari red — available in limited numbers.',
    variantMatch: 'red',
    // Not a Shopify variant, so the photo ships with the site.
    defaultImage: '/images/rentals/gl10-ferrari-red.webp',
    contactForAvailability: true,
    swatch: '#C8102E',
  },
]

/** Swatch for a finish name a store typed in — red finishes get the red panel. */
export function finishSwatch(name: string): string {
  if (/red|rosso|ferrari/i.test(name)) return '#C8102E'
  if (/white|snow|ivory/i.test(name)) return '#F4F2EE'
  return '#1E1B16'
}

/** Broad type from a model code: GL-10 → grand, K-300 → upright, CN201 → digital. */
export function rentalPianoTypeOfModel(model: string): 'grand' | 'upright' | 'digital' | null {
  if (/^(GL|GX|SK|RX)/i.test(model)) return 'grand'
  if (/^(K-|ND|ST|HM)/i.test(model)) return 'upright'
  if (/^(CN|CA|CX|ES|KDP|NV)/i.test(model)) return 'digital'
  return null
}

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
  /** Model or finish the visitor asked about — prefilled into the message. */
  interest?: string | null,
): string {
  const params = new URLSearchParams()
  if (type && type !== 'monthly') params.set('type', type)
  if (piano) params.set('piano', piano)
  if (interest) params.set('interest', interest)
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
