import type { Metadata } from 'next'
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'
import AboutScroll from './_components/AboutScroll'

export const revalidate = 3600

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

export default function AboutPage() {
  return <AboutScroll />
}
