'use client'

import { motion, type MotionValue, type Variants } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { useSceneActive } from '../useSceneActive'
import { SCENE_WINDOWS, goDeeperCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

const gridV: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const cardV: Variants = {
  hide: { clipPath: 'inset(0 0 100% 0)' },
  show: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
}

const shutterV: Variants = {
  hide: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
}

function Card({ card }: { card: (typeof goDeeperCopy.cards)[number] }) {
  return (
    <motion.article
      variants={cardV}
      className="group relative h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-9 backdrop-blur-sm transition-colors duration-300 hover:border-kawai-red/60"
    >
      <motion.span
        aria-hidden
        variants={shutterV}
        style={{ originX: 0 }}
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
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {card.links.map((link) => (
          <BrandCTA key={link.href} href={link.href} variant={link.primary ? 'red' : 'outline'}>
            {link.label}
          </BrandCTA>
        ))}
      </div>
    </motion.article>
  )
}

export default function SceneGoDeeper({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.goDeeper)
  const state = reduce ? 'show' : active ? 'show' : 'hide'

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

          <motion.div
            variants={gridV}
            initial={reduce ? false : 'hide'}
            animate={state}
            className="grid gap-6 md:grid-cols-2"
          >
            {goDeeperCopy.cards.map((card) => (
              <Card key={card.title} card={card} />
            ))}
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
