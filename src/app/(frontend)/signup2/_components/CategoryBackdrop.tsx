'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import type { PianoCategorySlug } from '@/lib/data/categories'
import { EASE_OUT_EXPO } from './motion'

/**
 * Full-bleed background photo per piano category. Swap any path here — it's the
 * single place the rebate showcase's backdrop is mapped. Landscape photos only;
 * everything is heavily darkened + vignetted so the floating slide reads as a
 * spotlit subject on a dark stage.
 */
const CATEGORY_BACKDROP: Record<PianoCategorySlug, string> = {
  digital: '/images/cx/hero_cx102.jpg',
  grand: '/images/signature/hero-bg.webp',
  upright: '/images/pianos/K-200_EP_styling.jpg',
  hybrid: '/images/piano-categories/hybrid.jpg',
  shigeru: '/images/signature/hero-bg.webp',
}

/** Crossfading category photo with a darkening overlay and a spotlight vignette. */
export default function CategoryBackdrop({
  slug,
  reduce,
}: {
  slug: PianoCategorySlug
  reduce: boolean
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={slug}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.4 : 0.9, ease: EASE_OUT_EXPO }}
          className="absolute inset-0"
        >
          <Image
            src={CATEGORY_BACKDROP[slug]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Keep the photo at full strength in the middle (behind the card); darken
          only the top and bottom bands where the white text sits. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/10 to-black/85" />
    </div>
  )
}
