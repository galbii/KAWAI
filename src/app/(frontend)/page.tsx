import {
  NewsCarousel,
  PianoGallery,
  PianoCollection,
  ContactForm,
  DealerLocations
} from "@/components/homepage";
import { HomeHero } from "@/components/homepage/HomeHero";
import { HeritageSection } from "@/components/homepage/heritage-section";
import { InnovationSection } from "@/components/homepage/innovation-section";
import { SoundQualitySection } from "@/components/homepage/sound-quality-section";
import { FAQSection } from "@/components/homepage/faq-section";
import { SimpleDivider } from "@/components/ui/SimpleDivider";
import { getHomePageDataDirect } from "@/lib/payload/queries";
import type { HomePageData } from "@/lib/types/homepage";
import { Suspense } from "react";
import type { Metadata } from 'next';
import { RenderBlocks } from '@/components/RenderBlocks';
import { HomePageLivePreview } from '@/components/homepage/HomePageLivePreview';

// Enable Incremental Static Regeneration (ISR)
// Revalidate the homepage every 5 minutes (300 seconds)
// This allows the page to be statically generated at build time with fallback data,
// then regenerated in the background when CMS content changes
export const revalidate = 300;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const homePageData = await getHomePageDataDirect();

    // Use CMS SEO data if available
    if (homePageData?.seo) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com';

      return {
        title: homePageData.seo.metaTitle || 'KAWAI ™ | Digital and Acoustic Pianos',
        description: homePageData.seo.metaDescription || 'Discover premium KAWAI pianos at authorized dealers nationwide. Explore our collection of grand, upright, and digital pianos. Find a KAWAI storefront near you.',
        keywords: homePageData.seo.keywords,
        alternates: {
          canonical: siteUrl
        },
        openGraph: {
          title: homePageData.seo.openGraphTitle || homePageData.seo.metaTitle || 'KAWAI ™ | Digital and Acoustic Pianos',
          description: homePageData.seo.openGraphDescription || homePageData.seo.metaDescription || 'Discover premium KAWAI pianos at authorized dealers nationwide.',
          url: siteUrl,
          siteName: 'KAWAI Pianos',
          type: 'website',
          images: homePageData.seo.openGraphImage ? [
            {
              url: typeof homePageData.seo.openGraphImage === 'string'
                ? homePageData.seo.openGraphImage
                : homePageData.seo.openGraphImage.url || ''
            }
          ] : []
        },
        twitter: {
          card: 'summary_large_image',
          title: homePageData.seo.openGraphTitle || homePageData.seo.metaTitle || 'KAWAI | Find a storefront near you',
          description: homePageData.seo.openGraphDescription || homePageData.seo.metaDescription || 'Discover premium KAWAI pianos at authorized dealers nationwide.'
        }
      };
    }

    // Fallback metadata if CMS data is unavailable
    return {
      title: 'KAWAI ™ | Digital and Acoustic Pianos',
      description: 'Discover premium KAWAI pianos at authorized dealers nationwide. Explore our collection of grand, upright, and digital pianos crafted with 95+ years of Japanese excellence.',
      keywords: ['kawai piano', 'piano dealer', 'grand piano', 'digital piano', 'upright piano', 'piano store', 'kawai authorized dealer'],
      alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com'
      }
    };
  } catch (error) {
    console.error('Error generating homepage metadata:', error);

    // Error fallback
    return {
      title: 'KAWAI ™ | Digital and Acoustic Pianos',
      description: 'Discover premium KAWAI pianos at authorized dealers nationwide. Explore our collection of grand, upright, and digital pianos crafted with 95+ years of Japanese excellence.'
    };
  }
}

// Loading components for each section
function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center bg-kawai-black animate-pulse">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="max-w-5xl">
          <div className="h-8 bg-kawai-pearl/20 rounded mb-4 w-1/3"></div>
          <div className="h-16 bg-kawai-pearl/20 rounded mb-8 w-3/4"></div>
          <div className="h-6 bg-kawai-pearl/20 rounded mb-12 w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-kawai-pearl/20 rounded w-48"></div>
            <div className="h-12 bg-kawai-pearl/20 rounded w-48"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowroomSkeleton() {
  return (
    <section className="bg-kawai-pearl py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-64"></div>
        <div className="h-12 bg-kawai-black/20 rounded mx-auto mb-8 w-96"></div>
        <div className="h-96 bg-kawai-black/20 rounded"></div>
      </div>
    </section>
  );
}

