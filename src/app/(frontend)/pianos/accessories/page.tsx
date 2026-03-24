import type { Metadata } from 'next'
import { getCatalogPianoProducts, getAccessoriesForPage } from '@/lib/payload/queries'
import { AccessoriesPageContent } from '@/components/piano/accessories-page-content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Piano Accessories | Kawai',
  description:
    'Browse Kawai piano accessories and find compatible add-ons for your instrument. Benches, pedals, covers, headphones, and more.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pianos/accessories`,
  },
}

export default async function AccessoriesPage() {
  const [pianos, accessories] = await Promise.all([
    getCatalogPianoProducts(),
    getAccessoriesForPage(),
  ])

  return <AccessoriesPageContent pianos={pianos} accessories={accessories} />
}
