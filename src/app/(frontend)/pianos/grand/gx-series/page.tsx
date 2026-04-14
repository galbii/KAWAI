import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn, formatPrice } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai GX BLAK Series Review & Buyer\'s Guide | Professional Acoustic Grand Pianos',
  description:
    'A complete guide to the Kawai GX BLAK Series. Millennium III ABS-Carbon action, hand-tapered soundboards, and five sizes built for professional pianists. Who should buy a GX BLAK and which model to choose.',
  keywords: [
    'kawai GX BLAK',
    'kawai GX BLAK series review',
    'kawai professional grand piano',
    'kawai GX-2 review',
    'millennium III action',
    'ABS carbon piano action',
    'kawai GX series comparison',
    'professional acoustic grand piano',
  ],
  openGraph: {
    title: 'Kawai GX BLAK Series Review & Buyer\'s Guide | Professional Acoustic Grand Pianos',
    description:
      'Millennium III ABS-Carbon action, five sizes, built for serious pianists. Learn who the GX BLAK Series is for and which model fits your room and playing.',
    type: 'article',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai GX BLAK Series Review & Buyer\'s Guide | Professional Acoustic Grand Pianos',
    description:
      'Millennium III ABS-Carbon action, five sizes, built for serious pianists. Learn who the GX BLAK Series is for and which model fits your room and playing.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/grand/gx-series`,
  },
}

const features = [
  {
    title: 'Millennium III ABS-Carbon Action',
    body: 'ABS-Carbon composite action parts resist warping from humidity and temperature changes, maintaining consistent touch response regardless of climate or season. The result is a piano that plays the same way in January as it does in August.',
  },
  {
    title: 'Hand-Tapered Soundboard',
    body: 'Each GX soundboard is hand-tapered by craftsmen in the Ryuyo factory — thicker at the center for structure, thinner at the edges for resonance. This technique optimizes vibration across all registers and contributes to the GX BLAK\'s tonal projection.',
  },
  {
    title: 'Five Concert-Caliber Sizes',
    body: 'From a salon grand to a near-concert instrument, the GX BLAK Series covers the size range required by professional studios, performance venues, and serious home pianists. Every size uses the same Millennium III action and construction standard.',
  },
]

const personas = [
  {
    label: 'For serious home pianists',
    body: 'If you play at an advanced level and spend meaningful hours at the piano each day, the GX BLAK Series delivers the touch and tonal response that repays that investment. The Millennium III action is more consistent than standard wooden actions.',
  },
  {
    label: 'For professional teaching studios',
    body: 'The GX-2 and GX-3 are popular in professional teaching studios where a serious acoustic grand is needed but a 7-foot concert instrument is impractical. Students benefit from the professional-grade action from their first lesson.',
  },
  {
    label: 'For performance and recording',
    body: 'The GX-5 and GX-7 are built for concert stages and recording spaces. With size and projection appropriate for larger venues, they represent the professional tier before moving to the handcrafted Shigeru Kawai collection.',
  },
]

const faq = [
  {
    q: 'What is Millennium III ABS-Carbon action?',
    a: "Millennium III is Kawai's proprietary action system using carbon fiber composite parts in place of traditional wood components. Wood expands and contracts with changes in humidity and temperature, which can affect the feel and performance of a piano action over time. ABS-Carbon parts are dimensionally stable, maintaining consistent touch response regardless of environmental conditions.",
  },
  {
    q: 'What is the difference between the GL Series and GX BLAK Series?',
    a: 'Both come from the Ryuyo factory, but the GX BLAK Series features Millennium III ABS-Carbon action parts, hand-tapered soundboards, and more advanced construction specifications throughout. The GL Series uses a standard acoustic action and is positioned as the entry-level acoustic grand. The GX BLAK Series is for players who want professional-grade performance in an acoustic instrument.',
  },
  {
    q: 'What sizes does the GX BLAK Series come in?',
    a: "The GX BLAK Series is available in five sizes. The GX-1 starts at approximately 5'4\" and the GX-7 reaches 7'0\". Mid-range models — the GX-2 and GX-3 — are the most common choices for home use and professional studios. Larger models offer deeper bass resonance and greater projection suited to performance venues.",
  },
  {
    q: 'Is the GX BLAK suitable for professional concert use?',
    a: 'The larger GX BLAK models — particularly the GX-5 and GX-7 — are used in competition settings and professional venues. For the highest level of concert performance, the Shigeru Kawai collection represents the pinnacle of the Kawai range, with hand-voiced instruments used at events such as the International Tchaikovsky Competition.',
  },
  {
    q: 'Why is ABS-Carbon used instead of traditional wooden action parts?',
    a: 'Wood is an organic material — it responds to moisture and temperature, which can cause it to expand, contract, and sometimes warp over time. This affects the consistency of an action. ABS-Carbon composite materials are engineered to be stable, so the action geometry stays precise. For players in variable climates or anyone who wants consistent touch year-round, this is a meaningful advantage.',
  },
]

const lineup = [
  { slug: '/pianos/grand/gl-series', label: 'GL Series', sub: 'Entry acoustic grands', tier: 'Entry' },
  { slug: '/pianos/grand/gx-series', label: 'GX BLAK Series', sub: 'Professional grands', tier: 'Professional', active: true },
  { slug: '/pianos/grand/shigeru-kawai', label: 'Shigeru Kawai', sub: 'Concert grands', tier: 'Concert' },
]

