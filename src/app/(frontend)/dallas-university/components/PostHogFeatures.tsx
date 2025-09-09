'use client'

import { useEffect, useState } from 'react'
import { usePostHog } from './hooks/usePostHog'
import type { Piano } from './data/pianos'

// Example component demonstrating PostHog feature flags
export function HeroSectionWithFeatureFlags({ children }: { children: React.ReactNode }) {
  const { getFeatureFlag } = usePostHog()
  const [ctaVariation, setCtaVariation] = useState<string>('book-consultation')
  const [countdownPosition, setCountdownPosition] = useState<string>('hero')

  useEffect(() => {
    // Get feature flag values
    const cta = getFeatureFlag('hero-cta-variation') as string
    const countdown = getFeatureFlag('countdown-position') as string
    
    if (cta) setCtaVariation(cta)
    if (countdown) setCountdownPosition(countdown)
  }, [getFeatureFlag])

  return (
    <div className="relative">
      {/* Conditional countdown timer placement */}
      {countdownPosition === 'floating' && (
        <div className="fixed top-4 right-4 z-50 bg-kawai-red text-white px-4 py-2 rounded-lg shadow-lg">
          {/* Floating countdown timer */}
          <div className="text-sm font-bold">Sale ends in: 50 days!</div>
        </div>
      )}
      
      {children}
      
      {/* This data attribute can be used for PostHog analytics */}
      <div 
        data-ph-capture 
        data-hero-cta-variation={ctaVariation}
        data-countdown-position={countdownPosition}
        className="hidden"
      />
    </div>
  )
}

// Piano gallery layout variations
export function PianoGalleryWithFeatureFlags({ pianos }: { pianos: Piano[] }) {
  const { getFeatureFlag } = usePostHog()
  const [layout, setLayout] = useState<string>('grid')

  useEffect(() => {
    const galleryLayout = getFeatureFlag('piano-gallery-layout') as string
    if (galleryLayout) setLayout(galleryLayout)
  }, [getFeatureFlag])

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pianos.map((piano, index) => (
        <div key={index} className="border rounded-lg p-4">
          <h3 className="font-bold">{piano.name}</h3>
          <p className="text-kawai-red font-bold">{piano.price}</p>
        </div>
      ))}
    </div>
  )

  const renderCarouselLayout = () => (
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {pianos.map((piano, index) => (
        <div key={index} className="flex-shrink-0 w-80 border rounded-lg p-4">
          <h3 className="font-bold">{piano.name}</h3>
          <p className="text-kawai-red font-bold">{piano.price}</p>
        </div>
      ))}
    </div>
  )

  const renderListLayout = () => (
    <div className="space-y-4">
      {pianos.map((piano, index) => (
        <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold">{piano.name}</h3>
            <p className="text-gray-600">{piano.model}</p>
          </div>
          <p className="text-kawai-red font-bold text-xl">{piano.price}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div data-ph-capture data-gallery-layout={layout}>
      {layout === 'carousel' && renderCarouselLayout()}
      {layout === 'list_detailed' && renderListLayout()}
      {layout === 'grid' && renderGridLayout()}
    </div>
  )
}

// CTA button with variation testing
interface CTAButtonProps {
  variation?: string
  onClick: () => void
  source: string
  className?: string
}

export function CTAButtonWithVariations({ 
  variation = 'book-consultation', 
  onClick, 
  source, 
  className = '' 
}: CTAButtonProps) {
  const getButtonText = () => {
    switch (variation) {
      case 'find-piano':
        return 'Find Your Perfect Piano'
      case 'secure-spot':
        return 'Secure Your Spot Today'
      case 'book-consultation':
      default:
        return 'Book Your Piano Consultation'
    }
  }

  const getButtonStyle = () => {
    const baseClasses = 'px-8 py-4 rounded-lg font-bold text-white transition-all duration-200'
    
    switch (variation) {
      case 'find-piano':
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800`
      case 'secure-spot':
        return `${baseClasses} bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800`
      case 'book-consultation':
      default:
        return `${baseClasses} bg-gradient-to-r from-kawai-red to-red-600 hover:from-red-600 hover:to-red-700`
    }
  }

  return (
    <button
      data-ph-capture
      data-cta-variation={variation}
      data-cta-source={source}
      className={`${getButtonStyle()} ${className}`}
      onClick={onClick}
    >
      {getButtonText()}
    </button>
  )
}

const PostHogFeatures = {
  HeroSectionWithFeatureFlags,
  PianoGalleryWithFeatureFlags,
  CTAButtonWithVariations
}

export default PostHogFeatures