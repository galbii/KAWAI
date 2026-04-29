'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup, type MotionStyle } from 'framer-motion'
import { SHIGERU_MODELS } from '../_data/models'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const glass: React.CSSProperties = {
  background: 'rgba(8, 8, 8, 0.88)',
  backdropFilter: 'blur(32px) saturate(160%)',
  WebkitBackdropFilter: 'blur(32px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow:
    '0 40px 120px rgba(0,0,0,0.32), 0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
}

const rowDivider: MotionStyle = {
  borderBottom: '1px solid rgba(255,255,255,0.05)',
}

function parseCm(cm: string): number {
  return parseInt(cm, 10) || 0
}

const MAX_CM = 278

const contentIn = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 56 : -56, opacity: 0 }),
}

const markIn = {
  enter: { opacity: 0, scale: 1.07 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.93 },
}

export function ShigeruProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const model = SHIGERU_MODELS[activeIndex]!
  const lengthPct = (parseCm(model.cm) / MAX_CM) * 100

  const goTo = (i: number) => {
    if (i === activeIndex) return
    setDirection(i > activeIndex ? 1 : -1)
    setActiveIndex(i)
  }

  const specs = [
    { label: 'Length', value: model.feet,   sub: model.cm      },
    { label: 'Width',  value: model.width,   sub: model.widthCm },
    { label: 'Weight', value: model.weight,  sub: model.weightKg },
    { label: 'Beams',  value: String(model.beams), sub: 'Aged Spruce' },
  ]

  return (
    <section
      id="collection"
      aria-label="Shigeru Kawai Grand Piano Collection"
      className="bg-white overflow-hidden"
    >
        {/* ═══════════════════════════════════════════
            GLASS CARD — full-bleed, full viewport height
        ═══════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={{
            ...glass,
            minHeight: '100vh',
          }}
        >
          {/* Ambient gold radial — constant */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-[55%] h-[55%] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 65% 65% at 88% 12%, rgba(213,199,140,0.07) 0%, transparent 65%)',
            }}
          />

          {/* SK-EX — deeper body glow */}
          {model.slug === 'sk-ex' && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 60% at 60% 50%, rgba(213,199,140,0.06) 0%, transparent 68%)',
              }}
            />
          )}

          {/* Giant watermark — fades/scales between models */}
          <AnimatePresence mode="wait">
            <motion.span
              key={`wm-${activeIndex}`}
              variants={markIn}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease }}
              aria-hidden="true"
              className="absolute left-0 top-1/2 -translate-y-1/2 font-light italic leading-none select-none pointer-events-none"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(8rem, 22vw, 21rem)',
                color: 'rgba(255,255,255,0.028)',
                paddingLeft: '1.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              {model.name}
            </motion.span>
          </AnimatePresence>

          {/* ──────────────────────────────────────────
              DESKTOP LAYOUT: left accordion | content
          ────────────────────────────────────────── */}
          <div
            className="hidden lg:flex relative z-10 h-full"
            style={{ minHeight: 'inherit' }}
          >

            {/* ── LEFT: integrated accordion model selector ── */}
            <div
              className="w-64 xl:w-72 flex-shrink-0 flex flex-col relative z-10"
              style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
              <LayoutGroup id="model-selector">
                {SHIGERU_MODELS.map((m, i) => {
                  const active = i === activeIndex
                  const lp = (parseCm(m.cm) / MAX_CM) * 100

                  return (
                    <motion.button
                      key={m.slug}
                      layout
                      onClick={() => goTo(i)}
                      aria-pressed={active}
                      aria-label={`${m.name} — ${m.type}`}
                      className="relative flex flex-col justify-end text-left overflow-hidden"
                      style={{
                        ...rowDivider,
                        flexGrow: active ? 3.5 : 1,
                        flexShrink: 1,
                        flexBasis: 0,
                        padding: active ? '1.75rem 1.75rem 1.75rem 2rem' : '0.875rem 1.75rem 0.875rem 2rem',
                        transition: 'padding 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
                      }}
                      transition={{ layout: { duration: 0.5, ease } }}
                    >
                      {/* Gold left bar — active indicator */}
                      <motion.span
                        aria-hidden="true"
                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                        style={{ background: 'rgba(213,199,140,0.85)' }}
                        initial={false}
                        animate={{ opacity: active ? 1 : 0 }}
                        transition={{ duration: 0.3, ease }}
                      />

                      {/* Model name — size transitions via CSS */}
                      <span
                        className="font-light italic leading-none block"
                        style={{
                          fontFamily: 'var(--font-brand-luxury)',
                          fontSize: active ? 'clamp(2.4rem, 3.2vw, 3rem)' : 'clamp(0.85rem, 1.1vw, 1rem)',
                          color: active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.2)',
                          transition: 'font-size 0.45s cubic-bezier(0.25,0.46,0.45,0.94), color 0.3s ease',
                        }}
                      >
                        {m.name}
                      </span>

                      {/* Expanded detail — only when active */}
                      <AnimatePresence>
                        {active && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.35, ease, delay: 0.12 }}
                            className="flex flex-col"
                          >
                            {/* Gold rule */}
                            <span
                              aria-hidden="true"
                              className="block h-px my-4"
                              style={{ width: '1.75rem', background: 'rgba(213,199,140,0.55)' }}
                            />

                            {/* Piano type */}
                            <p className="sk-eyebrow text-kawai-gold mb-5">{m.type}</p>

                            {/* Length proportional bar */}
                            <div
                              className="relative h-px overflow-hidden mb-2"
                              style={{ background: 'rgba(255,255,255,0.07)' }}
                            >
                              <motion.span
                                aria-hidden="true"
                                className="absolute inset-y-0 left-0"
                                style={{ background: 'rgba(213,199,140,0.65)' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${lp}%` }}
                                transition={{ duration: 0.55, ease, delay: 0.15 }}
                              />
                            </div>
                            <p
                              style={{
                                fontFamily: 'var(--font-brand-sans)',
                                fontSize: '0.6rem',
                                letterSpacing: '0.25em',
                                color: 'rgba(255,255,255,0.2)',
                              }}
                            >
                              {m.feet}&ensp;·&ensp;{m.cm}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  )
                })}
              </LayoutGroup>
            </div>

            {/* ── RIGHT: animated content panel ── */}
            <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden p-10 xl:p-14 2xl:p-16">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`content-${activeIndex}`}
                  custom={direction}
                  variants={contentIn}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.42, ease }}
                  className="flex flex-col h-full justify-center"
                >
                  {/* Tagline */}
                  <p
                    className="font-light italic leading-snug mb-10"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                      color: 'rgba(255,255,255,0.52)',
                      maxWidth: '30ch',
                    }}
                  >
                    {model.tagline}
                  </p>

                  {/* Spec grid */}
                  <div
                    className="grid grid-cols-4 mb-10"
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      borderLeft: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {specs.map(({ label, value, sub }) => (
                      <div
                        key={label}
                        className="px-5 py-5"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.07)',
                          borderRight:  '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <p className="sk-eyebrow mb-2.5" style={{ color: 'rgba(213,199,140,0.45)' }}>
                          {label}
                        </p>
                        <p
                          className="text-white font-light leading-none mb-1.5"
                          style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '1.3rem' }}
                        >
                          {value}
                        </p>
                        <p style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.58rem', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.2)' }}>
                          {sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Finishes */}
                  <div className="flex flex-wrap items-center gap-2 mb-10">
                    <span className="sk-eyebrow mr-2" style={{ color: 'rgba(255,255,255,0.18)' }}>
                      Finish
                    </span>
                    {model.finishes.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1.5"
                        style={{
                          fontFamily: 'var(--font-brand-sans)',
                          fontSize: '0.6rem',
                          letterSpacing: '0.12em',
                          color: 'rgba(255,255,255,0.3)',
                          border: '1px solid rgba(255,255,255,0.09)',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Artist quote */}
                  <blockquote
                    className="mb-11 pl-5"
                    style={{ borderLeft: '1px solid rgba(213,199,140,0.2)' }}
                  >
                    <p
                      className="font-light italic leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.28)',
                        maxWidth: '50ch',
                      }}
                    >
                      &ldquo;{model.artistQuote}&rdquo;
                    </p>
                    <footer className="mt-3">
                      <cite
                        className="not-italic sk-eyebrow"
                        style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em' }}
                      >
                        {model.artistName}&ensp;&mdash;&ensp;{model.artistRole}
                      </cite>
                    </footer>
                  </blockquote>

                  {/* Bottom row: CTA + prev/next */}
                  <div className="flex items-center justify-between gap-6">
                    <Link
                      href={`/shigeru/models/${model.slug}`}
                      className="inline-flex items-center gap-3 border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold/65 hover:text-kawai-gold hover:bg-kawai-gold/[0.06] px-8 py-3.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kawai-gold group/cta"
                      style={{
                        fontFamily: 'var(--font-oswald)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                      }}
                    >
                      Explore the {model.name}
                      <span
                        className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1"
                        aria-hidden="true"
                      >
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </Link>

                    {/* Prev / Next */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => goTo(Math.max(0, activeIndex - 1))}
                        disabled={activeIndex === 0}
                        aria-label="Previous model"
                        className="w-9 h-9 flex items-center justify-center disabled:opacity-20 transition-colors duration-200"
                        style={{
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.35)',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
                      >
                        <span className="text-xs" aria-hidden="true">←</span>
                      </button>
                      <button
                        onClick={() => goTo(Math.min(SHIGERU_MODELS.length - 1, activeIndex + 1))}
                        disabled={activeIndex === SHIGERU_MODELS.length - 1}
                        aria-label="Next model"
                        className="w-9 h-9 flex items-center justify-center disabled:opacity-20 transition-colors duration-200"
                        style={{
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.35)',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
                      >
                        <span className="text-xs" aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ──────────────────────────────────────────
              MOBILE LAYOUT: content top, selector bottom
          ────────────────────────────────────────── */}
          <div
            className="flex lg:hidden relative z-10 flex-col h-full"
            style={{ minHeight: 'inherit' }}
          >
            {/* Mobile content */}
            <div className="flex-1 flex flex-col justify-center p-7 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`m-content-${activeIndex}`}
                  custom={direction}
                  variants={contentIn}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.38, ease }}
                >
                  {/* Mobile: active model identity */}
                  <p className="sk-eyebrow text-kawai-gold mb-3">{model.type}</p>
                  <h3
                    className="text-white font-light italic leading-none mb-5"
                    style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: 'clamp(3rem, 10vw, 4.5rem)' }}
                  >
                    {model.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="block h-px mb-6"
                    style={{ width: '1.5rem', background: 'rgba(213,199,140,0.5)' }}
                  />

                  <p
                    className="font-light italic leading-snug mb-8"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(1.05rem, 4vw, 1.4rem)',
                      color: 'rgba(255,255,255,0.5)',
                      maxWidth: '30ch',
                    }}
                  >
                    {model.tagline}
                  </p>

                  {/* Mobile spec grid — 2 cols */}
                  <div
                    className="grid grid-cols-2 mb-8"
                    style={{
                      borderTop:  '1px solid rgba(255,255,255,0.07)',
                      borderLeft: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {specs.map(({ label, value, sub }) => (
                      <div
                        key={label}
                        className="px-4 py-4"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.07)',
                          borderRight:  '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <p className="sk-eyebrow mb-1.5" style={{ color: 'rgba(213,199,140,0.45)' }}>{label}</p>
                        <p className="text-white font-light" style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '1.1rem' }}>{value}</p>
                        <p style={{ fontFamily: 'var(--font-brand-sans)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>{sub}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/shigeru/models/${model.slug}`}
                    className="inline-flex items-center gap-3 border border-kawai-gold/30 hover:border-kawai-gold/65 text-kawai-gold/65 hover:text-kawai-gold px-7 py-3 transition-all duration-300 group/cta"
                    style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', borderRadius: '4px' }}
                  >
                    Explore
                    <span className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile: horizontal model strip — docked to bottom of card */}
            <div
              className="flex-shrink-0 flex overflow-x-auto sk-scroll-hide"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              role="tablist"
              aria-label="Select piano model"
            >
              {SHIGERU_MODELS.map((m, i) => {
                const active = i === activeIndex
                return (
                  <button
                    key={m.slug}
                    onClick={() => goTo(i)}
                    role="tab"
                    aria-selected={active}
                    aria-label={`${m.name} — ${m.type}`}
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 px-5 py-4 relative transition-colors duration-300"
                  >
                    {/* Gold top rule on active */}
                    <motion.span
                      aria-hidden="true"
                      className="absolute top-0 left-3 right-3 h-[2px]"
                      style={{ background: 'rgba(213,199,140,1)' }}
                      initial={false}
                      animate={{ opacity: active ? 1 : 0, scaleX: active ? 1 : 0.3 }}
                      transition={{ duration: 0.28, ease }}
                    />
                    <span
                      className="sk-font text-[11px] font-semibold tracking-[0.1em] leading-none transition-colors duration-300"
                      style={{ color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.22)' }}
                    >
                      {m.name}
                    </span>
                    <motion.span
                      className="sk-eyebrow text-kawai-gold leading-none"
                      style={{ fontSize: '0.48rem' }}
                      initial={false}
                      animate={{ opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.22, ease }}
                      aria-hidden="true"
                    >
                      {m.type.split(' ').pop()}
                    </motion.span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Thin gold progress rule — pinned to bottom of card */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px z-20"
            style={{ background: 'rgba(255,255,255,0.04)' }}
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
              transition={{ duration: 0.5, ease }}
            />
          </div>

        </div>
    </section>
  )
}
