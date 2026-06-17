'use client'

import Image from 'next/image'
import { motion, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, heroCopy } from '../scenes'
import { aboutImages } from '../images'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

export default function SceneHero({ progress, reduce }: Props) {
  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.hero}
      startVisible
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="sr-only">Kawai — Crafting Inspiration Since 1927</h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.05 }}
            className="mb-7"
          >
            <BrandEyebrow>{heroCopy.eyebrow}</BrandEyebrow>
          </motion.div>

          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="relative mb-9 h-[clamp(5.5rem,15vw,11rem)] w-full max-w-[640px]"
          >
            <Image
              src={aboutImages.wordmark}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 80vw, 640px"
              className="object-contain object-left drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.55 }}
            className="mb-10 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78 sm:text-lg"
          >
            {heroCopy.sub}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.7 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <BrandCTA href={heroCopy.primaryCta.href} variant="red">
              {heroCopy.primaryCta.label}
            </BrandCTA>
            <BrandCTA href={heroCopy.secondaryCta.href} variant="outline">
              {heroCopy.secondaryCta.label}
            </BrandCTA>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
