import type { SaleHoursEntry, SaleStore } from './types'

/** The store's tel: link (digits only), or null when it has no phone. */
export const telHref = (store: Pick<SaleStore, 'phone'>) =>
  store.phone ? `tel:${store.phone.replace(/\D/g, '')}` : null

/** Shape of the storefront fields the template reads. Everything is optional in the CMS. */
export interface StorefrontLike {
  slug?: string | null
  locationName?: string | null
  showroomInfo?: { name?: string | null; address?: string | null; phone?: string | null } | null
  hours?: SaleHoursEntry[] | null
  calendlyUrl?: string | null
  showroomCtas?: {
    directionsText?: string | null
    directionsLink?: string | null
    scheduleText?: string | null
    scheduleLink?: string | null
  } | null
}

/**
 * The collection's own field defaults (src/collections/Storefronts.ts). A store
 * that never edited these still carries them, and neither points anywhere real
 * for that store: the directions default is a Lake St. Louis map query and the
 * schedule default is a path with no route behind it. Treated as unset.
 */
const DEFAULT_DIRECTIONS_LINK = 'https://maps.google.com/?q=Lake+St.+Louis+MO'
const DEFAULT_SCHEDULE_LINK = '/contact/schedule-visit'

/** Existing CTA labels — the collection defaults, not new copy. */
const DIRECTIONS_LABEL = 'Get Directions'
const SCHEDULE_LABEL = 'Schedule Visit'

const isHttp = (v: string) => /^https?:\/\//i.test(v)

/** The placeholder a campaign line uses for the store's place name. */
export const LOCATION_TOKEN = '{location}'

/** A campaign line with every `{location}` set to this store's place name. */
export const fillLocation = (text: string, store: Pick<SaleStore, 'location'>) =>
  text.replaceAll(LOCATION_TOKEN, store.location)

/**
 * Map a storefront record to the template's store identity.
 *
 * Booking target, in order: the store's Calendly URL, then a customised
 * `showroomCtas.scheduleLink`. With neither, `schedule` is null and the page
 * shows Call Now alone — a missing target is flagged, never invented.
 */
export function toSaleStore(storefront: StorefrontLike, slug: string): SaleStore {
  // Same fallback as Grand Spring: the showroom's own name, else the location.
  const name = storefront.showroomInfo?.name?.trim() || storefront.locationName?.trim() || slug
  const address = storefront.showroomInfo?.address?.trim() || null
  const phone = storefront.showroomInfo?.phone?.trim() || null
  const ctas = storefront.showroomCtas ?? {}

  const customDirections =
    ctas.directionsLink && ctas.directionsLink !== DEFAULT_DIRECTIONS_LINK ? ctas.directionsLink : null
  const directionsHref =
    customDirections ?? (address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : null)

  const calendly = storefront.calendlyUrl?.trim() || null
  const scheduleLink =
    ctas.scheduleLink && ctas.scheduleLink !== DEFAULT_SCHEDULE_LINK ? ctas.scheduleLink.trim() : null
  const scheduleHref = calendly ?? scheduleLink

  return {
    slug,
    name,
    location: storefront.locationName?.trim() || name,
    address,
    phone,
    hours: storefront.hours ?? [],
    directions: directionsHref
      ? { label: ctas.directionsText?.trim() || DIRECTIONS_LABEL, href: directionsHref }
      : null,
    schedule: scheduleHref
      ? {
          label: ctas.scheduleText?.trim() || SCHEDULE_LABEL,
          href: scheduleHref,
          external: isHttp(scheduleHref),
        }
      : null,
  }
}

/**
 * The store's Google Maps embed URL: the same Embed API "place" query the
 * store homepage's map uses (src/components/homepage/showroom-location.tsx),
 * on the storefront's own address. Null when there is no address or no key,
 * so the page drops the map rather than showing an empty or erroring frame.
 */
export function mapEmbedSrc(
  store: Pick<SaleStore, 'address'>,
  apiKey: string | null | undefined,
): string | null {
  if (!store.address || !apiKey) return null
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(store.address)}&zoom=15`
}
