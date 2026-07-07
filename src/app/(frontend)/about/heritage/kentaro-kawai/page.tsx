import type { Metadata } from 'next'
import {
  BrandArrowLink,
  BrandCTA,
  BrandEyebrow,
  JsonLd,
  Reveal,
  Section,
  StatStrip,
} from '@/components/brand'
import { buildBreadcrumb, buildOrganizationNode, buildPageMetadata, ORG_ID } from '@/lib/brand/seo'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { PortraitPlaceholder } from './_components/PortraitPlaceholder'
import { PullQuote } from './_components/PullQuote'
import { CentennialArc } from './_components/CentennialArc'
import { AscentPath } from './_components/AscentPath'
import {
  SEO,
  ascent,
  closing,
  hero,
  philosophy,
  quotes,
  stats,
  succession,
  vision,
} from './_data'

export const revalidate = 3600

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: SEO.path,
    title: SEO.title,
    description: SEO.description,
    keywords: [...SEO.keywords],
    ogType: 'article',
    image: SEO.ogImage,
    imageAlt: SEO.ogImageAlt,
  })
}

/**
 * JSON-LD @graph. Reuses the canonical Organization node (shared @id) so Google
 * resolves one company across every heritage page. A Person node describes the
 * sitting CEO — deliberately WITHOUT an `image` field, because no portrait is
 * published, and WITHOUT any relationship/family claim, matching Kawai's public
 * "fourth president / fourth generation" convention. Facts limited to the
 * verified set: title, tenure, Kobe University, birth year.
 */
function buildJsonLd(siteUrl: string) {
  const url = `${siteUrl}${SEO.path}`
  const personId = `${url}#kentaro-kawai`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Kentaro Kawai',
        jobTitle: 'President & CEO',
        description:
          'The fourth president & CEO of Kawai Musical Instruments, who took the role in February 2024 and leads the company toward its 2027 centennial.',
        birthDate: '1977',
        worksFor: { '@id': ORG_ID },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Kobe University' },
        knowsAbout: ['Piano manufacturing', 'Digital pianos', 'Musical instrument industry'],
      },
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: 'Kentaro Kawai — Leading Kawai Toward Its Second Century',
        description: SEO.description,
        image: SEO.ogImage,
        datePublished: SEO.datePublished,
        dateModified: SEO.datePublished,
        inLanguage: 'en',
        mainEntityOfPage: url,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        about: [{ '@id': personId }, { '@id': ORG_ID }],
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Heritage', path: '/about/heritage' },
        { name: 'Kentaro Kawai', path: SEO.path },
      ]),
    ],
  }
}

export default async function KentaroKawaiPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <div className="bg-kawai-pearl">
      <JsonLd data={jsonLd} />

      {/* Hero — the page's single <h1>, paired with the portrait placeholder */}
      <section className="bg-kawai-pearl pt-32 md:pt-40">
        <div className="container mx-auto px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
            <Reveal>
              <BrandEyebrow tone="red">{hero.eyebrow}</BrandEyebrow>
              <h1 className="mt-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1.05] tracking-tight text-kawai-black">
                {hero.title}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-kawai-charcoal">
                {hero.lede}
              </p>
            </Reveal>

            <div className="mx-auto w-full max-w-sm md:mx-0">
              <PortraitPlaceholder label={hero.portraitLabel} note={hero.portraitNote} />
            </div>
          </div>

          {/* Centennial line — the page's signature visual */}
          <Reveal className="mx-auto mt-20 max-w-6xl md:mt-28">
            <CentennialArc />
          </Reveal>
        </div>
      </section>

      {/* By-the-numbers band */}
      <StatStrip stats={[...stats]} tone="black" className="mt-24 md:mt-32" />

      {/* The succession — brief, factual */}
      <Section
        tone="pearl"
        center
        eyebrow={succession.eyebrow}
        title={succession.title}
        intro={succession.body}
        maxWidth="max-w-3xl"
      >
        <span className="sr-only">His own words on the role follow.</span>
      </Section>

      {/* First pull-quote — the weight of the role */}
      <Section tone="white" padding="py-16 md:py-24" maxWidth="max-w-4xl">
        <PullQuote {...quotes.responsibility} tone="light" />
      </Section>

      {/* The path to the presidency */}
      <Section
        tone="pearl"
        eyebrow={ascent.eyebrow}
        title={ascent.title}
        intro={ascent.intro}
        maxWidth="max-w-3xl"
      >
        <div className="mt-12">
          <AscentPath steps={ascent.steps} />
        </div>
      </Section>

      {/* The philosophy */}
      <Section
        tone="white"
        center
        eyebrow={philosophy.eyebrow}
        title={philosophy.title}
        intro={philosophy.body}
        maxWidth="max-w-3xl"
      >
        <span className="sr-only">His purpose, in his own words, follows.</span>
      </Section>

      {/* Dark pull-quote moment — purpose */}
      <section className="bg-kawai-black py-24 md:py-32">
        <div className="container mx-auto px-6">
          <PullQuote {...quotes.purpose} tone="dark" />
        </div>
      </section>

      {/* Vision toward 2027 */}
      <Section
        tone="pearl"
        eyebrow={vision.eyebrow}
        title={vision.title}
        intro={vision.intro}
        maxWidth="max-w-5xl"
      >
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {vision.items.map((item) => (
            <Reveal key={item.title}>
              <div className="h-full rounded-xl border border-kawai-black/10 bg-white p-7">
                <div className="font-[family-name:var(--font-brand-sans)] text-[11px] font-semibold uppercase tracking-[0.24em] text-kawai-red">
                  {item.category}
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-brand-serif)] text-xl font-light leading-snug text-kawai-black md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-kawai-charcoal">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Second light pull-quote — music is essential */}
      <Section tone="white" padding="py-16 md:py-24" maxWidth="max-w-4xl">
        <PullQuote {...quotes.essential} tone="light" />
      </Section>

      {/* The Yaramaika spirit — a small, human closing note before the CTA */}
      <Section tone="pearl" center maxWidth="max-w-2xl" padding="py-16 md:py-20">
        <PullQuote {...quotes.yaramaika} tone="light" />
      </Section>

      {/* Closing — CTA + cross-links */}
      <section className="relative overflow-hidden bg-kawai-black py-24 text-white md:py-28">
        <div className="container relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <div className="mb-5">
            <BrandEyebrow tone="gold" centered>
              {closing.eyebrow}
            </BrandEyebrow>
          </div>
          <h2 className="mb-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-white">
            {closing.title}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/72">
            {closing.body}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <BrandCTA href="/pianos" variant="red">
              Explore the pianos
            </BrandCTA>
            <BrandCTA href="/about/heritage" variant="outline">
              Back to the heritage
            </BrandCTA>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <BrandArrowLink href="/about/heritage/hirotaka-kawai" tone="light">
              His predecessor, Hirotaka Kawai
            </BrandArrowLink>
            <BrandArrowLink href="/technology" tone="light">
              The technology he leads
            </BrandArrowLink>
            <BrandArrowLink href="/about" tone="muted">
              Back to About
            </BrandArrowLink>
          </div>
        </div>
      </section>
    </div>
  )
}
