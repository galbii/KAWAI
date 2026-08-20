'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import PinnedCanvas from './PinnedCanvas'
import HeroStatic from './HeroStatic'
import SceneShowrooms from './scenes/SceneShowrooms'
import SceneStats from './scenes/SceneStats'
import SceneCoda from './scenes/SceneCoda'
import AboutStaticFallback from './AboutStaticFallback'
import { OfferModalProvider, useOfferModal } from './OfferModalContext'
import SignupRebateSection from '@/components/rebates/SignupRebateSection'
import { rebatesCopy } from './scenes'
import type { RebateCategory } from '@/lib/payload/rebate-types'

/**
 * Orchestrator for the conversion-first /signup3 scroll experience.
 *
 * Same break-out structure as /signup: a static hero block (HeroStatic) flows
 * straight into a natural white RebateSchedule section, then continues into the
 * cinematic (showrooms → trust strip → coda). The cinematic outro runs its own
 * spring-smoothed scroll, remapped into the ORIGINAL coordinate range its scene
 * windows + PinnedCanvas were authored against, so the choreography needs no
 * re-tuning:
 *   outro segment → showrooms…coda slice [0.405 → 1.0]
 */
const SPRING = { stiffness: 90, damping: 28, mass: 0.4, restDelta: 0.0005 }

type SignupScrollProps = {
  /** Rebated products grouped by category, resolved server-side for the active site. */
  rebateData: RebateCategory[]
  /** Active site — 'cad' swaps in the Canada hero headline. */
  site?: 'us' | 'cad'
  /** Staging mode — the offer form skips HubSpot and Shopify writes. */
  testMode?: boolean
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

export default function SignupScroll({
  rebateData,
  site = 'us',
  testMode = false,
}: SignupScrollProps) {
  const reduce = useReducedMotion() ?? false
  const outroRef = useRef<HTMLDivElement>(null)

  const outroRaw = useScroll({ target: outroRef, offset: ['start start', 'end end'] }).scrollYProgress
  const outroSpring = useSpring(outroRaw, SPRING)

  const outroProgress = useTransform(outroSpring, [0, 1], [0.405, 1])

  if (reduce)
    return (
      <OfferModalProvider testMode={testMode}>
        <AboutStaticFallback rebateData={rebateData} />
      </OfferModalProvider>
    )

  return (
    <OfferModalProvider testMode={testMode}>
      <div className="sr-only">
        <h2>About Kawai</h2>
        <p>
          The page is presented as a scrollable cinematic sequence over a piano soundboard. It opens
          with an introduction and sign-up, breaks to the current rebates on our pianos by model,
          then continues through our network of 200+ authorized dealers, our company by the numbers,
          and an invitation to claim your discount.
        </p>
      </div>

      {/* Hero — static block, flows straight into the rebate table */}
      <HeroStatic reduce={reduce} site={site} />

      {/* Rebate break — natural white RebateSchedule section */}
      <RebateBreak data={rebateData} />

      {/* Segment 2 — showrooms → trust strip → coda (pinned cinematic) */}
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
    </OfferModalProvider>
  )
}
