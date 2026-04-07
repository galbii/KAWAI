import type { Metadata } from 'next'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'
import { DealerFinderMapBlock } from '@/components/blocks/DealerFinderMapBlock'

const fallbackMetadata: Metadata = {
  title: 'Find a KAWAI Piano Dealer | Authorized Dealers Near You',
  description:
    'Locate authorized KAWAI piano dealers in your area. Find showrooms, services, and contact information for expert piano consultations and purchases.',
}

export async function generateMetadata(): Promise<Metadata> {
  return getCMSPageMetadata('find-a-dealer', fallbackMetadata)
}

export const revalidate = 900 // 15-minute ISR

export default async function FindADealerPage() {
  return (
    <main className="bg-white overflow-hidden">
      <AdminBarDoc
        collection="dealers"
        id=""
        collectionLabels={{ singular: 'Dealer', plural: 'Dealers' }}
      />
      <DealerFinderMapBlock />
    </main>
  )
}
