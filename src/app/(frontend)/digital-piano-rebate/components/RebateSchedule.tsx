'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

export type RebateModel = {
  model: string
  finishes: string
  consumerRebate: number
  productSlug?: string
  productName?: string
  productImageUrl?: string
  productMsrp?: number
  productCompareAtPrice?: number
  productShopifyPrice?: number
  productCurrency?: string
  productVariantId?: string
  productAvailable?: boolean
  productBackorder?: boolean
}

export type RebateSeries = {
  seriesName: string
  models: RebateModel[]
  collectionYoutubeUrl?: string
  collectionBannerImageUrl?: string
}

type Props = {
  eyebrow?: string
  heading?: string
  deadline?: string
  schedule: RebateSeries[]
}

const ALL = 'All'

function formatSavings(amount: number): string {
  return amount % 1 === 0
    ? `$${amount.toLocaleString()}`
    : `$${amount.toFixed(2)}`
}

function formatPrice(amount: number, currency?: string): string {
  const formatted = amount % 1 === 0
    ? `$${amount.toLocaleString()}`
    : `$${amount.toFixed(2)}`
  if (currency && currency !== 'USD') return `${formatted} ${currency}`
  return formatted
}

function maxRebate(series: RebateSeries): number {
  return Math.max(...series.models.map((m) => m.consumerRebate))
}

function extractYouTubeId(url: string): string | null {
  const match = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/\s]{11})/.exec(url)
  return match?.[1] ?? null
}

// ─── Price Display — animated strikethrough + sale price + % badge ────────────

function PriceDisplay({
  msrp,
  rebate,
  currency,
  shouldShow,
  delay = 0,
}: {
  msrp: number
  rebate: number
  currency?: string
  shouldShow: boolean
  delay?: number
}) {
  const salePrice = msrp - rebate
  const pctOff = msrp > 0 ? Math.round((rebate / msrp) * 100) : 0

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      style={{ fontFamily: 'var(--font-brand-sans)' }}
    >
      {/* Original price with animated strikethrough */}
      <div className="relative inline-flex items-center">
        <span
          className="text-kawai-charcoal/40 text-sm"
          style={{ letterSpacing: '0.04em' }}
        >
          {formatPrice(msrp, currency)}
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={shouldShow ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.45, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-kawai-charcoal/55 origin-left -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Arrow separator */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={shouldShow ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.25, delay: delay + 0.4 }}
        className="text-kawai-charcoal/25 text-xs leading-none select-none"
        aria-hidden="true"
      >
        →
      </motion.span>

      {/* Sale price */}
      <motion.span
        initial={{ opacity: 0, x: 4 }}
        animate={shouldShow ? { opacity: 1, x: 0 } : { opacity: 0, x: 4 }}
        transition={{ duration: 0.35, delay: delay + 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-kawai-black font-semibold text-sm"
        style={{ letterSpacing: '0.03em' }}
      >
        {formatPrice(salePrice, currency)}
      </motion.span>

      {/* % off badge */}
      {pctOff > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.75 }}
          animate={shouldShow ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.3, delay: delay + 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center bg-kawai-red text-white text-[9px] tracking-[0.18em] uppercase font-semibold px-1.5 py-0.5 leading-none"
        >
          -{pctOff}%
        </motion.span>
      )}
    </div>
  )
}

// ─── Mobile filter pill bar ────────────────────────────────────────────────────

