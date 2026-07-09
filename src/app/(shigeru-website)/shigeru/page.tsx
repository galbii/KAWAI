import type { Metadata } from 'next'
import { getStaticAlternates } from '@/lib/site-context'
import { getShigeruPageData } from './_data/shopify'
import { ShigeruHero } from './_components/ShigeruHero'
import { ShigeruProductShowcase } from './_components/ShigeruProductShowcase'
import { ShigeruArtistsSection } from './_components/ShigeruArtistsSection'
import { MasterArtisansSection } from './_components/MasterArtisansSection'
import { ShigeruContactBox } from './_components/ShigeruContactBox'


export const metadata: Metadata = {
  title: 'Shigeru Kawai Grand Pianos | SK-2 to SK-EX | Handcrafted in Japan',
  description:
    "Shigeru Kawai grand pianos are the pinnacle of Japanese piano craftsmanship. Six handcrafted models from the SK-2 salon grand to the SK-EX concert grand — fewer than 20 SK-EX instruments are made each year at the Ryuyo factory in Hamamatsu, Japan.",
  keywords: [
    'shigeru kawai',
    'shigeru kawai grand piano',
    'shigeru kawai sk-ex',
    'shigeru kawai sk-7',
    'concert grand piano',
    'japanese grand piano',
    'handcrafted grand piano',
    'luxury grand piano',
    'kawai grand piano',
    'master piano artisan',
    'ryuyo factory',
    'shigeru kawai price',
    'shigeru kawai dealer',
  ],
  alternates: getStaticAlternates('/shigeru'),
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kawaius.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Shigeru Kawai Grand Pianos',
  description:
    'The complete collection of six Shigeru Kawai handcrafted grand pianos — from the SK-2 Classic Salon Grand to the SK-EX Concert Grand.',
  url: `${siteUrl}/shigeru`,
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Shigeru Kawai', item: `${siteUrl}/shigeru` },
    ],
  },
}

export default async function ShigeruPage() {
  const productData = await getShigeruPageData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ShigeruHero />
      <ShigeruProductShowcase productData={productData} />
      <ShigeruArtistsSection />
      <MasterArtisansSection />
      <ShigeruContactBox />
    </>
  )
}
