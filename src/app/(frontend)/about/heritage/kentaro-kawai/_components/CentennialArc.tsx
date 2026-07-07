'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/components/brand'

/**
 * Bespoke signature visual for this page: the 1927 → 2027 centennial line, with
 * a marker at 2024 (where the fourth president took the helm). It frames the
 * whole page's argument — he leads in the final stretch toward a hundred years.
 * The fill animates in on view; on reduced motion it renders fully drawn.
 *
 * 2024 sits 97/100 of the way from 1927 to 2027, so the "here" marker is placed
 * at 97% of the track.
 */
const HERE_PERCENT = 97

export function CentennialArc() {
  const reduce = useReducedMotion()

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-end justify-between font-[family-name:var(--font-brand-serif)] font-light leading-none text-kawai-black">
        <span className="text-3xl md:text-4xl">1927</span>
        <span className="text-5xl text-kawai-red md:text-7xl">2027</span>
      </div>

      <div className="relative mt-5 h-px w-full bg-kawai-black/15">
        {/* Animated fill from the founding year to today */}
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 block bg-kawai-red/70"
          initial={reduce ? false : { width: 0 }}
          whileInView={{ width: `${HERE_PERCENT}%` }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
        />
        {/* "You are here" marker at 2024 */}
        <span
          className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${HERE_PERCENT}%` }}
        >
          <span aria-hidden className="h-3 w-3 rounded-full bg-kawai-red ring-4 ring-kawai-red/15" />
        </span>
      </div>

      <div className="mt-4 flex justify-between font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.22em] text-kawai-charcoal/55">
        <span>Founded</span>
        <span className="text-kawai-red">2024 · The fourth president</span>
      </div>
    </div>
  )
}
