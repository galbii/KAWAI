'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/components/brand'

type Step = { year: string; label: string }

type AscentPathProps = {
  steps: readonly Step[]
}

/**
 * Compact chronology of Kentaro Kawai's rise inside Kawai — a vertical rail of
 * dated steps, not a prose biography. The final step (the presidency) is
 * emphasised in red. Each row rises in on scroll with a small stagger; reduced
 * motion renders it static.
 */
export function AscentPath({ steps }: AscentPathProps) {
  const reduce = useReducedMotion()

  return (
    <ol className="relative mx-auto max-w-2xl border-l border-kawai-black/12 pl-8">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const reveal = reduce
          ? {}
          : {
              initial: { opacity: 0, x: -12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true, margin: '-40px' },
              transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: i * 0.06 },
            }

        return (
          <motion.li key={step.year} {...reveal} className="relative pb-9 last:pb-0">
            <span
              aria-hidden
              className={`absolute -left-[2.35rem] top-1.5 h-2.5 w-2.5 rounded-full ${
                isLast ? 'bg-kawai-red ring-4 ring-kawai-red/15' : 'bg-kawai-charcoal/40'
              }`}
            />
            <div
              className={`font-[family-name:var(--font-brand-serif)] text-2xl font-light leading-none md:text-3xl ${
                isLast ? 'text-kawai-red' : 'text-kawai-black'
              }`}
            >
              {step.year}
            </div>
            <p className="mt-2 font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-kawai-charcoal">
              {step.label}
            </p>
          </motion.li>
        )
      })}
    </ol>
  )
}
