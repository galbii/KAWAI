'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import SceneHero from './scenes/SceneHero'
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
 * Orchestrator for the cinematic /signup scroll experience.
 *
 * The rebate section "breaks out" of the cinematic: the page is hero (pinned
 * cinematic) → a natural white RebateSchedule section (the marketing Rebate Table
 * UI, scrolls like a normal page) → the rest of the cinematic (stats → coda).
 *
 * To avoid re-tuning the carefully choreographed PinnedCanvas + scene windows,
 * each cinematic segment runs its own spring-smoothed scroll, then remaps that
 * 0→1 progress into the ORIGINAL coordinate range it was authored against:
 *   intro segment → the hero slice   [0 → 0.10]
 *   outro segment → stats…coda slice [0.275 → 1.0]
 * So the existing scene windows and canvas transforms work unchanged.
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
  const introRef = useRef<HTMLDivElement>(null)
  const outroRef = useRef<HTMLDivElement>(null)

  const introRaw = useScroll({ target: introRef, offset: ['start start', 'end end'] }).scrollYProgress
  const outroRaw = useScroll({ target: outroRef, offset: ['start start', 'end end'] }).scrollYProgress
  const introSpring = useSpring(introRaw, SPRING)
  const outroSpring = useSpring(outroRaw, SPRING)

  // Remap each segment into the original PinnedCanvas/scene coordinate space.
  const introProgress = useTransform(introSpring, [0, 1], [0, 0.1])
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

      {/* Segment 1 — hero (pinned cinematic) */}
      <div ref={introRef} className="relative h-[180vh] bg-kawai-black">
        <div className="sticky top-0 h-screen overflow-hidden">
          <PinnedCanvas progress={introProgress} reduce={reduce} />
          <div className="absolute inset-0 z-10">
            <SceneHero progress={introProgress} reduce={reduce} />
          </div>
        </div>
      </div>

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
