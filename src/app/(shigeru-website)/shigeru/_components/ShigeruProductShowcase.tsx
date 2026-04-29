'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup, type MotionStyle } from 'framer-motion'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import { SHIGERU_MODELS } from '../_data/models'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// kawai-pearl rgb(250,248,245) — used for image blending gradients
const PEARL = '250,248,245'

const rowDivider: MotionStyle = {
  borderBottom: '1px solid rgba(30,27,22,0.22)',
}

function parseCm(cm: string): number {
  return parseInt(cm, 10) || 0
}

const MAX_CM = 278

const contentIn = {
  enter: (dir: number) => ({ x: dir > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 64 : -64, opacity: 0 }),
}

const markIn = {
  enter: { opacity: 0, scale: 1.07 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.93 },
}

type ShigeruModelShopifyData = {
  imageUrl: string | null
  finishes: string[]
  specLength: string | null
  specLengthSub: string | null
  specWidth: string | null
  specWidthSub: string | null
  specWeight: string | null
  specWeightSub: string | null
  specBeams: string | null
}

type Props = {
  productData?: Record<string, ShigeruModelShopifyData>
}

export function ShigeruProductShowcase({ productData }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const model = SHIGERU_MODELS[activeIndex]!
  // model.slug uses dashes ("sk-2", "sk-ex") but Shopify model metafield does not ("sk2", "skex")
  const shopifyKey = model.slug.replace(/-/g, '')
  const shopifyData = productData?.[shopifyKey] ?? null
  const currentImage = shopifyData?.imageUrl ?? null
  const lengthPct = (parseCm(model.cm) / MAX_CM) * 100

  const goTo = (i: number) => {
    if (i === activeIndex) return
    setDirection(i > activeIndex ? 1 : -1)
    setActiveIndex(i)
  }

  const finishes =
    shopifyData?.finishes?.length ? shopifyData.finishes : model.finishes

  const specs = [
    {
      label: 'Length',
      value: shopifyData?.specLength ?? model.feet,
      sub: shopifyData?.specLengthSub ?? model.cm,
    },
    {
      label: 'Width',
      value: shopifyData?.specWidth ?? model.width,
      sub: shopifyData?.specWidthSub ?? model.widthCm,
    },
    {
      label: 'Weight',
      value: shopifyData?.specWeight ?? model.weight,
      sub: shopifyData?.specWeightSub ?? model.weightKg,
    },
    {
      label: 'Beams',
      value: shopifyData?.specBeams ?? String(model.beams),
      sub: 'Aged Spruce',
    },
  ]

  return (
    <section
      id="collection"
      aria-label="Shigeru Kawai Grand Piano Collection"
      className="bg-kawai-pearl overflow-hidden"
    >
      <div
        className="relative overflow-hidden bg-kawai-pearl"
        style={{ minHeight: '100vh' }}
      >
        {/* Ambient gold radial */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[55%] h-[55%] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 65% at 88% 12%, rgba(213,199,140,0.14) 0%, transparent 65%)',
          }}
        />

        {/* SK-EX deeper bloom */}
        {model.slug === 'sk-ex' && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 60% 50%, rgba(213,199,140,0.1) 0%, transparent 68%)',
            }}
          />
        )}

        {/* Giant watermark */}
        <AnimatePresence mode="wait">
          <motion.span
            key={`wm-${activeIndex}`}
            variants={markIn}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease }}
            aria-hidden="true"
            className="absolute left-0 top-1/2 -translate-y-1/2 font-bold leading-none select-none pointer-events-none uppercase"
            style={{
              fontFamily: 'var(--font-oswald)',
              fontSize: 'clamp(9rem, 24vw, 23rem)',
              color: 'rgba(30,27,22,0.05)',
              paddingLeft: '2rem',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {model.name}
          </motion.span>
        </AnimatePresence>

        {/* ══════════════════════════════════════
            DESKTOP LAYOUT
        ══════════════════════════════════════ */}
        <div
          className="hidden lg:flex relative z-10 h-full"
          style={{ minHeight: 'inherit' }}
        >
          {/* ── LEFT: accordion model selector ── */}
          <div
            className="w-80 xl:w-96 flex-shrink-0 flex flex-col relative z-10"
            style={{ borderRight: '2px solid rgba(30,27,22,0.18)' }}
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
                      padding: active
                        ? '2.25rem 2.25rem 2.25rem 2.5rem'
                        : '1.25rem 2.25rem 1.25rem 2.5rem',
                      transition:
                        'padding 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                    transition={{ layout: { duration: 0.5, ease } }}
                  >
                    {/* Gold left bar */}
                    <motion.span
                      aria-hidden="true"
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ background: 'rgba(213,199,140,1)' }}
                      initial={false}
                      animate={{ opacity: active ? 1 : 0 }}
                      transition={{ duration: 0.3, ease }}
                    />

                    {/* Model name */}
                    <span
                      className="leading-none block uppercase"
                      style={{
                        fontFamily: 'var(--font-oswald)',
                        fontSize: active
                          ? 'clamp(2.6rem, 3.2vw, 3.4rem)'
                          : 'clamp(1.3rem, 1.7vw, 1.6rem)',
                        fontWeight: active ? 800 : 700,
                        letterSpacing: active ? '0.04em' : '0.06em',
                        color: active
                          ? 'rgba(30,27,22,1)'
                          : 'rgba(30,27,22,0.6)',
                        transition:
                          'font-size 0.45s cubic-bezier(0.25,0.46,0.45,0.94), color 0.3s ease',
                      }}
                    >
                      {m.name}
                    </span>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.35, ease, delay: 0.12 }}
                          className="flex flex-col"
                        >
                          <span
                            aria-hidden="true"
                            className="block h-px my-5"
                            style={{
                              width: '2.5rem',
                              background: 'rgba(213,199,140,0.7)',
                            }}
                          />

                          <p
                            className="mb-6"
                            style={{
                              fontFamily: 'var(--font-oswald)',
                              fontSize: '0.8rem',
                              letterSpacing: '0.35em',
                              textTransform: 'uppercase',
                              color: 'rgba(213,199,140,0.9)',
                            }}
                          >
                            {m.type}
                          </p>

                          {/* Length bar */}
                          <div
                            className="relative h-0.5 overflow-hidden mb-2.5"
                            style={{ background: 'rgba(30,27,22,0.12)' }}
                          >
                            <motion.span
                              aria-hidden="true"
                              className="absolute inset-y-0 left-0"
                              style={{ background: 'rgba(213,199,140,0.75)' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${lp}%` }}
                              transition={{ duration: 0.55, ease, delay: 0.15 }}
                            />
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-brand-sans)',
                              fontSize: '0.72rem',
                              letterSpacing: '0.2em',
                              color: 'rgba(30,27,22,0.4)',
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

          {/* ── RIGHT: content + image ── */}
          <div className="flex-1 min-w-0 flex overflow-hidden">
            {/* Content panel */}
            <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden p-12 xl:p-16 2xl:p-20">
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
                    className="font-light italic leading-snug mb-12"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(1.9rem, 3.2vw, 2.8rem)',
                      color: 'rgba(30,27,22,0.68)',
                      maxWidth: '28ch',
                    }}
                  >
                    {model.tagline}
                  </p>

                  {/* Spec grid */}
                  <div
                    className="grid grid-cols-4 mb-12"
                    style={{
                      borderTop: '1px solid rgba(30,27,22,0.28)',
                      borderLeft: '1px solid rgba(30,27,22,0.28)',
                    }}
                  >
                    {specs.map(({ label, value, sub }) => (
                      <div
                        key={label}
                        className="px-6 py-7"
                        style={{
                          borderBottom: '1px solid rgba(30,27,22,0.28)',
                          borderRight: '1px solid rgba(30,27,22,0.28)',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-oswald)',
                            fontSize: '0.7rem',
                            letterSpacing: '0.38em',
                            textTransform: 'uppercase',
                            color: 'rgba(213,199,140,0.9)',
                            marginBottom: '0.75rem',
                          }}
                        >
                          {label}
                        </p>
                        <p
                          className="font-bold leading-none uppercase"
                          style={{
                            fontFamily: 'var(--font-oswald)',
                            fontSize: '1.6rem',
                            color: 'rgba(30,27,22,0.92)',
                            letterSpacing: '0.03em',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {value}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-brand-sans)',
                            fontSize: '0.7rem',
                            letterSpacing: '0.07em',
                            color: 'rgba(30,27,22,0.5)',
                          }}
                        >
                          {sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Finishes */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-12">
                    <span
                      style={{
                        fontFamily: 'var(--font-oswald)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.38em',
                        textTransform: 'uppercase',
                        color: 'rgba(30,27,22,0.5)',
                        marginRight: '0.5rem',
                      }}
                    >
                      Finish
                    </span>
                    {finishes.map((f) => (
                      <span
                        key={f}
                        className="px-5 py-2.5"
                        style={{
                          fontFamily: 'var(--font-brand-sans)',
                          fontSize: '0.72rem',
                          letterSpacing: '0.1em',
                          color: 'rgba(30,27,22,0.7)',
                          border: '1px solid rgba(30,27,22,0.32)',
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Artist quote */}
                  <blockquote
                    className="mb-12 pl-6"
                    style={{ borderLeft: '3px solid rgba(213,199,140,0.65)' }}
                  >
                    <p
                      className="font-light italic leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-brand-luxury)',
                        fontSize: '1.05rem',
                        color: 'rgba(30,27,22,0.55)',
                        maxWidth: '48ch',
                      }}
                    >
                      &ldquo;{model.artistQuote}&rdquo;
                    </p>
                    <footer className="mt-4">
                      <cite
                        className="not-italic"
                        style={{
                          fontFamily: 'var(--font-oswald)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          color: 'rgba(30,27,22,0.45)',
                        }}
                      >
                        {model.artistName}&ensp;&mdash;&ensp;{model.artistRole}
                      </cite>
                    </footer>
                  </blockquote>

                  {/* Bottom row: CTA + prev/next */}
                  <div className="flex items-center justify-between gap-6">
                    <Link
                      href={`/shigeru/models/${model.slug}`}
                      className="inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] px-10 py-4 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kawai-gold group/cta"
                      style={{
                        fontFamily: 'var(--font-oswald)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        borderRadius: '4px',
                      }}
                    >
                      Explore the {model.name}
                      <span
                        className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1.5"
                        aria-hidden="true"
                      >
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                          <path
                            d="M1 5.5H15M11 1.5L15 5.5L11 9.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>

                    {/* Prev / Next */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => goTo(Math.max(0, activeIndex - 1))}
                        disabled={activeIndex === 0}
                        aria-label="Previous model"
                        className="w-11 h-11 flex items-center justify-center disabled:opacity-20 transition-all duration-200 text-sm"
                        style={{
                          border: '1px solid rgba(30,27,22,0.35)',
                          color: 'rgba(30,27,22,0.6)',
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                            'rgba(30,27,22,0.65)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                            'rgba(30,27,22,0.35)'
                        }}
                      >
                        ←
                      </button>
                      <button
                        onClick={() =>
                          goTo(Math.min(SHIGERU_MODELS.length - 1, activeIndex + 1))
                        }
                        disabled={activeIndex === SHIGERU_MODELS.length - 1}
                        aria-label="Next model"
                        className="w-11 h-11 flex items-center justify-center disabled:opacity-20 transition-all duration-200 text-sm"
                        style={{
                          border: '1px solid rgba(30,27,22,0.35)',
                          color: 'rgba(30,27,22,0.6)',
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                            'rgba(30,27,22,0.65)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                            'rgba(30,27,22,0.35)'
                        }}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image panel */}
            <div
              className="w-[38%] xl:w-[40%] relative flex-shrink-0 overflow-hidden"
              style={{ height: '100vh' }}
            >
              <AnimatePresence mode="wait">
                {currentImage &&
                  (() => {
                    const imageProps = getOptimizedImageProps(currentImage, 'hero')
                    if (!imageProps?.src) return null
                    const { width, height, ...optimizedProps } = imageProps
                    return (
                      <motion.div
                        key={`img-${activeIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="absolute inset-0"
                      >
                        <Image
                          {...optimizedProps}
                          fill
                          className="object-contain"
                          priority={activeIndex === 0}
                          sizes="(min-width: 1280px) 40vw, 38vw"
                          alt={optimizedProps.alt || model.name}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
                          style={{
                            background: `linear-gradient(to right, rgba(${PEARL},0.96), transparent)`,
                          }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 top-0 h-28 pointer-events-none"
                          style={{
                            background: `linear-gradient(to bottom, rgba(${PEARL},0.92), transparent)`,
                          }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                          style={{
                            background: `linear-gradient(to top, rgba(${PEARL},0.92), transparent)`,
                          }}
                        />
                      </motion.div>
                    )
                  })()}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            MOBILE LAYOUT
        ══════════════════════════════════════ */}
        <div
          className="flex lg:hidden relative z-10 flex-col h-full"
          style={{ minHeight: 'inherit' }}
        >
          <div className="flex-1 flex flex-col justify-center p-8 overflow-hidden">
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
                {/* Mobile image */}
                {currentImage &&
                  (() => {
                    const imageProps = getOptimizedImageProps(currentImage, 'hero')
                    if (!imageProps?.src) return null
                    const { width, height, ...optimizedProps } = imageProps
                    return (
                      <div
                        className="relative w-full overflow-hidden mb-7"
                        style={{ height: '280px' }}
                      >
                        <Image
                          {...optimizedProps}
                          fill
                          className="object-contain"
                          priority={activeIndex === 0}
                          sizes="100vw"
                          alt={optimizedProps.alt || model.name}
                        />
                      </div>
                    )
                  })()}

                <p
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.38em',
                    textTransform: 'uppercase',
                    color: 'rgba(213,199,140,0.9)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {model.type}
                </p>
                <h3
                  className="font-extrabold leading-none mb-5 uppercase"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: 'clamp(3.5rem, 11vw, 5rem)',
                    color: 'rgba(30,27,22,1)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {model.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="block mb-7"
                  style={{
                    width: '2rem',
                    height: '2px',
                    background: 'rgba(213,199,140,0.7)',
                  }}
                />

                <p
                  className="font-light italic leading-snug mb-9"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.2rem, 4.5vw, 1.6rem)',
                    color: 'rgba(30,27,22,0.55)',
                    maxWidth: '28ch',
                  }}
                >
                  {model.tagline}
                </p>

                {/* Mobile spec grid */}
                <div
                  className="grid grid-cols-2 mb-9"
                  style={{
                    borderTop: '1px solid rgba(30,27,22,0.28)',
                    borderLeft: '1px solid rgba(30,27,22,0.28)',
                  }}
                >
                  {specs.map(({ label, value, sub }) => (
                    <div
                      key={label}
                      className="px-5 py-5"
                      style={{
                        borderBottom: '1px solid rgba(30,27,22,0.28)',
                        borderRight: '1px solid rgba(30,27,22,0.28)',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-oswald)',
                          fontSize: '0.65rem',
                          letterSpacing: '0.35em',
                          textTransform: 'uppercase',
                          color: 'rgba(213,199,140,0.9)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {label}
                      </p>
                      <p
                        className="font-bold uppercase"
                        style={{
                          fontFamily: 'var(--font-oswald)',
                          fontSize: '1.35rem',
                          color: 'rgba(30,27,22,0.9)',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {value}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-brand-sans)',
                          fontSize: '0.65rem',
                          color: 'rgba(30,27,22,0.45)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {sub}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/shigeru/models/${model.slug}`}
                  className="inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold px-8 py-3.5 transition-all duration-300 group/cta"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    borderRadius: '4px',
                  }}
                >
                  Explore
                  <span
                    className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile model strip */}
          <div
            className="flex-shrink-0 flex overflow-x-auto sk-scroll-hide"
            style={{ borderTop: '2px solid rgba(30,27,22,0.18)' }}
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
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-2 px-6 py-5 relative transition-colors duration-300"
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute top-0 left-3 right-3 h-[3px]"
                    style={{ background: 'rgba(213,199,140,1)' }}
                    initial={false}
                    animate={{ opacity: active ? 1 : 0, scaleX: active ? 1 : 0.3 }}
                    transition={{ duration: 0.28, ease }}
                  />
                  <span
                    className="font-bold leading-none uppercase transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.08em',
                      color: active ? 'rgba(30,27,22,0.95)' : 'rgba(30,27,22,0.5)',
                    }}
                  >
                    {m.name}
                  </span>
                  <motion.span
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '0.52rem',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: 'rgba(213,199,140,1)',
                    }}
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

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] z-20"
          style={{ background: 'rgba(30,27,22,0.12)' }}
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
            animate={{
              width: `${((activeIndex + 1) / SHIGERU_MODELS.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease }}
          />
        </div>
      </div>
    </section>
  )
}
