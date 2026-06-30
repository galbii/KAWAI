'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn, formatPrice } from '@/lib/utils'
import type { RebateProduct } from '@/lib/payload/rebate-types'

/**
 * Copy passed in from the showcase so this modal stays decoupled from either
 * /signup variant's scenes.ts — it's purely presentational and reusable.
 */
export type RebateDetailLabels = {
  msrpLabel: string
  yourPriceLabel: string
  saveLabel: string
  disclaimer: string
  /** Active rebate program name, e.g. "Q3 Rebates" — shown on the ledger line. */
  programLabel: string
  /** Primary CTA label, e.g. "Sign Up Now". */
  signUpLabel: string
  /** Prefix for the product link, e.g. "View the" → "View the GX-7". */
  viewLabelPrefix: string
}

type Props = {
  /** The rebate to detail. `null` while closed; the last value is retained for the exit animation. */
  product: RebateProduct | null
  isOpen: boolean
  /** Category chip label, e.g. "Grand". */
  categoryLabel: string
  /** Shigeru gets the gold accent; everything else gets Kawai red. */
  isShigeru: boolean
  labels: RebateDetailLabels
  /** Fires the conversion flow (close this modal, open the dealer sign-up form). */
  onSignUp: () => void
  onClose: () => void
}

const PILL_BASE =
  'group relative inline-flex flex-1 items-center justify-center gap-2.5 rounded-full px-6 py-3.5 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const ARROW = (
  <svg
    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

/**
 * White, mobile-first detail sheet for a single rebate. Leads with the savings
 * ledger — MSRP, the rebate taken off, and the resulting price — because the
 * savings is the point. Below it: a "Save $X" badge, the finish note, and the two
 * actions (sign up for the dealer offer, or open the product page). All data and
 * copy arrive via props so the same modal serves the cinematic scene and the
 * reduced-motion fallback on both /signup variants.
 */
export default function RebateDetailModal({
  product,
  isOpen,
  categoryLabel,
  isShigeru,
  labels,
  onSignUp,
  onClose,
}: Props) {
  // Retain the last product so the close animation has content to render.
  const [shown, setShown] = useState<RebateProduct | null>(product)
  useEffect(() => {
    if (product) setShown(product)
  }, [product])

  const p = product ?? shown
  if (!p) return null

  const accentText = isShigeru ? 'text-kawai-gold' : 'text-kawai-red'
  const accentDot = isShigeru ? 'bg-kawai-gold' : 'bg-kawai-red'
  const savePill = isShigeru
    ? 'bg-kawai-gold/20 text-kawai-black'
    : 'bg-kawai-red/10 text-kawai-red'
  const signUpPill = isShigeru
    ? 'bg-kawai-gold text-kawai-black hover:bg-kawai-gold/90 focus-visible:ring-kawai-gold'
    : 'bg-kawai-red text-white hover:bg-kawai-red/90 focus-visible:ring-kawai-red'
  const labelClass =
    'font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.14em] text-kawai-black/55'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="max-h-[90vh] overflow-y-auto bg-white p-0 text-kawai-black"
    >
      <div className="p-6 sm:p-8">
        {/* Header — product image, category, name */}
        <div className="flex items-start gap-4 pr-8 sm:gap-5">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 sm:h-28 sm:w-28">
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={p.name}
                fill
                sizes="112px"
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-brand-serif)] text-3xl text-kawai-black/20">
                {p.label}
              </div>
            )}
          </div>

          <div className="min-w-0 pt-1">
            <p
              className={cn(
                'font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.2em]',
                accentText,
              )}
            >
              {categoryLabel}
            </p>
            <DialogTitle className="mt-1.5 font-[family-name:var(--font-brand-serif)] text-2xl font-medium leading-tight tracking-tight sm:text-[1.75rem]">
              {p.name}
            </DialogTitle>
          </div>
        </div>

        <DialogDescription className="sr-only">
          {`${p.name}: ${labels.yourPriceLabel} ${formatPrice(p.yourPrice, p.currency)} after a ${formatPrice(p.rebate, p.currency)} rebate off ${formatPrice(p.msrp, p.currency)} MSRP.`}
        </DialogDescription>

        {/* Savings ledger */}
        <dl className="mt-6">
          <div className="flex items-center justify-between py-2.5">
            <dt className={labelClass}>{labels.msrpLabel}</dt>
            <dd className="text-base text-kawai-black/45 line-through">
              {formatPrice(p.msrp, p.currency)}
            </dd>
          </div>

          <div className="h-px bg-kawai-black/10" />

          <div className="flex items-center justify-between py-2.5">
            <dt className={cn(labelClass, 'flex items-center gap-2')}>
              <span aria-hidden className={cn('block size-1.5 rounded-full', accentDot)} />
              {labels.programLabel}
            </dt>
            <dd className={cn('text-base font-semibold', accentText)}>
              &minus;{formatPrice(p.rebate, p.currency)}
            </dd>
          </div>

          <div className="h-0.5 bg-kawai-black/80" />

          <div className="flex items-baseline justify-between pt-3.5">
            <dt className="font-[family-name:var(--font-brand-sans)] text-xs font-bold uppercase tracking-[0.16em] text-kawai-black">
              {labels.yourPriceLabel}
            </dt>
            <dd className="font-[family-name:var(--font-brand-serif)] text-[2.5rem] font-medium leading-none tracking-tight sm:text-5xl">
              {formatPrice(p.yourPrice, p.currency)}
            </dd>
          </div>
        </dl>

        {/* Save badge + finish note */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-[family-name:var(--font-brand-sans)] text-xs font-bold uppercase tracking-[0.14em]',
              savePill,
            )}
          >
            <span aria-hidden className={cn('block size-1.5 rounded-full', accentDot)} />
            {labels.saveLabel} {formatPrice(p.rebate, p.currency)}
          </span>
          {p.note ? (
            <span className="font-[family-name:var(--font-brand-sans)] text-[11px] font-medium uppercase tracking-[0.1em] text-kawai-black/50">
              {p.note}
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onSignUp} className={cn(PILL_BASE, signUpPill)}>
            <span className="relative z-10">{labels.signUpLabel}</span>
            {ARROW}
          </button>
          <Link
            href={`/products/${p.slug}`}
            className={cn(
              PILL_BASE,
              'border border-kawai-black/25 text-kawai-black hover:border-transparent hover:bg-kawai-black hover:text-white focus-visible:ring-kawai-black',
            )}
          >
            <span className="relative z-10">
              {labels.viewLabelPrefix} {p.label}
            </span>
          </Link>
        </div>

        <p className="mt-5 text-center font-[family-name:var(--font-brand-sans)] text-[11px] leading-relaxed text-kawai-black/55">
          {labels.disclaimer}
        </p>
      </div>
    </Modal>
  )
}
