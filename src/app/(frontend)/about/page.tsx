import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { JsonLd } from '@/components/brand'
import { buildBreadcrumb, buildOrganizationNode, ORG_ID } from '@/lib/brand/seo'
import AboutScroll from './_components/AboutScroll'
import AboutAnswers, { aboutFaqs } from './_components/AboutAnswers'

export const revalidate = 3600

/**
 * JSON-LD for the About hub. `AboutPage.mainEntity` points at the canonical
 * Organization node (shared @id), and a FAQPage mirrors the visible Q&A in
 * AboutAnswers so Google/LLMs can cite the where-made / who-makes / is-it-good
 * answers directly. Facts live in `aboutFaqs` (single source of truth).
 */
function buildJsonLd(siteUrl: string) {
  const url = `${siteUrl}/about`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationNode(siteUrl),
      {
        '@type': 'AboutPage',
        '@id': `${url}#aboutpage`,
        url,
        name: 'About Kawai',
        mainEntity: { '@id': ORG_ID },
      },
      {
        '@type': 'FAQPage',
        mainEntity: aboutFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      buildBreadcrumb(siteUrl, [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ]),
    ],
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const url = getSiteUrl(site) + '/about'
  return {
    title: 'About Kawai | Crafting Inspiration Since 1927',
    description:
      'Since 1927, three generations of the Kawai family have crafted inspiration through innovative piano technology, scientific research, and an unwavering commitment to quality.',
    alternates: {
      canonical: url,
      languages: getSiteAlternates('/about'),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: 'KAWAI',
      title: 'About Kawai | Crafting Inspiration Since 1927',
      description:
        'Nearly a century of innovation. Explore the Kawai story — our founder, our philosophy, our technology, and the artists who choose us.',
      images: [
        {
          url: '/images/banners/GX-7-BLAK-grand-styling.webp',
          width: 1200,
          height: 630,
          alt: 'Kawai GX-7 grand piano',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Kawai | Crafting Inspiration Since 1927',
      description: 'Nearly a century of innovation. Explore the Kawai story.',
      images: ['/images/banners/GX-7-BLAK-grand-styling.webp'],
    },
  }
}

export default async function AboutPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutScroll />
      <AboutAnswers />
    </>
  )
}
