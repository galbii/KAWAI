'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import NumberStrike from './NumberStrike'
import { BrandCTAButton, BrandEyebrow } from './brand-ui'
import { useOfferModal } from './OfferModalContext'
import { rebatesCopy } from './scenes'
import { EASE_OUT_EXPO } from './motion'
import { cn, formatPrice } from '@/lib/utils'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import type { PianoCategorySlug } from '@/lib/data/categories'

type Props = {
  data: RebateCategory[]
  reduce: boolean
  /** Notified when the selected category changes — drives the backdrop swap. */
  onCategoryChange?: (slug: PianoCategorySlug) => void
}

/** Currency prefix matching formatPrice ("$1,000" / "CAD1,000"). */
function currencyPrefix(currency: 'USD' | 'CAD'): string {
  return currency === 'CAD' ? 'CAD' : '$'
}

/** Wrap an index into [0, length). */
function wrap(index: number, length: number): number {
  return ((index % length) + length) % length
}

/** Two-digit slide label, e.g. 3 → "03". */
function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

const SWIPE_THRESHOLD = 70

/**
 * Rebate carousel — one floating, spotlit card at a time on the category
 * backdrop. Category chips filter the deck (and swap the backdrop via
 * onCategoryChange); slides advance via arrows, drag/swipe, or the count. Every
 * call to action opens the signup offer popup. Presentational; data from parent.
 */
export default function RebateBrowser({ data, reduce, onCategoryChange }: Props) {
  const offer = useOfferModal()
  const [categoryIndex, setCategoryIndex] = useState(0)
  // [slide index, travel direction] — direction drives the enter/exit side.
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0])

  // Reset to the first slide whenever the category changes.
  useEffect(() => {
    setSlide([0, 0])
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
  const total = category.products.length
  const safeIndex = wrap(index, total)
  const product = category.products[safeIndex]!
  const isShigeru = category.slug === 'shigeru'
  const prefix = currencyPrefix(product.currency)

  const selectCategory = (i: number, slug: PianoCategorySlug) => {
    setCategoryIndex(i)
    onCategoryChange?.(slug)
  }
  const paginate = (dir: number) => setSlide(([i]) => [i + dir, dir])

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const power = info.offset.x + info.velocity.x * 0.25
    if (power < -SWIPE_THRESHOLD) paginate(1)
    else if (power > SWIPE_THRESHOLD) paginate(-1)
  }

  const variants = {
    enter: (dir: number) =>
      reduce ? { opacity: 0 } : { x: dir >= 0 ? '50%' : '-50%', opacity: 0, scale: 0.96 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) =>
      reduce ? { opacity: 0 } : { x: dir >= 0 ? '-50%' : '50%', opacity: 0, scale: 0.96 },
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
          const selected = i === categoryIndex
          return (
            <button
              key={cat.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => selectCategory(i, cat.slug)}
              className={cn(
                'rounded-full px-4 py-2 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur-sm transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                selected && cat.slug === 'shigeru' && 'bg-kawai-gold text-kawai-black',
                selected && cat.slug !== 'shigeru' && 'bg-kawai-red text-white',
                !selected && 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white',
              )}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Deck — one floating white card at a time */}
      <div className="relative mt-6 grid sm:mt-7" aria-live="polite">
        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={`${category.slug}-${safeIndex}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            className="col-start-1 row-start-1 flex cursor-grab flex-col items-stretch gap-5 rounded-3xl bg-kawai-pearl p-5 text-kawai-black shadow-[0_35px_90px_rgba(0,0,0,0.6)] ring-1 ring-black/5 active:cursor-grabbing sm:flex-row sm:gap-7 sm:p-7"
          >
            {/* Image on a clean white panel (product photos aren't transparent) */}
            <div className="relative h-44 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-white sm:h-64 sm:w-[44%]">
              {product.imageUrl ? (
                <motion.div
                  {...(reduce
                    ? {}
                    : {
                        animate: { y: [0, -7, 0] },
                        transition: { duration: 6, ease: 'easeInOut' as const, repeat: Infinity },
                      })}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    draggable={false}
                    sizes="(max-width: 640px) 90vw, 340px"
                    className="select-none object-contain p-3"
                  />
                </motion.div>
              ) : (
                <div className="flex h-full w-full items-center justify-center font-[family-name:var(--font-brand-serif)] text-4xl text-kawai-black/20">
                  {product.label}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.2em] text-kawai-black/55">
                {category.label}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-brand-serif)] text-2xl leading-tight sm:text-3xl">
                {product.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-2.5">
                <span className="font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.14em] text-kawai-black/50">
                  {rebatesCopy.msrpLabel}
                </span>
                <span className="text-base text-kawai-black/45 line-through">
                  {formatPrice(product.msrp, product.currency)}
                </span>
              </div>

              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.14em] text-kawai-black/50">
                  {rebatesCopy.yourPriceLabel}
                </span>
                <span className="font-[family-name:var(--font-brand-serif)] text-[2.5rem] font-medium leading-none tracking-tight sm:text-5xl">
                  {prefix}
                  <NumberStrike active target={product.yourPrice} reduce={reduce} />
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-[family-name:var(--font-brand-sans)] text-xs font-bold uppercase tracking-[0.14em]',
                    isShigeru ? 'bg-kawai-gold/20 text-kawai-black' : 'bg-kawai-red/10 text-kawai-red',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn('block size-1.5 rounded-full', isShigeru ? 'bg-kawai-gold' : 'bg-kawai-red')}
                  />
                  {rebatesCopy.saveLabel} {formatPrice(product.rebate, product.currency)}
                </span>
                {product.note ? (
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-kawai-black/45">
                    {product.note}
                  </span>
                ) : null}
              </div>

              <div className="mt-5">
                <BrandCTAButton onClick={offer.open} variant="red">
                  {rebatesCopy.primaryCta.label}
                </BrandCTAButton>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls — numbered index + hairline progress + arrows */}
      {total > 1 ? (
        <div className="mx-auto mt-6 flex max-w-md items-center gap-4">
          <span className="font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.18em] tabular-nums text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            <span className={isShigeru ? 'text-kawai-gold' : 'text-kawai-red'}>{pad2(safeIndex + 1)}</span>
            <span className="text-white/45"> / {pad2(total)}</span>
          </span>

          <div className="relative h-px flex-1 bg-white/20">
            <motion.div
              className={cn('absolute inset-y-0 left-0', isShigeru ? 'bg-kawai-gold' : 'bg-kawai-red')}
              animate={{ width: `${((safeIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous rebate"
              onClick={() => paginate(-1)}
              className="flex size-9 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition hover:border-transparent hover:bg-white hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next rebate"
              onClick={() => paginate(1)}
              className="flex size-9 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm transition hover:border-transparent hover:bg-white hover:text-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <p className="mx-auto mt-4 max-w-md text-center text-[11px] leading-relaxed text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
        {rebatesCopy.disclaimer}
      </p>
    </div>
  )
}
