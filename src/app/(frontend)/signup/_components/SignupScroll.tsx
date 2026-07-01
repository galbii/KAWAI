'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import HeroStatic from './HeroStatic'
import SceneStats from './scenes/SceneStats'
import SceneShowrooms from './scenes/SceneShowrooms'
import SceneCollections from './scenes/SceneCollections'
import SceneTimeline from './scenes/SceneTimeline'
import SceneCoda from './scenes/SceneCoda'
import AboutStaticFallback from './AboutStaticFallback'
import { OfferModalProvider, useOfferModal } from './OfferModalContext'
import SignupRebateSection from '@/components/rebates/SignupRebateSection'
import { rebatesCopy } from './scenes'
import type { RebateCategory } from '@/lib/payload/rebate-types'

/**
 * Orchestrator for the /signup scroll experience.
 *
 * The page opens with a static hero block (HeroStatic) that flows straight into
 * a natural white RebateSchedule section, then continues into the cinematic:
 * static hero → white rebate table → the rest of the cinematic (stats → coda).
 *
 * The cinematic outro runs its own spring-smoothed scroll, then remaps that
 * 0→1 progress into the ORIGINAL coordinate range it was authored against
 * (stats…coda slice [0.275 → 1.0]) so the existing scene windows and canvas
 * transforms work unchanged.
 */
const SPRING = { stiffness: 90, damping: 28, mass: 0.4, restDelta: 0.0005 }

type SignupScrollProps = {
  /** Rebated products grouped by category, resolved server-side for the active site. */
  rebateData: RebateCategory[]
}

/** Natural white rebate break — needs the offer modal, so it lives inside the provider. */
function RebateBreak({ data }: { data: RebateCategory[] }) {
  const offer = useOfferModal()
  return (
    <SignupRebateSection
      data={data}
      onSignUp={offer.open}
      eyebrow={rebatesCopy.eyebrow}
      heading={rebatesCopy.headline}
      footnote={rebatesCopy.disclaimer}
    />
  )
}

export default function SignupScroll({ rebateData }: SignupScrollProps) {
  const reduce = useReducedMotion() ?? false
  const outroRef = useRef<HTMLDivElement>(null)

  const outroRaw = useScroll({ target: outroRef, offset: ['start start', 'end end'] }).scrollYProgress
  const outroSpring = useSpring(outroRaw, SPRING)

  // Remap the cinematic outro into the original PinnedCanvas/scene coordinate space.
  const outroProgress = useTransform(outroSpring, [0, 1], [0.275, 1])

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
          The page is presented as a scrollable cinematic sequence over a piano soundboard. It opens
          with an introduction and sign-up, breaks to the current rebates on our pianos by model,
          then continues through our company by the numbers, our network of 200+ authorized dealers,
          our featured piano collections, our legacy of innovation, and an invitation to experience
          our pianos.
        </p>
      </div>

      {/* Hero — static block, flows straight into the rebate table */}
      <HeroStatic reduce={reduce} />

      {/* Rebate break — natural white RebateSchedule section */}
      <RebateBreak data={rebateData} />

      {/* Segment 2 — stats → coda (pinned cinematic) */}
      <div ref={outroRef} className="relative h-[540vh] bg-kawai-black">
        <div className="sticky top-0 h-screen overflow-hidden">
          <PinnedCanvas progress={outroProgress} reduce={reduce} />
          <div className="absolute inset-0 z-10">
            <SceneStats progress={outroProgress} reduce={reduce} />
            <SceneShowrooms progress={outroProgress} reduce={reduce} />
            <SceneCollections progress={outroProgress} reduce={reduce} />
            <SceneTimeline progress={outroProgress} reduce={reduce} />
            <SceneCoda progress={outroProgress} reduce={reduce} />
          </div>
        </div>
      </div>
    </OfferModalProvider>
  )
}
