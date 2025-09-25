'use client'

import { MediaRenderer } from '@/components/ui/media/MediaRenderer'
import { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

interface LandingFeaturesBlockProps {
  header?: {
    preTitle?: string | null
    title?: string | null
    subtitle?: string | null
    description?: string | null
  }
  features?: Array<{
    icon?: {
      type?: 'icon' | 'image' | 'emoji' | 'number' | null
      iconName?: string | null
      image?: string | Media | null
      emoji?: string | null
      number?: string | null
      color?: 'brand' | 'accent' | 'success' | 'warning' | 'info' | 'dark' | null
    }
    title?: string | null
    description?: string | null
    highlight?: string | null
    link?: {
      enable?: boolean | null
      url?: string | null
      text?: string | null
      openInNewTab?: boolean | null
    }
    featured?: boolean | null
  }> | null
  layout?: {
    style?: 'cards' | 'grid' | 'list' | 'timeline' | 'steps' | null
    columns?: 'one' | 'two' | 'three' | 'four' | null
    iconPosition?: 'top' | 'left' | 'right' | null
    iconSize?: 'small' | 'medium' | 'large' | 'xl' | null
    spacing?: 'compact' | 'medium' | 'spacious' | null
    backgroundColor?: 'none' | 'light-gray' | 'dark-gray' | 'white' | 'brand-light' | 'gradient' | null
  }
  animation?: {
    enableAnimations?: boolean | null
    animationType?: 'fade-up' | 'fade-in' | 'slide-in' | 'scale-in' | 'bounce-in' | null
    staggerDelay?: number | null
  }
  cta?: {
    showCta?: boolean | null
    ctaText?: string | null
    ctaLink?: string | null
    ctaStyle?: 'primary' | 'secondary' | 'outline' | null
    ctaOpenInNewTab?: boolean | null
  }
}

// Icon component for different icon types
function FeatureIcon({ 
  icon, 
  size = 'medium',
  className = '' 
}: { 
  icon: any
  size?: 'small' | 'medium' | 'large' | 'xl'
  className?: string 
}) {
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-12 h-12 text-xl',
    large: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  }

  const colorClasses = {
    brand: 'bg-kawai-red text-white',
    accent: 'bg-kawai-gold text-kawai-black',
    success: 'bg-green-500 text-white',
    warning: 'bg-orange-500 text-white',
    info: 'bg-blue-500 text-white',
    dark: 'bg-gray-800 text-white'
  }

  const iconSize = sizeClasses[size]
  const iconColor = colorClasses[icon?.color as keyof typeof colorClasses || 'brand']

  if (icon?.type === 'image' && icon.image) {
    return (
      <div className={cn('rounded-full overflow-hidden flex-shrink-0', iconSize, className)}>
        <MediaRenderer 
          media={icon.image}
          preset="thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  if (icon?.type === 'emoji' && icon.emoji) {
    return (
      <div className={cn('flex items-center justify-center rounded-full flex-shrink-0', iconSize, iconColor, className)}>
        <span className="text-2xl" role="img" aria-label="feature icon">
          {icon.emoji}
        </span>
      </div>
    )
  }

  if (icon?.type === 'number' && icon.number) {
    return (
      <div className={cn('flex items-center justify-center rounded-full font-bold flex-shrink-0', iconSize, iconColor, className)}>
        {icon.number}
      </div>
    )
  }

  // Default to icon name
  return (
    <div className={cn('flex items-center justify-center rounded-full flex-shrink-0', iconSize, iconColor, className)}>
      <span className="font-bold">
        {getIconSymbol(icon?.iconName || 'check')}
      </span>
    </div>
  )
}

// Simple icon mapping
function getIconSymbol(iconName: string): string {
  const iconMap: Record<string, string> = {
    'check': '✓',
    'check-circle': '✓',
    'star': '★',
    'shield': '🛡️',
    'truck': '🚚',
    'heart': '♥',
    'lightning': '⚡',
    'crown': '♔',
    'diamond': '♦',
    'music': '♪',
    'piano': '🎹',
    'award': '🏆',
    'gift': '🎁',
    'thumbs-up': '👍',
    'clock': '⏰',
    'dollar': '$',
    'phone': '📞',
    'mail': '✉️',
    'location': '📍',
    'globe': '🌍'
  }
  return iconMap[iconName.toLowerCase()] || '✓'
}

export function LandingFeaturesBlock({
  header = {},
  features = [],
  layout = {},
  animation = {},
  cta = {}
}: LandingFeaturesBlockProps) {
  const featuresRef = useRef<HTMLDivElement>(null)

  // Animation setup
  useEffect(() => {
    if (!animation.enableAnimations || !featuresRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry?.isIntersecting) {
            const delay = (animation.staggerDelay || 100) * index
            setTimeout(() => {
              entry.target.classList.add('animate-in')
            }, delay)
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    const featureElements = featuresRef.current.querySelectorAll('.feature-item')
    featureElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [animation.enableAnimations, animation.staggerDelay])

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

  const spacingClasses = {
    compact: 'gap-4',
    medium: 'gap-6',
    spacious: 'gap-8'
  }

  const animationClasses = {
    'fade-up': 'opacity-0 translate-y-6 transition-all duration-700 ease-out',
    'fade-in': 'opacity-0 transition-opacity duration-700 ease-out',
    'slide-in': 'opacity-0 -translate-x-6 transition-all duration-700 ease-out',
    'scale-in': 'opacity-0 scale-95 transition-all duration-700 ease-out',
    'bounce-in': 'opacity-0 scale-95 transition-all duration-700 ease-bounce'
  }

  const backgroundClass = backgroundColorClasses[layout.backgroundColor || 'none']
  const columnClass = columnClasses[layout.columns || 'three']
  const spacingClass = spacingClasses[layout.spacing || 'medium']
  const animationClass = animation.enableAnimations ? animationClasses[animation.animationType || 'fade-up'] : ''

  if (!features || features.length === 0) {
    return null
  }

  const renderFeature = (feature: any, index: number) => {
    const isTimeline = layout.style === 'timeline'
    const isSteps = layout.style === 'steps'
    const isList = layout.style === 'list'
    const iconPosition = layout.iconPosition || 'top'
    const iconSize = layout.iconSize || 'medium'

    const featureContent = (
      <>
        {/* Icon */}
        {feature.icon && (
          <div className={cn(
            iconPosition === 'top' ? 'mb-4' : 'mr-4',
            iconPosition === 'right' ? 'order-2 ml-4 mr-0' : ''
          )}>
            <FeatureIcon 
              icon={feature.icon}
              size={iconSize}
              className={feature.featured ? 'ring-4 ring-kawai-gold/30' : ''}
            />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          iconPosition === 'top' ? 'text-center' : 'flex-1',
          iconPosition === 'right' ? 'order-1' : ''
        )}>
          {/* Highlight Badge */}
          {feature.highlight && (
            <div className="inline-block bg-kawai-gold text-kawai-black px-2 py-1 rounded text-xs font-medium mb-2">
              {feature.highlight}
            </div>
          )}

          {/* Title */}
          {feature.title && (
            <h3 className={cn(
              'font-semibold mb-2',
              feature.featured ? 'text-xl text-kawai-red' : 'text-lg'
            )}>
              {feature.title}
            </h3>
          )}

          {/* Description */}
          {feature.description && (
            <p className="text-gray-600 leading-relaxed mb-3">
              {feature.description}
            </p>
          )}

          {/* Link */}
          {feature.link?.enable && feature.link.url && feature.link.text && (
            <Link
              href={feature.link.url}
              target={feature.link.openInNewTab ? '_blank' : undefined}
              rel={feature.link.openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center text-kawai-red hover:text-kawai-red/80 font-medium text-sm transition-colors"
            >
              {feature.link.text}
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* Timeline connector */}
        {isTimeline && index < features.length - 1 && (
          <div className="absolute left-6 top-16 w-0.5 h-20 bg-gray-200"></div>
        )}

        {/* Steps connector */}
        {isSteps && index < features.length - 1 && (
          <div className="hidden md:block absolute top-6 left-full w-8 h-0.5 bg-gray-200 transform translate-x-2"></div>
        )}
      </>
    )

    const containerClasses = cn(
      'feature-item relative',
      animationClass,
      {
        // Card style
        'bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow': layout.style === 'cards',
        // Grid style
        'p-6': layout.style === 'grid',
        // List style
        'flex items-start py-6 border-b border-gray-200 last:border-b-0': isList,
        // Timeline style
        'relative pl-16': isTimeline,
        // Steps style
        'relative': isSteps,
        // Icon positioning
        'flex': iconPosition !== 'top' && !isList && !isTimeline,
        // Featured styling
        'ring-2 ring-kawai-gold/20 bg-kawai-gold/5': feature.featured && layout.style === 'cards'
      }
    )

    return (
      <div key={index} className={containerClasses}>
        {featureContent}
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

        {/* Features */}
        <div ref={featuresRef}>
          {layout.style === 'timeline' ? (
            <div className="max-w-3xl mx-auto">
              {features.map(renderFeature)}
            </div>
          ) : layout.style === 'steps' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative">
              {features.map(renderFeature)}
            </div>
          ) : layout.style === 'list' ? (
            <div className="max-w-4xl mx-auto divide-y divide-gray-200">
              {features.map(renderFeature)}
            </div>
          ) : (
            <div className={cn('grid', columnClass, spacingClass)}>
              {features.map(renderFeature)}
            </div>
          )}
        </div>

        {/* CTA */}
        {cta.showCta && cta.ctaText && cta.ctaLink && (
          <div className="text-center mt-12">
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
              <Link 
                href={cta.ctaLink}
                target={cta.ctaOpenInNewTab ? '_blank' : undefined}
                rel={cta.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
              >
                {cta.ctaText}
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        .feature-item.animate-in {
          opacity: 1 !important;
          transform: translate3d(0, 0, 0) scale(1) !important;
        }
      `}</style>
    </section>
  )
}