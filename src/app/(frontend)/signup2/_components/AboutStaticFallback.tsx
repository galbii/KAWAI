'use client'

import Image from 'next/image'
import { BrandCTAButton } from './brand-ui'
import RebateShowcase from './RebateShowcase'
import { useOfferModal } from './OfferModalContext'
import { aboutImages } from './images'
import type { RebateCategory } from '@/lib/payload/rebate-types'
import { codaCopy, heroCopy, offerCopy, showroomsCopy, stats } from './scenes'
import { OfferSignupForm } from './OfferSignupForm'

/**
 * Reduced-motion fallback for the conversion-first /signup2 variant. Same copy,
 * same DOM order as the cinematic version, no scroll coupling — five stacked
 * sections, each fully visible at rest.
 * Order: hero → rebates → showrooms → stats (trust strip) → coda.
 */
export default function AboutStaticFallback({ rebateData }: { rebateData: RebateCategory[] }) {
  const offer = useOfferModal()
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-kawai-black py-20 text-white">
        <Image
          src={aboutImages.soundboard}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/70" />
        <div className="container relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14">
          {/* Left column — brand storytelling */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="sr-only">Kawai — Crafting Inspiration Since 1927</h1>
            <p className="mb-7 inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-kawai-gold">
              <span className="h-px w-10 bg-kawai-gold" />
              {heroCopy.eyebrow}
            </p>
            <div
              aria-hidden
              className="relative mb-4 h-[clamp(4.5rem,11vw,8.5rem)] w-full max-w-[520px]"
            >
              <Image
                src={aboutImages.wordmark}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 80vw, 520px"
                className="object-contain object-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)] lg:object-left"
              />
            </div>
            <p className="mb-7 text-sm font-semibold uppercase tracking-[0.32em] text-white/70">
              {heroCopy.sinceLabel}
            </p>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
              {heroCopy.sub}
            </p>
            <BrandCTAButton onClick={offer.open} variant="red">
              {offerCopy.cta.hero}
            </BrandCTAButton>
          </div>

          {/* Right column — the sign-up card */}
          <div className="mx-auto w-full max-w-md rounded-2xl bg-kawai-pearl p-6 text-kawai-black shadow-[0_24px_70px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:p-8">
            <OfferSignupForm />
          </div>
        </div>
      </section>

      {/* Rebates */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-kawai-black py-20 text-white md:py-24">
        <RebateShowcase data={rebateData} reduce />
      </section>

      {/* Showrooms */}
      <section className="bg-kawai-black py-24 text-center text-white">
        <div className="container mx-auto max-w-3xl px-6">
          <Image
            src="/images/logos/kawai-logo-new-red.png"
            alt="Kawai"
            width={188}
            height={38}
            className="mx-auto h-8 w-auto md:h-9"
          />
          <p className="mt-6 inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-gold">
            <span className="h-px w-8 bg-kawai-gold" />
            {showroomsCopy.eyebrow}
            <span className="h-px w-8 bg-kawai-gold" />
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04]">
            {showroomsCopy.headline}
          </h2>

          <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-white/70">
            {showroomsCopy.body}
          </p>

          <div className="mt-12">
            <div className="font-[family-name:var(--font-brand-serif)] text-6xl font-light leading-none tracking-tight text-white md:text-7xl">
              {showroomsCopy.dealerStat.numeric}
              {showroomsCopy.dealerStat.suffix}
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
              {showroomsCopy.dealerStat.label}
            </div>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <BrandCTAButton onClick={offer.open} variant="red">
                {offerCopy.cta.showrooms}
              </BrandCTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — trust strip */}
      <section className="bg-kawai-black py-20 text-white md:py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-y-12 md:grid-cols-3 md:gap-y-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-4 text-center md:border-l md:border-white/10 ${i === 0 ? 'md:border-l-0' : ''} ${i === stats.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className="font-[family-name:var(--font-brand-serif)] text-5xl font-medium leading-none md:text-6xl">
                  {s.value}
                </div>
                <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-kawai-gold/80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <BrandCTAButton onClick={offer.open} variant="red">
              {offerCopy.cta.stats}
            </BrandCTAButton>
          </div>
        </div>
      </section>

      {/* Coda */}
      <section className="bg-kawai-black py-28 text-center text-white">
        <div className="container mx-auto max-w-3xl px-6">
          <p className="mb-5 inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-gold">
            <span className="h-px w-8 bg-kawai-gold" />
            {codaCopy.eyebrow}
            <span className="h-px w-8 bg-kawai-gold" />
          </p>
          <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.05]">
            {codaCopy.headline}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-white/75">{codaCopy.body}</p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <BrandCTAButton onClick={offer.open} variant="red">
              {offerCopy.cta.coda}
            </BrandCTAButton>
          </div>
        </div>
      </section>
    </>
  )
}
