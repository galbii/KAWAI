'use client'

import Image from 'next/image'
import { motion, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import NumberStrike from '../NumberStrike'
import { BrandCTA, BrandCTAButton, BrandEyebrow } from '../brand-ui'
import { useOfferModal } from '../OfferModalContext'
import { useSceneActive } from '../useSceneActive'
import { SCENE_WINDOWS, showroomsCopy, offerCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

export default function SceneShowrooms({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.showrooms)
  const offer = useOfferModal()

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.showrooms} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Kawai logo */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 18 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          >
            <Image
              src="/images/logos/kawai-logo-new-red.png"
              alt="Kawai"
              width={188}
              height={38}
              className="h-8 w-auto md:h-9"
            />
          </motion.div>

          <div className="mt-6">
            <BrandEyebrow centered>{showroomsCopy.eyebrow}</BrandEyebrow>
          </div>

          {/* Headline */}
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 20 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.04] tracking-tight text-white"
          >
            {showroomsCopy.headline}
          </motion.h2>

          {/* Body */}
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.3 }}
            className="mt-7 max-w-md font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/70"
          >
            {showroomsCopy.body}
          </motion.p>

          {/* Dealer stat */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 20 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.4 }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="font-[family-name:var(--font-brand-serif)] text-6xl font-light leading-none tracking-tight text-white md:text-7xl">
              <NumberStrike
                active={active}
                target={showroomsCopy.dealerStat.numeric}
                suffix={showroomsCopy.dealerStat.suffix}
                reduce={reduce}
                delay={0.5}
              />
            </div>
            <div className="mt-4 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
              {showroomsCopy.dealerStat.label}
            </div>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <BrandCTAButton onClick={offer.open} variant="red">
                {offerCopy.cta.showrooms}
              </BrandCTAButton>
              <BrandCTA href={showroomsCopy.secondaryCta.href} variant="outline" showArrow={false}>
                {showroomsCopy.secondaryCta.label}
              </BrandCTA>
            </div>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
