'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SHIGERU_MODELS } from '../../_data/models'
import type { ShigeruPageData } from '../../_data/shopify'
import { GOLD, OSWALD, PEARL, SHOT_FRAME_ASPECT, ink, shotFix } from '@/lib/shigeru/tokens'
import { useReveal } from '@/lib/shigeru/use-reveal'

/** One equal cell per model — the row is a set of six targets, not a ruler. */
const COLUMNS = `repeat(${SHIGERU_MODELS.length}, minmax(0, 1fr))`

/** Fixed name block under every instrument, so the floor line sits flat. */
const NAME_BLOCK = '3.25rem'

type FloorProps = {
  productData: ShigeruPageData
  /**
   * Slug of the model whose page this is — drawn solid with a gold underline,
   * the rest ghosted. Omit on the collection page, where no one instrument is
   * the subject and all six are drawn at full strength.
   */
  activeSlug?: string
  /**
   * `page` links out to each model's own page. `anchor` jumps down to that
   * model's entry on the current page — what the collection page wants, since
   * the entries are right there.
   */
  linkMode?: 'page' | 'anchor'
}

/**
 * The six grands standing on one floor line, one frame each.
 *
 * The row used to size every column and every frame by length, on the claim
 * that it drew the range to true relative scale. It never did: the six files
 * are framed differently from one another, so apparent size followed each
 * photo's padding rather than the piano — measured against the SK-EX the other
 * five came out 18–27% oversized, and which of the two numbers you got
 * depended on the viewport, because the SK-EX's frame crossed from
 * width-bound to height-bound partway through the range of row widths. A
 * measurement that moves when you resize the window is not a measurement.
 *
 * So: equal columns, one frame ratio (SHOT_FRAME_ASPECT), `shotFix` to undo
 * what each file bakes in. Every instrument renders at the same height with
 * its feet on the shared floor, and length is stated in words on each model's
 * page. The 70rem minimum is now only about legibility — below it the row
 * scrolls rather than crushing six cells.
 *
 * `shotFix` is identity for all six today — every shot is a transparent PNG
 * cropped flush, so there is nothing left to undo. It stays wired in because a
 * replaced asset is exactly how the row breaks: the SK-EX was once a
 * white-background JPEG with margin baked in, and when it was re-cropped the
 * correction for the old file was left behind and went on scaling the new one
 * 1.18× and pushing it below the floor line. See SHOT_FILL.
 *
 * On the blend trap: mix-blend-multiply is still applied here, and is now
 * near-inert — it was what dropped the white-background SK-EX onto the pearl,
 * and every shot carries an alpha channel instead. It is kept only because the
 * same class is used by five other components on this site that have not been
 * revisited; retiring it is one change across all six, not one here. While it
 * is present the rule it imposes still holds: any ancestor that animates
 * transform or opacity isolates the blend group, so every animated wrapper in
 * here paints an opaque pearl background of its own.
 */
export function RangeFloor({ productData, activeSlug, linkMode = 'page' }: FloorProps) {
  const { ref, shown } = useReveal<HTMLDivElement>(0.2)

  return (
    <div className="overflow-x-auto sk-scroll-hide">
      <div className="min-w-[70rem]">
        <div
          ref={ref}
          className={`relative grid items-end ${shown ? 'is-shown' : ''}`}
          style={{ gridTemplateColumns: COLUMNS }}
        >
          {SHIGERU_MODELS.map((m, i) => {
            const current = m.slug === activeSlug
            const ghosted = activeSlug !== undefined && !current
            const image = productData[m.slug.replace(/-/g, '')]?.imageUrl ?? null
            const href =
              linkMode === 'anchor' ? `#model-${m.slug}` : `/shigeru/models/${m.slug}`

            const body = (
              <>
                <span
                  className="sk-reveal sk-reveal-up relative block w-full overflow-hidden"
                  style={
                    {
                      aspectRatio: SHOT_FRAME_ASPECT,
                      background: PEARL,
                      '--sk-delay': `${i * 0.075}s`,
                    } as React.CSSProperties
                  }
                >
                  {/* The shot hangs 0.5rem below the frame's top edge so the
                      hover lift has somewhere to go — `-translate-y-2` is the
                      same 0.5rem, so the instrument rises to the frame edge and
                      no further. The frame clips, which now only matters for
                      that lift. (It used to matter much more: shotFix scaled the
                      old white-background SK-EX up until it filled the frame,
                      spilling its baked-in margin past all four edges. That
                      asset and that correction are both gone.) */}
                  {image && (
                    <span className="absolute inset-x-0 top-2 bottom-0 block">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="240px"
                        className="object-contain object-bottom mix-blend-multiply transition-transform duration-500 ease-out group-hover:-translate-y-2"
                        style={{ opacity: ghosted ? 0.55 : 1, ...shotFix(m.slug) }}
                      />
                    </span>
                  )}
                </span>

                <span
                  className="relative flex w-full items-center justify-center"
                  style={{ height: NAME_BLOCK }}
                >
                  <span
                    className="uppercase leading-none transition-colors duration-300"
                    style={{
                      fontFamily: OSWALD,
                      fontSize: '0.95rem',
                      fontWeight: current || activeSlug === undefined ? 700 : 500,
                      letterSpacing: '0.1em',
                      color: current || activeSlug === undefined ? ink(0.95) : ink(0.72),
                    }}
                  >
                    {m.name}
                  </span>

                  {/* Gold marker: always shown on the current model, drawn in
                      from the centre on hover for the rest. */}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-2 left-1/2 h-[3px] w-9 -translate-x-1/2 origin-center transition-transform duration-300 ease-out ${
                      current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                    style={{ background: GOLD }}
                  />
                </span>
              </>
            )

            return current ? (
              <span
                key={m.slug}
                aria-current="page"
                className="group flex flex-col items-center justify-end"
              >
                {body}
              </span>
            ) : (
              <Link
                key={m.slug}
                href={href}
                className="group flex flex-col items-center justify-end"
              >
                <span className="sr-only">Shigeru Kawai {m.name}, </span>
                {body}
                <span className="sr-only">{m.type}</span>
              </Link>
            )
          })}

          {/* The shared floor, one continuous line under every instrument */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{ bottom: NAME_BLOCK, background: ink(0.22) }}
          />
        </div>

        {/* The two ends of the range, labelled where they sit */}
        <div className="flex items-baseline justify-between pt-3">
          {(['The beginning', 'The pinnacle'] as const).map((text) => (
            <span
              key={text}
              className="uppercase"
              style={{
                fontFamily: OSWALD,
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
      aria-label="The six Shigeru Kawai grand pianos"
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
              fontFamily: OSWALD,
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
