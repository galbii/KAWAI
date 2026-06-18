'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import NumberStrike from '../NumberStrike'
import { BrandCTA, BrandEyebrow } from '../brand-ui'
import { ClaimDiscountCTA } from '../ClaimDiscountCTA'
import { CLAIM_DISCOUNT_LABEL, SCENE_WINDOWS, showroomsCopy } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

type CityProps = {
  progress: MotionValue<number>
  reduce: boolean
  city: string
  href: string
  index: number
  start: number
  span: number
}

/**
 * A single showroom city. Reveals with a quick rise + a hairline divider that
 * scales in from the left, echoing the divider motion in the Stats scene so
 * the two number-led scenes share a vocabulary.
 */
function CityLink({ progress, reduce, city, href, index, start, span }: CityProps) {
  const appearStart = start + span * (0.2 + index * 0.04)
  const opacity = useTransform(progress, [appearStart, appearStart + span * 0.1], [0, 1])
  const y = useTransform(progress, [appearStart, appearStart + span * 0.1], [14, 0])
  const dividerScale = useTransform(progress, [appearStart, appearStart + span * 0.08], [0, 1])

  return (
    <motion.div
      {...(reduce ? {} : { style: { opacity, y } })}
      className="relative px-5 text-center sm:px-7"
    >
      {index > 0 && (
        <motion.span
          aria-hidden
          {...(reduce ? {} : { style: { scaleY: dividerScale, originY: 0.5 } })}
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
  const [start, end] = SCENE_WINDOWS.showrooms
  const span = end - start

  // Front-loaded: logo, headline, cities and the dealer count all land within
  // the first half of the window, then hold. The number itself fires on enter.
  const logoOpacity = useTransform(progress, [start + span * 0.06, start + span * 0.18], [0, 1])
  const logoY = useTransform(progress, [start + span * 0.06, start + span * 0.18], [18, 0])
  const headlineOpacity = useTransform(progress, [start + span * 0.12, start + span * 0.24], [0, 1])
  const headlineY = useTransform(progress, [start + span * 0.12, start + span * 0.24], [20, 0])
  const statOpacity = useTransform(progress, [start + span * 0.4, start + span * 0.52], [0, 1])
  const statY = useTransform(progress, [start + span * 0.4, start + span * 0.52], [20, 0])

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.showrooms} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Kawai logo */}
          <motion.div {...(reduce ? {} : { style: { opacity: logoOpacity, y: logoY } })}>
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
            {...(reduce ? {} : { style: { opacity: headlineOpacity, y: headlineY } })}
            className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.04] tracking-tight text-white"
          >
            {showroomsCopy.headline}
          </motion.h2>

          {/* Cities */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-y-5">
            {showroomsCopy.showrooms.map((s, i) => (
              <CityLink
                key={s.city}
                progress={progress}
                reduce={reduce}
                city={s.city}
                href={s.href}
                index={i}
                start={start}
                span={span}
              />
            ))}
          </div>

          {/* Disclaimer */}
          <motion.p
            {...(reduce ? {} : { style: { opacity: statOpacity } })}
            className="mt-7 max-w-md font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed text-white/55"
          >
            {showroomsCopy.disclaimer}
          </motion.p>

          {/* Dealer stat */}
          <motion.div
            {...(reduce ? {} : { style: { opacity: statOpacity, y: statY } })}
            className="mt-12 flex flex-col items-center"
          >
            <div className="font-[family-name:var(--font-brand-serif)] text-6xl font-light leading-none tracking-tight text-white md:text-7xl">
              <NumberStrike
                progress={progress}
                window={[start + span * 0.4, start + span * 0.52]}
                target={showroomsCopy.dealerStat.numeric}
                suffix={showroomsCopy.dealerStat.suffix}
                reduce={reduce}
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
