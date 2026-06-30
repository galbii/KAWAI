'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import SceneHero from './scenes/SceneHero'
import SceneRebates from './scenes/SceneRebates'
import SceneShowrooms from './scenes/SceneShowrooms'
import SceneStats from './scenes/SceneStats'
import SceneCoda from './scenes/SceneCoda'
import AboutStaticFallback from './AboutStaticFallback'
import { OfferModalProvider } from './OfferModalContext'
import type { RebateCategory } from '@/lib/payload/rebate-types'

/**
 * Orchestrator for the cinematic /signup2 scroll experience.
 *
 * Conversion-first variant of /signup: same cinematic engine, but trimmed to the
 * five scenes that move toward the two goals — sign up for the discount, or find
 * a dealer. Order: hero → rebates → showrooms → trust strip → coda. The
 * Collections and Heritage timeline scenes are dropped (they sent people off to
 * browse / read history); the five-stat scene is compressed to a three-number
 * trust strip. Track height drops from 700vh (7 scenes) to 500vh (5 scenes).
 *
 * Raw scroll position is run through a spring before any motion subscribes
 * to it. Fast scrolls cushion, slow scrolls track precisely — the whole
 * page reads from one smoothed clock instead of eight unrelated ones.
 */
type SignupScrollProps = {
  /** Rebated products grouped by category, resolved server-side for the active site. */
  rebateData: RebateCategory[]
}

export default function SignupScroll({ rebateData }: SignupScrollProps) {
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
        <AboutStaticFallback rebateData={rebateData} />
      </OfferModalProvider>
    )

  return (
    <OfferModalProvider>
      <div className="sr-only">
        <h2>About Kawai</h2>
        <p>
          The page is presented as a single scrollable cinematic sequence over a piano soundboard.
          The sequence covers: an introduction with a sign-up form, current rebates on our pianos
          by model, our network of 200+ authorized dealers, our company by the numbers, and an
          invitation to claim your discount.
        </p>
      </div>

      <div ref={ref} className="relative h-[500vh] bg-kawai-black">
        <div className="sticky top-0 h-screen overflow-hidden">
          <PinnedCanvas progress={progress} reduce={reduce} />
          <div className="absolute inset-0 z-10">
            <SceneHero progress={progress} reduce={reduce} />
            <SceneRebates progress={progress} reduce={reduce} data={rebateData} />
            <SceneShowrooms progress={progress} reduce={reduce} />
            <SceneStats progress={progress} reduce={reduce} />
            <SceneCoda progress={progress} reduce={reduce} />
          </div>
        </div>
      </div>
    </OfferModalProvider>
  )
}
