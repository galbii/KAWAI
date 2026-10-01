'use client'

import { useMemo, useState } from 'react'
import { PROMO_CONTAINER_WIDE, PromoCtaSecondaryButton } from '@/components/fall-promo'
import { useModal } from '@/hooks'
import { FinancingDisclosure } from './FinancingDisclosure'
import { FinancingLearnMore } from './FinancingLearnMore'
import { FinancingRangeModal, type FinancingRange } from './FinancingRangeModal'
import { RangeCarousel } from './RangeCarousel'
import { PromoButton } from './PromoUI'
import { financing, financingRanges, PROGRAM_END, SECTION } from './campaign'
import type { FinancedCategory, FinancedProduct } from '@/lib/payload/financing-types'

/**
 * The Q4 2026 Synchrony financing offer.
 *
 * One photograph left, one column of words right, all of it on the page's own
 * Ivory ground. The tiles carry the pictures; the section around them does
 * not, so the copy needs no card and no `.promo-photo-text` shadow — it is Ink
 * on Ivory at 15.01:1 and brings its own contrast.
 *
 * ── The composition, and why it is one grid ──────────────────────────────
 *
 * Everything the section says runs down a single 30rem column: headline,
 * terms, dealer note, the two buttons, then the Supporting Disclosure. The
 * carousel holds the other column for the full height of all of it, sticky, so
 * what leads the section is the instrument rather than its small print.
 *
 * It was two stacked blocks — a copy/carousel grid, then a full-width band of
 * fine print in two columns of its own. That band set 13px type across 104rem
 * and read as a separate, unrelated section; folding it into the text column
 * is what "one column" means here. See the placement comment below for how the
 * three items are ordered for a phone versus painted on a desktop.
 *
 * It runs in a wider container than the rest of the page. The carousel is the
 * one thing here that rewards width: a 4:3 tile at the campaign's usual 78rem
 * measure is a postcard, and the text column beside it is a fixed width either
 * way, so every rem the container gains goes to the photograph.
 *
 * ── The parts that are Synchrony legal review, not house style ───────────
 *
 *   §4.1  The headline is one `<h2>` holding three strings. "0%" and
 *         "(APR 8.01%)*" are bare text nodes in it, so they inherit one font
 *         size and cannot be styled apart at any breakpoint; only the
 *         connector between them is wrapped and sized down, and only because
 *         it carries no figure. Never put a rate or an amount in the span.
 *   §4.2  The subhead renders immediately after the headline with nothing
 *         between, at no less than 40% of its size. `.promo-lede` under
 *         `.promo-h2` is about 36% at the widest breakpoint and would fail, so
 *         the lockup below sizes both from one parent `fontSize` and the ratio
 *         holds by construction. The connector sits inside the headline rather
 *         than between the two elements, so it does not break this.
 *   §4.3  The `*` and `**` marks are references. `*` is on the headline, `**`
 *         on the subhead, and both footnotes render below in
 *         FinancingDisclosure.
 *   §4.4  The Supporting Disclosure is visible text on page load, rendered by
 *         FinancingDisclosure at the foot of this section. It must never move
 *         into a dialog, accordion or toggle. The dialog this block opens
 *         explains the payment mechanism and carries no disclosure text — a
 *         "See financing terms" modal lived here once, and §4.4 is precisely
 *         why it is gone.
 *   §5    No store links: acoustic pianos are not sold online. The dealer
 *         button goes to the locator, and a model name links to a product page
 *         which for an acoustic carries a dealer CTA and no add-to-cart.
 *
 * The headline and the terms sentence appear ONCE on the page. They used to
 * render here and again inside the disclosure; the approved banner states them
 * once, with the details link and fine print directly under, and so does this.
 */

/** §4.2's floor is 40%. 0.42 leaves headroom for rounding at any zoom. */
const SUBHEAD_RATIO = 0.42
/**
 * The connector's size, as a fraction of the two prominent parts — the banner's
 * proportion. It may go down but never up: at 1 the connector would read as
 * part of the regulated lockup.
 */
