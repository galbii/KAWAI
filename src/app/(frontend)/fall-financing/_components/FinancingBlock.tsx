'use client'

import { useMemo, useState } from 'react'
import { PROMO_CONTAINER_WIDE, PromoCtaSecondaryButton, PromoReveal } from '@/components/fall-promo'
import { useModal } from '@/hooks'
import { FinancingDisclosure } from './FinancingDisclosure'
import { FinancingLearnMore } from './FinancingLearnMore'
import { FinancingRangeModal, type FinancingRange } from './FinancingRangeModal'
import { RangeIndex } from './RangeIndex'
import { PromoButton } from './PromoUI'
import { financing, financingRanges, SECTION } from './campaign'
import type { FinancedCategory, FinancedProduct } from '@/lib/payload/financing-types'

/**
 * The Q4 2026 Synchrony financing offer.
 *
 * On the page's own Ivory ground — the one light section between the dark
 * photographic stages — because this is where a shopper reads terms, and Ink
 * on Ivory (15.01:1) carries small print better than anything laid on a
 * picture.
 *
 * ── The composition ───────────────────────────────────────────────────────
 *
 * Two bands. The offer first: the §4.1/§4.2 lockup at full width and large,
 * with the dealer note and the button opposite it on its baseline. Then what
 * the offer covers (`RangeIndex`): the range carousel, sticky, beside an
 * index of every range, the two kept in step — the carousel to browse, the
 * index to see the whole offer at once. Under the index, in the same column,
 * the payment note and the Supporting Disclosure, so the carousel stays in
 * view while the fine print scrolls past it.
 *
 * Before, the carousel stood alone beside a narrow text column: eight of nine
 * ranges were always behind its arrows, and the headline — the offer — was set
 * at a third of the width at 2.5rem.
 *
 * Copy is untouched. Every string comes from `financing`, `disclosures` and
 * the range data, exactly as before; only the arrangement changed.
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
 * ── Motion, and the two things that must not move ────────────────────────
 *
 *   · The §4.1/§4.2 lockup is ONE reveal part. "0%", "(APR 8.01%)*" and the
 *     subhead share a single element's opacity and transform at every frame,
 *     so no frame of the entrance shows the rate without its APR or at a
 *     different weight from it. Never split it into staggered parts.
 *   · The Supporting Disclosure is not revealed at all. §4.4 wants it visible
 *     on page load; an opacity-0 start that waits for scroll is the opposite
 *     of that, however briefly. It sits outside every PromoReveal.
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
const HEADLINE_SIZE = 'clamp(2rem, 4vw, 3.75rem)'

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
      <div className={`${PROMO_CONTAINER_WIDE} py-20 md:py-28`}>
        {/* ── The offer ─────────────────────────────────────────────────
            The regulated lockup leads the section at full width, with the
            dealer note and the button opposite it on the same baseline. */}
        <PromoReveal className="grid gap-10 border-b border-[color:var(--rule)] pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-20 lg:pb-16">
          {/* §4.1 + §4.2 — one scale. The two prominent parts are bare text
              in the h2 at 1em; only the connector is wrapped, at 0.72em. The
              subhead follows at 0.42em with nothing inserted between.

              One `data-reveal` for the whole lockup — see the motion note
              at the top of this file. */}
          <div data-reveal="rise" className="max-w-[17em]" style={{ fontSize: HEADLINE_SIZE }}>
            <h2 className="promo-h2 text-[color:var(--on-ground)]" style={{ fontSize: '1em' }}>
              {financing.heading.lead}{' '}
              <span style={{ fontSize: `${CONNECTOR_RATIO}em` }}>
                {financing.heading.connector}
              </span>{' '}
              {financing.heading.apr}
            </h2>
            <p
              className="promo-body mt-5 max-w-[34em] leading-snug text-[color:var(--body)]"
              style={{ fontSize: `${SUBHEAD_RATIO}em` }}
            >
              {financing.subhead}
            </p>
          </div>

          {/* OUTSIDE the lockup div above, deliberately. §4.2 requires the
              subhead to follow the headline with nothing between them, so
              this comes after the pair closes rather than inside it — and it
              carries no figure, so it is not a regulated line that has left
              its disclosure behind. */}
          <div>
            <p
              data-reveal="rise"
              className="promo-body text-[1.05rem] font-medium leading-snug text-[color:var(--on-ground)]"
            >
              {financing.dealerNote}
            </p>
            <div data-reveal="rise" className="mt-6 flex flex-wrap gap-3">
              <PromoButton />
              {SHOW_LEARN_MORE && (
                <PromoCtaSecondaryButton onClick={learn.open} hasPopup="dialog">
                  {financing.learnMoreCta}
                </PromoCtaSecondaryButton>
              )}
            </div>
          </div>
        </PromoReveal>

        {/* ── What it covers ─────────────────────────────────────────── */}
        <PromoReveal delay={0.1} className="mt-12 lg:mt-16">
          {ranges.length === 0 ? (
            <p className="promo-body border border-[color:var(--rule-soft)] bg-[color:var(--surface)] px-6 py-12 text-center text-[0.95rem] text-[color:var(--body)]">
              {financing.emptyState}
            </p>
          ) : (
            <RangeIndex ranges={ranges} onOpen={setOpenHandle}>
              {/* The Supporting Disclosure, continuing the index column under
                  the payment note, beside the sticky photograph. It carries no
                  `data-reveal` — PromoReveal only ever animates marked
                  elements — so it is visible text on load, as §4.4 requires. */}
              <div className="mt-12 border-t border-[color:var(--rule)] pt-10">
                <FinancingDisclosure />
              </div>
            </RangeIndex>
          )}
        </PromoReveal>

        {/* No ranges, no index to sit in: the disclosure still renders, as
            page text, under the empty state. */}
        {ranges.length === 0 && (
          <div className="mt-12 max-w-[72ch] border-t border-[color:var(--rule)] pt-10">
            <FinancingDisclosure />
          </div>
        )}
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
