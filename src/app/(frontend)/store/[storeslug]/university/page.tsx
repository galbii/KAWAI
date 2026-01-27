import { UniversityClientWrapper } from './university-client-wrapper';
import { getStorefrontBySlugDirect } from '@/lib/payload/queries';
import { notFound } from 'next/navigation';

// Force dynamic rendering - this page needs the slug param which is only available at request time
// University pages are unique per storefront and require database validation
export const dynamic = 'force-dynamic';

// Allow dynamic rendering for unknown slugs
// This enables the page to work with any storefront slug from the CMS
export const dynamicParams = true;

// Optional: Pre-generate known storefront university pages at build time
// Note: This function will not throw errors - it returns empty array on failure
export async function generateStaticParams() {
  try {
    // We don't have a direct method to fetch all storefronts,
    // so we'll skip static generation and rely on dynamic rendering
    // This is appropriate for a CMS-driven site where storefronts may change frequently
    return [];
  } catch (error) {
    console.error('Error generating static params for university pages:', error);
    return [];
  }
}

export default async function UniversityPage({ params }: { params: Promise<{ storeslug: string }> }) {
  // Await params as required by Next.js 15
  const { storeslug } = await params;

  // Validate that the storefront exists and is active using direct database access
  // This works during build time unlike API fetch
  let storefrontExists = false;

  try {
    const storefront = await getStorefrontBySlugDirect(storeslug);
    storefrontExists = storefront !== null;
  } catch (error) {
    console.error(`Error checking storefront ${storeslug}:`, error);
    // If there's an error fetching, assume it doesn't exist
    storefrontExists = false;
  }

  if (!storefrontExists) {
    console.log(`Storefront ${storeslug} not found or inactive, showing 404`);
    notFound();
  }

  // Header is rendered by the parent (frontend)/layout.tsx
  return <UniversityClientWrapper />;
}