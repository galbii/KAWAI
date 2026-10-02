'use client'

import { useState } from 'react'
import Image from 'next/image'
import RebateModelModal from '@/components/rebates/RebateModelModal'
import { useLeadCampaign } from '@/components/campaign-lead'
import { PromoStage } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { rebate, esRebatesFor, PROGRAM_END_SHORT, SECTION } from './campaign'
import { formatPrice } from '@/lib/utils'
import type { PromoProduct } from '@/lib/payload/promo-types'
import type { RebateProduct } from '@/lib/payload/rebate-types'

/**
 * Up to $150 off an ES Series portable, as a ledger.
 *
 * This is signup3's rebate table: the row shape (thumbnail, model, a Save
 * figure, the struck price beside the price after, a chevron), the row as a
 * button rather than a link, and the same detail card opening out of it. What
 * changed is the dress — Fall Promo tokens instead of Oswald caps and
 * kawai-red — because a card that opens out of a ledger row should look like
 * the ledger it came from, and this ledger belongs to this page.
 *
 * The detail card itself is the shared `RebateModelModal`, not a copy. It
 * already fetches its own media and handles the Shigeru treatment; forking it
 * for one campaign would leave two cards to fix the next time a rebate program
 * changes shape.
 *
 * No category filter. signup3 has one because it spans the whole catalogue;
 * this program is three portables, and a filter bar over three rows is
 * scaffolding with nothing to hold up.
 *
 * ── Currency ──────────────────────────────────────────────────────────────
 * Amounts come from `esRebatesFor(site)` — USD on kawaius.com, CAD on
 * ca.kawaius.com. The two never merge, so a Canadian figure cannot surface on
 * the US site, which is the guarantee `getRebateShowcase(site)` gives the
 * signup pages. Catalogue prices are USD, so on CAD the ledger shows the
 * rebate alone rather than subtracting a Canadian rebate from an American
 * price.
 */
export function EsRebateBlock({
  products,
  site = 'us',
}: {
  products: PromoProduct[]
  site?: 'us' | 'cad'
}) {
  const [selected, setSelected] = useState<RebateProduct | null>(null)
  const { open: openLead } = useLeadCampaign()

  const showPrices = site === 'us'

  // One shape for the row and the card: RebateProduct is what the shared modal
  // takes, so the ledger builds it once rather than mapping at the boundary.
  const rows = esRebatesFor(site)
    .map((entry): RebateProduct | null => {
      const product = products.find((p) => p.model === entry.model)
      if (!product) return null
      const price = product.price ?? 0
      return {
        model: product.model,
        label: product.label,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        msrp: price,
        salePrice: price,
        yourPrice: Math.max(price - entry.rebate, 0),
        rebate: entry.rebate,
        note: entry.finishes,
        currency: entry.currency,
      }
    })
    .filter((r): r is RebateProduct => r !== null)
    .sort((a, b) => b.rebate - a.rebate)

  return (
    <>
      {/* The same split stage the SH-9 section uses: photograph behind the
          whole component, lockup on a card, working content opposite. No wash
          on the picture — the card and the ledger each bring their own ground,
          so nothing here is reading off bare photograph. */}
      <PromoStage
        id={SECTION.rebate}
        image={rebate.stageImage}
        imageAlt={rebate.stageImageAlt}
        eyebrow={`Through ${PROGRAM_END_SHORT}`}
        heading={rebate.heading}
        subheading={rebate.standfirst}
        scrim={0}
        lockupCard
        aside={
          rows.length === 0 ? (
            <p className="promo-body promo-card px-6 py-12 text-center text-[0.95rem] text-[color:var(--ivory)]/90">
              {rebate.emptyState}
            </p>
          ) : (
            /* The ledger re-asserts the light set: it is an opaque panel whose
               own fill carries its contrast, and on the stage's dark tokens it
               would set struck prices in Ivory on Parchment. */
            <ul className="promo-on-light border border-[color:var(--rule)] bg-[color:var(--ground)]">
              {rows.map((product) => (
                <RebateRow
                  key={product.slug}
                  product={product}
                  showPrices={showPrices}
                  onOpen={() => setSelected(product)}
                />
              ))}
            </ul>
          )
        }
      >
        {/* Where the money actually comes off, then the button. */}
        <p className="promo-body text-[1rem] font-medium leading-snug text-[color:var(--ivory)]">
          {rebate.dealerNote}
        </p>

        <div className="mt-7">
          <PromoButton />
        </div>

        {/* The rebate's terms.
        
            These had no home. `rebate.disclaimer` was written to render in a
            page-level fine print block at the foot — that block was
            `CloseBlocks.tsx`, which is deleted, so the clauses qualifying every
            "your price" in the ledger ("prices shown are manufacturer's
            suggested retail", "your dealer sets the final price") were on no
            surface at all. They sit beside the figures they qualify now, which
            is where the bundle's disclaimer already sat. It matters most on
            ca.kawaius.com, where FinancingDisclosure does not render either and
            this was the only fine print the page was missing. */}
        <p className="promo-body mt-9 max-w-[46ch] text-[0.72rem] leading-relaxed text-[color:var(--ivory)]/80">
          {rebate.disclaimer}
        </p>
      </PromoStage>

      <RebateModelModal
        product={selected}
        isOpen={selected !== null}
        categoryLabel="ES Series"
        isShigeru={false}
        variant="campaign"
        // The Back to School structure is right for a card opening out of a
        // ledger row; its palette is not. `promo` keeps the layout and paints
        // it in this campaign's Ember and Instrument Sans.
        theme="promo"
        ctaLabel={rebate.modalCta}
        // No locator link under the button. Every CTA on this page opens the
        // one enquiry form, and the card's default secondary put "Find a
        // dealer" directly beneath the page's own CTA — two labels a shopper
        // cannot tell apart, going to two different places, and only on desktop.
        secondaryCta={null}
        onSignUp={() => {
          // Close the card before the lead form: two stacked dialogs fight over
          // the focus trap, and the visitor is done with the model.
          setSelected(null)
          openLead()
        }}
        onClose={() => setSelected(null)}
      />
    </>
  )
}

