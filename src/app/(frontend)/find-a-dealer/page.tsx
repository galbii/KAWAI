import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Dealer } from '@/payload-types'
import { DealerFinderClient } from './DealerFinderClient'

export const metadata = {
  title: 'Find a KAWAI Piano Dealer | Authorized Dealers Near You',
  description: 'Locate authorized KAWAI piano dealers in your area. Find showrooms, services, and contact information for expert piano consultations and purchases.',
}

export const revalidate = 900 // 15-minute ISR

export default async function FindADealerPage() {
  const payload = await getPayload({ config })

  // Fetch all active dealers
  const dealersResponse = await payload.find({
    collection: 'dealers',
    where: {
      isActive: {
        equals: true
      }
    },
    limit: 1000,
    sort: 'dealerName'
  })

  const dealers = dealersResponse.docs as Dealer[]

  return (
    <main className="min-h-screen bg-kawai-pearl">
      <DealerFinderClient dealers={dealers} />
    </main>
  )
}
