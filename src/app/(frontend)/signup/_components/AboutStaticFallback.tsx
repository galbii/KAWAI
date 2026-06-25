'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BrandCTA, BrandCTAButton } from './brand-ui'
import { useOfferModal } from './OfferModalContext'
import { aboutImages } from './images'
import {
  codaCopy,
  exploreProductsCta,
  heroCopy,
  offerCopy,
  showroomsCopy,
  stats,
  timelineCopy,
} from './scenes'
import { CATEGORY_LABELS, collectionsCopy, featuredCollections } from './featuredCollections'

/**
 * Reduced-motion fallback. Same copy, same DOM order as the cinematic version,
 * no scroll coupling — six stacked sections, each fully visible at rest.
 * Order: hero → stats → showrooms → collections → timeline → coda.
 */
export default function AboutStaticFallback() {
  const offer = useOfferModal()
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-kawai-black text-white">
        <Image
          src={aboutImages.soundboard}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/70" />
        <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <h1 className="sr-only">Kawai — Crafting Inspiration Since 1927</h1>
          <p className="mb-7 inline-flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-kawai-gold">
            <span className="h-px w-10 bg-kawai-gold" />
            {heroCopy.eyebrow}
            <span className="h-px w-10 bg-kawai-gold" />
          </p>
          <div
            aria-hidden
            className="relative mb-4 h-[clamp(5.5rem,15vw,11rem)] w-full max-w-[640px]"
          >
            <Image
              src={aboutImages.wordmark}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 80vw, 640px"
              className="object-contain object-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </div>
          <p className="mb-9 text-sm font-semibold uppercase tracking-[0.32em] text-white/70">
            {heroCopy.sinceLabel}
          </p>
          <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
            {heroCopy.sub}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BrandCTAButton onClick={offer.open} variant="red">
              {offerCopy.cta.hero}
            </BrandCTAButton>
            <BrandCTA href={heroCopy.secondaryCta.href} variant="outline" showArrow={false}>
              {heroCopy.secondaryCta.label}
            </BrandCTA>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-kawai-black py-20 text-white md:py-24">
        <div className="container mx-auto grid max-w-6xl grid-cols-2 gap-y-12 px-6 md:grid-cols-5 md:gap-y-0">
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
              <BrandCTA href={showroomsCopy.secondaryCta.href} variant="outline" showArrow={false}>
                {showroomsCopy.secondaryCta.label}
              </BrandCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-kawai-black py-24 text-white">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-10">
            <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-gold">
              <span className="h-px w-8 bg-kawai-gold" />
              {collectionsCopy.eyebrow}
            </p>
            <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] leading-tight">
              {collectionsCopy.headline}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            {featuredCollections.map((collection) => (
              <Link
                key={collection.handle}
                href={`/pianos/${collection.handle}`}
                className="group relative block aspect-[3/2] overflow-hidden rounded-lg bg-kawai-black ring-1 ring-white/10"
              >
                <Image
                  src={collection.imageUrl}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-kawai-black">
                  {CATEGORY_LABELS[collection.category]}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-[family-name:var(--font-brand-serif)] text-2xl leading-tight">
                    {collection.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {collection.productCount} Models
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <BrandCTA href={exploreProductsCta.href} variant="red">
              {exploreProductsCta.label}
            </BrandCTA>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-kawai-black py-24 text-white">
        <div className="container mx-auto max-w-3xl px-6">
          <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-gold">
            <span className="h-px w-8 bg-kawai-gold" />
            {timelineCopy.eyebrow}
          </p>
          <h2 className="mb-14 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.25rem)] leading-tight">
            {timelineCopy.headline}
          </h2>
          <ol className="relative ml-3 border-l border-white/15 pl-10">
            {timelineCopy.events.map((e) => (
              <li key={e.year} className="relative mb-12 last:mb-0">
                <span
                  aria-hidden
                  className="absolute -left-[45px] top-2 size-2.5 rounded-full bg-kawai-red ring-4 ring-kawai-black"
                />
                <div className="font-[family-name:var(--font-brand-serif)] text-2xl text-kawai-red">
                  {e.year}
                </div>
                <h3 className="mt-1 mb-2 text-lg font-semibold">{e.title}</h3>
                <p className="leading-relaxed text-white/75">{e.description}</p>
              </li>
            ))}
          </ol>
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
            <BrandCTA href={codaCopy.secondaryCta.href} variant="outline">
              {codaCopy.secondaryCta.label}
            </BrandCTA>
          </div>
        </div>
      </section>
    </>
  )
}
