import type { Dealer, Storefront } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { unstable_cache } from 'next/cache'
import { DealerFinderClient } from '@/app/(frontend)/find-a-dealer/DealerFinderClient'
import type { DealerWithDistance } from '@/app/(frontend)/find-a-dealer/types'
import { getSite } from '@/lib/site-context'
import { extractStateAbbrev } from '@/lib/utils/us-states'
import { calculateDistance } from '@/lib/utils/dealer-search'

/** A dealer within this many miles of an official storefront is treated as the same location. */
const DEDUP_RADIUS_MILES = 0.6

interface Props {
  heading?: string | null
  /** 'h1' when this is the page's primary content (e.g. /find-a-dealer page);
   *  'h2' when rendered as one block among others under a page-level h1 (e.g. homepage). */
  headingLevel?: 'h1' | 'h2'
}

function storefrontToDealer(storefront: Storefront): DealerWithDistance {
  const latitude = storefront.schemaData?.geoCoordinates?.latitude
  const longitude = storefront.schemaData?.geoCoordinates?.longitude

  return {
    id: storefront.id,
    dealerName: storefront.locationName,
    slug: storefront.slug,
    isActive: storefront.isActive ?? true,
    isFeatured: false,
    source: 'storefront' as const,
    contactInfo: {
      ...(storefront.showroomInfo?.phone ? { phone: storefront.showroomInfo.phone } : {}),
      ...(storefront.showroomInfo?.email ? { email: storefront.showroomInfo.email } : {}),
    },
    address: {
      street: storefront.address?.street ?? '',
      city: storefront.address?.city ?? '',
      // Map Address state is often blank; fall back to parsing the full showroom address
      // so storefronts surface in state searches.
      state: storefront.address?.state || extractStateAbbrev(storefront.showroomInfo?.address) || '',
      zipCode: storefront.address?.zipCode ?? '',
      country: storefront.address?.country ?? 'USA',
    },
    coordinates: {
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    },
    dealerType: 'dealer' as const,
    // Kawai-owned showrooms carry the full product line, so they surface under every type filter
    shigeruKawaiDealer: true,
    acousticPianoDealer: true,
    digitalPianoDealer: true,
    professionalProductDealer: true,
    description: `Kawai's official ${storefront.locationName} location.`,
    updatedAt: storefront.updatedAt,
    createdAt: storefront.createdAt,
  }
}

const getDealerMapData = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return Promise.all([
      payload.find({
        collection: 'dealers',
        where: { isActive: { equals: true } },
        depth: 0,
        select: {
          dealerName: true,
          slug: true,
          address: true,
          coordinates: true,
          contactInfo: true,
          shigeruKawaiDealer: true,
          acousticPianoDealer: true,
          professionalProductDealer: true,
          digitalPianoDealer: true,
          isFeatured: true,
          isActive: true,
        },
        limit: 1000,
        sort: 'dealerName',
      }),
      payload.find({
        collection: 'storefronts',
        where: { isActive: { equals: true } },
        depth: 0,
        select: {
          locationName: true,
          slug: true,
          address: true,
          showroomInfo: true,
          showroomDescription: true,
          schemaData: true,
          isActive: true,
        },
        limit: 1000,
        sort: 'locationName',
      }),
    ])
  },
  ['dealer-map-data'],
  { tags: ['dealers', 'storefronts'], revalidate: 3600 }
)

export async function DealerMapBlock({ heading, headingLevel = 'h1' }: Props) {
  const [site, [dealersResponse, storefrontsResponse]] = await Promise.all([
    getSite(),
    getDealerMapData(),
  ])

  const dealers = dealersResponse.docs as Dealer[]
  const storefronts = storefrontsResponse.docs as Storefront[]

  const transformedStorefronts = storefronts
    .filter(sf =>
      sf.address?.city ||
      (sf.schemaData?.geoCoordinates?.latitude && sf.schemaData?.geoCoordinates?.longitude)
    )
    .map(storefrontToDealer)

  // Some official storefronts also exist in the dealers collection as "Kawai Piano Gallery …".
  // Drop the dealer copy when it sits on top of a storefront so we show one branded card.
  const storefrontCoords = transformedStorefronts
    .map(sf => sf.coordinates)
    .filter((c): c is { latitude: number; longitude: number } =>
      Boolean(c?.latitude && c?.longitude))

  const dedupedDealers = dealers.filter(dealer => {
    const lat = dealer.coordinates?.latitude
    const lng = dealer.coordinates?.longitude
    if (!lat || !lng) return true
    return !storefrontCoords.some(
      sc => calculateDistance(lat, lng, sc.latitude, sc.longitude) <= DEDUP_RADIUS_MILES,
    )
  })

  const unifiedDealers: DealerWithDistance[] = [
    ...dedupedDealers.map(d => ({ ...d, source: 'dealer' as const })),
    ...transformedStorefronts,
  ]

  unifiedDealers.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return (a.dealerName || '').localeCompare(b.dealerName || '')
  })

  return (
    <DealerFinderClient
      dealers={unifiedDealers}
      site={site}
      headingLevel={headingLevel}
      {...(heading != null ? { heading } : {})}
    />
  )
}
