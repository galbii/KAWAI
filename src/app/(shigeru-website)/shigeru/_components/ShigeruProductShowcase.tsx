'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'
import { SHIGERU_MODELS } from '../_data/models'
import type { ShigeruModelShopifyData } from '../_data/shopify'

const ease = [0.25, 0.46, 0.45, 0.94] as const

// The entire range is differentiated by length (180cm → 278cm), so every
// piano image — stage and filmstrip — renders at cm/MAX_CM of its container.
const MAX_CM = 278

function parseCm(cm: string): number {
  return parseInt(cm, 10) || 0
}

// Ink alphas ≥0.72 keep small text above 4.5:1 on kawai-pearl (WCAG AA).
const INK = '30,27,22'
const ink = (a: number) => `rgba(${INK},${a})`

// Carousel slide: the piano travels through the stage in the direction of
// navigation with a subtle settle; the text column follows with a shorter
// throw and a staggered cascade.
const stageIn = {
  enter: (dir: number) => ({ x: dir > 0 ? 180 : -180, opacity: 0, scale: 0.96 }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -180 : 180,
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.32, ease },
  }),
}

const contentGroup = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease, staggerChildren: 0.13, delayChildren: 0.18 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.26, ease },
  }),
}

const rise = {
  enter: { opacity: 0, y: 22 },
  center: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  exit: { opacity: 0 },
}

