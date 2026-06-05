'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, codaCopy } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

type WordProps = {
  progress: MotionValue<number>
  reduce: boolean
  word: string
  riseStart: number
  riseEnd: number
}

function HeadlineWord({ progress, reduce, word, riseStart, riseEnd }: WordProps) {
  const y = useTransform(progress, [riseStart, riseEnd], ['110%', '0%'])
  return (
    <span className="inline-block overflow-hidden pb-[0.06em]">
      <motion.span style={reduce ? undefined : { y }} className="inline-block pr-[0.25em]">
        {word}
      </motion.span>
    </span>
  )
}

export default function SceneCoda({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.coda
  const span = end - start
  const bodyOpacity = useTransform(progress, [start, start + span * 0.35], [0, 1])
  const ctaOpacity = useTransform(progress, [start + span * 0.25, start + span * 0.6], [0, 1])

  const words = codaCopy.headline.split(' ')

  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.coda}
      endVisible
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-block">
            <BrandEyebrow centered>{codaCopy.eyebrow}</BrandEyebrow>
          </div>

          <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.04] tracking-tight text-white">
            {words.map((word, i) => {
              const riseStart = start + span * (0.05 + i * 0.05)
              const riseEnd = riseStart + span * 0.25
              return (
                <HeadlineWord
                  key={i}
                  progress={progress}
                  reduce={reduce}
                  word={word}
                  riseStart={riseStart}
                  riseEnd={riseEnd}
                />
              )
            })}
          </h2>

          <motion.p
            style={reduce ? undefined : { opacity: bodyOpacity }}
            className="mx-auto mb-10 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78 sm:text-lg"
          >
            {codaCopy.body}
          </motion.p>

          <motion.div
            style={reduce ? undefined : { opacity: ctaOpacity }}
            className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <BrandCTA href={codaCopy.primaryCta.href} variant="red">
              {codaCopy.primaryCta.label}
            </BrandCTA>
            <BrandCTA href={codaCopy.secondaryCta.href} variant="outline">
              {codaCopy.secondaryCta.label}
            </BrandCTA>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
