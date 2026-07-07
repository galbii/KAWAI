import type { Metadata } from 'next'
import { getSite, getSiteUrl } from '@/lib/site-context'
import {
  buildPageMetadata,
  buildBreadcrumb,
  buildOrganizationNode,
  ORG_ID,
  koichiPersonId,
} from '@/lib/brand/seo'
import {
  JsonLd,
  Section,
  StatStrip,
  BrandTimeline,
  BrandCTA,
  BrandArrowLink,
} from '@/components/brand'
import {
  HeritageRail,
  HeritageHero,
  EraSection,
  GenerationTrio,
} from './_components/heritage'
import {
  heritageSeo,
  heritageStats,
  eras,
  milestones,
  heritageClose,
} from './_data'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: heritageSeo.path,
    title: heritageSeo.title,
    description: heritageSeo.description,
    keywords: [...heritageSeo.keywords],
    ogType: 'article',
    image: heritageSeo.ogImage,
    imageAlt: heritageSeo.ogImageAlt,
  })
}

/**
 * JSON-LD @graph for the heritage narrative. Reuses the canonical Organization
 * and founder Person entities (shared @ids) so Google resolves one company and
 * one founder no matter which page it crawls. Facts verified against
 * kawai-global.com/company/history and kawaius.com/company/timeline.
 */
function buildJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${heritageSeo.path}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: heritageSeo.title,
        description: heritageSeo.description,
        image: heritageSeo.ogImage,
        datePublished: heritageSeo.datePublished,
        dateModified: heritageSeo.datePublished,
        inLanguage: 'en',
        mainEntityOfPage: pageUrl,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        about: [{ '@id': ORG_ID }, { '@id': koichiPersonId(siteUrl) }],
        mentions: [{ '@id': koichiPersonId(siteUrl) }],
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Heritage', path: '/about/heritage' },
      ]),
    ],
  }
}

export default async function HeritagePage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <div className="bg-kawai-pearl">
      <JsonLd data={jsonLd} />
      <HeritageRail />

      <HeritageHero />

      <StatStrip stats={heritageStats} tone="black" />

      {eras.map((era) => (
        <EraSection key={era.id} era={era} />
      ))}

      {/* The three generations */}
      <Section
        tone="white"
        center
        eyebrow="Three Generations"
        title="One family, one standard"
        intro="From a founder at the workbench to a grandson at the intersection of craft and robotics, the same conviction has passed from hand to hand — that a piano is worth building only if it is built better than before."
        maxWidth="max-w-6xl"
      >
        <div className="mt-4">
          <GenerationTrio />
        </div>
      </Section>

      {/* Milestone timeline */}
      <Section
        tone="pearl"
        eyebrow="The Timeline"
        title="A century of milestones"
        intro="The dated arc of Kawai — from the founder’s birth to a global piano maker celebrated on the world’s great stages."
        maxWidth="max-w-3xl"
      >
        <div className="mt-10">
          <BrandTimeline
            tone="pearl"
            items={milestones.map((m) => ({
              marker: m.year,
              title: m.title,
              description: m.description,
            }))}
          />
        </div>
      </Section>

      {/* Explore further — cross-links */}
      <Section
        tone="white"
        eyebrow="Explore Further"
        title="The craft behind the history"
        maxWidth="max-w-4xl"
      >
        <div className="mt-2 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-kawai-black/10 bg-kawai-pearl p-6">
            <div className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black">
              The founder
            </div>
            <p className="mt-2 font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed text-kawai-charcoal">
              Koichi Kawai’s personal story — from a boy in Hamamatsu to the inventor of Japan’s first piano action.
            </p>
            <div className="mt-4">
              <BrandArrowLink href="/about/heritage/koichi-kawai" tone="red">
                Meet Koichi Kawai
              </BrandArrowLink>
            </div>
          </div>
          <div className="rounded-lg border border-kawai-black/10 bg-kawai-pearl p-6">
            <div className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black">
              The craftsmanship
            </div>
            <p className="mt-2 font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed text-kawai-charcoal">
              How a Kawai piano is made — the materials, the artistry and the exacting standards behind every instrument.
            </p>
            <div className="mt-4">
              <BrandArrowLink href="/about/craftsmanship" tone="red">
                How Kawai pianos are made
              </BrandArrowLink>
            </div>
          </div>
          <div className="rounded-lg border border-kawai-black/10 bg-kawai-pearl p-6">
            <div className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black">
              The technology
            </div>
            <p className="mt-2 font-[family-name:var(--font-brand-sans)] text-sm leading-relaxed text-kawai-charcoal">
              From the ABS composite action to the carbon-fibre Millennium III — the engineering that defines a Kawai.
            </p>
            <div className="mt-4">
              <BrandArrowLink href="/technology" tone="red">
                Explore the technology
              </BrandArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-kawai-black py-24 text-white md:py-28">
        <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <div className="mb-5">
            <span className="inline-flex items-center gap-2.5 font-[family-name:var(--font-brand-sans)] text-xs font-semibold uppercase tracking-[0.28em] text-kawai-gold">
              <span aria-hidden className="block h-px w-5 bg-kawai-gold" />
              {heritageClose.eyebrow}
              <span aria-hidden className="block h-px w-5 bg-kawai-gold" />
            </span>
          </div>
          <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-white">
            {heritageClose.title}
          </h2>
          <p className="mx-auto mb-10 max-w-xl font-[family-name:var(--font-brand-sans)] text-base leading-relaxed text-white/72">
            {heritageClose.body}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <BrandCTA href="/pianos" variant="red">
              Explore the pianos
            </BrandCTA>
            <BrandCTA href="/find-a-dealer" variant="outline">
              Find a dealer
            </BrandCTA>
          </div>
          <div className="mt-10">
            <BrandArrowLink href="/about" tone="muted">
              Back to About
            </BrandArrowLink>
          </div>
        </div>
      </section>
    </div>
  )
}
