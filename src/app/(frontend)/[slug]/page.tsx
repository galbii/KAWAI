import { 
  Hero,
  NewsCarousel, 
  PianoGallery,
  PianoCollection, 
  ContactForm,
  ShowroomLocation
} from "@/components/homepage";
import { getStorefrontData, getHomePageData } from "@/lib/payload";
import type { HomePageData } from "@/lib/types/homepage";
import { Suspense } from "react";
import { notFound } from "next/navigation";

// Helper function to check if news carousel data is meaningful/populated
function isNewsCarouselDataEmpty(newsCarouselSection: any): boolean {
  if (!newsCarouselSection) return true;
  
  // Check if newsItems array exists and has meaningful content
  if (!newsCarouselSection.newsItems || !Array.isArray(newsCarouselSection.newsItems)) {
    return true;
  }
  
  // Check if array is empty
  if (newsCarouselSection.newsItems.length === 0) {
    return true;
  }
  
  // Check if all items in the array are empty/meaningless
  const hasValidItems = newsCarouselSection.newsItems.some((item: any) => {
    return item && 
           item.title && 
           item.title.trim().length > 0 && 
           item.description && 
           item.description.trim().length > 0 &&
           item.category && 
           item.category.trim().length > 0;
  });
  
  return !hasValidItems;
}

// Helper function to merge news carousel data with fallback values
function mergeNewsCarouselWithFallback(dealerData: any, homePageData: any): any {
  if (!dealerData || !homePageData?.newsCarouselSection) return dealerData;
  
  const merged = { ...dealerData };
  
  // If dealer's autoPlayDuration is missing/empty, use HomePage value
  if (!merged.newsCarouselSection?.autoPlayDuration && homePageData.newsCarouselSection?.autoPlayDuration) {
    merged.newsCarouselSection = merged.newsCarouselSection || {};
    merged.newsCarouselSection.autoPlayDuration = homePageData.newsCarouselSection.autoPlayDuration;
  }
  
  // If dealer's newsItems are empty, use HomePage newsItems
  if (isNewsCarouselDataEmpty(merged.newsCarouselSection)) {
    merged.newsCarouselSection = merged.newsCarouselSection || {};
    merged.newsCarouselSection.newsItems = homePageData.newsCarouselSection.newsItems;
    
    // Also ensure autoPlayDuration is set if it wasn't already
    if (!merged.newsCarouselSection.autoPlayDuration) {
      merged.newsCarouselSection.autoPlayDuration = homePageData.newsCarouselSection.autoPlayDuration;
    }
  }
  
  return merged;
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

function NewsCarouselSkeleton() {
  return (
    <section className="py-24 animate-pulse">
      <div className="container mx-auto px-6">
        <div className="h-96 bg-kawai-black/20 rounded"></div>
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

// Server Component that fetches storefront data and homepage data for piano gallery
async function StorefrontContent({ slug }: { slug: string }) {
  let storefrontData: HomePageData | null = null;
  let pianoGalleryData: any = null;
  let error: string | null = null;

  try {
    // Fetch storefront data (contains all sections except piano gallery)
    storefrontData = await getStorefrontData(slug);

    // If storefront doesn't exist or is inactive, show 404
    if (!storefrontData) {
      notFound();
    }

    // Fetch HomePage data for fallbacks
    const homePageData = await getHomePageData();
    pianoGalleryData = homePageData?.pianoGallerySection;

    // Merge storefront data with HomePage fallbacks for news carousel
    if (storefrontData && homePageData) {
      const originalCarouselEmpty = isNewsCarouselDataEmpty(storefrontData.newsCarouselSection);
      const originalDurationMissing = !storefrontData.newsCarouselSection?.autoPlayDuration;

      storefrontData = mergeNewsCarouselWithFallback(storefrontData, homePageData);

      // Log what fallbacks were applied for debugging
      if (originalCarouselEmpty || originalDurationMissing) {
        const fallbacks = [];
        if (originalCarouselEmpty) fallbacks.push('news items');
        if (originalDurationMissing) fallbacks.push('auto-play duration');
        console.log(`Storefront ${slug} using HomePage fallback for: ${fallbacks.join(', ')}`);
      }
    }

  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load storefront data';
    console.error('Storefront data fetch error:', error);

    // If there's a fetch error, show 404 as well since we can't determine if location exists
    notFound();
  }

  // If there's an error but we still have data, components will use their fallback defaults
  if (error) {
    console.warn(`Storefront CMS data partially unavailable: ${error}. Using available data with fallbacks.`);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero {...(storefrontData?.heroSection && { data: storefrontData.heroSection })} />

      {/* Showroom Location Section */}
      <ShowroomLocation {...(storefrontData?.showroomSection && { data: storefrontData.showroomSection })} />

      {/* Piano Collection Section */}
      <PianoCollection {...(storefrontData?.pianoCollectionSection && { data: storefrontData.pianoCollectionSection })} />

      {/* Piano Gallery Section - Uses HomePage collection data */}
      <PianoGallery data={pianoGalleryData} />

      {/* News Carousel Section */}
      <NewsCarousel {...(storefrontData?.newsCarouselSection && { data: storefrontData.newsCarouselSection })} />

      {/* Contact Form Section */}
      <ContactForm {...(storefrontData?.contactFormSection && { data: storefrontData.contactFormSection })} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const storefrontData = await getStorefrontData(slug);

    if (!storefrontData?.seo) {
      return {
        title: 'Storefront Location Not Found',
        description: 'The requested storefront location could not be found.'
      };
    }

    return {
      title: storefrontData.seo.metaTitle || 'Kawai Piano Gallery',
      description: storefrontData.seo.metaDescription || 'Find your local Kawai Piano Gallery.',
      keywords: storefrontData.seo.keywords,
      openGraph: {
        title: storefrontData.seo.openGraphTitle || storefrontData.seo.metaTitle,
        description: storefrontData.seo.openGraphDescription || storefrontData.seo.metaDescription,
        images: storefrontData.seo.openGraphImage ? [
          {
            url: typeof storefrontData.seo.openGraphImage === 'string'
              ? storefrontData.seo.openGraphImage
              : storefrontData.seo.openGraphImage.url || ''
          }
        ] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata for storefront:', error);
    return {
      title: 'Storefront Location Not Found',
      description: 'The requested storefront location could not be found.'
    };
  }
}

export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <HeroSkeleton />
        <ShowroomSkeleton />
        <PianoCollectionSkeleton />
        <PianoGallerySkeleton />
        <NewsCarouselSkeleton />
        <ContactFormSkeleton />
      </div>
    }>
      <StorefrontContent slug={slug} />
    </Suspense>
  );
}