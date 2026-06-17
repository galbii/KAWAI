'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import ScrollDial from './ScrollDial'
import SceneHero from './scenes/SceneHero'
import SceneManifesto from './scenes/SceneManifesto'
import SceneStats from './scenes/SceneStats'
import SceneHeritage from './scenes/SceneHeritage'
import SceneTimeline from './scenes/SceneTimeline'
import SceneTechnology from './scenes/SceneTechnology'
import SceneGoDeeper from './scenes/SceneGoDeeper'
import SceneCollections from './scenes/SceneCollections'
import SceneCoda from './scenes/SceneCoda'
import AboutStaticFallback from './AboutStaticFallback'

/**
 * Orchestrator for the cinematic /about scroll experience.
 *
 * Raw scroll position is run through a spring before any motion subscribes
 * to it. Fast scrolls cushion, slow scrolls track precisely — the whole
 * page reads from one smoothed clock instead of eight unrelated ones.
 */
export default function AboutScroll() {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  })

  if (reduce) return <AboutStaticFallback />

  return (
    <>
      <div className="sr-only">
        <h2>About Kawai</h2>
        <p>
          The page is presented as a single scrollable cinematic sequence over a piano soundboard.
          The full sequence covers: an introduction, our manifesto, our company by the numbers, our
          family heritage, our legacy of innovation, the science of our engineering, where to learn
          more, our featured piano collections, and an invitation to experience our pianos.
        </p>
      </div>

      <ScrollDial progress={progress} />

      <div ref={ref} className="relative h-[900vh] bg-kawai-black">
        <div className="sticky top-0 h-screen overflow-hidden">
          <PinnedCanvas progress={progress} reduce={reduce} />
          <div className="absolute inset-0 z-10">
            <SceneHero progress={progress} reduce={reduce} />
            <SceneManifesto progress={progress} reduce={reduce} />
            <SceneStats progress={progress} reduce={reduce} />
            <SceneHeritage progress={progress} reduce={reduce} />
            <SceneTimeline progress={progress} reduce={reduce} />
            <SceneTechnology progress={progress} reduce={reduce} />
            <SceneGoDeeper progress={progress} reduce={reduce} />
            <SceneCollections progress={progress} reduce={reduce} />
            <SceneCoda progress={progress} reduce={reduce} />
          </div>
        </div>
      </div>
    </>
  )
}
