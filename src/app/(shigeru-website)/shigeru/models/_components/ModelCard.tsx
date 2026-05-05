'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { ShigeruModel } from '../../_data/models'

const ease = [0.25, 0.46, 0.45, 0.94] as const

interface Props {
  model: ShigeruModel
  index: number
  imageUrl?: string | null
  shopifyFinishes?: string[] | null
}

export function ModelCard({ model, index, imageUrl, shopifyFinishes }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const isEven = index % 2 === 0
  const isLast = model.slug === 'sk-ex'

  // Prefer Shopify finishes (live data) over static fallback
  const finishes = shopifyFinishes?.length ? shopifyFinishes : model.finishes

  function text(delay: number) {
    return {
      initial: { opacity: 0, y: 22 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
      transition: { duration: 0.85, ease, delay },
    }
  }

  return (
    <article
      id={`model-${model.slug}`}
      ref={ref}
      className="relative border-t border-kawai-black/[0.07] overflow-hidden"
    >
      {/* SK-EX ambient gold glow */}
      {isLast && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(213,199,140,0.065) 0%, transparent 70%)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-16 min-h-screen flex flex-col justify-center py-28 lg:py-0">
        <div
          className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-14 lg:gap-20 xl:gap-32`}
        >
          {/* ── IMAGE PANEL ─────────────────────────────────────── */}
          <motion.div
            className="w-full lg:w-[52%] flex-shrink-0"
            initial={{ opacity: 0, x: isEven ? -55 : 55, scale: 0.96 }}
            animate={
              isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: isEven ? -55 : 55, scale: 0.96 }
            }
            transition={{ duration: 1.15, ease }}
          >
            <div
              className="relative w-full aspect-[4/3] flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(ellipse 80% 70% at 50% 58%, rgba(213,199,140,0.05) 0%, transparent 68%)',
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={model.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  priority={index === 0}
                />
              ) : (
                <>
                  <span
                    className="select-none font-light italic leading-none"
                    style={{
                      fontFamily: 'var(--font-brand-luxury)',
                      fontSize: 'clamp(4.5rem, 16vw, 13rem)',
                      color: `rgba(0,0,0,${isLast ? 0.055 : 0.038})`,
                    }}
                    aria-hidden="true"
                  >
                    {model.name}
                  </span>
                  <span className="absolute inset-6 lg:inset-10 border border-dashed border-kawai-black/[0.08]" />
                </>
              )}
            </div>
          </motion.div>

          {/* ── TEXT PANEL ──────────────────────────────────────── */}
          <div className="w-full lg:w-[44%]">
            {/* Counter */}
            <motion.p
              className="text-kawai-charcoal/[0.25] text-[11px] tracking-[0.45em] uppercase mb-8"
              style={{ fontFamily: 'var(--font-oswald)' }}
              {...text(0.05)}
            >
              0{index + 1}&ensp;/&ensp;06
            </motion.p>

            {/* Model name — clip reveal from bottom */}
            <div className="overflow-hidden mb-6">
              <motion.h2
                className="text-kawai-black font-extrabold leading-[0.88] uppercase"
                style={{
                  fontFamily: 'var(--font-oswald)',
                  fontSize: 'clamp(4rem, 9vw, 8rem)',
                  letterSpacing: '0.04em',
                }}
                initial={{ y: '105%', opacity: 0.2 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: '105%', opacity: 0.2 }}
                transition={{ duration: 1, ease, delay: 0.18 }}
              >
                {model.name}
              </motion.h2>
            </div>

            {/* Type + animated rule */}
            <motion.div
              className="flex items-center gap-3.5 mb-8"
              {...text(0.32)}
            >
              <motion.span
                className="block h-px bg-kawai-gold/50 flex-shrink-0"
                initial={{ width: 0 }}
                animate={isInView ? { width: '1.5rem' } : { width: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.38 }}
              />
              <p
                className="text-kawai-gold text-[11px] tracking-[0.4em] uppercase"
                style={{ fontFamily: 'var(--font-oswald)' }}
              >
                {model.type}
              </p>
            </motion.div>

            {/* Dimensions */}
            <motion.p
              className="text-kawai-charcoal/45 text-sm tracking-widest mb-6"
              style={{ fontFamily: 'var(--font-oswald)' }}
              {...text(0.4)}
            >
              {model.feet}&ensp;·&ensp;{model.cm}
              {isLast && (
                <span className="ml-3 text-kawai-gold/45">·&ensp;Fewer than 20 per year</span>
              )}
            </motion.p>

            {/* Tagline */}
            <motion.p
              className="text-kawai-charcoal/75 font-light italic leading-snug mb-10"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
              }}
              {...text(0.48)}
            >
              {model.tagline}
            </motion.p>

            {/* Selling points — stagger */}
            <motion.ul
              className="flex flex-col gap-4 mb-10"
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.58 } },
              }}
            >
              {model.sellingPoints.slice(0, 2).map((pt) => (
                <motion.li
                  key={pt}
                  className="flex items-start gap-3.5"
                  variants={{
                    hidden: { opacity: 0, x: -14 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.6, ease },
                    },
                  }}
                >
                  <span className="mt-[9px] flex-shrink-0 w-1 h-1 rounded-full bg-kawai-gold/50" />
                  <span
                    className="text-kawai-charcoal/60 text-base leading-snug"
                    style={{ fontFamily: 'var(--font-brand-sans)' }}
                  >
                    {pt}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Finish pills */}
            {finishes.length > 1 && (
              <motion.div className="flex flex-wrap gap-2.5 mb-10" {...text(0.72)}>
                {finishes.map((f) => (
                  <span
                    key={f}
                    className="border border-kawai-black/[0.1] text-kawai-charcoal/50 text-[10px] tracking-[0.28em] uppercase px-4 py-1.5"
                    style={{ fontFamily: 'var(--font-oswald)' }}
                  >
                    {f}
                  </span>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div {...text(0.8)}>
              <Link
                href={`/shigeru/models/${model.slug}`}
                className="group/cta inline-flex items-center gap-3 border-2 border-kawai-gold/50 hover:border-kawai-gold text-kawai-gold hover:bg-kawai-gold/[0.08] px-10 py-5 transition-all duration-300"
                style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.92rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}
              >
                Explore {model.name}
                <span
                  className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  )
}
