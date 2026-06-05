'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandArrowLink, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, technologyCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

export default function SceneTechnology({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.technology
  const span = end - start
  const headlineY = useTransform(progress, [start, start + span * 0.25], ['18px', '0px'])

  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.technology}
      yOffset={16}
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5">
            <BrandEyebrow>{technologyCopy.eyebrow}</BrandEyebrow>
          </div>

          <motion.h2
            style={reduce ? undefined : { y: headlineY }}
            transition={{ ease: EASE_OUT_EXPO }}
            className="mb-7 font-[family-name:var(--font-brand-serif)] text-[clamp(2.5rem,5.5vw,4.25rem)] font-light leading-[1.04] tracking-tight text-white"
          >
            {technologyCopy.headline}
          </motion.h2>

          <p className="mb-9 max-w-2xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78 sm:text-lg">
            {technologyCopy.body}
          </p>

          <BrandArrowLink href={technologyCopy.link.href}>
            {technologyCopy.link.label}
          </BrandArrowLink>
        </div>
      </div>
    </SceneLayer>
  )
}
