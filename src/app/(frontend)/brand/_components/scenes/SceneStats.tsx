'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import NumberStrike from '../NumberStrike'
import { SCENE_WINDOWS, stats } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

type StatColumnProps = {
  progress: MotionValue<number>
  reduce: boolean
  index: number
  tickStart: number
  tickEnd: number
  dividerStart: number
  stat: (typeof stats)[number]
  isLast: boolean
}

function StatColumn({
  progress,
  reduce,
  index,
  tickStart,
  tickEnd,
  dividerStart,
  stat,
  isLast,
}: StatColumnProps) {
  const dividerScale = useTransform(progress, [dividerStart, dividerStart + 0.025], [0, 1])
  const labelOpacity = useTransform(progress, [tickStart + 0.01, tickEnd], [0, 1])

  return (
    <div
      className={`relative px-6 text-center ${isLast ? 'col-span-2 md:col-span-1' : ''}`}
    >
      {index > 0 && (
        <motion.span
          aria-hidden
          {...(reduce ? {} : { style: { scaleY: dividerScale, originY: 0.5 } })}
          className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-white/15 md:block"
        />
      )}
      <div className="font-[family-name:var(--font-brand-serif)] text-5xl font-light leading-none tracking-tight text-white md:text-6xl lg:text-7xl">
        <NumberStrike
          progress={progress}
          window={[tickStart, tickEnd]}
          target={stat.numeric}
          suffix={stat.suffix}
          decimals={'decimals' in stat ? (stat.decimals as number) : 0}
          reduce={reduce}
        />
      </div>
      <motion.div
        {...(reduce ? {} : { style: { opacity: labelOpacity } })}
        className="mt-4 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-white/65"
      >
        {stat.label}
      </motion.div>
    </div>
  )
}

export default function SceneStats({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.stats
  const span = end - start

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.stats} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 md:grid-cols-5 md:gap-y-0">
          {stats.map((stat, i) => {
            const tickStart = start + span * (0.2 + i * 0.08)
            const tickEnd = tickStart + span * 0.28
            const dividerStart = start + span * (0.25 + i * 0.07)
            return (
              <StatColumn
                key={stat.label}
                progress={progress}
                reduce={reduce}
                index={i}
                stat={stat}
                tickStart={tickStart}
                tickEnd={tickEnd}
                dividerStart={dividerStart}
                isLast={i === stats.length - 1}
              />
            )
          })}
        </div>
      </div>
    </SceneLayer>
  )
}
