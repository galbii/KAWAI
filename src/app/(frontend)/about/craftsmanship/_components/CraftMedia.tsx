'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/components/brand'

type CraftMediaProps = {
  image?: string | undefined
  imageAlt?: string | undefined
  /** Quiet label shown on the placeholder until a real image is supplied. */
  label: string
  priority?: boolean
  /** Aspect-ratio utility. Default 'aspect-[16/10]'. */
  aspectClass?: string
}

/**
 * Image-first media block for the craftsmanship page. Renders a supplied image,
 * or — until photography is delivered — a quiet branded placeholder carrying the
 * subject's name. Fades and settles gently on entering view; respects reduced
 * motion. Photography carries the page, so this stays deliberately understated.
 */
export function CraftMedia({
  image,
  imageAlt,
  label,
  priority = false,
  aspectClass = 'aspect-[16/10]',
}: CraftMediaProps) {
  const reduce = useReducedMotion()
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 1.03, y: 18 },
        whileInView: { opacity: 1, scale: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.95, ease: EASE_OUT_EXPO },
      }

  return (
    <motion.div {...reveal} className="overflow-hidden rounded-2xl bg-kawai-neutral/25">
      {image ? (
        <div className={`relative ${aspectClass}`}>
          <Image
            src={image}
            alt={imageAlt ?? ''}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover object-center"
          />
        </div>
      ) : (
        <div
          className={`relative flex ${aspectClass} items-center justify-center bg-gradient-to-br from-kawai-pearl to-kawai-neutral/50`}
        >
          <span className="font-[family-name:var(--font-brand-serif)] text-lg font-light tracking-wide text-kawai-charcoal/40">
            {label}
          </span>
        </div>
      )}
    </motion.div>
  )
}
