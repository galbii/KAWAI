import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Dealer, Storefront } from '@/payload-types'
import { DealerFinderClient } from './DealerFinderClient'

export const metadata = {
  title: 'Find a KAWAI Piano Dealer | Authorized Dealers Near You',
  description: 'Locate authorized KAWAI piano dealers in your area. Find showrooms, services, and contact information for expert piano consultations and purchases.',
}

export const revalidate = 900 // 15-minute ISR

// Unified type for dealer finder (combines Dealers and Storefronts)
interface UnifiedDealer extends Omit<Dealer, 'isOfficialStore'> {
  isOfficialStore: boolean
  source: 'dealer' | 'storefront'
}

// Transform storefront to dealer structure
function storefrontToDealer(storefront: Storefront): UnifiedDealer {
  const latitude = storefront.schemaData?.geoCoordinates?.latitude
  const longitude = storefront.schemaData?.geoCoordinates?.longitude

  return {
    id: storefront.id,
    dealerName: storefront.locationName,
    slug: storefront.slug,
    isActive: storefront.isActive ?? true,
    isFeatured: false,
    isOfficialStore: true, // All storefronts are official stores
    source: 'storefront' as const,
    contactInfo: storefront.showroomInfo?.phone ? {
      phone: storefront.showroomInfo.phone,
    } : {},
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
    dealerType: ['acoustic-digital'] as ('professional-products' | 'acoustic-digital')[],
    description: storefront.showroomDescription,
    updatedAt: storefront.updatedAt,
    createdAt: storefront.createdAt,
  }
}

export default async function FindADealerPage() {
  const payload = await getPayload({ config })

  // Fetch both dealers and storefronts in parallel
  const [dealersResponse, storefrontsResponse] = await Promise.all([
    payload.find({
      collection: 'dealers',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 1000,
      sort: 'dealerName'
    }),
    payload.find({
      collection: 'storefronts',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 1000,
      sort: 'locationName'
    })
  ])

  const dealers = dealersResponse.docs as Dealer[]
  const storefronts = storefrontsResponse.docs as Storefront[]

  // Transform storefronts to dealer structure
  const transformedStorefronts = storefronts
    .filter(sf => {
      // Include storefronts with a city (coordinates auto-geocoded from address)
      return sf.address?.city || (sf.schemaData?.geoCoordinates?.latitude && sf.schemaData?.geoCoordinates?.longitude)
    })
    .map(storefrontToDealer)

  // Combine dealers and transformed storefronts
  const unifiedDealers: UnifiedDealer[] = [
    ...dealers.map(d => ({
      ...d,
      isOfficialStore: d.isOfficialStore ?? false,
      source: 'dealer' as const
    })),
    ...transformedStorefronts
  ]

  // Sort by featured first, then by name
  unifiedDealers.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return (a.dealerName || '').localeCompare(b.dealerName || '')
  })

  return (
    <main className="min-h-screen bg-white">
      <DealerFinderClient dealers={unifiedDealers} />
    </main>
  )
}
