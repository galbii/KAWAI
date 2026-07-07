'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE_OUT_EXPO } from '@/components/brand'

type PullQuoteProps = {
  text: string
  attribution: string
  /** 'light' = red accent on pearl/white; 'dark' = red-400 accent on black. */
  tone?: 'light' | 'dark'
}

/**
 * The page's signature element: a large, quote-forward statement in his own
 * words. This is the emotional core of a page that is deliberately short on
 * biography. On dark backgrounds the accent uses kawai-red-400 for AA contrast;
 * on light it uses kawai-red. Rises gently into view; respects reduced motion.
 */
export function PullQuote({ text, attribution, tone = 'light' }: PullQuoteProps) {
  const reduce = useReducedMotion()
  const dark = tone === 'dark'
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-70px' },
        transition: { duration: 0.85, ease: EASE_OUT_EXPO },
      }

  return (
    <motion.figure {...reveal} className="mx-auto max-w-3xl text-center">
      <span
        aria-hidden
        className={cn(
          'mx-auto mb-8 block h-px w-12',
          dark ? 'bg-kawai-red-400' : 'bg-kawai-red',
        )}
      />
      <blockquote
        className={cn(
          'font-[family-name:var(--font-brand-serif)] text-[clamp(1.6rem,4vw,2.75rem)] font-light leading-[1.18] tracking-tight',
          dark ? 'text-white' : 'text-kawai-black',
        )}
      >
        <span aria-hidden className={dark ? 'text-kawai-red-400' : 'text-kawai-red'}>
          “
        </span>
        {text}
        <span aria-hidden className={dark ? 'text-kawai-red-400' : 'text-kawai-red'}>
          ”
        </span>
      </blockquote>
      <figcaption
        className={cn(
          'mt-8 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em]',
          dark ? 'text-kawai-gold/85' : 'text-kawai-gold-on-light',
        )}
      >
        {attribution}
      </figcaption>
    </motion.figure>
  )
}
