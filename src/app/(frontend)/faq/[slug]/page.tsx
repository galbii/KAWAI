import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText, LinkJSXConverter } from '@payloadcms/richtext-lexical/react'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import { getAllFaqSlugs, getFaqBySlug } from '@/lib/payload/queries'
import { getSite, getSiteUrl, getSiteAlternates, localeFromSite } from '@/lib/site-context'

export const revalidate = 3600

// Resolve internal-document links to real hrefs. Without this, Payload's default
// converter renders internal links as a dead `href="#"` and logs a console error.
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const doc = linkNode.fields.doc
  if (!doc) return '#'
  const { relationTo, value } = doc
  const slug =
    typeof value === 'object' && value !== null
      ? (value as { slug?: string }).slug
      : undefined
  if (!slug) return '#'
  switch (relationTo) {
    case 'products':
      return `/products/${slug}`
    case 'posts':
      return `/blog/${slug}`
    case 'faqs':
      return `/faq/${slug}`
    default:
      return `/${slug}`
  }
}

// Walk the Lexical tree and return the shallowest heading level used (1–6), or
// null if the answer has no headings.
const minHeadingLevel = (state: any): number | null => {
  let min: number | null = null
  const visit = (node: any) => {
    if (!node) return
    if (node.type === 'heading' && typeof node.tag === 'string') {
      const lvl = parseInt(node.tag.slice(1), 10)
      if (!Number.isNaN(lvl) && (min === null || lvl < min)) min = lvl
    }
    if (Array.isArray(node.children)) node.children.forEach(visit)
  }
  visit(state?.root)
  return min
}

// Keep Payload's default rendering, but (a) wire in internal-link resolution and
// (b) shift answer headings so the shallowest becomes <h2>. The page <h1> is the
// question; authored answers often start at h3, which skips h2 (WCAG 2.4.6). The
// offset preserves the answer's internal hierarchy while removing the skip.
const makeAnswerConverters =
  (headingOffset: number): JSXConvertersFunction<DefaultNodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
      const level = parseInt(String(node.tag).slice(1), 10) || 2
      const shifted = Math.min(6, Math.max(2, level + headingOffset))
      const Tag = `h${shifted}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return <Tag>{nodesToJSX({ nodes: node.children })}</Tag>
    },
  })

export async function generateStaticParams() {
  const slugs = await getAllFaqSlugs()
  return slugs
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const site = await getSite()
  const faq = await getFaqBySlug(slug, localeFromSite(site))

  if (!faq) {
    return {
      title: 'FAQ Not Found | Kawai Pianos',
      robots: { index: false, follow: false },
    }
  }

  const siteUrl = getSiteUrl(site)
  const title = (faq as any).seo?.metaTitle || `${(faq as any).question} | KAWAI FAQ`
  const description =
    (faq as any).seo?.metaDescription || (faq as any).excerpt || undefined

  return {
    title,
    description,
    keywords: (faq as any).seo?.keywords,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: `${siteUrl}/faq/${slug}`,
      languages: getSiteAlternates(`/faq/${slug}`),
    },
    openGraph: {
      title,
      description: description ?? undefined,
      url: `${siteUrl}/faq/${slug}`,
      siteName: 'Kawai Pianos',
      type: 'article',
    },
  }
}

export default async function FaqDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const faq = await getFaqBySlug(slug, localeFromSite(await getSite()))

  if (!faq) {
    notFound()
  }

  const faqData = faq as any

  // Build FAQPage + Question JSON-LD for Google rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: faqData.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faqData.excerpt ?? faqData.question,
        },
      },
    ],
  }

  const categories: any[] = Array.isArray(faqData.categories) ? faqData.categories : []
  const relatedProducts: any[] = Array.isArray(faqData.relatedProducts)
    ? faqData.relatedProducts
    : []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-kawai-pearl">
        {/* Breadcrumb + Header */}
        <section className="bg-kawai-charcoal text-white py-12">
          <div className="container mx-auto px-6 max-w-3xl">
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-200 truncate max-w-xs">{faqData.question}</li>
              </ol>
            </nav>

            {/* Category badges */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat: any) => {
                  const catObj = typeof cat === 'object' ? cat : null
                  if (!catObj) return null
                  return (
                    <Link
                      key={catObj.id}
                      href={`/faq?category=${catObj.slug}`}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-200 hover:bg-white/20 transition-colors"
                    >
                      {catObj.name}
                    </Link>
                  )
                })}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold leading-snug">{faqData.question}</h1>

            {faqData.excerpt && (
              <p className="mt-4 text-lg text-gray-300 leading-relaxed">{faqData.excerpt}</p>
            )}
          </div>
        </section>

        {/* Answer */}
        <section className="py-12">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="bg-white rounded-2xl shadow-sm border border-kawai-neutral p-8 md:p-10">
              {faqData.answer ? (
                <div className="prose prose-lg max-w-none prose-headings:text-kawai-charcoal prose-a:text-kawai-red prose-a:no-underline hover:prose-a:underline">
                  <RichText
                    converters={makeAnswerConverters(2 - (minHeadingLevel(faqData.answer) ?? 2))}
                    data={faqData.answer}
                  />
                </div>
              ) : (
                <p className="text-kawai-charcoal/60">No answer content available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-10">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="text-xl font-bold text-kawai-charcoal mb-5">Related Pianos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProducts.map((product: any) => {
                  const productObj = typeof product === 'object' ? product : null
                  if (!productObj) return null
                  return (
                    <Link
                      key={productObj.id}
                      href={`/products/${productObj.slug}`}
                      className="flex items-center gap-4 bg-white rounded-xl border border-kawai-neutral p-4 hover:border-kawai-red/40 hover:shadow-sm transition-all group"
                    >
                      {productObj.imageUrl && (
                        <div className="w-16 h-16 rounded-lg bg-kawai-pearl flex-shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={productObj.imageUrl}
                            alt={productObj.name || productObj.model}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-kawai-charcoal group-hover:text-kawai-red transition-colors truncate">
                          {productObj.name || productObj.model}
                        </p>
                        {productObj.model && productObj.name && (
                          <p className="text-sm text-kawai-charcoal/60 truncate">{productObj.model}</p>
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-kawai-charcoal/30 group-hover:text-kawai-red ml-auto flex-shrink-0 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back nav + CTA */}
        <section className="py-10 border-t border-kawai-neutral">
          <div className="container mx-auto px-6 max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-kawai-red hover:underline font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all FAQs
            </Link>
            <Link
              href="/pianos"
              className="inline-flex items-center gap-2 bg-kawai-red text-white px-5 py-2.5 rounded-lg hover:bg-kawai-red/90 transition-colors text-sm font-medium"
            >
              Explore Our Pianos
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
