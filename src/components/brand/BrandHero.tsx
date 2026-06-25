'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { BrandCTA, BrandEyebrow } from './brand-ui'
import { EASE_OUT_EXPO } from './motion'

type HeroCTA = {
  label: string
  href: string
  variant?: 'red' | 'white' | 'outline' | 'dark-outline'
}

type BrandHeroProps = {
  /** Full-bleed background image URL (R2 or /public path). */
  image: string
  imageAlt?: string
  eyebrow: string
  /** Headline — string or ReactNode for multi-line / styled headlines. */
  title: ReactNode
  /** Small gold line above the sub, e.g. "Founder · Inventive Genius". */
  kicker?: string
  sub?: string
  ctas?: HeroCTA[]
  align?: 'left' | 'center'
  /** Darkness of the scrim over the image, 0–1. Default 0.62. */
  overlay?: number
  /** Min viewport height. Default '78vh'. */
  minHeight?: string
}

/**
 * Cinematic page hero — full-bleed image, gradient scrim, eyebrow + serif
 * headline + optional CTAs, with a gentle load-in. The standard opening for
 * every company / heritage / recognition page, echoing the About hero.
 */
export function BrandHero({
  image,
  imageAlt = '',
  eyebrow,
  title,
  kicker,
  sub,
  ctas,
  align = 'left',
  overlay = 0.62,
  minHeight = '78vh',
}: BrandHeroProps) {
  const reduce = useReducedMotion()
  const centered = align === 'center'

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
        }

  return (
    <section
      className="relative flex items-end overflow-hidden bg-kawai-black text-white"
      style={{ minHeight }}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Scrims: directional wash + bottom vignette keep copy legible. */}
      <div
        aria-hidden
        className={
          centered
            ? 'absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35'
            : 'absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent'
        }
        style={{ opacity: overlay + 0.25 }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black to-transparent"
        style={{ opacity: overlay }}
      />

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-28 md:pb-20">
        <div
          className={
            centered
              ? 'mx-auto flex max-w-3xl flex-col items-center text-center'
              : 'max-w-3xl'
          }
        >
          <motion.div {...enter(0)} className="mb-5">
            <BrandEyebrow tone="gold" centered={centered}>
              {eyebrow}
            </BrandEyebrow>
          </motion.div>

          <motion.h1
            {...enter(0.08)}
            className="font-[family-name:var(--font-brand-serif)] text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1.02] tracking-tight text-white"
          >
            {title}
          </motion.h1>

          {kicker && (
            <motion.p
              {...enter(0.14)}
              className="mt-4 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.28em] text-kawai-gold"
            >
              {kicker}
            </motion.p>
          )}

          {sub && (
            <motion.p
              {...enter(0.2)}
              className={`mt-6 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78 sm:text-lg ${
                centered ? 'mx-auto' : ''
              }`}
            >
              {sub}
            </motion.p>
          )}

          {ctas && ctas.length > 0 && (
            <motion.div
              {...enter(0.28)}
              className={`mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 ${
                centered ? 'items-center justify-center' : ''
              }`}
            >
              {ctas.map((cta) => (
                <BrandCTA key={cta.href + cta.label} href={cta.href} variant={cta.variant ?? 'red'}>
                  {cta.label}
                </BrandCTA>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
