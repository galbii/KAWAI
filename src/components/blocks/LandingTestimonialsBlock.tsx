'use client'

import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

interface LandingTestimonialsBlockProps {
  header?: {
    preTitle?: string | null
    title?: string | null
    subtitle?: string | null
    description?: string | null
  }
  testimonials?: Array<{
    quote?: string | null
    shortQuote?: string | null
    rating?: number | null
    customer?: {
      name?: string | null
      title?: string | null
      company?: string | null
      location?: string | null
      avatar?: string | Media | null
      initials?: string | null
    }
    product?: {
      name?: string | null
      category?: 'digital' | 'grand' | 'upright' | 'hybrid' | 'service' | 'accessories' | 'general' | null
      purchaseDate?: string | null
    }
    verification?: {
      verified?: boolean | null
      source?: 'direct' | 'google' | 'facebook' | 'trustpilot' | 'yelp' | 'bbb' | 'amazon' | 'music-store' | 'other' | null
      reviewDate?: string | null
      sourceUrl?: string | null
    }
    display?: {
      featured?: boolean | null
      campaignSpecific?: boolean | null
      showFullQuote?: boolean | null
      priority?: number | null
    }
  }> | null
  layout?: {
    style?: 'cards' | 'carousel' | 'grid' | 'masonry' | 'featured-grid' | 'alternating' | null
    columns?: 'one' | 'two' | 'three' | 'four' | null
    showAvatars?: boolean | null
    showRatings?: boolean | null
    showCompany?: boolean | null
    showLocation?: boolean | null
    showSource?: boolean | null
    showDates?: boolean | null
    showProduct?: boolean | null
    backgroundColor?: 'none' | 'light-gray' | 'dark-gray' | 'white' | 'brand-light' | 'gradient' | null
  }
  carouselSettings?: {
    autoplay?: boolean | null
    autoplaySpeed?: number | null
    pauseOnHover?: boolean | null
    showDots?: boolean | null
    showArrows?: boolean | null
    slidesToShow?: 'one' | 'two' | 'three' | null
    infinite?: boolean | null
  }
  socialProof?: {
    showOverallRating?: boolean | null
    overallRating?: number | null
    totalReviews?: number | null
    ratingText?: string | null
    showTrustBadges?: boolean | null
    trustBadges?: Array<{
      name?: string | null
      image?: string | Media | null
      url?: string | null
    }> | null
  }
  cta?: {
    showCta?: boolean | null
    ctaTitle?: string | null
    ctaDescription?: string | null
    ctaButtonText?: string | null
    ctaButtonLink?: string | null
    ctaStyle?: 'primary' | 'secondary' | 'outline' | null
  }
}

