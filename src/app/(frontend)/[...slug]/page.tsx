import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from 'next';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import config from '@payload-config';
import type { Page } from '@/payload-types';
import { Hero as PageHero } from '@/components/Hero';
import { RenderBlocks } from '@/components/RenderBlocks';
import { AdminBarDoc } from '@/components/layout/AdminBarDoc';

/**
 * Page Content Component (for Pages collection)
 * Renders pages from the Pages collection with Hero and dynamic blocks
 */
async function PageContent({ slug }: { slug: string[] }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const payload = await getPayload({ config });

  // Join slug array into path string (e.g., ["store", "houston", "shsu"] → "store/houston/shsu")
  const slugPath = slug.join('/')

  const page = await payload
    .find({
      collection: 'pages',
      where: {
        slug: { equals: slugPath },
        // Only show published pages in production (unless in draft mode)
        ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
      },
      limit: 1,
      // CRITICAL: depth must be at least 1 to populate blocks with relationships
      // Blocks themselves don't need depth (they're inline), but their content might reference media
      depth: 1,
      draft: isDraftMode,
      overrideAccess: isDraftMode,
    })
    .then(({ docs }) => docs?.[0] as Page);

  // If page doesn't exist or isn't published, return 404
  if (!page) {
    notFound();
  }

  return (
    <>
      <AdminBarDoc
        collection="pages"
        id={String(page.id)}
        collectionLabels={{ singular: 'Page', plural: 'Pages' }}
      />
      {/* Hero Section */}
      {page.hero && <PageHero hero={page.hero} />}

      {/* Dynamic Block Content */}
      {page.layout?.length ? (
        <RenderBlocks blocks={page.layout} />
      ) : null}
    </>
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

    // Convert slug strings to arrays (e.g., "store/houston/shsu" → ["store", "houston", "shsu"])
    return pages.docs.map((page: any) => ({
      slug: page.slug ? page.slug.split('/') : []
    }));
  } catch (error) {
    console.error('❌ [SEO] Error generating static params:', error)
    return []
  }
}

// Generate metadata for SEO - CRITICAL FOR GOOGLE INDEXING
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    // Convert slug array to path string
    const slugPath = slug.join('/')
    const payload = await getPayload({ config });

    // Check if this is a storefront (redirect will happen in page component)
    // Only check first segment for storefront match
    const storefront = await payload
      .find({
        collection: 'storefronts',
        where: {
          slug: { equals: slug[0] || slugPath },
          isActive: { equals: true },
        },
        limit: 1,
        depth: 0,
      })
      .then(({ docs }) => docs?.[0]);

    // If storefront, return minimal metadata (page component will redirect)
    if (storefront) {
      return {
        title: 'Redirecting...',
        robots: { index: false, follow: false },
      };
    }

    // Check Pages collection (published only)
    const page = await payload
      .find({
        collection: 'pages',
        where: {
          slug: { equals: slugPath },
          _status: { equals: 'published' },
        },
        limit: 1,
        depth: 1,
      })
      .then(({ docs }) => docs?.[0]);

    // If Page not found, return 404 metadata
    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: {
          index: false,
          follow: false,
        }
      };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com';
    const metaTitle = page.seo?.metaTitle || `${page.title} | Kawai Pianos`;
    const metaDescription = page.seo?.metaDescription || `${page.title} - Kawai Pianos`;
    const ogTitle = page.seo?.openGraphTitle || metaTitle;
    const ogDescription = page.seo?.openGraphDescription || metaDescription;

    const ogImage = page.seo?.openGraphImage;
    const ogImageUrl = ogImage && typeof ogImage === 'object' && 'url' in ogImage && ogImage.url
      ? ogImage.url
      : undefined;

    return {
      title: { absolute: metaTitle },
      description: metaDescription,
      ...(page.seo?.keywords ? { keywords: page.seo.keywords } : {}),
      alternates: {
        canonical: `${siteUrl}/${slugPath}`,
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
        title: ogTitle,
        description: ogDescription,
        url: `${siteUrl}/${slugPath}`,
        siteName: 'Kawai Pianos',
        type: 'website',
        locale: 'en_US',
        ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
      },
    };
  } catch (error) {
    console.error(`[SEO] Error generating metadata for page:`, error);
    return {
      title: 'Page | Kawai Pianos',
      description: 'Kawai Pianos',
    };
  }
}

/**
 * Dynamic Catch-All Route - /[...slug]
 *
 * Renders content from Pages collection for nested paths
 * Supports multi-segment slugs like "store/houston/shsu" or single segments like "about"
 * Storefronts are at /store/[storeslug]
 * Returns 404 if page not found
 */
export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/')

  // CRITICAL: Check for storefront redirect BEFORE Suspense boundary
  // This ensures server-side redirect (307) instead of client-side (meta tag)
  // Only check first segment for storefront match
  const payload = await getPayload({ config });
  const storefront = await payload
    .find({
      collection: 'storefronts',
      where: {
        slug: { equals: slug[0] || slugPath },
        isActive: { equals: true },
      },
      limit: 1,
      depth: 0,
    })
    .then(({ docs }) => docs?.[0]);

  // If storefront exists, redirect BEFORE any rendering starts
  if (storefront) {
    redirect(`/store/${slug[0]}`);
  }

  // CRITICAL: Check page existence BEFORE Suspense boundary.
  // Calling notFound() inside a Suspense causes a hydration mismatch — the
  // skeleton is streamed to the client and then swapped mid-stream, which
  // breaks React hydration and makes all interactive elements (including
  // header links) unresponsive on 404 pages.
  const { isEnabled: isDraftMode } = await draftMode();
  const pageExists = await payload
    .find({
      collection: 'pages',
      where: {
        slug: { equals: slugPath },
        ...(isDraftMode ? {} : { _status: { equals: 'published' } }),
      },
      limit: 1,
      depth: 0,
      draft: isDraftMode,
      overrideAccess: isDraftMode,
    })
    .then(({ docs }) => docs[0] ?? null);

  if (!pageExists) {
    notFound();
  }

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
