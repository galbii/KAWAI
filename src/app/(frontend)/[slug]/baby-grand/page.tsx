import { Suspense } from 'react'
import { HeroSection } from './components/HeroSection'
import { PremiumHeritage } from './components/PremiumHeritage'
import { MasterArtisans } from './components/MasterArtisans'
import { PremiumBentoGallery } from './components/PremiumBentoGallery'
import { ConversionCTA } from './components/ConversionCTA'
import { SignatureExperience } from './components/SignatureExperience'
import { SignatureExperienceProvider } from './components/SignatureExperienceContext'
import type { SignaturePageData } from '@/lib/types/signature'

// Static slug for this baby-grand signature page
const BABY_GRAND_SLUG = 'baby-grand'

// Loading skeleton for hero section
function HeroSkeleton() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-kawai-black animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-kawai-black/50 to-kawai-black/80"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="h-6 bg-kawai-pearl/20 rounded mx-auto mb-4 w-48"></div>
        <div className="h-16 bg-kawai-pearl/20 rounded mx-auto mb-6 w-96"></div>
        <div className="h-6 bg-kawai-pearl/20 rounded mx-auto mb-8 w-64"></div>
        <div className="flex gap-4 justify-center">
          <div className="h-12 bg-kawai-pearl/20 rounded w-48"></div>
          <div className="h-12 bg-kawai-pearl/20 rounded w-48"></div>
        </div>
      </div>
    </section>
  )
}

// Static data for baby-grand signature page
function getBabyGrandSignatureData(): SignaturePageData {
  return {
    slug: BABY_GRAND_SLUG,
    title: 'Baby Grand Signature Collection',
    isActive: true,
    heroSection: {
      exclusiveText: "",
      titlePrefix: "",
      titleMain: "Baby Grand Signature Event",
      titleSuffix: "",
      subtitle: "Own a piece of musical history and refined craftsmanship",
      description: "Own a piece of musical history and refined craftsmanship. Reserve your appointment today, spots are limited.",
      heroBackgroundImage: null,
      primaryCta: {
        text: "View Signature",
        action: "scroll"
      },
      secondaryCta: {
        text: "Join Event",
        action: "modal"
      },
      overlayOpacity: 0.4,
      textAlignment: "center",
      showScrollIndicator: false
    },
    seo: {
      metaTitle: 'Baby Grand Signature Collection | Kawai Pianos',
      metaDescription: 'Discover the exclusive Baby Grand Signature Collection featuring premium Kawai pianos curated for discerning musicians. Private consultation available.',
      keywords: 'kawai signature, baby grand pianos, exclusive collection, premium pianos, private consultation',
      noIndex: false
    },
    settings: {
      enableSmoothScrolling: true,
      showContactInfo: true,
      restrictAccess: false
    }
  }
}

// Server Component that renders signature page sections
async function SignaturePageContent() {
  const signatureData = getBabyGrandSignatureData()

  return (
    <SignatureExperienceProvider slug={BABY_GRAND_SLUG}>
      <div className="min-h-screen bg-kawai-black">
        {/* Hero Section */}
        <HeroSection
          data={signatureData.heroSection}
          enableSmoothScrolling={signatureData.settings?.enableSmoothScrolling ?? false}
        />

        {/* Premium Heritage & Authority Section */}
        <PremiumHeritage />

        {/* Master Artisans Section */}
        <MasterArtisans />

        {/* Main Signature Experience Flow (Assessment) */}
        <SignatureExperience slug={BABY_GRAND_SLUG} />

        {/* Premium Bento Gallery */}
        <PremiumBentoGallery />

        {/* Conversion CTA Section */}
        <ConversionCTA signaturePageSlug={BABY_GRAND_SLUG} />
      </div>
    </SignatureExperienceProvider>
  )
}

export default async function BabyGrandSignaturePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-kawai-black">
        <HeroSkeleton />
      </div>
    }>
      <SignaturePageContent />
    </Suspense>
  )
}
