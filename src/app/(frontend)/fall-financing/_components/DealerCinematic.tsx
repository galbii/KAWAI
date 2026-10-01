'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { PROMO_CONTAINER } from '@/components/fall-promo'
import { PromoButton } from './PromoUI'
import { dealer, trustStats, coda, SECTION } from './campaign'
import PinnedCanvas, { sceneImages } from './cinematic/PinnedCanvas'
import { SceneShowrooms, SceneStats, SceneCoda } from './cinematic/Scenes'
import { SceneEyebrow } from './cinematic/primitives'

/**
 * The page's close, as a pinned cinematic: dealers → trust strip → the ask.
 *
 * Ported wholesale from /signup2's outro — one sticky viewport, three scenes
 * cross-fading over a camera that never stops moving — and re-graded to the
 * campaign's palette. The flat two-column Walnut sheet this replaces said the
 * dealer part at the same volume as the three offer blocks above it, at exactly
 * the point where all three converge on one action.
 *
 * 340vh of track for three scenes, so each keeps roughly a screen of scroll.
 * That is the /signup2 figure and it is load-bearing: shorten it and the scenes
 * cross-fade faster than the copy can be read.
 *
 * Reduced motion gets a real section rather than a degraded one — the same
 * three scenes stacked and legible, no pin, no scroll coupling, every counter
 * at its final value.
 */

const SPRING = { stiffness: 90, damping: 28, mass: 0.4, restDelta: 0.0005 }

/**
 * Token overrides for everything nested on the photography.
 *
 * The shared buttons read `--on-ground` and `--ground`, so re-pointing them
 * here is what makes PromoButton invert with no `tone` prop —
 * the same mechanism the Walnut sheet used before.
 */
const DARK_TOKENS = {
  '--ground': 'var(--ink)',
  '--on-ground': 'var(--ivory)',
  '--body': 'rgba(245, 239, 228, 0.82)',
  '--body-dim': 'rgba(245, 239, 228, 0.62)',
  '--focus-ring': 'var(--ivory)',
} as React.CSSProperties

/**
 * The no-motion reading of the same three scenes.
 *
 * Not a fallback that drops content: everything the cinematic says is here, in
 * the same order, over the first scene's photograph.
 */
function StaticClose() {
  return (
    <section
      id={SECTION.dealers}
      className="relative isolate overflow-hidden scroll-mt-20 bg-[color:var(--ink)]"
      style={DARK_TOKENS}
    >
      <Image src={sceneImages.warmPianist} alt="" fill sizes="100vw" className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-[color:var(--ink)]/65" />
      <div aria-hidden className="absolute inset-0 bg-[color:var(--walnut)]/25" />

      <div className={`${PROMO_CONTAINER} relative z-10 py-24 text-center md:py-32`}>
        <SceneEyebrow>{dealer.eyebrow}</SceneEyebrow>
        <h2 className="promo-h2 promo-photo-text mx-auto mt-5 max-w-[18ch] text-[color:var(--ivory)]">
          {dealer.heading}
        </h2>
        <p className="promo-lede promo-photo-text mx-auto mt-6 max-w-[46ch] text-[color:var(--ivory)]/80">
          {dealer.body}
        </p>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-y-10 md:grid-cols-3 md:gap-y-0">
          {trustStats.map((stat) => (
            <div key={stat.label} className="px-4">
              <dd
                className="promo-num promo-photo-text leading-none text-[color:var(--ivory)]"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)' }}
              >
                {stat.numeric.toLocaleString('en-US', {
                  minimumFractionDigits: 'decimals' in stat ? stat.decimals : 0,
                  maximumFractionDigits: 'decimals' in stat ? stat.decimals : 0,
                  useGrouping: !('plain' in stat && stat.plain),
                }) + stat.suffix}
              </dd>
              <dt className="promo-label promo-photo-text mt-3 text-[color:var(--ivory)]/70">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        <p className="promo-lede promo-photo-text mx-auto mt-14 max-w-[48ch] text-[color:var(--ivory)]/80">
          {coda.body}
        </p>
        <div className="mt-10 flex justify-center">
          <PromoButton />
        </div>
      </div>
    </section>
  )
}

export function DealerCinematic() {
  const prefersReduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  // `useReducedMotion` reads a media query, so it can disagree with the server
  // on the very first client render. Swapping the whole section on that value
  // is exactly the hydration mismatch CLAUDE.md warns about for
  // `origin.isDealerLocation`, so the switch waits for mount: server and first
  // client render both produce the cinematic, and a reader who prefers reduced
  // motion gets the static section a tick later.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduce = mounted && prefersReduced === true

  const raw = useScroll({ target: trackRef, offset: ['start start', 'end end'] }).scrollYProgress
  const progress = useSpring(raw, SPRING)

  if (reduce) return <StaticClose />

  return (
    <section
      id={SECTION.dealers}
      ref={trackRef}
      className="relative h-[340vh] scroll-mt-20 bg-[color:var(--ink)]"
      style={DARK_TOKENS}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <PinnedCanvas progress={progress} reduce={false} />
        <div className="absolute inset-0 z-10">
          <SceneShowrooms progress={progress} reduce={false} />
          <SceneStats progress={progress} reduce={false} />
          <SceneCoda progress={progress} reduce={false} />
        </div>
      </div>
    </section>
  )
}
