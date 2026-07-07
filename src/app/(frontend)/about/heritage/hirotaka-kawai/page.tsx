import type { Metadata } from 'next'
import { getSite, getSiteUrl } from '@/lib/site-context'
import {
  buildPageMetadata,
  buildBreadcrumb,
  buildOrganizationNode,
  ORG_ID,
} from '@/lib/brand/seo'
import { JsonLd, Section } from '@/components/brand'
import { hirotakaSeo } from './_data'
import {
  MemorialHero,
  ThesisSection,
  LegacyChapters,
  HonourCallout,
  EraTimeline,
  SuccessionSection,
  ClosingCTA,
} from './_components/hirotaka'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: hirotakaSeo.path,
    title: hirotakaSeo.title,
    description: hirotakaSeo.description,
    keywords: [...hirotakaSeo.keywords],
    ogType: 'article',
    image: hirotakaSeo.ogImage,
    imageAlt: hirotakaSeo.ogImageAlt,
  })
}

/**
 * JSON-LD @graph for the Hirotaka Kawai legacy page. Reuses the canonical
 * Organization node (shared @id) so Google resolves one company across the
 * heritage pages. The Person node carries no `image` — no portrait of Hirotaka
 * exists yet. Facts are drawn from the page's verified fact list (see report):
 * born 1947-06-27, died 2024-02-23, president 1989–2024, Grand Cross (2010).
 */
function buildJsonLd(siteUrl: string) {
  const pageUrl = `${siteUrl}${hirotakaSeo.path}`
  const personId = `${pageUrl}#hirotaka-kawai`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Hirotaka Kawai',
        jobTitle: 'President (1989–2024)',
        description:
          'Third-generation president of Kawai — son of Shigeru Kawai and grandson of founder Koichi Kawai. He brought robotics into the workshop while reserving for human hands the work only a trained ear and touch can judge, launched the Shigeru Kawai grand line, and built Kawai into a global piano maker.',
        birthDate: hirotakaSeo.birthDate,
        deathDate: hirotakaSeo.deathDate,
        nationality: 'Japanese',
        worksFor: { '@id': ORG_ID },
        award: 'Grand Cross of the Order of Merit of the Republic of Poland (2010)',
        knowsAbout: [
          'Piano manufacturing',
          'Manufacturing automation and robotics',
          'Grand piano design',
        ],
      },
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: hirotakaSeo.title,
        description: hirotakaSeo.description,
        image: hirotakaSeo.ogImage,
        datePublished: hirotakaSeo.datePublished,
        dateModified: hirotakaSeo.datePublished,
        inLanguage: 'en',
        mainEntityOfPage: pageUrl,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        about: [{ '@id': personId }, { '@id': ORG_ID }],
        mentions: [{ '@id': personId }],
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Heritage', path: '/about/heritage' },
        { name: 'Hirotaka Kawai', path: hirotakaSeo.path },
      ]),
    ],
  }
}

export default async function HirotakaKawaiPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <div className="bg-kawai-pearl">
      <JsonLd data={jsonLd} />

      <MemorialHero />

      <ThesisSection />

      <LegacyChapters />

      <HonourCallout />

      {/* Era timeline */}
      <Section
        tone="pearl"
        eyebrow="A Thirty-Five-Year Tenure"
        title="The milestones of his presidency"
        intro="From his appointment in 1989 to a tenure remembered in 2024 — the dated arc of the longest presidency in Kawai’s history."
        maxWidth="max-w-3xl"
      >
        <EraTimeline />
      </Section>

      <SuccessionSection />

      <ClosingCTA />
    </div>
  )
}
