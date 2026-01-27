import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { HeroSection } from '@/components/pages/signature/HeroSection'
import { PremiumHeritage } from '@/components/pages/signature/PremiumHeritage'
import { MasterArtisans } from '@/components/pages/signature/MasterArtisans'
import { PremiumBentoGallery } from '@/components/pages/signature/PremiumBentoGallery'
import { ConversionCTA } from '@/components/pages/signature/ConversionCTA'
import { CalendlyEmbedSection } from '@/components/pages/signature/CalendlyEmbedSection'
import { CalendlyModalProvider } from '@/components/pages/signature/CalendlyModalContext'
import type { SignaturePageData, SignaturePageProps } from '@/lib/types/signature'
import type { Media } from '@/payload-types'

// Loading skeletons for each section
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

// Mock data fetching function - in production this would connect to your CMS
async function getSignaturePageData(slug: string): Promise<SignaturePageData | null> {
  try {
    // Simulate CMS fetch - replace with actual Payload CMS query
    // This would typically query your signature pages collection

    // For now, return mock data that matches the luxury signature experience
    const mockData: SignaturePageData = {
      slug,
      title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Signature2 Collection`,
      isActive: true,
      heroSection: {
        exclusiveText: "",
        titlePrefix: "",
        titleMain: "Your Personal Concert Hall",
        titleSuffix: "",
        subtitle: "Experience the artistry of Kawai Baby Grands",
        description: "Transform your home into an intimate performance space. Each baby grand is a masterpiece of Japanese craftsmanship, delivering concert-quality sound in perfect proportions. Reserve your private appointment today—limited availability.",
        heroBackgroundImage: null, // Will use fallback
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
        metaTitle: `Your Personal Concert Hall | Kawai Pianos`,
        metaDescription: `Transform your home into an intimate performance space with Kawai Baby Grands. Experience concert-quality artistry and Japanese craftsmanship. Exclusive event—reserve your private appointment today.`,
        keywords: `kawai baby grand, concert hall at home, baby grand sale, exclusive piano event, japanese craftsmanship, premium baby grands`,
        noIndex: false
      },
      settings: {
        enableSmoothScrolling: true,
        showContactInfo: true,
        restrictAccess: false
      }
    }

    return mockData
  } catch (error) {
    console.error('Error fetching signature page data:', error)
    return null
  }
}

// Server Component that fetches signature page data and renders sections
async function SignaturePageContent({ slug }: { slug: string }) {
  let signatureData: SignaturePageData | null = null
  let error: string | null = null

  try {
    signatureData = await getSignaturePageData(slug)

    // If signature page doesn't exist or is inactive, show 404
    if (!signatureData || !signatureData.isActive) {
      notFound()
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load signature page data'
    console.error('Signature page data fetch error:', error)

    // If there's a fetch error, show 404 as well since we can't determine if page exists
    notFound()
  }

  // If there's an error but we still have data, components will use their fallback defaults
  if (error) {
    console.warn(`Signature page CMS data partially unavailable: ${error}. Using available data with fallbacks.`)
  }

  return (
    <CalendlyModalProvider slug={slug}>
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

        {/* Calendly Booking Widget (Replaces SignatureExperience for signature2) */}
        <CalendlyEmbedSection slug={slug} />

        {/* Premium Bento Gallery */}
        <PremiumBentoGallery />

        {/* Conversion CTA Section */}
        <ConversionCTA signaturePageSlug={slug} />
      </div>
    </CalendlyModalProvider>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: SignaturePageProps): Promise<Metadata> {
  try {
    const { storeslug } = await params
    const signatureData = await getSignaturePageData(storeslug)

    if (!signatureData?.seo) {
      return {
        title: 'Signature Collection Not Found',
        description: 'The requested signature collection could not be found.',
        robots: { index: false, follow: false }
      }
    }

    const { seo } = signatureData

    return {
      title: seo.metaTitle || `Your Personal Concert Hall | Kawai Pianos`,
      description: seo.metaDescription || `Transform your home into an intimate performance space with Kawai Baby Grands. Experience concert-quality artistry and Japanese craftsmanship.`,
      keywords: seo.keywords,
      robots: {
        index: !seo.noIndex,
        follow: !seo.noIndex
      },
      openGraph: {
        title: seo.openGraphTitle || seo.metaTitle,
        description: seo.openGraphDescription || seo.metaDescription,
        type: "website",
        locale: "en_US",
        images: seo.openGraphImage ? [
          {
            url: typeof seo.openGraphImage === 'string'
              ? seo.openGraphImage
              : seo.openGraphImage.url || ''
          }
        ] : []
      },
      twitter: {
        card: "summary_large_image",
        title: seo.openGraphTitle || seo.metaTitle,
        description: seo.openGraphDescription || seo.metaDescription,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for signature page:', error)
    return {
      title: 'Signature Collection Not Found',
      description: 'The requested signature collection could not be found.',
      robots: { index: false, follow: false }
    }
  }
}

// Removed generateStaticParams to fix potential build issues
// All signature pages will be dynamically generated at runtime
// This allows for full flexibility in CMS-driven signature page management

export default async function Signature2Page({ params }: SignaturePageProps) {
  const { storeslug } = await params

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-kawai-black">
        <HeroSkeleton />
      </div>
    }>
      <SignaturePageContent slug={storeslug} />
    </Suspense>
  )
}