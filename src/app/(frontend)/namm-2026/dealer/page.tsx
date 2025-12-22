import type { Metadata } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load components for optimal performance
const DealerReceptionHero = dynamic(() => import('@/components/namm/dealer/DealerReceptionHero'), {
  loading: () => <HeroSkeleton />
})

const PianoShowcaseDetailed = dynamic(() => import('@/components/namm/experience/PianoShowcaseDetailed'), {
  loading: () => <FeaturedProductsSkeleton />
})

const DealerEventDetailsSection = dynamic(() => import('@/components/namm/dealer/DealerEventDetailsSection'), {
  loading: () => <EventDetailsSkeleton />
})

const DealerVenueMapSection = dynamic(() => import('@/components/namm/dealer/DealerVenueMapSection'), {
  loading: () => <VenueMapSkeleton />
})

// Enable ISR - revalidate daily (matches main NAMM page)
export const revalidate = 86400 // 24 hours

// SEO Metadata
export const metadata: Metadata = {
  title: 'Exclusive Dealer Reception | Kawai at NAMM 2026 | January 22',
  description: 'You\'re invited to an exclusive evening with Kawai at NAMM 2026. Join us for cocktails, hors d\'oeuvres, hands-on piano demonstrations, and networking. January 22, 5:30-7 PM in Room 213D at Anaheim Convention Center.',
  keywords: [
    'dealer reception namm 2026',
    'kawai dealer event',
    'exclusive dealer reception',
    'namm 2026 dealer event',
    'cocktail reception namm',
    'networking event namm',
    'piano demonstration event',
    'anaheim convention center event',
    'kawai dealers namm',
    'dealer networking namm',
    'exclusive piano event',
    'kawai dealer reception 2026',
    'namm dealer party',
    'piano dealer event',
    'kawai exclusive event',
    'namm dealer networking'
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/dealer`
  },
  openGraph: {
    title: 'Exclusive Dealer Reception | Kawai at NAMM 2026',
    description: 'Join us for an exclusive evening with cocktails, hors d\'oeuvres, hands-on demonstrations, and networking. January 22, 5:30-7 PM in Room 213D.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'}/namm-2026/dealer`,
    siteName: 'Kawai Piano',
    images: [
      {
        url: '/images/namm/og-namm-2026-dealer.jpg',
        width: 1200,
        height: 630,
        alt: 'Exclusive Dealer Reception - Kawai at NAMM 2026'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exclusive Dealer Reception | Kawai at NAMM 2026',
    description: 'Join us for an exclusive evening January 22, 5:30-7 PM in Room 213D, Anaheim',
    images: ['/images/namm/og-namm-2026-dealer.jpg']
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
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-2 w-12 bg-white/10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
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

function EventDetailsSkeleton() {
  return (
    <section className="py-24 bg-white animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-kawai-black/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="space-y-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-8 items-center">
              <div className="h-40 w-40 bg-kawai-black/10 rounded-full mx-auto" />
              <div className="space-y-4">
                <div className="h-8 bg-kawai-black/10 rounded-lg w-3/4" />
                <div className="h-4 bg-kawai-black/10 rounded w-full" />
                <div className="h-4 bg-kawai-black/10 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VenueMapSkeleton() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#F5F1E8] to-[#EDE8DF] animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-10 bg-[#2C2826]/10 rounded-lg mb-12 w-1/3 mx-auto" />
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="h-6 bg-[#2C2826]/10 rounded w-3/4" />
            <div className="h-4 bg-[#2C2826]/10 rounded w-full" />
            <div className="h-4 bg-[#2C2826]/10 rounded w-5/6" />
            <div className="space-y-3 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-[#2C2826]/10 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="h-96 bg-[#2C2826]/10 rounded-xl" />
        </div>
      </div>
    </section>
  )
}

// Main NAMM 2026 Dealer Reception Page Component
export default function NAMMDealerReceptionPage() {
  return (
    <>
      {/* Hero Carousel */}
      <Suspense fallback={<HeroSkeleton />}>
        <DealerReceptionHero />
      </Suspense>

      {/* Event Details */}
      <section id="event-details" className="scroll-mt-20">
        <Suspense fallback={<EventDetailsSkeleton />}>
          <DealerEventDetailsSection />
        </Suspense>
      </section>

      {/* Featured Products */}
      <section id="featured-products" className="scroll-mt-20">
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <PianoShowcaseDetailed
            title="Featured at the Dealer Reception"
            subtitle="Experience our most innovative and exclusive pianos firsthand. From transparent crystal grands to revolutionary hybrids, explore the instruments that define Kawai's commitment to excellence."
          />
        </Suspense>
      </section>

      {/* Venue & Map */}
      <section id="venue" className="scroll-mt-20">
        <Suspense fallback={<VenueMapSkeleton />}>
          <DealerVenueMapSection />
        </Suspense>
      </section>
    </>
  )
}
