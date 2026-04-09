import type { Metadata } from 'next'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'
import { DealerFinderMapBlock } from '@/components/blocks/DealerFinderMapBlock'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

const fallbackMetadata: Metadata = {
  title: 'Find a KAWAI Piano Dealer | Authorized Dealers Near You',
  description:
    'Find authorized Kawai piano dealers near you. Search by ZIP code or city to locate showrooms, get contact info, and book an expert piano consultation.',
  alternates: {
    canonical: '/find-a-dealer',
  },
  openGraph: {
    title: 'Find a KAWAI Piano Dealer | Authorized Dealers Near You',
    description:
      'Find authorized Kawai piano dealers near you. Search by ZIP code or city to locate showrooms, get contact info, and book an expert piano consultation.',
    url: '/find-a-dealer',
    type: 'website',
    images: [
      {
        url: '/images/kawai-og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Find an Authorized KAWAI Piano Dealer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find a KAWAI Piano Dealer | Authorized Dealers Near You',
    description:
      'Find authorized Kawai piano dealers near you. Search by ZIP code or city to locate showrooms, get contact info, and book an expert piano consultation.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getCMSPageMetadata('find-a-dealer', fallbackMetadata)
  return {
    ...metadata,
    robots: { index: true, follow: true },
    // Always enforce canonical regardless of CMS override
    alternates: {
      ...(typeof metadata.alternates === 'object' ? metadata.alternates : {}),
      canonical: '/find-a-dealer',
    },
  }
}

export const revalidate = 900 // 15-minute ISR

const dealerFinderSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Find a KAWAI Piano Dealer',
  description:
    'Search for authorized KAWAI piano dealers near you. Filter by dealer type, search by city or ZIP code, and get directions.',
  url: `${SITE_URL}/find-a-dealer`,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/find-a-dealer?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: SITE_URL },
  { name: 'Find a Dealer', url: `${SITE_URL}/find-a-dealer` },
])

export default async function FindADealerPage() {
  return (
    <main className="bg-white overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dealerFinderSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c'),
        }}
      />
      <AdminBarDoc
        collection="dealers"
        id=""
        collectionLabels={{ singular: 'Dealer', plural: 'Dealers' }}
      />
      <DealerFinderMapBlock />
    </main>
  )
}