const ruleGrow = {
  enter: { opacity: 0, scaleX: 0 },
  center: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease } },
  exit: { opacity: 0 },
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
  const scale = parseCm(model.cm) / MAX_CM

  const goTo = (i: number, dir?: number) => {
    if (i === activeIndex) return
    setDirection(dir ?? (i > activeIndex ? 1 : -1))
    setActiveIndex(i)
  }

  // Wrap-around carousel: SK-EX → next → SK-2
  const step = (dir: number) =>
    goTo(
      (activeIndex + dir + SHIGERU_MODELS.length) % SHIGERU_MODELS.length,
      dir,
    )

  const prevModel =
    SHIGERU_MODELS[
      (activeIndex - 1 + SHIGERU_MODELS.length) % SHIGERU_MODELS.length
    ]!
  const nextModel = SHIGERU_MODELS[(activeIndex + 1) % SHIGERU_MODELS.length]!

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

  const arrowStyle = {
    border: `1px solid ${ink(0.35)}`,
    color: ink(0.75),
    background: 'rgba(250,248,245,0.85)',
  }

  return (
    <section
      id="collection"
      aria-label="Shigeru Kawai Grand Piano Collection"
      className="bg-kawai-pearl overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-16 lg:pt-24 pb-14 lg:pb-20">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-14 items-center">
          {/* ── LEFT: content column ── */}
          <div className="order-2 lg:order-1 min-w-0">
            {/* Heading row — arrows flank the model name; the name crossfades
                between models while the controls stay put */}
            <div className="flex items-center gap-5 mb-3">
              <button
                onClick={() => step(-1)}
                aria-label={`Previous model, ${prevModel.name}`}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:!border-kawai-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
                style={arrowStyle}
              >
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <path
                    d="M17 6H1M6 1L1 6L6 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="flex flex-col items-start">
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '0.56rem',
                      letterSpacing: '0.28em',
                      color: ink(0.72),
                    }}
                  >
                    Previous
                  </span>
                  <span
                    className="uppercase mt-0.5 leading-none"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: ink(0.92),
                    }}
                  >
                    {prevModel.name}
                  </span>
                </span>
              </button>

              <div className="relative min-w-0 overflow-hidden text-center" style={{ minWidth: '5ch' }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.h2
                    key={`name-${model.slug}`}
                    custom={direction}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease }}
                    className="leading-none uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: 'clamp(3.2rem, 5.5vw, 5rem)',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: ink(0.95),
                    }}
                  >
                    {model.name}
                  </motion.h2>
                </AnimatePresence>
              </div>

              <button
                onClick={() => step(1)}
                aria-label={`Next model, ${nextModel.name}`}
                className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:!border-kawai-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
                style={arrowStyle}
              >
                <span className="flex flex-col items-end">
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '0.56rem',
                      letterSpacing: '0.28em',
                      color: ink(0.72),
                    }}
                  >
                    Next
                  </span>
                  <span
                    className="uppercase mt-0.5 leading-none"
                    style={{
                      fontFamily: 'var(--font-oswald)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: ink(0.92),
                    }}
                  >
                    {nextModel.name}
                  </span>
                </span>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <path
                    d="M1 6H17M12 1L17 6L12 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`content-${model.slug}`}
                custom={direction}
                variants={contentGroup}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <motion.p
                  variants={rise}
                  className="italic font-light"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.4rem)',
                    color: ink(0.72),
                  }}
                >
                  {model.type}
                </motion.p>
                <motion.span
                  variants={ruleGrow}
                  aria-hidden="true"
                  className="block h-px w-12 my-7 origin-left"
                  style={{ background: 'rgba(213,199,140,0.9)' }}
                />
                <motion.p
                  variants={rise}
                  className="italic font-light leading-snug"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(1.35rem, 2.2vw, 1.8rem)',
                    color: ink(0.78),
                    maxWidth: '30ch',
                  }}
                >
                  {model.tagline}
                </motion.p>

                <motion.div variants={rise} className="inline-block">
                <Link
                  href={`/shigeru/models/${model.slug}`}
                  className="inline-flex items-center gap-3 bg-kawai-black hover:bg-kawai-charcoal text-white px-10 py-4 mt-8 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black group/cta"
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
                </motion.div>

                {/* Specs — one hairline row */}
                <motion.dl
                  variants={rise}
                  className="flex flex-wrap mt-9 py-5 gap-y-4"
                  style={{
                    borderTop: `1px solid ${ink(0.18)}`,
                    borderBottom: `1px solid ${ink(0.18)}`,
                  }}
                >
                  {specs.map(({ label, value, sub }, i) => (
                    <div
                      key={label}
                      className={i > 0 ? 'flex flex-col pl-4 pr-4' : 'flex flex-col pr-4'}
                      style={
                        i > 0
                          ? { borderLeft: `1px solid ${ink(0.18)}` }
                          : undefined
                      }
                    >
                      <dt
                        className="uppercase"
                        style={{
                          fontFamily: 'var(--font-oswald)',
                          fontSize: '0.66rem',
                          letterSpacing: '0.26em',
                          color: ink(0.72),
                        }}
                      >
                        {label}
                      </dt>
                      <dd
                        className="mt-1.5 leading-none"
                        style={{
                          fontFamily: 'var(--font-oswald)',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: ink(0.92),
                          letterSpacing: '0.03em',
                        }}
                      >
                        {value}
                        <span
                          className="ml-2 font-normal"
                          style={{ fontSize: '0.75rem', color: ink(0.72) }}
                        >
                          {sub}
                        </span>
                      </dd>
                    </div>
                  ))}
                </motion.dl>

                <motion.p
                  variants={rise}
                  className="mt-4"
                  style={{
                    fontFamily: 'var(--font-brand-sans)',
                    fontSize: '0.82rem',
                    letterSpacing: '0.06em',
                    color: ink(0.72),
                  }}
                >
                  {finishes.join('  ·  ')}
                </motion.p>

                <motion.blockquote variants={rise} className="mt-9 max-w-lg">
                  <p
                    className="italic font-light leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: '1.02rem',
                      color: ink(0.74),
                    }}
                  >
                    &ldquo;{model.artistQuote}&rdquo;
                  </p>
                  <footer className="mt-3">
                    <cite
                      className="not-italic uppercase"
                      style={{
                        fontFamily: 'var(--font-oswald)',
                        fontSize: '0.66rem',
                        letterSpacing: '0.24em',
                        color: ink(0.72),
                      }}
                    >
                      {model.artistName} — {model.artistRole}
                    </cite>
                  </footer>
                </motion.blockquote>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: carousel stage ── */}
          <div className="order-1 lg:order-2 relative min-w-0">
            <div className="relative flex justify-center items-end overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`stage-${model.slug}`}
                  custom={direction}
                  variants={stageIn}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease }}
                  className="relative"
                  style={{
                    // True relative scale: the SK-2 occupies 65% of the stage
                    // the SK-EX all of it.
                    width: `${scale * 100}%`,
                    minWidth: 'min(80vw, 300px)',
                    height: 'clamp(260px, 34vw, 480px)',
                  }}
                >
                  {(() => {
                    const currentImage = shopifyData?.imageUrl ?? null
                    if (!currentImage) return null
                    const imageProps = getOptimizedImageProps(currentImage, 'hero')
                    if (!imageProps?.src) return null
                    const { width, height, ...optimizedProps } = imageProps
                    return (
                      <Image
                        {...optimizedProps}
                        fill
                        // multiply blends the white-background shots (SK-EX) into pearl
                        className="object-contain object-bottom mix-blend-multiply"
                        priority={activeIndex === 0}
                        sizes="(min-width: 1024px) 55vw, 90vw"
                        alt={optimizedProps.alt || `Shigeru Kawai ${model.name} grand piano`}
                      />
                    )
                  })()}
                  {/* Floor shadow rides with the piano */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-[10%] bottom-0 h-5 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 50% 100% at 50% 100%, rgba(30,27,22,0.16), transparent 70%)',
                    }}
                  />
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Stage floor */}
            <div
              aria-hidden="true"
              className="w-full h-px"
              style={{ background: ink(0.18) }}
            />

      {/* Filmstrip selector — the six pianos to scale on a shared floor */}
      <LayoutGroup id="sk-filmstrip">
        <div
          role="tablist"
          aria-label="Select piano model"
          className="mt-4 hidden lg:flex items-end justify-center gap-1 overflow-x-auto sk-scroll-hide px-2"
          style={{ borderBottom: '1px solid transparent' }}
        >
          {SHIGERU_MODELS.map((m, i) => {
            const active = i === activeIndex
            const s = parseCm(m.cm) / MAX_CM
            const key = m.slug.replace(/-/g, '')
            const thumb = productData?.[key]?.imageUrl ?? null
            const thumbProps = thumb ? getOptimizedImageProps(thumb, 'thumbnail') : null
            return (
              <button
                key={m.slug}
                role="tab"
                aria-selected={active}
                onClick={() => goTo(i)}
                className="relative flex-shrink-0 flex flex-col items-center justify-end pb-4 pt-2 px-2 sm:px-3 group/tab focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kawai-black"
              >
                {thumbProps?.src && (
                  <span
                    aria-hidden="true"
                    className="relative block"
                    style={{
                      width: `${s * 7.5}rem`,
                      height: `${s * 4.6}rem`,
                    }}
                  >
                    {/* opacity lives on the img itself — an opacity wrapper would
                        isolate the blend group and the white-bg shots would show
                        their box instead of multiplying into the pearl backdrop */}
                    <Image
                      src={thumbProps.src}
                      fill
                      className="object-contain object-bottom mix-blend-multiply transition-opacity duration-300"
                      style={{ opacity: active ? 1 : 0.55 }}
                      sizes="150px"
                      alt=""
                    />
                  </span>
                )}
                <span
                  className="mt-3 leading-none uppercase transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-oswald)',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    letterSpacing: '0.1em',
                    color: active ? ink(0.95) : ink(0.72),
                  }}
                >
                  {m.name}
                </span>
                {active && (
                  <motion.span
                    layoutId="sk-active-underline"
                    aria-hidden="true"
                    className="absolute bottom-0 left-2 right-2 h-[3px]"
                    style={{ background: 'rgba(213,199,140,1)' }}
                    transition={{ duration: 0.4, ease }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </LayoutGroup>
          </div>
        </div>
      </div>

    </section>
  )
}
