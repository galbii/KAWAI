import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getLandingPageData } from "@/lib/payload";
import { LandingPageBlocksList } from "@/lib/blocks/LandingPageBlockRenderer";
import type { Metadata } from "next";

// Loading component for the landing page content
function LandingPageContentSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen flex items-center bg-kawai-black">
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
      
      {/* Content Blocks Skeleton */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-64"></div>
          <div className="h-12 bg-kawai-black/20 rounded mx-auto mb-8 w-96"></div>
          <div className="h-96 bg-kawai-black/20 rounded"></div>
        </div>
      </section>
      
      {/* Additional Content Skeleton */}
      <section className="bg-kawai-pearl py-24">
        <div className="container mx-auto px-6">
          <div className="h-8 bg-kawai-black/20 rounded mx-auto mb-6 w-48"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-kawai-black/20 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Server Component that fetches landing page data and renders content blocks
async function LandingPageContent({ 
  dealerSlug, 
  campaignSlug 
}: { 
  dealerSlug: string; 
  campaignSlug: string;
}) {
  let landingPageData: any = null;
  let error: string | null = null;

  try {
    landingPageData = await getLandingPageData(dealerSlug, campaignSlug);
    
    // If landing page doesn't exist or is inactive, show 404
    if (!landingPageData) {
      notFound();
    }
    
    // Handle expired campaigns with redirect
    if (landingPageData.expired && landingPageData.redirectUrl) {
      redirect(landingPageData.redirectUrl);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load landing page data';
    console.error('Landing page data fetch error:', error);
    
    // If there's a fetch error, show 404 as well since we can't determine if page exists
    notFound();
  }

  // If there's an error but we still have data, log it but continue
  if (error) {
    console.warn(`Landing page CMS data partially unavailable: ${error}. Using available data with fallbacks.`);
  }

  // Extract page content blocks
  const pageContent = landingPageData?.pageContent || [];
  
  // Custom tracking and analytics setup based on landing page configuration
  const analyticsSetup = landingPageData?.landingPage?.analyticsIntegrations;
  const customTrackingCode = analyticsSetup?.customTrackingCode;

  return (
    <div className="min-h-screen">
      {/* Custom tracking code injection */}
      {customTrackingCode && (
        <script
          dangerouslySetInnerHTML={{
            __html: customTrackingCode,
          }}
        />
      )}
      
      {/* Custom CSS injection */}
      {landingPageData?.landingPage?.customCSS && (
        <style
          dangerouslySetInnerHTML={{
            __html: landingPageData.landingPage.customCSS,
          }}
        />
      )}
      
      {/* Render page content blocks */}
      <LandingPageBlocksList 
        blocks={pageContent}
        className="landing-page-content"
      />
      
      {/* Custom JavaScript injection */}
      {landingPageData?.landingPage?.customJavaScript && (
        <script
          dangerouslySetInnerHTML={{
            __html: landingPageData.landingPage.customJavaScript,
          }}
        />
      )}
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; campaignSlug: string }> 
}): Promise<Metadata> {
  try {
    const { slug: dealerSlug, campaignSlug } = await params;
    const landingPageData = await getLandingPageData(dealerSlug, campaignSlug);
    
    if (!landingPageData?.seo) {
      return {
        title: 'Campaign Not Found',
        description: 'The requested campaign landing page could not be found.',
        robots: { index: false, follow: false }
      };
    }

    const { seo, landingPage, dealerLocation } = landingPageData;
    
    // Combine campaign and dealer location info for SEO
    const campaignTitle = seo.metaTitle || landingPage?.title || 'Special Campaign';
    const dealerName = dealerLocation?.locationName || 'Piano Gallery';
    const finalTitle = seo.metaTitle || `${campaignTitle} | ${dealerName}`;
    
    const finalDescription = seo.metaDescription || 
      `${campaignTitle} - Special campaign from ${dealerName}. Limited time offer on premium Kawai pianos.`;
    
    // Combine campaign and dealer keywords
    const campaignKeywords = typeof seo.keywords === 'string' ? seo.keywords.split(', ') : [];
    const dealerKeywords = dealerLocation?.seo?.keywords ? 
      (typeof dealerLocation.seo.keywords === 'string' ? dealerLocation.seo.keywords.split(', ') : []) : [];
    
    const combinedKeywords = [
      ...campaignKeywords,
      ...dealerKeywords,
      landingPage?.campaignType,
      'piano campaign',
      'special offer',
      'limited time'
    ].filter(Boolean).join(', ');

    return {
      title: finalTitle,
      description: finalDescription,
      keywords: combinedKeywords,
      authors: [{ name: dealerName }],
      openGraph: {
        title: seo.openGraphTitle || finalTitle,
        description: seo.openGraphDescription || finalDescription,
        type: "website",
        locale: "en_US",
        siteName: dealerName,
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
        title: seo.openGraphTitle || finalTitle,
        description: seo.openGraphDescription || finalDescription,
      },
      robots: {
        index: !seo.noIndex,
        follow: !seo.noIndex,
      },
      // Campaign-specific meta tags
      other: {
        'campaign-type': landingPage?.campaignType,
        'campaign-start': landingPage?.campaignStartDate,
        'campaign-end': landingPage?.campaignEndDate,
      }
    };
  } catch (error) {
    console.error('Error generating metadata for landing page:', error);
    return {
      title: 'Campaign Not Found',
      description: 'The requested campaign landing page could not be found.',
      robots: { index: false, follow: false }
    };
  }
}

export default async function LandingPage({ 
  params 
}: { 
  params: Promise<{ slug: string; campaignSlug: string }> 
}) {
  const { slug: dealerSlug, campaignSlug } = await params;
  
  return (
    <Suspense fallback={<LandingPageContentSkeleton />}>
      <LandingPageContent dealerSlug={dealerSlug} campaignSlug={campaignSlug} />
    </Suspense>
  );
}