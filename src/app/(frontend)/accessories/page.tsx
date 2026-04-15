import type { Metadata } from 'next'
import { getCatalogPianoProducts, getAccessoriesForPage } from '@/lib/payload/queries'
import { AccessoriesHero } from '@/components/piano/accessories-hero'
import { PianoBuilder } from '@/components/piano/piano-builder'
import { AccessoriesPageContent } from '@/components/piano/accessories-page-content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Piano Accessories | Kawai',
  description:
    'Browse Kawai piano accessories and find compatible add-ons for your instrument. Benches, pedals, covers, headphones, and more.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/accessories`,
  },
}

export default async function AccessoriesPage() {
  const [pianos, accessories] = await Promise.all([
    getCatalogPianoProducts(),
    getAccessoriesForPage(),
  ])

  return (
    <>
      <AccessoriesHero />
      <div id="piano-builder">
        <PianoBuilder pianos={pianos} accessories={accessories} />
      </div>
      <div id="accessories-browse">
        <AccessoriesPageContent pianos={pianos} accessories={accessories} />
      </div>
    </>
  )
}
