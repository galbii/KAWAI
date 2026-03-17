import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllFaqs, getAllFaqCategories } from '@/lib/payload/queries'
import { getCMSPageMetadata } from '@/lib/seo/cms-page-metadata'

export const revalidate = 3600

const fallbackMetadata: Metadata = {
  title: 'Frequently Asked Questions | Kawai Pianos',
  description: 'Find answers to common questions about KAWAI pianos, purchasing, financing, service, and more.',
  alternates: {
    canonical: '/faq',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return getCMSPageMetadata('faq', fallbackMetadata)
}

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function FaqIndexPage({ searchParams }: PageProps) {
  const { category: categorySlug } = await searchParams

  const [faqs, categories] = await Promise.all([
    getAllFaqs(categorySlug),
    getAllFaqCategories(),
  ])

  // Build FAQPage JSON-LD from all visible FAQs (truncate answer to 300 chars for index)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 20).map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: (faq.excerpt ?? '').substring(0, 300),
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-kawai-pearl">
        {/* Page Header */}
        <section className="bg-kawai-charcoal text-white py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300">
              Everything you need to know about KAWAI pianos, purchasing, financing, and more.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 0 && (
          <section className="bg-white border-b border-kawai-neutral">
            <div className="container mx-auto px-6 max-w-4xl py-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Link
                  href="/faq"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !categorySlug
                      ? 'bg-kawai-red text-white'
                      : 'bg-kawai-pearl text-kawai-charcoal hover:bg-kawai-neutral'
                  }`}
                >
                  All Questions
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/faq?category=${cat.slug}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      categorySlug === cat.slug
                        ? 'bg-kawai-red text-white'
                        : 'bg-kawai-pearl text-kawai-charcoal hover:bg-kawai-neutral'
                    }`}
                    style={
                      cat.color && categorySlug === cat.slug
                        ? { backgroundColor: cat.color }
                        : undefined
                    }
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ List */}
        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {faqs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-kawai-charcoal/60">
                  {categorySlug ? 'No FAQs found in this category.' : 'No FAQs available yet.'}
                </p>
                {categorySlug && (
                  <Link
                    href="/faq"
                    className="inline-block mt-4 text-kawai-red hover:underline font-medium"
                  >
                    View all FAQs
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq: any) => (
                  <article
                    key={faq.id}
                    className="bg-white rounded-xl border border-kawai-neutral p-6 hover:border-kawai-red/30 hover:shadow-md transition-all"
                  >
                    {/* Category badges */}
                    {Array.isArray(faq.categories) && faq.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {faq.categories.map((cat: any) => {
                          const catObj = typeof cat === 'object' ? cat : null
                          if (!catObj) return null
                          return (
                            <Link
                              key={catObj.id}
                              href={`/faq?category=${catObj.slug}`}
                              className="text-xs font-medium px-2.5 py-1 rounded-full bg-kawai-pearl text-kawai-charcoal hover:bg-kawai-neutral transition-colors"
                              style={catObj.color ? { backgroundColor: `${catObj.color}20`, color: catObj.color } : undefined}
                            >
                              {catObj.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}

                    <h2 className="text-lg font-semibold text-kawai-charcoal mb-2">
                      <Link
                        href={`/faq/${faq.slug}`}
                        className="hover:text-kawai-red transition-colors"
                      >
                        {faq.question}
                      </Link>
                    </h2>

                    {faq.excerpt && (
                      <p className="text-kawai-charcoal/70 text-sm leading-relaxed mb-3">
                        {faq.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/faq/${faq.slug}`}
                      className="inline-flex items-center gap-1.5 text-kawai-red text-sm font-medium hover:gap-2.5 transition-all"
                    >
                      Read full answer
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-white border-t border-kawai-neutral">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-kawai-charcoal mb-3">
              Still have questions?
            </h2>
            <p className="text-kawai-charcoal/70 mb-6">
              Our piano specialists are happy to help you find the perfect instrument.
            </p>
            <Link
              href="/pianos"
              className="inline-flex items-center gap-2 bg-kawai-red text-white px-6 py-3 rounded-lg hover:bg-kawai-red/90 transition-colors font-medium"
            >
              Explore Our Pianos
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
