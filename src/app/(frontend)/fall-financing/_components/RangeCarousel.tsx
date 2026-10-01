'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { planFor } from '@/lib/financing/plan'
import { FALL_2026 } from '@/lib/financing/terms'
import { financing } from './campaign'
import type { FinancingRange } from './FinancingRangeModal'

/**
 * The ranges the offer covers, one at a time, as a full-bleed tile.
 *
 * Nine collections will not stack — as a column they ran several screens and
 * read as a list. On a rail one tile takes the whole width of its column, so
 * each range gets a picture at a size worth looking at instead of nine
 * thumbnails competing at a third of it.
 *
 * The tile is the SH-9 bundle's series tile scaled up: a photographic crop that
 * darkens toward the foot, name and count in that shadow, the way in revealed
 * on hover. It opens a dialog rather than navigating — the models are a detail
 * of this offer, and a collection page would drop the financing context that
 * brought the reader here.
 *
 * ── Controls ──────────────────────────────────────────────────────────────
 * Arrows sit inside the tile, where they are over the photograph and keep
 * `PromoHeroCarousel`'s Ivory-on-scrim treatment. The dots and the counter sit
 * beneath it on the section's own Ivory ground, so those invert to Ink — a
 * control's colour follows what is behind it, not what it belongs to. There is no autoplay and so no pause button:
 * WCAG 2.2.2 applies to motion that starts on its own, and a rail the reader
 * drives has nothing to stop.
 */

const CONTROL =
  'promo-focus flex h-11 w-11 items-center justify-center rounded-full border ' +
  'border-[color:var(--ivory)]/25 text-[color:var(--ivory)] shadow-lg backdrop-blur-xl ' +
  'transition-colors duration-200 hover:border-[color:var(--ivory)]/50 ' +
  'disabled:pointer-events-none disabled:opacity-30'
const CONTROL_FILL = { backgroundColor: 'rgba(29, 27, 24, 0.62)' }

