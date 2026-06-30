'use client'

import Image from 'next/image'
import { motion, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTAButton, BrandEyebrow } from '../brand-ui'
import { useOfferModal } from '../OfferModalContext'
import { SCENE_WINDOWS, heroCopy, offerCopy } from '../scenes'
import { aboutImages } from '../images'
import { EASE_OUT_EXPO } from '../motion'
import { OfferSignupForm } from '../OfferSignupForm'

type Props = { progress: MotionValue<number>; reduce: boolean }

export default function SceneHero({ progress, reduce }: Props) {
  const offer = useOfferModal()
  return (
    <SceneLayer
      progress={progress}
      window={SCENE_WINDOWS.hero}
      startVisible
      className="items-center"
    >
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left column — brand storytelling */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
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
              className="relative mb-4 h-[clamp(4.5rem,11vw,8.5rem)] w-full max-w-[520px]"
            >
              <Image
                src={aboutImages.wordmark}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 80vw, 520px"
                className="object-contain object-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] lg:object-left"
              />
            </motion.div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.4 }}
              className="mb-7 font-[family-name:var(--font-brand-sans)] text-sm font-semibold uppercase tracking-[0.32em] text-white/70"
            >
              {heroCopy.sinceLabel}
            </motion.p>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.55 }}
              className="mb-8 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78 sm:text-lg"
            >
              {heroCopy.sub}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.7 }}
            >
              <BrandCTAButton onClick={offer.open} variant="red">
                {offerCopy.cta.hero}
              </BrandCTAButton>
            </motion.div>
          </div>

          {/* Right column — the sign-up card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="mx-auto w-full max-w-md rounded-2xl bg-kawai-pearl p-6 text-kawai-black shadow-[0_24px_70px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:p-8"
          >
            <OfferSignupForm />
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
