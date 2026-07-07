'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/components/brand'

type PortraitPlaceholderProps = {
  /** Name shown on the placeholder until official photography is delivered. */
  label: string
  /** Quiet secondary note under the label. */
  note?: string
}

/**
 * Portrait slot for Kentaro Kawai. No published portrait exists, so this renders
 * a deliberately quiet, branded placeholder carrying his name — it never passes
 * a brand/atmosphere image off as his likeness. When Kawai supplies an official
 * portrait, replace this with an <Image>; the Person JSON-LD stays image-free
 * until then. Gentle fade-in; respects reduced motion.
 */
export function PortraitPlaceholder({ label, note }: PortraitPlaceholderProps) {
  const reduce = useReducedMotion()
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.9, ease: EASE_OUT_EXPO },
      }

  return (
    <motion.div
      {...reveal}
      className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-kawai-black/10 bg-gradient-to-br from-white to-kawai-neutral/40"
    >
      <span aria-hidden className="absolute left-6 top-6 h-px w-10 bg-kawai-red" />
      <div className="px-6 text-center">
        <span className="font-[family-name:var(--font-brand-serif)] text-2xl font-light tracking-wide text-kawai-charcoal/50">
          {label}
        </span>
        {note && (
          <span className="mt-3 block font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-kawai-charcoal/35">
            {note}
          </span>
        )}
      </div>
    </motion.div>
  )
}
