'use client'

import { useState, useRef, useEffect } from 'react'
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
  productCurrency?: string
  productVariantId?: string
  productAvailable?: boolean
  productBackorder?: boolean
}

export type RebateSeries = {
  seriesName: string
  models: RebateModel[]
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
                'relative px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red',
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

// ─── Sidebar Navigator ────────────────────────────────────────────────────────

function SeriesSidebar({
  schedule,
  selected,
  onSelect,
}: {
  schedule: RebateSeries[]
  selected: string
  onSelect: (name: string) => void
}) {
  const totalMax = Math.max(...schedule.map(maxRebate))
  const totalCount = schedule.reduce((acc, s) => acc + s.models.length, 0)

  type SidebarItem = { name: string; topRebate: number; modelCount: number }

  const items: SidebarItem[] = [
    { name: ALL, topRebate: totalMax, modelCount: totalCount },
    ...schedule.map((s) => ({ name: s.seriesName, topRebate: maxRebate(s), modelCount: s.models.length })),
  ]

  return (
    <nav className="bg-kawai-black" aria-label="Filter by series">
      {/* Header label */}
      <div className="px-7 py-5 border-b border-white/[0.08]">
        <p
          className="text-[9px] tracking-[0.3em] uppercase text-white/25 font-medium"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Browse Series
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
            <div className="flex-1 px-6 py-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={[
                    'font-light transition-colors duration-200 leading-tight',
                    isActive ? 'text-white' : 'text-white/40 group-hover:text-white/65',
                  ].join(' ')}
                  style={{
                    fontFamily: 'var(--font-crimson), Georgia, serif',
                    fontSize: '1.5rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.name}
                </span>
                <ArrowRight
                  className={[
                    'h-3.5 w-3.5 flex-shrink-0 transition-all duration-300',
                    isActive
                      ? 'text-kawai-red opacity-100'
                      : 'text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5',
                  ].join(' ')}
                />
              </div>

              <span
                className="text-[9px] tracking-[0.2em] uppercase font-medium text-white/20"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {item.modelCount}&thinsp;{item.modelCount === 1 ? 'model' : 'models'}
              </span>
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
  const topRebate = maxRebate(series)

  return (
    <div ref={ref}>
      {/* ── Series header strip ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={shouldShow ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between px-8 py-7 bg-kawai-black"
      >
        <div className="flex items-center gap-5">
          <span className="block w-px h-8 bg-kawai-red flex-shrink-0" />
          <span
            className="font-light text-white"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {series.seriesName}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span
            className="text-kawai-red font-light"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(1.1rem, 1.75vw, 1.5rem)',
              letterSpacing: '-0.015em',
            }}
          >
            {formatSavings(topRebate)}
          </span>
          <span
            className="hidden sm:block text-[9px] tracking-[0.25em] uppercase text-white/25 font-medium"
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
                {/* Card top: image + info + inline savings */}
                <div className="flex items-start gap-4 p-5">
                  {model.productImageUrl && (
                    <div className="flex-shrink-0 w-[76px] h-[76px] bg-kawai-pearl border border-kawai-neutral/40 flex items-center justify-center overflow-hidden">
                      <Image
                        src={model.productImageUrl}
                        alt={model.productName ?? model.model}
                        width={76}
                        height={76}
                        className="object-contain p-1.5"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 pt-0.5">
                    {/* Model name + savings on same row */}
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="font-semibold text-kawai-black leading-tight"
                        style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.0625rem', letterSpacing: '0.06em' }}
                      >
                        {model.model}
                      </span>
                      <div className="flex-shrink-0 text-right">
                        <p
                          className="text-[8px] tracking-[0.35em] uppercase text-kawai-charcoal/35 leading-none mb-0.5"
                          style={{ fontFamily: 'var(--font-brand-sans)' }}
                        >
                          Save
                        </p>
                        <p
                          className="text-kawai-red font-light leading-none"
                          style={{
                            fontFamily: 'var(--font-crimson), Georgia, serif',
                            fontSize: '1.875rem',
                            letterSpacing: '-0.04em',
                          }}
                        >
                          {formatSavings(model.consumerRebate)}
                        </p>
                      </div>
                    </div>

                    {model.productName && model.productName !== model.model && (
                      <span
                        className="block text-kawai-charcoal/55 text-sm mt-1 truncate"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        {model.productName}
                      </span>
                    )}
                    <span
                      className="block text-kawai-charcoal/40 text-sm mt-0.5"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      {model.finishes}
                    </span>
                    {model.productMsrp != null && (
                      <span
                        className="block text-kawai-charcoal/45 text-xs mt-1.5"
                        style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
                      >
                        From {formatPrice(model.productMsrp, model.productCurrency)}
                      </span>
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
                          className="flex-1 bg-kawai-black hover:bg-kawai-charcoal text-white border-none text-[10px] tracking-[0.18em] uppercase font-semibold h-10 rounded-none"
                        />
                      )}
                      {model.productSlug && (
                        <Link
                          href={`/products/${model.productSlug}`}
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/40 hover:text-kawai-red transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                          style={{ fontFamily: 'var(--font-brand-sans)' }}
                        >
                          View {model.model}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/find-a-dealer"
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/55 hover:text-kawai-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Find a Local Dealer
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* ── DESKTOP ROW (lg+) — original layout unchanged ── */}
              <div
                className="group relative hidden lg:flex items-center justify-between px-8 border-t border-kawai-neutral/60 hover:bg-kawai-red/[0.025] transition-colors duration-200 cursor-default"
                style={{ paddingTop: hasProduct ? '1.5rem' : '2rem', paddingBottom: hasProduct ? '1.5rem' : '2rem' }}
              >
                {/* Red left border on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
                  aria-hidden="true"
                />

                {/* Left: image + model info */}
                <div className="flex items-center gap-5 min-w-0 pr-8">
                  {model.productImageUrl && (
                    <div className="flex-shrink-0 w-[90px] h-[90px] bg-kawai-pearl items-center justify-center overflow-hidden border border-kawai-neutral/40 transition-all duration-300 group-hover:border-kawai-neutral/80 flex">
                      <Image
                        src={model.productImageUrl}
                        alt={model.productName ?? model.model}
                        width={90}
                        height={90}
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 min-w-0">
                    <span
                      className="font-semibold text-kawai-black flex-shrink-0"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.0625rem', letterSpacing: '0.06em' }}
                    >
                      {model.model}
                    </span>
                    {model.productName && model.productName !== model.model && (
                      <span className="text-kawai-charcoal/55 text-sm truncate" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                        {model.productName}
                      </span>
                    )}
                    <span className="text-kawai-charcoal/40 text-sm truncate" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                      {model.finishes}
                    </span>
                    {model.productMsrp != null && (
                      <span className="text-kawai-charcoal/45 text-xs mt-0.5" style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}>
                        From {formatPrice(model.productMsrp, model.productCurrency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: save + amount + actions */}
                <div className="flex-shrink-0 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-[9px] tracking-[0.35em] uppercase text-kawai-charcoal/30 mb-1 leading-none" style={{ fontFamily: 'var(--font-brand-sans)' }}>
                      save
                    </p>
                    <p
                      className="text-kawai-red font-light leading-none"
                      style={{ fontFamily: 'var(--font-crimson), Georgia, serif', fontSize: 'clamp(2.5rem, 4.5vw, 5.5rem)', letterSpacing: '-0.04em' }}
                    >
                      {formatSavings(model.consumerRebate)}
                    </p>
                  </div>

                  {hasProduct ? (
                    <div className="flex flex-col items-end gap-2">
                      {model.productVariantId && (
                        <AddToCartButton
                          variantId={model.productVariantId}
                          available={isAvailable}
                          size="sm"
                          className="bg-kawai-black hover:bg-kawai-charcoal text-white border-none text-[10px] tracking-[0.18em] uppercase font-semibold px-5 h-9 rounded-none"
                        />
                      )}
                      <Link
                        href={`/products/${model.productSlug}`}
                        className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/40 hover:text-kawai-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                        style={{ fontFamily: 'var(--font-brand-sans)' }}
                      >
                        View {model.model}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/find-a-dealer"
                      className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/55 hover:text-kawai-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kawai-red"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Find a Local Dealer
                      <ArrowRight className="h-3 w-3" />
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
          <span className="relative text-[11px] tracking-[0.22em] uppercase font-semibold text-white">
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
          <span className="text-[11px] tracking-[0.22em] uppercase font-medium text-kawai-black/70 transition-colors duration-300 group-hover:text-white">
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
  const [filterFixed, setFilterFixed] = useState(false)
  const headerRef = useRef(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  // Fix the filter bar below the site header once the sentinel scrolls out of view.
  // CSS sticky doesn't work here because the fixed site header sits above top:0.
  // Using IntersectionObserver + position:fixed with --header-bottom is reliable.
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry == null) return
        // Only fix when scrolled PAST (sentinel above viewport), not when below viewport
        setFilterFixed(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

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
      <div className="container mx-auto px-4 lg:px-8 max-w-screen-xl">

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
              className="text-[11px] tracking-[0.3em] uppercase text-kawai-charcoal/40 font-medium"
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
              style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1rem' }}
            >
              {subtitle}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* ── Mobile filter strip ── */}
        {/* Sentinel: when this scrolls above the viewport the fixed bar appears */}
        <div ref={sentinelRef} className="lg:hidden h-0" aria-hidden="true" />

        {/* Fixed copy — sits just below the site header once sentinel is out of view */}
        <AnimatePresence>
          {filterFixed && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed left-0 right-0 z-50 px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-kawai-neutral/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              style={{ top: 'var(--header-bottom, 70px)' }}
            >
              <FilterBar series={schedule} selected={selected} onSelect={setSelected} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* In-flow copy — always rendered to hold space; invisible when fixed bar is active */}
        <div className={`lg:hidden py-3 mb-6 transition-opacity duration-150 ${filterFixed ? 'invisible' : ''}`}>
          <FilterBar series={schedule} selected={selected} onSelect={setSelected} />
        </div>

        {/* ── Sidebar + content layout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-0 lg:items-start"
        >
          {/* ── Sidebar (desktop) ── */}
          <div className="hidden lg:block lg:sticky lg:self-start" style={{ top: '6rem' }}>
            <SeriesSidebar schedule={schedule} selected={selected} onSelect={setSelected} />
          </div>

          {/* ── Content ── */}
          <div className="lg:pl-10">
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
                    className="text-[10px] tracking-[0.3em] uppercase text-kawai-charcoal/25 font-medium"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Model
                  </span>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase text-kawai-charcoal/25 font-medium"
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
