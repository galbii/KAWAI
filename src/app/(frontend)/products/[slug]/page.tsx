import { getProductBySlug } from '@/lib/payload'
import { resolveMediaUrl } from '@/lib/payload'
import { ProductPageRenderer } from '@/components/products/ProductPageRenderer'
import { ProductErrorFallback } from '@/components/products/ProductErrorFallback'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Ensure dynamic rendering for product pages
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for dynamic Product pages
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    }
  }

  const mainImageUrl = resolveMediaUrl(product.mainImage)

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: mainImageUrl ? [{ url: mainImageUrl }] : [],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: mainImageUrl ? [mainImageUrl] : [],
    }
  }
}

// Dynamic Product page component
export default async function ProductPage({ params }: PageProps) {
  try {
    const { slug } = await params
    const product = await getProductBySlug(slug)
    
    if (!product) {
      notFound()
    }

    return (
      <div className="min-h-screen">
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

// Generate static params for known products (for performance)
export async function generateStaticParams() {
  try {
    // Import here to avoid circular dependencies
    const { getProducts } = await import('@/lib/payload')
    
    // Fetch all active products to generate static paths
    const products = await getProducts()
    
    // Return slug parameters for all products
    return products
      .filter(product => product.slug && product.status === 'active')
      .map(product => ({
        slug: product.slug,
      }))
  } catch (error) {
    console.error('Error generating static params for products:', error)
    // Return empty array on error to enable dynamic generation
    return []
  }
}