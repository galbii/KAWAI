import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getProductsByModelPrefix } from '@/lib/payload/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'GL Grand Series | Kawai Acoustic Grand Pianos',
  description:
    "The Kawai GL Series brings authentic grand piano quality within reach. Five sizes from 5'0\" to 6'2\", built with the same craftsmanship as Kawai's professional instruments. Compare GL-10 through GL-50.",
  keywords: [
    'kawai GL series',
    'kawai grand piano',
    'entry level grand piano',
    'kawai GL-10 price',
    'kawai grand piano price',
  ],
  openGraph: {
    title: 'GL Grand Series | Kawai Acoustic Grand Pianos',
    description:
      "Five sizes of authentic acoustic grand pianos, built with Kawai's professional craftsmanship standards. The GL Series is where serious piano ownership begins.",
    type: 'website',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GL Grand Series | Kawai Acoustic Grand Pianos',
    description:
      "Five sizes of authentic acoustic grand pianos built with Kawai's professional craftsmanship standards.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/gl-series`,
  },
}

function formatPrice(msrp: number | null | undefined): string {
  if (!msrp) return 'Contact for pricing'
  return `From $${msrp.toLocaleString('en-US')}`
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
    return `From $${min.toLocaleString('en-US')}`
  }

  return 'Contact for pricing'
}

const GRAND_ADVANTAGES = [
  {
    title: 'Longer Keys',
    body: 'Grand piano keys are longer than uprights, allowing more subtle control over dynamics and touch.',
  },
  {
    title: 'Gravity Return',
    body: 'A grand action uses gravity to return hammers — creating faster, more nuanced repetition than upright mechanisms.',
  },
  {
    title: 'Horizontal Strings',
    body: 'Horizontal stringing allows the soundboard to vibrate freely, producing fuller, richer tone.',
  },
]

const PRIORITY_SPEC_NAMES = ['Length', 'Action', 'Soundboard']

function pickTopSpecs(
  specs: { spec?: string | null; type?: string | null; details?: string | null }[],
  count: number,
): { spec?: string | null; type?: string | null; details?: string | null }[] {
  const prioritized = PRIORITY_SPEC_NAMES.map((n) =>
    specs.find((s) => (s.spec ?? '').toLowerCase().includes(n.toLowerCase())),
  ).filter((s): s is NonNullable<typeof s> => s !== undefined)

  const rest = specs.filter(
    (s) => !PRIORITY_SPEC_NAMES.some((n) => (s.spec ?? '').toLowerCase().includes(n.toLowerCase())),
  )

  return [...prioritized, ...rest].slice(0, count)
}

export default async function GlSeriesPage() {
  const products = await getProductsByModelPrefix('GL')

  const lowestMsrp = products.reduce<number | null>((min, p) => {
    const msrp = p.price?.msrp ?? null
    if (typeof msrp === 'number' && (min === null || msrp < min)) return msrp
    return min
  }, null)

  const startingPriceLabel = lowestMsrp
    ? `From $${lowestMsrp.toLocaleString('en-US')}`
    : 'Contact for pricing'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Grand Pianos', item: `${siteUrl}/pianos/grand` },
          { '@type': 'ListItem', position: 3, name: 'GL Series', item: `${siteUrl}/pianos/gl-series` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Kawai GL Grand Series',
        description: "Kawai GL Series acoustic grand pianos",
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
      <section className="bg-kawai-pearl px-6 py-20 md:py-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs tracking-wider text-kawai-charcoal/60 uppercase">
            <Link href="/pianos" className="transition-colors hover:text-kawai-charcoal">
              Pianos
            </Link>
            <span className="mx-2 text-kawai-charcoal/40">/</span>
            <Link href="/pianos/grand" className="transition-colors hover:text-kawai-charcoal">
              Grand
            </Link>
            <span className="mx-2 text-kawai-charcoal/40">/</span>
            <span className="text-kawai-charcoal/80">GL Series</span>
          </nav>

          {/* Series label */}
          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-red uppercase">
            GL Grand Series
          </p>

          {/* H1 */}
          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-kawai-black md:text-5xl lg:text-6xl">
            Your first grand.
            <br />
            Uncompromising quality.
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-2xl text-base text-kawai-charcoal md:text-lg">
            Built in Kawai&apos;s Ryuyo factory with the same craftsmanship standards as their
            concert instruments, the GL Series delivers genuine acoustic grand piano character at an
            accessible price point.
          </p>

          {/* Stat pills — price pulled from live product data */}
          <div className="flex flex-wrap gap-3">
            {['5 Grand Sizes', startingPriceLabel].map((label) => (
              <span
                key={label}
                className="inline-flex items-center bg-kawai-black px-4 py-2 text-sm font-medium text-white"
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
          <h2 className="mb-10 text-2xl font-semibold text-kawai-black">GL Series Models</h2>

          {products.length === 0 ? (
            <p className="text-kawai-charcoal">No models found at this time.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const specs = pickTopSpecs(product.specifications ?? [], 3)
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
                          alt={`Kawai ${product.model} grand piano`}
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

                      {/* CTA */}
                      <div className="mt-auto pt-5">
                        <Link
                          href={`/products/${product.slug}`}
                          className={cn(
                            'inline-flex items-center gap-1 text-sm font-medium',
                            'border-b border-kawai-black/0 text-kawai-black',
                            'transition-colors duration-200 hover:border-kawai-red hover:text-kawai-red',
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
          <div className="grid grid-cols-1 gap-px bg-kawai-neutral md:grid-cols-3">
            {[
              {
                slug: '/pianos/gl-series',
                label: 'GL Series',
                sub: 'Entry acoustic grands',
                note: 'Five sizes, from 5\'0"',
                active: true,
                tier: 'Entry',
              },
              {
                slug: '/pianos/gx-series',
                label: 'GX BLAK Series',
                sub: 'Professional grands',
                note: 'Millennium III ABS-Carbon',
                active: false,
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
              The GL Series is the entry point to acoustic grand ownership. Ready to step up?
              The GX BLAK Series offers professional-grade performance in a range of sizes.
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

      {/* ── Why a Grand Piano ────────────────────────────────── */}
      <section className="bg-kawai-black px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-brand-luxury)] mb-12 text-3xl text-white md:text-4xl">
            Why a Grand Piano?
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {GRAND_ADVANTAGES.map(({ title, body }) => (
              <div key={title}>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-kawai-red uppercase">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-kawai-neutral/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bar ──────────────────────────────────────────── */}
      <section className="bg-kawai-red px-6 py-16 text-center lg:px-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-8 text-lg font-medium text-white">
            Ready to find your grand piano?
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/find-a-dealer"
              className={cn(
                'inline-flex items-center justify-center border border-white px-7 py-3',
                'text-sm font-semibold text-white transition-colors duration-200',
                'hover:bg-white hover:text-kawai-red',
              )}
            >
              Find a Dealer
            </Link>
            <Link
              href="/pianos/gx-series"
              className={cn(
                'inline-flex items-center justify-center px-7 py-3',
                'text-sm font-semibold text-white/70 transition-colors duration-200',
                'hover:text-white',
              )}
            >
              Explore GX BLAK Series
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
