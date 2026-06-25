'use client'

import Image from 'next/image'
import { motion, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, heroCopy, offerCopy, signupFormSrc } from '../scenes'
import { aboutImages } from '../images'
import { EASE_OUT_EXPO } from '../motion'
import { TwoStepHubSpotForm } from '@/components/forms/TwoStepHubSpotForm'

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
              <BrandCTA href={heroCopy.secondaryCta.href} variant="outline" showArrow={false}>
                {heroCopy.secondaryCta.label}
              </BrandCTA>
            </motion.div>
          </div>

          {/* Right column — the sign-up card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="mx-auto w-full max-w-md rounded-2xl bg-kawai-pearl p-6 text-kawai-black shadow-[0_24px_70px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:p-8"
          >
            <BrandEyebrow className="text-kawai-red/80">{offerCopy.eyebrow}</BrandEyebrow>
            <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.1] tracking-tight text-kawai-black">
              {offerCopy.headline}
            </h2>
            <p className="mt-3 mb-6 text-sm leading-relaxed text-kawai-charcoal">{offerCopy.body}</p>

            <TwoStepHubSpotForm formSrc={signupFormSrc} submitLabel={offerCopy.submitLabel} />

            <p className="pt-4 text-center text-[11px] leading-relaxed text-kawai-charcoal/60">
              By signing up you agree to be contacted by your local Authorized Kawai dealer.
            </p>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
