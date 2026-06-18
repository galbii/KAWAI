'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, type MotionValue, type Variants } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { ClaimDiscountCTA } from '../ClaimDiscountCTA'
import { useSceneActive } from '../useSceneActive'
import { GET_DISCOUNTED_PRODUCTS_LABEL, SCENE_WINDOWS, exploreProductsCta } from '../scenes'
import {
  CATEGORY_LABELS,
  collectionsCopy,
  featuredCollections,
  type BrandCollection,
} from '../featuredCollections'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

const gridV: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const cardV: Variants = {
  hide: { clipPath: 'inset(0 0 100% 0)' },
  show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

const ruleV: Variants = {
  hide: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
}

/**
 * A single collection card. Its top-down clip wipe and accent rule play on a
 * timer (via the grid's staggered variants) once the scene is active — echoing
 * the shutter reveal in the Go Deeper scene.
 */
function CollectionCard({ collection }: { collection: BrandCollection }) {
  const href = `/pianos/${collection.handle}`

  return (
    <motion.article variants={cardV} className="group relative">
      <Link
        href={href}
        className="relative block aspect-[3/2] overflow-hidden rounded-lg bg-kawai-black ring-1 ring-white/10 transition-shadow duration-500 hover:ring-kawai-red/50"
      >
        <Image
          src={collection.imageUrl}
          alt={collection.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />

        {/* Readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* Top accent rule */}
        <motion.span
          aria-hidden
          variants={ruleV}
          style={{ originX: 0 }}
          className="absolute left-0 top-0 z-10 h-px w-full bg-kawai-red"
        />

        {/* Category chip */}
        <span className="absolute left-4 top-4 z-10 inline-flex items-center bg-white/95 px-2.5 py-1 font-[family-name:var(--font-brand-sans)] text-[10px] font-bold uppercase tracking-[0.22em] text-kawai-black">
          {CATEGORY_LABELS[collection.category]}
        </span>

        {/* Title + count */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <h3 className="font-[family-name:var(--font-brand-serif)] text-2xl font-light leading-tight tracking-tight text-white transition-transform duration-500 group-hover:-translate-y-0.5">
            {collection.title}
          </h3>
          <p className="mt-1.5 font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {collection.productCount} Models
          </p>
        </div>
      </Link>
    </motion.article>
  )
}

export default function SceneCollections({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.collections)
  const state = reduce ? 'show' : active ? 'show' : 'hide'

  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.collections}
      yOffset={20}
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7">
            <div className="mb-4">
              <BrandEyebrow>{collectionsCopy.eyebrow}</BrandEyebrow>
            </div>
            <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.04] tracking-tight text-white">
              {collectionsCopy.headline}
            </h2>
          </div>

          <motion.div
            variants={gridV}
            initial={reduce ? false : 'hide'}
            animate={state}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5"
          >
            {featuredCollections.map((collection) => (
              <CollectionCard key={collection.handle} collection={collection} />
            ))}
          </motion.div>

          {/* CTAs */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <ClaimDiscountCTA variant="red">{GET_DISCOUNTED_PRODUCTS_LABEL}</ClaimDiscountCTA>
            <BrandCTA href={exploreProductsCta.href} variant="outline">
              {exploreProductsCta.label}
            </BrandCTA>
          </div>
        </div>
      </div>
    </SceneLayer>
  )
}
