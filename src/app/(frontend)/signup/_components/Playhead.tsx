'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'

type Props = {
  progress: MotionValue<number>
  /** Master-scroll window over which the playhead is on stage. */
  window: readonly [number, number]
}

/**
 * A horizontal red playhead pinned at the optical center of the viewport
 * during the timeline scene. Years scroll up through it; this stays put.
 */
export default function Playhead({ progress, window: w }: Props) {
  const [start, end] = w
  const fade = (end - start) * 0.08
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
  )

  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute left-0 right-0 top-1/2 z-30 -translate-y-1/2"
    >
      <div className="relative h-px w-full bg-kawai-red/80">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.3em] text-kawai-red">
          Now playing
        </span>
        <span className="absolute right-6 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-kawai-red shadow-[0_0_12px_2px_rgba(225,25,34,0.6)]" />
      </div>
    </motion.div>
  )
}
