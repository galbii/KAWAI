'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandArrowLink, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, goDeeperCopy } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

type CardProps = {
  progress: MotionValue<number>
  reduce: boolean
  card: (typeof goDeeperCopy.cards)[number]
  start: number
  span: number
  delayOffset: number
}

function Card({ progress, reduce, card, start, span, delayOffset }: CardProps) {
  const shutter = useTransform(
    progress,
    [start + span * (0.25 + delayOffset), start + span * (0.35 + delayOffset)],
    [0, 1],
  )
  const clip = useTransform(
    progress,
    [start + span * (0.3 + delayOffset), start + span * (0.55 + delayOffset)],
    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
  )

  return (
    <motion.article
      {...(reduce ? {} : { style: { clipPath: clip } })}
      className="group relative h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-9 backdrop-blur-sm transition-colors duration-300 hover:border-kawai-red/60"
    >
      <motion.span
        aria-hidden
        {...(reduce ? {} : { style: { scaleX: shutter, originX: 0 } })}
        className="absolute left-0 top-0 h-px w-full bg-kawai-red"
      />
      <span
        aria-hidden
        className="absolute right-7 top-7 font-[family-name:var(--font-brand-serif)] text-sm font-light text-white/35"
      >
        {card.index}
      </span>
      <h3 className="mb-3 font-[family-name:var(--font-brand-serif)] text-2xl font-light leading-tight tracking-tight text-white">
        {card.title}
      </h3>
      <p className="mb-7 max-w-sm font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed text-white/70">
        {card.body}
      </p>
      <div className="flex flex-col gap-3">
        {card.links.map((link) => (
          <BrandArrowLink
            key={link.href}
            href={link.href}
            tone={link.primary ? 'light' : 'muted'}
          >
            {link.label}
          </BrandArrowLink>
        ))}
      </div>
    </motion.article>
  )
}

export default function SceneGoDeeper({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.goDeeper
  const span = end - start

  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.goDeeper}
      yOffset={20}
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4">
            <BrandEyebrow>{goDeeperCopy.eyebrow}</BrandEyebrow>
          </div>
          <h2 className="mb-12 font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.04] tracking-tight text-white">
            {goDeeperCopy.headline}
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {goDeeperCopy.cards.map((card, i) => (
              <Card
                key={card.title}
                progress={progress}
                reduce={reduce}
                card={card}
                start={start}
                span={span}
                delayOffset={i * 0.08}
              />
            ))}
          </div>
        </div>
      </div>
    </SceneLayer>
  )
}
