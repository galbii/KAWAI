'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BrandCTAButton, BrandEyebrow } from './brand-ui'
import { useOfferModal } from './OfferModalContext'
import { rebatesCopy } from './scenes'
import { cn, formatPrice } from '@/lib/utils'
import RebateDetailModal from '@/components/rebates/RebateDetailModal'
import { REBATE_PROGRAM } from '@/lib/data/rebates'
import type { RebateCategory, RebateProduct } from '@/lib/payload/rebate-types'
import type { PianoCategorySlug } from '@/lib/data/categories'

type Props = {
  data: RebateCategory[]
  /** Accepted for call-site parity with the carousel; the grid needs no motion flag. */
  reduce?: boolean
  /** Notified when the selected category changes — drives the backdrop swap. */
  onCategoryChange?: (slug: PianoCategorySlug) => void
}

/**
 * Rebate grid — category chips filter the deck; each model is a compact tile on
 * the category backdrop. Tapping a tile opens the {@link RebateDetailModal} with
 * the full savings ledger, finish note, and CTAs. Every conversion path funnels
 * into the shared signup offer popup. Presentational; data comes from the parent.
 */
export default function RebateBrowser({ data, onCategoryChange }: Props) {
  const offer = useOfferModal()
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [selected, setSelected] = useState<RebateProduct | null>(null)

  // Close any open detail when the category changes (the product left the deck).
  useEffect(() => {
    setSelected(null)
  }, [categoryIndex])

  // Empty state — no rebates configured. Keep the scene on-brand.
  if (data.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <BrandEyebrow centered>{rebatesCopy.eyebrow}</BrandEyebrow>
        <h2 className="mt-5 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.05] text-white">
          {rebatesCopy.empty.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70">
          {rebatesCopy.empty.body}
        </p>
        <div className="mt-9 flex justify-center">
          <BrandCTAButton onClick={offer.open} variant="red">
            {rebatesCopy.primaryCta.label}
          </BrandCTAButton>
        </div>
      </div>
    )
  }

  const category = data[categoryIndex] ?? data[0]!
  const isShigeru = category.slug === 'shigeru'

  const selectCategory = (i: number, slug: PianoCategorySlug) => {
    setCategoryIndex(i)
    onCategoryChange?.(slug)
  }

  // Sign Up from inside the detail modal: close it, then open the offer popup.
  const handleSignUp = () => {
    setSelected(null)
    offer.open()
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <div className="text-center">
        <BrandEyebrow centered>{rebatesCopy.eyebrow}</BrandEyebrow>
        <h2 className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-brand-serif)] text-[clamp(1.85rem,4vw,3rem)] font-light leading-[1.06] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          {rebatesCopy.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
          {rebatesCopy.sub}
        </p>
      </div>

      {/* Category selector */}
      <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6">
        {data.map((cat, i) => {
          const selectedCat = i === categoryIndex
          return (
            <button
              key={cat.slug}
              type="button"
              aria-pressed={selectedCat}
              onClick={() => selectCategory(i, cat.slug)}
              className={cn(
                'rounded-full px-4 py-2 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                selectedCat && cat.slug === 'shigeru' && 'bg-kawai-gold text-kawai-black',
                selectedCat && cat.slug !== 'shigeru' && 'bg-kawai-red text-white',
                !selectedCat && 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white',
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Grid — one compact tile per model; tap opens the detail modal.
          Capped height with internal scroll so a large category (e.g. digital)
          never blows out the pinned cinematic scene. */}
      <div className="mt-6 max-h-[48vh] overflow-y-auto overscroll-contain px-1 py-1 sm:mt-7 sm:max-h-[52vh]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {category.products.map((product) => (
            <button
              key={product.slug}
              type="button"
              onClick={() => setSelected(product)}
              aria-label={`View ${product.name} rebate details`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-kawai-pearl text-left text-kawai-black shadow-[0_12px_34px_rgba(0,0,0,0.32)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <div className="relative aspect-[4/3] w-full bg-white">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 220px"
                    className="object-contain p-2.5"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-brand-serif)] text-3xl text-kawai-black/20">
                    {product.label}
                  </div>
                )}
                <span
                  className={cn(
                    'absolute left-2 top-2 rounded-full px-2 py-0.5 font-[family-name:var(--font-brand-sans)] text-[10px] font-bold uppercase tracking-[0.1em]',
                    isShigeru ? 'bg-kawai-gold text-kawai-black' : 'bg-kawai-red text-white',
                  )}
                >
                  {rebatesCopy.saveLabel} {formatPrice(product.rebate, product.currency)}
                </span>
              </div>
              <div className="px-3 py-2.5">
                <p className="truncate font-[family-name:var(--font-brand-serif)] text-sm font-medium leading-tight">
                  {product.name}
                </p>
                <p className="mt-1 font-[family-name:var(--font-brand-sans)] text-xs">
                  <span className="text-kawai-black/45 line-through">
                    {formatPrice(product.msrp, product.currency)}
                  </span>{' '}
                  <span className="font-semibold text-kawai-black">
                    {formatPrice(product.yourPrice, product.currency)}
                  </span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-md text-center text-[11px] leading-relaxed text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
        {rebatesCopy.disclaimer}
      </p>

      <RebateDetailModal
        product={selected}
        isOpen={selected !== null}
        categoryLabel={category.label}
        isShigeru={isShigeru}
        labels={{
          msrpLabel: rebatesCopy.msrpLabel,
          yourPriceLabel: rebatesCopy.yourPriceLabel,
          saveLabel: rebatesCopy.saveLabel,
          disclaimer: rebatesCopy.disclaimer,
          programLabel: REBATE_PROGRAM,
          signUpLabel: rebatesCopy.primaryCta.label,
          viewLabelPrefix: rebatesCopy.viewLabelPrefix,
        }}
        onSignUp={handleSignUp}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
