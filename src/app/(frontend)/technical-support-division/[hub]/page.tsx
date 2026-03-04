import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFaqsByHub, getFaqCategoriesByHub, TSD_HUB_META } from '@/lib/payload/queries'
import { HubFaqAccordion } from './_components/HubFaqAccordion'
import type { FaqItem, FaqGroup } from './_components/HubFaqAccordion'
import { FaqSearch } from '../_components/FaqSearch'

export const revalidate = 3600

type TSDHub = keyof typeof TSD_HUB_META

const VALID_HUBS: TSDHub[] = ['owner-hub', 'buyer-hub', 'technician-resources']

interface Props {
  params: Promise<{ hub: string }>
}

export async function generateStaticParams() {
  return [
    { hub: 'owner-hub' },
    { hub: 'buyer-hub' },
    { hub: 'technician-resources' },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub } = await params
  const meta = TSD_HUB_META[hub as TSDHub]
  if (!meta) return { title: 'Support | Kawai' }
  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: { canonical: `/technical-support-division/${hub}` },
  }
}

export default async function HubPage({ params }: Props) {
  const { hub } = await params

  if (!VALID_HUBS.includes(hub as TSDHub)) {
    notFound()
  }

  const hubKey = hub as TSDHub
  const meta = TSD_HUB_META[hubKey]

  const [faqs, categories] = await Promise.all([
    getFaqsByHub(hub),
    getFaqCategoriesByHub(hub),
  ])

  // Build FAQPage JSON-LD (up to 20 FAQs, excerpt truncated to 300 chars)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Support',
            item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/technical-support-division`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: meta.label,
            item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'}/technical-support-division/${hub}`,
          },
        ],
      },
      ...(faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: (faqs as any[]).slice(0, 20).map((faq: any) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: ((faq.excerpt ?? '') as string).substring(0, 300),
                },
              })),
            },
          ]
        : []),
    ],
  }

  // Group FAQs by category (server-side, passed to client component)
  const categoryMap = new Map<string, FaqGroup>()

  // Add hub categories in order first
  for (const cat of categories as any[]) {
    categoryMap.set(cat.slug, {
      categoryName: cat.name,
      categorySlug: cat.slug,
      color: cat.color ?? undefined,
      faqs: [],
    })
  }

  // Assign each FAQ to its first matching category, or 'general'
  for (const faq of faqs as any[]) {
    const faqCats = Array.isArray(faq.categories)
      ? faq.categories.filter((c: unknown): c is Record<string, unknown> => typeof c === 'object' && c !== null)
      : []

    const matchCat = faqCats.find((c: Record<string, unknown>) =>
      typeof c.slug === 'string' && categoryMap.has(c.slug)
    )

    const targetSlug =
      typeof matchCat?.slug === 'string' ? matchCat.slug : 'general'

    if (!categoryMap.has(targetSlug)) {
      categoryMap.set(targetSlug, { categoryName: 'General', categorySlug: 'general', faqs: [] })
    }

    const faqItem: FaqItem = {
      id: String(faq.id),
      question: faq.question,
      slug: faq.slug ?? '',
      excerpt: faq.excerpt ?? null,
      categories: faqCats.map((c: Record<string, unknown>) => ({
        id: String(c.id),
        name: String(c.name),
        slug: String(c.slug),
        color: typeof c.color === 'string' ? c.color : null,
      })),
    }

    categoryMap.get(targetSlug)!.faqs.push(faqItem)
  }

  const groups: FaqGroup[] = [...categoryMap.values()].filter(
    (g) => g.faqs.length > 0
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-kawai-pearl">
        {/* Header — consistent with landing */}
        <section className="bg-kawai-black text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-3xl mx-auto px-6">
            {/* Back */}
            <Link
              href="/technical-support-division"
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-200 text-xs font-[family-name:var(--font-brand-sans)] mb-10"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Support Center
            </Link>

            {/* Overline */}
            <p className="text-[11px] text-kawai-red tracking-[0.35em] uppercase font-medium mb-5 font-[family-name:var(--font-brand-sans)]">
              {meta.label}
            </p>

            {/* Heading */}
            <h1 className="font-[family-name:var(--font-brand-serif)] font-light text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-10">
              {meta.heading}
            </h1>

            {/* Search */}
            <FaqSearch variant="hero" placeholder={`Search ${meta.label} questions…`} />
          </div>
        </section>

        {/* FAQ categories + accordion */}
        <HubFaqAccordion groups={groups} />
      </div>
    </>
  )
}
