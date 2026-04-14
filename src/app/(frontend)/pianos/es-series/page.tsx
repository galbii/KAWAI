import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn, formatPrice } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'ES Portable Series | Kawai Digital Pianos',
  description:
    'The Kawai ES Series delivers professional touch in a portable format. Responsive Hammer action, premium sound, and professional outputs — ideal for gigging, teaching, and home practice.',
  keywords: ['kawai ES series', 'kawai portable digital piano', 'kawai ES920 review', 'best portable piano'],
  openGraph: {
    title: 'ES Portable Series | Kawai Digital Pianos',
    description:
      'Professional piano touch in a portable format. The ES Series is built for musicians who need authentic feel wherever they play.',
    type: 'website',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ES Portable Series | Kawai Digital Pianos',
    description:
      'Professional piano touch in a portable format. The ES Series is built for musicians who need authentic feel wherever they play.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/es-series`,
  },
}

const featureStrip = [
  {
    title: 'Stage-Ready',
    body: 'Professional audio outputs and connectivity make the ES Series at home on any stage — play through any PA, studio monitor, or home hi-fi.',
  },
  {
    title: 'Authentic Touch',
    body: 'Responsive Hammer Compact action gives each key the graded weight and springback of an acoustic grand.',
  },
  {
    title: 'Built to Travel',
    body: 'Lightweight, compact, and durable — designed for musicians who never stop moving.',
  },
]