// Star Rating Component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Avatar Component
function CustomerAvatar({ 
  customer, 
  size = 'md' 
}: { 
  customer: any
  size?: 'sm' | 'md' | 'lg' 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  }

  const generateInitials = (name: string) => {
    return name.split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (customer?.avatar) {
    return (
      <div className={cn('rounded-full overflow-hidden flex-shrink-0', sizeClasses[size])}>
        <MediaRenderer 
          media={customer.avatar}
          preset="thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  const initials = customer?.initials || (customer?.name ? generateInitials(customer.name) : 'AN')

  return (
    <div className={cn(
      'rounded-full bg-kawai-red text-white flex items-center justify-center font-medium flex-shrink-0',
      sizeClasses[size]
    )}>
      {initials}
    </div>
  )
}

// Carousel Component
function TestimonialCarousel({ 
  testimonials, 
  settings, 
  layout,
  renderTestimonial 
}: { 
  testimonials: any[]
  settings: any
  layout: any
  renderTestimonial: (testimonial: any, index: number) => React.ReactNode
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(settings.autoplay !== false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const slidesToShow = (() => {
    const mapping = {
      one: 1,
      two: 2,
      three: 3
    } as const
    const key = (settings.slidesToShow || 'three') as keyof typeof mapping
    return mapping[key] || 3
  })()

  const totalSlides = Math.ceil(testimonials.length / slidesToShow)

  useEffect(() => {
    if (!isPlaying || !settings.autoplay) return

    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => 
        settings.infinite !== false ? (prev + 1) % totalSlides : Math.min(prev + 1, totalSlides - 1)
      )
    }, settings.autoplaySpeed || 8000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, settings.autoplay, settings.autoplaySpeed, settings.infinite, totalSlides])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => 
      settings.infinite !== false ? (prev + 1) % totalSlides : Math.min(prev + 1, totalSlides - 1)
    )
  }

  const prevSlide = () => {
    setCurrentSlide(prev => 
      settings.infinite !== false ? (prev - 1 + totalSlides) % totalSlides : Math.max(prev - 1, 0)
    )
  }

  const currentTestimonials = testimonials.slice(
    currentSlide * slidesToShow,
    (currentSlide + 1) * slidesToShow
  )

  return (
    <div 
      className="relative"
      onMouseEnter={() => settings.pauseOnHover && setIsPlaying(false)}
      onMouseLeave={() => settings.pauseOnHover && settings.autoplay && setIsPlaying(true)}
    >
      {/* Testimonials */}
      <div className={cn(
        'grid gap-6',
        slidesToShow === 1 && 'grid-cols-1',
        slidesToShow === 2 && 'grid-cols-1 md:grid-cols-2',
        slidesToShow === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {currentTestimonials.map((testimonial, index) => 
          renderTestimonial(testimonial, currentSlide * slidesToShow + index)
        )}
      </div>

      {/* Navigation Arrows */}
      {settings.showArrows !== false && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonials"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonials"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {settings.showDots !== false && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                currentSlide === index ? 'bg-kawai-red' : 'bg-gray-300'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function LandingTestimonialsBlock({
  header = {},
  testimonials = [],
  layout = {},
  carouselSettings = {},
  socialProof = {},
  cta = {}
}: LandingTestimonialsBlockProps) {
  // Layout classes
  const backgroundColorClasses = {
    none: '',
    'light-gray': 'bg-gray-50',
    'dark-gray': 'bg-gray-800 text-white',
    white: 'bg-white',
    'brand-light': 'bg-kawai-red/5',
    gradient: 'bg-gradient-to-br from-gray-50 to-white'
  }

  const columnClasses = {
    one: 'grid-cols-1',
    two: 'grid-cols-1 md:grid-cols-2',
    three: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    four: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const backgroundClass = backgroundColorClasses[layout.backgroundColor || 'light-gray']
  const columnClass = columnClasses[layout.columns || 'three']

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  // Sort testimonials by priority and featured status
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    if (a.display?.featured && !b.display?.featured) return -1
    if (!a.display?.featured && b.display?.featured) return 1
    return (b.display?.priority || 0) - (a.display?.priority || 0)
  })

  const renderTestimonial = (testimonial: any, index: number) => {
    const quote = testimonial.display?.showFullQuote ? testimonial.quote : (testimonial.shortQuote || testimonial.quote)
    const truncatedQuote = quote && quote.length > 150 ? `${quote.slice(0, 150)}...` : quote

    return (
      <div
        key={index}
        className={cn(
          'bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300',
          testimonial.display?.featured && 'ring-2 ring-kawai-gold/20 bg-kawai-gold/5'
        )}
      >
        {/* Quote */}
        <div className="mb-4">
          <div className="text-gray-600 leading-relaxed">
            <span className="text-kawai-red text-2xl leading-none">"</span>
            {truncatedQuote}
            <span className="text-kawai-red text-2xl leading-none">"</span>
          </div>
        </div>

        {/* Rating */}
        {layout.showRatings !== false && testimonial.rating && (
          <div className="mb-4">
            <StarRating rating={testimonial.rating} />
          </div>
        )}

        {/* Customer Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {layout.showAvatars !== false && (
            <CustomerAvatar customer={testimonial.customer} />
          )}

          <div className="flex-1 min-w-0">
            {/* Name */}
            {testimonial.customer?.name && (
              <div className="font-semibold text-gray-900">
                {testimonial.customer.name}
              </div>
            )}

            {/* Title & Company */}
            {layout.showCompany !== false && (testimonial.customer?.title || testimonial.customer?.company) && (
              <div className="text-sm text-gray-600">
                {[testimonial.customer?.title, testimonial.customer?.company].filter(Boolean).join(', ')}
              </div>
            )}

            {/* Location */}
            {layout.showLocation && testimonial.customer?.location && (
              <div className="text-sm text-gray-500">
                {testimonial.customer.location}
              </div>
            )}

            {/* Product */}
            {layout.showProduct !== false && testimonial.product?.name && (
              <div className="text-sm text-kawai-red font-medium">
                {testimonial.product.name}
              </div>
            )}
          </div>

          {/* Verification Badge */}
          {testimonial.verification?.verified && (
            <div className="flex-shrink-0">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Verified
              </div>
            </div>
          )}
        </div>

        {/* Source & Date */}
        {(layout.showSource || layout.showDates) && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            {layout.showSource && testimonial.verification?.source && (
              <div className="capitalize">
                {testimonial.verification.source === 'google' ? 'Google Reviews' : testimonial.verification.source}
              </div>
            )}
            
            {layout.showDates && testimonial.verification?.reviewDate && (
              <div>
                {new Date(testimonial.verification.reviewDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className={cn('py-12 lg:py-20', backgroundClass)}>
      <div className="container mx-auto px-6">
        {/* Header */}
        {(header.preTitle || header.title || header.subtitle || header.description) && (
          <div className="text-center mb-12 lg:mb-16">
            {header.preTitle && (
              <div className="text-kawai-red font-semibold text-sm uppercase tracking-wider mb-2">
                {header.preTitle}
              </div>
            )}
            
            {header.title && (
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
                {header.title}
              </h2>
            )}
            
            {header.subtitle && (
              <h3 className="text-xl lg:text-2xl font-medium text-gray-600 mb-6">
                {header.subtitle}
              </h3>
            )}
            
            {header.description && (
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {header.description}
              </p>
            )}
          </div>
        )}

        {/* Overall Rating */}
        {socialProof.showOverallRating && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-white rounded-lg shadow-sm border p-6">
              <div>
                <StarRating rating={socialProof.overallRating || 4.8} size="lg" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">
                  {socialProof.overallRating || 4.8}
                </div>
                <div className="text-sm text-gray-600">
                  {socialProof.ratingText || 'Excellent'}
                </div>
                {socialProof.totalReviews && (
                  <div className="text-xs text-gray-500">
                    Based on {socialProof.totalReviews} reviews
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials */}
        {layout.style === 'carousel' ? (
          <TestimonialCarousel
            testimonials={sortedTestimonials}
            settings={carouselSettings}
            layout={layout}
            renderTestimonial={renderTestimonial}
          />
        ) : layout.style === 'featured-grid' ? (
          <div className="space-y-12">
            {/* Featured Testimonial */}
            {sortedTestimonials.find(t => t.display?.featured) && (
              <div className="max-w-4xl mx-auto">
                {renderTestimonial(sortedTestimonials.find(t => t.display?.featured)!, 0)}
              </div>
            )}
            
            {/* Regular Grid */}
            <div className={cn('grid gap-6', columnClass)}>
              {sortedTestimonials.filter(t => !t.display?.featured).map(renderTestimonial)}
            </div>
          </div>
        ) : (
          <div className={cn('grid gap-6', columnClass)}>
            {sortedTestimonials.map(renderTestimonial)}
          </div>
        )}

        {/* Trust Badges */}
        {socialProof.showTrustBadges && socialProof.trustBadges && socialProof.trustBadges.length > 0 && (
          <div className="flex justify-center items-center gap-8 mt-12 pt-12 border-t border-gray-200">
            {socialProof.trustBadges.map((badge, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
                {badge.url ? (
                  <Link href={badge.url} target="_blank" rel="noopener noreferrer">
                    {badge.image ? (
                      <MediaRenderer 
                        media={badge.image}
                        preset="thumbnail"
                        className="h-12 w-auto"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-600">{badge.name}</div>
                    )}
                  </Link>
                ) : badge.image ? (
                  <MediaRenderer 
                    media={badge.image}
                    preset="thumbnail"
                    className="h-12 w-auto"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-600">{badge.name}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {cta.showCta && cta.ctaButtonText && cta.ctaButtonLink && (
          <div className="text-center mt-12">
            {cta.ctaTitle && (
              <h3 className="text-2xl font-bold mb-4">
                {cta.ctaTitle}
              </h3>
            )}
            
            {cta.ctaDescription && (
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                {cta.ctaDescription}
              </p>
            )}
            
            <Button
              asChild
              variant={cta.ctaStyle === 'outline' ? 'outline' : 'default'}
              size="lg"
              className={cn(
                'px-8 py-4 font-medium',
                cta.ctaStyle === 'primary' && 'bg-kawai-red hover:bg-kawai-red/90',
                cta.ctaStyle === 'secondary' && 'bg-gray-800 hover:bg-gray-700'
              )}
            >
              <Link href={cta.ctaButtonLink}>
                {cta.ctaButtonText}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}