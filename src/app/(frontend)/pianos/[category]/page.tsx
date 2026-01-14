import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { CategoryHero } from "@/components/piano/category-hero"
import { UnifiedPianoSeries } from "@/components/piano/unified-piano-series"
import { CategoryCTA } from "@/components/piano/category-cta"
import {
  isValidCategory,
  getCategoryConfig,
  getCategorySlugs,
  getCategoryHeroTitle,
  getCategoryHeroImage,
  getCategoryStats,
  getCategoryCTA,
  type PianoCategorySlug
} from '@/lib/data'
import { getProductlines, getProductlinesWithProducts } from '@/lib/payload'
import { Productline } from '@/lib/types'

// Route parameters interface
interface CategoryPageParams {
  params: Promise<{
    category: string
  }>
}

/**
 * Generate static parameters for all valid piano categories at build time
 * This enables static generation for /pianos/digital, /pianos/grand, etc.
 */
export async function generateStaticParams(): Promise<Array<{ category: PianoCategorySlug }>> {
  const categories = getCategorySlugs()
  
  return categories.map((category) => ({
    category,
  }))
}

/**
 * Dynamic metadata generation for SEO optimization
 * Each category gets optimized title, description, and OpenGraph tags
 */
export async function generateMetadata({ params }: CategoryPageParams): Promise<Metadata> {
  const resolvedParams = await params
  const { category } = resolvedParams
  
  // Validate category and get config
  if (!isValidCategory(category)) {
    return {
      title: 'Piano Category Not Found',
      description: 'The piano category you are looking for does not exist.',
    }
  }

  const categoryConfig = getCategoryConfig(category)
  if (!categoryConfig) {
    return {
      title: 'Piano Category Not Found',
      description: 'The piano category you are looking for does not exist.',
    }
  }

  const stats = getCategoryStats(category)
  const canonicalUrl = `https://kawai-piano.com/pianos/${category}`
  
  return {
    title: categoryConfig.metaTitle,
    description: categoryConfig.metaDescription,
    keywords: categoryConfig.seoKeywords,
    openGraph: {
      title: categoryConfig.metaTitle,
      description: categoryConfig.metaDescription,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Kawai Piano',
      images: [
        {
          url: getCategoryHeroImage(category),
          width: 1200,
          height: 630,
          alt: `${categoryConfig.name} - ${categoryConfig.shortDescription}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: categoryConfig.metaTitle,
      description: categoryConfig.metaDescription,
      images: [getCategoryHeroImage(category)],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      'price-range': categoryConfig.priceRange,
      'piano-category': categoryConfig.name,
      'model-count': stats.totalModels?.toString() || '0',
    },
  }
}

/**
 * Dynamic Piano Category Page Component
 * Handles all piano categories: /pianos/digital, /pianos/grand, /pianos/hybrid, /pianos/upright
 */
export default async function CategoryPage({ params }: CategoryPageParams) {
  const resolvedParams = await params
  const { category } = resolvedParams

  // Validate category slug - return 404 for invalid categories
  if (!isValidCategory(category)) {
    notFound()
  }

  // Get category configuration
  const categoryConfig = getCategoryConfig(category)
  if (!categoryConfig) {
    notFound()
  }

  // Get category statistics and content
  const stats = getCategoryStats(category)
  const heroTitle = getCategoryHeroTitle(category)
  const ctaText = getCategoryCTA(category)

  // Fetch CMS data with fallback handling
  let productlines: Productline[] = []
  let series: any[] = []
  let loading = false
  let error: string | null = null

  try {
    // Try to fetch CMS data with products joined
    const seriesWithPianos = await getProductlinesWithProducts(category)
    
    if (seriesWithPianos && seriesWithPianos.length > 0) {
      series = seriesWithPianos
      // Also fetch basic productlines for compatibility
      productlines = await getProductlines(category)
    } else {
      // Fallback to basic productlines if no products are joined
      productlines = await getProductlines(category)
      // Create series data from productlines
      series = productlines.map((productline) => ({
        name: productline.name,
        description: productline.description || categoryConfig.shortDescription,
        pianos: [], // Will be populated by UnifiedPianoSeries if needed
        slides: productline.slides || []
      }))
    }
  } catch (err) {
    console.error(`Failed to fetch ${category} category data:`, err)
    error = `Failed to load ${categoryConfig.name.toLowerCase()} piano data`
    // Series will remain empty array, component will handle gracefully
  }

  // Generate hero stats based on category and CMS data
  const heroStats = [
    { 
      label: "Piano Series", 
      value: stats.totalModels ? Math.ceil(stats.totalModels / 3).toString() : (series.length || 4).toString()
    },
    { 
      label: `${categoryConfig.name.replace(' Pianos', '')} Models`, 
      value: stats.totalModels?.toString() || (series.reduce((acc, s) => acc + (s.pianos?.length || 0), 0) || 12).toString()
    },
    {
      label: "Price Range",
      value: categoryConfig.priceRange?.split(' - ')[0]?.replace('$', '') || 'Contact for pricing'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Category Hero Section */}
      <CategoryHero
        category={categoryConfig.name}
        title={heroTitle}
        description={categoryConfig.description}
        backgroundImage={getCategoryHeroImage(category)}
        stats={heroStats}
      />

      {/* Piano Series Section */}
      {loading ? (
        <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-kawai-neutral/20 rounded-lg mb-4 max-w-md mx-auto" />
              <div className="h-4 bg-kawai-neutral/20 rounded-lg mb-8 max-w-lg mx-auto" />
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-kawai-neutral/20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="py-16 lg:py-24 bg-kawai-pearl text-center">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-kawai-red/10 border border-kawai-red/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-kawai-red mb-2">Unable to load product data</h3>
              <p className="text-kawai-black/70">{error}</p>
              <p className="text-sm text-kawai-black/60 mt-2">
                Please try refreshing the page or contact support if the issue persists.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <UnifiedPianoSeries
          title={`Explore ${categoryConfig.name} Series`}
          description={`Discover our complete collection of ${categoryConfig.name.toLowerCase()} series. Each series showcases distinct technologies and features for different musical needs.`}
          series={series}
          categorySlug={category}
          productlines={productlines}
        />
      )}

      {/* Category-Specific Call to Action */}
      <CategoryCTA
        category={categoryConfig.name}
        title={`Experience ${categoryConfig.name.replace(' Pianos', '')} Excellence`}
        description={`Visit our showroom to experience the ${categoryConfig.keyFeatures.slice(0, 2).join(', ')} and discover why ${categoryConfig.name.toLowerCase()} are trusted by musicians worldwide.`}
        ctaText={ctaText}
        backgroundTheme={categoryConfig.colorTheme.primary}
      />
    </div>
  )
}