import {
  NewsCarousel,
  PianoGallery,
  PianoCollection,
  ContactForm,
  ShowroomLocation
} from "@/components/homepage";
import { MusicSchoolSection } from "@/components/music-school/MusicSchoolSection";
import { PianoRentalsSection } from '@/components/storefronts/piano-rentals-section'
import { FacilityRentalsSection } from '@/components/storefronts/facility-rentals-section'
import { TuningRepairSection } from '@/components/storefronts/tuning-repair-section'
import { SimpleCustomerSignup } from "@/components/forms/SimpleCustomerSignup";
import { DeadlineDock, BackToSchoolPromo } from "@/components/back-to-school";
import { getStorefrontBySlugDirect, getHomePageDataDirect } from "@/lib/payload/queries";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { AdminBarDoc } from '@/components/layout/AdminBarDoc';
import type { HomePageData } from "@/lib/types/homepage";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { getSite, getSiteUrl, getSiteAlternates } from '@/lib/site-context'

/**
 * Transform raw Payload storefront data into structured HomePageData format
 * This ensures compatibility with existing homepage components
 * Piano collection data now comes from HomePage collection to eliminate duplication
 */
function transformStorefrontData(rawData: any, homePageData: any): HomePageData | null {
  if (!rawData) return null;

  return {
    heroSection: {
      locationText: rawData.locationText,
      establishedText: rawData.establishedText,
      titlePrefix: rawData.titlePrefix ?? 'The',
      titleMain: rawData.titleMain ?? 'INSTRUMENTAL',
      titleSuffix: rawData.titleSuffix ?? 'to Life',
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
      collectionSectionHeader: homePageData?.collectionSectionHeader || 'Featured Models',
      collectionTitle: homePageData?.collectionTitle || 'Discover Our Collection',
      collectionDescription: homePageData?.collectionDescription || 'Explore exceptional craftsmanship and innovation',
      collectionCta: homePageData?.collectionCta || { text: 'Explore Collection', link: '/pianos' },
      featuredVideo: homePageData?.featuredVideo || null
    },
    pianoGallerySection: {
      galleryTitle: '',
      galleryDescription: '',
      pianoCategories: []
    }, // Will be populated from homepage in StorefrontContent
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

// Helper function to merge news carousel data with fallback values
// ALWAYS ADDITIVE: Combines homepage news + storefront news (never replaces)
function mergeNewsCarouselWithFallback(dealerData: any, homePageData: any): any {
  if (!dealerData || !homePageData?.newsCarouselSection) return dealerData;

  const merged = { ...dealerData };

  // Always start with homepage news items
  let newsItems = homePageData.newsCarouselSection?.newsItems ?? [];

  // Append storefront news items if they exist (always additive)
  if (
    merged.newsCarouselSection?.newsItems &&
    Array.isArray(merged.newsCarouselSection.newsItems) &&
    merged.newsCarouselSection.newsItems.length > 0
  ) {
    newsItems = [...newsItems, ...merged.newsCarouselSection.newsItems];
  }

  // Use storefront autoPlayDuration if set, otherwise use homepage value, otherwise default to 7000
  const autoPlayDuration =
    merged.newsCarouselSection?.autoPlayDuration ??
    homePageData.newsCarouselSection?.autoPlayDuration ??
    7000;

  // Update merged data with combined news items
  merged.newsCarouselSection = {
    ...merged.newsCarouselSection,
    autoPlayDuration,
    newsItems,
  };

  return merged;
}

// Loading components for each section
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

// Cached storefront fetcher with proper Next.js cache tags
// This allows revalidateTag() to work properly
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

// Server Component that fetches storefront data and homepage data for piano gallery
async function StorefrontContent({ storeslug }: { storeslug: string }) {
  let storefrontData: HomePageData | null = null;
  let pianoGalleryData: any = null;
  let rawStorefrontData: any = null;

  try {
    // ✅ FIX: Use cached fetch with proper tags for revalidation
    // This works during build time AND allows revalidation via tags
    rawStorefrontData = await getCachedStorefront(storeslug);

    // If storefront doesn't exist or is inactive, show 404
    if (!rawStorefrontData) {
      console.log(`[SEO] Storefront "${storeslug}" not found or inactive`);
      notFound();
    }

    // Fetch HomePage data for piano gallery, piano collection, and fallbacks using direct access
    const homePageData = await getHomePageDataDirect();
    pianoGalleryData = homePageData?.pianoGallerySection;

    // Transform raw Payload data into structured format
    // Piano collection data now comes from HomePage to eliminate duplication
    storefrontData = transformStorefrontData(rawStorefrontData, homePageData?.pianoCollectionSection);

    // Merge storefront data with HomePage for news carousel (always additive)
    if (storefrontData && homePageData) {
      const originalStorefrontItemCount = storefrontData.newsCarouselSection?.newsItems?.length ?? 0;
      const originalDurationMissing = !storefrontData.newsCarouselSection?.autoPlayDuration;

      storefrontData = mergeNewsCarouselWithFallback(storefrontData, homePageData);

      // Null check after merge (merge can return null)
      if (!storefrontData) return;

      // Log combined news items and fallbacks for debugging
      const homePageItemCount = homePageData.newsCarouselSection?.newsItems?.length ?? 0;
      const totalItemCount = storefrontData.newsCarouselSection?.newsItems?.length ?? 0;

      console.log(
        `[SEO] Storefront "${storeslug}" news carousel: ${homePageItemCount} homepage items + ${originalStorefrontItemCount} storefront items = ${totalItemCount} total`
      );

      if (originalDurationMissing) {
        console.log(`[SEO] Storefront "${storeslug}" using HomePage auto-play duration`);
      }
    }

  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to load storefront data';
    console.error(`[SEO] Storefront data fetch error for "${storeslug}":`, error);

    // If there's a fetch error, show 404 as well since we can't determine if location exists
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com';

  // Extract signup modal settings from CMS
  const signupModalSettings = rawStorefrontData?.signupModal;
  const isModalEnabled = signupModalSettings?.enabled !== false; // Default to true if not set

  return (
    <>
      {rawStorefrontData?.id && (
        <AdminBarDoc
          collection="storefronts"
          id={String(rawStorefrontData.id)}
          collectionLabels={{ singular: 'Storefront', plural: 'Storefronts' }}
        />
      )}

      {/* LocalBusiness Structured Data for SEO */}
      <LocalBusinessSchema storefront={rawStorefrontData} siteUrl={siteUrl} />

      {/* Customer Signup Modal Popup - Conditionally rendered based on CMS settings */}
      {isModalEnabled && (
        <SimpleCustomerSignup
          storefrontSlug={storeslug}
          storageKey={`signup-modal-${storeslug}`}
          title={signupModalSettings?.title}
          description={signupModalSettings?.description}
          submitButtonText={signupModalSettings?.submitButtonText}
          showDelay={signupModalSettings?.showDelay}
          successTitle={signupModalSettings?.successTitle}
          successMessage={signupModalSettings?.successMessage}
          imageUrl={signupModalSettings?.imageUrl}
          customTags={signupModalSettings?.customTags}
        />
      )}

      <div className="min-h-screen">
        {/* Page-level h1 — section components below use h2/h3, so expose the
            showroom name as the single top-level heading for assistive tech. */}
        <h1 className="sr-only">{rawStorefrontData?.locationName ?? 'Kawai Showroom'}</h1>

        {/* News Carousel Section */}
        <NewsCarousel {...(storefrontData?.newsCarouselSection && { data: storefrontData.newsCarouselSection })} />

        {/* Back to School campaign promo — under the hero; books in place,
            links to this store's campaign page; renders nothing after Sept 30 */}
        <BackToSchoolPromo
          storeslug={storeslug}
          locationName={rawStorefrontData?.showroomInfo?.name ?? rawStorefrontData?.locationName ?? null}
          hours={rawStorefrontData?.hours ?? null}
        />

        {/* Showroom Location Section */}
        <ShowroomLocation {...(storefrontData?.showroomSection && { data: storefrontData.showroomSection })} />

        {/* Piano Rentals Section */}
        <PianoRentalsSection data={rawStorefrontData ?? {}} />

        {/* Facility Rentals Section */}
        <FacilityRentalsSection data={rawStorefrontData ?? {}} />

        {/* Tuning & Repair Section */}
        <TuningRepairSection data={rawStorefrontData ?? {}} />

        {/* Music School Section - only renders if a music school exists for this storefront */}
        <MusicSchoolSection storeslug={storeslug} />

        {/* Piano Collection Section */}
        <PianoCollection {...(storefrontData?.pianoCollectionSection && { data: storefrontData.pianoCollectionSection })} />

        {/* Piano Gallery Section - Uses HomePage collection data */}
        <PianoGallery data={pianoGalleryData} />

        {/* Contact Form Section */}
        <ContactForm {...(storefrontData?.contactFormSection && { data: storefrontData.contactFormSection })} />
      </div>

      {/* Back to School floating book button — countdown links to the campaign
          page, Book opens the Calendly modal directly. Self-hides after Sept 30
          via its own daysUntilDeadline copy; remove with the campaign. */}
      <DeadlineDock
        storeslug={storeslug}
        locationName={rawStorefrontData?.showroomInfo?.name ?? rawStorefrontData?.locationName ?? null}
        hours={rawStorefrontData?.hours ?? null}
        campaignHref={`/store/${storeslug}/back-to-school`}
      />
    </>
  );
}

// Helper function to extract city name from storefront name
function extractCityName(storefrontName: string | undefined): string | null {
  if (!storefrontName) return null;

  // Try multiple patterns to extract city name
  // Pattern 1: "Kawai Piano Gallery [City]" or "Piano Gallery [City]"
  const galleryPattern = storefrontName.match(/(?:Gallery\s+)([A-Za-z\s]+?)(?:\s*$|,|\||–)/i);
  if (galleryPattern && galleryPattern[1]) {
    return galleryPattern[1].trim();
  }

  // Pattern 2: "[City] Kawai Piano Gallery" or "[City] Piano Gallery"
  const cityFirstPattern = storefrontName.match(/^([A-Za-z\s]+?)(?:\s+(?:Kawai|Piano|Gallery))/i);
  if (cityFirstPattern && cityFirstPattern[1]) {
    return cityFirstPattern[1].trim();
  }

  // Pattern 3: "Kawai [City]" simple format
  const simplePattern = storefrontName.match(/Kawai\s+([A-Za-z\s]+?)(?:\s*$|,|\||–)/i);
  if (simplePattern && simplePattern[1]) {
    return simplePattern[1].trim();
  }

  return null;
}

// Enable ISR (Incremental Static Regeneration) for all storefront pages
// Pages are statically generated at build time and revalidated every 1 hour
export const revalidate = 3600

// Pre-generate all active storefronts at build time
export async function generateStaticParams() {
  try {
    const { getPayloadHMR } = await import('@payloadcms/next/utilities')
    const configPromise = await import('@payload-config')
    const payload = await getPayloadHMR({ config: configPromise.default })

    // Fetch active storefronts
    const storefronts = await payload.find({
      collection: 'storefronts',
      where: {
        isActive: {
          equals: true
        }
      },
      limit: 100,
      select: {
        slug: true
      }
    });

    console.log(`✅ [SEO] Pre-rendering ${storefronts.docs.length} storefronts for Google indexing`)

    // Return array with storeslug parameter
    return storefronts.docs.map((storefront: any) => ({
      storeslug: storefront.slug
    }));
  } catch (error) {
    console.error('❌ [SEO] Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO - CRITICAL FOR GOOGLE INDEXING
export async function generateMetadata(
  { params }: { params: Promise<{ storeslug: string }> }
): Promise<Metadata> {
  try {
    const { storeslug } = await params;
    const rawStorefrontData = await getStorefrontBySlugDirect(storeslug);

    if (!rawStorefrontData) {
      console.log(`[SEO] Metadata generation: Storefront not found for "${storeslug}"`);
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: {
          index: false,
          follow: false,
        }
      };
    }

    // Fetch HomePage data for piano collection
    const homePageData = await getHomePageDataDirect();

    // Transform raw data to structured format
    const storefrontData = transformStorefrontData(rawStorefrontData, homePageData?.pianoCollectionSection);

    if (!storefrontData) {
      return {
        title: 'Storefront Location Not Found',
        description: 'The requested storefront location could not be found.',
      };
    }

    const site = await getSite()
    const siteUrl = getSiteUrl(site)

    // Extract storefront name and city for SEO optimization
    const storefrontName = storefrontData.showroomSection?.showroomInfo?.name || 'Piano Gallery';

    // Intelligently extract city name with multiple fallback strategies
    let cityName = extractCityName(storefrontName);

    // Fallback to service area primary city if extraction failed
    if (!cityName && storefrontData.showroomSection?.showroomInfo) {
      // Try to extract from raw storefront data if available
      cityName = rawStorefrontData?.serviceAreaCoverage?.primaryCity || null;
    }

    // Build optimized title for brand + location searches
    // Priority: "Kawai Piano Gallery [City] | Authorized Kawai Dealer"
    const defaultTitle = cityName
      ? `Kawai Piano Gallery ${cityName} | Authorized Kawai Dealer`
      : `Kawai ${storefrontName}`;

    // Enhanced description with city mention for local SEO
    const defaultDescription = cityName
      ? `Visit Kawai Piano Gallery ${cityName} - Your authorized Kawai dealer. Explore grand, upright & digital pianos. Expert consultation, financing & professional service in ${cityName}.`
      : `Visit your local KAWAI authorized dealer at ${storefrontName}. Explore grand, upright, and digital pianos with expert consultation.`;

    console.log(`[SEO] Generated metadata for "${storeslug}": ${defaultTitle} (City: ${cityName || 'not extracted'})`);

    return {
      title: storefrontData.seo?.metaTitle || defaultTitle,
      description: defaultDescription,
      keywords: storefrontData.seo?.keywords,
      alternates: {
        canonical: `${siteUrl}/store/${storeslug}`,
        languages: getSiteAlternates(`/store/${storeslug}`),
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        }
      },
      openGraph: {
        title: storefrontData.seo?.openGraphTitle || storefrontData.seo?.metaTitle || defaultTitle,
        description: storefrontData.seo?.openGraphDescription || defaultDescription,
        url: `${siteUrl}/store/${storeslug}`,
        siteName: 'Kawai Pianos',
        type: 'website',
        locale: 'en_US',
        images: storefrontData.seo?.openGraphImage ? [
          {
            url: typeof storefrontData.seo.openGraphImage === 'string'
              ? storefrontData.seo.openGraphImage
              : storefrontData.seo.openGraphImage.url || '',
            width: 1200,
            height: 630,
            alt: defaultTitle,
          }
        ] : []
      },
      twitter: {
        card: 'summary_large_image',
        title: storefrontData.seo?.openGraphTitle || storefrontData.seo?.metaTitle || defaultTitle,
        description: storefrontData.seo?.openGraphDescription || defaultDescription
      }
    };
  } catch (error) {
    console.error(`[SEO] Error generating metadata for storefront:`, error);
    return {
      title: 'Storefront Location | Kawai Pianos',
      description: 'Visit your local KAWAI authorized dealer to explore our collection of grand, upright, and digital pianos.',
    };
  }
}

/**
 * Storefront Route - /store/[storeslug]
 *
 * Renders content from Storefronts collection for dealer locations
 * Returns 404 if storefront not found or inactive
 */
export default async function StorefrontPage({ params }: { params: Promise<{ storeslug: string }> }) {
  const { storeslug } = await params;

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen">
          <NewsCarouselSkeleton />
          <ShowroomSkeleton />
          <PianoCollectionSkeleton />
          <PianoGallerySkeleton />
          <ContactFormSkeleton />
        </div>
      }>
        <StorefrontContent storeslug={storeslug} />
      </Suspense>
    </>
  );
}
