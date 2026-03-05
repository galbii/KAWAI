import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getFaqsByHub,
  getFaqCategoriesByHub,
  getSupportGroupBySlug,
  getAllSupportGroups,
} from '@/lib/payload/queries'
import { HubFaqAccordion } from './_components/HubFaqAccordion'
import type { FaqItem, FaqGroup } from './_components/HubFaqAccordion'
import { FaqSearch } from '../_components/FaqSearch'

export const revalidate = 3600

interface Props {
  params: Promise<{ hub: string }>
}

export async function generateStaticParams() {
  const groups = await getAllSupportGroups()
  return groups.map((g) => ({ hub: g.slug as string }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub } = await params
  const group = await getSupportGroupBySlug(hub)
  if (!group) return { title: 'Support | Kawai' }
  const seo = group.seo as { metaTitle?: string; metaDescription?: string } | undefined
  return {
    title: seo?.metaTitle ?? `${group.name} | Kawai Technical Support`,
    description: seo?.metaDescription ?? (group.description as string | undefined),
    alternates: { canonical: `/technical-support-division/${hub}` },
  }
}

export default async function HubPage({ params }: Props) {
  const { hub } = await params

  const [group, faqs, categories] = await Promise.all([
    getSupportGroupBySlug(hub),
    getFaqsByHub(hub),
    getFaqCategoriesByHub(hub),
  ])

  if (!group) notFound()

  const hubName    = group.name as string
  const hubHeading = (group.heading as string | undefined) ?? hubName
  const seo        = group.seo as { metaTitle?: string; metaDescription?: string } | undefined

  // Build FAQPage JSON-LD (up to 20 FAQs)
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
            name: hubName,
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

  // Group FAQs by category (server-side)
  const categoryMap = new Map<string, FaqGroup>()

  for (const cat of categories as any[]) {
    categoryMap.set(cat.slug, {
      categoryName: cat.name,
      categorySlug: cat.slug,
      color: cat.color ?? undefined,
      faqs: [],
    })
  }

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

  const groups: FaqGroup[] = [...categoryMap.values()].filter((g) => g.faqs.length > 0)

  const featuredFaqs: FaqItem[] = []
  for (const g of groups) {
    for (const faq of g.faqs) {
      if (featuredFaqs.length >= 5) break
      featuredFaqs.push(faq)
    }
    if (featuredFaqs.length >= 5) break
  }

  const allQuestions: string[] = groups
    .flatMap((g) => g.faqs)
    .slice(0, 20)
    .map((f) => f.question)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-kawai-pearl">
        <section className="bg-kawai-black text-white pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              href="/technical-support-division"
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors duration-200 text-xs font-[family-name:var(--font-brand-sans)] mb-10"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Support Center
            </Link>

            <p className="text-[11px] text-kawai-red tracking-[0.35em] uppercase font-medium mb-5 font-[family-name:var(--font-brand-sans)]">
              {hubName}
            </p>

            <h1 className="font-[family-name:var(--font-brand-serif)] font-light text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-10">
              {hubHeading}
            </h1>

            <FaqSearch variant="hero" placeholder={`Search ${hubName} questions…`} />
          </div>
        </section>

        <HubFaqAccordion
          groups={groups}
          hubLabel={hubName}
          featuredFaqs={featuredFaqs}
          allQuestions={allQuestions}
        />
      </div>
    </>
  )
}
