import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Shigeru Kawai | Concert Grand Pianos',
  description:
    "Shigeru Kawai concert grands are handcrafted at Kawai's Ryuyo factory in Japan. Each instrument is individually voiced and approved — chosen for the International Tchaikovsky Competition.",
  keywords: [
    'shigeru kawai',
    'shigeru kawai SK-EX',
    'japanese concert grand piano',
    'kawai concert grand',
    'shigeru kawai price',
    'shigeru kawai review',
  ],
  openGraph: {
    title: 'Shigeru Kawai | Concert Grand Pianos',
    description:
      "Handcrafted at Kawai's Ryuyo factory. Each Shigeru Kawai is individually voiced and approved — the pinnacle of Japanese piano craftsmanship.",
    type: 'website',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shigeru Kawai | Concert Grand Pianos',
    description:
      "Handcrafted at Kawai's Ryuyo factory. Each Shigeru Kawai is individually voiced and approved — the pinnacle of Japanese piano craftsmanship.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/shigeru-kawai`,
  },
}

export const revalidate = 3600

const craftsmanshipPillars = [
  {
    title: 'Ryuyo Factory',
    body: 'Every Shigeru Kawai is built in Japan, where our most skilled craftsmen hand-select tone materials and voice each piano individually.',
  },
  {
    title: 'Tchaikovsky Competition',
    body: "The SK-EX is the official piano of one of classical music's most prestigious international competitions.",
  },
  {
    title: 'Master Artisan Heritage',
    body: 'Named after Shigeru Kawai, former president and master piano designer, whose vision defines every instrument in this collection.',
  },
]

