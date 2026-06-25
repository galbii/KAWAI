'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import SceneHero from './scenes/SceneHero'
import SceneStats from './scenes/SceneStats'
import SceneTimeline from './scenes/SceneTimeline'
import SceneCollections from './scenes/SceneCollections'
import SceneShowrooms from './scenes/SceneShowrooms'
import SceneCoda from './scenes/SceneCoda'
import AboutStaticFallback from './AboutStaticFallback'
import { OfferModalProvider } from './OfferModalContext'

/**
 * Orchestrator for the cinematic /signup scroll experience.
 *
 * Cloned from the /about experience as an independent starting point — adjust
 * scenes here freely without affecting /about.
 *
 * Raw scroll position is run through a spring before any motion subscribes
 * to it. Fast scrolls cushion, slow scrolls track precisely — the whole
 * page reads from one smoothed clock instead of eight unrelated ones.
 */
export default function SignupScroll() {
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

  if (reduce)
    return (
      <OfferModalProvider>
        <AboutStaticFallback />
      </OfferModalProvider>
    )

  return (
    <OfferModalProvider>
      <div className="sr-only">
        <h2>About Kawai</h2>
        <p>
          The page is presented as a single scrollable cinematic sequence over a piano soundboard.
          The full sequence covers: an introduction, our company by the numbers, our network of
          200+ authorized dealers, our featured piano collections, our legacy of innovation, and an
          invitation to experience our pianos.
        </p>
      </div>

      <div ref={ref} className="relative h-[600vh] bg-kawai-black">
        <div className="sticky top-0 h-screen overflow-hidden">
          <PinnedCanvas progress={progress} reduce={reduce} />
          <div className="absolute inset-0 z-10">
            <SceneHero progress={progress} reduce={reduce} />
            <SceneStats progress={progress} reduce={reduce} />
            <SceneShowrooms progress={progress} reduce={reduce} />
            <SceneCollections progress={progress} reduce={reduce} />
            <SceneTimeline progress={progress} reduce={reduce} />
            <SceneCoda progress={progress} reduce={reduce} />
          </div>
        </div>
      </div>
    </OfferModalProvider>
  )
}
