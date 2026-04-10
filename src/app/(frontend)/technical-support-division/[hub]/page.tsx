import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getFaqsByHub,
  getFaqCategoriesByHub,
  getSupportGroupBySlug,
  getAllSupportGroups,
  getPopularFaqsByHub,
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

  const [group, faqs, categories, popularFaqs] = await Promise.all([
    getSupportGroupBySlug(hub),
    getFaqsByHub(hub),
    getFaqCategoriesByHub(hub),
    getPopularFaqsByHub(hub),
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
          { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Support',
            item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/technical-support-division`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: hubName,
            item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/technical-support-division/${hub}`,
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

  // Top 10 most-viewed FAQs for this hub — drives the "Popular" tab
  const featuredFaqs: FaqItem[] = (popularFaqs as any[]).map((faq: any) => ({
    id: String(faq.id),
    question: faq.question,
    slug: faq.slug ?? '',
    excerpt: faq.excerpt ?? null,
    categories: Array.isArray(faq.categories)
      ? faq.categories
          .filter((c: unknown): c is Record<string, unknown> => typeof c === 'object' && c !== null)
          .map((c: Record<string, unknown>) => ({
            id: String(c.id),
            name: String(c.name ?? ''),
            slug: String(c.slug ?? ''),
            color: typeof c.color === 'string' ? c.color : null,
          }))
      : [],
  }))

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

      <div className="min-h-screen bg-white">
        <section className="relative bg-white pt-40 pb-28 md:pt-52 md:pb-36 overflow-hidden border-b border-black/[0.06]">
          {/* Ghost heading backdrop */}
          <div aria-hidden className="absolute inset-0 flex items-end justify-end pointer-events-none select-none overflow-hidden">
            <span className="text-[22vw] font-bold leading-none text-kawai-black/[0.03] font-[family-name:var(--font-brand-sans)] translate-y-[15%] translate-x-[5%]">
              TSD
            </span>
          </div>

          <div className="relative max-w-screen-2xl mx-auto px-10 md:px-16 xl:px-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-10 bg-kawai-red" />
              <p className="text-[10px] text-kawai-red tracking-[0.5em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
                {hubName}
              </p>
            </div>

            <h1 className="font-[family-name:var(--font-brand-serif)] font-light text-7xl md:text-8xl lg:text-[7rem] xl:text-[8.5rem] text-kawai-black leading-[0.92] tracking-tight mb-20 max-w-5xl">
              {hubHeading}
            </h1>

            <div className="max-w-3xl">
              <FaqSearch
                variant="hero"
                placeholder={`Search ${hubName} questions…`}
                backHref="/technical-support-division"
                backLabel="Support Center"
              />
            </div>
          </div>
        </section>

        <HubFaqAccordion
          groups={groups}
          hubLabel={hubName}
          featuredFaqs={featuredFaqs}
          allQuestions={allQuestions}
        />

        {/* Contact / Support Request Form */}
        <section className="bg-white border-t border-black/[0.06] py-24 md:py-32">
          <div className="max-w-screen-2xl mx-auto px-10 md:px-20 xl:px-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

              {/* Left — sticky intro, offset clears main header + floating search bar */}
              <div className="lg:sticky lg:top-44">
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-px w-10 bg-kawai-red" />
                  <p className="text-[10px] text-kawai-red tracking-[0.5em] uppercase font-semibold font-[family-name:var(--font-brand-sans)]">
                    Get in Touch
                  </p>
                </div>
                <h2 className="font-[family-name:var(--font-brand-serif)] font-light text-5xl md:text-6xl lg:text-[4rem] xl:text-[5rem] text-kawai-black leading-[0.95] tracking-tight mb-8">
                  Still have questions?
                </h2>
                <p className="text-kawai-black/60 text-base font-[family-name:var(--font-brand-sans)] leading-relaxed max-w-sm">
                  Submit a support request and our team will get back to you as soon as possible.
                </p>
              </div>

              {/* Right — form, unconstrained width */}
              <div>
                <iframe
                  src="https://share.hsforms.com/22f9oRT3pQ96WhrVrK5C4jwd39hb"
                  title="Kawai Technical Support Request"
                  className="w-full border-0"
                  style={{ height: '1100px', background: 'white' }}
                  scrolling="no"
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  )
}
