import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { WarrantyHero } from '../_components/WarrantyHero'
import { DigitalWarrantyContent } from '../_components/digital/DigitalWarrantyContent'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  return {
    title: 'Kawai Digital Piano Warranty | CN, CA, ES, KDP, MP Coverage',
    description:
      'Kawai digital and hybrid piano warranty — 3- or 5-year limited coverage for parts and labor on CN, CA, DG, NV, CX, KDP, ES, MP, and VPC series instruments.',
    alternates: {
      canonical: `${siteUrl}/warranty/digital`,
      languages: getSiteAlternates('/warranty/digital'),
    },
    openGraph: {
      title: 'Kawai Digital Piano Warranty',
      description:
        '3- or 5-year limited warranty on Kawai digital and hybrid pianos. Coverage details by series.',
      url: `${siteUrl}/warranty/digital`,
      type: 'article',
    },
  }
}

export default async function DigitalWarrantyPage() {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Warranty', item: `${siteUrl}/warranty` },
      { '@type': 'ListItem', position: 2, name: 'Digital Piano Warranty', item: `${siteUrl}/warranty/digital` },
    ],
  }

  return (
    <div className="min-h-screen bg-kawai-pearl">
      <WarrantyHero
        title="Digital Piano Warranty"
        subtitle="Kawai America Corporation · Limited 3- or 5-year coverage"
        breadcrumb={{ label: 'Warranty', href: '/warranty' }}
      />
      <Suspense fallback={null}>
        <DigitalWarrantyContent />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  )
}
