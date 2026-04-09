import { notFound, redirect } from "next/navigation";
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import type { Page } from '@/payload-types';
import { Hero as PageHero } from '@/components/Hero';
import { RenderBlocks } from '@/components/RenderBlocks';
import { AdminBarDoc } from '@/components/layout/AdminBarDoc';
import { getPayloadClient, getActiveStorefrontSlugs } from '@/lib/payload/queries';

// Enable ISR — pages statically generated at build, revalidated every 1 hour
export const revalidate = 3600

// Pre-generate all published pages at build time
export async function generateStaticParams() {
  try {
    const { getPayloadHMR } = await import('@payloadcms/next/utilities')
    const configPromise = await import('@payload-config')
    const payload = await getPayloadHMR({ config: configPromise.default })

    const pages = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
      select: { slug: true },
    });

    return pages.docs.map((page: any) => ({
      slug: page.slug ? page.slug.split('/') : []
    }));
  } catch (error) {
    console.error('❌ [generateStaticParams] Error:', error)
    return []
  }
}

function getPageData(slugPath: string, isDraftMode: boolean): Promise<Page | null> {
  if (isDraftMode) {
    // Draft mode: never cache, always fetch live
    return (async () => {
      const payload = await getPayloadClient()
      return payload
        .find({
          collection: 'pages',
          where: { slug: { equals: slugPath } },
          limit: 1,
          depth: 1,
          draft: true,
          overrideAccess: true,
        })
        .then(({ docs }) => docs[0] as Page ?? null)
    })()
  }

  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload
        .find({
          collection: 'pages',
          where: {
            slug: { equals: slugPath },
            _status: { equals: 'published' },
          },
          limit: 1,
          depth: 1,
        })
        .then(({ docs }) => docs[0] as Page ?? null)
    },
    [`page-${slugPath}`],
    { tags: [`page-${slugPath}`, 'pages'], revalidate: 3600 },
  )()
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const slugPath = slug.join('/')

    // Use cached slug set — no DB hit for non-storefront pages
    const storefrontSlugs = await getActiveStorefrontSlugs()
    if (storefrontSlugs.includes(slug[0] ?? '')) {
      return { title: 'Redirecting...', robots: { index: false, follow: false } };
    }

    const page = await unstable_cache(
      async () => {
        const payload = await getPayloadClient()
        return payload
          .find({
            collection: 'pages',
            where: { slug: { equals: slugPath }, _status: { equals: 'published' } },
            limit: 1,
            depth: 1,
          })
          .then(({ docs }) => docs[0] ?? null)
      },
      [`page-meta-${slugPath}`],
      { tags: [`page-meta-${slugPath}`, 'pages'], revalidate: 3600 },
    )()

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
        robots: { index: false, follow: false },
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
      alternates: { canonical: `${siteUrl}/${slugPath}` },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
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
    console.error(`[generateMetadata] Error:`, error);
    return { title: 'Page | Kawai Pianos', description: 'Kawai Pianos' };
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugPath = slug.join('/')

  // Cached Set lookup — no DB query for non-storefront pages
  const storefrontSlugs = await getActiveStorefrontSlugs()
  if (storefrontSlugs.includes(slug[0] ?? '')) {
    redirect(`/store/${slug[0]}`)
  }

  const { isEnabled: isDraftMode } = await draftMode();

  // Single query: fetch page at depth:1 — replaces the old depth:0 existence
  // check + separate depth:1 render fetch. If null → 404, else → render.
  const page = await getPageData(slugPath, isDraftMode)

  if (!page) {
    notFound()
  }

  return (
    <>
      <AdminBarDoc
        collection="pages"
        id={String(page.id)}
        collectionLabels={{ singular: 'Page', plural: 'Pages' }}
      />
      {page.hero && <PageHero hero={page.hero} />}
      {page.layout?.length ? <RenderBlocks blocks={page.layout} /> : null}
    </>
  )
}
