import type { Metadata } from 'next'
import { TSDLandingHero } from './_components/TSDLandingHero'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Support Center | Kawai Pianos',
  description:
    'Get help with your Kawai piano. Select your path — owner, buyer, or technician.',
  alternates: { canonical: '/technical-support-division' },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Support Center',
          item: `${siteUrl}/technical-support-division`,
        },
      ],
    },
  ],
}

export default function TSDLandingPage() {
  return (
    <main className="min-h-screen bg-kawai-black flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TSDLandingHero />
    </main>
  )
}
