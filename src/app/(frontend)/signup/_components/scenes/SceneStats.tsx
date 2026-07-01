'use client'

import { motion, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import NumberStrike from '../NumberStrike'
import { BrandCTAButton } from '../brand-ui'
import { useOfferModal } from '../OfferModalContext'
import { useSceneActive } from '../useSceneActive'
import { SCENE_WINDOWS, stats, offerCopy } from '../scenes'
import { EASE_OUT_EXPO } from '../motion'

type Props = {
  progress: MotionValue<number>
  reduce: boolean
}

type StatColumnProps = {
  active: boolean
  reduce: boolean
  index: number
  stat: (typeof stats)[number]
  isLast: boolean
}

function StatColumn({ active, reduce, index, stat, isLast }: StatColumnProps) {
  const delay = index * 0.1

  return (
    <div className={`relative px-6 text-center ${isLast ? 'col-span-2 md:col-span-1' : ''}`}>
      {index > 0 && (
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleY: 0 }}
          animate={reduce ? {} : { scaleY: active ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay }}
          style={{ originY: 0.5 }}
          className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-white/15 md:block"
        />
      )}
      <div className="font-[family-name:var(--font-brand-serif)] text-5xl font-light leading-none tracking-tight text-white md:text-6xl lg:text-7xl">
        <NumberStrike
          active={active}
          target={stat.numeric}
          suffix={stat.suffix}
          decimals={'decimals' in stat ? (stat.decimals as number) : 0}
          grouping={!('plain' in stat && stat.plain)}
          reduce={reduce}
          delay={delay}
        />
      </div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 8 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: delay + 0.15 }}
        className="mt-4 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-white/65"
      >
        {stat.label}
      </motion.div>
    </div>
  )
}

export default function SceneStats({ progress, reduce }: Props) {
  const active = useSceneActive(progress, SCENE_WINDOWS.stats)
  const offer = useOfferModal()

  // Land the CTAs just after the last stat column has struck in.
  const ctaDelay = stats.length * 0.1 + 0.2

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.stats} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center">
          <div className="grid w-full grid-cols-2 gap-y-12 md:grid-cols-5 md:gap-y-0">
            {stats.map((stat, i) => (
              <StatColumn
                key={stat.label}
                active={active}
                reduce={reduce}
                index={i}
                stat={stat}
                isLast={i === stats.length - 1}
              />
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 16 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: ctaDelay }}
            className="mt-16 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <BrandCTAButton onClick={offer.open} variant="red">
              {offerCopy.cta.stats}
            </BrandCTAButton>
          </motion.div>
        </div>
      </div>
    </SceneLayer>
  )
}
