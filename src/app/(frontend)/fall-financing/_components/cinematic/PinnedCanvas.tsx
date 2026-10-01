'use client'

import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { SCENE_WINDOWS } from './primitives'

/**
 * The pinned cinema canvas. Three photographs cross-fade across the scroll,
 * each holding the stage for one scene, under scrims that breathe with the
 * camera so the copy keeps its contrast without flattening the picture.
 *
 * The art is /signup2's, unchanged — the same three frames its outro runs.
 * What changed is the grade: the global dim is Ink rather than pure black and
 * carries a Walnut wash over it, so the photography sits in the campaign's
 * warm range instead of the cool neutral the about-scroll uses. Ivory copy on
 * an Ink-and-Walnut scrim is the same relationship the rest of the page has,
 * two sections up.
 */

const R2 = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media'

export const sceneImages = {
  /** Showrooms — a player at the instrument, the human frame. */
  warmPianist: `${R2}/250829_0028.webp`,
  /** Stats — the soundboard, the instrument as object. */
  soundboard: `${R2}/1024-685-max.jpg`,
  /** Coda — an interior to want, the room the piano ends up in. */
  luxeRoom: `${R2}/MS130_RGB_image_04.webp`,
} as const

const MID = {
  showrooms: (SCENE_WINDOWS.showrooms[0] + SCENE_WINDOWS.showrooms[1]) / 2,
  stats: (SCENE_WINDOWS.stats[0] + SCENE_WINDOWS.stats[1]) / 2,
  coda: (SCENE_WINDOWS.coda[0] + SCENE_WINDOWS.coda[1]) / 2,
}

export default function PinnedCanvas({
  progress,
  reduce,
}: {
  progress: MotionValue<number>
  reduce: boolean
}) {
  // — Camera: each frame gets a slow continuous push while it holds —
  const warmScale = useTransform(progress, [0, SCENE_WINDOWS.showrooms[1]], [1.05, 1.12])
  const warmX = useTransform(progress, [0, SCENE_WINDOWS.showrooms[1]], ['0%', '-3%'])

  const sbScale = useTransform(progress, [MID.showrooms, MID.stats, MID.coda], [1.05, 1.2, 1.3])
  const sbX = useTransform(progress, [MID.showrooms, MID.stats, MID.coda], ['0%', '5%', '3%'])
  const sbY = useTransform(progress, [MID.showrooms, MID.stats, MID.coda], ['0%', '-3%', '-1%'])

  const luxeScale = useTransform(progress, [SCENE_WINDOWS.coda[0], MID.coda, 1], [1.03, 1.05, 1.1])
  const luxeY = useTransform(progress, [SCENE_WINDOWS.coda[0], 1], ['0%', '-3%'])

  // — Cross-fades, each pinned to the window of the scene it dresses —
  const warmOpacity = useTransform(progress, [0, 0.02, 0.33, 0.4], [1, 1, 1, 0])
  const soundboardOpacity = useTransform(progress, [0.33, 0.4, 0.66, 0.72], [0, 1, 1, 0])
  const luxeOpacity = useTransform(progress, [0.66, 0.74, 1], [0, 1, 1])

  // — Scrims —
  const inkDim = useTransform(progress, [0, 0.5, 1], [0.46, 0.54, 0.5])
  const walnutWash = useTransform(progress, [0, 0.5, 1], [0.2, 0.26, 0.22])
  const vignette = useTransform(progress, [0, 0.7, 1], [0.42, 0.55, 0.68])

  const saturate = useTransform(progress, [0, 0.55, 0.78, 1], [1, 1, 0.88, 0.8])
  const sharedFilter = useTransform(saturate, (s: number) => `saturate(${s})`)

  if (reduce) {
    return (
      <div className="absolute inset-0">
        <Image
          src={sceneImages.warmPianist}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-[color:var(--ink)]/60" />
        <div aria-hidden className="absolute inset-0 bg-[color:var(--walnut)]/25" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[color:var(--ink)]">
      {/* Showrooms */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{ opacity: warmOpacity, scale: warmScale, x: warmX, filter: sharedFilter }}
      >
        <Image
          src={sceneImages.warmPianist}
          alt=""
          fill
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Stats */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{
          opacity: soundboardOpacity,
          scale: sbScale,
          x: sbX,
          y: sbY,
          filter: sharedFilter,
        }}
      >
        <Image
          src={sceneImages.soundboard}
          alt=""
          fill
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Coda */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{ opacity: luxeOpacity, scale: luxeScale, y: luxeY, filter: sharedFilter }}
      >
        <Image
          src={sceneImages.luxeRoom}
          alt=""
          fill
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Scrims — Ink for legibility, Walnut for the campaign's warmth. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-10 bg-[color:var(--ink)]"
        style={{ opacity: inkDim }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 z-10 bg-[color:var(--walnut)] mix-blend-multiply"
        style={{ opacity: walnutWash }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[color:var(--ink)] to-transparent"
        style={{ opacity: vignette }}
      />
    </div>
  )
}
