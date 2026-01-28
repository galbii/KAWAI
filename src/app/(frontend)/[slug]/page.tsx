import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from 'next';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import config from '@payload-config';
import type { Page } from '@/payload-types';
import { Hero as PageHero } from '@/components/Hero';
import { RenderBlocks } from '@/components/RenderBlocks';

/**
 * Page Content Component (for Pages collection)
 * Renders pages from the Pages collection with Hero and dynamic blocks
 */
async function PageContent({ slug }: { slug: string }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const payload = await getPayload({ config });

  // CRITICAL: Check if this slug belongs to a storefront FIRST
  // This ensures redirects work even if middleware fails
  const storefront = await payload
    .find({
      collection: 'storefronts',
      where: {
        slug: { equals: slug },
        isActive: { equals: true },
      },
      limit: 1,
      depth: 0,
    })
    .then(({ docs }) => docs?.[0]);

  // If this is a storefront, redirect to /store/{slug}
  // Note: redirect() uses 'replace' by default in Server Components
  if (storefront) {
    redirect(`/store/${slug}`);
  }

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

  // If page doesn't exist or isn't published, return 404
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

// Enable ISR (Incremental Static Regeneration)
// Pages are statically generated at build time and revalidated every 1 hour
export const revalidate = 3600

// Pre-generate all published pages at build time
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

    console.log(`✅ [SEO] Pre-rendering ${pages.docs.length} pages for Google indexing`)

    return pages.docs.map((page: any) => ({ slug: page.slug }));
  } catch (error) {
    console.error('❌ [SEO] Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO - CRITICAL FOR GOOGLE INDEXING
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const payload = await getPayload({ config });

    // Check if this is a storefront first (will redirect, so don't generate metadata)
    const storefront = await payload
      .find({
        collection: 'storefronts',
        where: {
          slug: { equals: slug },
          isActive: { equals: true },
        },
        limit: 1,
        depth: 0,
      })
      .then(({ docs }) => docs?.[0]);

    // If this is a storefront, return redirect metadata
    if (storefront) {
      return {
        title: 'Redirecting...',
        description: 'Redirecting to storefront page.',
        robots: {
          index: false,
          follow: true,
        }
      };
    }

    // Check Pages collection (published only)
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

    // If Page not found, return 404 metadata
    if (!page) {
      console.log(`[SEO] Page "${slug}" not found`);
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: {
          index: false,
          follow: false,
        }
      };
    }

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
  } catch (error) {
    console.error(`[SEO] Error generating metadata for page:`, error);
    return {
      title: 'Page | KAWAI Pianos',
      description: 'KAWAI Pianos',
    };
  }
}

/**
 * Dynamic Route - /[slug]
 *
 * Renders content from Pages collection only
 * Storefronts are now at /store/[storeslug]
 * Returns 404 if page not found
 */
export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent slug={slug} />
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
