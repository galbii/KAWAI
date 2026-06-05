'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import Playhead from '../Playhead'
import { BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, timelineCopy } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

type TimelineEventProps = {
  progress: MotionValue<number>
  reduce: boolean
  event: (typeof timelineCopy.events)[number]
  crossAt: number
  windowSpan: number
}

function TimelineEvent({ progress, reduce, event, crossAt, windowSpan }: TimelineEventProps) {
  const translateY = useTransform(
    progress,
    [crossAt - windowSpan * 0.25, crossAt, crossAt + windowSpan * 0.25],
    ['40vh', '0vh', '-40vh'],
  )
  const colorMix = useTransform(
    progress,
    [crossAt - 0.025, crossAt, crossAt + 0.025],
    ['rgba(255,255,255,0.4)', '#E11922', 'rgba(255,255,255,0.4)'],
  )
  const copyOpacity = useTransform(
    progress,
    [crossAt - 0.035, crossAt - 0.005, crossAt + 0.025, crossAt + 0.05],
    [0, 1, 1, 0],
  )

  return (
    <motion.li
      style={reduce ? undefined : { y: translateY }}
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6"
    >
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-5xl items-baseline gap-8 md:grid-cols-12">
          <motion.div
            style={reduce ? undefined : { color: colorMix }}
            className="col-span-3 font-[family-name:var(--font-brand-serif)] text-[clamp(3rem,7vw,5.5rem)] font-light leading-none tracking-tight"
          >
            {event.year}
          </motion.div>
          <motion.div
            style={reduce ? undefined : { opacity: copyOpacity }}
            className="col-span-9"
          >
            <h3 className="mb-3 font-[family-name:var(--font-brand-serif)] text-xl font-light leading-tight tracking-tight text-white md:text-2xl lg:text-3xl">
              {event.title}
            </h3>
            <p className="max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78">
              {event.description}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.li>
  )
}

export default function SceneTimeline({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.timeline
  const span = end - start
  const eventCount = timelineCopy.events.length
  const crossings = timelineCopy.events.map(
    (_, i) => start + span * (0.22 + (0.66 * i) / (eventCount - 1)),
  )

  const headingOpacity = useTransform(
    progress,
    [start + 0.005, start + 0.04, crossings[0]! - 0.02, crossings[0]!],
    [0, 1, 1, 0],
  )

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.timeline} className="items-stretch">
      <div className="relative w-full">
        <Playhead progress={progress} window={SCENE_WINDOWS.timeline} />

        <motion.div
          style={reduce ? undefined : { opacity: headingOpacity }}
          className="absolute inset-x-0 top-[22vh] z-20 text-center"
        >
          <div className="mb-4 inline-block">
            <BrandEyebrow centered>{timelineCopy.eyebrow}</BrandEyebrow>
          </div>
          <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.04] tracking-tight text-white">
            {timelineCopy.headline}
          </h2>
        </motion.div>

        <ol className="absolute inset-0">
          {timelineCopy.events.map((event, i) => (
            <TimelineEvent
              key={event.year}
              progress={progress}
              reduce={reduce}
              event={event}
              crossAt={crossings[i]!}
              windowSpan={span}
            />
          ))}
        </ol>
      </div>
    </SceneLayer>
  )
}
