import type { ReactNode } from 'react'
import type { OfferKey } from '@/lib/fall-promo/tokens'
import { OFFER_CHIPS } from '@/lib/fall-promo/tokens'

/**
 * An offer chip. Shared by both variations.
 *
 * One chip per offer type, plain names only — no amounts inside a chip, in
 * either look. The name comes from `OFFER_CHIPS` rather than a string the
 * caller supplies, which is what stops the same offer being called "SH-9
 * Bundle" on one page and "Free headphones" on the other.
 *
 * Outline on light grounds, solid Ivory on dark. `tone` is the ground the chip
 * sits on, not the chip's own colour — the same convention the rest of the
 * campaign components use.
 */
export function OfferChip({
  offer,
  tone = 'light',
  children,
}: {
  offer?: OfferKey
  tone?: 'light' | 'dark'
  /** Overrides the canonical name. For the deck's catch-all chips only. */
  children?: ReactNode
}) {
  const label = children ?? (offer ? OFFER_CHIPS[offer] : null)
  if (!label) return null

  return (
    <span
      className={`promo-body inline-flex items-center rounded-full px-4 py-2 text-[0.9rem] font-medium leading-none ${
        tone === 'dark'
          ? 'bg-[color:var(--ivory)] text-[color:var(--ink)]'
          : 'border border-[color:var(--ink)]/35 text-[color:var(--ink)]'
      }`}
    >
      {label}
    </span>
  )
}

/** The full set, in brand order. */
export function OfferChipRow({
  offers,
  tone = 'light',
}: {
  offers: readonly OfferKey[]
  tone?: 'light' | 'dark'
}) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {offers.map((key) => (
        <li key={key}>
          <OfferChip offer={key} tone={tone} />
        </li>
      ))}
    </ul>
  )
}
