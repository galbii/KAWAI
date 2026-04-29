import type { Metadata } from 'next'
import { getSiteAlternates } from '@/lib/site-context'
import { SerialNumberLookup } from '@/components/serial-number/SerialNumberLookup'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Piano Serial Number Lookup | Kawai',
    description:
      'Find out when and where your Kawai acoustic piano was manufactured. Enter your serial number to discover its production year and country of origin.',
    alternates: {
      canonical: '/serial-number',
      languages: getSiteAlternates('/serial-number'),
    },
    openGraph: {
      title: 'Piano Serial Number Lookup | Kawai',
      description:
        'Discover the production year and country of manufacture for your Kawai acoustic piano.',
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default function SerialNumberPage() {
  return <SerialNumberLookup />
}
