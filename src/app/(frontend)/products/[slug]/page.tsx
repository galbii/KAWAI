import { getProductBySlugDirect } from '@/lib/payload/queries'
import { resolveMediaUrl } from '@/lib/payload'
import { ProductPageRenderer } from '@/components/products/ProductPageRenderer'
import { ProductErrorFallback } from '@/components/products/ProductErrorFallback'
import { ProductLivePreview } from '@/components/products/ProductLivePreview'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminBarDoc } from '@/components/layout/AdminBarDoc'

// Use ISR (Incremental Static Regeneration) for better SEO and performance
// Pages are statically generated and revalidated every 1 hour
export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for dynamic Product pages
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { slug } = params
  const product = await getProductBySlugDirect(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

  const title = product.seo?.metaTitle || product.name || 'Piano Product'
  const description = product.seo?.metaDescription || product.description || ''

  const ogImageRaw = product.seo?.ogImage
  const ogImageUrl =
    typeof ogImageRaw === 'object' && ogImageRaw !== null && 'url' in ogImageRaw
      ? (ogImageRaw as { url: string }).url
      : product.imageUrl || null

  return {
    title,
    description,
    ...(product.seo?.keywords ? { keywords: product.seo.keywords } : {}),
    alternates: {
      canonical: `${siteUrl}/products/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/products/${slug}`,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }] : [],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@KawaiPianoUSA',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    }
  }
}

// Dynamic Product page component
export default async function ProductPage(props: PageProps) {
  try {
    const params = await props.params
    const { slug } = params
    const product = await getProductBySlugDirect(slug)
    
    if (!product) {
      notFound()
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kawaius.com'

    return (
      <div className="min-h-screen">
        <AdminBarDoc
          collection="products"
          id={String(product.id)}
          collectionLabels={{ singular: 'Product', plural: 'Products' }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema({
              name: product.name || product.slug || '',
              description: product.description || '',
              type: (product.type as 'digital' | 'grand' | 'hybrid' | 'upright' | 'accessory' | 'software') || 'digital',
              ...(product.imageUrl ? { image: product.imageUrl } : {}),
              ...(product.price?.msrp ? {
                offers: {
                  price: product.price.msrp,
                  currency: product.price.currency || 'USD',
                },
              } : {}),
              ...(product.variations?.[0]?.sku ? { sku: product.variations[0].sku } : {}),
              url: `${siteUrl}/products/${product.slug}`,
              ...(product.model ? { model: product.model } : {}),
            })).replace(/</g, '\\u003c')
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema([
              { name: 'Home', url: `${siteUrl}` },
              ...(() => {
                const typeMap: Record<string, { name: string; url: string }> = {
                  digital: { name: 'Digital Pianos', url: `${siteUrl}/pianos/digital` },
                  grand: { name: 'Grand Pianos', url: `${siteUrl}/pianos/grand` },
                  upright: { name: 'Upright Pianos', url: `${siteUrl}/pianos/upright` },
                  hybrid: { name: 'Hybrid Pianos', url: `${siteUrl}/pianos/hybrid` },
                  accessory: { name: 'Accessories', url: `${siteUrl}/pianos/accessories` },
                }
                return [typeMap[product.type ?? ''] ?? { name: 'Pianos', url: `${siteUrl}/pianos` }]
              })(),
              { name: product.name || product.slug || '', url: `${siteUrl}/products/${product.slug}` },
            ])).replace(/</g, '\\u003c')
          }}
        />
        <ProductLivePreview />
        <ErrorBoundary fallback={ProductErrorFallback}>
          <ProductPageRenderer product={product} />
        </ErrorBoundary>
      </div>
    )
  } catch (error) {
    console.error('Error loading product page:', error)
    return <ProductErrorFallback />
  }
}

// Pre-generate all active product pages at build time for optimal SEO
// This ensures Google crawler gets fast, pre-rendered HTML for all products
export async function generateStaticParams() {
  try {
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    const products = await payload.find({
      collection: 'products',
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 500, // Adjust based on product catalog size
      select: {
        slug: true,
        visibility: true,
      },
    })

    // Filter out products that shouldn't be in catalog
    const visibleProducts = products.docs.filter((product: any) => {
      return product.visibility?.showInCatalog !== false
    })

    console.log(`✅ [SEO] Pre-rendering ${visibleProducts.length} product pages for Google indexing`)

    return visibleProducts.map((product: any) => ({
      slug: product.slug,
    }))
  } catch (error) {
    console.error('❌ [SEO] Error generating static params for products:', error)
    // Return empty array to allow build to continue with on-demand generation
    return []
  }
}