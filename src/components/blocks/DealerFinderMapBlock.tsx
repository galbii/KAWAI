import type { Dealer, Storefront } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { DealerFinderClient } from '@/app/(frontend)/find-a-dealer/DealerFinderClient'
import type { DealerWithDistance } from '@/app/(frontend)/find-a-dealer/types'

interface Props {
  heading?: string | null
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
    contactInfo: storefront.showroomInfo?.phone
      ? { phone: storefront.showroomInfo.phone }
      : {},
    address: {
      street: storefront.address?.street ?? '',
      city: storefront.address?.city ?? '',
      state: storefront.address?.state ?? '',
      zipCode: storefront.address?.zipCode ?? '',
      country: storefront.address?.country ?? 'USA',
    },
    coordinates: {
      latitude: latitude ?? 0,
      longitude: longitude ?? 0,
    },
    dealerType: 'dealer' as const,
    acousticPianoDealer: true,
    description: storefront.showroomDescription,
    updatedAt: storefront.updatedAt,
    createdAt: storefront.createdAt,
  }
}

export async function DealerFinderMapBlock({ heading }: Props) {
  const payload = await getPayloadClient()

  const [dealersResponse, storefrontsResponse] = await Promise.all([
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

  const dealers = dealersResponse.docs as Dealer[]
  const storefronts = storefrontsResponse.docs as Storefront[]

  const transformedStorefronts = storefronts
    .filter(sf =>
      sf.address?.city ||
      (sf.schemaData?.geoCoordinates?.latitude && sf.schemaData?.geoCoordinates?.longitude)
    )
    .map(storefrontToDealer)

  const unifiedDealers: DealerWithDistance[] = [
    ...dealers.map(d => ({ ...d, source: 'dealer' as const })),
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
      {...(heading != null ? { heading } : {})}
    />
  )
}