const CONNECTOR_RATIO = 0.72

/**
 * The "How the payments work" button and its dialog — off for now.
 *
 * Flip to `true` to bring both back; nothing else has to move. It is a flag
 * rather than a deletion because what the dialog explains is still true and
 * still the one thing the figures do not say for themselves: the promotional
 * payments are sized against the full 60-month term, so a balance remains and
 * the payment rises at month 25.
 *
 * Hiding it is a §4.4-safe change, and that is worth stating because it looks
 * like it should not be. The dialog never held disclosure text — §4.4 forbids
 * exactly that, which is why a "See financing terms" modal was removed from
 * this block long ago. The regulated statement of the payment stream lives in
 * the Supporting Disclosure, which is visible page text and names both
 * amounts, $133.33 and $185.78, and both rate windows. So what goes away here
 * is a plain-language explanation, not a required one.
 */
const SHOW_LEARN_MORE = false
const HEADLINE_SIZE = 'clamp(1.6rem, 2.6vw, 2.5rem)'

export function FinancingBlock({
  data,
  rangeArt,
}: {
  data: FinancedCategory[]
  /** Collection handle → showcase image, from `getCollectionArt()`. */
  rangeArt: Record<string, string>
}) {
  const learn = useModal()
  const [openHandle, setOpenHandle] = useState<string | null>(null)

  /**
   * Regroup the category-shaped query result by Shopify collection, in the
   * order `financingRanges` declares, dropping any range that resolves empty.
   *
   * The query groups by piano category because that is what the old ledger
   * needed; collections are a second axis over the same rows, so this is a
   * reshape rather than a second fetch. `claimed` keeps a model that matches
   * both a handle and another range's override in the first range only.
   */
  const ranges = useMemo<FinancingRange[]>(() => {
    const all = data.flatMap((c) => c.products)
    const claimed = new Set<string>()

    return financingRanges
      .map((range) => {
        const products = all.filter((p) => {
          if (claimed.has(p.slug)) return false
          return p.collectionHandle === range.handle || (range.extraModels?.includes(p.model) ?? false)
        })
        products.forEach((p) => claimed.add(p.slug))
        const art = rangeArt[range.handle]
        return {
          handle: range.handle,
          title: range.label ?? products[0]?.collectionTitle ?? range.handle,
          group: range.group,
          ...(art ? { art } : {}),
          products: products.sort(sortByPriceThenLabel),
        }
      })
      // Art is required, not decorative: the tile is a full-width photograph
      // and a range without one has nothing to be. `claimed` still ran above,
      // so a model belonging to a dropped range is not re-homed into a later
      // one — it simply is not in the carousel.
      .filter((r) => r.products.length > 0 && r.art)
  }, [data, rangeArt])

  const open = ranges.find((r) => r.handle === openHandle) ?? null

  return (
    <section
      id={SECTION.financing}
      className="scroll-mt-20 border-b border-[color:var(--rule)] bg-[color:var(--ground)]"
    >
      <div className={`${PROMO_CONTAINER_WIDE} py-16 md:py-24`}>
        {/* One grid, three items, explicitly placed — not two stacked blocks.
            The photograph holds the left column across both rows; every word
            in the section runs down the right one, headline through fine
            print, as a single column of text beside a single image.

            Placement is by `col-start`/`row-start` rather than `order` because
            the three do not read in the same sequence they are painted. Source
            order is text → imagery → disclosure, which is what a screen reader
            and a phone get: the headline before the browser, the browser
            before the fine print. On `lg` the first item moves to the top of
            the right column, the second spans the left, and the third
            continues the right column underneath the first. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16">
          <div className="lg:col-start-2 lg:row-start-1">
            {/* §4.1 + §4.2 — one scale. The two prominent parts are bare text
                in the h2 at 1em; only the connector is wrapped, at 0.72em. The
                subhead follows at 0.42em with nothing inserted between. */}
            <div style={{ fontSize: HEADLINE_SIZE }}>
              <h2 className="promo-h2 text-[color:var(--on-ground)]" style={{ fontSize: '1em' }}>
                {financing.heading.lead}{' '}
                <span style={{ fontSize: `${CONNECTOR_RATIO}em` }}>
                  {financing.heading.connector}
                </span>{' '}
                {financing.heading.apr}
              </h2>
              <p
                className="promo-body mt-4 leading-snug text-[color:var(--body)]"
                style={{ fontSize: `${SUBHEAD_RATIO}em` }}
              >
                {financing.subhead}
              </p>
            </div>

            {/* OUTSIDE the lockup div above, deliberately. §4.2 requires the
                subhead to follow the headline with nothing between them, so
                this sits after the pair closes rather than inside it — and it
                carries no figure, so it is not a regulated line that has left
                its disclosure behind. */}
            <p className="promo-body mt-7 text-[1rem] font-medium leading-snug text-[color:var(--on-ground)]">
              {financing.dealerNote}
            </p>

            {/* The dealer CTA, opening the enquiry form without leaving the
                page mid-offer. It was a pair — act, or read first — and the
                "read first" half is behind SHOW_LEARN_MORE for now. */}
            <div className="mt-6 flex flex-wrap gap-3">
              <PromoButton />
              {SHOW_LEARN_MORE && (
                <PromoCtaSecondaryButton onClick={learn.open} hasPopup="dialog">
                  {financing.learnMoreCta}
                </PromoCtaSecondaryButton>
              )}
            </div>
          </div>

          {/* The imagery, holding the left column for the section's whole
              height. `self-start` keeps the item its own height inside a grid
              area that spans both rows, which is what gives `sticky` somewhere
              to travel: the photograph stays in view while the fine print
              scrolls past it, so the section stays led by the picture rather
              than by its own small print. */}
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
            {ranges.length === 0 ? (
              <p className="promo-body border border-[color:var(--rule-soft)] bg-[color:var(--surface)] px-6 py-12 text-center text-[0.95rem] text-[color:var(--body)]">
                {financing.emptyState}
              </p>
            ) : (
              <RangeCarousel ranges={ranges} onOpen={setOpenHandle} />
            )}

            {/* The qualifier belongs with the figures it qualifies. The tiles
                quote a monthly payment; this sits directly under them rather
                than across the grid in the copy column, where it was stranded
                from everything it refers to. */}
            {ranges.length > 0 && (
              <p className="promo-body mt-5 max-w-[60ch] text-[0.72rem] leading-relaxed text-[color:var(--body-dim)]">
                {financing.paymentNote}
              </p>
            )}
          </div>

          {/* The fine print, continuing the same column the headline started.
              It used to be a full-width band below the grid, which set 13px
              type across 104rem in two columns with a gutter wide enough to
              lose the reader between them. In the text column it is one
              column at a readable measure, under the headline whose footnote
              marks it resolves.

              §4.4 is unaffected: still visible text on page load, still not a
              dialog, accordion or toggle. It moved column, not tier.

              No dealer button above it. The banner has none, the copy above
              already carries one and the floating PromoOfferDock a third — a
              CTA immediately over the fine print was the one place on the page
              it had no business being. */}
          <div className="border-t border-[color:var(--rule)] pt-10 lg:col-start-2 lg:row-start-2 lg:mt-4">
            <FinancingDisclosure />
          </div>
        </div>
      </div>

      {SHOW_LEARN_MORE && <FinancingLearnMore isOpen={learn.isOpen} onClose={learn.close} />}
      <FinancingRangeModal range={open} onClose={() => setOpenHandle(null)} />
    </section>
  )
}

/** Cheapest first; unpriced models (the Shigeru line) sit together at the end. */
function sortByPriceThenLabel(a: FinancedProduct, b: FinancedProduct) {
  if ((a.price == null) !== (b.price == null)) return a.price == null ? 1 : -1
  if (a.price != null && b.price != null && a.price !== b.price) return a.price - b.price
  return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' })
}
