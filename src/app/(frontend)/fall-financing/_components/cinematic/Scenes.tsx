'use client'

import Image from 'next/image'
import { motion, type MotionValue, type Variants } from 'framer-motion'
import { PROMO_CONTAINER } from '@/components/fall-promo'
import { PromoButton } from '../PromoUI'
import { dealer, trustStats, coda } from '../campaign'
import {
  EASE_OUT_EXPO,
  NumberStrike,
  SCENE_WINDOWS,
  SceneEyebrow,
  SceneLayer,
  useSceneActive,
} from './primitives'

/**
 * The three scenes of the closing cinematic: dealers → trust strip → close.
 *
 * Structurally /signup2's showrooms, stats and coda — same windows, same
 * staggers, same word-mask on the closing headline. The theming is this page's:
 * Fraunces headlines through `.promo-h2` instead of the brand serif, Ivory
 * instead of white, Ember hairlines instead of Kawai red, and the campaign's
 * square-cornered buttons instead of the site's pill CTAs.
 *
 * Every CTA opens this page's lead form via `PromoButton`, not the /signup2
 * prototype modal — that one is explicitly not wired to a backend.
 */

type SceneProps = { progress: MotionValue<number>; reduce: boolean }

/** Shared reveal: opacity + rise, held off a boolean so it always completes. */
const rise = (active: boolean, reduce: boolean, delay: number, y = 20) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y },
        animate: { opacity: active ? 1 : 0, y: active ? 0 : y },
        transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay },
      }

/* ── Scene 1 · Dealers ─────────────────────────────────────────────────── */

export function SceneShowrooms({ progress, reduce }: SceneProps) {
  const active = useSceneActive(progress, SCENE_WINDOWS.showrooms)

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.showrooms} className="items-center">
      <div className={`${PROMO_CONTAINER} flex flex-col items-center text-center`}>
        <motion.div {...rise(active, reduce, 0, 18)}>
          {/* The mark ships red and is filtered to Ivory. A logotype is exempt
              from 1.4.3, so this is not a contrast fix — Kawai red simply
              fights the Ember and Ivory this campaign is built from. */}
          <Image
            src="/images/logos/kawai-logo-red-3x.png"
            alt="Kawai"
            width={320}
            height={64}
            className="h-7 w-auto md:h-8"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </motion.div>

        <motion.div {...rise(active, reduce, 0.08, 14)} className="mt-7">
          <SceneEyebrow>{dealer.eyebrow}</SceneEyebrow>
        </motion.div>

        <motion.h2
          {...rise(active, reduce, 0.14)}
          className="promo-h2 promo-photo-text mt-5 max-w-[18ch] text-[color:var(--ivory)]"
        >
          {dealer.heading}
        </motion.h2>

        <motion.p
          {...rise(active, reduce, 0.24, 12)}
          className="promo-lede promo-photo-text mt-6 max-w-[46ch] text-[color:var(--ivory)]/80"
        >
          {dealer.body}
        </motion.p>

        <motion.div {...rise(active, reduce, 0.32)} className="mt-12 flex flex-col items-center">
          <p
            className="promo-num promo-photo-text leading-[0.85] text-[color:var(--ivory)]"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 6rem)' }}
          >
            <NumberStrike
              active={active}
              target={dealer.countNumeric}
              suffix={dealer.countSuffix}
              reduce={reduce}
              delay={0.45}
            />
          </p>
          <p
            aria-hidden
            className="promo-label promo-photo-text mt-4 text-[color:var(--ivory)]/70"
          >
            {dealer.countLabel}
          </p>
          <p className="sr-only">{`${dealer.count} ${dealer.countLabel}`}</p>

          <div className="mt-10 flex justify-center">
            <PromoButton />
          </div>
        </motion.div>
      </div>
    </SceneLayer>
  )
}

/* ── Scene 2 · Trust strip ─────────────────────────────────────────────── */

