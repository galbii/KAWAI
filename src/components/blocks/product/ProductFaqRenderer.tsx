import 'server-only'
import { ProductFaqAccordion } from './ProductFaqAccordion'
import type { Product, Faq } from '@/payload-types'

// Props are spread from BlockRenderer (same pattern as RelatedProductsRenderer)
// ProductFaqBlock type will be available after next build — using inline interface
interface ProductFaqRendererProps {
  heading?: string | null
  subheading?: string | null
  theme?: 'pearl' | 'white' | 'charcoal' | null
  showViewAllLink?: boolean | null
  /** Injected by BlockRenderer — the current page's product document */
  product: Product
}

export async function ProductFaqRenderer({
  heading,
  subheading,
  theme,
  showViewAllLink,
  product,
}: ProductFaqRendererProps) {
  if (!product) return null

  // product.faqs is populated at depth 2 by getProductBySlugDirect.
  // Filter to only fully-populated Faq objects (not bare string IDs).
  const faqs = (product.faqs ?? []).filter(
    (f): f is Faq => typeof f === 'object' && f !== null,
  )
  if (faqs.length === 0) return null

  const bgClass =
    theme === 'charcoal'
      ? 'bg-kawai-charcoal'
      : theme === 'white'
        ? 'bg-white'
        : 'bg-kawai-pearl'

  const isDark = theme === 'charcoal'

  return (
    <section className={`${bgClass} py-16 md:py-24`}>
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="text-xs text-kawai-red font-medium tracking-[0.2em] uppercase mb-3">
            Support
          </div>
          <h2
            className={`text-3xl md:text-4xl font-light font-[family-name:var(--font-brand-serif)] ${isDark ? 'text-white' : 'text-kawai-black'} mb-3`}
          >
            {heading ?? 'FAQ'}
          </h2>
          {subheading && (
            <p className={`text-lg ${isDark ? 'text-white/70' : 'text-kawai-charcoal/70'}`}>
              {subheading}
            </p>
          )}
        </div>

        {/* FAQ JSON-LD schema */}
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.excerpt ?? f.question,
                  },
                })),
              }),
            }}
          />
        )}

        {/* Accordion — client component */}
        <ProductFaqAccordion
          faqs={faqs.map((f) => ({
            id: String(f.id),
            question: f.question,
            slug: f.slug ?? '',
            excerpt: f.excerpt ?? null,
          }))}
          isDark={isDark}
        />

        {/* View all link */}
        {showViewAllLink && (
          <div className="mt-8 pt-6 border-t border-kawai-neutral/50">
            <a
              href="/technical-support-division"
              className="inline-flex items-center gap-2 text-kawai-red font-medium hover:gap-3 transition-all text-sm"
            >
              Visit our full support center
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
