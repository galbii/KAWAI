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

// Enable ISR - revalidate daily for event updates to refresh dynamic title
export const revalidate = 86400 // 24 hours

/**
 * Dynamic Metadata Generation for NAMM 2026
 *
 * Automatically adjusts page title and description based on proximity to the event date.
 * This optimizes for time-sensitive search queries and improves CTR.
 *
 * SEO Benefits:
 * - Matches search intent at different stages (preview, countdown, live, recap)
 * - Creates urgency with countdown messaging
 * - Signals fresh content to Google's QDF (Query Deserves Freshness) algorithm
 * - Captures different keyword variations over time
 */
export async function generateMetadata(): Promise<Metadata> {
  const eventStartDate = new Date('2026-01-22T09:00:00-08:00') // Jan 22, 2026
  const eventEndDate = new Date('2026-01-24T18:00:00-08:00')   // Jan 24, 2026
  const now = new Date()

  // Calculate days until event (positive = future, negative = past)
  const daysUntil = Math.ceil((eventStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const eventInProgress = now >= eventStartDate && now <= eventEndDate

  // Dynamic title and description based on time period
  let dynamicTitle: string
  let dynamicDescription: string
  let ogTitle: string
  let twitterTitle: string

  if (daysUntil > 30) {
    // More than a month away - Preview phase
    dynamicTitle = 'Kawai at NAMM 2026 | Booth Preview, Artist Lineup & Featured Pianos'
    dynamicDescription = 'Preview the Kawai booth at NAMM Show 2026 (January 22-24, Anaheim). Discover featured artists, new piano releases, and exclusive demonstrations at Booth #9110, Hall B.'
    ogTitle = 'Kawai Booth Experience at NAMM Show 2026 - Preview & Details'
    twitterTitle = 'Preview Kawai at NAMM 2026'
  } else if (daysUntil > 14) {
    // 2-4 weeks away - Early anticipation
    dynamicTitle = `Kawai at NAMM 2026 | ${daysUntil} Days Until Show - Booth #9110 Details`
    dynamicDescription = `NAMM 2026 is ${daysUntil} days away! Get ready for the complete Kawai booth experience: live artist performances, hands-on piano demos, and expert consultations at Booth #9110, Hall B, Anaheim Convention Center.`
    ogTitle = `Kawai at NAMM 2026 - ${daysUntil} Days Until Show`
    twitterTitle = `NAMM 2026 in ${daysUntil} Days - Kawai Booth`
  } else if (daysUntil > 7) {
    // 1-2 weeks away - Building momentum
    dynamicTitle = `Kawai at NAMM 2026 | ${daysUntil} Days Away - Artist Schedule & Demos`
    dynamicDescription = `Only ${daysUntil} days until NAMM 2026! Experience Kawai's latest innovations: Crystal Grand Piano, HERALBONY collaboration, Novus hybrids, and Shigeru Kawai concert grands. Live performances daily at Booth #9110.`
    ogTitle = `Kawai at NAMM 2026 - ${daysUntil} Days to Go!`
    twitterTitle = `${daysUntil} Days Until NAMM 2026`
  } else if (daysUntil > 0) {
    // Final week - High urgency
    dynamicTitle = `Kawai at NAMM 2026 This Week | ${daysUntil} Days Away - Final Details`
    dynamicDescription = `NAMM 2026 starts in just ${daysUntil} days! Final details for the Kawai booth at Anaheim Convention Center. Live artist performances, exclusive product launches, and hands-on demos. Booth #9110, Hall B. Jan 22-24.`
    ogTitle = `NAMM 2026 This Week - Kawai Booth in ${daysUntil} Days`
    twitterTitle = `${daysUntil} Days Until NAMM!`
  } else if (eventInProgress) {
    // During the event - Maximum urgency
    dynamicTitle = 'LIVE NOW: Kawai at NAMM 2026 | Booth #9110, Hall B, Anaheim'
    dynamicDescription = 'Visit Kawai at NAMM Show 2026 TODAY! Booth #9110, Hall B, Anaheim Convention Center. Live artist performances, hands-on piano demonstrations, and exclusive consultations. Show hours: 10 AM - 6 PM.'
    ogTitle = 'LIVE NOW: Kawai at NAMM 2026 - Booth #9110'
    twitterTitle = 'LIVE: Kawai at NAMM 2026'
  } else {
    // After the event - Recap phase
    dynamicTitle = 'Kawai at NAMM 2026 | Highlights, Recap & New Product Reveals'
    dynamicDescription = 'Relive the Kawai experience at NAMM 2026. Performance highlights, new product announcements, exclusive booth photos, and coverage from the show. Discover what we unveiled at Booth #9110.'
    ogTitle = 'NAMM 2026 Highlights - Kawai Booth Recap'
    twitterTitle = 'NAMM 2026 Kawai Recap'
  }

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    keywords: [
      'namm 2026',
      'namm show 2026',
      'kawai booth namm 2026',
      'namm 2026 dates',
      'kawai namm',
      'best booths at namm',
      'piano demonstrations namm 2026',
      'what to expect at namm 2026',
      'namm 2026 performances',
      'namm 2026 artists',
      'namm 2026 artist schedule',
      'namm 2026 events schedule',
      'live artist performances',
      'hands on piano demos',
      'kawai pianos namm 2026',
      'namm anaheim 2026',
      'anaheim convention center',
      'namm 2026 exhibitors',
      'piano booth experience',
      'namm 2026 piano showcase',
      'hybrid piano demonstrations',
      'shigeru kawai',
      'novus hybrid piano',
      'concert grand piano demos',
      'piano technology showcase',
      'professional piano demonstration',
      'namm 2026 schedule',
      'namm 2026 tickets',
      'namm 2026 live music',
      'piano performance calendar'
    ],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026`
    },
    openGraph: {
      title: ogTitle,
      description: dynamicDescription,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026`,
      siteName: 'Kawai Piano',
      images: [
        {
          url: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg',
          width: 1200,
          height: 800,
          alt: 'Kawai Crystal Grand Piano at NAMM 2026 - Premium Piano Experience'
        },
        {
          url: 'https://pub-486ee03121a24ede8b51409434e22709.r2.dev/artists/David%20Snyder%20Photo%202.jpg',
          width: 1200,
          height: 800,
          alt: 'Live Artist Performance at Kawai NAMM 2026 Booth'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: dynamicDescription,
      images: ['https://pub-486ee03121a24ede8b51409434e22709.r2.dev/pianos/crystal/DSC_1820_sRGB.jpg']
    },
    robots: {
      index: true,
      follow: true
    }
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
          {/* Booth Experience Section - Scroll Anchor (FIRST - What to expect) */}
          <section id="booth-experience" className="scroll-mt-20">
            <Suspense fallback={<BoothExperienceSkeleton />}>
              <BoothExperienceSection />
            </Suspense>
          </section>

          {/* Featured Products Section - Scroll Anchor (SECOND - What you'll see) */}
          <section id="featured-products" className="scroll-mt-20">
            <Suspense fallback={<FeaturedProductsSkeleton />}>
              <FeaturedProductsSection />
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
    </main>
  )
}
