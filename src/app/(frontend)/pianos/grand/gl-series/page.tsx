import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn, formatPrice } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai GL Series Review & Buyer\'s Guide | Entry Acoustic Grand Pianos',
  description:
    'A complete guide to the Kawai GL Series acoustic grand pianos. Five sizes from 5\'0" to 6\'2", built with Kawai\'s professional craftsmanship standards. Who should buy a GL Series and what makes it different.',
  keywords: [
    'kawai GL series',
    'kawai grand piano',
    'entry level grand piano',
    'kawai GL-10 review',
    'kawai GL-30 review',
    'best entry grand piano',
    'kawai grand piano price',
    'kawai GL series comparison',
  ],
  openGraph: {
    title: 'Kawai GL Series Review & Buyer\'s Guide | Entry Acoustic Grand Pianos',
    description:
      'Five sizes of acoustic grand pianos built with professional craftsmanship. Learn who the GL Series is for and how to choose the right size.',
    type: 'article',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai GL Series Review & Buyer\'s Guide | Entry Acoustic Grand Pianos',
    description:
      'Five sizes of acoustic grand pianos built with professional craftsmanship. Learn who the GL Series is for and how to choose the right size.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/grand/gl-series`,
  },
}

const features = [
  {
    title: 'Acoustic Grand Construction',
    body: 'Grand piano keys are longer than upright piano keys, giving you more surface area for expressive control. The horizontal stringing allows the soundboard to vibrate freely, producing fuller tone that an upright cannot match.',
  },
  {
    title: 'Gravity Return Action',
    body: 'A grand piano action uses gravity to return hammers to position — not a spring mechanism like an upright. This allows faster repetition and more nuanced dynamic control, especially in demanding passages.',
  },
  {
    title: 'Ryuyo Factory Craftsmanship',
    body: "Every GL Series piano is built in Kawai's Ryuyo facility in Japan alongside their professional and concert instruments. The same quality standards apply across the product range — what changes is the size and price.",
  },
]

const personas = [
  {
    label: 'For first-time grand piano buyers',
    body: 'The GL Series is the entry point to authentic acoustic grand ownership. If you have been practicing on an upright or digital piano and are ready for the tonal and tactile experience of a grand, the GL Series is built for that transition.',
  },
  {
    label: 'For teaching studios',
    body: 'The smaller GL-10 and GL-20 are well-suited to professional teaching studios where a full-size concert grand is neither practical nor necessary. Students benefit from playing an acoustic grand from early lessons.',
  },
  {
    label: 'For home use with room',
    body: "The GL-10 at 5'0\" fits into spaces where larger grands don't. If you have a dedicated music room or a generous living space, a GL Series grand changes how you play and practice.",
  },
]

const faq = [
  {
    q: 'What sizes does the Kawai GL Series come in?',
    a: "The GL Series is available in five sizes. The GL-10 is 5'0\" — the smallest and most room-friendly. Each successive model steps up in length, with the GL-50 reaching 6'2\". Longer grands produce richer, more resonant bass response and greater tonal projection.",
  },
  {
    q: 'Is the GL Series a good choice for home use?',
    a: "Yes, for homes with appropriate space. The GL-10 and GL-20 are the most practical for residential rooms. A standard recommendation is to allow 2 feet of clearance behind the piano bench and on all sides. The piano needs room to resonate, and you need room to play comfortably.",
  },
  {
    q: 'What is the difference between the GL-10 and GL-50?',
    a: "The primary difference is size. The GL-10 at 5'0\" is the entry model with a shorter string length — suitable for home use and smaller studios. The GL-50 at 6'2\" has longer strings that produce more resonant bass response, greater projection, and a fuller tonal character across the entire range. Both are built with the same Kawai quality standards.",
  },
  {
    q: 'Is the GL Series suitable for advanced or professional players?',
    a: 'The GL Series is an entry-level acoustic grand — it is designed for home use, teaching studios, and players stepping up from upright or digital instruments. Advanced pianists who perform or record professionally would typically consider the GX BLAK Series, which features Millennium III ABS-Carbon action and more advanced construction.',
  },
  {
    q: "How does the GL Series compare to Kawai's professional grand pianos?",
    a: "The GL Series and GX BLAK Series both come from Kawai's Ryuyo factory, but differ in action technology and material specification. The GX BLAK uses Millennium III ABS-Carbon action parts, hand-tapered soundboards, and is positioned for professional and serious pianists. The GL Series uses a standard acoustic action and is priced for accessible entry into grand piano ownership.",
  },
]

const lineup = [
  { slug: '/pianos/grand/gl-series', label: 'GL Series', sub: 'Entry acoustic grands', tier: 'Entry', active: true },
  { slug: '/pianos/grand/gx-series', label: 'GX BLAK Series', sub: 'Professional grands', tier: 'Professional' },
  { slug: '/pianos/grand/shigeru-kawai', label: 'Shigeru Kawai', sub: 'Concert grands', tier: 'Concert' },
]

export default async function GlSeriesGuidePage() {
  const allProducts = await getProductsByModelPrefix('GL')
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
          { '@type': 'ListItem', position: 3, name: 'GL Grand Series', item: `${siteUrl}/pianos/grand/gl-series` },
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
      <section className="bg-kawai-pearl px-6 py-20 md:py-28 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-6 text-xs tracking-wider text-kawai-charcoal/60 uppercase">
            <Link href="/pianos" className="hover:text-kawai-charcoal transition-colors">Pianos</Link>
            <span className="mx-2 text-kawai-charcoal/40">/</span>
            <Link href="/pianos/grand" className="hover:text-kawai-charcoal transition-colors">Grand Pianos</Link>
            <span className="mx-2 text-kawai-charcoal/40">/</span>
            <span className="text-kawai-charcoal/80">GL Series</span>
          </nav>

          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-red uppercase">
            GL Grand Series
          </p>

          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-kawai-black md:text-5xl lg:text-6xl">
            Your first grand piano.
            <br />
            Built without shortcuts.
          </h1>

          <p className="max-w-2xl text-base text-kawai-charcoal md:text-lg leading-relaxed">
            The Kawai GL Series is where acoustic grand piano ownership begins. Five sizes, built
            in Kawai&apos;s Ryuyo factory with the same standards applied to their professional
            instruments — at a price point designed for home musicians and teaching studios.
          </p>
        </div>
      </section>

      {/* ── What Makes It Special ────────────────────────── */}
      <section className="bg-white px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            Why a grand piano changes how you play
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {features.map(({ title, body }) => (
              <div key={title}>
                <div className="w-6 h-px bg-kawai-red mb-5" />
                <h3 className="mb-3 text-sm font-semibold text-kawai-black">{title}</h3>
                <p className="text-sm leading-relaxed text-kawai-charcoal/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ─────────────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-14 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            Who it&apos;s for
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {personas.map(({ label, body }) => (
              <div key={label} className="border border-kawai-neutral bg-white p-6">
                <p className="mb-3 text-sm font-semibold text-kawai-black">{label}</p>
                <p className="text-sm leading-relaxed text-kawai-charcoal/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Models at a Glance ───────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-white px-6 py-16 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-xl font-semibold text-kawai-black">GL Series Models</h2>
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
                    className="group flex flex-col border border-kawai-neutral bg-kawai-pearl hover:border-kawai-black transition-colors duration-200"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white">
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
      <section className="bg-kawai-pearl px-6 py-16 lg:px-12">
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
      <section className="bg-white px-6 py-14 lg:px-12">
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
                  item.active ? 'text-kawai-red' : 'text-kawai-charcoal/50',
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
