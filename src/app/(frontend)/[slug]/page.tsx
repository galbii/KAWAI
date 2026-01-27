import {
  Hero,
  NewsCarousel,
  PianoGallery,
  PianoCollection,
  ContactForm,
  ShowroomLocation
} from "@/components/homepage";
import { SimpleDivider } from "@/components/ui/SimpleDivider";
import { SimpleCustomerSignup } from "@/components/forms/SimpleCustomerSignup";
import { getStorefrontBySlugDirect, getHomePageDataDirect } from "@/lib/payload/queries";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import type { HomePageData } from "@/lib/types/homepage";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import config from '@payload-config';
import type { Page } from '@/payload-types';
import { Hero as PageHero } from '@/components/Hero';
import { RenderBlocks } from '@/components/RenderBlocks';

/**
 * Transform raw Payload storefront data into structured HomePageData format
 * This ensures compatibility with existing homepage components
 */
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

function SimpleDividerSkeleton() {
  return (
    <div className="w-full h-0.5 bg-gray-300/50 animate-pulse" />
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

/**
 * Page Content Component (for Pages collection)
 * Renders pages from the Pages collection with Hero and dynamic blocks
 */
async function PageContent({ slug }: { slug: string }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const payload = await getPayload({ config });

  // Fetch page data with same filters as existence check
  const page = await payload
    .find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        // Only show published pages in production (unless in draft mode)
        ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
      },
      limit: 1,
      depth: 2, // Populate relationships
      draft: isDraftMode,
      overrideAccess: isDraftMode,
    })
    .then(({ docs }) => docs?.[0] as Page);

  // If page doesn't exist or isn't published, this will trigger 404 via StorefrontContent
  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {page.hero && <PageHero hero={page.hero} />}

      {/* Dynamic Block Content */}
      {page.layout && page.layout.length > 0 && (
        <RenderBlocks blocks={page.layout} />
      )}
    </div>
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
async function StorefrontContent({ slug }: { slug: string }) {
  let storefrontData: HomePageData | null = null;
  let pianoGalleryData: any = null;
  let rawStorefrontData: any = null;

  try {
    // ✅ FIX: Use cached fetch with proper tags for revalidation
    // This works during build time AND allows revalidation via tags
    rawStorefrontData = await getCachedStorefront(slug);

    // If storefront doesn't exist or is inactive, show 404
    if (!rawStorefrontData) {
      console.log(`[SEO] Storefront "${slug}" not found or inactive`);
      notFound();
    }

    // Debug: Log raw hours data from database
    console.log(`[DEBUG] Raw hours from DB for "${slug}":`, JSON.stringify(rawStorefrontData?.hours, null, 2))

    // Transform raw Payload data into structured format
    storefrontData = transformStorefrontData(rawStorefrontData);

    // Debug: Log transformed hours data
    console.log(`[DEBUG] Transformed hours for "${slug}":`, JSON.stringify(storefrontData?.showroomSection?.hours, null, 2))

    // Fetch HomePage data for piano gallery and fallbacks using direct access
    const homePageData = await getHomePageDataDirect();
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
        console.log(`[SEO] Storefront "${slug}" using HomePage fallback for: ${fallbacks.join(', ')}`);
      }
    }

  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to load storefront data';
    console.error(`[SEO] Storefront data fetch error for "${slug}":`, error);

    // If there's a fetch error, show 404 as well since we can't determine if location exists
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com';

  // Extract signup modal settings from CMS
  const signupModalSettings = rawStorefrontData?.signupModal;
  const isModalEnabled = signupModalSettings?.enabled !== false; // Default to true if not set

  return (
    <>
      {/* LocalBusiness Structured Data for SEO */}
      <LocalBusinessSchema storefront={rawStorefrontData} siteUrl={siteUrl} />

      {/* Customer Signup Modal Popup - Conditionally rendered based on CMS settings */}
      {isModalEnabled && (
        <SimpleCustomerSignup
          storefrontSlug={slug}
          storageKey={`signup-modal-${slug}`}
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
        {/* Hero Section */}
        <Hero
          {...(storefrontData?.heroSection && { data: storefrontData.heroSection })}
          {...(storefrontData?.showroomSection?.showroomInfo?.name && {
            storefrontName: storefrontData.showroomSection.showroomInfo.name
          })}
        />

        {/* Brand Divider */}
        <SimpleDivider />

        {/* News Carousel Section */}
        <NewsCarousel {...(storefrontData?.newsCarouselSection && { data: storefrontData.newsCarouselSection })} />

        {/* Showroom Location Section */}
        <ShowroomLocation {...(storefrontData?.showroomSection && { data: storefrontData.showroomSection })} />

        {/* Piano Collection Section */}
        <PianoCollection {...(storefrontData?.pianoCollectionSection && { data: storefrontData.pianoCollectionSection })} />

        {/* Piano Gallery Section - Uses HomePage collection data */}
        <PianoGallery data={pianoGalleryData} />

        {/* Contact Form Section */}
        <ContactForm {...(storefrontData?.contactFormSection && { data: storefrontData.contactFormSection })} />
      </div>
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

// Enable ISR (Incremental Static Regeneration) for all dynamic pages
// Pages are statically generated at build time and revalidated every 1 hour
export const revalidate = 3600

// Pre-generate all pages (Pages collection + Storefronts) at build time
// Pages collection takes priority when there are slug conflicts
export async function generateStaticParams() {
  try {
    const { getPayloadHMR } = await import('@payloadcms/next/utilities')
    const configPromise = await import('@payload-config')
    const payload = await getPayloadHMR({ config: configPromise.default })

    // Fetch published pages from Pages collection
    const pages = await payload.find({
      collection: 'pages',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 100,
      select: {
        slug: true,
      },
    });

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

    console.log(`✅ [SEO] Pre-rendering ${pages.docs.length} pages + ${storefronts.docs.length} storefronts for Google indexing`)

    // Combine both collections, Pages take priority in case of slug conflicts
    const allSlugs = [
      ...pages.docs.map((page: any) => ({ slug: page.slug })),
      ...storefronts.docs.map((storefront: any) => ({ slug: storefront.slug }))
    ];

    return allSlugs;
  } catch (error) {
    console.error('❌ [SEO] Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO - CRITICAL FOR GOOGLE INDEXING
// Checks Pages collection first, then Storefronts
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const payload = await getPayload({ config });

    // 1. Check Pages collection first (published only)
    const page = await payload
      .find({
        collection: 'pages',
        where: {
          slug: { equals: slug },
          _status: { equals: 'published' },
        },
        limit: 1,
        depth: 0,
      })
      .then(({ docs }) => docs?.[0]);

    // If Page found, generate Page metadata
    if (page) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com';
      const defaultTitle = `${page.title} | KAWAI Pianos`;
      const defaultDescription = `${page.title} - KAWAI Pianos`;

      console.log(`[SEO] Generated metadata for Page "${slug}": ${defaultTitle}`);

      return {
        title: defaultTitle,
        description: defaultDescription,
        alternates: {
          canonical: `${siteUrl}/${slug}`,
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
        openGraph: {
          title: defaultTitle,
          description: defaultDescription,
          url: `${siteUrl}/${slug}`,
          siteName: 'KAWAI Pianos',
          type: 'website',
          locale: 'en_US',
        },
        twitter: {
          card: 'summary_large_image',
          title: defaultTitle,
          description: defaultDescription,
        },
      };
    }

    // 2. Fall back to Storefront
    const rawStorefrontData = await getStorefrontBySlugDirect(slug);

    if (!rawStorefrontData) {
      console.log(`[SEO] Metadata generation: Neither Page nor Storefront found for "${slug}"`);
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: {
          index: false,
          follow: false,
        }
      };
    }

    // Transform raw data to structured format
    const storefrontData = transformStorefrontData(rawStorefrontData);

    if (!storefrontData) {
      return {
        title: 'Storefront Location Not Found',
        description: 'The requested storefront location could not be found.',
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaipianos.com';

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

    console.log(`[SEO] Generated metadata for "${slug}": ${defaultTitle} (City: ${cityName || 'not extracted'})`);

    return {
      title: storefrontData.seo?.metaTitle || defaultTitle,
      description: defaultDescription,
      keywords: storefrontData.seo?.keywords,
      alternates: {
        canonical: `${siteUrl}/${slug}`
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
        url: `${siteUrl}/${slug}`,
        siteName: 'KAWAI Pianos',
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
      title: 'Storefront Location | KAWAI Pianos',
      description: 'Visit your local KAWAI authorized dealer to explore our collection of grand, upright, and digital pianos.',
    };
  }
}

/**
 * Unified Dynamic Route - /[slug]
 *
 * Renders content from either Pages or Storefronts collections:
 * 1. Checks Pages collection first (for /about, /contact, etc.)
 * 2. Falls back to Storefronts collection (for dealer locations)
 * 3. Returns 404 if neither found
 *
 * This provides clean URLs for both content types while avoiding conflicts.
 */
export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { isEnabled: isDraftMode } = await draftMode();

  // 1. Check if Page exists (don't render yet, just check)
  const pageExists = await payload
    .find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
      },
      limit: 1,
      depth: 0, // Just checking existence, no need for relationships
      draft: isDraftMode,
      overrideAccess: isDraftMode,
    })
    .then(({ docs }) => docs.length > 0);

  // 2. If Page exists, render PageContent
  if (pageExists) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <PageContent slug={slug} />
      </Suspense>
    );
  }

  // 3. Fall back to Storefront
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <HeroSkeleton />
        <SimpleDividerSkeleton />
        <NewsCarouselSkeleton />
        <ShowroomSkeleton />
        <PianoCollectionSkeleton />
        <PianoGallerySkeleton />
        <ContactFormSkeleton />
      </div>
    }>
      <StorefrontContent slug={slug} />
    </Suspense>
  );
}

/**
 * Page Loading Skeleton (for Pages collection)
 */
function PageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 rounded mb-6 w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </section>

      <div className="container my-16">
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}