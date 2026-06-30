import type { Metadata } from 'next'
import { getSiteAlternates } from '@/lib/site-context'
// import { SerialNumberLookup } from '@/components/serial-number/SerialNumberLookup'
import { SerialNumberMaintenance } from '@/components/serial-number/SerialNumberMaintenance'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Serial Number Lookup — Temporarily Unavailable | Kawai',
    description:
      'The Kawai piano serial number lookup is temporarily down for maintenance. Please check back soon.',
    alternates: {
      canonical: '/serial-number',
      languages: getSiteAlternates('/serial-number'),
    },
    openGraph: {
      title: 'Serial Number Lookup — Temporarily Unavailable | Kawai',
      description:
        'The Kawai piano serial number lookup is temporarily down for maintenance. Please check back soon.',
      type: 'website',
    },
    // Under maintenance: don't index the placeholder. Restore index/follow
    // when SerialNumberLookup is brought back below.
    robots: { index: false, follow: true },
  }
}

export default function SerialNumberPage() {
  // Maintenance mode — swap back to <SerialNumberLookup /> to restore the tool.
  return <SerialNumberMaintenance />
}
