import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getProductsByModelPrefix } from '@/lib/payload/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Concert Artist Series | Kawai Digital Pianos',
  description:
    'The Kawai CA Series features Grand Feel wooden key actions for an authentic acoustic grand piano touch. Compare CA401, CA501, CA701, and CA901 digital pianos.',
  keywords: [
    'kawai concert artist',
    'wooden key digital piano',
    'kawai CA series',
    'grand feel action',
    'best digital piano with wooden keys',
    'kawai concert artist review',
  ],
  openGraph: {
    title: 'Concert Artist Series | Kawai Digital Pianos',
    description:
      'Grand Feel wooden key actions. Shigeru SK-EX samples. The CA Series brings acoustic grand piano authenticity into your home.',
    type: 'website',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concert Artist Series | Kawai Digital Pianos',
    description:
      'Grand Feel wooden key actions. Shigeru SK-EX samples. The CA Series brings acoustic grand piano authenticity into your home.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/ca-series`,
  },
}

function formatPrice(msrp: number | null | undefined): string {
  if (!msrp) return 'Contact for price'
  return `from $${msrp.toLocaleString('en-US')}`
}

function getDisplayPrice(product: {
  price?: { msrp?: number | null } | null
  variations?: { price?: number | null; available?: boolean | null }[] | null
}): string {
  if (product.price?.msrp) return formatPrice(product.price.msrp)

  const variationPrices = (product.variations ?? [])
    .filter((v) => v.available === true && v.price != null)
    .map((v) => v.price as number)

  if (variationPrices.length > 0) {
    const min = Math.min(...variationPrices)
    return `from $${min.toLocaleString('en-US')}`
  }

  return 'Contact for price'
}

const FEATURE_STRIP = [
  {
    title: 'Grand Feel Wooden Keys',
    body: 'Solid wood keys move and flex with the same physics as an acoustic grand — delivering a touch response that matches what you feel at the concert hall.',
  },
  {
    title: 'Shigeru SK-EX Samples',
    body: "Sound captured from Kawai's 9-foot SK-EX concert grand in stereo binaural.",
  },
  {
    title: 'Resonance Modeling',
    body: 'Sympathetic string resonance, damper resonance, and key-off simulation fill every note with acoustic life.',
  },
]

export default async function CaSeriesPage() {
  const products = await getProductsByModelPrefix('CA')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Digital Pianos', item: `${siteUrl}/pianos/digital` },
          { '@type': 'ListItem', position: 3, name: 'Concert Artist Series', item: `${siteUrl}/pianos/ca-series` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Kawai Concert Artist Series',
        description: 'Kawai CA Series digital pianos with Grand Feel wooden key action',
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
            <Link href="/pianos/digital" className="hover:text-kawai-neutral transition-colors">
              Digital
            </Link>
            <span className="mx-2 text-kawai-neutral/40">/</span>
            <span className="text-kawai-neutral/80">Concert Artist Series</span>
          </nav>

          {/* Series label */}
          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-red uppercase">
            Concert Artist Series
          </p>

          {/* H1 */}
          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            The touch of a grand.
            <br />
            The soul of Kawai.
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-2xl text-base text-kawai-neutral/70 md:text-lg">
            Grand Feel wooden key actions bring the physics of an acoustic grand piano to every CA
            Series instrument — a level of touch authenticity that connects the player to the music.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {['Wooden Key Action', 'Shigeru SK-EX Samples'].map((label) => (
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
      <section className="bg-kawai-pearl px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-2xl font-semibold text-kawai-black">CA Series Models</h2>

          {products.length === 0 ? (
            <p className="text-kawai-charcoal">No models found at this time.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => {
                const specs = (product.specifications ?? []).slice(0, 3)
                const topHighlights = (product.highlights ?? []).slice(0, 2)
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
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-kawai-pearl">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={`Kawai ${product.model} digital piano`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
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
                    <div className="flex flex-1 flex-col p-5">
                      {/* Model + Name */}
                      <h2 className="text-xl font-bold text-kawai-black">{product.model}</h2>
                      {product.name && (
                        <p className="mt-0.5 text-sm text-kawai-charcoal">{product.name}</p>
                      )}

                      {/* Price */}
                      <p className="mt-3 text-sm font-semibold text-kawai-red">{displayPrice}</p>

                      {/* Key specs */}
                      {specs.length > 0 && (
                        <ul className="mt-4 space-y-1 border-t border-kawai-neutral pt-4">
                          {specs.map((spec, i) => (
                            <li key={i} className="flex gap-1 text-xs text-kawai-charcoal">
                              <span className="font-medium text-kawai-black">{spec.spec}:</span>
                              <span>{spec.details ?? spec.type ?? '—'}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Highlights */}
                      {topHighlights.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {topHighlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-1.5 text-xs text-kawai-charcoal"
                            >
                              <span className="mt-0.5 text-kawai-red">•</span>
                              <span>{h.highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-5">
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

      {/* ── Lineup Context ───────────────────────────────────── */}
      {/* Positions the CA in the broader digital lineup — helps users
          who may need a different series, and drives category-page traffic */}
      <section className="bg-white px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            Kawai Digital Piano Lineup
          </p>
          <div className="grid grid-cols-2 gap-px bg-kawai-neutral md:grid-cols-4">
            {[
              {
                slug: '/pianos/es-series',
                label: 'ES Series',
                sub: 'Portable & stage',
                active: false,
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
                active: true,
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
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-kawai-charcoal/70 max-w-md">
              Browse Kawai&apos;s complete digital piano lineup to compare series by action type,
              cabinet style, and price.
            </p>
            <Link
              href="/pianos/digital"
              className={cn(
                'shrink-0 inline-flex items-center gap-2 border border-kawai-black px-6 py-3',
                'text-sm font-medium text-kawai-black',
                'hover:bg-kawai-black hover:text-white transition-colors duration-300',
              )}
            >
              Compare All Digital Pianos <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Strip ────────────────────────────────────── */}
      <section className="border-y border-kawai-neutral bg-kawai-pearl px-6 py-14 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
          {FEATURE_STRIP.map(({ title, body }) => (
            <div key={title}>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-kawai-black uppercase">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-kawai-charcoal">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Bar ──────────────────────────────────────────── */}
      <section className="bg-kawai-black px-6 py-16 text-center lg:px-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-8 text-lg font-medium text-white">
            Ready to experience the CA Series?
          </p>
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
              href="/pianos/digital"
              className={cn(
                'inline-flex items-center justify-center border border-kawai-neutral/40 px-7 py-3',
                'text-sm font-semibold text-kawai-neutral transition-colors duration-200',
                'hover:border-kawai-neutral hover:text-white',
              )}
            >
              Explore All Digital Pianos
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
