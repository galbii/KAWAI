'use client'

import { useState } from 'react'

interface TestimonialsBlockProps {
  testimonials?: Array<{
    quote?: string | null
    author?: string | null
    title?: string | null
    company?: string | null
    avatar?: any
    rating?: number | null
  }> | null
  layout?: {
    style?: 'carousel' | 'grid' | 'single' | null
    columns?: number | null
    showRatings?: boolean | null
    showAvatars?: boolean | null
    backgroundColor?: 'white' | 'light' | 'dark' | 'brand' | null
    padding?: 'small' | 'medium' | 'large' | null
  }
}

export function TestimonialsBlock({
  testimonials = [],
  layout = {}
}: TestimonialsBlockProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  if (!testimonials || testimonials.length === 0) {
    return null
  }
  
  const style = layout.style || 'grid'
  const columns = layout.columns || 2
  const showRatings = layout.showRatings !== false
  const showAvatars = layout.showAvatars !== false
  const backgroundColor = layout.backgroundColor || 'light'
  const padding = layout.padding || 'medium'
  
  // Layout classes
  const backgroundClasses = {
    white: 'bg-white text-kawai-black',
    light: 'bg-kawai-pearl text-kawai-black',
    dark: 'bg-kawai-black text-white',
    brand: 'bg-kawai-red text-white'
  }
  
  const paddingClasses = {
    small: 'py-12',
    medium: 'py-16 lg:py-24',
    large: 'py-24 lg:py-32'
  }
  
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
  
  const backgroundClass = backgroundClasses[backgroundColor]
  const paddingClass = paddingClasses[padding]
  const gridClass = columnClasses[Math.min(columns, 3) as keyof typeof columnClasses]
  
  // Render star rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
    return stars
  }
  
  // Single testimonial card
  const TestimonialCard = ({ testimonial, index }: { testimonial: any, index: number }) => (
    <div key={index} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Quote */}
      <div className="text-lg italic text-kawai-black leading-relaxed">
        "{testimonial.quote}"
      </div>
      
      {/* Rating */}
      {showRatings && testimonial.rating && (
        <div className="flex space-x-1">
          {renderStars(testimonial.rating)}
        </div>
      )}
      
      {/* Author Info */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        {showAvatars && testimonial.avatar && (
          <div className="w-12 h-12 rounded-full bg-kawai-red/10 flex items-center justify-center">
            {/* Avatar would go here - for now, show initials */}
            <span className="text-kawai-red font-semibold">
              {testimonial.author?.charAt(0) || 'T'}
            </span>
          </div>
        )}
        
        {/* Author Details */}
        <div>
          {testimonial.author && (
            <div className="font-semibold text-kawai-black">
              {testimonial.author}
            </div>
          )}
          {(testimonial.title || testimonial.company) && (
            <div className="text-sm text-kawai-black/70">
              {[testimonial.title, testimonial.company].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
  
  return (
    <section className={`${paddingClass} ${backgroundClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-kawai-red mx-auto rounded"></div>
        </div>
        
        {/* Testimonials */}
        {style === 'single' && (
          <div className="max-w-4xl mx-auto">
            <TestimonialCard testimonial={testimonials[currentTestimonial]} index={currentTestimonial} />
            
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="p-2 rounded-full bg-kawai-red text-white hover:bg-kawai-red/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="p-2 rounded-full bg-kawai-red text-white hover:bg-kawai-red/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
        {(style === 'grid' || style === 'carousel') && (
          <div className={`grid ${gridClass} gap-6`}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}