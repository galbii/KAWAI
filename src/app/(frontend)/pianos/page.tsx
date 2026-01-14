// Converted to server component for direct Payload queries

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ErrorBoundary, PianoSectionErrorFallback } from '@/components/ui/error-boundary'
import { getPianosPageDataDirect } from '@/lib/payload/queries'
import { PianoPageHero } from '@/components/piano/PianoPageHero'
import { FeaturedModelsGrid } from '@/components/piano/FeaturedModelsGrid'
import { PianoCategorySection } from '@/components/piano/PianoCategorySection'
import { ScrollAnimatedSection } from '@/components/ui/animations/ScrollAnimatedSection'
import {
  withFallback,
  getPianoPageDataWithFallbacks,
  FALLBACK_PIANO_PAGE_DATA
} from '@/lib/fallbacks'

// Import types from components
import type { LegacyPianoCategory } from '@/components/piano/PianoCategorySection'
import type { LegacyFeaturedModel } from '@/components/piano/FeaturedModelsGrid'

// Removed API fetch functions - now using direct Payload queries






// Main Piano Page Component - Server Component using direct Payload queries
export default async function PianosPageCMS() {
  // Use direct Payload query with comprehensive fallback handling
  let cmsData = null

  try {
    cmsData = await getPianosPageDataDirect()
  } catch (error) {
    console.warn('Failed to fetch CMS piano page data, using fallbacks:', error)
  }

  // Always use fallback system - ensures page works with or without CMS data
  const pageData = getPianoPageDataWithFallbacks(cmsData)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PianoPageHero heroData={pageData.hero} />

      {/* Featured Models Carousel */}
      <ScrollAnimatedSection className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-4">
              {pageData.featuredModelsSection?.title || "Flagship & Featured Models"}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto">
              {pageData.featuredModelsSection?.description || "Discover our most celebrated instruments, from competition-grade concert grands to innovative digital and hybrid pianos preferred by professionals worldwide."}
            </p>
          </div>
          
          <ErrorBoundary fallback={PianoSectionErrorFallback}>
            <FeaturedModelsGrid models={pageData.featuredModels} />
          </ErrorBoundary>
        </div>
      </ScrollAnimatedSection>

      {/* Piano Categories */}
      <div id="categories" className="bg-white">
        {pageData.categories.map((category: any, index: number) => (
          <ErrorBoundary key={category.slug} fallback={PianoSectionErrorFallback}>
            <PianoCategorySection category={category} index={index} />
          </ErrorBoundary>
        ))}
      </div>

      {/* CTA Section */}
      <ScrollAnimatedSection className="py-16 lg:py-24 text-center bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black mb-6">
            {pageData.cta.title}
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-kawai-black/70 max-w-3xl mx-auto mb-12">
            {pageData.cta.description}
          </p>
          
          <Link
            href={pageData.cta.ctaLink}
            className="inline-flex items-center px-8 py-4 bg-kawai-black hover:bg-kawai-black/80 text-kawai-pearl font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg"
          >
            <span>{pageData.cta.ctaText}</span>
            <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </ScrollAnimatedSection>
    </div>
  )
}