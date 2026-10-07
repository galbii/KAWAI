'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { planFor } from '@/lib/financing/plan'
import { FALL_2026 } from '@/lib/financing/terms'
import { formatOfferPrice } from './money'
import { financing } from './campaign'
import type { FinancingRange } from './FinancingRangeModal'
import { RangeCarousel } from './RangeCarousel'

/**
 * The ranges the offer covers: a browsable carousel beside an index of them,
 * the two kept in step.
 *
 * The carousel is how a shopper browses — one range at a time, large, with its
 * own arrows, dots and swipe, each tile opening that range's models. The index
 * is how they see the whole offer at once, which the carousel alone could not
 * show: eight of nine ranges were always behind the arrows. Either one drives
 * the other. Turning the carousel lights the matching row; pointing at a row
 * (hover, or keyboard focus) turns the carousel to it. Choosing a row or a
 * tile opens `FinancingRangeModal`.
 *
 * Grouped Grand / Upright / Shigeru, in `financingRanges` order — the group
 * names are the instrument families the offer's eligibility sentence names,
 * so they are information, not decoration.
 *
 * ── Copy ──────────────────────────────────────────────────────────────────
 * Every string here is existing, approved campaign copy: the range title, its
 * model count, `financing.startingAt` with the cheapest model's payment, and
 * `financing.paymentNote`, which must sit beside the figures it qualifies —
 * so it sits directly under this list. Nothing in this file states a rate.
 *
 * Whole dollars on the per-range figure: it is an estimate, and cents imply a
 * quote. The Supporting Disclosure carries the terms.
 *
 * ── Small screens ─────────────────────────────────────────────────────────
 * The carousel sits above the list and is swiped; the list below it is the
 * same tap targets as on desktop.
 */

/** The cheapest priced model's intro payment, or null for a range sold by consultation. */
function entryPayment(range: FinancingRange): number | null {
  const cheapest = range.products.find((p) => p.price != null)
  if (!cheapest?.price) return null
  return planFor(cheapest.price, FALL_2026).introMonthly
}

export function RangeIndex({
  ranges,
  onOpen,
  children,
}: {
  ranges: FinancingRange[]
  onOpen: (handle: string) => void
  /** Rendered at the foot of the index column — the section's fine print. */
  children?: ReactNode
}) {
  const [active, setActive] = useState(ranges[0]?.handle ?? '')
  // Stable, because the carousel re-subscribes to its scroll events whenever
  // this callback's identity changes.
  const show = useCallback((handle: string) => setActive(handle), [])

  const total = ranges.reduce((n, r) => n + r.products.length, 0)
  const groups = ranges.reduce<Array<{ name: string; ranges: FinancingRange[] }>>((acc, r) => {
    const last = acc[acc.length - 1]
    if (last && last.name === r.group) last.ranges.push(r)
    else acc.push({ name: r.group, ranges: [r] })
    return acc
  }, [])

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      {/* The carousel. Sticky beside the list from `lg`, so it stays in view
          while the index and the fine print scroll past it. */}
      <div className="lg:sticky lg:top-24">
        <RangeCarousel
          ranges={ranges}
          onOpen={onOpen}
          active={active}
          onActiveChange={show}
          showHeader={false}
        />
      </div>

      {/* Right padding from `lg` clears the site's fixed edge tabs (the
          Recents drawer and the side rail), which otherwise sit over the end
          of each payment figure. */}
      <div className="lg:pr-14">
        <div
          data-reveal="rise"
          className="flex items-baseline justify-between gap-4 border-b border-[color:var(--on-ground)] pb-3"
        >
          {/* h3 — the section's h2 is the financing headline above. */}
          <h3 className="promo-body text-[1rem] font-semibold text-[color:var(--on-ground)]">
            {financing.browseHeading}
          </h3>
          <p className="promo-num shrink-0 text-[0.85rem] text-[color:var(--body-dim)]">{total} models</p>
        </div>

        {groups.map((group) => (
          <div key={group.name} role="group" aria-label={group.name} className="mt-7 first-of-type:mt-6">
            {/* A one-range group named the same as its range ("Shigeru Kawai")
                would say the same words twice in a row; the row says it. */}
            {!(group.ranges.length === 1 && group.ranges[0]?.title === group.name) && (
              <p data-reveal="rise" className="promo-body text-[0.85rem] font-semibold text-[color:var(--body-dim)]">
                {group.name}
              </p>
            )}
            <ul className="mt-2">
              {group.ranges.map((range) => {
                const lit = range.handle === active
                const from = entryPayment(range)
                const count = range.products.length
                return (
                  <li key={range.handle} data-reveal="rise" className="border-b border-[color:var(--rule)]">
                    <button
                      type="button"
                      onClick={() => onOpen(range.handle)}
                      onPointerEnter={(e) => {
                        if (e.pointerType === 'mouse') show(range.handle)
                      }}
                      onFocus={() => show(range.handle)}
                      aria-haspopup="dialog"
                      className="promo-focus group relative grid w-full grid-cols-1 items-center gap-x-4 py-4 text-left sm:grid-cols-[minmax(0,1fr)_auto] lg:py-5"
                    >
                      {/* The active row's mark: an Ember bar, a graphic, so it
                          needs 3:1 and not 4.5:1. The text stays Ink. */}
                      <span
                        aria-hidden
                        className={`absolute -left-4 top-1/2 hidden h-8 w-[3px] -translate-y-1/2 origin-center bg-[color:var(--ember)] transition-transform duration-300 lg:block ${
                          lit ? 'scale-y-100' : 'scale-y-0'
                        }`}
                      />

                      <span className="min-w-0">
                        <span
                          className="promo-h2 block leading-tight text-[color:var(--on-ground)]"
                          // Inline: .promo-h2's own size outranks utilities.
                          style={{ fontSize: 'clamp(1.3rem, 1.9vw, 1.75rem)' }}
                        >
                          {range.title}
                        </span>
                        <span className="promo-num mt-1 block text-[0.85rem] text-[color:var(--body-dim)]">
                          {`${count} ${count === 1 ? 'model' : 'models'}`}
                        </span>
                      </span>

                      {/* Under the name on a phone, where a long range name and
                          the figure cannot share a line; beside it from `sm`. */}
                      <span className="mt-2 text-left sm:mt-0 sm:text-right">
                        {from !== null ? (
                          <span className="promo-num block whitespace-nowrap text-[0.95rem] text-[color:var(--on-ground)]">
                            {`${financing.startingAt} ${formatOfferPrice(Math.round(from))}/month`}
                          </span>
                        ) : (
                          <span className="promo-body block whitespace-nowrap text-[0.9rem] text-[color:var(--body-dim)]">
                            {financing.onRequest}
                          </span>
                        )}
                        <span className="promo-body mt-1 hidden text-[0.82rem] font-semibold text-[color:var(--on-ground)] underline decoration-[color:var(--on-ground)]/25 underline-offset-4 transition-[text-decoration-color] duration-300 group-hover:decoration-[color:var(--ember)] sm:inline-block">
                          {financing.seriesCta}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* The qualifier, beside the figures it qualifies. */}
        <p
          data-reveal="fade"
          className="promo-body mt-6 max-w-[60ch] text-[0.8rem] leading-relaxed text-[color:var(--body-dim)]"
        >
          {financing.paymentNote}
        </p>

        {children}
      </div>
    </div>
  )
}
