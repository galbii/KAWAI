'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useLeadCampaign } from '@/components/campaign-lead'
import { formatPrice } from '@/lib/utils'
import type { PromoProduct } from '@/lib/payload/promo-types'

/**
 * The small shared pieces every Q4 block draws from.
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

const BTN =
  'q4-focus inline-flex items-center justify-center px-7 py-4 text-[0.95rem] font-semibold leading-none transition-colors duration-200'

/** The conversion action. Opens the shared lead modal. */
export function PromoButton({ children, tone = 'light' }: { children?: ReactNode; tone?: 'light' | 'dark' }) {
  const { open, config } = useLeadCampaign()
  return (
    <button
      type="button"
      onClick={open}
      className={`${BTN} ${
        tone === 'dark'
          ? 'bg-white text-[color:var(--ink)] hover:bg-white/90'
          : 'bg-[color:var(--ink)] text-white hover:bg-[color:var(--ink)]/88'
      }`}
    >
      {children ?? config.copy.openLabel}
    </button>
  )
}

/** Matched secondary — same size, outlined. */
export function PromoLink({
  href,
  children,
  tone = 'light',
}: {
  href: string
  children: ReactNode
  tone?: 'light' | 'dark'
}) {
  return (
    <Link
      href={href}
      className={`${BTN} border ${
        tone === 'dark'
          ? 'border-white/35 text-white hover:bg-white hover:text-[color:var(--ink)]'
          : 'border-[color:var(--rule)] text-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}

/**
 * A block's opening. Heading, then the sentence that says what it covers —
 * no label above it.
 */
export function BlockHead({
  heading,
  standfirst,
  tone = 'light',
  aside,
}: {
  heading: string
  standfirst: string
  tone?: 'light' | 'dark'
  /** Right-hand detail: a count, a deadline. Optional by design. */
  aside?: ReactNode
}) {
  const dark = tone === 'dark'
  return (
    <header className="mb-10 md:mb-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <h2 className={`q4-h2 max-w-[20ch] ${dark ? 'text-white' : 'text-[color:var(--ink)]'}`}>
          {heading}
        </h2>
        {aside && (
          <div
            className={`q4-num shrink-0 text-[0.92rem] ${dark ? 'text-white/55' : 'text-[color:var(--muted-dim)]'}`}
          >
            {aside}
          </div>
        )}
      </div>
      <p className={`q4-lede mt-5 ${dark ? 'text-white/70' : 'text-[color:var(--muted)]'}`}>
        {standfirst}
      </p>
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
      className="q4-focus group flex flex-col border border-[color:var(--rule-soft)] bg-[color:var(--card)] transition-colors duration-200 hover:border-[color:var(--rule)]"
    >
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[color:var(--paper)]">
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
        <span className="q4-model text-[1.05rem] text-[color:var(--ink)]">{product.label}</span>

        {savingLabel && (
          <span className="mt-1.5 text-[0.82rem] font-medium text-[color:var(--money)]">
            {savingLabel}
          </span>
        )}

        {saving != null && (
          <span className="q4-num mt-1.5 text-[1.05rem] text-[color:var(--money)]">
            {formatPrice(saving)} off
          </span>
        )}

        <span className="mt-auto pt-3 text-[0.82rem] text-[color:var(--muted-dim)]">
          {product.price == null ? (
            'Price on request'
          ) : finalPrice != null ? (
            <>
              <span className="q4-num text-[color:var(--ink)]">{formatPrice(finalPrice)}</span>
              <span className="q4-num ml-2 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="q4-num">{formatPrice(product.price)}</span>
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
 */
export function TabRow({
  label,
  tabs,
  active,
  onSelect,
}: {
  label: string
  tabs: ReadonlyArray<{ id: string; label: string; count?: number }>
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex flex-wrap items-stretch gap-x-7 gap-y-1 border-b border-[color:var(--rule)]"
    >
      {tabs.map((tab) => {
        const on = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(tab.id)}
            className={`q4-focus relative -mb-px flex items-baseline gap-2 border-b-2 pb-3 pt-1 text-[0.95rem] font-medium transition-colors duration-200 ${
              on
                ? 'border-[color:var(--ink)] text-[color:var(--ink)]'
                : 'border-transparent text-[color:var(--muted-dim)] hover:text-[color:var(--ink)]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="q4-num text-[0.78rem] text-[color:var(--muted-dim)]">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
