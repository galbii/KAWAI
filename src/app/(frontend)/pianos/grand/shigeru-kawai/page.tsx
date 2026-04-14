import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductsByModelPrefix } from '@/lib/payload/queries'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Shigeru Kawai Guide | Handcrafted Concert Grand Pianos',
  description:
    "A complete guide to Shigeru Kawai concert grand pianos. Handcrafted at Kawai's Ryuyo factory in Japan, individually voiced, and chosen for the International Tchaikovsky Competition. Who plays them and how to acquire one.",
  keywords: [
    'shigeru kawai',
    'shigeru kawai review',
    'shigeru kawai SK-EX',
    'kawai concert grand piano',
    'japanese handcrafted piano',
    'shigeru kawai price',
    'shigeru kawai vs steinway',
    'kawai SK series',
  ],
  openGraph: {
    title: 'Shigeru Kawai Guide | Handcrafted Concert Grand Pianos',
    description:
      "Handcrafted at Kawai's Ryuyo factory, individually voiced, and used at the Tchaikovsky Competition. Learn about the Shigeru Kawai collection.",
    type: 'article',
    siteName: 'Kawai Piano',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shigeru Kawai Guide | Handcrafted Concert Grand Pianos',
    description:
      "Handcrafted at Kawai's Ryuyo factory, individually voiced, and used at the Tchaikovsky Competition. Learn about the Shigeru Kawai collection.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/grand/shigeru-kawai`,
  },
}

const pillars = [
  {
    title: 'Ryuyo Factory, Japan',
    body: "Every Shigeru Kawai is built in Japan by Kawai's most skilled craftsmen. Tone materials are hand-selected for each instrument. Soundboards are voiced individually — no two Shigeru Kawai pianos are exactly alike.",
  },
  {
    title: 'Individual Voicing',
    body: "Each instrument is voiced and approved before leaving the factory. Voicing is the process of adjusting hammer felt density to shape the tonal character of the piano — it is one of the most skilled and time-intensive aspects of piano manufacture.",
  },
  {
    title: 'Tchaikovsky Competition',
    body: 'The SK-EX is the official piano of the International Tchaikovsky Competition — one of the most prestigious classical music competitions in the world. The choice reflects the confidence placed in the instrument at the highest level of performance.',
  },
]

const faq = [
  {
    q: 'Where are Shigeru Kawai pianos made?',
    a: "Every Shigeru Kawai is handcrafted at Kawai's Ryuyo manufacturing facility in Hamamatsu, Japan. Ryuyo is where Kawai produces all of their acoustic instruments, from the entry GL Series to the concert SK collection. The Shigeru Kawai instruments are built by the most experienced craftsmen in the facility.",
  },
  {
    q: 'What is the Shigeru Kawai SK-EX?',
    a: "The SK-EX is the 9-foot concert grand — the flagship of the Shigeru Kawai collection. It is the instrument used at the International Tchaikovsky Competition and other major concert venues. The SK-EX is designed for professional concert performance at the highest level.",
  },
  {
    q: 'What is the difference between the SK-3, SK-5, SK-6, and SK-EX?',
    a: "The differences are primarily size and the tonal character that comes with it. The SK-3 is the smallest of the collection — a salon grand for serious home use. The SK-5 and SK-6 are mid-size concert grands suited to recital halls and recording studios. The SK-EX is the full concert grand. Each larger model produces greater tonal projection and more resonant bass response.",
  },
  {
    q: 'What competitions and events use the Shigeru Kawai piano?',
    a: 'The Shigeru Kawai SK-EX is the official piano of the International Tchaikovsky Competition, one of classical music\'s most prestigious competitions. Shigeru Kawai instruments are also used in concert halls and music programs internationally.',
  },
  {
    q: 'How do I purchase a Shigeru Kawai piano?',
    a: 'Shigeru Kawai pianos are available through authorized Kawai dealers by private appointment. Because each instrument is individually voiced and has distinct tonal characteristics, the purchase process involves a personal consultation and, typically, the opportunity to play the specific instrument before acquiring it.',
  },
]

const lineup = [
  { slug: '/pianos/grand/gl-series', label: 'GL Series', sub: 'Entry acoustic grands', tier: 'Entry' },
  { slug: '/pianos/grand/gx-series', label: 'GX BLAK Series', sub: 'Professional grands', tier: 'Professional' },
  { slug: '/pianos/grand/shigeru-kawai', label: 'Shigeru Kawai', sub: 'Concert grands', tier: 'Concert', active: true },
]