function FilterBar({
  series,
  selected,
  onSelect,
}: {
  series: RebateSeries[]
  selected: string
  onSelect: (name: string) => void
}) {
  const options = [ALL, ...series.map((s) => s.seriesName)]
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 pb-1 min-w-max">
        {options.map((name) => {
          const isActive = selected === name
          return (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={[
                'relative px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
                isActive
                  ? 'bg-kawai-black text-white'
                  : 'border border-kawai-neutral text-kawai-charcoal/45 hover:border-kawai-charcoal/30 hover:text-kawai-black',
              ].join(' ')}
              style={{ fontFamily: 'var(--font-brand-sans)' }}
              aria-pressed={isActive}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sidebar Navigator — slim ─────────────────────────────────────────────────

function SeriesSidebar({
  schedule,
  selected,
  onSelect,
}: {
  schedule: RebateSeries[]
  selected: string
  onSelect: (name: string) => void
}) {
  const totalCount = schedule.reduce((acc, s) => acc + s.models.length, 0)

  type SidebarItem = { name: string; modelCount: number }

  const items: SidebarItem[] = [
    { name: ALL, modelCount: totalCount },
    ...schedule.map((s) => ({ name: s.seriesName, modelCount: s.models.length })),
  ]

  return (
    <nav className="bg-kawai-black" aria-label="Filter by series">
      {/* Header label */}
      <div className="px-4 py-3 border-b border-white/[0.08]">
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-medium"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Series
        </p>
      </div>

      {items.map((item, i) => {
        const isActive = selected === item.name
        return (
          <motion.button
            key={item.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelect(item.name)}
            className={[
              'group w-full text-left flex items-stretch border-b border-white/[0.06]',
              'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-kawai-red',
              isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]',
            ].join(' ')}
          >
            {/* Left accent bar */}
            <span
              className={[
                'block flex-shrink-0 w-[3px] transition-colors duration-300',
                isActive ? 'bg-kawai-red' : 'bg-transparent group-hover:bg-white/15',
              ].join(' ')}
            />

            {/* Content */}
            <div className="flex-1 px-4 py-4 flex items-center justify-between gap-2">
              <span
                className={[
                  'font-light transition-colors duration-200 leading-tight truncate',
                  isActive ? 'text-white' : 'text-white/40 group-hover:text-white/65',
                ].join(' ')}
                style={{
                  fontFamily: 'var(--font-crimson), Georgia, serif',
                  fontSize: '1.1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.name}
              </span>
              <ArrowRight
                className={[
                  'h-3 w-3 flex-shrink-0 transition-all duration-300',
                  isActive
                    ? 'text-kawai-red opacity-100'
                    : 'text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5',
                ].join(' ')}
              />
            </div>
          </motion.button>
        )
      })}
    </nav>
  )
}

// ─── Series Block ─────────────────────────────────────────────────────────────

function SeriesBlock({
  series,
  isOnly,
}: {
  series: RebateSeries
  isOnly: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: isOnly ? 0 : 0.08 })
  const shouldShow = isOnly || inView
  const videoId = series.collectionYoutubeUrl ? extractYouTubeId(series.collectionYoutubeUrl) : null
  const bannerImageUrl = !videoId ? (series.collectionBannerImageUrl ?? null) : null

  return (
    <div ref={ref}>
      {/* ── Series header strip ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={shouldShow ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={[
          'relative flex items-end justify-between px-8 bg-kawai-black overflow-hidden',
          (videoId || bannerImageUrl) ? 'min-h-[280px] pb-8 pt-8' : 'py-7',
        ].join(' ')}
      >
        {/* Background video (when collection is linked) */}
        {videoId && (
          <>
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&playsinline=1&rel=0&disablekb=1&iv_load_policy=3`}
                allow="autoplay; encrypted-media"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: '100vw', height: 'calc(100vw * 9 / 16)', minHeight: '300%' }}
                title=""
              />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,27,22,0.70)', pointerEvents: 'none' }} aria-hidden="true" />
          </>
        )}

        {/* Background image fallback (no video, but collection has media) */}
        {bannerImageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImageUrl}
              alt=""
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,27,22,0.65)', pointerEvents: 'none' }} aria-hidden="true" />
          </>
        )}

        {/* Content — z-10 so it sits above the video */}
        <div className="relative z-10 flex items-center gap-5">
          <span className="block w-px h-8 bg-kawai-red flex-shrink-0" />
          <span
            className="font-light text-white"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {series.seriesName}
          </span>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <span
            className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-white/25 font-medium"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {series.models.length}&thinsp;{series.models.length === 1 ? 'model' : 'models'}
          </span>
        </div>
      </motion.div>

      {/* ── Model rows ── */}
      <div className="space-y-3 px-4 py-4 lg:space-y-0 lg:p-0 lg:border-l lg:border-r lg:border-b lg:border-kawai-neutral/60">
        {series.models.map((model, mIdx) => {
          const hasProduct = Boolean(model.productSlug)
          const isAvailable = model.productAvailable ?? true
          const refPrice = model.productCompareAtPrice ?? model.productMsrp
          const displayPrice =
            model.productShopifyPrice != null
              ? model.productShopifyPrice - model.consumerRebate
              : refPrice != null
                ? refPrice - model.consumerRebate
                : null
          const pctOff =
            refPrice != null && displayPrice != null && refPrice > 0
              ? Math.round(((refPrice - displayPrice) / refPrice) * 100)
              : 0

          return (
            <motion.div
              key={model.model}
              initial={{ opacity: 0, x: 10 }}
              animate={shouldShow ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: mIdx * 0.055 + 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* ── MOBILE CARD (< lg) ── */}
              <div className="lg:hidden border border-kawai-neutral/60 bg-white overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
                {/* Image — full width on top */}
                {model.productImageUrl && (
                  <div className="w-full bg-white border-b border-kawai-neutral/40 flex items-center justify-center py-6 px-8">
                    <Image
                      src={model.productImageUrl}
                      alt={model.productName ?? model.model}
                      width={260}
                      height={180}
                      className="object-contain max-h-[180px] w-auto"
                    />
                  </div>
                )}

                {/* Info block */}
                <div className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <span
                      className="font-semibold text-kawai-black leading-tight"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.25rem', letterSpacing: '0.04em' }}
                    >
                      {model.model}
                    </span>
                    <span
                      className="block text-kawai-red text-xs font-semibold tracking-[0.1em] uppercase mt-0.5"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Save {formatSavings(model.consumerRebate)}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p
                      className="text-[10px] tracking-[0.35em] uppercase text-kawai-charcoal/35 leading-none mb-1"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      {refPrice != null ? 'Your Price' : 'Save'}
                    </p>
                    <div className="flex items-baseline justify-end gap-2">
                      {refPrice != null && (
                        <span
                          className="text-kawai-charcoal/35 text-base line-through leading-none"
                          style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
                        >
                          {formatPrice(refPrice, model.productCurrency)}
                        </span>
                      )}
                      <p
                        className="text-kawai-red font-light leading-none"
                        style={{
                          fontFamily: 'var(--font-crimson), Georgia, serif',
                          fontSize: '2.25rem',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {displayPrice != null
                          ? formatPrice(displayPrice, model.productCurrency)
                          : formatSavings(model.consumerRebate)}
                      </p>
                    </div>
                    {pctOff > 0 && (
                      <div className="flex justify-end mt-0.5">
                        <span className="inline-flex items-center bg-kawai-red text-white text-[8px] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 leading-none">
                          -{pctOff}% off
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA strip */}
                <div className="flex items-center gap-3 px-5 py-4 border-t border-kawai-neutral/40 bg-white">
                  {hasProduct ? (
                    <>
                      {model.productVariantId && (
                        <AddToCartButton
                          variantId={model.productVariantId}
                          available={isAvailable}
                          size="sm"
                          className="flex-1 bg-kawai-red hover:bg-kawai-red-700 text-white border-none text-xs tracking-[0.18em] uppercase font-semibold h-10 rounded-none"
                        />
                      )}
                      {model.productSlug && (
                        <Link
                          href={`/products/${model.productSlug}`}
                          className="inline-flex items-center gap-1.5 border border-kawai-black text-kawai-black hover:bg-kawai-black hover:text-white px-4 h-10 text-xs tracking-[0.18em] uppercase font-semibold transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black"
                          style={{ fontFamily: 'var(--font-brand-sans)' }}
                        >
                          View {model.model}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/find-a-dealer"
                      className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-medium text-kawai-charcoal/55 hover:text-kawai-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Find a Local Dealer
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* ── DESKTOP ROW (lg+) ── */}
              <div
                className="group relative hidden lg:flex items-stretch border-t border-kawai-neutral/60 hover:bg-kawai-red/[0.025] transition-colors duration-200 cursor-default min-h-[200px]"
              >
                {/* Red left border on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300 z-10"
                  aria-hidden="true"
                />

                {/* Left: large product image — flush, full height */}
                {model.productImageUrl ? (
                  <div className="flex-shrink-0 w-[240px] self-stretch bg-white flex items-center justify-center overflow-hidden border-r border-kawai-neutral/40 transition-colors duration-300 group-hover:border-kawai-neutral/70">
                    <Image
                      src={model.productImageUrl}
                      alt={model.productName ?? model.model}
                      width={240}
                      height={200}
                      className="object-contain p-6 w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-6" />
                )}

                {/* Middle: model info */}
                <div className="flex-1 flex flex-col justify-center gap-1.5 px-8 py-6 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="font-semibold text-kawai-black"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.5rem', letterSpacing: '0.04em' }}
                    >
                      {model.model}
                    </span>
                    <span
                      className="inline-flex items-center bg-kawai-red/10 text-kawai-red text-[10px] tracking-[0.15em] uppercase font-semibold px-2 py-1 leading-none"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Save {formatSavings(model.consumerRebate)}
                    </span>
                  </div>
                  {model.productName && model.productName !== model.model && (
                    <span className="text-kawai-charcoal/55 text-base" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                      {model.productName}
                    </span>
                  )}
                  <span className="text-kawai-charcoal/40 text-sm" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                    {model.finishes}
                  </span>
                </div>

                {/* Right: price + actions */}
                <div className="flex-shrink-0 flex flex-col items-end justify-center gap-3 px-8 py-6">
                  <div className="text-right">
                    <p className="text-[11px] tracking-[0.35em] uppercase text-kawai-charcoal/30 mb-1 leading-none" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                      {refPrice != null ? 'your price' : 'save'}
                    </p>
                    <div className="flex items-baseline justify-end gap-3">
                      {refPrice != null && (
                        <span
                          className="text-kawai-charcoal/30 text-xl line-through leading-none"
                          style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
                        >
                          {formatPrice(refPrice, model.productCurrency)}
                        </span>
                      )}
                      <p
                        className="text-kawai-red font-light leading-none"
                        style={{ fontFamily: 'var(--font-crimson), Georgia, serif', fontSize: 'clamp(2.5rem, 4.5vw, 5.5rem)', letterSpacing: '-0.04em' }}
                      >
                        {displayPrice != null
                          ? formatPrice(displayPrice, model.productCurrency)
                          : formatSavings(model.consumerRebate)}
                      </p>
                    </div>
                    {pctOff > 0 && (
                      <div className="flex justify-end mt-1.5">
                        <span className="inline-flex items-center bg-kawai-red text-white text-[9px] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 leading-none">
                          -{pctOff}%
                        </span>
                      </div>
                    )}
                    <p
                      className="text-kawai-charcoal/25 text-[11px] mt-2 leading-none italic"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Rebate applied at checkout
                    </p>
                  </div>

                  {hasProduct ? (
                    <div className="flex flex-row items-center gap-2">
                      {model.productVariantId && (
                        <AddToCartButton
                          variantId={model.productVariantId}
                          available={isAvailable}
                          size="sm"
                          className="bg-kawai-red hover:bg-kawai-red-700 text-white border-none text-xs tracking-[0.18em] uppercase font-semibold px-5 h-9 rounded-none"
                        />
                      )}
                      <Link
                        href={`/products/${model.productSlug}`}
                        className="inline-flex items-center gap-1.5 border border-kawai-black text-kawai-black hover:bg-kawai-black hover:text-white px-5 h-9 text-xs tracking-[0.18em] uppercase font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        View {model.model}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/find-a-dealer"
                      className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-medium text-kawai-charcoal/55 hover:text-kawai-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Find a Local Dealer
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Series CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={shouldShow ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: series.models.length * 0.055 + 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center gap-3 px-4 py-5 mt-1 bg-white border border-kawai-neutral/60 lg:border-l lg:border-r lg:border-b lg:border-t-0 lg:mt-0 lg:px-8 lg:py-6"
      >
        {/* Primary — solid red */}
        <Link
          href={`/pianos/${series.seriesName.toLowerCase().replace(/\s+/g, '-')}`}
          className="group relative inline-flex items-center gap-3 overflow-hidden bg-kawai-red px-7 py-4 transition-all duration-300 hover:bg-[#c5141c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red focus-visible:ring-offset-2"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-[120%]"
            aria-hidden="true"
          />
          <span className="relative text-xs tracking-[0.22em] uppercase font-semibold text-white">
            Explore {series.seriesName}
          </span>
          <ArrowRight className="relative h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>

        {/* Secondary — black outline */}
        <Link
          href="/pianos"
          className="group relative inline-flex items-center gap-3 overflow-hidden border border-kawai-black/20 px-7 py-4 transition-all duration-300 hover:border-kawai-black hover:bg-kawai-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-black focus-visible:ring-offset-2"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          <span className="text-xs tracking-[0.22em] uppercase font-medium text-kawai-black/70 transition-colors duration-300 group-hover:text-white">
            View All Pianos
          </span>
          <ArrowRight className="h-4 w-4 text-kawai-black/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
        </Link>
      </motion.div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function RebateSchedule({
  schedule,
  eyebrow = 'Spring 2026 Savings',
  heading = 'Digital Piano Rebates',
  deadline = 'June 30, 2026',
}: Props) {
  const [selected, setSelected] = useState<string>(ALL)
  const headerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  function handleSelect(name: string) {
    setSelected(name)
    // Scroll so the first series row is just below the sticky filter bar
    if (contentRef.current) {
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-bottom').trim() || '70',
      )
      const filterBarH = 56 // py-3 (12px×2) + pills (~32px)
      const rect = contentRef.current.getBoundingClientRect()
      if (rect.top < headerH + filterBarH) {
        window.scrollTo({ top: window.scrollY + rect.top - headerH - filterBarH - 8, behavior: 'smooth' })
      }
    }
  }

  const filtered = selected === ALL ? schedule : schedule.filter((s) => s.seriesName === selected)
  const activeSeries = filtered[0]

  const totalModels = schedule.reduce((acc, s) => acc + s.models.length, 0)
  const totalSeries = schedule.length

  const subtitle =
    selected === ALL
      ? `${totalModels} models across ${totalSeries} series\u00a0·\u00a0Available until ${deadline}`
      : activeSeries
        ? `${activeSeries.models.length} ${activeSeries.models.length === 1 ? 'model' : 'models'}\u00a0·\u00a0save ${formatSavings(maxRebate(activeSeries))}\u00a0·\u00a0Available until ${deadline}`
        : ''

  return (
    <section id="schedule" className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-screen-2xl">

        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-8 h-px bg-kawai-red" />
            <span
              className="text-xs tracking-[0.3em] uppercase text-kawai-charcoal/40 font-medium"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {eyebrow}
            </span>
          </div>

          <h2
            className="font-light text-kawai-black leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(2.75rem, 5vw, 5rem)',
              letterSpacing: '-0.025em',
            }}
          >
            {heading}<span className="text-kawai-red mx-3 font-extralight opacity-40">|</span>Available only until {deadline}
          </h2>

          <AnimatePresence mode="wait">
            <motion.p
              key={subtitle}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-kawai-charcoal/45"
              style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.125rem' }}
            >
              {subtitle}
            </motion.p>
          </AnimatePresence>

          <p
            className="mt-3 text-kawai-charcoal/35 text-sm italic"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            * Rebates are applied at checkout at participating authorized Kawai dealers.
          </p>
        </motion.div>

        {/* ── Mobile filter strip — sticky below the fixed header ── */}
        <div
          className="lg:hidden sticky z-40 py-3 bg-white border-b border-kawai-neutral/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ top: 'var(--header-bottom, 70px)' }}
        >
          <FilterBar series={schedule} selected={selected} onSelect={handleSelect} />
        </div>

        {/* ── Sidebar + content layout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 lg:mt-0 lg:grid lg:grid-cols-[160px_1fr] lg:gap-0 lg:items-start"
        >
          {/* ── Sidebar (desktop) ── */}
          <div className="hidden lg:block lg:sticky lg:self-start" style={{ top: 'calc(var(--header-bottom, 70px) + 1.5rem)' }}>
            <SeriesSidebar schedule={schedule} selected={selected} onSelect={handleSelect} />
          </div>

          {/* ── Content ── */}
          <div ref={contentRef} className="lg:pl-8">
            {/* Column hints */}
            <AnimatePresence>
              {selected !== ALL && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-between px-8 mb-3"
                >
                  <span
                    className="text-xs tracking-[0.3em] uppercase text-kawai-charcoal/25 font-medium"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Model
                  </span>
                  <span
                    className="text-xs tracking-[0.3em] uppercase text-kawai-charcoal/25 font-medium"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    You Save
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Series blocks */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="space-y-12">
                  {filtered.map((series) => (
                    <SeriesBlock
                      key={series.seriesName}
                      series={series}
                      isOnly={selected !== ALL}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Footnote ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-kawai-charcoal/30 text-sm leading-relaxed pt-8 border-t border-kawai-neutral mt-12"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Savings applied as instant rebate at point of sale on qualifying new piano purchases at participating authorized Kawai dealers. Offer valid April 1–June 30, 2026.
        </motion.p>
      </div>
    </section>
  )
}
