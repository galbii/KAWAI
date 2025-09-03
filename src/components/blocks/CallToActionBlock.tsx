'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface CallToActionBlockProps {
  content?: {
    title?: string | null
    description?: string | null
    primaryCta?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'outline' | null
      openInNewTab?: boolean | null
    }
    secondaryCta?: {
      text?: string | null
      link?: string | null
      style?: 'primary' | 'secondary' | 'outline' | null
      openInNewTab?: boolean | null
    }
  }
  layout?: {
    alignment?: 'left' | 'center' | 'right' | null
    backgroundType?: 'color' | 'gradient' | 'image' | null
    backgroundColor?: 'white' | 'light' | 'dark' | 'brand' | null
    backgroundImage?: any
    padding?: 'small' | 'medium' | 'large' | null
  }
}

export function CallToActionBlock({
  content = {},
  layout = {}
}: CallToActionBlockProps) {
  const alignment = layout.alignment || 'center'
  const backgroundType = layout.backgroundType || 'color'
  const backgroundColor = layout.backgroundColor || 'brand'
  const padding = layout.padding || 'medium'
  
  // Layout classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  
  const backgroundClasses = {
    white: 'bg-white text-kawai-black',
    light: 'bg-kawai-pearl text-kawai-black',
    dark: 'bg-kawai-black text-white',
    brand: 'bg-kawai-red text-white'
  }
  
  const gradientClasses = {
    white: 'bg-gradient-to-br from-white to-kawai-pearl text-kawai-black',
    light: 'bg-gradient-to-br from-kawai-pearl to-white text-kawai-black',
    dark: 'bg-gradient-to-br from-kawai-black to-kawai-neutral text-white',
    brand: 'bg-gradient-to-br from-kawai-red to-red-600 text-white'
  }
  
  const paddingClasses = {
    small: 'py-12',
    medium: 'py-16 lg:py-24',
    large: 'py-24 lg:py-32'
  }
  
  const alignmentClass = alignmentClasses[alignment]
  const backgroundClass = backgroundType === 'gradient' 
    ? gradientClasses[backgroundColor] 
    : backgroundClasses[backgroundColor]
  const paddingClass = paddingClasses[padding]
  
  return (
    <section className={`${paddingClass} ${backgroundClass} relative overflow-hidden`}>
      {/* Background Image */}
      {backgroundType === 'image' && layout.backgroundImage && (
        <div className="absolute inset-0 z-0">
          {/* Background image would go here */}
          <div className="absolute inset-0 bg-kawai-black/50"></div>
        </div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className={alignmentClass}>
          {/* Title */}
          {content.title && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {content.title}
            </h2>
          )}
          
          {/* Description */}
          {content.description && (
            <p className="text-xl leading-relaxed mb-8 opacity-90">
              {content.description}
            </p>
          )}
          
          {/* CTA Buttons */}
          {(content.primaryCta?.text || content.secondaryCta?.text) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content.primaryCta?.text && content.primaryCta.link && (
                <Button
                  asChild
                  size="lg"
                  variant={content.primaryCta.style === 'outline' ? 'outline' : 'default'}
                  className={`
                    px-8 py-4 font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg
                    ${content.primaryCta.style === 'primary' || (!content.primaryCta.style && backgroundColor === 'brand') 
                      ? 'bg-white hover:bg-gray-100 text-kawai-black' 
                      : ''
                    }
                    ${content.primaryCta.style === 'primary' && backgroundColor !== 'brand'
                      ? 'bg-kawai-red hover:bg-kawai-red/80 text-white' 
                      : ''
                    }
                    ${content.primaryCta.style === 'secondary' ? 'bg-kawai-black hover:bg-kawai-black/80 text-white' : ''}
                    ${content.primaryCta.style === 'outline' ? 'border-2 border-current hover:bg-current hover:text-white' : ''}
                  `}
                >
                  <Link 
                    href={content.primaryCta.link}
                    target={content.primaryCta.openInNewTab ? '_blank' : undefined}
                    rel={content.primaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center"
                  >
                    <span>{content.primaryCta.text}</span>
                    <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </Button>
              )}

              {content.secondaryCta?.text && content.secondaryCta.link && (
                <Button
                  asChild
                  size="lg"
                  variant={content.secondaryCta.style === 'outline' ? 'outline' : 'secondary'}
                  className={`
                    px-8 py-4 font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-lg
                    ${content.secondaryCta.style === 'primary' ? 'bg-kawai-red hover:bg-kawai-red/80 text-white' : ''}
                    ${content.secondaryCta.style === 'secondary' || !content.secondaryCta.style ? 'bg-kawai-black hover:bg-kawai-black/80 text-white' : ''}
                    ${content.secondaryCta.style === 'outline' ? 'border-2 border-current hover:bg-current' : ''}
                  `}
                >
                  <Link 
                    href={content.secondaryCta.link}
                    target={content.secondaryCta.openInNewTab ? '_blank' : undefined}
                    rel={content.secondaryCta.openInNewTab ? 'noopener noreferrer' : undefined}
                  >
                    {content.secondaryCta.text}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}