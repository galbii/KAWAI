'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Rentals hero text, staged in the same order and timing as the homepage
 * product hero carousel: eyebrow → title → subtitle → CTA.
 */

interface RentalsHeroCopyProps {
  eyebrow: string
  title: string
  subtitle: string
  ctaText: string
  ctaHref: string
  phone: string | null
  /** Link back to the store's homepage. */
  back?: { href: string; label: string }
}

export function RentalsHeroCopy({ eyebrow, title, subtitle, ctaText, ctaHref, phone, back }: RentalsHeroCopyProps) {
  const reduceMotion = useReducedMotion()
  const enter = (y: number, delay: number) =>
    reduceMotion
      ? {}
      : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay } }

  return (
    <div className="max-w-3xl space-y-5">
      {back && (
        <motion.div {...enter(0, 0.1)}>
          <Link
            href={back.href}
            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span aria-hidden>←</span> {back.label}
          </Link>
        </motion.div>
      )}
      <motion.p
        {...enter(10, 0.2)}
        className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70"
      >
        <span className="inline-block h-px w-5 flex-shrink-0 bg-kawai-red" />
        {eyebrow}
      </motion.p>
      <motion.h1
        {...enter(22, 0.3)}
        className="text-5xl font-light leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl font-[family-name:var(--font-brand-serif)]"
      >
        {title}
      </motion.h1>
      <motion.p {...enter(14, 0.48)} className="max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
        {subtitle}
      </motion.p>
      <motion.div {...enter(10, 0.62)} className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-8">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-kawai-black transition-colors duration-300 hover:bg-kawai-red hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {ctaText}
        </a>
        {phone && (
          <a href={`tel:${phone}`} className="text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
            Or call {phone}
          </a>
        )}
      </motion.div>
    </div>
  )
}
