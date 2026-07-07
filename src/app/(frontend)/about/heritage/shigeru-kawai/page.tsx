import type { Metadata } from 'next'
import { JsonLd, Section, StatStrip, BrandArrowLink } from '@/components/brand'
import {
  buildBreadcrumb,
  buildOrganizationNode,
  buildPageMetadata,
  koichiPersonId,
  ORG_ID,
} from '@/lib/brand/seo'
import { getSite, getSiteUrl } from '@/lib/site-context'
import {
  ScientistHero,
  ParadoxSplit,
  PullQuote,
  BlueprintFigure,
  MilestoneLedger,
  ClosingCoda,
} from './_components/scientist'
import {
  PATH,
  SEO,
  stats,
  immersion,
  science,
  expansion,
  ryuyo,
  legacy,
  sources,
  atmosphere,
} from './_data'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: PATH,
    title: SEO.title,
    description: SEO.description,
    keywords: [...SEO.keywords],
    ogType: 'article',
  })
}

/**
 * JSON-LD @graph. A dedicated Person node for Shigeru Kawai the man (no `image`
 * — no verified portrait exists), linked to Koichi as `parent` to encode the
 * second-generation framing, plus the canonical Organization, an Article
 * wrapping the biography, and the breadcrumb trail. Facts verified against the
 * brief and Kawai's own English pages.
 */
function buildJsonLd(siteUrl: string) {
  const url = `${siteUrl}${PATH}`
  const personId = `${url}#shigeru-kawai`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Shigeru Kawai',
        description:
          'Second-generation president of Kawai (1955–1989). A hands-on craftsman who brought a scientific approach to piano making, founded Kawai America, and built the Ryuyo Grand Piano Factory and Research Laboratory.',
        jobTitle: 'President (1955–1989)',
        birthDate: '1922-07-28',
        deathDate: '2006-08-20',
        birthPlace: { '@type': 'Place', name: 'Maisaka, Shizuoka, Japan' },
        nationality: 'Japanese',
        worksFor: { '@id': ORG_ID },
        parent: { '@id': koichiPersonId(siteUrl) },
        award: 'Medal with Blue Ribbon (1985)',
        knowsAbout: ['Piano manufacturing', 'Piano action engineering', 'Musical instrument design'],
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: 'Shigeru Kawai — The Scientist Who Modernized a Craft',
        description: SEO.description,
        about: [{ '@id': personId }, { '@id': ORG_ID }],
        publisher: { '@id': ORG_ID },
        mainEntityOfPage: url,
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Heritage', path: '/about/heritage' },
        { name: 'Shigeru Kawai', path: PATH },
      ]),
    ],
  }
}

export default async function ShigeruKawaiPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <div className="bg-kawai-black">
      <JsonLd data={jsonLd} />

      {/* Hero — the page's single <h1> */}
      <ScientistHero />

      {/* Tenure figures */}
      <StatStrip stats={[...stats]} tone="black" />

      {/* The thesis: the paradox */}
      <ParadoxSplit />

      {/* Character hook — total immersion in the craft (light) */}
      <Section
        tone="pearl"
        eyebrow={immersion.eyebrow}
        title={immersion.title}
        maxWidth="max-w-5xl"
      >
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-14">
          <div className="space-y-5">
            {immersion.body.map((para) => (
              <p key={para.slice(0, 24)} className="leading-relaxed text-kawai-charcoal">
                {para}
              </p>
            ))}
          </div>
          <BlueprintFigure
            image={atmosphere.workshop}
            alt={immersion.figureAlt}
            label={immersion.figureLabel}
            figNumber="Fig. 02"
            tone="light"
          />
        </div>
        <div className="mt-14 border-t border-kawai-black/10 pt-12">
          <PullQuote quote={immersion.quote} tone="light" />
        </div>
      </Section>

      {/* Scientific approach — and the ABS breakthrough, carefully framed (dark) */}
      <Section
        tone="black"
        eyebrow={science.eyebrow}
        title={science.title}
        maxWidth="max-w-5xl"
      >
        <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center md:gap-14">
          <BlueprintFigure
            image={atmosphere.action}
            alt={science.figureAlt}
            label={science.figureLabel}
            figNumber="Fig. 03"
            tone="dark"
          />
          <div className="space-y-5">
            {science.body.map((para) => (
              <p key={para.slice(0, 24)} className="leading-relaxed text-white/78">
                {para}
              </p>
            ))}
            <div className="pt-3">
              <BrandArrowLink href="/technology" tone="light">
                The technology this began
              </BrandArrowLink>
            </div>
          </div>
        </div>
      </Section>

      {/* The modernizer, in dates — the ledger (light) */}
      <Section
        tone="pearl"
        eyebrow={expansion.eyebrow}
        title={expansion.title}
        intro={expansion.intro}
        maxWidth="max-w-4xl"
      >
        <MilestoneLedger milestones={expansion.milestones} />
      </Section>

      {/* Ryuyo as a research laboratory, and the EX (dark) */}
      <Section
        tone="black"
        eyebrow={ryuyo.eyebrow}
        title={ryuyo.title}
        maxWidth="max-w-5xl"
      >
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center md:gap-14">
          <div className="space-y-5">
            {ryuyo.body.map((para) => (
              <p key={para.slice(0, 24)} className="leading-relaxed text-white/78">
                {para}
              </p>
            ))}
          </div>
          <BlueprintFigure
            image={atmosphere.grand}
            alt={ryuyo.figureAlt}
            label={ryuyo.figureLabel}
            figNumber="Fig. 04"
            tone="dark"
          />
        </div>
      </Section>

      {/* Recognition, later years, and the namesake line (light) */}
      <Section
        tone="pearl"
        eyebrow={legacy.eyebrow}
        title={legacy.title}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-5">
          {legacy.body.map((para) => (
            <p key={para.slice(0, 24)} className="leading-relaxed text-kawai-charcoal">
              {para}
            </p>
          ))}
        </div>
        <div className="mt-14 border-t border-kawai-black/10 pt-12">
          <PullQuote quote={legacy.quote} tone="light" />
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <BrandArrowLink href="/pianos/shigeru-kawai" tone="red">
            Explore the Shigeru Kawai line
          </BrandArrowLink>
        </div>
      </Section>

      {/* Closing coda — CTAs + cross-links */}
      <ClosingCoda />

      {/* Sources — quiet footnote */}
      <section className="bg-kawai-black pb-16 text-center">
        <p className="font-[family-name:var(--font-brand-sans)] text-[11px] uppercase tracking-[0.2em] text-white/35">
          Sources:{' '}
          {sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && <span aria-hidden> · </span>}
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/60"
              >
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </section>
    </div>
  )
}