export default async function ShigeruKawaiPage() {
  const products = await getProductsByModelPrefix('SK-')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Shigeru Kawai', item: `${siteUrl}/pianos/shigeru-kawai` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Shigeru Kawai Concert Grand Pianos',
        description: 'Shigeru Kawai handcrafted concert grand pianos from the Ryuyo factory in Japan',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name ?? p.model,
            url: `${siteUrl}/products/${p.slug}`,
            image: p.imageUrl ?? undefined,
            brand: { '@type': 'Brand', name: 'Kawai' },
            description: p.description ?? undefined,
          },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-kawai-black text-white py-28 lg:py-40">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          {/* Breadcrumb */}
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-10 font-[family-name:var(--font-brand-sans)]">
            Pianos&nbsp;/&nbsp;Shigeru Kawai
          </p>

          {/* Series label */}
          <p
            className={cn(
              'text-kawai-gold text-sm tracking-[0.3em] uppercase mb-6',
              'font-[family-name:var(--font-brand-luxury)]',
            )}
          >
            Shigeru Kawai
          </p>

          {/* H1 tagline */}
          <h1
            className={cn(
              'text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8',
              'font-[family-name:var(--font-brand-luxury)]',
            )}
          >
            The pursuit of perfection.
            <br />
            Realized.
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 font-[family-name:var(--font-brand-sans)]">
            Handcrafted by master artisans at Kawai's Ryuyo factory. Each piano is tuned, voiced,
            and approved by name.
          </p>

          {/* Badge */}
          <p className="text-kawai-gold/80 text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-brand-sans)]">
            Official Piano&nbsp;·&nbsp;International Tchaikovsky Competition
          </p>
        </div>
      </section>

      {/* ── Collection ───────────────────────────────────────── */}
      <section className="bg-kawai-pearl py-24 lg:py-36">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section title */}
          <h2
            className={cn(
              'text-center text-4xl md:text-5xl mb-20 text-kawai-black',
              'font-[family-name:var(--font-brand-luxury)]',
            )}
          >
            The Collection
          </h2>

          {products.length === 0 ? (
            <p className="text-center text-kawai-charcoal font-[family-name:var(--font-brand-sans)]">
              Collection coming soon.
            </p>
          ) : (
            <div>
              {products.map((product, index) => {
                const isEven = index % 2 === 0
                const specs = Array.isArray(product.specifications) ? product.specifications : []
                const displaySpecs = specs.slice(0, 5)

                return (
                  <div key={product.id ?? product.slug ?? index}>
                    {index > 0 && <div className="border-t border-kawai-neutral" />}

                    <div
                      className={cn(
                        'flex flex-col lg:flex-row items-stretch gap-0',
                        !isEven && 'lg:flex-row-reverse',
                      )}
                    >
                      {/* Image side */}
                      <div className="lg:w-1/2">
                        {product.imageUrl ? (
                          <div className="relative aspect-[4/3] w-full">
                            <Image
                              src={product.imageUrl}
                              alt={product.name ?? product.model ?? 'Shigeru Kawai piano'}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] w-full bg-kawai-black flex items-center justify-center">
                            <span
                              className={cn(
                                'text-kawai-gold text-3xl tracking-widest',
                                'font-[family-name:var(--font-brand-luxury)]',
                              )}
                            >
                              {product.model ?? 'SK'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details side */}
                      <div className="lg:w-1/2 flex flex-col justify-center px-8 py-14 lg:px-16 lg:py-20">
                        {/* Model */}
                        <p
                          className={cn(
                            'text-kawai-gold text-sm tracking-[0.2em] uppercase mb-3',
                            'font-[family-name:var(--font-brand-luxury)]',
                          )}
                        >
                          {product.model}
                        </p>

                        {/* Name */}
                        <h2
                          className={cn(
                            'text-3xl md:text-4xl text-kawai-black mb-5 leading-tight',
                            'font-[family-name:var(--font-brand-luxury)]',
                          )}
                        >
                          {product.name}
                        </h2>

                        {/* Description */}
                        {product.description && (
                          <p className="text-kawai-charcoal leading-relaxed mb-8 line-clamp-2 font-[family-name:var(--font-brand-sans)]">
                            {product.description}
                          </p>
                        )}

                        {/* Specs table */}
                        {displaySpecs.length > 0 && (
                          <div className="mb-10">
                            <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
                              {displaySpecs.map((spec, i) => (
                                <div key={i} className="col-span-1">
                                  <dt className="text-xs uppercase tracking-[0.12em] text-kawai-charcoal/60 mb-0.5 font-[family-name:var(--font-brand-sans)]">
                                    {spec.spec}
                                  </dt>
                                  <dd className="text-sm text-kawai-black font-[family-name:var(--font-brand-sans)]">
                                    {spec.details ?? '—'}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}

                        {/* Pricing + CTA */}
                        <div className="flex items-center gap-8">
                          <p className="text-kawai-charcoal text-sm font-[family-name:var(--font-brand-sans)]">
                            Contact for Pricing
                          </p>
                          <Link
                            href="/find-a-dealer"
                            className={cn(
                              'text-sm text-kawai-black border-b border-kawai-black pb-0.5',
                              'hover:text-kawai-gold hover:border-kawai-gold transition-colors duration-200',
                              'font-[family-name:var(--font-brand-sans)]',
                            )}
                          >
                            Request Information&nbsp;→
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Grand Piano Lineup ───────────────────────────────── */}
      {/* Positioned before craftsmanship: grounds Shigeru in context
          without diminishing it — helps users who need a different tier */}
      <section className="bg-white border-y border-kawai-neutral py-14">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <p
            className={cn(
              'mb-8 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            Kawai Acoustic Grand Piano Lineup
          </p>
          <div className="grid grid-cols-1 gap-px bg-kawai-neutral md:grid-cols-3">
            {[
              {
                slug: '/pianos/gl-series',
                label: 'GL Series',
                note: 'Entry acoustic grands — five sizes from 5\'0"',
                active: false,
                tier: 'Entry',
              },
              {
                slug: '/pianos/gx-series',
                label: 'GX BLAK Series',
                note: 'Professional grands — Millennium III ABS-Carbon action',
                active: false,
                tier: 'Professional',
              },
              {
                slug: '/pianos/shigeru-kawai',
                label: 'Shigeru Kawai',
                note: 'Concert grands — handcrafted, Ryuyo factory',
                active: true,
                tier: 'Concert',
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.slug}
                className={cn(
                  'flex flex-col gap-2 px-6 py-6 transition-colors duration-200',
                  item.active
                    ? 'bg-kawai-black text-white'
                    : 'bg-kawai-pearl text-kawai-black hover:bg-kawai-pearl/60',
                  'font-[family-name:var(--font-brand-sans)]',
                )}
              >
                <span
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase',
                    item.active ? 'text-kawai-gold' : 'text-kawai-charcoal/50',
                  )}
                >
                  {item.tier}
                </span>
                <span className="text-base font-semibold">{item.label}</span>
                <span
                  className={cn(
                    'text-xs leading-relaxed',
                    item.active ? 'text-kawai-neutral/60' : 'text-kawai-charcoal/60',
                  )}
                >
                  {item.note}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p
              className={cn(
                'text-sm text-kawai-charcoal/70 max-w-md',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              Exploring acoustic grands at other price points? Browse Kawai&apos;s full grand piano
              lineup, from the GL entry series to the professional GX BLAK collection.
            </p>
            <Link
              href="/pianos/grand"
              className={cn(
                'shrink-0 inline-flex items-center gap-2 border border-kawai-black px-6 py-3',
                'text-sm font-medium text-kawai-black tracking-wide',
                'hover:bg-kawai-black hover:text-white transition-colors duration-300',
                'font-[family-name:var(--font-brand-sans)]',
              )}
            >
              Explore Grand Piano Lineup <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Craftsmanship ────────────────────────────────────── */}
      <section className="bg-kawai-black text-white py-24 lg:py-36">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <h2
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl mb-16 leading-tight',
              'font-[family-name:var(--font-brand-luxury)]',
            )}
          >
            Built by name.
            <br />
            Played on the world's stages.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {craftsmanshipPillars.map((pillar) => (
              <div key={pillar.title}>
                <div className="w-6 h-px bg-kawai-gold mb-6" />
                <h3
                  className={cn(
                    'text-kawai-gold text-sm tracking-[0.15em] uppercase mb-4',
                    'font-[family-name:var(--font-brand-luxury)]',
                  )}
                >
                  {pillar.title}
                </h3>
                <p className="text-white/60 leading-relaxed text-sm font-[family-name:var(--font-brand-sans)]">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bar ──────────────────────────────────────────── */}
      <section className="bg-kawai-pearl border-t border-kawai-neutral py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl">
          <p className="text-kawai-charcoal text-base md:text-lg font-[family-name:var(--font-brand-sans)]">
            Shigeru Kawai pianos are available by private appointment.
          </p>
          <Link
            href="/find-a-dealer"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-3 shrink-0',
              'border border-kawai-black text-kawai-black text-sm tracking-[0.1em] uppercase',
              'hover:bg-kawai-black hover:text-white transition-colors duration-300',
              'font-[family-name:var(--font-brand-sans)]',
            )}
          >
            Arrange a Private Audition
          </Link>
        </div>
      </section>
    </div>
  )
}
