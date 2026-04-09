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
import { getHomePageDataDirect, getActiveStorefrontsDirect } from "@/lib/payload/queries";
import type { HomePageData } from "@/lib/types/homepage";
import { AdminBarDoc } from '@/components/layout/AdminBarDoc';
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
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com';

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
          siteName: 'Kawai Pianos',
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
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'
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

// Server Component that fetches data and renders sections
async function HomePageContent() {
  let homePageData: HomePageData | null = null;
  let dealerLocations: any[] = [];

  try {
    [homePageData, dealerLocations] = await Promise.all([
      getHomePageDataDirect(),
      getActiveStorefrontsDirect(),
    ]);
  } catch (err) {
    console.error('Homepage data fetch error:', err);
  }

  const homePageDocId = homePageData?.id

  // NEW: Check if using blocks system
  const hasBlocks = homePageData?.content &&
                    Array.isArray(homePageData.content) &&
                    homePageData.content.length > 0

  if (hasBlocks && homePageData) {
    // Blocks mode: Render using RenderBlocks
    return (
      <div className="min-h-screen">
        {homePageDocId && (
          <AdminBarDoc
            collection="home-page"
            id={homePageDocId}
            collectionLabels={{ singular: 'Home Page', plural: 'Home Pages' }}
          />
        )}
        <HomePageLivePreview />
        <RenderBlocks blocks={homePageData.content as any} />
      </div>
    )
  }

  // LEGACY: Fallback to existing section components
  return (
    <div className="min-h-screen">
      {homePageDocId && (
        <AdminBarDoc
          collection="home-page"
          id={homePageDocId}
          collectionLabels={{ singular: 'Home Page', plural: 'Home Pages' }}
        />
      )}
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
  return <HomePageContent />;
}