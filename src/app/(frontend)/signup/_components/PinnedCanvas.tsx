'use client'

import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { aboutImages } from './images'
import { SCENE_WINDOWS } from './scenes'

type Props = {
  progress: MotionValue<number>
  reduce: boolean
}

const MID = {
  hero: 0.075,
  stats: (SCENE_WINDOWS.stats[0] + SCENE_WINDOWS.stats[1]) / 2,
  collections: (SCENE_WINDOWS.collections[0] + SCENE_WINDOWS.collections[1]) / 2,
  coda: 0.93,
}

const SOUNDBOARD_STOPS = [MID.hero, MID.stats, MID.collections, MID.coda]

/**
 * The pinned cinema canvas. Layered piano images cross-fade across the master
 * scroll, each holding their stage for one scene. Above them sit warm-light and
 * global-dim scrims that breathe with the camera to keep copy legible without
 * ever fully blackening the gold-string glow.
 *
 * Scene order: hero → stats → showrooms → collections → timeline → coda.
 */
export default function PinnedCanvas({ progress, reduce }: Props) {
  // — Camera transforms (soundboard gets the cinematic move) —
  const sbScale = useTransform(progress, SOUNDBOARD_STOPS, [1.05, 1.15, 1.35, 1.3])
  const sbX = useTransform(progress, SOUNDBOARD_STOPS, ['0%', '4%', '8%', '3%'])
  const sbY = useTransform(progress, SOUNDBOARD_STOPS, ['0%', '-2%', '-5%', '-1%'])

  // Subtle breath on the warm pianist — hero only
  const warmScale = useTransform(progress, [0, 0.15], [1.04, 1.1])
  const warmX = useTransform(progress, [0, 0.15], ['0%', '3%'])

  const luxeScale = useTransform(progress, [SCENE_WINDOWS.coda[0], MID.coda, 1], [1.03, 1.05, 1.1])
  const luxeY = useTransform(progress, [SCENE_WINDOWS.coda[0], 1], ['0%', '-3%'])

  // Featured collections location shot: slow push-in across its window
  const collectionsScale = useTransform(
    progress,
    [SCENE_WINDOWS.collections[0], MID.collections, SCENE_WINDOWS.collections[1]],
    [1.06, 1.1, 1.14],
  )
  const collectionsX = useTransform(
    progress,
    [SCENE_WINDOWS.collections[0], SCENE_WINDOWS.collections[1]],
    ['0%', '-3%'],
  )

  // Warm pianist (human/dealer): a slow continuous push across the showrooms scene
  const warmPianistScale = useTransform(
    progress,
    [SCENE_WINDOWS.showrooms[0], SCENE_WINDOWS.showrooms[1]],
    [1.05, 1.12],
  )
  const warmPianistX = useTransform(
    progress,
    [SCENE_WINDOWS.showrooms[0], SCENE_WINDOWS.showrooms[1]],
    ['0%', '-3%'],
  )

  // Hero shot returns as a callback behind the innovation timeline
  const timelineScale = useTransform(
    progress,
    [SCENE_WINDOWS.timeline[0], SCENE_WINDOWS.timeline[1]],
    [1.08, 1.16],
  )
  const timelineY = useTransform(
    progress,
    [SCENE_WINDOWS.timeline[0], SCENE_WINDOWS.timeline[1]],
    ['0%', '-4%'],
  )

  // — Image opacity windows —
  // Warm pianist hero: full at hero, fades out as the soundboard takes over
  const warmOpacity = useTransform(progress, [0, 0.13, 0.18], [1, 1, 0])

  // Soundboard: the lens for the body of the page — holds from stats straight
  // through the featured collections and timeline, then yields to the luxe coda.
  const soundboardOpacity = useTransform(progress, [0.13, 0.2, 0.8, 0.84], [0, 1, 1, 0])

  // Collections location shot: emerges over the soundboard for the collections scene
  const collectionsOpacity = useTransform(
    progress,
    [
      SCENE_WINDOWS.collections[0],
      SCENE_WINDOWS.collections[0] + 0.02,
      SCENE_WINDOWS.collections[1] - 0.02,
      SCENE_WINDOWS.collections[1],
    ],
    [0, 1, 1, 0],
  )

  // Warm pianist overlay: showrooms (dealers), drawn over the soundboard
  const warmPianistOpacity = useTransform(
    progress,
    [
      SCENE_WINDOWS.showrooms[0],
      SCENE_WINDOWS.showrooms[0] + 0.02,
      SCENE_WINDOWS.showrooms[1] - 0.02,
      SCENE_WINDOWS.showrooms[1],
    ],
    [0, 1, 1, 0],
  )

  // Hero shot callback: emerges over the soundboard for the timeline scene
  const timelineOpacity = useTransform(
    progress,
    [
      SCENE_WINDOWS.timeline[0],
      SCENE_WINDOWS.timeline[0] + 0.02,
      SCENE_WINDOWS.timeline[1] - 0.02,
      SCENE_WINDOWS.timeline[1],
    ],
    [0, 1, 1, 0],
  )

  // Luxe interior: peaks during coda and stays visible at the end
  const luxeOpacity = useTransform(progress, [0.8, 0.86, 1], [0, 1, 1])

  // — Scrim layers —
  const leftWash = useTransform(progress, [0, 0.1, 0.22, 0.75], [0.55, 0.55, 0.25, 0.2])
  const globalDim = useTransform(progress, [0, 0.18, 0.5, 0.8, 1], [0.18, 0.42, 0.52, 0.55, 0.48])
  const bottomVignette = useTransform(progress, [0, 0.7, 1], [0.4, 0.55, 0.7])

  // Color treatment shared across all images
  const saturate = useTransform(progress, [0, 0.55, 0.78, 1], [1, 1, 0.8, 0.7])
  const sharedFilter = useTransform(saturate, (s: number) => `saturate(${s})`)

  if (reduce) {
    return (
      <div className="absolute inset-0">
        <Image
          src={aboutImages.warmPianist}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-kawai-black">
      {/* Hero background — hero only */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{ opacity: warmOpacity, scale: warmScale, x: warmX, filter: sharedFilter }}
      >
        <Image
          src={aboutImages.heroBg}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Soundboard — the lens for the body of the page */}
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
          src={aboutImages.soundboard}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Warm pianist — showrooms (dealers) */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{
          opacity: warmPianistOpacity,
          scale: warmPianistScale,
          x: warmPianistX,
          filter: sharedFilter,
        }}
      >
        <Image
          src={aboutImages.warmPianist}
          alt=""
          fill
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Featured collections location shot — collections scene */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{
          opacity: collectionsOpacity,
          scale: collectionsScale,
          x: collectionsX,
          filter: sharedFilter,
        }}
      >
        <Image
          src={aboutImages.collectionsBg}
          alt=""
          fill
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Hero shot callback — innovation timeline */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{
          opacity: timelineOpacity,
          scale: timelineScale,
          y: timelineY,
          filter: sharedFilter,
        }}
      >
        <Image
          src={aboutImages.heroBg}
          alt=""
          fill
          quality={86}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Luxe interior — coda */}
      <motion.div
        className="absolute inset-0 will-change-[opacity,transform]"
        style={{
          opacity: luxeOpacity,
          scale: luxeScale,
          y: luxeY,
          filter: sharedFilter,
        }}
      >
        <Image
          src={aboutImages.luxeRoom}
          alt=""
          fill
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Scrims */}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/60 to-transparent"
        style={{ opacity: leftWash }}
      />
      <motion.div className="absolute inset-0 z-10 bg-black" style={{ opacity: globalDim }} />
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black to-transparent"
        style={{ opacity: bottomVignette }}
      />
    </div>
  )
}
