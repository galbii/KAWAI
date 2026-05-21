import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { WarrantyHero } from './_components/WarrantyHero'
import { CoverageCheck } from './_components/coverage-check/CoverageCheck'
import { WarrantyFAQ } from './_components/WarrantyFAQ'
import { ServiceAndClaims } from './_components/ServiceAndClaims'
import { RegisterCTA } from './_components/RegisterCTA'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)
  return {
    title: 'Kawai Piano Warranty | Coverage for Acoustic & Digital Pianos',
    description:
      'Check your Kawai warranty in seconds. Acoustic pianos carry a Full 10-Year Transferable Warranty; digital and hybrid pianos carry a 3- or 5-year limited warranty by series.',
    alternates: {
      canonical: `${siteUrl}/warranty`,
      languages: getSiteAlternates('/warranty'),
    },
    openGraph: {
      title: 'Kawai Piano Warranty — Is your Kawai covered?',
      description:
        'Search your model and enter your purchase date to see exactly when your Kawai warranty expires.',
      url: `${siteUrl}/warranty`,
      type: 'website',
    },
  }
}

export default async function WarrantyPage() {
  const site = await getSite()
  const siteUrl = getSiteUrl(site)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Warranty', item: `${siteUrl}/warranty` },
    ],
  }

  return (
    <div className="min-h-screen bg-kawai-pearl">
      <WarrantyHero
        variant="light"
        title="Kawai Piano Warranty"
        subtitle="Warranty"
      />

      <div className="container mx-auto px-6 max-w-2xl pt-12 pb-20 space-y-20">
        <CoverageCheck />

        <div className="space-y-3">
          <ServiceAndClaims variant="inline" />
          <RegisterCTA variant="inline" />
        </div>

        <WarrantyFAQ />

        <p className="text-[12px] text-kawai-charcoal/40 leading-relaxed pt-6 border-t border-kawai-neutral">
          The Kawai warranty applies only to instruments located in and purchased from authorized
          Kawai dealers in the United States and Canada.{' '}
          <a href="/pianos" className="text-kawai-red hover:underline">Browse pianos</a>
          {' · '}
          <a href="/find-a-dealer" className="text-kawai-red hover:underline">Find a dealer</a>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  )
}
