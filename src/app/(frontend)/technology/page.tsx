import type { Metadata } from 'next'
import Image from 'next/image'
import { BrandArrowLink, BrandCTA, JsonLd, Reveal, Section, StatStrip } from '@/components/brand'
import { buildBreadcrumb, buildOrganizationNode, buildPageMetadata, ORG_ID } from '@/lib/brand/seo'
import { getSite, getSiteUrl } from '@/lib/site-context'
import { brandImages } from '@/lib/brand/images'
import { TechFeature } from './_components/TechFeature'
import { TechMedia } from './_components/TechMedia'
import {
  SEO,
  heroImage,
  millenniumSignature,
  neotex,
  pillars,
  researchHighlights,
  techFaqs,
  technologies,
} from './_data'

export const revalidate = 3600

const PATH = '/technology'

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: PATH,
    title: SEO.title,
    description: SEO.description,
    keywords: SEO.keywords,
    image: heroImage,
    imageAlt: 'Kawai piano craftsmanship',
  })
}

function buildJsonLd(siteUrl: string) {
  const url = `${siteUrl}${PATH}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'TechArticle',
        '@id': `${url}#techarticle`,
        headline: 'Kawai Piano Technology — The Engineering Behind the Instrument',
        description: SEO.description,
        about: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
        image: heroImage,
        mainEntityOfPage: url,
      },
      {
        '@type': 'VideoObject',
        name: 'Kawai Millennium III Action',
        description:
          'How Kawai’s Millennium III action uses ABS-Carbon composite for a faster, stronger, more stable touch than conventional wooden actions.',
        thumbnailUrl: `https://img.youtube.com/vi/${millenniumSignature.videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${millenniumSignature.videoId}`,
        contentUrl: `https://www.youtube.com/watch?v=${millenniumSignature.videoId}`,
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'ItemList',
        name: 'Kawai Piano Technologies',
        itemListElement: technologies.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.name,
          url: `${siteUrl}${t.detailPath}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: techFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'Technology', path: PATH },
      ]),
    ],
  }
}

export default async function TechnologyPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <div className="bg-kawai-pearl">
      <JsonLd data={jsonLd} />

      {/* Hero — quiet headline, then a large image */}
      <section className="bg-kawai-pearl pt-32 md:pt-40">
        <div className="container mx-auto px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-kawai-charcoal/55">
              Technology
            </p>
            <h1 className="mt-6 font-[family-name:var(--font-brand-serif)] text-[clamp(2.75rem,6.5vw,5rem)] font-light leading-[1.04] tracking-tight text-kawai-black">
              Scientific Innovation Meets Musical Artistry
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-kawai-charcoal">
              Discover the cutting-edge technologies that make Kawai pianos the choice of competition
              winners, concert artists, and discerning musicians worldwide. Each innovation
              represents years of research, testing, and refinement.
            </p>
            <div className="mt-8 flex justify-center">
              <BrandArrowLink href="#technologies" tone="red">
                Explore Technologies
              </BrandArrowLink>
            </div>
          </Reveal>

          <div className="mx-auto mt-14 max-w-6xl md:mt-20">
            <TechMedia
              image={heroImage}
              imageAlt="Kawai piano craftsmanship"
              label="Kawai"
              priority
              aspectClass="aspect-[16/9]"
            />
          </div>
        </div>
      </section>

      {/* Intro statement */}
      <Section
        tone="white"
        center
        title="Pioneering Piano Technology"
        intro="From revolutionary composite materials to advanced digital sound processing, Kawai's technologies set new standards for piano performance, reliability, and musical expression."
        maxWidth="max-w-3xl"
      >
        <span className="sr-only">Explore the technologies below.</span>
      </Section>

      {/* Signature technology — Millennium III as Kawai's named differentiator */}
      <Section
        tone="black"
        eyebrow={millenniumSignature.eyebrow}
        title={millenniumSignature.name}
        intro={millenniumSignature.lede}
        maxWidth="max-w-5xl"
      >
        <Reveal className="mt-12">
          <TechMedia
            videoId={millenniumSignature.videoId}
            label={millenniumSignature.name}
            aspectClass="aspect-video"
          />
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {millenniumSignature.links.map((link) => (
            <BrandArrowLink key={link.href} href={link.href} tone="light">
              {link.label}
            </BrandArrowLink>
          ))}
        </div>
      </Section>
      <StatStrip stats={[...millenniumSignature.stats]} tone="pearl" />

      {/* Neotex — what the player actually touches (separates surface from action) */}
      <Section tone="white" maxWidth="max-w-5xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-kawai-charcoal/55">
              {neotex.eyebrow}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4vw,3rem)] font-light leading-[1.08] tracking-tight text-kawai-black">
              {neotex.name}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-kawai-charcoal sm:text-lg">
              {neotex.description}
            </p>
          </Reveal>
          <Reveal>
            <ul className="space-y-4 border-t border-kawai-black/10 pt-8">
              {neotex.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-kawai-charcoal">
                  <span
                    aria-hidden
                    className="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-kawai-red"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* The technologies */}
      <div id="technologies" className="scroll-mt-20">
        {technologies.map((tech, i) => (
          <Section key={tech.name} tone={i % 2 === 0 ? 'pearl' : 'white'} maxWidth="max-w-6xl">
            <TechFeature tech={tech} index={i} />
          </Section>
        ))}
      </div>

      {/* Research — minimal */}
      <Section
        id="research"
        tone="pearl"
        center
        title="Scientific Research & Validation"
        intro="Kawai's innovations aren't just theoretical—they're rigorously tested and validated through independent research, real-world performance data, and decades of professional use."
        maxWidth="max-w-3xl"
      >
        <div className="mx-auto mt-16 grid max-w-5xl gap-12 text-left md:grid-cols-3">
          {researchHighlights.map((research) => (
            <Reveal key={research.title}>
              <h3 className="font-[family-name:var(--font-brand-serif)] text-xl font-light text-kawai-black">
                {research.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-kawai-charcoal/80">
                {research.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {research.results.map((result) => (
                  <li key={result} className="text-sm leading-snug text-kawai-charcoal/60">
                    {result}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Method — minimal three-up */}
      <Section
        tone="white"
        center
        title="Innovation Through Scientific Method"
        intro="Kawai's approach to innovation combines traditional Japanese craftsmanship with rigorous scientific methodology. Every technology we develop undergoes extensive testing, validation, and real-world performance verification before becoming part of our instruments."
        maxWidth="max-w-3xl"
      >
        <div className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Reveal key={pillar.title} className="text-center">
              <h3 className="font-[family-name:var(--font-brand-serif)] text-2xl font-light text-kawai-black">
                {pillar.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-kawai-charcoal/75">
                {pillar.description}
              </p>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <BrandArrowLink href="/pianos" tone="red">
            Experience These Technologies
          </BrandArrowLink>
        </div>
      </Section>

      {/* The feel question — reframe the "plastic vs wood" objection researchers arrive with */}
      <Section
        id="the-feel-question"
        tone="pearl"
        eyebrow="The Feel Question"
        title="Composite, wood, and what your fingers actually feel"
        intro="The questions pianists ask before choosing a Kawai — answered plainly."
        maxWidth="max-w-3xl"
      >
        <dl className="mt-6 divide-y divide-kawai-neutral/70 border-t border-kawai-neutral/70">
          {techFaqs.map((faq) => (
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
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <BrandArrowLink href="/technology/piano-action" tone="red">
            How a piano action works
          </BrandArrowLink>
          <BrandArrowLink href="/technology/carbon-fiber-technology" tone="red">
            Inside ABS-Carbon
          </BrandArrowLink>
        </div>
      </Section>

      {/* Closing — the single dark, full-bleed moment */}
      <section className="relative overflow-hidden bg-kawai-black text-white">
        <Image
          src={brandImages.luxeRoom}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/45" />
        <div className="container relative z-10 mx-auto px-6 py-28 md:py-40">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <h2 className="font-[family-name:var(--font-brand-serif)] text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-tight">
              Experience Kawai Technology
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/75">
              Visit our showroom to experience these innovative technologies firsthand. Feel the
              difference that scientific research and Japanese craftsmanship make.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <BrandCTA href="/contact/schedule-visit" variant="red">
                Schedule a Technology Demo
              </BrandCTA>
              <BrandCTA href="/pianos" variant="outline">
                Browse Instruments
              </BrandCTA>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
