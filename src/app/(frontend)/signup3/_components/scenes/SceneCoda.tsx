'use client'

import { motion, type MotionValue, type Variants } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTAButton, BrandEyebrow } from '../brand-ui'
import { useOfferModal } from '../OfferModalContext'
import { useSceneActive } from '../useSceneActive'
import { SCENE_WINDOWS, codaCopy, offerCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

const headlineV: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const wordRise: Variants = {
  hide: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
}

export default function SceneCoda({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.coda)
  const offer = useOfferModal()
  const words = codaCopy.headline.split(' ')
  const state = reduce ? 'show' : active ? 'show' : 'hide'

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.coda} endVisible className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-block">
            <BrandEyebrow centered>{codaCopy.eyebrow}</BrandEyebrow>
          </div>

          <motion.h2
            variants={headlineV}
            initial={reduce ? false : 'hide'}
            animate={state}
            className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.04] tracking-tight text-white"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <motion.span variants={wordRise} className="inline-block pr-[0.25em]">
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 }}
            className="mx-auto mb-10 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78 sm:text-lg"
          >
            {codaCopy.body}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 8 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.55 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <BrandCTAButton onClick={offer.open} variant="red">
              {offerCopy.cta.coda}
            </BrandCTAButton>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
