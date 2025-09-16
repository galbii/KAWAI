import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDealerLocationData } from "@/lib/payload";
import { 
  ContactHero,
  ContactInfo,
  LocationContactForm,
  ContactMap 
} from "@/components/contact";
import type { HomePageData } from "@/lib/types/homepage";

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

function ContactInfoSkeleton() {
  return (
    <section className="py-16 bg-kawai-pearl animate-pulse">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="h-8 bg-kawai-black/20 rounded w-3/4"></div>
            <div className="h-6 bg-kawai-black/20 rounded"></div>
            <div className="h-6 bg-kawai-black/20 rounded w-5/6"></div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-kawai-black/20 rounded w-2/3"></div>
            <div className="h-32 bg-kawai-black/20 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-kawai-black/20 rounded w-3/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-kawai-black/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
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

// Server Component that fetches dealer location data and renders contact sections
async function ContactPageContent({ slug }: { slug: string }) {
  let dealerLocationData: HomePageData | null = null;
  let error: string | null = null;

  try {
    dealerLocationData = await getDealerLocationData(slug);
    
    // If dealer location doesn't exist or is inactive, show 404
    if (!dealerLocationData) {
      notFound();
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load dealer location data';
    console.error('Dealer location data fetch error:', error);
    
    // If there's a fetch error, show 404 as well since we can't determine if location exists
    notFound();
  }

  // If there's an error but we still have data, components will use their fallback defaults
  if (error) {
    console.warn(`Dealer location CMS data partially unavailable: ${error}. Using available data with fallbacks.`);
  }

  return (
    <div className="min-h-screen">
      {/* Contact Hero Section */}
      <ContactHero data={dealerLocationData?.heroSection} />
      
      {/* Contact Information Section */}
      <ContactInfo data={dealerLocationData?.showroomSection} />
      
      {/* Contact Form Section */}
      <LocationContactForm data={dealerLocationData?.contactFormSection} />
      
      {/* Map Section (if API key is available) */}
      <ContactMap data={dealerLocationData?.showroomSection} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const dealerLocationData = await getDealerLocationData(slug);
    
    if (!dealerLocationData?.seo) {
      return {
        title: 'Contact - Location Not Found',
        description: 'The requested Piano Gallery location could not be found.'
      };
    }

    const locationName = dealerLocationData.heroSection?.locationText || 'Kawai Piano Gallery';
    const baseTitle = dealerLocationData.seo.metaTitle || 'Contact - Kawai Piano Gallery';
    const contactTitle = `Contact ${locationName} | ${baseTitle}`;

    return {
      title: contactTitle,
      description: `Contact ${locationName}. ${dealerLocationData.seo.metaDescription || 'Get in touch with your local Kawai Piano Gallery.'}`,
      keywords: `contact, ${dealerLocationData.seo.keywords}`,
      openGraph: {
        title: contactTitle,
        description: `Contact ${locationName}. ${dealerLocationData.seo.openGraphDescription || dealerLocationData.seo.metaDescription || 'Get in touch with your local Kawai Piano Gallery.'}`,
        images: dealerLocationData.seo.openGraphImage ? [
          {
            url: typeof dealerLocationData.seo.openGraphImage === 'string' 
              ? dealerLocationData.seo.openGraphImage 
              : dealerLocationData.seo.openGraphImage.url || ''
          }
        ] : []
      }
    };
  } catch (error) {
    console.error('Error generating metadata for dealer location contact:', error);
    return {
      title: 'Contact - Location Not Found',
      description: 'The requested Piano Gallery location could not be found.'
    };
  }
}

// Removed generateStaticParams to fix ECONNREFUSED errors during build
// All dealer location contact pages will be dynamically generated at runtime
// This is appropriate for a CMS-driven site where dealer locations may change frequently

export const dynamicParams = true; // Allow dynamic rendering for unknown slugs

export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <ContactHeroSkeleton />
        <ContactInfoSkeleton />
        <ContactFormSkeleton />
      </div>
    }>
      <ContactPageContent slug={slug} />
    </Suspense>
  );
}