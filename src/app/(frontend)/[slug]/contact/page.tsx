import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getStorefrontBySlugDirect } from "@/lib/payload-direct";
import {
  ContactHero,
  LocationContactForm
} from "@/components/contact";
import { ShowroomLocation } from "@/components/homepage";
import type { HomePageData } from "@/lib/types/homepage";
import { unstable_cache } from 'next/cache';

// Loading components for each section
function ContactHeroSkeleton() {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-kawai-black animate-pulse">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="max-w-4xl">
          <div className="h-6 bg-kawai-pearl/20 rounded mb-4 w-1/3"></div>
          <div className="h-12 bg-kawai-pearl/20 rounded mb-6 w-2/3"></div>
          <div className="h-6 bg-kawai-pearl/20 rounded mb-8 w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-12 bg-kawai-pearl/20 rounded w-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowroomLocationSkeleton() {
  return (
    <section className="relative bg-kawai-pearl animate-pulse">
      <div className="container mx-auto px-6 pt-24 pb-16 text-center">
        <div className="h-4 bg-kawai-black/20 rounded mx-auto mb-6 w-32"></div>
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-8 w-32"></div>
        <div className="h-16 bg-kawai-black/20 rounded mx-auto mb-8 w-96"></div>
        <div className="h-6 bg-kawai-black/20 rounded mx-auto w-3/4 max-w-3xl"></div>
      </div>
      <div className="container mx-auto px-6 pb-24">
        <div className="h-96 bg-kawai-black/20 rounded-2xl"></div>
      </div>
    </section>
  );
}

function ContactFormSkeleton() {
  return (
    <section className="py-24 bg-white animate-pulse">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-12 w-64"></div>
        <div className="h-96 bg-kawai-black/20 rounded"></div>
      </div>
    </section>
  );
}

// Transform raw Payload storefront data into structured HomePageData format
function transformStorefrontData(rawData: any): HomePageData | null {
  if (!rawData) return null;

  return {
    heroSection: {
      locationText: rawData.locationText,
      establishedText: rawData.establishedText,
      description: rawData.description,
      primaryCta: rawData.primaryCta,
      secondaryCta: rawData.secondaryCta,
      backgroundVideo: rawData.backgroundVideo
    },
    showroomSection: {
      sectionHeader: rawData.sectionHeader,
      showroomTitle: rawData.showroomTitle,
      showroomDescription: rawData.showroomDescription,
      showroomInfo: rawData.showroomInfo,
      hours: rawData.hours,
      features: rawData.features,
      mapApiKey: rawData.mapApiKey,
      showroomCtas: rawData.showroomCtas,
      trustBanner: rawData.trustBanner
    },
    pianoCollectionSection: {
      collectionSectionHeader: rawData.collectionSectionHeader,
      collectionTitle: rawData.collectionTitle,
      collectionDescription: rawData.collectionDescription,
      collectionCta: rawData.collectionCta,
      featuredVideo: rawData.featuredVideo
    },
    pianoGallerySection: {
      galleryTitle: '',
      galleryDescription: '',
      pianoCategories: []
    },
    newsCarouselSection: {
      autoPlayDuration: rawData.autoPlayDuration,
      newsItems: rawData.newsItems
    },
    contactFormSection: {
      contactTitle: rawData.contactTitle,
      contactTitleHighlight: rawData.contactTitleHighlight,
      contactDescription: rawData.contactDescription,
      stepTitles: rawData.stepTitles,
      trustMessage: rawData.trustMessage,
      benefits: rawData.benefits,
      formOptions: rawData.formOptions
    },
    seo: rawData.seo
  };
}

// Cached storefront fetcher with proper Next.js cache tags
function getCachedStorefront(slug: string) {
  return unstable_cache(
    async () => getStorefrontBySlugDirect(slug),
    [`storefront-${slug}`],
    {
      tags: [`storefront-${slug}`],
      revalidate: 3600 // 1 hour fallback
    }
  )()
}

// Server Component that fetches storefront data and renders contact sections
async function ContactPageContent({ slug }: { slug: string }) {
  let storefrontData: HomePageData | null = null;
  let rawStorefrontData: any = null;

  try {
    // Use cached fetch with proper tags for revalidation
    rawStorefrontData = await getCachedStorefront(slug);

    // If storefront doesn't exist or is inactive, show 404
    if (!rawStorefrontData) {
      console.log(`[Contact Page] Storefront "${slug}" not found or inactive`);
      notFound();
    }

    // Transform raw Payload data into structured format
    storefrontData = transformStorefrontData(rawStorefrontData);

    if (!storefrontData) {
      notFound();
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to load storefront data';
    console.error(`[Contact Page] Storefront data fetch error for "${slug}":`, error);
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Contact Hero Section */}
      <ContactHero
        data={storefrontData?.showroomSection}
        establishedText={storefrontData?.heroSection?.establishedText}
      />

      {/* Showroom Location Section - Same as homepage */}
      <ShowroomLocation data={storefrontData?.showroomSection} />

      {/* Contact Form Section */}
      <LocationContactForm data={storefrontData?.contactFormSection} storefrontSlug={slug} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    // Use direct Payload access instead of HTTP fetch
    const rawStorefrontData = await getStorefrontBySlugDirect(slug);

    if (!rawStorefrontData) {
      return {
        title: 'Contact - Location Not Found',
        description: 'The requested storefront location could not be found.'
      };
    }

    // Transform data
    const storefrontData = transformStorefrontData(rawStorefrontData);

    if (!storefrontData?.seo) {
      return {
        title: 'Contact - Location Not Found',
        description: 'The requested storefront location could not be found.'
      };
    }

    const locationName = storefrontData.heroSection?.locationText || 'Kawai Piano Gallery';
    const baseTitle = storefrontData.seo.metaTitle || 'Contact - Kawai Piano Gallery';
    const contactTitle = `Contact ${locationName} | ${baseTitle}`;

    return {
      title: contactTitle,
      description: `Contact ${locationName}. ${storefrontData.seo.metaDescription || 'Get in touch with your local Kawai Piano Gallery.'}`,
      keywords: `contact, ${storefrontData.seo.keywords}`,
      openGraph: {
        title: contactTitle,
        description: `Contact ${locationName}. ${storefrontData.seo.openGraphDescription || storefrontData.seo.metaDescription || 'Get in touch with your local Kawai Piano Gallery.'}`,
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
    console.error('Error generating metadata for storefront contact:', error);
    return {
      title: 'Contact - Location Not Found',
      description: 'The requested storefront location could not be found.'
    };
  }
}

// Removed generateStaticParams to fix ECONNREFUSED errors during build
// All storefront contact pages will be dynamically generated at runtime
// This is appropriate for a CMS-driven site where storefronts may change frequently

export const dynamicParams = true; // Allow dynamic rendering for unknown slugs

export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <ContactHeroSkeleton />
        <ShowroomLocationSkeleton />
        <ContactFormSkeleton />
      </div>
    }>
      <ContactPageContent slug={slug} />
    </Suspense>
  );
}