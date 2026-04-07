'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const SERIES_NAMES = [
  'CN Series',
  'CA Series',
  'DG Series',
  'ES Series',
  'CX Line',
  'MP Series',
  'Piano Controllers',
]

// Duplicated for seamless infinite scroll
const TICKER_ITEMS = [...SERIES_NAMES, ...SERIES_NAMES, ...SERIES_NAMES, ...SERIES_NAMES]

export function Hero() {
  return (
    <section className="relative bg-kawai-black overflow-hidden">
      {/* Subtle diagonal red gradient in top-right */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 100% 0%, rgba(225,25,34,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Vertical rule accent */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[calc(50%-0.5px)] top-0 bottom-[72px] w-px bg-white/5 origin-top hidden lg:block"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="container mx-auto px-8 lg:px-20 max-w-7xl">
        <div className="min-h-[88vh] flex flex-col justify-center py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* ── Left column: announcement ── */}
            <div>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-4 mb-12"
              >
                <span className="block w-10 h-px bg-kawai-red" />
                <span
                  className="text-[10px] tracking-[0.35em] uppercase text-white/40 font-medium"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Limited Time Offer · Spring 2026
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-light text-white leading-[1.0] tracking-tight mb-10"
                style={{
                  fontFamily: 'var(--font-crimson), Georgia, serif',
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  letterSpacing: '-0.025em',
                }}
              >
                Kawai Digital
                <br />
                Piano{' '}
                <em className="text-kawai-red not-italic font-normal">Rebate</em>
                <br />
                Event
              </motion.h1>

              {/* Date + type */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-12 space-y-2"
              >
                <p
                  className="text-white/60 font-light tracking-wide"
                  style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '1.0625rem' }}
                >
                  April 1 – June 30, 2026
                </p>
                <p
                  className="text-white/25 text-sm font-light"
                  style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.04em' }}
                >
                  Instant rebate at participating Kawai dealers
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/find-a-dealer"
                  className="inline-flex items-center gap-3 bg-kawai-red text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-kawai-red/85 hover:gap-4"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  Find a Dealer
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                    <path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  href="#schedule"
                  className="text-xs tracking-[0.2em] uppercase text-white/35 font-medium hover:text-white/60 transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-brand-sans)' }}
                >
                  View Savings
                </Link>
              </motion.div>
            </div>

            {/* ── Right column: savings display ── */}
            <div className="flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Ghost number behind the card */}
                <div
                  className="absolute -top-6 -right-6 leading-none text-white/[0.025] select-none pointer-events-none font-light"
                  style={{
                    fontFamily: 'var(--font-crimson), Georgia, serif',
                    fontSize: 'clamp(160px, 20vw, 260px)',
                    letterSpacing: '-0.05em',
                  }}
                  aria-hidden="true"
                >
                  400
                </div>

                {/* Card */}
                <div className="relative border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-10 lg:p-14 min-w-[280px]">
                  {/* Top label */}
                  <p
                    className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-8 font-medium"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    Consumer Savings Up To
                  </p>

                  {/* The number */}
                  <div
                    className="font-light text-white leading-none"
                    style={{
                      fontFamily: 'var(--font-crimson), Georgia, serif',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    <span
                      className="inline-block align-top text-kawai-red font-light"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginTop: '0.6rem' }}
                    >
                      $
                    </span>
                    <span style={{ fontSize: 'clamp(5rem, 9vw, 8rem)' }}>400</span>
                  </div>

                  {/* Divider + dates */}
                  <div className="mt-8 pt-8 border-t border-white/[0.08]">
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase text-white/20 mb-2 font-medium"
                      style={{ fontFamily: 'var(--font-brand-sans)' }}
                    >
                      Offer Period
                    </p>
                    <p
                      className="text-white/50 font-light"
                      style={{ fontFamily: 'var(--font-crimson), Georgia, serif', fontSize: '1.15rem' }}
                    >
                      April 1 – June 30, 2026
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Series ticker ── */}
        <div className="border-t border-white/[0.07] py-5 overflow-hidden">
          <div className="flex items-center gap-0">
            {/* Static label */}
            <div className="flex items-center gap-3 mr-10 flex-shrink-0">
              <span className="block w-2 h-2 bg-kawai-red rounded-full" />
              <span
                className="text-[10px] tracking-[0.3em] uppercase text-kawai-red font-medium"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                Savings on
              </span>
            </div>

            {/* Scrolling names */}
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, #1E1B16, transparent)' }}
              />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, #1E1B16, transparent)' }}
              />
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
                className="flex gap-10 whitespace-nowrap"
              >
                {TICKER_ITEMS.map((name, i) => (
                  <span
                    key={i}
                    className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-medium flex-shrink-0"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {name}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
