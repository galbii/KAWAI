'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { RebateSeries } from '../page'

type Props = {
  schedule: RebateSeries[]
}

const ALL = 'All'

function formatSavings(amount: number): string {
  return amount % 1 === 0
    ? `$${amount.toLocaleString()}`
    : `$${amount.toFixed(2)}`
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
      <div className="px-6 py-4 border-b border-white/[0.08]">
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
            <div className="flex-1 px-5 py-5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={[
                    'font-light transition-colors duration-200 leading-tight',
                    isActive ? 'text-white' : 'text-white/40 group-hover:text-white/65',
                  ].join(' ')}
                  style={{
                    fontFamily: 'var(--font-crimson), Georgia, serif',
                    fontSize: '1.3rem',
                    letterSpacing: '-0.02em',
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
        className="flex items-center justify-between px-6 py-5 bg-kawai-black"
      >
        <div className="flex items-center gap-4">
          <span className="block w-px h-6 bg-kawai-red flex-shrink-0" />
          <span
            className="font-light text-white"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {series.seriesName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span
            className="text-kawai-red font-light"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(1rem, 1.75vw, 1.375rem)',
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
      <div className="border-l border-r border-b border-kawai-neutral/60">
        {series.models.map((model, mIdx) => (
          <motion.div
            key={model.model}
            initial={{ opacity: 0, x: 10 }}
            animate={shouldShow ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: mIdx * 0.055 + 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative flex items-center justify-between px-6 py-6 border-t border-kawai-neutral/60 hover:bg-kawai-red/[0.025] transition-colors duration-200 cursor-default"
          >
            {/* Red left border on hover */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
              aria-hidden="true"
            />

            {/* Left: model name stacked above finish */}
            <div className="flex flex-col gap-1 min-w-0 pr-6">
              <span
                className="font-semibold text-kawai-black flex-shrink-0"
                style={{
                  fontFamily: 'var(--font-brand-sans)',
                  fontSize: '0.9375rem',
                  letterSpacing: '0.06em',
                }}
              >
                {model.model}
              </span>
              <span
                className="text-kawai-charcoal/40 text-sm truncate"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {model.finishes}
              </span>
            </div>

            {/* Right: save label + amount */}
            <div className="text-right flex-shrink-0">
              <p
                className="text-[9px] tracking-[0.35em] uppercase text-kawai-charcoal/30 mb-1 leading-none"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                save
              </p>
              <p
                className="text-kawai-red font-light leading-none"
                style={{
                  fontFamily: 'var(--font-crimson), Georgia, serif',
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  letterSpacing: '-0.04em',
                }}
              >
                {formatSavings(model.consumerRebate)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Series CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldShow ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: series.models.length * 0.055 + 0.2 }}
        className="flex items-center justify-between px-6 py-4 border-l border-r border-b border-kawai-neutral/60 bg-kawai-pearl/50"
      >
        <Link
          href={`/pianos/${series.seriesName.toLowerCase().replace(/\s+/g, '-')}`}
          className="group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/50 hover:text-kawai-black transition-colors duration-200"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Explore {series.seriesName}
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/pianos"
          className="group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-medium text-kawai-charcoal/30 hover:text-kawai-charcoal/60 transition-colors duration-200"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          View all pianos
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function RebateSchedule({ schedule }: Props) {
  const [selected, setSelected] = useState<string>(ALL)
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 })

  const filtered = selected === ALL ? schedule : schedule.filter((s) => s.seriesName === selected)
  const activeSeries = filtered[0]

  const subtitle =
    selected === ALL
      ? `15 models across 7 series\u00a0·\u00a0April 1\u2013June 30, 2026`
      : activeSeries
        ? `${activeSeries.models.length} ${activeSeries.models.length === 1 ? 'model' : 'models'}\u00a0·\u00a0save ${formatSavings(maxRebate(activeSeries))}\u00a0·\u00a0April 1\u2013June 30, 2026`
        : ''

  return (
    <section id="schedule" className="bg-white py-28 lg:py-44">
      <div className="container mx-auto px-8 lg:px-20 max-w-6xl">

        {/* ── Section header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="block w-8 h-px bg-kawai-red" />
            <span
              className="text-[11px] tracking-[0.3em] uppercase text-kawai-charcoal/40 font-medium"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Spring 2026 Savings
            </span>
          </div>

          <h2
            className="font-light text-kawai-black leading-tight mb-5"
            style={{
              fontFamily: 'var(--font-crimson), Georgia, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              letterSpacing: '-0.025em',
            }}
          >
            Digital Piano Rebates<span className="text-kawai-red mx-3 font-extralight opacity-40">|</span>Available only until June 30, 2026
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

        {/* ── Sidebar + content layout ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start"
        >
          {/* ── Sidebar (desktop) ── */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
            <SeriesSidebar schedule={schedule} selected={selected} onSelect={setSelected} />
          </div>

          {/* ── Mobile filter strip ── */}
          <div className="lg:hidden mb-8">
            <FilterBar series={schedule} selected={selected} onSelect={setSelected} />
          </div>

          {/* ── Content ── */}
          <div className="lg:pl-12">
            {/* Column hints — only when a specific series is active */}
            <AnimatePresence>
              {selected !== ALL && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-between px-6 mb-3"
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
          className="text-kawai-charcoal/30 text-sm leading-relaxed pt-8 border-t border-kawai-neutral mt-14"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Savings applied as instant rebate at point of sale on qualifying new piano purchases at participating authorized Kawai dealers. Offer valid April 1–June 30, 2026.
        </motion.p>
      </div>
    </section>
  )
}
