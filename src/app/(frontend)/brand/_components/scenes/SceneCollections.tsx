'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandArrowLink, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS } from '../scenes'
import {
  CATEGORY_LABELS,
  collectionsCopy,
  featuredCollections,
  type BrandCollection,
} from '../featuredCollections'

type Props = { progress: MotionValue<number>; reduce: boolean }

type CardProps = {
  progress: MotionValue<number>
  reduce: boolean
  collection: BrandCollection
  start: number
  span: number
  delayOffset: number
}

/**
 * A single collection card. The image is revealed with a top-down clip wipe
 * coupled to scroll, echoing the shutter reveal used in the Go Deeper scene so
 * the two adjacent scenes share a motion vocabulary.
 */
function CollectionCard({ progress, reduce, collection, start, span, delayOffset }: CardProps) {
  const clip = useTransform(
    progress,
    [start + span * (0.22 + delayOffset), start + span * (0.5 + delayOffset)],
    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
  )
  const rule = useTransform(
    progress,
    [start + span * (0.2 + delayOffset), start + span * (0.32 + delayOffset)],
    [0, 1],
  )

  const href = `/pianos/${collection.handle}`

  return (
    <motion.article
      {...(reduce ? {} : { style: { clipPath: clip } })}
      className="group relative"
    >
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

        {/* Top accent rule wipes in as the card lands */}
        <motion.span
          aria-hidden
          {...(reduce ? {} : { style: { scaleX: rule, originX: 0 } })}
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
  const [start, end] = SCENE_WINDOWS.collections
  const span = end - start
  const cards = featuredCollections

  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.collections}
      yOffset={20}
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4">
                <BrandEyebrow>{collectionsCopy.eyebrow}</BrandEyebrow>
              </div>
              <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] font-light leading-[1.04] tracking-tight text-white">
                {collectionsCopy.headline}
              </h2>
            </div>
            <BrandArrowLink href={collectionsCopy.cta.href} className="flex-shrink-0">
              {collectionsCopy.cta.label}
            </BrandArrowLink>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            {cards.map((collection, i) => (
              <CollectionCard
                key={collection.handle}
                progress={progress}
                reduce={reduce}
                collection={collection}
                start={start}
                span={span}
                delayOffset={(i % 3) * 0.05}
              />
            ))}
          </div>
        </div>
      </div>
    </SceneLayer>
  )
}