function PianoCollectionSkeleton() {
  return (
    <section className="py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-48"></div>
        <div className="h-12 bg-kawai-black/20 rounded mx-auto mb-8 w-72"></div>
        <div className="h-80 bg-kawai-black/20 rounded"></div>
      </div>
    </section>
  );
}

function PianoGallerySkeleton() {
  return (
    <section className="bg-kawai-pearl py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-64"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-kawai-black/20 rounded"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SimpleDividerSkeleton() {
  return (
    <div className="w-full h-0.5 bg-gray-300/50 animate-pulse" />
  );
}

function NewsCarouselSkeleton() {
  return (
    <section className="py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-96 bg-kawai-black/20 rounded"></div>
      </div>
    </section>
  );
}

function DealerLocationsSkeleton() {
  return (
    <section className="bg-kawai-pearl/20 py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-64"></div>
        <div className="h-12 bg-kawai-black/20 rounded mx-auto mb-8 w-96"></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-kawai-black/20 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFormSkeleton() {
  return (
    <section className="bg-kawai-pearl py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-64"></div>
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-kawai-black/20 rounded"></div>
        </div>
      </div>
    </section>
  );
}

// Server Component that fetches data and renders sections
async function HomePageContent() {
  let homePageData: HomePageData | null = null;
  let dealerLocations: any[] = [];
  let error: string | null = null;

  try {
    homePageData = await getHomePageDataDirect();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load homepage data';
    console.error('Homepage data fetch error:', error);
  }

  // Fetch dealer locations using the proper utility function
  try {
    const { getActiveStorefrontsDirect } = await import('@/lib/payload/queries');
    dealerLocations = await getActiveStorefrontsDirect();
  } catch (err) {
    console.error('Failed to fetch dealer locations:', err);
  }

  // If there's an error or no data, components will use their fallback defaults
  if (error) {
    console.warn(`Homepage CMS data unavailable: ${error}. Using fallback content.`);
  }

  // NEW: Check if using blocks system
  const hasBlocks = homePageData?.content &&
                    Array.isArray(homePageData.content) &&
                    homePageData.content.length > 0

  if (hasBlocks && homePageData) {
    // Blocks mode: Render using RenderBlocks
    return (
      <div className="min-h-screen">
        <HomePageLivePreview />
        <RenderBlocks blocks={homePageData.content as any} />
      </div>
    )
  }

  // LEGACY: Fallback to existing section components
  return (
    <div className="min-h-screen">
      <HomePageLivePreview />
      {/* Hero Section */}
      <HomeHero />

      {/* Brand Divider */}
      <SimpleDivider />

      {/* News Carousel Section */}
      <NewsCarousel {...(homePageData?.newsCarouselSection && { data: homePageData.newsCarouselSection })} />

      {/* Piano Collection Section - Featured Models */}
      <PianoCollection {...(homePageData?.pianoCollectionSection && { data: homePageData.pianoCollectionSection })} />

      {/* Dealer Locations Section */}
      <DealerLocations locations={dealerLocations} />

      {/* Heritage & Craftsmanship Section - NEW for SEO */}
      <HeritageSection />

      {/* Innovation & Technology Section - NEW for SEO */}
      <InnovationSection />

      {/* Sound Quality & Tone Section - NEW for SEO */}
      <SoundQualitySection />

      {/* Piano Gallery Section */}
      <PianoGallery {...(homePageData?.pianoGallerySection && { data: homePageData.pianoGallerySection })} />

      {/* FAQ Section - NEW for SEO */}
      <FAQSection />

      {/* Contact Form Section */}
      <ContactForm {...(homePageData?.contactFormSection && { data: homePageData.contactFormSection })} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen">
          <HeroSkeleton />
          <SimpleDividerSkeleton />
          <NewsCarouselSkeleton />
          <DealerLocationsSkeleton />
          <PianoCollectionSkeleton />
          <PianoGallerySkeleton />
          <ContactFormSkeleton />
        </div>
      }>
        <HomePageContent />
      </Suspense>
    </>
  );
}