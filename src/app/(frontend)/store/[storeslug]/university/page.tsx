import { getStorefrontBySlugDirect, getUniversityEventProducts } from '@/lib/payload/queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TCU_2025 } from './event.config';
import UniversityPage from './UniversityPage';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ storeslug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { storeslug } = await params;
  const { seo } = TCU_2025;
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

const EVENT_PIANO_MODELS = ['GL10', 'GL10 ATX4', 'K200', 'NV6', 'CA901', 'CA701']

export default async function UniversityRoute({ params }: Params) {
  const { storeslug } = await params;
  const [storefront, products] = await Promise.all([
    getStorefrontBySlugDirect(storeslug).catch(() => null),
    getUniversityEventProducts(EVENT_PIANO_MODELS),
  ])
  if (!storefront?.isActive) notFound();
  return <UniversityPage products={products} />;
}