export default async function ShigeruKawaiGuidePage() {
  const allProducts = await getProductsByModelPrefix('SK-')
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
          { '@type': 'ListItem', position: 3, name: 'Shigeru Kawai', item: `${siteUrl}/pianos/grand/shigeru-kawai` },
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
      <section className="bg-kawai-black px-6 py-24 md:py-36 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-8 text-xs tracking-wider text-kawai-neutral/50 uppercase">
            <Link href="/pianos" className="hover:text-kawai-neutral transition-colors">Pianos</Link>
            <span className="mx-2 text-kawai-neutral/30">/</span>
            <Link href="/pianos/grand" className="hover:text-kawai-neutral transition-colors">Grand Pianos</Link>
            <span className="mx-2 text-kawai-neutral/30">/</span>
            <span className="text-kawai-neutral/60">Shigeru Kawai</span>
          </nav>

          <p className="font-[family-name:var(--font-brand-luxury)] mb-6 text-sm tracking-[0.3em] uppercase text-kawai-gold">
            Shigeru Kawai
          </p>

          <h1 className="font-[family-name:var(--font-brand-luxury)] mb-8 text-5xl leading-tight text-white md:text-6xl lg:text-7xl">
            Handcrafted.
            <br />
            Individually voiced.
          </h1>

          <p className="max-w-2xl text-base text-kawai-neutral/60 md:text-lg leading-relaxed">
            Named after Kawai&apos;s master designer and former president, every Shigeru Kawai is
            built in Japan by craftsmen who hand-select tone materials and voice each instrument
            individually before it leaves the factory.
          </p>

          <p className="mt-8 text-xs tracking-[0.2em] uppercase text-kawai-gold/70">
            Official Piano&nbsp;·&nbsp;International Tchaikovsky Competition
          </p>
        </div>
      </section>

      {/* ── What Makes It Special ────────────────────────── */}
      <section className="bg-kawai-pearl px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-xs font-semibold tracking-widest text-kawai-charcoal/50 uppercase">
            What defines the collection
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {pillars.map(({ title, body }) => (
              <div key={title}>
                <div className="w-6 h-px bg-kawai-gold mb-5" />
                <h3 className="mb-3 text-sm font-semibold text-kawai-black">{title}</h3>
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
              <h2 className="text-xl font-semibold text-kawai-black">The Collection</h2>
              <Link
                href="/pianos/grand"
                className="text-sm font-medium text-kawai-charcoal/60 hover:text-kawai-black transition-colors shrink-0"
              >
                Browse all grand pianos →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((product) => (
                <div
                  key={product.slug}
                  className="flex gap-6 border border-kawai-neutral p-6"
                >
                  {product.imageUrl && (
                    <div className="relative w-32 shrink-0 overflow-hidden bg-kawai-pearl">
                      <Image
                        src={product.imageUrl}
                        alt={product.name ?? product.model ?? 'Shigeru Kawai piano'}
                        width={128}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-[family-name:var(--font-brand-luxury)] text-xs tracking-widest uppercase text-kawai-gold mb-1">
                      {product.model}
                    </p>
                    <p className="font-semibold text-kawai-black mb-2">{product.name}</p>
                    {product.description && (
                      <p className="text-xs leading-relaxed text-kawai-charcoal/70 line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs font-medium text-kawai-black border-b border-kawai-black/30 hover:border-kawai-gold hover:text-kawai-charcoal transition-colors duration-200"
                    >
                      View instrument →
                    </Link>
                  </div>
                </div>
              ))}
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
      <section className="bg-kawai-pearl border-t border-kawai-neutral px-6 py-16 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <p className="text-kawai-charcoal text-base md:text-lg">
            Shigeru Kawai pianos are available by private appointment through authorized dealers.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center justify-center border border-kawai-black px-7 py-3 text-sm font-semibold text-kawai-black hover:bg-kawai-black hover:text-white transition-colors duration-300"
            >
              Arrange a Private Audition
            </Link>
            <Link
              href="/pianos/grand"
              className="inline-flex items-center justify-center px-7 py-3 text-sm font-medium text-kawai-charcoal/70 hover:text-kawai-black transition-colors duration-200"
            >
              Browse Grand Pianos →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
