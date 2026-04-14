import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn, formatPrice } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai CA Series Review & Buyer\'s Guide | Wooden Key Digital Pianos',
  description:
    'A complete guide to the Kawai Concert Artist Series. Grand Feel wooden key action, Shigeru SK-EX sampling, and advanced resonance modeling — for players who want the closest thing to an acoustic grand.',
  keywords: [
    'kawai CA series',
    'kawai concert artist',
    'wooden key digital piano',
    'kawai grand feel action',
    'best digital piano with wooden keys',
    'kawai CA401 review',
    'kawai CA901 review',
    'kawai CA series comparison',
  ],
  openGraph: {
    title: 'Kawai CA Series Review & Buyer\'s Guide | Wooden Key Digital Pianos',
    description:
      'Grand Feel wooden keys, SK-EX sampling, and full resonance modeling. Learn which CA Series model fits your practice.',
    type: 'article',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai CA Series Review & Buyer\'s Guide | Wooden Key Digital Pianos',
    description:
      'Grand Feel wooden keys, SK-EX sampling, and full resonance modeling. Learn which CA Series model fits your practice.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/digital/ca-series`,
  },
}

const features = [
  {
    title: 'Grand Feel Wooden Key Action',
    body: 'Solid wood keys flex and absorb moisture the same way acoustic piano keys do. The tactile difference is real — wooden keys change how they feel under your fingers as you play, in a way plastic cannot replicate. Grand Feel is the foundation of the CA Series.',
  },
  {
    title: 'Shigeru SK-EX Concert Grand Sampling',
    body: "Sound is captured from Kawai's 9-foot SK-EX concert grand — the same instrument used at the International Tchaikovsky Competition. Stereo and binaural recordings give you both room presence through speakers and immersive depth through headphones.",
  },
  {
    title: 'Acoustic Resonance Modeling',
    body: "Sympathetic string resonance, damper resonance, and key-off simulation work together to recreate the acoustic phenomena that make a grand piano sound alive. Notes interact with each other the way they do on the real instrument.",
  },
]

const personas = [
  {
    label: 'For classical pianists',
    body: 'The Grand Feel wooden key action is designed for players who practice serious repertoire and need a touch response that translates to acoustic instruments. Technique developed on the CA Series carries over.',
  },
  {
    label: 'For acoustic piano owners',
    body: 'If you are used to the feel of a grand piano, the CA Series is the closest digital equivalent. The wooden key action and SK-EX sampling mean fewer compromises when switching between instruments.',
  },
  {
    label: 'For serious home practice',
    body: 'The CA Series is a home piano that earns its place in a dedicated practice room. Binaural headphone output lets you practice at any hour without disturbing others, at full quality.',
  },
]

const faq = [
  {
    q: 'What is Grand Feel wooden key action?',
    a: 'Grand Feel is Kawai\'s wooden-key action system. The keys themselves are made from real wood, which flexes under finger pressure and responds to humidity and temperature changes like an acoustic piano does. This gives the touch a natural, organic quality that plastic-key actions cannot replicate. Higher CA models use more advanced Grand Feel variants with additional refinements.',
  },
  {
    q: 'Is the CA Series worth upgrading to from the CN Series?',
    a: 'If touch authenticity is your priority — particularly for classical practice or if you regularly play acoustic pianos — yes. The wooden key action is a meaningful difference you can feel immediately. The CN Series uses a high-quality plastic-key action; the CA Series uses real wood. For players who do not prioritize touch above all else, the CN Series is an excellent instrument at a lower price.',
  },
  {
    q: 'What is the difference between the CA401, CA701, and CA901?',
    a: 'All three use Grand Feel wooden key action and SK-EX sampling. The CA701 adds more speaker power, a more advanced action variant, and additional resonance modeling. The CA901 is the flagship, featuring the most refined Grand Feel Wooden Key III action, the most powerful speaker system, and Kawai\'s complete suite of acoustic modeling. Step up the range and each model adds more nuance to touch and sound.',
  },
  {
    q: 'Can I practice silently with the CA Series?',
    a: 'Yes. All CA models include headphone outputs, and the binaural sampling feature creates an immersive, three-dimensional sound when using headphones — designed to approximate the acoustic experience of sitting at a real piano. It is one of the most compelling headphone piano experiences available.',
  },
  {
    q: 'Does the CA Series accurately replicate acoustic grand piano sound?',
    a: 'The CA Series uses sampling and modeling technology to reproduce acoustic grand piano character with high fidelity. Samples are taken from the Shigeru SK-EX, and resonance modeling adds the interactive acoustic phenomena of a real instrument. It is not identical to playing an acoustic grand, but it is Kawai\'s most accurate digital representation of one.',
  },
]

const lineup = [
  { slug: '/pianos/digital/es-series', label: 'ES Series', sub: 'Portable & stage-ready' },
  { slug: '/pianos/digital', label: 'CN Series', sub: 'Home cabinet design' },
  { slug: '/pianos/digital/ca-series', label: 'CA Series', sub: 'Wooden key action', active: true },
]

export default async function CaSeriesGuidePage() {
  const allProducts = await getProductsByModelPrefix('CA')
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
          { '@type': 'ListItem', position: 3, name: 'Concert Artist Series', item: `${siteUrl}/pianos/digital/ca-series` },
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
            <Link href="/pianos/digital" className="hover:text-kawai-neutral transition-colors">Digital Pianos</Link>
            <span className="mx-2 text-kawai-neutral/40">/</span>
            <span className="text-kawai-neutral/80">CA Series</span>
          </nav>

          <p className="mb-4 text-xs font-semibold tracking-widest text-kawai-red uppercase">
            Concert Artist Series
          </p>

          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-6 text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            The touch of a grand piano.
            <br />
            The practicality of digital.
          </h1>

          <p className="max-w-2xl text-base text-kawai-neutral/70 md:text-lg leading-relaxed">
            The Kawai CA Series uses real wooden keys — not plastic — giving each note a physical
            character that matches what you feel on an acoustic grand. Combined with SK-EX concert
            grand sampling, it is Kawai&apos;s most acoustically faithful digital instrument.
          </p>
        </div>
      </section>

      {/* ── What Makes It Special ────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            What sets the CA Series apart
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
              <h2 className="text-xl font-semibold text-kawai-black">CA Series Models</h2>
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
                    className="group flex flex-col border border-kawai-neutral bg-white hover:border-kawai-black transition-colors duration-200"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-kawai-pearl">
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
    </main>
  )
}
