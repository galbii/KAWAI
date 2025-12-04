import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Structured Data
import { NAMMStructuredData } from '@/components/namm/NAMMStructuredData'

// Hero Section (from Agent 1)
const HeroSection = dynamic(() => import('@/components/namm/HeroSection'), {
  loading: () => <HeroSkeleton />
})

// Event Info Box (from Agent 1)
const EventInfoBox = dynamic(() => import('@/components/namm/EventInfoBox'), {
  loading: () => <InfoBoxSkeleton />
})

// Featured Products Section (from Agent 2)
const FeaturedProductsSection = dynamic(() => import('@/components/namm/FeaturedProductsSection'), {
  loading: () => <FeaturedProductsSkeleton />
})

// Booth Experience Section (from Agent 2)
const BoothExperienceSection = dynamic(() => import('@/components/namm/BoothExperienceSection'), {
  loading: () => <BoothExperienceSkeleton />
})

// Artist Lineup Section (from Agent 3)
const ArtistLineupSection = dynamic(() => import('@/components/namm/ArtistLineupSection'), {
  loading: () => <ArtistLineupSkeleton />
})

// Plan Your Visit Section (from Agent 3)
const PlanYourVisitSection = dynamic(() => import('@/components/namm/PlanYourVisitSection'), {
  loading: () => <PlanYourVisitSkeleton />
})

// Can't Attend CTA (from Agent 3)
const CantAttendCTA = dynamic(() => import('@/components/namm/CantAttendCTA'), {
  loading: () => <CTASkeleton />
})

// Enable ISR - revalidate daily for event updates
export const revalidate = 86400 // 24 hours

// SEO Metadata for NAMM 2026 Landing Page
export const metadata: Metadata = {
  title: 'Kawai at NAMM 2026 | January 22-24 | Anaheim Convention Center',
  description: 'Visit Kawai at NAMM 2026 to experience the latest piano innovations. Try the Novus NV6/NV12 hybrid pianos, Shigeru Kawai concert grands, and digital pianos. Booth TBA, Anaheim Convention Center.',
  keywords: [
    'namm 2026',
    'namm show 2026',
    'kawai namm',
    'namm 2026 dates',
    'namm anaheim',
    'kawai pianos',
    'hybrid pianos',
    'digital pianos',
    'novus hybrid piano',
    'shigeru kawai',
    'namm booths',
    'piano demos',
    'kawai booth namm',
    'anaheim convention center',
    'music trade show',
    'piano exhibition',
    'kawai namm 2026'
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026`
  },
  openGraph: {
    title: 'Experience Kawai at NAMM 2026',
    description: 'January 22-24, 2026 | Anaheim Convention Center | Hands-on demos, artist performances, and exclusive product reveals',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026`,
    siteName: 'Kawai Piano',
    images: [
      {
        url: '/images/namm/og-namm-2026.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai at NAMM 2026 - Experience Innovation'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai at NAMM 2026',
    description: 'Visit us January 22-24 in Anaheim for exclusive piano demos and performances',
    images: ['/images/namm/og-namm-2026.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
}

// Loading Skeletons for Lazy-Loaded Components
function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-kawai-black animate-pulse">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 bg-kawai-pearl/20 rounded-lg mb-6 w-3/4 mx-auto" />
          <div className="h-8 bg-kawai-pearl/20 rounded-lg mb-8 w-1/2 mx-auto" />
          <div className="h-12 bg-kawai-pearl/20 rounded-lg w-48 mx-auto" />
        </div>
      </div>
    </section>
  )
}

function InfoBoxSkeleton() {
  return (
    <div className="bg-kawai-pearl/20 rounded-2xl p-6 animate-pulse">
      <div className="h-6 bg-kawai-black/20 rounded mb-4 w-1/2" />
      <div className="space-y-3">
        <div className="h-4 bg-kawai-black/20 rounded w-3/4" />
        <div className="h-4 bg-kawai-black/20 rounded w-2/3" />
        <div className="h-4 bg-kawai-black/20 rounded w-full" />
      </div>
    </div>
  )
}

function FeaturedProductsSkeleton() {
  return (
    <section className="py-24 bg-white animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-kawai-black/10 rounded-lg mb-8 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-kawai-black/10 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

function BoothExperienceSkeleton() {
  return (
    <section className="py-24 bg-kawai-pearl animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-kawai-black/10 rounded-lg mb-8 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-64 bg-kawai-black/10 rounded-lg" />
          <div className="space-y-4">
            <div className="h-6 bg-kawai-black/10 rounded w-full" />
            <div className="h-6 bg-kawai-black/10 rounded w-3/4" />
            <div className="h-6 bg-kawai-black/10 rounded w-5/6" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ArtistLineupSkeleton() {
  return (
    <section className="py-24 bg-white animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-kawai-black/10 rounded-lg mb-8 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-kawai-black/10 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

function PlanYourVisitSkeleton() {
  return (
    <section className="py-24 bg-kawai-pearl animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-kawai-black/10 rounded-lg mb-8 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-64 bg-kawai-black/10 rounded-lg" />
          <div className="h-64 bg-kawai-black/10 rounded-lg" />
        </div>
      </div>
    </section>
  )
}

function CTASkeleton() {
  return (
    <section className="py-16 bg-kawai-black animate-pulse">
      <div className="container mx-auto px-6 text-center">
        <div className="h-8 bg-kawai-pearl/20 rounded-lg mb-6 w-1/2 mx-auto" />
        <div className="h-12 bg-kawai-pearl/20 rounded-lg w-48 mx-auto" />
      </div>
    </section>
  )
}

// Main NAMM 2026 Page Component
export default function NAMM2026Page() {
  return (
    <main className="relative scroll-smooth">
      {/* Structured Data for SEO */}
      <NAMMStructuredData />

      {/* Hero Section - Full Viewport (starts at very top edge) */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Event Info Box - Bottom Right (Desktop: horizontal bar, Mobile: circular icon) */}
      <aside className="fixed bottom-8 right-8 z-50">
        <Suspense fallback={<InfoBoxSkeleton />}>
          <EventInfoBox />
        </Suspense>
      </aside>

      {/* Main Content Area - Full Width */}
      <div className="relative bg-white">
        {/* Main Content Sections */}
        <div>
          {/* Featured Products Section - Scroll Anchor */}
          <section id="featured-products" className="scroll-mt-20">
            <Suspense fallback={<FeaturedProductsSkeleton />}>
              <FeaturedProductsSection />
            </Suspense>
          </section>

          {/* Booth Experience Section - Scroll Anchor */}
          <section id="booth-experience" className="scroll-mt-20">
            <Suspense fallback={<BoothExperienceSkeleton />}>
              <BoothExperienceSection />
            </Suspense>
          </section>

          {/* Artist Lineup Section - Scroll Anchor */}
          <section id="artists" className="scroll-mt-20">
            <Suspense fallback={<ArtistLineupSkeleton />}>
              <ArtistLineupSection />
            </Suspense>
          </section>

          {/* Plan Your Visit Section - Scroll Anchor */}
          <section id="plan-your-visit" className="scroll-mt-20">
            <Suspense fallback={<PlanYourVisitSkeleton />}>
              <PlanYourVisitSection />
            </Suspense>
          </section>
        </div>
      </div>

      {/* Can't Attend CTA - Full Width Footer */}
      <Suspense fallback={<CTASkeleton />}>
        <CantAttendCTA />
      </Suspense>
    </main>
  )
}
