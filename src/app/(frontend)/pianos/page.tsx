import type { Metadata } from 'next'
import { getCatalogProductsDirect, getProductSpotlightNewsItems } from '@/lib/payload/queries'
import { PianosBrowser } from '@/components/piano/PianosBrowser'
import { NewsCarousel } from '@/components/homepage/news-carousel'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kawai Pianos — Grand, Digital, Upright & Hybrid Collection',
  description:
    'Browse the complete Kawai piano collection — Shigeru Kawai concert grands, GX BLAK grand pianos, Concert Artist digital pianos, and AnyTime hybrid instruments.',
  keywords: [
    'kawai piano',
    'kawai grand piano',
    'kawai digital piano',
    'kawai upright piano',
    'kawai hybrid piano',
    'shigeru kawai',
    'kawai ca series',
    'kawai gx series',
  ],
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/pianos` },
  openGraph: {
    title: 'Kawai Pianos — Complete Collection',
    description:
      'Browse the complete Kawai piano collection — Shigeru Kawai concert grands, GX BLAK grand pianos, Concert Artist digital pianos, and AnyTime hybrid instruments.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/pianos`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai Pianos — Complete Collection',
    description:
      'Browse the complete Kawai piano collection — Shigeru Kawai concert grands, GX BLAK grand pianos, Concert Artist digital pianos, and AnyTime hybrid instruments.',
  },
}

export default async function PianosPage() {
  const [products, spotlightItems] = await Promise.all([
    getCatalogProductsDirect(),
    getProductSpotlightNewsItems(),
  ])

  return (
    <>
      {spotlightItems.length > 0 && (
        <NewsCarousel data={{ autoPlayDuration: 7000, newsItems: spotlightItems }} />
      )}
      <PianosBrowser products={products} />
    </>
  )
}