export function RangeCarousel({
  ranges,
  onOpen,
}: {
  ranges: FinancingRange[]
  onOpen: (handle: string) => void
}) {
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', loop: true })
  const [selected, setSelected] = useState(0)

  const sync = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    sync()
    embla.on('select', sync).on('reInit', sync)
    return () => {
      embla.off('select', sync).off('reInit', sync)
    }
  }, [embla, sync])

  const many = ranges.length > 1
  const total = ranges.reduce((n, r) => n + r.products.length, 0)
  const current = ranges[selected]

  return (
    <div>
      {/* Light ground, so a rule rather than a card: `.promo-card` is a lift
          off Ink and goes muddy on Ivory. */}
      <div className="flex items-baseline justify-between gap-4 border-b border-[color:var(--rule)] pb-3">
        {/* h3 — the section's h2 is the headline beside this. */}
        <h3 className="promo-label text-[color:var(--body-dim)]">{financing.browseHeading}</h3>
        <p className="promo-num shrink-0 text-[0.8rem] text-[color:var(--body-dim)]">
          {total} models
        </p>
      </div>

      <div className="relative mt-5">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {ranges.map((range) => (
              // basis-full: one range on screen at a time, at the full width of
              // the column, which is the whole point of the rail.
              <div key={range.handle} className="min-w-0 shrink-0 grow-0 basis-full">
                <RangeTile range={range} onOpen={() => onOpen(range.handle)} />
              </div>
            ))}
          </div>
        </div>

        {many && (
          <>
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              aria-label="Previous range"
              className={`${CONTROL} absolute left-4 top-1/2 z-10 -translate-y-1/2`}
              style={CONTROL_FILL}
            >
              <svg
                className="h-5 w-5 -translate-x-[1px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              aria-label="Next range"
              className={`${CONTROL} absolute right-4 top-1/2 z-10 -translate-y-1/2`}
              style={CONTROL_FILL}
            >
              <svg
                className="h-5 w-5 translate-x-[1px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {many && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex items-center gap-2.5">
            {ranges.map((range, i) => (
              <li key={range.handle}>
                <button
                  type="button"
                  onClick={() => embla?.scrollTo(i)}
                  aria-label={range.title}
                  aria-current={i === selected}
                  className={`promo-focus block h-2.5 rounded-full transition-all duration-300 ${
                    i === selected
                      ? 'w-9 bg-[color:var(--on-ground)]'
                      : 'w-2.5 bg-[color:var(--on-ground)]/25 hover:bg-[color:var(--on-ground)]/50'
                  }`}
                />
              </li>
            ))}
          </ul>

          {/* Nine dots is a lot to count. The position in words is what a
              reader actually wants, and it doubles as the live region that
              tells a screen-reader user the rail moved. */}
          <p
            aria-live="polite"
            className="promo-num text-[0.78rem] text-[color:var(--body-dim)]"
          >
            {selected + 1} / {ranges.length}
            {current && <span className="sr-only"> — {current.title}</span>}
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * What the cheapest piano in a range comes to per month under the offer.
 *
 * The products arrive cheapest-first with unpriced models pushed to the end, so
 * the first priced one is the floor. A range with no priced model at all — the
 * Shigeru line is sold by consultation — returns null and the tile simply omits
 * the line rather than inventing a figure.
 */
function entryPayment(range: FinancingRange): number | null {
  const cheapest = range.products.find((p) => p.price != null)
  if (!cheapest?.price) return null
  return planFor(cheapest.price, FALL_2026).introMonthly
}

function RangeTile({ range, onOpen }: { range: FinancingRange; onOpen: () => void }) {
  const count = range.products.length
  const from = entryPayment(range)

  return (
    <button
      type="button"
      onClick={onOpen}
      // Tall on a phone where the column is narrow, wide on a tablet where it
      // is not, and tall again on a desktop — the crop stays around the
      // instrument throughout. The `lg` step back to 4:3 is what makes the
      // section imagery-led: from `lg` the tile holds a column of its own
      // beside the text, and a 16:10 crop at that width left the photograph
      // short against a full column of copy.
      className="promo-focus group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-[color:var(--ink)] text-left sm:aspect-[16/10] lg:aspect-[4/3]"
    >
      {/* Every range in the carousel has collection art — FinancingBlock drops
          the ones that do not — so there is no cut-out fallback to handle. */}
      {range.art && (
        <Image
          src={range.art}
          alt=""
          fill
          // From `lg` the tile holds about two thirds of a 104rem container,
          // which is nearer 60vw than the 45vw this declared while the text
          // column was wider. Under-declaring picks an undersized candidate
          // out of the srcset and softens a photograph the section leads on.
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* No gradient. The photograph runs clean and the labels carry a shadow
          instead of a ground — the same treatment the SH-9 series tiles use.
          Note what that costs: .promo-photo-text is a legibility aid, not a
          contrast fix, so a range whose art is bright behind the caption needs
          a better crop rather than a scrim added back here. */}
      <div className="pointer-events-none absolute inset-0 transition-colors duration-500 group-hover:bg-[color:var(--ink)]/10" />

      {/* Inset from the arrows, which sit at left-4/right-4 over the same tile. */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-6 sm:pb-6">
        <p className="promo-label promo-photo-text text-[0.68rem] text-[color:var(--ivory)]/75">
          {range.group}
        </p>
        <p className="promo-h2 promo-photo-text mt-1.5 text-[1.35rem] leading-none text-[color:var(--ivory)] transition-transform duration-500 group-hover:-translate-y-1 sm:text-[1.75rem]">
          {range.title}
        </p>
        <p className="promo-num promo-photo-text mt-2 text-[0.8rem] text-[color:var(--ivory)]">
          {count} {count === 1 ? 'model' : 'models'}
          {from !== null && (
            <>
              <span aria-hidden className="mx-2 text-[color:var(--ivory)]/50">
                ·
              </span>
              {/* Whole dollars: a range-level figure is an estimate, and cents
                  imply a quote. The qualifier under the tile's own CTA and the
                  Supporting Disclosure carry the rest of the terms. */}
              {financing.startingAt} {formatPrice(Math.round(from))}/month
            </>
          )}
        </p>

        <span className="promo-body mt-2.5 inline-flex max-h-0 items-center gap-2 overflow-hidden text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ivory)] opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:opacity-100">
          {financing.seriesCta}
          <ArrowRight className="h-3 w-3" aria-hidden />
        </span>
      </div>
    </button>
  )
}
