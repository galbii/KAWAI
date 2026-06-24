'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import SceneLayer from '../SceneLayer'
import { BrandEyebrow } from '../brand-ui'
import { SCENE_WINDOWS, timelineCopy } from '../scenes'

type Props = { progress: MotionValue<number>; reduce: boolean }

type Win = number[]

type TickProps = {
  progress: MotionValue<number>
  reduce: boolean
  year: string
  /** Visibility window [in, hold-start, hold-end, out] — shared with its event. */
  win: Win
}

/**
 * A single year marker on the horizontal rail. It is muted until its event is
 * the active one, then it brightens, reddens and grows — so the rail always
 * points at exactly one year.
 */
function TimelineTick({ progress, reduce, year, win }: TickProps) {
  const active = useTransform(progress, win, [0, 1, 1, 0])
  const scale = useTransform(active, [0, 1], [1, 1.7])
  const dotColor = useTransform(active, [0, 1], ['rgba(255,255,255,0.25)', '#E11922'])
  const labelColor = useTransform(active, [0, 1], ['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.95)'])

  return (
    <li className="flex flex-col items-center gap-2.5">
      <motion.span
        {...(reduce ? {} : { style: { scale, backgroundColor: dotColor } })}
        className="size-2.5 rounded-full bg-white/25"
      />
      <motion.span
        {...(reduce ? {} : { style: { color: labelColor } })}
        className="font-[family-name:var(--font-brand-sans)] text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 sm:text-xs sm:tracking-[0.2em]"
      >
        {year}
      </motion.span>
    </li>
  )
}

type EventProps = {
  progress: MotionValue<number>
  reduce: boolean
  event: (typeof timelineCopy.events)[number]
  win: Win
  yIn: number[]
}

/**
 * The single centered event. Every event is stacked at the same anchor, so the
 * only motion is a clean fade + gentle rise as one swaps for the next — there is
 * never more than one on screen.
 */
function TimelineEvent({ progress, reduce, event, win, yIn }: EventProps) {
  const opacity = useTransform(progress, win, [0, 1, 1, 0])
  const y = useTransform(progress, yIn, ['28px', '0px', '-28px'])

  return (
    <motion.div
      {...(reduce ? {} : { style: { opacity, y } })}
      className="absolute inset-0 flex flex-col items-center text-center"
    >
      <div className="font-[family-name:var(--font-brand-serif)] text-[clamp(3rem,7vw,5.5rem)] font-light leading-none tracking-tight text-white">
        {event.year}
      </div>
      <span aria-hidden className="my-5 block h-px w-12 bg-kawai-red" />
      <h3 className="mb-3 font-[family-name:var(--font-brand-serif)] text-xl font-light leading-tight tracking-tight text-white md:text-2xl lg:text-3xl">
        {event.title}
      </h3>
      <p className="max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/78">
        {event.description}
      </p>
    </motion.div>
  )
}

export default function SceneTimeline({ progress, reduce }: Props) {
  const [start, end] = SCENE_WINDOWS.timeline
  const span = end - start
  const events = timelineCopy.events
  const count = events.length

  // Events occupy 0.08 → 0.82 of the window (after the rail settles, before the
  // scene fade-out). Each owns a clean, non-overlapping slot.
  const F0 = 0.08
  const F1 = 0.82
  const dFrac = (F1 - F0) / count
  const halfFrac = dFrac / 2
  const fadeFrac = dFrac * 0.22
  const abs = (f: number) => start + span * f

  const slots = events.map((_, i) => {
    const cf = F0 + dFrac * (i + 0.5)
    const win: Win = [
      abs(cf - halfFrac),
      abs(cf - halfFrac + fadeFrac),
      abs(cf + halfFrac - fadeFrac),
      abs(cf + halfFrac),
    ]
    const yIn: number[] = [abs(cf - halfFrac), abs(cf), abs(cf + halfFrac)]
    return { win, yIn }
  })

  // Red progress fill that sweeps the rail as the era advances.
  const fill = useTransform(progress, [abs(F0), abs(F1)], [0, 1])

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.timeline} className="items-center">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          {/* Persistent heading */}
          <div className="text-center">
            <div className="mb-4 inline-block">
              <BrandEyebrow centered>{timelineCopy.eyebrow}</BrandEyebrow>
            </div>
            <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.04] tracking-tight text-white">
              {timelineCopy.headline}
            </h2>
          </div>

          {/* Horizontal year rail */}
          <div className="relative mt-10">
            <span aria-hidden className="absolute inset-x-0 top-[4px] h-px bg-white/15" />
            <motion.span
              aria-hidden
              {...(reduce ? {} : { style: { scaleX: fill, originX: 0 } })}
              className="absolute inset-x-0 top-[4px] h-px bg-kawai-red"
            />
            <ul className="relative flex justify-between">
              {events.map((event, i) => (
                <TimelineTick
                  key={event.year}
                  progress={progress}
                  reduce={reduce}
                  year={event.year}
                  win={slots[i]!.win}
                />
              ))}
            </ul>
          </div>

          {/* Single centered event */}
          <div className="relative mt-14 min-h-[20rem]">
            {events.map((event, i) => (
              <TimelineEvent
                key={event.year}
                progress={progress}
                reduce={reduce}
                event={event}
                win={slots[i]!.win}
                yIn={slots[i]!.yIn}
              />
            ))}
          </div>
        </div>
      </div>
    </SceneLayer>
  )
}
