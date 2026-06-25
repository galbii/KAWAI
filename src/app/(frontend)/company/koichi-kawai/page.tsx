import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import { chapters, storyImages } from './_components/spiritoso-data'
import {
  StoryHero,
  ChapterRail,
  StoryChapter,
  ScoreMovement,
  SpiritosoFilm,
  StoryCoda,
} from './_components/spiritoso'

export const revalidate = 3600

const SEO_DESCRIPTION =
  "Koichi Kawai, founder of Kawai: from a boy in Hamamatsu who apprenticed under Torakusu Yamaha, to building Japan's first piano action, to founding Kawai in 1927."

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const url = getSiteUrl(site) + '/company/koichi-kawai'
  return {
    title: 'Koichi Kawai — Founder of Kawai Pianos | Spiritoso',
    description: SEO_DESCRIPTION,
    keywords: [
      'Koichi Kawai',
      'founder of Kawai',
      'who founded Kawai',
      'Kawai founder',
      'Kawai history',
      'Kawai founded 1927',
      'Koichi Kawai biography',
      'Spiritoso',
    ],
    alternates: {
      canonical: url,
      languages: getSiteAlternates('/company/koichi-kawai'),
    },
    openGraph: {
      type: 'article',
      url,
      siteName: 'Kawai Pianos',
      title: 'Koichi Kawai — Founder of Kawai Pianos',
      description: SEO_DESCRIPTION,
      publishedTime: '2026-04-02',
      images: [
        {
          url: storyImages.koichi,
          width: 1200,
          height: 630,
          alt: 'Koichi Kawai, founder of Kawai',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Koichi Kawai — Founder of Kawai Pianos',
      description: SEO_DESCRIPTION,
      images: [storyImages.koichi],
    },
  }
}

/**
 * JSON-LD knowledge graph for the page. The English-language entity SERP for
 * Koichi Kawai is uncontested (no EN Wikipedia article), and Google already
 * tracks the entity via Wikidata Q3198322 — clean Person + VideoObject schema
 * is the highest-leverage way to claim it. Facts verified against Wikidata and
 * kawai-global.com/company/history.
 */
function buildJsonLd(siteUrl: string) {
  const personId = `${siteUrl}/company/koichi-kawai#koichi-kawai`
  const orgId = 'https://www.kawai-global.com/#organization'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': personId,
        name: 'Koichi Kawai',
        alternateName: '河合小市',
        jobTitle: 'Founder',
        description:
          "Founder of Kawai Musical Instruments. A pioneering inventor who built Japan's first complete piano action and founded Kawai in 1927.",
        birthDate: '1886-01-05',
        deathDate: '1955-10-05',
        birthPlace: { '@type': 'Place', name: 'Hamamatsu, Shizuoka, Japan' },
        nationality: 'Japanese',
        image: storyImages.koichi,
        award: 'Medal with Blue Ribbon (1953)',
        knowsAbout: ['Piano manufacturing', 'Piano action design', 'Musical instrument engineering'],
        sameAs: [
          'https://www.wikidata.org/wiki/Q3198322',
          'https://ja.wikipedia.org/wiki/河合小市',
          'https://viaf.org/viaf/252996867',
          'https://id.loc.gov/authorities/names/no2021048536',
          'https://id.ndl.go.jp/auth/ndlna/00712378',
        ],
      },
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'Kawai Musical Instruments',
        url: 'https://www.kawai-global.com/',
        foundingDate: '1927',
        foundingLocation: { '@type': 'Place', name: 'Hamamatsu, Shizuoka, Japan' },
        founder: { '@id': personId },
        sameAs: ['https://en.wikipedia.org/wiki/Kawai_Musical_Instruments'],
      },
      {
        '@type': 'VideoObject',
        name: 'Spiritoso — The Story of Koichi Kawai',
        description:
          "An animated short film on the origins of Kawai — the story of founder Koichi Kawai, from a boy in Hamamatsu to the inventor of Japan's first domestically made piano action.",
        thumbnailUrl: 'https://img.youtube.com/vi/AVaa7UmqD5g/maxresdefault.jpg',
        uploadDate: '2026-04-02',
        duration: 'PT1M23S',
        embedUrl: 'https://www.youtube.com/embed/AVaa7UmqD5g',
        contentUrl: 'https://www.youtube.com/watch?v=AVaa7UmqD5g',
        publisher: { '@id': orgId },
        about: { '@id': personId },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Company', item: `${siteUrl}/company` },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Koichi Kawai',
            item: `${siteUrl}/company/koichi-kawai`,
          },
        ],
      },
    ],
  }
}

export default async function KoichiKawaiPage() {
  const site = await getSite()
  const jsonLd = buildJsonLd(getSiteUrl(site))

  return (
    <main className="bg-kawai-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterRail />
      <StoryHero />
      {chapters.map((chapter, index) => (
        <StoryChapter key={chapter.id} chapter={chapter} index={index} />
      ))}
      <ScoreMovement />
      <SpiritosoFilm />
      <StoryCoda />
    </main>
  )
}
