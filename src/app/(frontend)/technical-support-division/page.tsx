import type { Metadata } from 'next'
import Link from 'next/link'
import { TSDLandingHero } from './_components/TSDLandingHero'
import { getPayloadClient } from '@/lib/payload/queries'

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

export default async function TSDLandingPage() {
  const payload = await getPayloadClient()

  const [{ docs: supportGroups }, { docs: popularFaqs }] = await Promise.all([
    payload.find({
      collection: 'support-groups',
      where: { isActive: { equals: true } },
      select: { name: true, slug: true, heading: true, description: true },
      sort: 'displayOrder',
      depth: 0,
      limit: 20,
    }),
    payload.find({
      collection: 'faqs',
      where: { status: { equals: 'published' } },
      select: { question: true, slug: true, excerpt: true, supportHub: true },
      depth: 0,
      limit: 6,
      sort: '-publishedDate',
    }),
  ])

  const groups = supportGroups.map((g) => ({
    href: `/technical-support-division/${g.slug}`,
    label: typeof g.name === 'string' ? g.name : '',
    heading: typeof g.heading === 'string' ? g.heading : (typeof g.name === 'string' ? g.name : ''),
    description: typeof g.description === 'string' ? g.description : '',
  }))

  return (
    <main className="min-h-screen bg-kawai-black flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TSDLandingHero groups={groups} />

      {popularFaqs.length > 0 && (
        <section className="bg-kawai-black pb-16">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-[10px] text-white/20 tracking-[0.35em] uppercase font-medium mb-5 font-[family-name:var(--font-brand-sans)]">
              Popular Questions
            </p>
            <ul className="space-y-0">
              {popularFaqs.map((faq) => (
                <li key={faq.id} className="border-b border-white/[0.06] last:border-0">
                  <Link
                    href={`/faq/${faq.slug}`}
                    className="group flex items-center justify-between py-3.5 gap-4 hover:text-white transition-colors duration-150"
                  >
                    <span className="text-sm text-white/50 group-hover:text-white/90 font-[family-name:var(--font-brand-sans)] transition-colors duration-150 leading-snug">
                      {faq.question}
                    </span>
                    <svg
                      className="w-3.5 h-3.5 text-white/15 group-hover:text-kawai-red flex-shrink-0 transition-colors duration-150 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
