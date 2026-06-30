import type { Metadata } from 'next'
import { TSDLandingHero } from './_components/TSDLandingHero'
import { PopularFaqLinks } from './_components/PopularFaqLinks'
import { getPayloadClient, getPopularFaqsGlobal } from '@/lib/payload/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Support Center | Kawai Pianos',
  description:
    'Get help with your Kawai piano. Select your path — owner, buyer, or technician.',
  alternates: { canonical: '/technical-support-division' },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

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

export default async function TSDLandingPage() {
  const payload = await getPayloadClient()

  const [{ docs: supportGroups }, popularFaqs] = await Promise.all([
    payload.find({
      collection: 'support-groups',
      where: { isActive: { equals: true } },
      select: { name: true, slug: true, heading: true, description: true },
      sort: 'displayOrder',
      depth: 0,
      limit: 20,
    }),
    getPopularFaqsGlobal(),
  ])

  const groups = supportGroups.map((g) => ({
    href: `/technical-support-division/${g.slug}`,
    label: typeof g.name === 'string' ? g.name : '',
    heading: typeof g.heading === 'string' ? g.heading : (typeof g.name === 'string' ? g.name : ''),
    description: typeof g.description === 'string' ? g.description : '',
  }))

  return (
    <div className="min-h-screen bg-kawai-pearl flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page-level h1 — the hero cards below use h2, so expose a single top heading. */}
      <h1 className="sr-only">Kawai Technical Support</h1>
      <TSDLandingHero groups={groups} />

      {popularFaqs.length > 0 && (
        <section className="bg-kawai-pearl pb-24">
          <div className="max-w-3xl mx-auto px-8">
            <p className="text-[10px] text-kawai-black/60 tracking-[0.35em] uppercase font-medium mb-6 font-[family-name:var(--font-brand-sans)]">
              Popular Questions
            </p>
            <PopularFaqLinks faqs={popularFaqs} />
          </div>
        </section>
      )}
    </div>
  )
}
