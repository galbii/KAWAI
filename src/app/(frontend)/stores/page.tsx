import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import { VideoHero } from './VideoHero'
import { StoresInteractiveSection } from './StoresInteractiveSection'
import { getStorePins } from './StoresMap'
import type { StorefrontEntry } from './stores-types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai Factory Stores | KAWAI',
  description:
    'Visit an Official Kawai Factory Showroom and experience the full range of grand, upright, and digital pianos in person. Expert staff, world-class instruments.',
  openGraph: {
    title: 'Kawai Factory Stores',
    description: "Experience the world's finest pianos in person at an Official Kawai Showroom.",
  },
}

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const getActiveStorefronts = unstable_cache(
  async (): Promise<StorefrontEntry[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'storefronts',
      where: { isActive: { equals: true } },
      select: {
        slug: true,
        locationName: true,
        locationText: true,
        establishedText: true,
        showroomInfo: true,
        features: true,
      },
      sort: 'locationName',
      depth: 0,
      limit: 50,
    })

    return result.docs.map((doc) => ({
      id: String(doc.id),
      slug: doc.slug ?? '',
      locationName: doc.locationName ?? '',
      locationText: (doc as any).locationText ?? '',
      establishedText: (doc as any).establishedText ?? undefined,
      showroomInfo: (doc as any).showroomInfo ?? undefined,
      features: ((doc as any).features ?? []).map((f: any) => ({ title: f.title ?? '' })),
    }))
  },
  ['stores-page-storefronts'],
  { tags: ['storefronts'], revalidate: 3600 }
)

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default async function StoresPage() {
  const [storefronts, pins] = await Promise.all([
    getActiveStorefronts(),
    getStorePins(),
  ])

  return (
    <div className="bg-kawai-pearl min-h-screen">
      <VideoHero />
      <StoresInteractiveSection storefronts={storefronts} pins={pins} />
    </div>
  )
}
