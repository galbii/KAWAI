import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn, formatPrice } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai ES Series Review & Buyer\'s Guide | Portable Digital Pianos',
  description:
    'Everything you need to know about the Kawai ES Series portable digital pianos. Responsive Hammer action, stage-ready connectivity, and a build designed for musicians who travel.',
  keywords: [
    'kawai ES series',
    'kawai portable digital piano',
    'kawai ES920 review',
    'kawai ES520 review',
    'best portable digital piano',
    'weighted keys portable piano',
    'kawai ES series comparison',
  ],
  openGraph: {
    title: 'Kawai ES Series Review & Buyer\'s Guide | Portable Digital Pianos',
    description:
      'Responsive Hammer action in a portable package. Learn who the Kawai ES Series is built for and which model fits your playing.',
    type: 'article',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai ES Series Review & Buyer\'s Guide | Portable Digital Pianos',
    description:
      'Responsive Hammer action in a portable package. Learn who the Kawai ES Series is built for and which model fits your playing.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/digital/es-series`,
  },
}

const features = [
  {
    title: 'Responsive Hammer Compact Action',
    body: 'Graded, weighted keys that return with the feel of an acoustic hammer mechanism — not a spring. Lower keys are heavier, upper keys lighter, exactly as they are on a grand piano. The touch difference is immediate and meaningful for technique development.',
  },
  {
    title: 'Stage-Ready Connectivity',
    body: 'Balanced audio outputs, MIDI, and USB connectivity make the ES Series compatible with professional PA systems, audio interfaces, and DAWs. Designed so setup and teardown on any stage takes minutes, not a soundcheck.',
  },
  {
    title: 'Built to Travel',
    body: 'Compact dimensions and a lightweight chassis mean the ES Series fits in a gig bag and on any stage. No stand required. No furniture commitment. Just a serious instrument that goes where you go.',
  },
]

const personas = [
  {
    label: 'For gigging musicians',
    body: 'The balanced outputs and durable build make it a reliable touring instrument. Whether you\'re playing jazz clubs, church stages, or live sessions, the ES Series handles it without compromise.',
  },
  {
    label: 'For piano teachers',
    body: 'Portable enough to bring to lessons, capable enough to demonstrate technique at any level. Many teachers keep one as a travel instrument alongside a home cabinet piano.',
  },
  {
    label: 'For home practice without furniture',
    body: 'No cabinet, no dedicated room required. Set it up on a stand anywhere, practice with headphones, put it away when done. The ES Series is for players who want a serious instrument without a serious footprint.',
  },
]

const faq = [
  {
    q: 'Does the Kawai ES Series have weighted keys?',
    a: 'Yes. All ES Series models feature Responsive Hammer Compact (RHC) action — a graded, weighted keyboard mechanism that provides the feel of an acoustic piano. Lower keys are heavier and upper keys are lighter, mimicking the natural weight distribution of a grand piano action.',
  },
  {
    q: 'What is the difference between the ES520 and ES920?',
    a: 'Both share the same Responsive Hammer Compact action. The ES920 is the flagship model with higher polyphony, a broader selection of instrument voices, Bluetooth MIDI/audio, and more advanced sound resonance modeling. The ES520 delivers the same essential piano touch at a lower price point.',
  },
  {
    q: 'Can I use the Kawai ES Series for live performance?',
    a: 'Yes — the ES Series is designed for the stage. Both models include balanced stereo audio outputs compatible with professional PA systems. The compact, durable form factor is built to handle regular transport and live use.',
  },
  {
    q: 'Is the ES Series suitable for beginners?',
    a: 'The ES Series works for players at any level, but it\'s particularly suited for intermediate and advanced players who prioritize touch quality and portability. Beginners focused on home practice may find the KDP Series a more appropriate starting point.',
  },
  {
    q: 'Does the Kawai ES920 have built-in speakers?',
    a: 'Yes. Both ES models include built-in speakers for personal practice and informal settings. For stage use, connecting to a PA via the balanced outputs will give you the best sound projection.',
  },
]

const lineup = [
  { slug: '/pianos/digital/es-series', label: 'ES Series', sub: 'Portable & stage-ready', active: true },
  { slug: '/pianos/digital', label: 'CN Series', sub: 'Home cabinet design' },
  { slug: '/pianos/digital/ca-series', label: 'CA Series', sub: 'Wooden key action' },
]

export default async function EsSeriesGuidePage() {
  const allProducts = await getProductsByModelPrefix('ES')
  const featured = allProducts.slice(0, 4)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Pianos', item: `${siteUrl}/pianos` },
          { '@type': 'ListItem', position: 2, name: 'Digital Pianos', item: `${siteUrl}/pianos/digital` },
          { '@type': 'ListItem', position: 3, name: 'ES Portable Series', item: `${siteUrl}/pianos/digital/es-series` },
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
    <div className="font-[family-name:var(--font-brand-sans)]">
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
            <Link href="/pianos/digital" className="hover:text-kawai-charcoal transition-colors">Digital Pianos</Link>
            <span className="mx-2 text-kawai-charcoal/40">/</span>
            <span className="text-kawai-charcoal/80">ES Series</span>
          </nav>

          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-red uppercase">
            ES Portable Series
          </p>

          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-kawai-black md:text-5xl lg:text-6xl">
            Professional piano feel.
            <br />
            Anywhere you play.
          </h1>

          <p className="max-w-2xl text-base text-kawai-charcoal md:text-lg leading-relaxed">
            The Kawai ES Series is built for musicians who need authentic touch in a portable instrument.
            Responsive Hammer Compact action provides the graded weight of an acoustic grand — in a piano
            light enough to carry to every gig, rehearsal, or lesson.
          </p>
        </div>
      </section>

      {/* ── What Makes It Special ────────────────────────── */}
      <section className="bg-white px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            What sets the ES Series apart
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
              <h2 className="text-xl font-semibold text-kawai-black">ES Series Models</h2>
              <Link
                href="/pianos/digital"
                className="text-sm font-medium text-kawai-red hover:text-kawai-black transition-colors shrink-0"
              >
                Browse all digital pianos →
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
                    <div className="relative aspect-square overflow-hidden bg-white">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={`Kawai ${product.model}`}
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
            Kawai Digital Piano Lineup
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
                <span className={cn('text-sm font-semibold', item.active && 'text-kawai-red')}>
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
            Ready to compare all digital pianos?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Link
              href="/pianos/digital"
              className="inline-flex items-center justify-center bg-kawai-red px-7 py-3 text-sm font-semibold text-white hover:bg-kawai-red-700 transition-colors duration-200"
            >
              Browse Digital Pianos
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
    </div>
  )
}
