import { UniversityClientWrapper } from './university-client-wrapper';
import { getStorefrontBySlugDirect, getPayloadClient } from '@/lib/payload/queries';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import type { Metadata } from 'next';
import type { Page } from '@/payload-types';
import { RenderBlocks } from '@/components/RenderBlocks';
import { Hero as PageHero } from '@/components/Hero';
import { AdminBarDoc } from '@/components/layout/AdminBarDoc';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ storeslug: string }> }

function getCmsPage(slugPath: string, isDraftMode: boolean): Promise<Page | null> {
  if (isDraftMode) {
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
        .then(({ docs }) => (docs[0] as Page) ?? null)
    })()
  }

  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload
        .find({
          collection: 'pages',
          where: { slug: { equals: slugPath }, _status: { equals: 'published' } },
          limit: 1,
          depth: 1,
        })
        .then(({ docs }) => (docs[0] as Page) ?? null)
    },
    [`page-${slugPath}`],
    { tags: [`page-${slugPath}`, 'pages'], revalidate: 3600 },
  )()
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { storeslug } = await params;
  const slugPath = `store/${storeslug}/university`;
  const page = await getCmsPage(slugPath, false);
  if (!page?.seo) return {};

  const { seo } = page;
  const metaTitle = seo.metaTitle || `${page.title} | Kawai Pianos`;
  const metaDescription = seo.metaDescription || '';
  const ogTitle = seo.openGraphTitle || metaTitle;
  const ogDescription = seo.openGraphDescription || metaDescription;
  const ogImage = seo.openGraphImage;
  const ogImageUrl =
    ogImage && typeof ogImage === 'object' && 'url' in ogImage && ogImage.url
      ? ogImage.url
      : undefined;

  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    ...(seo.keywords ? { keywords: seo.keywords } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  };
}

export default async function UniversityPage({ params }: Params) {
  const { storeslug } = await params;

  const storefront = await getStorefrontBySlugDirect(storeslug).catch(() => null);
  if (!storefront) notFound();

  const { isEnabled: isDraftMode } = await draftMode();
  const slugPath = `store/${storeslug}/university`;
  const cmsPage = await getCmsPage(slugPath, isDraftMode);

  if (cmsPage) {
    return (
      <>
        <AdminBarDoc
          collection="pages"
          id={String(cmsPage.id)}
          collectionLabels={{ singular: 'Page', plural: 'Pages' }}
        />
        {cmsPage.hero && <PageHero hero={cmsPage.hero} />}
        {cmsPage.layout?.length ? <RenderBlocks blocks={cmsPage.layout} /> : null}
      </>
    );
  }

  return <UniversityClientWrapper />;
}
