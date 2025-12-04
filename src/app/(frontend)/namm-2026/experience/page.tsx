import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for code splitting
const ExperienceCarouselHero = dynamic(() => import('@/components/namm/experience/ExperienceCarouselHero'), {
  loading: () => <HeroSkeleton />
})

const PianoShowcaseDetailed = dynamic(() => import('@/components/namm/experience/PianoShowcaseDetailed'), {
  loading: () => <ShowcaseSkeleton />
})

// Enable ISR - revalidate daily for event updates
export const revalidate = 86400 // 24 hours

// SEO Metadata for NAMM 2026 Experience Page
export const metadata: Metadata = {
  title: 'Featured Pianos | Kawai at NAMM 2026 | Crystal Grand, HERALBONY, Novus',
  description: 'Discover the exclusive pianos featured at the Kawai booth at NAMM 2026. From the ultra-rare CR-45 Crystal Grand to revolutionary Novus hybrids and artistic collaborations. January 22-24 in Anaheim.',
  keywords: [
    'kawai booth namm 2026',
    'namm 2026 featured pianos',
    'CR-45 crystal grand',
    'transparent piano',
    'HERALBONY collaboration',
    'novus hybrid piano',
    'namm 2026 exclusive pianos',
    'piano demonstrations namm',
    'hands on piano demos',
    'kawai booth tour',
    'kawai pianos namm 2026',
    'shigeru kawai',
    'hybrid piano technology',
    'artistic piano collaboration',
    'anaheim convention center',
    'namm 2026 piano showcase'
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/experience`
  },
  openGraph: {
    title: 'Featured Pianos at Kawai Booth | NAMM 2026',
    description: 'Experience exclusive pianos: CR-45 Crystal Grand (3 per year), HERALBORY artistic collaboration, revolutionary Novus hybrids, and more. January 22-24 at Anaheim Convention Center.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/experience`,
    siteName: 'Kawai Piano',
    images: [
      {
        url: '/images/namm/og-namm-2026-experience.jpg',
        width: 1200,
        height: 630,
        alt: 'Featured Pianos at Kawai Booth NAMM 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Featured Pianos | Kawai at NAMM 2026',
    description: 'Discover exclusive pianos: CR-45 Crystal Grand, HERALBONY collaboration, Novus hybrids. January 22-24 in Anaheim.',
    images: ['/images/namm/og-namm-2026-experience.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
}

// Loading Skeletons
function HeroSkeleton() {
  return (
    <section className="relative min-h-screen bg-black animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-6 px-6">
          <div className="h-20 bg-white/10 rounded-lg w-[600px] max-w-full mx-auto" />
          <div className="h-10 bg-white/10 rounded-lg w-[400px] max-w-full mx-auto" />
          <div className="flex gap-3 justify-center mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 w-12 bg-white/10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ShowcaseSkeleton() {
  return (
    <section className="py-32 bg-black animate-pulse">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 bg-white/10 rounded-lg mb-20 w-2/3 mx-auto" />
        <div className="space-y-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-12 min-h-[700px]">
              <div className="h-full bg-white/10 rounded-3xl" />
              <div className="space-y-6">
                <div className="h-12 bg-white/10 rounded w-3/4" />
                <div className="h-8 bg-white/10 rounded w-1/2" />
                <div className="h-24 bg-white/10 rounded w-full" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 bg-white/10 rounded" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main NAMM 2026 Experience Page Component
export default function NAMMExperiencePage() {
  return (
    <main className="relative scroll-smooth bg-black">
      {/* Carousel Hero Section (WIP) */}
      <Suspense fallback={<HeroSkeleton />}>
        <ExperienceCarouselHero />
      </Suspense>

      {/* Detailed Piano Showcase Section */}
      <Suspense fallback={<ShowcaseSkeleton />}>
        <PianoShowcaseDetailed />
      </Suspense>
    </main>
  )
}
