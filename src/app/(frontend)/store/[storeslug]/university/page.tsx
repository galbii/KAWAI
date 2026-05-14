import { getStorefrontBySlugDirect } from '@/lib/payload/queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TSU_2025 } from './event.config';
import UniversityPage from './UniversityPage';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { storeslug } = await params;
  const { seo } = TSU_2025;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage }],
    },
    alternates: {
      canonical: `https://www.kawaius.com/store/${storeslug}/university`,
    },
  };
}

export default async function UniversityRoute({ params }: Params) {
  const { storeslug } = await params;
  const storefront = await getStorefrontBySlugDirect(storeslug).catch(() => null);
  if (!storefront?.isActive) notFound();
  return <UniversityPage />;
}
