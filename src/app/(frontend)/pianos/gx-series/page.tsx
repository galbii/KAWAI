import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getProductsByModelPrefix } from '@/lib/payload/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'GX BLAK Grand Series | Kawai Acoustic Grand Pianos',
  description:
    "The Kawai GX BLAK Series — professional acoustic grand pianos with Millennium III ABS-Carbon action. Five sizes, from salon to concert hall. Compare GX-1 through GX-7.",
  keywords: [
    'kawai GX BLAK',
    'kawai grand piano',
    'kawai GX-2 review',
    'kawai acoustic grand piano price',
    'kawai GX BLAK series',
    'professional acoustic grand piano',
    'kawai GX grand piano review',
  ],
  openGraph: {
    title: 'GX BLAK Grand Series | Kawai Acoustic Grand Pianos',
    description:
      'Professional acoustic grand pianos with Millennium III ABS-Carbon action. Five sizes built for serious pianists.',
    type: 'website',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GX BLAK Grand Series | Kawai Acoustic Grand Pianos',
    description:
      'Professional acoustic grand pianos with Millennium III ABS-Carbon action. Five sizes built for serious pianists.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/gx-series`,
  },
}

function getDisplayPrice(product: {
  price?: { msrp?: number | null } | null
  variations?: { price?: number | null; available?: boolean | null }[] | null
}): string {
  if (product.price?.msrp) {
    return `$${product.price.msrp.toLocaleString('en-US')}`
  }

  const variationPrices = (product.variations ?? [])
    .filter((v) => v.available === true && v.price != null)
    .map((v) => v.price as number)

  if (variationPrices.length > 0) {
    const min = Math.min(...variationPrices)
    return `from $${min.toLocaleString('en-US')}`
  }

  return 'Contact for pricing'
}

const MILLENNIUM_FEATURES = [
  {
    title: 'ABS-Carbon Parts',
    body: 'Carbon fiber composite action parts resist humidity and temperature changes, maintaining consistent touch across any climate.',
  },
  {
    title: 'Optimized Repetition',
    body: 'Precision-engineered action geometry delivers consistent, responsive repetition — enabling nuanced expressive control in technically demanding passages.',
  },
  {
    title: 'Tapered Soundboard',
    body: 'Each GX soundboard is hand-tapered by craftsmen to optimize resonance and projection across all registers.',
  },
]

