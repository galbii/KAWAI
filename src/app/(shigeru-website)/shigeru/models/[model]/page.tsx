import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SHIGERU_MODELS, type ShigeruModel } from '../../_data/models'
import { getShigeruPageData } from '../../_data/shopify'
import { ModelRangeStrip } from '../_components/ModelRangeStrip'
import { TechnicalSpecSheet } from '../_components/TechnicalSpecSheet'
import { getStaticAlternates } from '@/lib/site-context'
import {
  EDITORIAL_GRID,
  GOLD,
  NEAR_BLACK,
  OSWALD,
  SANS,
  SERIF,
  ink,
  labelStyle as label,
  pearl,
} from '@/lib/shigeru/tokens'
import '../models.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'

/**
 * Prerendered, refreshed hourly. Without this the six routes are built once
 * and never rebuilt: the product images come from Payload behind the
 * `shigeru-product-images` cache tag, and nothing in the app revalidates that
 * tag, so a swapped photo would never reach these pages.
 */
export const revalidate = 3600

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

  // Same cached read the page itself makes — no extra round trip.
  const productData = await getShigeruPageData()
  const image = productData[slug.replace(/-/g, '')]?.imageUrl ?? null
  const url = `${SITE_URL}/shigeru/models/${model.slug}`

  return {
    title: model.seoTitle,
    description: model.seoDescription,
    alternates: getStaticAlternates(`/shigeru/models/${model.slug}`),
    openGraph: {
      title: model.seoTitle,
      description: model.seoDescription,
      url,
      type: 'website',
      siteName: 'Shigeru Kawai',
      ...(image
        ? {
            images: [
              { url: image, alt: `Shigeru Kawai ${model.name} ${model.type.toLowerCase()}` },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: model.seoTitle,
      description: model.seoDescription,
      ...(image ? { images: [image] } : {}),
    },
  }
}

/* ── Prev / next ─────────────────────────────────────────────────────────── */

/**
 * The homepage carousel's stepper, rebuilt as a link. Keeping the control
 * identical is what ties the destination back to the page you arrived from.
 * It wraps around, exactly as the carousel does — no dead ends at either end
 * of the range.
 */
function StepLink({ model, direction }: { model: ShigeruModel; direction: 'prev' | 'next' }) {
  const isPrev = direction === 'prev'

  const arrow = (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path
        d={isPrev ? 'M17 6H1M6 1L1 6L6 11' : 'M1 6H17M12 1L17 6L12 11'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <Link
      href={`/shigeru/models/${model.slug}`}
      aria-label={`${isPrev ? 'Previous model' : 'Next model'}, Shigeru Kawai ${model.name}`}
      className="inline-flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:!border-kawai-black"
      style={{
        border: `1px solid ${ink(0.35)}`,
        color: ink(0.75),
        background: pearl(0.85),
      }}
    >
      {isPrev && arrow}
      <span className={`flex flex-col ${isPrev ? 'items-start' : 'items-end'}`}>
        <span className="uppercase" style={{ ...label(0.72, '0.56rem'), letterSpacing: '0.28em' }}>
          {isPrev ? 'Previous' : 'Next'}
        </span>
        <span
          className="mt-0.5 leading-none uppercase"
          style={{
            fontFamily: OSWALD,
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: ink(0.92),
          }}
        >
          {model.name}
        </span>
      </span>
      {!isPrev && arrow}
    </Link>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default async function ModelPage({
  params,
}: {
  params: Promise<{ model: string }>
}) {
  const { model: slug } = await params
  const model = SHIGERU_MODELS.find((m) => m.slug === slug)
  if (!model) notFound()

  const index = SHIGERU_MODELS.findIndex((m) => m.slug === slug)
  const count = SHIGERU_MODELS.length
  const prevModel = SHIGERU_MODELS[(index - 1 + count) % count]!
  const nextModel = SHIGERU_MODELS[(index + 1) % count]!

  // Shares the cache entry with the homepage carousel and the models index
  const productData = await getShigeruPageData()
  const imageUrl = productData[slug.replace(/-/g, '')]?.imageUrl ?? null

  // The measurements stay on the curated model data rather than the synced
  // Shopify strings: the two disagree for the SK-EX, and these are the figures
  // the rest of the page is written around.
  const plaque = [
    { label: 'Length', value: model.feet, sub: model.cm },
    { label: 'Width', value: model.width, sub: model.widthCm },
    { label: 'Weight', value: model.weight, sub: model.weightKg },
    { label: 'Beams', value: String(model.beams), sub: 'Aged Spruce' },
  ]

  const url = `${SITE_URL}/shigeru/models/${model.slug}`

  /**
   * Product + BreadcrumbList in one script tag. Deliberately no `offers`:
   * Shigeru pricing is dealer-quoted, and inventing an offer to win a rich
   * result is exactly the kind of thing Search Console flags later.
   */
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${url}#product`,
      name: `Shigeru Kawai ${model.name}`,
      url,
      description: model.seoDescription,
      brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
      manufacturer: { '@type': 'Organization', name: 'Kawai Musical Instruments' },
      model: model.name,
      category: 'Grand Piano',
      material: 'Solid spruce soundboard, rock maple and mahogany rim',
      countryOfOrigin: { '@type': 'Country', name: 'Japan' },
      depth: { '@type': 'QuantitativeValue', value: parseInt(model.cm, 10), unitCode: 'CMT' },
      width: { '@type': 'QuantitativeValue', value: parseInt(model.widthCm, 10), unitCode: 'CMT' },
      weight: { '@type': 'QuantitativeValue', value: parseInt(model.weightKg, 10), unitCode: 'KGM' },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Type', value: model.type },
        { '@type': 'PropertyValue', name: 'Length', value: `${model.feet} (${model.cm})` },
        { '@type': 'PropertyValue', name: 'Keys', value: '88' },
        { '@type': 'PropertyValue', name: 'Spruce beams', value: String(model.beams) },
        { '@type': 'PropertyValue', name: 'Available finishes', value: model.finishes.join(', ') },
      ],
      ...(imageUrl ? { image: imageUrl } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Shigeru Kawai', item: `${SITE_URL}/shigeru` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Grand Pianos',
          item: `${SITE_URL}/shigeru/models`,
        },
        { '@type': 'ListItem', position: 3, name: model.name, item: url },
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO — the instrument on its stage ──────────────────────────── */}
      <section className="relative overflow-hidden bg-kawai-pearl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 72%, rgba(213,199,140,0.16) 0%, transparent 72%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-28">
          <nav aria-label="Breadcrumb" className="sk-rise sk-rise-1 mb-8 lg:mb-10">
            <ol className="flex flex-wrap items-center gap-2" style={label(0.72)}>
              <li>
                <Link
                  href="/shigeru"
                  className="uppercase transition-colors duration-200 hover:!text-kawai-black"
                >
                  Shigeru Kawai
                </Link>
              </li>
              <li aria-hidden="true" style={{ color: ink(0.35) }}>
                ·
              </li>
              <li>
                <Link
                  href="/shigeru/models"
                  className="uppercase transition-colors duration-200 hover:!text-kawai-black"
                >
                  Grand Pianos
                </Link>
              </li>
              <li aria-hidden="true" style={{ color: ink(0.35) }}>
                ·
              </li>
              <li className="uppercase" style={{ color: ink(0.92) }} aria-current="page">
                {model.name}
              </li>
            </ol>
          </nav>

          {/* Name, flanked by the stepper. On phones the name takes its own
              row and the two controls sit beneath it, one per column. */}
          <div className="sk-rise sk-rise-2 grid grid-cols-2 items-center gap-x-4 gap-y-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-8">
            <h1
              className="order-1 col-span-2 text-center uppercase leading-[0.85] lg:order-2 lg:col-span-1"
              style={{
                fontFamily: OSWALD,
                fontSize: 'clamp(4.5rem, 12vw, 10.5rem)',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: ink(0.95),
              }}
            >
              {model.name}
              <span className="sr-only"> — Shigeru Kawai {model.type} piano</span>
            </h1>
            <div className="order-2 justify-self-start lg:order-1">
              <StepLink model={prevModel} direction="prev" />
            </div>
            <div className="order-3 justify-self-end">
              <StepLink model={nextModel} direction="next" />
            </div>
          </div>

          <p
            className="sk-rise sk-rise-3 mt-5 text-center italic"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(1.15rem, 1.9vw, 1.45rem)',
              color: ink(0.72),
            }}
          >
            {model.type}
          </p>

          <p
            className="sk-rise sk-rise-3 mx-auto mt-5 text-center italic leading-snug"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(1.35rem, 2.4vw, 1.95rem)',
              color: ink(0.82),
              maxWidth: '36ch',
            }}
          >
            {model.tagline}
          </p>

          {/* Stage.

              No entrance animation on this wrapper: the shots are a mix of
              transparent PNGs and white-background JPEGs, and the JPEGs only
              disappear into the pearl because of mix-blend-multiply. A
              transform/opacity animation here isolates the blend group and the
              SK-EX renders as a white box on pearl. */}
          <div
            className="relative mx-auto mt-8 w-full lg:mt-10"
            style={{ height: 'clamp(16rem, 44vh, 32rem)', maxWidth: '64rem' }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Shigeru Kawai ${model.name} ${model.type.toLowerCase()}`}
                fill
                priority
                sizes="(min-width: 1152px) 1024px, 92vw"
                className="object-contain object-bottom mix-blend-multiply"
              />
            ) : (
              <span
                className="absolute inset-x-0 bottom-0 text-center uppercase"
                style={{ ...label(0.72), fontSize: '0.85rem' }}
              >
                {model.name}
              </span>
            )}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 h-5 w-[46%] -translate-x-1/2"
              style={{
                background:
                  'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(30,27,22,0.19), transparent 70%)',
              }}
            />
          </div>

          {/* The floor the instrument stands on is also the top rule of its
              label — one line doing both jobs. */}
          <div aria-hidden="true" className="sk-draw h-px w-full" style={{ background: ink(0.22) }} />

          <dl className="sk-rise sk-rise-4 sk-plaque">
            {plaque.map(({ label: name, value, sub }) => (
              <div key={name}>
                <dt className="uppercase" style={label(0.72)}>
                  {name}
                </dt>
                <dd
                  className="mt-2 leading-none"
                  style={{
                    fontFamily: OSWALD,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    color: ink(0.92),
                  }}
                >
                  {value}
                  <span
                    className="ml-2 font-normal"
                    style={{ fontFamily: SANS, fontSize: '0.78rem', color: ink(0.72) }}
                  >
                    {sub}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div
            className="sk-rise sk-rise-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-6 pb-20 lg:pb-24"
            style={{ borderTop: `1px solid ${ink(0.16)}` }}
          >
            <p style={{ fontFamily: SANS, fontSize: '0.85rem', letterSpacing: '0.05em', color: ink(0.72) }}>
              {model.finishes.join('  ·  ')}
            </p>
            {model.slug === 'sk-ex' && (
              <p className="uppercase" style={label(0.72)}>
                Fewer than 20 handcrafted each year
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── WHY THIS MODEL ─────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl">
        <div
          className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28"
          style={{ borderTop: `1px solid ${ink(0.12)}` }}
        >
          <div className={EDITORIAL_GRID}>
            <div>
              <h2
                className="uppercase leading-[1.05]"
                style={{
                  fontFamily: OSWALD,
                  fontSize: 'clamp(1.9rem, 3vw, 2.6rem)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: ink(0.95),
                }}
              >
                Why the {model.name}
              </h2>
              <span
                aria-hidden="true"
                className="my-6 block h-px w-12"
                style={{ background: GOLD }}
              />
              <p
                className="italic"
                style={{ fontFamily: SERIF, fontSize: '1.15rem', color: ink(0.72) }}
              >
                What Sets It Apart
              </p>
            </div>

            <ul>
              {model.sellingPoints.map((point) => (
                <li
                  key={point}
                  className="py-6 first:pt-0 last:pb-0"
                  style={{ borderBottom: `1px solid ${ink(0.12)}` }}
                >
                  <p
                    style={{
                      fontFamily: SANS,
                      fontSize: '1.05rem',
                      lineHeight: 1.7,
                      color: ink(0.78),
                      maxWidth: '62ch',
                    }}
                  >
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── THE ARTIST'S VOICE ─────────────────────────────────────────── */}
      <section className="bg-kawai-pearl" aria-label={`A pianist on the ${model.name}`}>
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-12 lg:pb-32">
          <div className={EDITORIAL_GRID}>
            <div aria-hidden="true" className="hidden lg:block" />
            <blockquote style={{ maxWidth: '46ch' }}>
              <span
                aria-hidden="true"
                className="mb-8 block h-px w-16"
                style={{ background: GOLD }}
              />
              <p
                className="italic"
                style={{
                  fontFamily: SERIF,
                  fontSize: 'clamp(1.4rem, 2.5vw, 2.05rem)',
                  lineHeight: 1.45,
                  color: ink(0.88),
                }}
              >
                &ldquo;{model.artistQuote}&rdquo;
              </p>
              <footer className="mt-8">
                <cite className="uppercase not-italic" style={label(0.72, '0.72rem')}>
                  {model.artistName} — {model.artistRole}
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── SPECIFICATIONS ─────────────────────────────────────────────── */}
      <TechnicalSpecSheet model={model} />

      {/* ── THE RANGE ──────────────────────────────────────────────────── */}
      <ModelRangeStrip activeSlug={model.slug} productData={productData} />

      {/* ── INQUIRE — hands off to the site footer ─────────────────────── */}
      <section
        aria-label={`Enquire about the ${model.name}`}
        className="px-6 py-20 lg:py-24"
        style={{ background: NEAR_BLACK }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto block h-px w-12"
            style={{ background: GOLD }}
          />
          <p
            className="mt-8 italic"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(1.15rem, 1.9vw, 1.5rem)',
              color: pearl(0.8),
            }}
          >
            Ready to experience the {model.name}?
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/shigeru/dealers"
              className="group inline-flex items-center gap-3 px-10 py-4 transition-colors duration-300 hover:!bg-white"
              style={{
                fontFamily: OSWALD,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                background: pearl(0.94),
                color: ink(1),
              }}
            >
              Find a Dealer
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              >
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                  <path
                    d="M1 5.5H15M11 1.5L15 5.5L11 9.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
            <Link
              href="/shigeru/contact"
              className="inline-flex items-center px-10 py-4 transition-colors duration-300 hover:!border-white"
              style={{
                fontFamily: OSWALD,
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                border: `1px solid ${pearl(0.3)}`,
                color: pearl(0.85),
              }}
            >
              Private Inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
