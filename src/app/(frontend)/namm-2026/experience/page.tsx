import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for code splitting
const ExperienceHero = dynamic(() => import('@/components/namm/experience/ExperienceHero'), {
  loading: () => <HeroSkeleton />
})

const InteractiveFeatures = dynamic(() => import('@/components/namm/experience/InteractiveFeatures'), {
  loading: () => <FeaturesSkeleton />
})

const DemoAreas = dynamic(() => import('@/components/namm/experience/DemoAreas'), {
  loading: () => <DemoSkeleton />
})

const BoothTour = dynamic(() => import('@/components/namm/experience/BoothTour'), {
  loading: () => <TourSkeleton />
})

const ExperienceActivities = dynamic(() => import('@/components/namm/experience/ExperienceActivities'), {
  loading: () => <ActivitiesSkeleton />
})

const EventSchedule = dynamic(() => import('@/components/namm/experience/EventSchedule'), {
  loading: () => <ScheduleSkeleton />
})

const PlanYourVisitCTA = dynamic(() => import('@/components/namm/experience/PlanYourVisitCTA'), {
  loading: () => <CTASkeleton />
})

// Enable ISR - revalidate daily for event updates
export const revalidate = 86400 // 24 hours

// SEO Metadata for NAMM 2026 Experience Page
export const metadata: Metadata = {
  title: 'Booth Experience | Kawai at NAMM 2026 | Interactive Demos & Tours',
  description: 'Experience the Kawai booth at NAMM 2026. Interactive piano demonstrations, virtual booth tour, live performances, and hands-on access to our complete lineup. January 22-24 in Anaheim.',
  keywords: [
    'kawai booth namm 2026',
    'namm 2026 booth experience',
    'piano demonstrations namm',
    'hands on piano demos',
    'kawai booth tour',
    'interactive piano booth',
    'namm 2026 exhibits',
    'piano showcase namm',
    'kawai pianos namm 2026',
    'live piano performances',
    'booth activities namm',
    'piano technology demonstrations',
    'anaheim convention center exhibits',
    'namm 2026 piano booths',
    'what to expect at namm'
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/experience`
  },
  openGraph: {
    title: 'Experience the Kawai Booth at NAMM 2026',
    description: 'Interactive demonstrations, live performances, and hands-on access to the complete Kawai lineup. January 22-24 at Anaheim Convention Center.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/experience`,
    siteName: 'Kawai Piano',
    images: [
      {
        url: '/images/namm/og-namm-2026-experience.jpg',
        width: 1200,
        height: 630,
        alt: 'Kawai Booth Experience at NAMM 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kawai Booth Experience | NAMM 2026',
    description: 'Explore interactive demos, live performances, and hands-on piano access. January 22-24 in Anaheim.',
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
    <section className="relative min-h-[70vh] bg-black animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-6 px-6">
          <div className="h-16 bg-white/10 rounded-lg w-96 max-w-full mx-auto" />
          <div className="h-8 bg-white/10 rounded-lg w-64 max-w-full mx-auto" />
          <div className="flex gap-3 justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-white/10 rounded-full w-32" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSkeleton() {
  return (
    <section className="py-24 bg-zinc-950 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-12 bg-white/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

function DemoSkeleton() {
  return (
    <section className="py-24 bg-black animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-12 bg-white/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-white/10 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TourSkeleton() {
  return (
    <section className="py-24 bg-zinc-900 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-12 bg-white/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-96 bg-white/10 rounded-lg" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ActivitiesSkeleton() {
  return (
    <section className="py-24 bg-black animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-12 bg-white/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

function ScheduleSkeleton() {
  return (
    <section className="py-24 bg-zinc-950 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-12 bg-white/10 rounded-lg mb-8 w-1/3 mx-auto" />
        <div className="flex gap-4 mb-8 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-white/10 rounded-lg w-32" />
          ))}
        </div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASkeleton() {
  return (
    <section className="py-24 bg-black animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-12 bg-white/10 rounded-lg mb-8 w-1/2 mx-auto" />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  )
}

// Main NAMM 2026 Experience Page Component
export default function NAMMExperiencePage() {
  return (
    <main className="relative scroll-smooth">
      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <ExperienceHero />
      </Suspense>

      {/* Main Content Area */}
      <div className="relative">
        {/* Interactive Features Section */}
        <section id="interactive-features" className="scroll-mt-20">
          <Suspense fallback={<FeaturesSkeleton />}>
            <InteractiveFeatures />
          </Suspense>
        </section>

        {/* Demo Areas Section */}
        <section id="demo-areas" className="scroll-mt-20">
          <Suspense fallback={<DemoSkeleton />}>
            <DemoAreas />
          </Suspense>
        </section>

        {/* Booth Tour Section */}
        <section id="booth-tour" className="scroll-mt-20">
          <Suspense fallback={<TourSkeleton />}>
            <BoothTour />
          </Suspense>
        </section>

        {/* Experience Activities Section */}
        <section id="activities" className="scroll-mt-20">
          <Suspense fallback={<ActivitiesSkeleton />}>
            <ExperienceActivities />
          </Suspense>
        </section>

        {/* Event Schedule Section */}
        <section id="schedule" className="scroll-mt-20">
          <Suspense fallback={<ScheduleSkeleton />}>
            <EventSchedule />
          </Suspense>
        </section>

        {/* Plan Your Visit CTA */}
        <section id="plan-visit" className="scroll-mt-20">
          <Suspense fallback={<CTASkeleton />}>
            <PlanYourVisitCTA />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
