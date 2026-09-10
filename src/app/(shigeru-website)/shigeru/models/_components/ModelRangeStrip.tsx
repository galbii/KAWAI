import Image from 'next/image'
import Link from 'next/link'
import { SHIGERU_MODELS } from '../../_data/models'
import type { ShigeruPageData } from '../../_data/shopify'
import { GOLD, ink, lengthRatio } from '@/lib/shigeru/tokens'

/** Column widths track length too, so the row is to scale along both axes. */
const COLUMNS = SHIGERU_MODELS.map((m) => `${lengthRatio(m.cm)}fr`).join(' ')

type FloorProps = {
  productData: ShigeruPageData
  /**
   * Slug of the model whose page this is — drawn solid with a gold underline,
   * the rest ghosted. Omit on the collection page, where no one instrument is
   * the subject and all six are drawn at full strength.
   */
  activeSlug?: string
  /** Height of the SK-EX in rem; every other model is drawn against it. */
  heightRem?: number
}

/**
 * The six grands standing on one floor line, drawn to true relative scale.
 *
 * Column widths are proportional to length, so the widest-aspect shot — the
 * SK-EX, on its white studio background — is what decides how tall the row can
 * get before its column starts cropping it instead of its own height. The
 * 70rem minimum keeps every instrument height-bound, which is what makes the
 * scaling honest; below that the row scrolls rather than lying about the
 * proportions.
 *
 * Never wrap this in an element that animates transform or opacity. The shots
 * are a mix of transparent PNGs and white-background JPEGs, and the JPEGs only
 * disappear into the pearl because of mix-blend-multiply — an animated
 * ancestor isolates the blend group and the SK-EX renders as a white box.
 */
export function RangeFloor({ productData, activeSlug, heightRem = 11 }: FloorProps) {
  return (
    <div className="overflow-x-auto sk-scroll-hide">
      <div className="grid min-w-[70rem] items-end" style={{ gridTemplateColumns: COLUMNS }}>
        {/* Row 1 — the instruments, each as tall as its length allows */}
        {SHIGERU_MODELS.map((m) => {
          const ghosted = activeSlug !== undefined && m.slug !== activeSlug
          const image = productData[m.slug.replace(/-/g, '')]?.imageUrl ?? null
          if (!image) return <div key={m.slug} aria-hidden="true" />

          return (
            <span
              key={m.slug}
              aria-hidden="true"
              className="relative block w-full"
              style={{ height: `${lengthRatio(m.cm) * heightRem}rem` }}
            >
              {/* Opacity sits on the image itself: an opacity wrapper would
                  isolate the blend group, and the white-background SK-EX shot
                  would show its box instead of multiplying into the pearl. */}
              <Image
                src={image}
                alt=""
                fill
                sizes="280px"
                className="object-contain object-bottom mix-blend-multiply"
                style={{ opacity: ghosted ? 0.55 : 1 }}
              />
            </span>
          )
        })}

        {/* Row 2 — the shared floor */}
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{ gridColumn: '1 / -1', background: ink(0.22) }}
        />

        {/* Row 3 — names */}
        {SHIGERU_MODELS.map((m) => {
          const current = m.slug === activeSlug
          const nameStyle = {
            fontFamily: 'var(--font-oswald)',
            fontSize: '0.95rem',
            fontWeight: current || activeSlug === undefined ? 700 : 500,
            letterSpacing: '0.1em',
            color: current || activeSlug === undefined ? ink(0.95) : ink(0.72),
          }

          return (
            <div key={m.slug} className="text-center">
              {current ? (
                <span
                  aria-current="page"
                  className="relative inline-block pt-4 pb-2.5 uppercase leading-none"
                  style={nameStyle}
                >
                  {m.name}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px]"
                    style={{ background: GOLD }}
                  />
                </span>
              ) : (
                <Link
                  href={`/shigeru/models/${m.slug}`}
                  className="inline-block pt-4 pb-2.5 uppercase leading-none transition-colors duration-200 hover:!text-kawai-black"
                  style={nameStyle}
                >
                  <span className="sr-only">Shigeru Kawai </span>
                  {m.name}
                  <span className="sr-only"> {m.type}</span>
                </Link>
              )}
            </div>
          )
        })}

        {/* Row 4 — the two ends of the range, labelled where they sit */}
        <div className="flex items-baseline justify-between pt-4" style={{ gridColumn: '1 / -1' }}>
          {(['The beginning', 'The pinnacle'] as const).map((text) => (
            <span
              key={text}
              className="uppercase"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: '0.7rem',
                letterSpacing: '0.28em',
                color: ink(0.72),
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * The range as a page section, closing with the route back to the collection.
 * Used at the foot of every model page: it carries the onward navigation, so
 * those pages need no prev/next block down there — every sibling is one click
 * away and you can see what you would be clicking on.
 */
export function ModelRangeStrip({
  activeSlug,
  productData,
}: {
  activeSlug: string
  productData: ShigeruPageData
}) {
  return (
    <section
      aria-label="The six Shigeru Kawai grand pianos, drawn to scale"
      className="bg-kawai-pearl"
    >
      <div
        className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28"
        style={{ borderTop: `1px solid ${ink(0.12)}` }}
      >
        <RangeFloor productData={productData} activeSlug={activeSlug} />

        <div className="mt-14 text-center">
          <Link
            href="/shigeru/models"
            className="group inline-flex items-center gap-3 uppercase transition-colors duration-200 hover:!text-kawai-black"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.28em',
              color: ink(0.72),
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
            >
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                <path
                  d="M15 5.5H1M5 1.5L1 5.5L5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            View All Models
          </Link>
        </div>
      </div>
    </section>
  )
}
