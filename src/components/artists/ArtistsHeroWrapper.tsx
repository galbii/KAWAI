'use client'

import dynamic from 'next/dynamic'
import type { Artist } from '@/payload-types'

// Dynamic import with SSR disabled to avoid framer-motion bundling issues during prerender
const ArtistsHero = dynamic(() => import('./ArtistsHero'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-kawai-charcoal animate-pulse" />
  )
})

interface ArtistsHeroWrapperProps {
  artists: Artist[]
}

export default function ArtistsHeroWrapper({ artists }: ArtistsHeroWrapperProps) {
  return <ArtistsHero artists={artists} />
}
