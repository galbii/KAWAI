'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useLeadCampaign } from '@/components/campaign-lead'
import { PromoCta } from '@/components/fall-promo'
import { formatOfferPrice } from './money'
import type { PromoProduct } from '@/lib/payload/promo-types'

/**
 * The small shared pieces every block on this page draws from.
 *
 * Nothing here takes a `tone` any more. Every colour is a semantic token that
 * the section it lands in re-points, so a component dropped on the Walnut
 * dealer sheet inverts on its own — and the same components will carry over to
 * Stack the Savings' Ink ground untouched. A `tone` prop is a second source of
 * truth for the same fact and the two drift.
 *
 * Buttons carry no trailing arrow. An arrow after button text says nothing the
 * verb has not already said, and once it is on every control it stops meaning
 * "forward" and becomes texture.
 *
 * Headings carry no eyebrow label. A tracked-out caps line above every heading
 * is chrome that survives whatever the content is; where this page needs to say
 * which instruments an offer covers, it says so in a sentence the shopper can
 * read, inside the heading block, where it is actually useful.
 */

/**
 * The conversion action, and on this page the only one. Opens the shared lead
 * modal; the label comes from `config.copy.openLabel`, i.e. `CTA_LABEL`.
 *
 * Ember fill in both variations — the guidelines make the button the one thing
 * that does not change between the calm look and the loud one.
 *
 * `size` exists for the same reason PromoCta has it: a button repeated down a
 * list of models has to be smaller than the section's own call to action.
 */
export function PromoButton({
  children,
  size,
}: {
  children?: ReactNode
  size?: 'default' | 'compact'
}) {
  const { open, config } = useLeadCampaign()
  return (
    <PromoCta onClick={open} hasPopup="dialog" {...(size ? { size } : {})}>
      {children ?? config.copy.openLabel}
    </PromoCta>
  )
}

/**
 * A block's opening. Heading, then the sentence that says what it covers —
 * no label above it.
 *
 * The heading is Fraunces at the guideline's 56 step, regular weight and
 * sentence case. It must never be set bold or in caps.
 */
export function BlockHead({
  heading,
  standfirst,
  aside,
}: {
  heading: string
  standfirst: string
  /** Right-hand detail: a count, a deadline. Optional by design. */
  aside?: ReactNode
}) {
  return (
    <header className="mb-10 md:mb-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <h2 className="promo-h2 max-w-[20ch] text-[color:var(--on-ground)]">{heading}</h2>
        {aside && (
          <div className="promo-num shrink-0 text-[0.92rem] text-[color:var(--body-dim)]">
            {aside}
          </div>
        )}
      </div>
      <p className="promo-lede mt-5 text-[color:var(--body)]">{standfirst}</p>
    </header>
  )
}

/**
 * One instrument, as the bundle and rebate blocks show it.
 *
 * `saving` is what this promotion takes off, or what it adds; when present it
 * is the only red on the card. The price sits quiet underneath, because on this
 * page the offer is the news and the list price is context.
 */
