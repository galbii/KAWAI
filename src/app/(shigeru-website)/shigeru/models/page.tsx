import type { Metadata } from 'next'
import Link from 'next/link'
import { SHIGERU_MODELS } from '../_data/models'
import { getShigeruPageData } from '../_data/shopify'
import { CollectionEntry } from './_components/CollectionEntry'
import { RangeFloor } from './_components/ModelRangeStrip'
import { getStaticAlternates } from '@/lib/site-context'
import {
  EDITORIAL_GRID,
  GOLD,
  NEAR_BLACK,
  OSWALD,
  SANS,
  SERIF,
  ink,
  labelStyle,
  pearl,
} from '@/lib/shigeru/tokens'
import './models.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'
const PATH = '/shigeru/models'

/**
 * Prerendered, refreshed hourly. Without this the route is built once and
 * never rebuilt: the product images come from Payload behind a cache tag that
 * nothing revalidates, so a swapped photo would never reach the page.
 */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const productData = await getShigeruPageData()
  const ogImage = productData['skex']?.imageUrl ?? productData['sk2']?.imageUrl ?? null

  const title = 'Shigeru Kawai Grand Piano Models | SK-2 to SK-EX'
  const description =
    "Explore all six Shigeru Kawai grand piano models — from the 5'11\" SK-2 Classic Salon Grand to the 9'1\" SK-EX Concert Grand. Each handcrafted at the Ryuyo factory in Hamamatsu, Japan."

  return {
    title,
    description,
    alternates: getStaticAlternates(PATH),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${PATH}`,
      type: 'website',
      siteName: 'Shigeru Kawai',
      ...(ogImage
        ? { images: [{ url: ogImage, alt: 'The six Shigeru Kawai grand piano models' }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

const standardFeatures = [
  'Kawai Millennium III ABS-Carbon action',
  '"Shiko Seion" hammers from New Zealand and Australian wool',
  'Tapered and tuned solid spruce soundboard',
  '"Temaki" Kawai-made hand wound bass strings',
  'Hand notched bridges',
  'Hand planed ribs',
  'Thinned hammer shanks',
  'Rock maple and mahogany rim',
  "Bird's eye maple inside rim",
  'Agraffe duplex scale',
  'Aluminum action rail',
  'Nickel plated tuning pins',
  'Solid brass hardware',
  '10-year transferrable warranty',
  'NEOTEX™ key surfaces',
  'Dual Pivot Damper Action',
  'Stretcher Over-Lap Integrated Design (SOLID)',
  'Final voicing by Master Piano Artisan (MPA)',
]

const COMPARISON_COLUMNS = ['Model', 'Type', 'Length', 'Width', 'Weight', 'Finishes'] as const

export default async function ModelsPage() {
  const productData = await getShigeruPageData()

  /**
   * Three graphs, one script tag. The ItemList carries a `url` per model — the
   * copy that used to sit in the microsite layout had none, and was emitted on
   * every /shigeru page rather than on the one page it describes.
   */
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Shigeru Kawai Grand Piano Models',
      description:
        'All six Shigeru Kawai handcrafted grand pianos — the SK-2 Classic Salon Grand, SK-3 Conservatory Grand, SK-5 Chamber Grand, SK-6 Orchestra Grand, SK-7 Semi-Concert Grand and SK-EX Concert Grand.',
      url: `${SITE_URL}${PATH}`,
      isPartOf: { '@type': 'WebSite', name: 'Shigeru Kawai', url: `${SITE_URL}/shigeru` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Shigeru Kawai', item: `${SITE_URL}/shigeru` },
        { '@type': 'ListItem', position: 2, name: 'Grand Pianos', item: `${SITE_URL}${PATH}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Shigeru Kawai Grand Piano Models',
      numberOfItems: SHIGERU_MODELS.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: SHIGERU_MODELS.map((model, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}${PATH}/${model.slug}`,
        item: {
          '@type': 'Product',
          '@id': `${SITE_URL}${PATH}/${model.slug}#product`,
          name: `Shigeru Kawai ${model.name}`,
          url: `${SITE_URL}${PATH}/${model.slug}`,
          description: model.seoDescription,
          brand: { '@type': 'Brand', name: 'Shigeru Kawai' },
          model: model.name,
          category: 'Grand Piano',
          ...(productData[model.slug.replace(/-/g, '')]?.imageUrl
            ? { image: productData[model.slug.replace(/-/g, '')]!.imageUrl }
            : {}),
        },
      })),
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO — the whole range, to scale ────────────────────────────── */}
      <section className="relative overflow-hidden bg-kawai-pearl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 68%, rgba(213,199,140,0.16) 0%, transparent 72%)',
          }}
        />

        <div className="relative mx-auto max-w-[86rem] px-6 pt-24 pb-20 lg:px-12 lg:pt-28 lg:pb-24">
          <p className="sk-rise sk-rise-1 text-center uppercase" style={labelStyle(0.72)}>
            Shigeru Kawai
          </p>

          <h1 className="sk-rise sk-rise-2 mt-8 text-center">
            <span
              className="block uppercase leading-[0.9]"
              style={{
                fontFamily: OSWALD,
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 300,
                letterSpacing: '0.22em',
                color: ink(0.4),
              }}
            >
              The
            </span>
            <span
              className="mt-1 block uppercase leading-[0.85]"
              style={{
                fontFamily: OSWALD,
                fontSize: 'clamp(4rem, 11vw, 10rem)',
                fontWeight: 700,
                letterSpacing: '0.03em',
                color: ink(0.95),
              }}
            >
              Collection
            </span>
            <span className="sr-only">
              {' '}
              — Shigeru Kawai grand piano models, SK-2 to SK-EX
            </span>
          </h1>

          <span
            aria-hidden="true"
            className="sk-rise sk-rise-3 mx-auto mt-10 block h-px w-14"
            style={{ background: GOLD }}
          />

          <p
            className="sk-rise sk-rise-3 mt-8 text-center"
            style={{ fontFamily: SANS, fontSize: '0.95rem', letterSpacing: '0.04em', color: ink(0.72) }}
          >
            Six handcrafted grand pianos&ensp;·&ensp;Ryuyo Grand Piano Factory, Hamamatsu
          </p>

          {/* No entrance animation on this wrapper — see RangeFloor: a
              transform/opacity animation isolates the blend group and the
              white-background SK-EX shot renders as a box on the pearl. */}
          <div className="mt-14 lg:mt-20">
            <RangeFloor productData={productData} heightRem={12} />
          </div>
        </div>
      </section>

      {/* ── THE CATALOGUE ──────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl" aria-label="The six models">
        {SHIGERU_MODELS.map((model, i) => (
          <CollectionEntry
            key={model.slug}
            model={model}
            imageUrl={productData[model.slug.replace(/-/g, '')]?.imageUrl ?? null}
            priority={i === 0}
          />
        ))}
      </section>

      {/* ── AT A GLANCE ────────────────────────────────────────────────── */}
      <section className="bg-kawai-pearl">
        <div
          className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28"
          style={{ borderTop: `1px solid ${ink(0.12)}` }}
        >
          <div className="mb-12 lg:mb-16">
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
              Model Specifications
            </h2>
            <span aria-hidden="true" className="my-6 block h-px w-12" style={{ background: GOLD }} />
            <p className="italic" style={{ fontFamily: SERIF, fontSize: '1.15rem', color: ink(0.72) }}>
              At a Glance
            </p>
          </div>

          <div className="-mx-6 overflow-x-auto px-6 sk-scroll-hide lg:mx-0 lg:px-0">
            <table className="w-full min-w-[46rem] border-collapse">
              <caption className="sr-only">
                Length, width, weight and available finishes for all six Shigeru Kawai grand piano
                models
              </caption>
              <thead>
                <tr>
                  {COMPARISON_COLUMNS.map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="pr-8 pb-5 text-left uppercase last:pr-0"
                      style={{ ...labelStyle(0.72), borderBottom: `1px solid ${ink(0.22)}` }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHIGERU_MODELS.map((model) => (
                  <tr key={model.slug} style={{ borderBottom: `1px solid ${ink(0.12)}` }}>
                    <th scope="row" className="py-6 pr-8 text-left">
                      <Link
                        href={`/shigeru/models/${model.slug}`}
                        className="uppercase transition-colors duration-200 hover:!text-kawai-charcoal"
                        style={{
                          fontFamily: OSWALD,
                          fontSize: '1.4rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          color: ink(0.95),
                        }}
                      >
                        {model.name}
                      </Link>
                    </th>
                    <td className="py-6 pr-8">
                      <span style={{ fontFamily: SERIF, fontSize: '1rem', fontStyle: 'italic', color: ink(0.78) }}>
                        {model.type}
                      </span>
                    </td>
                    {[
                      [model.feet, model.cm],
                      [model.width, model.widthCm],
                      [model.weight, model.weightKg],
                    ].map(([value, sub]) => (
                      <td key={value} className="py-6 pr-8 whitespace-nowrap">
                        <span
                          style={{
                            fontFamily: OSWALD,
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            color: ink(0.92),
                          }}
                        >
                          {value}
                        </span>
                        <span
                          className="ml-2"
                          style={{ fontFamily: SANS, fontSize: '0.78rem', color: ink(0.72) }}
                        >
                          {sub}
                        </span>
                      </td>
                    ))}
                    <td className="py-6">
                      <span style={{ fontFamily: SANS, fontSize: '0.85rem', lineHeight: 1.6, color: ink(0.72) }}>
                        {model.finishes.join(' · ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── STANDARD ACROSS THE RANGE ──────────────────────────────────── */}
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
                Built Into Every Instrument
              </h2>
              <span aria-hidden="true" className="my-6 block h-px w-12" style={{ background: GOLD }} />
              <p className="italic" style={{ fontFamily: SERIF, fontSize: '1.15rem', color: ink(0.72) }}>
                Standard Across All Models
              </p>
              <p
                className="mt-8"
                style={{ fontFamily: SANS, fontSize: '1rem', lineHeight: 1.7, color: ink(0.78), maxWidth: '38ch' }}
              >
                Every Shigeru Kawai grand piano — from SK-2 to SK-EX — includes these features as
                standard. No options. No tiers. Only the finest.
              </p>
            </div>

            <div>
              {/* A flat inventory, not an argument — so no hairlines here. They
                  belong to the ranked lists (selling points, spec rows), and
                  across two columns of uneven line counts they stagger. */}
              <ul className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
                {standardFeatures.map((feature) => (
                  <li
                    key={feature}
                    style={{ fontFamily: SANS, fontSize: '0.98rem', lineHeight: 1.55, color: ink(0.78) }}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <p
                className="mt-10 italic"
                style={{ fontFamily: SERIF, fontSize: '1.05rem', lineHeight: 1.6, color: ink(0.72) }}
              >
                All models include a 10-year transferrable warranty and Master Piano Artisan in-home
                service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HEAR ONE ───────────────────────────────────────────────────── */}
      <section className="px-6 py-20 lg:py-28" style={{ background: NEAR_BLACK }}>
        <div className="mx-auto max-w-2xl text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-12" style={{ background: GOLD }} />
          <h2
            className="mt-10 uppercase leading-[1.05]"
            style={{
              fontFamily: OSWALD,
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: pearl(0.95),
            }}
          >
            Hear One in Person
          </h2>
          <p
            className="mt-5 italic"
            style={{ fontFamily: SERIF, fontSize: '1.15rem', color: pearl(0.72) }}
          >
            Experience Shigeru Kawai
          </p>
          <p
            className="mx-auto mt-8"
            style={{ fontFamily: SANS, fontSize: '1rem', lineHeight: 1.7, color: pearl(0.72), maxWidth: '46ch' }}
          >
            No description can replace the experience of sitting before a Shigeru Kawai grand. Find
            an authorized dealer and arrange a private appointment.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
