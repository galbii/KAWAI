'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube'

interface UniversityHeroRendererProps {
  block: any // Will use MarketingUniversityHeroBlock after types are generated
}

// Type guard for Media object
function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

export const UniversityHeroRenderer: React.FC<UniversityHeroRendererProps> = ({ block }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Height mapping
  const heightMap: Record<string, string> = {
    compact: 'min-h-[60vh]',
    medium: 'min-h-[70vh]',
    large: 'min-h-[80vh]',
    viewport: 'min-h-screen',
  }

  // Content alignment
  const alignmentMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }

  // Vertical alignment
  const verticalAlignMap: Record<string, string> = {
    top: 'justify-start pt-24 md:pt-32',
    center: 'justify-center',
    bottom: 'justify-end pb-24 md:pb-32',
  }

  // Text color
  const textColorMap: Record<string, string> = {
    white: 'text-white',
    black: 'text-gray-900',
    charcoal: 'text-[#2C2C2C]',
  }

  // Overlay color
  const overlayColorMap: Record<string, string> = {
    dark: 'bg-black',
    light: 'bg-white',
    red: 'bg-[#C41E3A]',
    none: '',
  }

  // Logo size mapping
  const logoSizeMap: Record<string, string> = {
    small: 'h-20',
    medium: 'h-28 md:h-32',
    large: 'h-36 md:h-40',
    xlarge: 'h-44 md:h-52',
  }

  // Logo spacing
  const logoSpacingMap: Record<string, string> = {
    tight: 'gap-8',
    medium: 'gap-12 md:gap-16',
    loose: 'gap-16 md:gap-24',
  }

  // Separator characters
  const separatorMap: Record<string, string> = {
    x: 'X',
    times: '×',
    plus: '+',
    ampersand: '&',
  }

  // Animation classes
  const animationMap: Record<string, string> = {
    'fade-up': isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8',
    fade: isVisible ? 'opacity-100' : 'opacity-0',
    scale: isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    none: '',
  }

  // Get background media (YouTube takes priority over image)
  const youtubeEmbedUrl = block.youtubeUrl ? getYouTubeEmbedUrl(block.youtubeUrl) : null
  const backgroundImage = isMediaObject(block.backgroundImage)
    ? block.backgroundImage.url
    : null

  const leftLogo = isMediaObject(block.leftLogo) ? block.leftLogo : null
  const rightLogo = isMediaObject(block.rightLogo) ? block.rightLogo : null

  // Determine if we're in single-logo or dual-logo mode
  const isSingleLogoMode = leftLogo && !rightLogo

  // Button component
  const Button = ({
    text,
    link,
    openInNewTab,
    style,
  }: {
    text?: string
    link?: string
    openInNewTab?: boolean
    style?: 'primary' | 'outline'
  }) => {
    if (!text || !link) return null

    const buttonStyles = {
      primary:
        'bg-[#C41E3A] text-white hover:bg-[#A01828] border-2 border-[#C41E3A] hover:border-[#A01828]',
      outline:
        'bg-transparent text-current border-2 border-current hover:bg-current/10',
    }

    const content = (
      <span
        className={cn(
          'inline-flex items-center justify-center px-8 py-3 rounded-md font-medium transition-all duration-300',
          'text-base md:text-lg',
          buttonStyles[style || 'primary']
        )}
      >
        {text}
      </span>
    )

    if (link.startsWith('http') || openInNewTab) {
      return (
        <a
          href={link}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      )
    }

    return <Link href={link}>{content}</Link>
  }

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        heightMap[block.height || 'medium']
      )}
    >
      {/* Background Media - YouTube Video or Image */}
      {youtubeEmbedUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              transform: `scale(${block.videoZoom || 1})`,
              transformOrigin: 'center center',
              width: '100%',
              height: '100%'
            }}
          >
            <iframe
              src={`${youtubeEmbedUrl}&autoplay=1&mute=1&loop=1&playlist=${youtubeEmbedUrl.split('/embed/')[1]?.split('?')[0]}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              className="absolute pointer-events-none"
              style={{
                border: 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100vw',
                height: '100vh',
                minWidth: '100%',
                minHeight: '100%',
                transform: 'translate(-50%, -50%)',
                objectFit: 'cover'
              }}
              allow="autoplay; encrypted-media"
              title="Background video"
            />
          </div>
        </div>
      ) : backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      ) : null}

      {/* Overlay */}
      {block.overlayColor && block.overlayColor !== 'none' && (
        <div
          className={cn(
            'absolute inset-0',
            overlayColorMap[block.overlayColor || 'dark']
          )}
          style={{
            opacity: block.overlayOpacity ?? 0.6,
          }}
        />
      )}

      {/* Content Container */}
      <div
        className={cn(
          'relative z-10 flex flex-col px-6 md:px-12 lg:px-16',
          heightMap[block.height || 'medium'],
          alignmentMap[block.contentAlignment || 'center'],
          verticalAlignMap[block.verticalAlignment || 'center'],
          textColorMap[block.textColor || 'white']
        )}
      >
        {/* Content Wrapper with Optional Glassmorphism */}
        <div
          className={cn(
            'w-full max-w-5xl space-y-8 md:space-y-12',
            'transition-all duration-1000 ease-out',
            animationMap[block.animationStyle || 'fade-up'],
            block.enableGlassmorphism && [
              'backdrop-blur-xl bg-white/10 p-8 md:p-12 rounded-2xl',
              'shadow-2xl border border-white/20',
            ]
          )}
        >
          {/* Optional Heading Above Logos */}
          {block.heading && (
            <div className="space-y-2">
              <p
                className={cn(
                  'text-sm md:text-base uppercase tracking-wider font-medium',
                  'opacity-90'
                )}
              >
                {block.heading}
              </p>
              <div className="w-16 h-0.5 bg-current opacity-50" />
            </div>
          )}

          {/* Logos Section */}
          {isSingleLogoMode ? (
            // Single Logo Mode - Centered logo with text below
            <div className="space-y-6 flex flex-col items-center">
              {/* Centered Logo */}
              {leftLogo?.url && (
                <div className="relative">
                  <Image
                    src={leftLogo.url}
                    alt={leftLogo.alt || 'Logo'}
                    width={200}
                    height={200}
                    className={cn(
                      'object-contain w-auto',
                      logoSizeMap[block.logoSize || 'medium']
                    )}
                  />
                </div>
              )}

              {/* Single Logo Text */}
              {block.singleLogoText && (
                <p
                  className={cn(
                    'text-lg md:text-xl lg:text-2xl leading-relaxed',
                    'max-w-2xl text-center',
                    'opacity-95'
                  )}
                >
                  {block.singleLogoText}
                </p>
              )}
            </div>
          ) : (
            // Dual Logo Mode - Two logos with separator
            <div
              className={cn(
                'flex items-center justify-center flex-wrap',
                logoSpacingMap[block.logoSpacing || 'medium']
              )}
            >
              {/* Left Logo */}
              {leftLogo?.url && (
                <div className="relative">
                  <Image
                    src={leftLogo.url}
                    alt={leftLogo.alt || 'Logo'}
                    width={200}
                    height={200}
                    className={cn(
                      'object-contain w-auto',
                      logoSizeMap[block.logoSize || 'medium']
                    )}
                  />
                </div>
              )}

              {/* Separator */}
              {block.showSeparator && leftLogo && rightLogo && (
                <div
                  className={cn(
                    'font-serif text-4xl md:text-5xl font-light',
                    'opacity-70'
                  )}
                >
                  {separatorMap[block.separatorStyle || 'x']}
                </div>
              )}

              {/* Right Logo */}
              {rightLogo?.url && (
                <div className="relative">
                  <Image
                    src={rightLogo.url}
                    alt={rightLogo.alt || 'Logo'}
                    width={200}
                    height={200}
                    className={cn(
                      'object-contain w-auto',
                      logoSizeMap[block.logoSize || 'medium']
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {/* Subheading (only shown in dual-logo mode) */}
          {!isSingleLogoMode && block.subheading && (
            <p
              className={cn(
                'text-lg md:text-xl lg:text-2xl leading-relaxed',
                'max-w-3xl mx-auto',
                block.contentAlignment === 'center' ? 'text-center' : '',
                block.contentAlignment === 'left' ? 'text-left mr-auto ml-0' : '',
                block.contentAlignment === 'right' ? 'text-right ml-auto mr-0' : ''
              )}
            >
              {block.subheading}
            </p>
          )}

          {/* CTA Buttons */}
          {(block.primaryCta?.text || block.secondaryCta?.text) && (
            <div
              className={cn(
                'flex flex-wrap gap-4 md:gap-6',
                block.contentAlignment === 'center' && 'justify-center',
                block.contentAlignment === 'left' && 'justify-start',
                block.contentAlignment === 'right' && 'justify-end'
              )}
            >
              <Button
                text={block.primaryCta?.text}
                link={block.primaryCta?.link}
                openInNewTab={block.primaryCta?.openInNewTab}
                style={block.primaryCta?.style || 'primary'}
              />
              <Button
                text={block.secondaryCta?.text}
                link={block.secondaryCta?.link}
                openInNewTab={block.secondaryCta?.openInNewTab}
                style={block.secondaryCta?.style || 'outline'}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