/**
 * One rebated model.
 *
 * A button, not a link — the row opens the detail card rather than navigating,
 * because the rebate is the context and a product page would drop it. The
 * chevron is the affordance that says so.
 */
function RebateRow({
  product,
  showPrices,
  onOpen,
}: {
  product: RebateProduct
  showPrices: boolean
  onOpen: () => void
}) {
  const saving = Math.max(product.msrp - product.yourPrice, 0)

  return (
    <li className="border-b border-[color:var(--rule-soft)] last:border-b-0">
      <button
        type="button"
        onClick={onOpen}
        // Generous rows. Three of them sit opposite a lockup card that is
        // twice their height otherwise, and a short table floating at the top
        // of a tall photograph reads as unfinished rather than as restraint.
        className="promo-focus group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-6 text-left transition-colors duration-200 hover:bg-[color:var(--surface)] sm:grid-cols-[auto_minmax(0,1.3fr)_auto_auto_auto] sm:gap-x-6 sm:px-7 sm:py-7"
      >
        <span
          className="relative h-16 w-20 shrink-0 overflow-hidden bg-white sm:h-20 sm:w-24"
          aria-hidden
        >
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt=""
              fill
              sizes="56px"
              className="object-contain p-1 transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </span>

        <span className="min-w-0">
          <span className="promo-body block truncate text-[1.2rem] font-medium text-[color:var(--on-ground)] sm:text-[1.35rem]">
            {product.label}
          </span>
          {product.note && (
            <span className="promo-body mt-1 block truncate text-[0.82rem] text-[color:var(--body-dim)]">
              {product.note}
            </span>
          )}
        </span>

        {/* The Save figure gets its own column from `sm`; on a phone it is
            restated under the price instead, where there is room for it. */}
        <span className="promo-label hidden whitespace-nowrap text-[color:var(--money-accent)] sm:block">
          Save {formatPrice(product.rebate, product.currency)}
        </span>

        <span className="whitespace-nowrap text-right">
          {showPrices && saving > 0 && (
            <span className="promo-num block text-[0.82rem] text-[color:var(--body-dim)] line-through sm:mr-3 sm:inline sm:text-[0.92rem]">
              {formatPrice(product.msrp, product.currency)}
            </span>
          )}
          <span className="promo-num text-[1.35rem] font-semibold text-[color:var(--on-ground)] sm:text-[1.5rem]">
            {showPrices
              ? formatPrice(product.yourPrice, product.currency)
              : formatPrice(product.rebate, product.currency)}
          </span>
          <span className="promo-body block text-[0.72rem] font-semibold text-[color:var(--money-accent)] sm:hidden">
            Save {formatPrice(product.rebate, product.currency)}
          </span>
        </span>

        <svg
          className="hidden h-5 w-5 text-[color:var(--body-dim)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--money)] sm:block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </li>
  )
}
