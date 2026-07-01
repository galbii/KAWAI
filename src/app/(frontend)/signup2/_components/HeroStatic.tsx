'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { BrandCTAButton, BrandEyebrow } from './brand-ui'
import { useOfferModal } from './OfferModalContext'
import { summerHero } from './scenes'
import { aboutImages } from './images'
import { EASE_OUT_EXPO } from './motion'

/** Summer-savings background film (R2). Poster + scrim guarantee legible copy. */
const HERO_VIDEO = 'https://pub-0cc9ed269d544fd29fe51221f6744a6b.r2.dev/media/summersavingsbackground.mp4'

type Props = { reduce: boolean }

/**
 * Static hero block for /signup2 — Kawai logo, "Summer Savings Event", and the
 * 200+ dealer proof over the summer-savings film, flowing straight into the
 * rebate table below. "Sign Up Now" opens the shared OfferModal (same form every
 * other CTA uses); "View Rebates" scrolls down to the rebate table (#schedule).
 * Copy fades in once on mount (not scroll-coupled); reduced-motion users get it
 * fully static.
 */
export default function HeroStatic({ reduce }: Props) {
  const offer = useOfferModal()

  const scrollToRebates = () => {
    document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-kawai-black py-20 text-white">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={aboutImages.soundboard}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/70" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="sr-only">
            Kawai Summer Savings Event — 200+ Authorized Dealers Nationwide
          </h1>

          {/* Kawai logo */}
          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className="relative mb-8 h-[clamp(3.5rem,9vw,7rem)] w-full max-w-[440px]"
          >
            <Image
              src={aboutImages.wordmark}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 70vw, 440px"
              className="object-contain object-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </motion.div>

          {/* Campaign eyebrow */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.25 }}
            className="mb-5"
          >
            <BrandEyebrow centered>{summerHero.eyebrow}</BrandEyebrow>
          </motion.div>

          {/* Dealer headline */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.4 }}
            className="mb-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05]"
          >
            {summerHero.headline}
          </motion.p>

          {/* Sub */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.55 }}
            className="mb-9 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/80 sm:text-lg"
          >
            {summerHero.sub}
          </motion.p>

          {/* CTAs — both open popups */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.7 }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          >
            <BrandCTAButton onClick={offer.open} variant="red">
              {summerHero.signUpCta}
            </BrandCTAButton>
            <BrandCTAButton onClick={scrollToRebates} variant="outline">
              {summerHero.viewRebatesCta}
            </BrandCTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
