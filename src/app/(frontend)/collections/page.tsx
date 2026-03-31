import { getCollectionsForBrowser } from '@/lib/payload/queries'
import type { CollectionForBrowser } from '@/lib/payload/queries'
import { CollectionsBrowser } from './CollectionsBrowser'

export const revalidate = 3600

export const metadata = {
  title: 'Collections | Kawai Pianos',
  description: 'Explore the full range of Kawai piano collections — from digital to concert grand.',
}

export default async function CollectionsPage() {
  const allCollections = await getCollectionsForBrowser()
  return <CollectionsBrowser collections={allCollections} />
}
