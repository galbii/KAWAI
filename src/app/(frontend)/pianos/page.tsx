import { getCatalogProductsDirect } from '@/lib/payload/queries'
import { PianosBrowser } from '@/components/piano/PianosBrowser'

export const revalidate = 3600

export const metadata = {
  title: 'Pianos — Kawai',
  description:
    'Browse the complete Kawai piano collection — grand, digital, upright, and hybrid instruments.',
}

export default async function PianosPage() {
  const products = await getCatalogProductsDirect()
  return <PianosBrowser products={products} />
}
