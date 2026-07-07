import type { Metadata } from 'next'
import Image from 'next/image'
import { BrandArrowLink, BrandCTA, JsonLd, Reveal, Section, StatStrip } from '@/components/brand'
import { buildBreadcrumb, buildOrganizationNode, buildPageMetadata, ORG_ID } from '@/lib/brand/seo'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { brandImages } from '@/lib/brand/images'
import { CraftFeature } from './_components/CraftFeature'
import { CraftMedia } from './_components/CraftMedia'
import {
  SEO,
  artisans,
  closing,
  craftStats,
  factories,
  faqs,
  features,
  hero,
  heroImage,
  intro,
} from './_data'

export const revalidate = 3600

const PATH = '/about/craftsmanship'

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: PATH,
    title: SEO.title,
    description: SEO.description,
    keywords: SEO.keywords,
    ogType: 'article',
    image: heroImage,
    imageAlt: 'Kawai piano soundboard and action craftsmanship',
  })
}

function buildJsonLd(siteUrl: string) {
  const url = `${siteUrl}${PATH}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: 'How Kawai Pianos Are Made — Craftsmanship & Materials',
        description: SEO.description,
        about: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        image: heroImage,
        mainEntityOfPage: url,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Craftsmanship', path: PATH },
      ]),
    ],
  }
}

export default async function CraftsmanshipPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <div className="bg-kawai-pearl">
      <JsonLd data={jsonLd} />

      {/* Hero — the page's single <h1>, then a large soundboard image */}
      <section className="bg-kawai-pearl pt-32 md:pt-40">
        <div className="container mx-auto px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-kawai-charcoal/55">
              {hero.eyebrow}
            </p>
            <h1 className="mt-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.75rem,6.5vw,5rem)] font-light leading-[1.04] tracking-tight text-kawai-black">
              {hero.title}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-kawai-charcoal">
              {hero.lede}
            </p>
            <div className="mt-8 flex justify-center">
              <BrandArrowLink href={hero.cta.href} tone="red">
                {hero.cta.label}
              </BrandArrowLink>
            </div>
          </Reveal>

          <div className="mx-auto mt-14 max-w-6xl md:mt-20">
            <CraftMedia
              image={heroImage}
              imageAlt="Kawai piano soundboard and action craftsmanship"
              label="Kawai Craftsmanship"
              priority
              aspectClass="aspect-[16/9]"
            />
          </div>
        </div>
      </section>

      {/* Opening statement */}
      <Section
        tone="white"
        center
        title={intro.title}
        intro={intro.body}
        maxWidth="max-w-3xl"
      >
        <span className="sr-only">Continue to see how a Kawai is made.</span>
      </Section>

      {/* By-the-numbers craft band */}
      <StatStrip stats={[...craftStats]} tone="black" />

      {/* Where Kawai pianos are made — the two-factory transparency section */}
      <Section
        id="the-workshop"
        tone="pearl"
        eyebrow={factories.eyebrow}
        title={factories.title}
        intro={factories.intro}
        maxWidth="max-w-5xl"
        className="scroll-mt-20"
      >
        <div className="mt-4 grid gap-10 md:grid-cols-2 md:gap-14">
          {factories.places.map((place) => (
            <Reveal key={place.name}>
              <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light leading-snug text-kawai-black md:text-2xl">
                {place.name}
              </h3>
              <p className="mt-4 leading-relaxed text-kawai-charcoal">{place.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Material / process features — alternating image and text */}
      <div>
        {features.map((feature, i) => (
          <Section key={feature.title} tone={i % 2 === 0 ? 'white' : 'pearl'} maxWidth="max-w-6xl">
            <CraftFeature feature={feature} index={i} />
          </Section>
        ))}
      </div>

      {/* Bridge to the technology detail pages */}
      <Section tone="white" center maxWidth="max-w-3xl" padding="py-16 md:py-20">
        <p className="text-base leading-relaxed text-kawai-charcoal sm:text-lg">
          The materials here are only half the story — the engineering behind them is the other.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <BrandArrowLink href="/technology" tone="red">
            Kawai technology
          </BrandArrowLink>
          <BrandArrowLink href="/technology/carbon-fiber-technology" tone="red">
            Inside ABS-Carbon
          </BrandArrowLink>
        </div>
      </Section>

      {/* The single dark, full-bleed moment — Master Piano Artisans */}
      <section className="relative overflow-hidden bg-kawai-black text-white">
        <Image
          src={brandImages.luxeRoom}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/50"
        />
        <div className="container relative z-10 mx-auto px-6 py-28 md:py-40">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-kawai-gold">
              {artisans.eyebrow}
            </p>
            <h2 className="mt-5 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-tight">
              {artisans.title}
            </h2>
            <p className="mx-auto mt-7 max-w-2xl leading-relaxed text-white/80">{artisans.body}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {artisans.links.map((link) => (
                <BrandArrowLink key={link.href} href={link.href} tone="light">
                  {link.label}
                </BrandArrowLink>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ — mirrored into FAQPage JSON-LD */}
      <Section
        id="faq"
        tone="pearl"
        eyebrow="Common Questions"
        title="How a Kawai is made — answered"
        intro="The questions buyers ask most about where our pianos come from and what they’re built from."
        maxWidth="max-w-3xl"
      >
        <dl className="mt-6 divide-y divide-kawai-neutral/70 border-t border-kawai-neutral/70">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-7">
              <dt>
                <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black md:text-2xl">
                  {faq.q}
                </h3>
              </dt>
              <dd className="mt-3 leading-relaxed text-kawai-charcoal">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Closing — CTA + cross-links */}
      <Section tone="white" center title={closing.title} intro={closing.body} maxWidth="max-w-2xl">
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <BrandCTA href="/find-a-dealer" variant="red">
            Find a Dealer
          </BrandCTA>
          <BrandCTA href="/pianos" variant="dark-outline">
            Explore the Pianos
          </BrandCTA>
        </div>
        <div className="mt-10">
          <BrandArrowLink href="/about" tone="red">
            Back to About Kawai
          </BrandArrowLink>
        </div>
      </Section>
    </div>
  )
}
