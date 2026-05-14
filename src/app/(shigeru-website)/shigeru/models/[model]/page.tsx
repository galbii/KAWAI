import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SHIGERU_MODELS } from '../../_data/models'
import { getShigeruPageData } from '../../_data/shopify'
import { TechnicalSpecSheet } from '../_components/TechnicalSpecSheet'

export async function generateStaticParams() {
  return SHIGERU_MODELS.map((m) => ({ model: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>
}): Promise<Metadata> {
  const { model: slug } = await params
  const model = SHIGERU_MODELS.find((m) => m.slug === slug)
  if (!model) return {}
  return {
    title: model.seoTitle,
    description: model.seoDescription,
  }
}

export default async function ModelPage({
  params,
}: {
  params: Promise<{ model: string }>
}) {
  const { model: slug } = await params
  const model = SHIGERU_MODELS.find((m) => m.slug === slug)
  if (!model) notFound()

  const currentIndex = SHIGERU_MODELS.findIndex((m) => m.slug === slug)
  const prevModel = currentIndex > 0 ? SHIGERU_MODELS[currentIndex - 1] : null
  const nextModel =
    currentIndex < SHIGERU_MODELS.length - 1 ? SHIGERU_MODELS[currentIndex + 1] : null

  // Fetch Shopify data — shares the same cache entry as the home + models pages
  const productData = await getShigeruPageData()
  const shopifyKey = slug.replace(/-/g, '')
  const shopify = productData[shopifyKey] ?? null
  const imageUrl = shopify?.imageUrl ?? null
  const finishes = shopify?.finishes?.length ? shopify.finishes : model.finishes

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Shigeru Kawai ${model.name}`,
    description: model.seoDescription,
    brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
    model: model.name,
    category: 'Grand Piano',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="bg-[#0a0a0a]">

        {/* ── HERO — split panel ──────────────────────────────────── */}
        <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

          {/* ── LEFT: pearl panel ────────────────────────────────── */}
          <div className="relative bg-kawai-pearl flex flex-col justify-center px-8 pt-28 pb-12 lg:pl-16 lg:pr-4 lg:pt-32 lg:pb-16">

            {/* Subtle gold glow on light bg */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(213,199,140,0.12) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              {/* Breadcrumb */}
              <nav
                className="flex items-center gap-2 text-kawai-charcoal/50 text-xs tracking-[0.25em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-oswald)' }}
                aria-label="Breadcrumb"
              >
                <Link href="/shigeru" className="hover:text-kawai-black transition-colors duration-200">
                  Shigeru Kawai
                </Link>
                <span aria-hidden="true" className="text-kawai-charcoal/30">·</span>
                <Link href="/shigeru/models" className="hover:text-kawai-black transition-colors duration-200">
                  Grand Pianos
                </Link>
                <span aria-hidden="true" className="text-kawai-charcoal/30">·</span>
                <span className="text-kawai-gold">{model.name}</span>
              </nav>

              {/* Model name */}
              <h1
                className="text-kawai-black font-bold uppercase leading-[0.88] tracking-tight select-none mb-4"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(4.5rem, 10vw, 9rem)',
                }}
              >
                {model.name}
              </h1>

              {/* Type badge */}
              <div className="flex items-center gap-4 mb-4">
                <span className="block h-px w-10 bg-kawai-gold" />
                <p
                  className="text-kawai-gold text-xs tracking-[0.4em] uppercase font-medium"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  {model.type}
                </p>
              </div>

              {/* Dimensions */}
              <p
                className="text-kawai-charcoal/60 text-sm tracking-[0.2em] mb-6"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                {model.feet}&ensp;·&ensp;{model.cm}
              </p>

              {/* Tagline */}
              <p
                className="text-kawai-charcoal/70 font-light italic leading-relaxed max-w-sm"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                }}
              >
                {model.tagline}
              </p>

              {/* SK-EX rarity callout */}
              {model.slug === 'sk-ex' && (
                <p
                  className="text-kawai-gold text-xs tracking-[0.35em] uppercase mt-5 font-medium"
                  style={{ fontFamily: 'var(--font-oswald)' }}
                >
                  Fewer than 20 handcrafted each year
                </p>
              )}
            </div>

          </div>

          {/* ── RIGHT: pearl panel + piano image ────────────────── */}
          <div className="relative bg-kawai-pearl min-h-[60vw] lg:min-h-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Shigeru Kawai ${model.name}`}
                fill
                className="object-contain object-left-bottom lg:object-left"
                style={{ mixBlendMode: 'multiply' }}
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span
                  className="text-white font-bold uppercase"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: 'clamp(3rem, 8vw, 7rem)' }}
                >
                  {model.name}
                </span>
              </div>
            )}
          </div>

        </section>

        {/* ── ARTIST QUOTE ────────────────────────────────────────── */}
        <section className="bg-kawai-pearl px-6 py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mb-16" />

            <blockquote
              className="text-kawai-black font-light italic leading-relaxed"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.9rem)',
              }}
            >
              &ldquo;{model.artistQuote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-5 mt-12">
              <span className="block h-px w-8 bg-kawai-charcoal/15" />
              <p
                className="text-kawai-charcoal/45 text-[10px] tracking-[0.35em] uppercase"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {model.artistName}&nbsp;&nbsp;·&nbsp;&nbsp;{model.artistRole}
              </p>
              <span className="block h-px w-8 bg-kawai-charcoal/15" />
            </div>

            <span className="block h-px w-10 bg-kawai-gold opacity-40 mx-auto mt-16" />
          </div>
        </section>

        {/* ── SELLING POINTS ──────────────────────────────────────── */}
        <section className="bg-[#0a0a0a] px-6 py-28">
          <div className="max-w-4xl mx-auto">
            <p
              className="text-kawai-gold text-[10px] tracking-[0.45em] uppercase text-center mb-6"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Why the {model.name}
            </p>
            <h2
              className="text-white font-light italic text-center mb-20 leading-tight"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              }}
            >
              What Sets It Apart
            </h2>

            <ol className="space-y-0">
              {model.sellingPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-8 border-b border-white/[0.05] py-8 last:border-b-0 group"
                >
                  <span
                    className="flex-shrink-0 text-kawai-gold font-light italic leading-none opacity-40 group-hover:opacity-70 transition-opacity duration-300 w-12 text-right"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    className="text-white/65 text-base leading-relaxed pt-2 group-hover:text-white/85 transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {point}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SPECIFICATIONS ──────────────────────────────────────── */}
        <TechnicalSpecSheet model={model} />

        {/* ── NAVIGATION: PREV / NEXT ──────────────────────────────── */}
        <section className="bg-[#0a0a0a] px-6 py-20">
          <div className="max-w-5xl mx-auto">

            {/* View all link — centred above the prev/next pair */}
            <div className="text-center mb-14">
              <Link
                href="/shigeru/models"
                className="text-white/20 hover:text-white/55 text-[9px] tracking-[0.4em] uppercase transition-colors duration-200"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                ← View All Models
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/[0.04]">
              {/* Prev */}
              <div className="bg-[#0a0a0a] p-8">
                {prevModel ? (
                  <Link
                    href={`/shigeru/models/${prevModel.slug}`}
                    className="group flex flex-col gap-3"
                  >
                    <p
                      className="text-white/20 group-hover:text-white/40 text-[9px] tracking-[0.35em] uppercase transition-colors duration-200"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      ← Previous
                    </p>
                    <span
                      className="text-white/50 group-hover:text-kawai-gold font-light italic leading-none transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                      }}
                    >
                      {prevModel.name}
                    </span>
                    <p
                      className="text-white/20 text-[10px] tracking-wide"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      {prevModel.type}
                    </p>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p
                      className="text-white/10 text-[9px] tracking-[0.35em] uppercase"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      The beginning
                    </p>
                    <span
                      className="text-white/10 font-light italic leading-none"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                      }}
                    >
                      —
                    </span>
                  </div>
                )}
              </div>

              {/* Next */}
              <div className="bg-[#0a0a0a] p-8 text-right">
                {nextModel ? (
                  <Link
                    href={`/shigeru/models/${nextModel.slug}`}
                    className="group flex flex-col gap-3 items-end"
                  >
                    <p
                      className="text-white/20 group-hover:text-white/40 text-[9px] tracking-[0.35em] uppercase transition-colors duration-200"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Next →
                    </p>
                    <span
                      className="text-white/50 group-hover:text-kawai-gold font-light italic leading-none transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                      }}
                    >
                      {nextModel.name}
                    </span>
                    <p
                      className="text-white/20 text-[10px] tracking-wide"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      {nextModel.type}
                    </p>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3 items-end">
                    <p
                      className="text-white/10 text-[9px] tracking-[0.35em] uppercase"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      The pinnacle
                    </p>
                    <span
                      className="text-white/10 font-light italic leading-none"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                      }}
                    >
                      —
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquire CTA below nav */}
            <div className="text-center mt-16">
              <span className="block h-px w-10 bg-kawai-gold opacity-30 mx-auto mb-10" />
              <p
                className="text-white/20 text-xs mb-6 italic"
                style={{ fontFamily: 'var(--font-brand-luxury)' }}
              >
                Ready to experience the {model.name}?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/shigeru/dealers"
                  className="inline-flex items-center gap-3 border border-kawai-gold/35 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/5 px-8 py-3.5 text-[9px] tracking-[0.3em] uppercase transition-all duration-300"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Find a Dealer
                </Link>
                <Link
                  href="/shigeru/contact"
                  className="inline-flex items-center gap-3 border border-white/10 hover:border-white/25 text-white/30 hover:text-white/60 px-8 py-3.5 text-[9px] tracking-[0.3em] uppercase transition-all duration-300"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Private Inquiry
                </Link>
              </div>
            </div>

          </div>
        </section>

      </div>
    </>
  )
}
