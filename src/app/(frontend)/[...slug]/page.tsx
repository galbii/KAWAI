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
async function PageContent({ slug }: { slug: string[] }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const payload = await getPayload({ config });

  // Join slug array into path string (e.g., ["store", "houston", "shsu"] → "store/houston/shsu")
  const slugPath = slug.join('/')

  console.log('🔍 [PAGE DEBUG] ==================== START ====================')
  console.log('🔍 [PAGE DEBUG] Slug array:', slug)
  console.log('🔍 [PAGE DEBUG] Slug path:', slugPath)
  console.log('🔍 [PAGE DEBUG] Draft mode:', isDraftMode)

  // First, let's see what's in the database without ANY filters
  console.log('🔍 [PAGE DEBUG] Step 1: Checking if page exists at all (no filters)...')
  const allPages = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slugPath },
    },
    limit: 1,
    depth: 0,
  })
  console.log('🔍 [PAGE DEBUG] Pages found (no filters):', allPages.totalDocs)
  if (allPages.docs.length > 0) {
    const foundPage = allPages.docs[0]
    if (foundPage) {
      console.log('🔍 [PAGE DEBUG] Page found:', {
        id: foundPage.id,
        title: foundPage.title,
        slug: foundPage.slug,
        _status: foundPage._status,
        category: foundPage.category,
        publishedAt: foundPage.publishedAt,
      })
    }
  } else {
    console.log('🔍 [PAGE DEBUG] No page found with slug:', slugPath)
  }

  // Now check for storefronts with same slug (only check first segment for storefronts)
  console.log('🔍 [PAGE DEBUG] Step 2: Checking for storefront conflicts...')
  const storefrontCheck = await payload.find({
    collection: 'storefronts',
    where: {
      slug: { equals: slug[0] || slugPath },
    },
    limit: 1,
    depth: 0,
  })
  console.log('🔍 [PAGE DEBUG] Storefronts found:', storefrontCheck.totalDocs)
  if (storefrontCheck.docs.length > 0) {
    const foundStorefront = storefrontCheck.docs[0]
    if (foundStorefront) {
      console.log('🔍 [PAGE DEBUG] ⚠️ CONFLICT: Storefront exists with same slug:', foundStorefront.slug)
    }
  }

  // Fetch page data with same filters as existence check
  console.log('🔍 [PAGE DEBUG] Step 3: Fetching page with published filter...')
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

  console.log('🔍 [PAGE DEBUG] Page with published filter found:', page ? 'YES' : 'NO')
  if (page) {
    console.log('🔍 [PAGE DEBUG] Page details:', {
      id: page.id,
      title: page.title,
      slug: page.slug,
      _status: page._status,
      hasHero: !!page.hero,
      layoutBlocks: page.layout?.length || 0,
    })

    // CRITICAL: Log block structure to debug rendering
    if (page.layout && page.layout.length > 0) {
      console.log('🔍 [PAGE DEBUG] Block Structure Analysis:')
      console.log('  Total blocks:', page.layout.length)
      page.layout.forEach((block, index) => {
        console.log(`  Block ${index}:`, {
          blockType: block.blockType,
          id: block.id,
          hasContent: Object.keys(block).length > 2, // More than blockType + id
          keys: Object.keys(block),
        })
      })
    } else {
      console.log('🔍 [PAGE DEBUG] ⚠️ No blocks in layout array!')
    }
  }
  console.log('🔍 [PAGE DEBUG] ==================== END ====================')

  // If page doesn't exist or isn't published, return 404
  if (!page) {
    notFound();
  }

  return (
    <>
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

    console.log(`✅ [SEO] Pre-rendering ${pages.docs.length} pages for Google indexing`)

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
    console.log('🔍 [METADATA DEBUG] Checking for page with slug:', slugPath)

    // First check without _status filter
    const pageNoFilter = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slugPath },
      },
      limit: 1,
      depth: 0,
    })
    console.log('🔍 [METADATA DEBUG] Page found (no filter):', pageNoFilter.totalDocs)
    if (pageNoFilter.docs.length > 0 && pageNoFilter.docs[0]) {
      console.log('🔍 [METADATA DEBUG] Page _status:', pageNoFilter.docs[0]._status)
    }

    const page = await payload
      .find({
        collection: 'pages',
        where: {
          slug: { equals: slugPath },
          _status: { equals: 'published' },
        },
        limit: 1,
        depth: 0,
      })
      .then(({ docs }) => docs?.[0]);

    console.log('🔍 [METADATA DEBUG] Page found (with published filter):', page ? 'YES' : 'NO')

    // If Page not found, return 404 metadata
    if (!page) {
      console.log(`[SEO] Page "${slugPath}" not found`);
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

    console.log(`[SEO] Generated metadata for Page "${slugPath}": ${defaultTitle}`);

    return {
      title: defaultTitle,
      description: defaultDescription,
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
        title: defaultTitle,
        description: defaultDescription,
        url: `${siteUrl}/${slugPath}`,
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