export default async function GxSeriesGuidePage() {
  const allProducts = await getProductsByModelPrefix('GX')
  const featured = allProducts.slice(0, 4)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Grand Pianos', item: `${siteUrl}/pianos/grand` },
          { '@type': 'ListItem', position: 3, name: 'GX BLAK Series', item: `${siteUrl}/pianos/grand/gx-series` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
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

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-kawai-black px-6 py-20 md:py-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 text-xs tracking-wider text-kawai-neutral/60 uppercase">
            <Link href="/pianos" className="hover:text-kawai-neutral transition-colors">Pianos</Link>
            <span className="mx-2 text-kawai-neutral/40">/</span>
            <Link href="/pianos/grand" className="hover:text-kawai-neutral transition-colors">Grand Pianos</Link>
            <span className="mx-2 text-kawai-neutral/40">/</span>
            <span className="text-kawai-neutral/80">GX BLAK Series</span>
          </nav>

          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-gold uppercase">
            GX BLAK Series
          </p>

          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            Professional acoustic grands.
            <br />
            Built to perform consistently.
          </h1>

          <p className="max-w-2xl text-base text-kawai-neutral/70 md:text-lg leading-relaxed">
            The Kawai GX BLAK Series is built around Millennium III ABS-Carbon action — a
            professional-grade mechanism designed to stay consistent regardless of climate or
            season. Five sizes, from salon to near-concert, for the serious pianist.
          </p>
        </div>
      </section>

      {/* ── What Makes It Special ────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            The GX BLAK advantage
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {features.map(({ title, body }) => (
              <div key={title}>
                <div className="w-6 h-px bg-kawai-gold mb-5" />
                <h3 className="mb-3 text-sm font-semibold text-kawai-black">{title}</h3>
                <p className="text-sm leading-relaxed text-kawai-charcoal/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ─────────────────────────────────── */}
      <section className="bg-white px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            Who it&apos;s for
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {personas.map(({ label, body }) => (
              <div key={label} className="border border-kawai-neutral bg-kawai-pearl p-6">
                <p className="mb-3 text-sm font-semibold text-kawai-black">{label}</p>
                <p className="text-sm leading-relaxed text-kawai-charcoal/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Models at a Glance ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-kawai-pearl px-6 py-16 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-xl font-semibold text-kawai-black">GX BLAK Models</h2>
              <Link
                href="/pianos/grand"
                className="text-sm font-medium text-kawai-red hover:text-kawai-black transition-colors shrink-0"
              >
                Browse all grand pianos →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => {
                const firstSpec = product.specifications?.[0]
                return (
                  <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col border border-kawai-neutral bg-white hover:border-kawai-black transition-colors duration-200"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-kawai-pearl">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={`Kawai ${product.model} grand piano`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-2xl font-bold text-kawai-neutral">{product.model}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-kawai-black">{product.model}</p>
                      {firstSpec && (
                        <p className="mt-1 text-xs text-kawai-charcoal/70">
                          {firstSpec.spec}: {firstSpec.details ?? firstSpec.type ?? '—'}
                        </p>
                      )}
                      <p className="mt-2 text-sm font-medium text-kawai-red">
                        {product.price?.msrp ? formatPrice(product.price.msrp) : 'Contact for pricing'}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-white px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-[family-name:var(--font-brand-luxury)] mb-10 text-3xl text-kawai-black">
            Common questions
          </h2>
          <dl className="space-y-8">
            {faq.map(({ q, a }) => (
              <div key={q} className="border-b border-kawai-neutral pb-8 last:border-0 last:pb-0">
                <dt className="mb-3 text-base font-semibold text-kawai-black">{q}</dt>
                <dd className="text-sm leading-relaxed text-kawai-charcoal/80">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Lineup Context ───────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            Kawai Acoustic Grand Piano Lineup
          </p>
          <div className="grid grid-cols-3 gap-px bg-kawai-neutral">
            {lineup.map((item) => (
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
                <span className={cn(
                  'text-xs font-semibold tracking-widest uppercase',
                  item.active ? 'text-kawai-gold' : 'text-kawai-charcoal/50',
                )}>
                  {item.tier}
                </span>
                <span className={cn('text-sm font-semibold', item.active && 'text-white')}>
                  {item.label}
                </span>
                <span className={cn('text-xs', item.active ? 'text-kawai-neutral/70' : 'text-kawai-charcoal/60')}>
                  {item.sub}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-kawai-black px-6 py-16 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="font-[family-name:var(--font-brand-luxury)] text-2xl text-white md:text-3xl">
            Ready to explore Kawai grand pianos?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Link
              href="/pianos/grand"
              className="inline-flex items-center justify-center bg-kawai-red px-7 py-3 text-sm font-semibold text-white hover:bg-kawai-red-700 transition-colors duration-200"
            >
              Browse Grand Pianos
            </Link>
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center justify-center border border-kawai-neutral/40 px-7 py-3 text-sm font-semibold text-kawai-neutral hover:border-kawai-neutral hover:text-white transition-colors duration-200"
            >
              Find a Dealer
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