function StatColumn({
  stat,
  index,
  active,
  reduce,
}: {
  stat: (typeof trustStats)[number]
  index: number
  active: boolean
  reduce: boolean
}) {
  const delay = index * 0.1
  const isLast = index === trustStats.length - 1

  return (
    <div className={`relative px-6 text-center ${isLast ? 'col-span-2 md:col-span-1' : ''}`}>
      {index > 0 && (
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleY: 0 }}
          animate={reduce ? {} : { scaleY: active ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay }}
          style={{ originY: 0.5 }}
          className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-[color:var(--ivory)]/20 md:block"
        />
      )}

      <p
        className="promo-num promo-photo-text leading-none text-[color:var(--ivory)]"
        style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)' }}
      >
        <NumberStrike
          active={active}
          target={stat.numeric}
          suffix={stat.suffix}
          decimals={'decimals' in stat ? stat.decimals : 0}
          grouping={!('plain' in stat && stat.plain)}
          reduce={reduce}
          delay={delay}
        />
      </p>

      <motion.p
        aria-hidden
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={reduce ? {} : { opacity: active ? 1 : 0, y: active ? 0 : 8 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: delay + 0.15 }}
        className="promo-label promo-photo-text mt-4 text-[color:var(--ivory)]/70"
      >
        {stat.label}
      </motion.p>
      <span className="sr-only">{`${stat.label}: ${stat.numeric}${stat.suffix}`}</span>
    </div>
  )
}

export function SceneStats({ progress, reduce }: SceneProps) {
  const active = useSceneActive(progress, SCENE_WINDOWS.stats)
  const ctaDelay = trustStats.length * 0.1 + 0.2

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.stats} className="items-center">
      <div className={`${PROMO_CONTAINER} flex flex-col items-center`}>
        <div className="grid w-full max-w-4xl grid-cols-2 gap-y-12 md:grid-cols-3 md:gap-y-0">
          {trustStats.map((stat, i) => (
            <StatColumn key={stat.label} stat={stat} index={i} active={active} reduce={reduce} />
          ))}
        </div>

        <motion.div {...rise(active, reduce, ctaDelay, 16)} className="mt-16">
          <PromoButton />
        </motion.div>
      </div>
    </SceneLayer>
  )
}

/* ── Scene 3 · Close ───────────────────────────────────────────────────── */

const headlineV: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const wordRise: Variants = {
  hide: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
}

export function SceneCoda({ progress, reduce }: SceneProps) {
  const active = useSceneActive(progress, SCENE_WINDOWS.coda)
  const words = coda.heading.split(' ')

  return (
    <SceneLayer progress={progress} window={SCENE_WINDOWS.coda} endVisible className="items-center">
      <div className={`${PROMO_CONTAINER} text-center`}>
        <motion.div {...rise(active, reduce, 0, 14)} className="mb-6 inline-block">
          <SceneEyebrow>{coda.eyebrow}</SceneEyebrow>
        </motion.div>

        {/* Word-by-word rise out of a mask. Each word needs its own
            overflow-hidden wrapper, which is why this is not one element. */}
        <motion.h2
          variants={headlineV}
          initial={reduce ? false : 'hide'}
          animate={reduce || active ? 'show' : 'hide'}
          className="promo-h2 promo-photo-text mx-auto mb-6 max-w-[16ch] text-[color:var(--ivory)]"
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.06em]">
              <motion.span variants={wordRise} className="inline-block pr-[0.25em]">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.p
          {...rise(active, reduce, 0.4, 0)}
          className="promo-lede promo-photo-text mx-auto mb-10 max-w-[48ch] text-[color:var(--ivory)]/80"
        >
          {coda.body}
        </motion.p>

        <motion.div
          {...rise(active, reduce, 0.55, 8)}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <PromoButton />
        </motion.div>
      </div>
    </SceneLayer>
  )
}
