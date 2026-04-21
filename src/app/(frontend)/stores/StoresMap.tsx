import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import type { StorePin } from './stores-types'

export type { StorePin }

export const getStorePins = unstable_cache(
  async (): Promise<StorePin[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'storefronts',
      where: { isActive: { equals: true } },
      select: {
        slug: true,
        locationName: true,
        address: true,
        showroomInfo: true,
        schemaData: true,
      },
      depth: 0,
      limit: 100,
    })

    return result.docs
      .filter((doc) => {
        const lat = (doc as any).schemaData?.geoCoordinates?.latitude
        const lng = (doc as any).schemaData?.geoCoordinates?.longitude
        return lat && lng
      })
      .map((doc) => ({
        id: String(doc.id),
        slug: doc.slug ?? '',
        locationName: doc.locationName ?? '',
        address: (doc as any).address ?? {},
        phone: (doc as any).showroomInfo?.phone ?? undefined,
        latitude: (doc as any).schemaData.geoCoordinates.latitude,
        longitude: (doc as any).schemaData.geoCoordinates.longitude,
      }))
  },
  ['stores-map-pins'],
  { tags: ['storefronts'], revalidate: 3600 }
)
