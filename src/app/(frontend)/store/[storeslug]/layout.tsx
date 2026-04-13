import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHomePageDataDirect } from "@/lib/payload/queries";

interface StorefrontData {
  locationName: string;
  slug: string;
  isActive: boolean;
}

// Function to fetch just the basic storefront info needed for the layout
async function getStorefrontMetadata(slug: string): Promise<StorefrontData | null> {
  try {
    const payload = await import('payload').then(m => m.getPayload);
    const config = await import('@/payload.config').then(m => m.default);
    const payloadInstance = await payload({ config });

    const result = await payloadInstance.find({
      collection: 'storefronts',
      where: {
        and: [
          {
            slug: {
              equals: slug
            }
          },
          {
            isActive: {
              equals: true
            }
          }
        ]
      },
      limit: 1,
      select: {
        locationName: true,
        slug: true,
        isActive: true
      }
    });

    const storefront = result.docs[0];

    if (!storefront) {
      return null;
    }

    return {
      locationName: storefront.locationName,
      slug: storefront.slug,
      isActive: storefront.isActive || false
    };
  } catch (error) {
    console.error('Error fetching storefront metadata:', error);
    return null;
  }
}

// Generate dynamic metadata for storefronts
export async function generateMetadata({ params }: { params: Promise<{ storeslug: string }> }): Promise<Metadata> {
  try {
    const { storeslug } = await params;
    const storefrontData = await getStorefrontMetadata(storeslug);

    if (!storefrontData) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: { index: false, follow: false }
      };
    }

    // Get SEO data from HomePage collection
    const homePageData = await getHomePageDataDirect();
    const seo = homePageData?.seo;

    // Create location-specific titles and descriptions using HomePage SEO data
    const locationTitle = seo?.metaTitle?.replace(/St\. Louis/g, storefrontData.locationName) ||
                         `${storefrontData.locationName} | Kawai Piano Gallery`;
    const locationDescription = seo?.metaDescription?.replace(/St\. Louis/g, storefrontData.locationName) ||
      `Visit ${storefrontData.locationName} for premium Kawai pianos, expert consultation, and personalized piano guidance.`;

    // Generate location-specific keywords
    const baseKeywords = (typeof seo?.keywords === 'string' ? seo.keywords.split(', ') : null) || [
      'Kawai Piano Gallery',
      'piano store',
      'piano showroom',
      'digital pianos',
      'grand pianos',
      'piano services',
      'piano consultation'
    ];

    const locationKeywords = [
      storefrontData.locationName,
      ...baseKeywords
    ];

    return {
      title: locationTitle,
      description: locationDescription,
      keywords: locationKeywords.join(', '),
      authors: [{ name: storefrontData.locationName }],
      openGraph: {
        title: seo?.openGraphTitle?.replace(/St\. Louis/g, storefrontData.locationName) || locationTitle,
        description: seo?.openGraphDescription?.replace(/St\. Louis/g, storefrontData.locationName) || locationDescription,
        type: "website",
        locale: "en_US",
        siteName: storefrontData.locationName,
        images: seo?.openGraphImage ? [
          {
            url: typeof seo.openGraphImage === 'string'
              ? seo.openGraphImage
              : seo.openGraphImage.url || ''
          }
        ] : []
      },
      twitter: {
        card: "summary_large_image",
        title: seo?.openGraphTitle?.replace(/St\. Louis/g, storefrontData.locationName) || locationTitle,
        description: seo?.openGraphDescription?.replace(/St\. Louis/g, storefrontData.locationName) || locationDescription,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for storefront layout:', error);
    return {
      title: 'Storefront Location Not Found',
      description: 'The requested storefront location could not be found.',
      robots: { index: false, follow: false }
    };
  }
}

// Layout for storefront pages
export default async function StorefrontLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ storeslug: string }>;
}) {
  const { storeslug } = await params;
  let storefrontData: StorefrontData | null = null;

  try {
    storefrontData = await getStorefrontMetadata(storeslug);

    // If storefront doesn't exist or is inactive, show 404
    if (!storefrontData) {
      notFound();
    }
  } catch (error) {
    console.error('Storefront layout fetch error:', error);
    notFound();
  }

  return (
    <>
      {children}
    </>
  );
}
