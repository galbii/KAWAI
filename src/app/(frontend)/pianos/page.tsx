'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ErrorBoundary, PianoSectionErrorFallback } from '@/components/ui/error-boundary'
import { PianoLoadingSkeleton, LoadingState } from '@/components/ui/loading-states'
import { getPianosPageData } from '@/lib/payload'
import { PianoPageHero } from '@/components/piano/PianoPageHero'
import { FeaturedPianoCarousel } from '@/components/piano/FeaturedPianoCarousel'
import { PianoCategorySection } from '@/components/piano/PianoCategorySection'
import { ScrollAnimatedSection } from '@/components/ui/animations/ScrollAnimatedSection'

// Import types from components
import type { LegacyPianoCategory } from '@/components/piano/PianoCategorySection'
import type { LegacyFeaturedModel } from '@/components/piano/FeaturedPianoCarousel'

// API fetch functions with error handling
async function fetchPianoCategories(): Promise<LegacyPianoCategory[]> {
  const response = await fetch('/api/piano-categories', {
    cache: 'force-cache',
    next: { revalidate: 300 }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch piano categories: ${response.status}`)
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch piano categories')
  }
  
  return result.data
}

async function fetchFeaturedModels(): Promise<LegacyFeaturedModel[]> {
  const response = await fetch('/api/featured-models', {
    cache: 'force-cache',
    next: { revalidate: 300 }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch featured models: ${response.status}`)
  }
  
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch featured models')
  }
  
  return result.data
}






// Main Piano Page Component
export default function PianosPageCMS() {
  const [pageData, setPageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log('[COMPONENT] Starting to load piano page data')
        setLoading(true)
        setError(null)

        // Use the new getPianosPageData function instead of separate API calls
        const data = await getPianosPageData()
        console.log('[COMPONENT] Received data:', { hasData: !!data, dataKeys: data ? Object.keys(data) : [] })
        setPageData(data)
      } catch (err) {
        console.error('[COMPONENT] Error loading piano page data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load piano data')
      } finally {
        console.log('[COMPONENT] Setting loading to false')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <PianoLoadingSkeleton />
      </div>
    )
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen">
        <LoadingState 
          message={`Error: ${error || 'Failed to load data'}`}
          showSpinner={false}
          className="min-h-[50vh]"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PianoPageHero heroData={pageData.hero} />

      {/* Featured Models Carousel */}
      <ScrollAnimatedSection className="py-12 lg:py-16 bg-kawai-pearl">
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
            <FeaturedPianoCarousel models={pageData.featuredModels} />
          </ErrorBoundary>
        </div>
      </ScrollAnimatedSection>

      {/* Piano Categories */}
      <div id="categories" className="bg-kawai-pearl">
        {pageData.categories.map((category: any, index: number) => (
          <ErrorBoundary key={category.slug} fallback={PianoSectionErrorFallback}>
            <PianoCategorySection category={category} index={index} />
          </ErrorBoundary>
        ))}
      </div>

      {/* CTA Section */}
      <ScrollAnimatedSection className="py-16 lg:py-24 text-center bg-kawai-pearl">
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