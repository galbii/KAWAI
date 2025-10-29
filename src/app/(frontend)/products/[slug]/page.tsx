import { getProductBySlug } from '@/lib/payload'
import { resolveMediaUrl } from '@/lib/payload'
import { ProductPageRenderer } from '@/components/products/ProductPageRenderer'
import { ProductErrorFallback } from '@/components/products/ProductErrorFallback'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Use ISR (Incremental Static Regeneration) for better SEO and performance
// Pages are statically generated and revalidated every 15 minutes
export const revalidate = 900

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

// Removed generateStaticParams to fix ECONNREFUSED errors during build
// All product pages will be dynamically generated at runtime
// This is appropriate for a CMS-driven site where content changes frequently