export function ProductCard({
  product,
  saving,
  savingLabel,
}: {
  product: PromoProduct
  /** Amount off, in dollars. Omit for a bundle, where nothing comes off. */
  saving?: number
  /** What the offer is, when it isn't money off — e.g. "SH-9 pair included". */
  savingLabel?: string
}) {
  const finalPrice = saving != null && product.price != null ? product.price - saving : null

  return (
    <Link
      href={`/products/${product.slug}`}
      className="promo-focus group flex flex-col border border-[color:var(--rule-soft)] bg-[color:var(--surface)] transition-colors duration-200 hover:border-[color:var(--rule)]"
    >
      {/* Pure white, not the page ground. Kawai's product photography is shot
          on white, so an Ivory or Parchment mat shows as a visible frame around
          the cut-out and every card looks like a different crop. White is the
          only value that disappears into the photograph. */}
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-white">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}
      </span>

      <span className="flex flex-1 flex-col border-t border-[color:var(--rule-soft)] p-4">
        <span className="promo-body font-medium text-[1.05rem] text-[color:var(--on-ground)]">{product.label}</span>

        {savingLabel && (
          <span className="mt-1.5 text-[0.82rem] font-medium text-[color:var(--money)]">
            {savingLabel}
          </span>
        )}

        {saving != null && (
          <span className="promo-num mt-1.5 text-[1.05rem] text-[color:var(--money)]">
            {formatOfferPrice(saving, product.currency)} off
          </span>
        )}

        <span className="mt-auto pt-3 text-[0.82rem] text-[color:var(--body-dim)]">
          {product.price == null ? (
            'Price on request'
          ) : finalPrice != null ? (
            <>
              <span className="promo-num text-[color:var(--on-ground)]">{formatOfferPrice(finalPrice, product.currency)}</span>
              <span className="promo-num ml-2 line-through">{formatOfferPrice(product.price, product.currency)}</span>
            </>
          ) : (
            <span className="promo-num">{formatOfferPrice(product.price, product.currency)}</span>
          )}
        </span>
      </span>
    </Link>
  )
}

/**
 * The tab row the bundle and financing blocks share.
 *
 * Underline-marked rather than filled: a filled pill row reads as a set of
 * buttons competing with the page's actual call to action, and these only
 * change what is already on screen.
 *
 * Toggle buttons, NOT an ARIA tablist. `role="tablist"` is a promise of
 * arrow-key roving focus and tab/panel wiring, and half a tabs pattern is worse
 * for a screen-reader user than none — it advertises keys that do nothing and
 * panels that claim no owner. `aria-pressed` describes what these actually are,
 * and matches the series filter rendered directly beneath them.
 */
export function TabRow({
  label,
  tabs,
  active,
  onSelect,
  variant = 'underline',
}: {
  label: string
  tabs: ReadonlyArray<{ id: string; label: string; count?: number }>
  active: string
  onSelect: (id: string) => void
  /**
   * `underline` is the quiet default — a filter that only reorders what is
   * already on screen should not compete with the page's call to action.
   *
   * `filled` is for a row that has to hold its own against a photograph or a
   * dense grid, where an underline is too fine a signal to find. The selected
   * tab takes a solid Ink fill, which is the strongest mark available that is
   * still not the Ember reserved for buttons.
   */
  variant?: 'underline' | 'filled'
}) {
  const filled = variant === 'filled'

  return (
    <div
      role="group"
      aria-label={label}
      className={
        filled
          ? 'flex flex-wrap items-stretch gap-2'
          : 'flex flex-wrap items-stretch gap-x-7 gap-y-1 border-b border-[color:var(--rule)]'
      }
    >
      {tabs.map((tab) => {
        const on = tab.id === active

        if (filled) {
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(tab.id)}
              // Ground-relative, so one definition works on a light card and
              // on a dark one: the selected tab always takes the ground's own
              // text colour as its fill and reverses out of it.
              className={`promo-focus promo-body flex items-baseline gap-2 rounded-[3px] px-4 py-2.5 text-[0.9rem] font-semibold transition-colors duration-200 ${
                on
                  ? 'bg-[color:var(--on-ground)] text-[color:var(--ground)]'
                  : 'bg-[color:var(--on-ground)]/10 text-[color:var(--on-ground)] hover:bg-[color:var(--on-ground)]/20'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`promo-num text-[0.78rem] ${
                    on ? 'text-[color:var(--ground)]/70' : 'text-[color:var(--body-dim)]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(tab.id)}
            className={`promo-focus relative -mb-px flex items-baseline gap-2 border-b-2 pb-3 pt-1 text-[0.95rem] font-medium transition-colors duration-200 ${
              on
                ? 'border-[color:var(--on-ground)] text-[color:var(--on-ground)]'
                : 'border-transparent text-[color:var(--body-dim)] hover:text-[color:var(--on-ground)]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="promo-num text-[0.78rem] text-[color:var(--body-dim)]">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
