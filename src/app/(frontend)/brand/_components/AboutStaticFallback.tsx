import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BrandArrowLink as ArrowLink } from './brand-ui'
import { aboutImages } from './images'
import {
  codaCopy,
  goDeeperCopy,
  heritageCopy,
  heroCopy,
  manifestoCopy,
  stats,
  technologyCopy,
  timelineCopy,
} from './scenes'
import { CATEGORY_LABELS, collectionsCopy, featuredCollections } from './featuredCollections'

/**
 * Reduced-motion fallback. Same copy, same DOM order, no scroll
 * coupling — nine stacked sections, each fully visible at rest.
 */
export default function AboutStaticFallback() {
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        <div className="container relative z-10 mx-auto px-6">
          <h1 className="sr-only">Kawai — Crafting Inspiration Since 1927</h1>
          <p className="mb-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-kawai-gold">
            <span className="h-px w-10 bg-kawai-gold" />
            {heroCopy.eyebrow}
          </p>
          <div
            aria-hidden
            className="relative mb-9 h-[clamp(5.5rem,15vw,11rem)] w-full max-w-[640px]"
          >
            <Image
              src={aboutImages.wordmark}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 80vw, 640px"
              className="object-contain object-left drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            />
          </div>
          <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
            {heroCopy.sub}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={heroCopy.primaryCta.href}>{heroCopy.primaryCta.label}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/70 bg-transparent text-white hover:bg-white hover:text-kawai-black"
              asChild
            >
              <Link href={heroCopy.secondaryCta.href}>{heroCopy.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="bg-kawai-pearl py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <span
            aria-hidden
            className="mb-2 block font-[family-name:var(--font-brand-serif)] text-7xl leading-none text-kawai-gold md:text-8xl"
          >
            &ldquo;
          </span>
          <blockquote className="mx-auto max-w-4xl font-[family-name:var(--font-brand-serif)] text-[clamp(1.6rem,3.4vw,2.75rem)] italic leading-[1.3] text-kawai-black">
            {manifestoCopy}
          </blockquote>
          <div className="mx-auto mt-10 h-px w-16 bg-kawai-gold" />
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

      {/* Heritage */}
      <section id="story" className="bg-kawai-pearl py-24">
        <div className="container mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="inline-flex items-baseline gap-4 border-l-2 border-kawai-gold-on-light pl-5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-kawai-gold-on-light">
                {heritageCopy.plate.kicker}
              </span>
              <span className="font-[family-name:var(--font-brand-serif)] text-4xl text-kawai-black">
                {heritageCopy.plate.year}
              </span>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-red">
              <span className="h-px w-8 bg-kawai-red" />
              {heritageCopy.eyebrow}
            </p>
            <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4vw,3rem)] leading-tight text-kawai-black">
              {heritageCopy.headline}
            </h2>
            <p className="mb-7 leading-relaxed text-kawai-charcoal">{heritageCopy.body}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              {heritageCopy.links.map((l) => (
                <ArrowLink key={l.href} href={l.href}>
                  {l.label}
                </ArrowLink>
              ))}
            </div>
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

      {/* Technology */}
      <section className="bg-kawai-black py-24 text-white">
        <div className="container mx-auto max-w-3xl px-6">
          <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-gold">
            <span className="h-px w-8 bg-kawai-gold" />
            {technologyCopy.eyebrow}
          </p>
          <h2 className="mb-7 font-[family-name:var(--font-brand-serif)] text-[clamp(2.2rem,5vw,3.5rem)] leading-tight">
            {technologyCopy.headline}
          </h2>
          <p className="mb-8 leading-relaxed text-white/80">{technologyCopy.body}</p>
          <ArrowLink href={technologyCopy.link.href} tone="light">
            {technologyCopy.link.label}
          </ArrowLink>
        </div>
      </section>

      {/* Go Deeper */}
      <section className="bg-kawai-pearl py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-red">
            <span className="h-px w-8 bg-kawai-red" />
            {goDeeperCopy.eyebrow}
          </p>
          <h2 className="mb-12 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.25rem)] leading-tight text-kawai-black">
            {goDeeperCopy.headline}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {goDeeperCopy.cards.map((c) => (
              <article
                key={c.title}
                className="rounded-lg border border-kawai-neutral bg-white p-9"
              >
                <h3 className="mb-3 font-[family-name:var(--font-brand-serif)] text-2xl text-kawai-black">
                  {c.title}
                </h3>
                <p className="mb-6 max-w-sm text-sm leading-relaxed text-kawai-charcoal">
                  {c.body}
                </p>
                <div className="flex flex-col gap-2.5">
                  {c.links.map((l) => (
                    <ArrowLink
                      key={l.href}
                      href={l.href}
                      tone={l.primary ? 'red' : 'muted'}
                    >
                      {l.label}
                    </ArrowLink>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-kawai-black py-24 text-white">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-kawai-gold">
                <span className="h-px w-8 bg-kawai-gold" />
                {collectionsCopy.eyebrow}
              </p>
              <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.25rem)] leading-tight">
                {collectionsCopy.headline}
              </h2>
            </div>
            <ArrowLink href={collectionsCopy.cta.href} tone="light">
              {collectionsCopy.cta.label}
            </ArrowLink>
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
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={codaCopy.primaryCta.href}>{codaCopy.primaryCta.label}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/70 bg-transparent text-white hover:bg-white hover:text-kawai-black"
              asChild
            >
              <Link href={codaCopy.secondaryCta.href}>{codaCopy.secondaryCta.label}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
