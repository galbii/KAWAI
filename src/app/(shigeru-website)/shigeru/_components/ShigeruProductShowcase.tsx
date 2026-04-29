'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SHIGERU_MODELS } from '../_data/models'

const MAX_CM = 278 // SK-EX — longest model, used to scale the length visualizer

function parseCm(cm: string): number {
  return parseInt(cm, 10) || 0
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 36 : -36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 36 : -36, opacity: 0 }),
}

export function ShigeruProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const model = SHIGERU_MODELS[activeIndex]!
  const lengthRatio = parseCm(model.cm) / MAX_CM

  const goTo = (i: number) => {
    if (i === activeIndex) return
    setDirection(i > activeIndex ? 1 : -1)
    setActiveIndex(i)
  }

  const specs = [
    { label: 'Length', value: model.feet, sub: model.cm },
    { label: 'Width',  value: model.width,  sub: model.widthCm },
    { label: 'Weight', value: model.weight, sub: model.weightKg },
    { label: 'Beams',  value: String(model.beams), sub: 'Spruce Beams' },
  ]

  return (
    <section
      id="collection"
      aria-label="Shigeru Kawai Grand Piano Collection"
      className="bg-white sk-section overflow-hidden"
    >
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">

        {/* ── Section header ── */}
        <div className="flex items-end justify-between mb-20">
          <div>
            <p className="sk-eyebrow text-kawai-gold mb-4">The Collection</p>
            <h2
              className="font-light italic leading-none text-kawai-black"
              style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Six Grand Pianos
            </h2>
          </div>

          {/* Animated counter */}
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="sk-eyebrow text-kawai-charcoal/20"
              style={{ letterSpacing: '0.3em', fontSize: '0.65rem' }}
              aria-live="polite"
              aria-label={`Model ${activeIndex + 1} of ${SHIGERU_MODELS.length}`}
            >
              {String(activeIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(SHIGERU_MODELS.length).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Main layout: sidebar + content ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Left: vertical model selector (desktop) */}
          <nav
            className="hidden lg:flex flex-col gap-0.5 w-28 flex-shrink-0 self-start pt-1"
            aria-label="Select piano model"
          >
            {SHIGERU_MODELS.map((m, i) => (
              <button
                key={m.slug}
                onClick={() => goTo(i)}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={`group flex items-center gap-3 py-2.5 text-left transition-all duration-300 ${
                  i === activeIndex
                    ? 'text-kawai-black'
                    : 'text-kawai-charcoal/30 hover:text-kawai-charcoal/60'
                }`}
              >
                <motion.span
                  aria-hidden="true"
                  className="flex-shrink-0 h-px bg-kawai-gold"
                  animate={{
                    width: i === activeIndex ? 20 : 10,
                    opacity: i === activeIndex ? 0.7 : 0.25,
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                <span className="sk-font text-[11px] font-medium tracking-[0.12em]">
                  {m.name}
                </span>
              </button>
            ))}
          </nav>

          {/* Right: animated editorial panel */}
          <div className="flex-1 min-w-0 relative">

            {/* Decorative watermark — faint behind content */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`wm-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                aria-hidden="true"
                className="absolute -top-8 -right-6 lg:-right-12 font-light leading-none select-none pointer-events-none text-kawai-charcoal/[0.04]"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(5rem, 16vw, 13rem)',
                  zIndex: 0,
                }}
              >
                {model.name}
              </motion.span>
            </AnimatePresence>

            {/* Slide-transitioning content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10"
              >

                {/* Type eyebrow */}
                <p className="sk-eyebrow text-kawai-gold mb-5">{model.type}</p>

                {/* Model name — large editorial */}
                <h3
                  className="font-light italic leading-none text-kawai-black mb-6"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(3.5rem, 9vw, 7rem)',
                  }}
                >
                  {model.name}
                </h3>

                {/* Piano length visualizer */}
                <div className="flex items-center gap-4 mb-8 max-w-sm">
                  <div className="flex-1 h-px bg-kawai-neutral/20 relative overflow-hidden">
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 bg-kawai-gold"
                      initial={false}
                      animate={{ width: `${lengthRatio * 100}%` }}
                      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <span
                    className="sk-eyebrow text-kawai-charcoal/35 flex-shrink-0"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    {model.feet}&ensp;·&ensp;{model.cm}
                  </span>
                </div>

                {/* Gold rule */}
                <span
                  aria-hidden="true"
                  className="sk-rule block w-10 mb-8"
                  style={{ opacity: 0.45 }}
                />

                {/* Tagline */}
                <p
                  className="font-light italic text-kawai-charcoal/55 leading-relaxed mb-10"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                    maxWidth: '40ch',
                  }}
                >
                  {model.tagline}
                </p>

                {/* Specs grid — bordered cells */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-kawai-neutral/20 mb-10">
                  {specs.map(({ label, value, sub }) => (
                    <div key={label} className="border-b border-r border-kawai-neutral/20 px-4 py-5">
                      <p className="sk-eyebrow text-kawai-charcoal/28 mb-2">{label}</p>
                      <p
                        className="text-kawai-black font-light leading-snug"
                        style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '1.1rem' }}
                      >
                        {value}
                      </p>
                      <p
                        className="text-kawai-charcoal/28 mt-1"
                        style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.65rem', letterSpacing: '0.05em' }}
                      >
                        {sub}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Finishes */}
                <div className="flex flex-wrap items-center gap-2 mb-11">
                  <span className="sk-eyebrow text-kawai-charcoal/28 mr-1">Available in</span>
                  {model.finishes.map((f) => (
                    <span
                      key={f}
                      className="border border-kawai-neutral/40 text-kawai-charcoal/45 px-3 py-1.5"
                      style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.65rem', letterSpacing: '0.07em' }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* Artist quote */}
                <blockquote className="border-l border-kawai-gold/25 pl-5 mb-12">
                  <p
                    className="font-light italic text-kawai-charcoal/38 leading-relaxed"
                    style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '0.875rem', maxWidth: '46ch' }}
                  >
                    &ldquo;{model.artistQuote}&rdquo;
                  </p>
                  <footer className="mt-3">
                    <cite
                      className="not-italic sk-eyebrow text-kawai-charcoal/28"
                      style={{ letterSpacing: '0.18em' }}
                    >
                      {model.artistName}&ensp;&mdash;&ensp;{model.artistRole}
                    </cite>
                  </footer>
                </blockquote>

                {/* CTA */}
                <Link
                  href={`/shigeru/models/${model.slug}`}
                  className="inline-flex items-center gap-3 border border-kawai-charcoal/12 hover:border-kawai-gold text-kawai-charcoal/38 hover:text-kawai-gold px-8 py-3.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kawai-gold"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                  }}
                >
                  Explore the {model.name}
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                    <path
                      d="M1 5H13M9 1L13 5L9 9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom: gold progress bar + prev/next ── */}
        <div className="flex items-center gap-4 mt-20">
          <div
            className="flex-1 h-px bg-kawai-neutral/15 relative overflow-hidden"
            role="progressbar"
            aria-valuenow={activeIndex + 1}
            aria-valuemin={1}
            aria-valuemax={SHIGERU_MODELS.length}
            aria-label="Collection progress"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-kawai-gold"
              initial={false}
              animate={{ width: `${((activeIndex + 1) / SHIGERU_MODELS.length) * 100}%` }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => goTo(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous model"
              className="w-9 h-9 flex items-center justify-center border border-kawai-neutral/35 hover:border-kawai-charcoal/30 disabled:opacity-20 transition-colors duration-200"
            >
              <span className="text-kawai-black text-xs" aria-hidden="true">←</span>
            </button>
            <button
              onClick={() => goTo(Math.min(SHIGERU_MODELS.length - 1, activeIndex + 1))}
              disabled={activeIndex === SHIGERU_MODELS.length - 1}
              aria-label="Next model"
              className="w-9 h-9 flex items-center justify-center border border-kawai-neutral/35 hover:border-kawai-charcoal/30 disabled:opacity-20 transition-colors duration-200"
            >
              <span className="text-kawai-black text-xs" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* ── Mobile: dot navigation ── */}
        <div
          className="flex lg:hidden items-center gap-3 mt-7"
          role="tablist"
          aria-label="Piano model navigation"
        >
          {SHIGERU_MODELS.map((m, i) => (
            <button
              key={m.slug}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={m.name}
              className={`h-px transition-all duration-300 ${
                i === activeIndex ? 'w-8 bg-kawai-gold' : 'w-4 bg-kawai-charcoal/20 hover:bg-kawai-charcoal/35'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
