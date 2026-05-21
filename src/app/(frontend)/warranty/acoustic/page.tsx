import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { WarrantyHero } from '../_components/WarrantyHero'
import { AcousticWarrantyContent } from '../_components/acoustic/AcousticWarrantyContent'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  return {
    title: 'Kawai Acoustic Piano Warranty | Full 10-Year Transferable',
    description:
      'Kawai acoustic piano warranty — Full Ten (10) Year Transferable Warranty covering defects in workmanship and materials on Kawai grand, upright, and Shigeru Kawai pianos.',
    alternates: {
      canonical: `${siteUrl}/warranty/acoustic`,
      languages: getSiteAlternates('/warranty/acoustic'),
    },
    openGraph: {
      title: 'Kawai Acoustic Piano Warranty — Full 10-Year Transferable',
      description:
        'Full Ten (10) Year Transferable Warranty on all Kawai acoustic grand and upright pianos.',
      url: `${siteUrl}/warranty/acoustic`,
      type: 'article',
    },
  }
}

export default async function AcousticWarrantyPage() {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Warranty', item: `${siteUrl}/warranty` },
      { '@type': 'ListItem', position: 2, name: 'Acoustic Piano Warranty', item: `${siteUrl}/warranty/acoustic` },
    ],
  }

  return (
    <div className="min-h-screen bg-kawai-pearl">
      <WarrantyHero
        title="Acoustic Piano Warranty"
        subtitle="Kawai America Corporation · Full Ten (10) Year Transferable Warranty"
        breadcrumb={{ label: 'Warranty', href: '/warranty' }}
      />
      <Suspense fallback={null}>
        <AcousticWarrantyContent />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  )
}
