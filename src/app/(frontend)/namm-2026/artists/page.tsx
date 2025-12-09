import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Music } from 'lucide-react'

// Lazy load components for optimal performance
const ArtistCarouselHero = dynamic(() => import('@/components/namm/artists/ArtistCarouselHero'), {
  loading: () => <ArtistHeroSkeleton />
})

const ArtistLineupSection = dynamic(() => import('@/components/namm/ArtistLineupSection'), {
  loading: () => <FeaturedArtistsGridSkeleton />
})

const PerformanceSchedule = dynamic(() => import('@/components/namm/artists/PerformanceSchedule'), {
  loading: () => <PerformanceScheduleSkeleton />
})

const ArtistProfiles = dynamic(() => import('@/components/namm/artists/ArtistProfiles'), {
  loading: () => <ArtistProfilesSkeleton />
})

const ArtistsCTA = dynamic(() => import('@/components/namm/artists/ArtistsCTA'), {
  loading: () => <ArtistsCTASkeleton />
})

// Enable ISR - revalidate daily (matches main NAMM page)
export const revalidate = 86400 // 24 hours

// SEO Metadata
export const metadata: Metadata = {
  title: 'NAMM 2026 Artists | Kawai Piano Performances & Schedule',
  description: 'Meet the artists performing at Kawai\'s NAMM 2026 booth. See performance schedules, artist bios, and exclusive demonstrations January 22-24 at the Anaheim Convention Center.',
  keywords: [
    'namm 2026 artists',
    'kawai artists namm',
    'namm 2026 performances',
    'piano artists namm',
    'kawai artist demonstrations',
    'namm artist lineup',
    'namm performance schedule',
    'kawai endorsed artists',
    'namm 2026 concerts',
    'piano demonstrations namm',
    'kawai artist roster',
    'namm artist performances 2026'
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/artists`
  },
  openGraph: {
    title: 'NAMM 2026 Artists | Kawai Piano Performances',
    description: 'Experience world-class artists performing on Kawai instruments at NAMM 2026. January 22-24, Anaheim Convention Center.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/artists`,
    siteName: 'Kawai Piano',
    images: [
      {
        url: '/images/namm/og-namm-2026-artists.jpg',
        width: 1200,
        height: 630,
        alt: 'NAMM 2026 Artists - Kawai Piano Performances'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAMM 2026 Artists | Kawai Piano Performances',
    description: 'World-class artists performing January 22-24 in Anaheim',
    images: ['/images/namm/og-namm-2026-artists.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
}

// Loading Skeletons
function ArtistHeroSkeleton() {
  return (
    <section className="relative min-h-screen bg-black animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-6 px-6">
          <div className="h-20 bg-white/10 rounded-lg w-[600px] max-w-full mx-auto" />
          <div className="h-10 bg-white/10 rounded-lg w-[400px] max-w-full mx-auto" />
          <div className="flex gap-3 justify-center mt-12">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-2 w-12 bg-white/10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedArtistsGridSkeleton() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#F5F1E8] via-[#EDE8DF] to-[#F0EBE3] animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-[#2C2826]/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="grid lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-32 bg-[#2C2826]/10 rounded-xl" />
              <div className="h-64 bg-[#2C2826]/10 rounded-xl" />
              <div className="h-64 bg-[#2C2826]/10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PerformanceScheduleSkeleton() {
  return (
    <section className="py-24 bg-zinc-950 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-white/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="space-y-4 max-w-4xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArtistProfilesSkeleton() {
  return (
    <section className="py-24 bg-black animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-white/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="space-y-16 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-white/5 rounded-xl" />
              <div className="space-y-4">
                <div className="h-6 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
                <div className="h-32 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArtistsCTASkeleton() {
  return (
    <section className="py-16 bg-gradient-to-b from-zinc-950 to-black animate-pulse">
      <div className="container mx-auto px-6 text-center">
        <div className="h-8 bg-white/10 rounded-lg mb-6 w-1/2 mx-auto" />
        <div className="h-12 bg-white/10 rounded-lg w-48 mx-auto" />
      </div>
    </section>
  )
}

// Breadcrumb Navigation Component
function ArtistsBreadcrumb() {
  return (
    <nav className="bg-black border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center space-x-2 text-sm">
          <Link
            href="/namm-2026"
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>NAMM 2026</span>
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white font-medium">Artists</span>
        </div>
      </div>
    </nav>
  )
}

// Quick Info Bar Component
function QuickInfoBar() {
  return (
    <div className="bg-gradient-to-r from-[#E31937] to-[#FF3B55] sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">January 22-24, 2026</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Anaheim Convention Center</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/30" />
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>Free Artist Performances</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main NAMM 2026 Artists Page Component
export default function NAMMArtistsPage() {
  return (
    <>
      {/* Hero Carousel Section */}
      <Suspense fallback={<ArtistHeroSkeleton />}>
        <ArtistCarouselHero />
      </Suspense>

      {/* Artist Lineup Section - Matches main NAMM page design */}
      <section id="artists" className="scroll-mt-20">
        <Suspense fallback={<FeaturedArtistsGridSkeleton />}>
          <ArtistLineupSection />
        </Suspense>
      </section>

      {/* Performance Schedule Section */}
      <section id="schedule" className="scroll-mt-20">
        <Suspense fallback={<PerformanceScheduleSkeleton />}>
          <PerformanceSchedule />
        </Suspense>
      </section>

      {/* Artist Profiles Section */}
      <section id="profiles" className="scroll-mt-20">
        <Suspense fallback={<ArtistProfilesSkeleton />}>
          <ArtistProfiles />
        </Suspense>
      </section>

      {/* CTA Section - Return to Main NAMM Page */}
      <Suspense fallback={<ArtistsCTASkeleton />}>
        <ArtistsCTA />
      </Suspense>
    </>
  )
}