export default async function EsSeriesPage() {
  const products = await getProductsByModelPrefix('ES')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Digital Pianos', item: `${siteUrl}/pianos/digital` },
          { '@type': 'ListItem', position: 3, name: 'ES Portable Series', item: `${siteUrl}/pianos/es-series` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Kawai ES Portable Series',
        description: 'Kawai ES Series portable digital pianos with Responsive Hammer action',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name ?? p.model,
            url: `${siteUrl}/products/${p.slug}`,
            image: p.imageUrl ?? undefined,
            brand: { '@type': 'Brand', name: 'Kawai' },
            ...(p.price?.msrp
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: p.price.msrp,
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStoreOnly',
                    seller: { '@type': 'Organization', name: 'Kawai America' },
                  },
                }
              : {}),
          },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-kawai-pearl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl pt-12 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <p className="text-xs text-kawai-charcoal/60 tracking-wide mb-6 font-[family-name:var(--font-brand-sans)]">
            <Link href="/pianos" className="hover:text-kawai-red transition-colors">Pianos</Link>
            <span className="mx-2">/</span>
            <Link href="/pianos/digital" className="hover:text-kawai-red transition-colors">Digital</Link>
            <span className="mx-2">/</span>
            <span className="text-kawai-black">ES Series</span>
          </p>

          {/* Series label */}
          <p
            className={cn(
              'text-kawai-red text-xs font-semibold tracking-[0.2em] uppercase mb-4',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            ES Portable Series
          </p>

          {/* H1 */}
          <h1
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl text-kawai-black leading-tight mb-5',
              'font-[family-name:var(--font-brand-luxury)]',
            )}
          >
            Professional touch.
            <br />
            Take it anywhere.
          </h1>

          {/* Subtitle */}
          <p className="text-kawai-charcoal text-lg max-w-2xl mb-8 leading-relaxed font-[family-name:var(--font-brand-sans)]">
            Responsive Hammer Compact action delivers the weighted, graded feel of an acoustic grand
            in an instrument light enough to carry to every gig, lesson, or rehearsal.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {['Stage-Ready Sound', 'Responsive Hammer Action'].map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-4 py-2 border border-kawai-neutral rounded-full text-sm text-kawai-black font-medium font-[family-name:var(--font-brand-sans)]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Grid ──────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {products.length === 0 ? (
            <p className="text-kawai-charcoal text-center py-16 font-[family-name:var(--font-brand-sans)]">
              Products are being updated. Please check back shortly.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => {
                const msrp =
                  product.price?.msrp ??
                  (Array.isArray(product.variations) && product.variations.length > 0
                    ? Math.min(
                        ...product.variations
                          .map((v) => v.price ?? null)
                          .filter((p): p is number => typeof p === 'number'),
                      )
                    : null)

                const topSpecs = Array.isArray(product.specifications)
                  ? product.specifications.slice(0, 3)
                  : []

                return (
                  <article
                    key={product.slug}
                    className="bg-white border border-kawai-neutral flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-medium"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-kawai-pearl">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name ?? product.model ?? 'Kawai ES Series Piano'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={cn(
                              'text-3xl font-bold text-kawai-neutral',
                              'font-[family-name:var(--font-brand-sans)]',
                            )}
                          >
                            {product.model ?? 'ES'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-6">
                      {/* Model + Name */}
                      <h2
                        className={cn(
                          'text-2xl font-bold text-kawai-black mb-1',
                          'font-[family-name:var(--font-brand-sans)]',
                        )}
                      >
                        {product.model ?? ''}
                      </h2>
                      {product.name && (
                        <p className="text-sm text-kawai-charcoal mb-4 font-[family-name:var(--font-brand-sans)]">
                          {product.name}
                        </p>
                      )}

                      {/* Price */}
                      {msrp != null && (
                        <p className="text-kawai-red font-semibold text-lg mb-5 font-[family-name:var(--font-brand-sans)]">
                          {formatPrice(msrp)}
                        </p>
                      )}

                      {/* Key specs */}
                      {topSpecs.length > 0 && (
                        <dl className="space-y-2 mb-6 flex-1">
                          {topSpecs.map((spec, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-xs border-b border-kawai-neutral pb-2 font-[family-name:var(--font-brand-sans)]"
                              >
                                <dt className="text-kawai-charcoal font-medium">{spec.spec}</dt>
                                <dd className="text-kawai-black text-right max-w-[55%]">
                                  {spec.details ?? spec.type ?? '—'}
                                </dd>
                              </div>
                            ),
                          )}
                        </dl>
                      )}

                      {/* CTA */}
                      <Link
                        href={`/products/${product.slug}`}
                        className={cn(
                          'mt-auto inline-flex items-center text-sm font-medium text-kawai-black',
                          'hover:text-kawai-red transition-colors duration-200',
                          'font-[family-name:var(--font-brand-sans)]',
                        )}
                      >
                        Explore {product.model} →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Lineup Context ────────────────────────────────────────── */}
      <section className="bg-white px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="mb-8 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase font-[family-name:var(--font-brand-sans)]">
            Kawai Digital Piano Lineup
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-kawai-neutral">
            {[
              {
                slug: '/pianos/es-series',
                label: 'ES Series',
                sub: 'Portable & stage',
                active: true,
              },
              {
                slug: '/pianos/digital',
                label: 'CN Series',
                sub: 'Home cabinet',
                active: false,
              },
              {
                slug: '/pianos/ca-series',
                label: 'CA Series',
                sub: 'Wooden key action',
                active: false,
              },
              {
                slug: '/pianos/digital',
                label: 'KDP Series',
                sub: 'Entry & beginner',
                active: false,
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.slug}
                className={cn(
                  'flex flex-col gap-1 px-5 py-5 transition-colors duration-200',
                  item.active
                    ? 'bg-kawai-black text-white'
                    : 'bg-white text-kawai-black hover:bg-kawai-pearl',
                  'font-[family-name:var(--font-brand-sans)]',
                )}
              >
                <span className={cn('text-sm font-semibold', item.active && 'text-kawai-red')}>
                  {item.label}
                </span>
                <span
                  className={cn(
                    'text-xs',
                    item.active ? 'text-kawai-neutral/70' : 'text-kawai-charcoal/60',
                  )}
                >
                  {item.sub}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="text-sm text-kawai-charcoal/70 max-w-md font-[family-name:var(--font-brand-sans)]">
              Need a home piano instead? The CA and CN series offer furniture-style cabinets with
              the same Kawai action quality.
            </p>
            <Link
              href="/pianos/digital"
              className={cn(
                'shrink-0 inline-flex items-center gap-2 border border-kawai-black px-6 py-3',
                'text-sm font-medium text-kawai-black',
                'hover:bg-kawai-black hover:text-white transition-colors duration-300',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              Compare All Digital Pianos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Strip ─────────────────────────────────────────── */}
      <section className="bg-kawai-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {featureStrip.map(({ title, body }) => (
            <div key={title} className="px-8 py-8 md:py-0 first:pl-0 last:pr-0">
              <h3
                className={cn(
                  'text-base font-semibold tracking-wide mb-3 text-white',
                  'font-[family-name:var(--font-brand-sans)]',
                )}
              >
                {title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed font-[family-name:var(--font-brand-sans)]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Bar ───────────────────────────────────────────────── */}
      <section className="bg-kawai-red text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className={cn(
              'text-2xl md:text-3xl font-semibold mb-8',
              'font-[family-name:var(--font-brand-luxury)]',
            )}
          >
            Find your perfect portable piano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-a-dealer"
              className={cn(
                'inline-flex items-center justify-center px-6 py-3 border border-white text-white text-sm font-medium',
                'hover:bg-white hover:text-kawai-red transition-colors duration-200',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              Find a Dealer
            </Link>
            <Link
              href="/pianos/digital"
              className={cn(
                'inline-flex items-center justify-center px-6 py-3 text-white/80 text-sm font-medium',
                'hover:text-white transition-colors duration-200',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              Explore All Digital Pianos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
