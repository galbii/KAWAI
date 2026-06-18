'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import NumberStrike from '../NumberStrike'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { ClaimDiscountCTA } from '../ClaimDiscountCTA'
import { useSceneActive } from '../useSceneActive'
import { CLAIM_DISCOUNT_LABEL, SCENE_WINDOWS, showroomsCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = { progress: MotionValue<number>; reduce: boolean }

type CityProps = {
  active: boolean
  reduce: boolean
  city: string
  href: string
  index: number
}

/**
 * A single showroom city. Rises and fades in on a timer once the scene is
 * active, with a hairline divider scaling in from center — so it always
 * completes regardless of scroll.
 */
function CityLink({ active, reduce, city, href, index }: CityProps) {
  const delay = 0.2 + index * 0.08

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 14 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay }}
      className="relative px-5 text-center sm:px-7"
    >
      {index > 0 && (
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleY: 0 }}
          animate={reduce ? {} : { scaleY: active ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay }}
          style={{ originY: 0.5 }}
          className="absolute left-0 top-1/2 hidden h-9 w-px -translate-y-1/2 bg-white/15 sm:block"
        />
      )}
      <Link
        href={href}
        className="group inline-flex flex-col items-center gap-1.5 font-[family-name:var(--font-brand-serif)] text-2xl font-light tracking-tight text-white transition-colors duration-200 hover:text-kawai-red sm:text-3xl"
      >
        {city}
        <span
          aria-hidden
          className="block h-px w-6 origin-center scale-x-0 bg-kawai-red transition-transform duration-300 group-hover:scale-x-100"
        />
      </Link>
    </motion.div>
  )
}

export default function SceneShowrooms({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.showrooms)

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

          {/* Cities */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-y-5">
            {showroomsCopy.showrooms.map((s, i) => (
              <CityLink
                key={s.city}
                active={active}
                reduce={reduce}
                city={s.city}
                href={s.href}
                index={i}
              />
            ))}
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.4 }}
            className="mt-7 max-w-md font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed text-white/55"
          >
            {showroomsCopy.disclaimer}
          </motion.p>

          {/* Dealer stat */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 20 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.45 }}
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
              <ClaimDiscountCTA variant="red">{CLAIM_DISCOUNT_LABEL}</ClaimDiscountCTA>
              <BrandCTA href={showroomsCopy.secondaryCta.href} variant="outline">
                {showroomsCopy.secondaryCta.label}
              </BrandCTA>
            </div>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
