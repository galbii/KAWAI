'use client'

import { useRef, type ReactNode } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import SceneShowrooms from './scenes/SceneShowrooms'
import SceneStats from './scenes/SceneStats'
import SceneCoda from './scenes/SceneCoda'

/**
 * The /signup2 cinematic outro, dropped onto /signup3 unchanged.
 *
 * It occupies the same slot it does on /signup2: straight after the rebate
 * section, carrying showrooms → trust strip → coda. The segment runs its own
 * spring-smoothed scroll, remapped into the ORIGINAL coordinate range its scene
 * windows + PinnedCanvas were authored against, so the choreography needs no
 * re-tuning:
 *   outro segment → showrooms…coda slice [0.405 → 1.0]
 *
 * Reduced motion gets `fallback` instead — on this page that is the Back to
 * School sheets the cinematic replaced (ShowroomsSection / StatsSection /
 * CodaSection), which are server-rendered and handed down as a prop. Same copy,
 * same CTAs, no pinned scroll. (/signup2 swaps to AboutStaticFallback here for
 * the same reason.)
 */
const SPRING = { stiffness: 90, damping: 28, mass: 0.4, restDelta: 0.0005 }

type CinematicOutroProps = {
  /** Flat, non-pinned rendering of the same three sections, for reduced motion. */
  fallback: ReactNode
}

export default function CinematicOutro({ fallback }: CinematicOutroProps) {
  const reduce = useReducedMotion() ?? false
  const outroRef = useRef<HTMLDivElement>(null)

  const outroRaw = useScroll({ target: outroRef, offset: ['start start', 'end end'] }).scrollYProgress
  const outroSpring = useSpring(outroRaw, SPRING)

  const outroProgress = useTransform(outroSpring, [0, 1], [0.405, 1])

  if (reduce) return <>{fallback}</>

  return (
    <>
      {/* Each scene is `inert` while it is off its scroll window, so assistive
          tech only ever sees the one on stage. This states the shape of the
          sequence up front. */}
      <div className="sr-only">
        <h2>Where to play, and how to claim your rebate</h2>
        <p>
          The rest of the page is presented as a scrollable cinematic sequence over piano
          photography. It runs through our network of 200+ authorized dealers, our company by the
          numbers, and an invitation to claim your discount.
        </p>
      </div>

      <div ref={outroRef} className="relative h-[340vh] bg-kawai-black">
        <div className="sticky top-0 h-screen overflow-hidden">
          <PinnedCanvas progress={outroProgress} reduce={reduce} />
          <div className="absolute inset-0 z-10">
            <SceneShowrooms progress={outroProgress} reduce={reduce} />
            <SceneStats progress={outroProgress} reduce={reduce} />
            <SceneCoda progress={outroProgress} reduce={reduce} />
          </div>
        </div>
      </div>
    </>
  )
}