export default async function GxSeriesPage() {
  const products = await getProductsByModelPrefix('GX')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Grand Pianos', item: `${siteUrl}/pianos/grand` },
          { '@type': 'ListItem', position: 3, name: 'GX BLAK Series', item: `${siteUrl}/pianos/gx-series` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Kawai GX BLAK Grand Series',
        description: 'Kawai GX BLAK Series professional acoustic grand pianos',
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
    <main className="font-[family-name:var(--font-brand-sans)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-kawai-black px-6 py-20 md:py-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs tracking-wider text-kawai-neutral/60 uppercase">
            <Link href="/pianos" className="hover:text-kawai-neutral transition-colors">
              Pianos
            </Link>
            <span className="mx-2 text-kawai-neutral/40">/</span>
            <Link href="/pianos/grand" className="hover:text-kawai-neutral transition-colors">
              Grand
            </Link>
            <span className="mx-2 text-kawai-neutral/40">/</span>
            <span className="text-kawai-neutral/80">GX BLAK Series</span>
          </nav>

          {/* Series label */}
          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-gold uppercase">
            GX BLAK Series
          </p>

          {/* H1 */}
          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            Engineered for the stage.
            <br />
            Built to last generations.
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-2xl text-base text-kawai-neutral/70 md:text-lg">
            Millennium III ABS-Carbon action brings professional-grade touch and response to every
            GX BLAK grand — five sizes of acoustic performance for the serious pianist.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {['Millennium III Action', '5 Grand Sizes'].map((label) => (
              <span
                key={label}
                className="inline-flex items-center border border-kawai-neutral/20 bg-white/5 px-4 py-2 text-sm text-kawai-neutral"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Grid ────────────────────────────────────── */}
      <section className="bg-white px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-semibold text-kawai-black">GX BLAK Models</h2>

          {products.length === 0 ? (
            <p className="text-kawai-charcoal">No models found at this time.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const specs = (product.specifications ?? []).slice(0, 4)
                const displayPrice = getDisplayPrice(product)

                return (
                  <article
                    key={product.slug}
                    className={cn(
                      'group flex flex-col border border-kawai-neutral bg-white',
                      'transition-shadow duration-300 hover:shadow-brand-medium',
                    )}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-kawai-pearl">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={`Kawai ${product.model} acoustic grand piano`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-3xl font-bold tracking-wider text-kawai-neutral">
                            {product.model}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Model + Name */}
                      <h2 className="text-2xl font-bold text-kawai-black">{product.model}</h2>
                      {product.name && (
                        <p className="mt-0.5 text-sm text-kawai-charcoal">{product.name}</p>
                      )}

                      {/* Price */}
                      <p className="mt-3 text-base font-semibold text-kawai-red">{displayPrice}</p>

                      {/* Key specs */}
                      {specs.length > 0 && (
                        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-kawai-neutral pt-4">
                          {specs.map((spec, i) => (
                            <div key={i} className="col-span-2">
                              <div className="flex gap-1 text-xs text-kawai-charcoal">
                                <dt className="font-medium text-kawai-black shrink-0">
                                  {spec.spec}:
                                </dt>
                                <dd className="truncate">{spec.details ?? spec.type ?? '—'}</dd>
                              </div>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-6">
                        <Link
                          href={`/products/${product.slug}`}
                          className={cn(
                            'inline-flex items-center gap-1 text-sm font-medium',
                            'text-kawai-black border-b border-kawai-black/0',
                            'hover:text-kawai-red hover:border-kawai-red transition-colors duration-200',
                          )}
                        >
                          Explore {product.model}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Grand Lineup Context ─────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            Kawai Acoustic Grand Piano Lineup
          </p>
          {/* Three-tier ladder: GL → GX → SK */}
          <div className="grid grid-cols-1 gap-px bg-kawai-neutral md:grid-cols-3">
            {[
              {
                slug: '/pianos/gl-series',
                label: 'GL Series',
                sub: 'Entry acoustic grands',
                note: 'Five sizes, from 5\'0"',
                active: false,
                tier: 'Entry',
              },
              {
                slug: '/pianos/gx-series',
                label: 'GX BLAK Series',
                sub: 'Professional grands',
                note: 'Millennium III ABS-Carbon',
                active: true,
                tier: 'Professional',
              },
              {
                slug: '/pianos/shigeru-kawai',
                label: 'Shigeru Kawai',
                sub: 'Concert grands',
                note: 'Handcrafted, Ryuyo factory',
                active: false,
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
                    : 'bg-white text-kawai-black hover:bg-kawai-pearl/60',
                )}
              >
                <span
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase',
                    item.active ? 'text-kawai-red' : 'text-kawai-charcoal/50',
                  )}
                >
                  {item.tier}
                </span>
                <span className="text-base font-semibold">{item.label}</span>
                <span
                  className={cn(
                    'text-xs',
                    item.active ? 'text-kawai-neutral/60' : 'text-kawai-charcoal/60',
                  )}
                >
                  {item.note}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="text-sm text-kawai-charcoal/70 max-w-md">
              Compare Kawai&apos;s full grand piano range — from accessible entry grands to handcrafted
              Shigeru concert instruments.
            </p>
            <Link
              href="/pianos/grand"
              className={cn(
                'shrink-0 inline-flex items-center gap-2 border border-kawai-black px-6 py-3',
                'text-sm font-medium text-kawai-black',
                'hover:bg-kawai-black hover:text-white transition-colors duration-300',
              )}
            >
              Compare All Grand Pianos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Millennium III Feature Strip ─────────────────────── */}
      <section className="border-y border-kawai-neutral bg-kawai-pearl px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-kawai-black">
            The Millennium III Advantage
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {MILLENNIUM_FEATURES.map(({ title, body }) => (
              <div key={title}>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-kawai-black uppercase">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-kawai-charcoal">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bar ──────────────────────────────────────────── */}
      <section className="bg-kawai-black px-6 py-16 text-center lg:px-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-8 text-lg font-medium text-white">Experience the GX BLAK Series</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/find-a-dealer"
              className={cn(
                'inline-flex items-center justify-center px-7 py-3 text-sm font-semibold',
                'bg-kawai-red text-white transition-colors duration-200 hover:bg-kawai-red-700',
              )}
            >
              Find a Dealer
            </Link>
            <Link
              href="/pianos/grand"
              className={cn(
                'inline-flex items-center justify-center border border-kawai-neutral/40 px-7 py-3',
                'text-sm font-semibold text-kawai-neutral transition-colors duration-200',
                'hover:border-kawai-neutral hover:text-white',
              )}
            >
              Compare All Grand Pianos
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
