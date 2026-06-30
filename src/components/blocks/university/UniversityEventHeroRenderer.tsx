'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface UniversityEventHeroRendererProps {
  block: any // UniversityEventHeroBlock — typed as any until payload types are generated
  headingLevel?: 'h1' | 'h2'
}

type ButtonStyle = 'primary' | 'outline' | 'frosted'

interface CtaConfig {
  text?: string
  link?: string
  scrollToId?: string
  openInNewTab?: boolean
  style?: ButtonStyle
}

function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

const heightMap: Record<string, string> = {
  compact: 'min-h-[60vh]',
  medium: 'min-h-[75vh]',
  large: 'min-h-[85vh]',
  viewport: 'min-h-screen',
}

const logoSizeMap: Record<string, string> = {
  small: 'h-16 md:h-20',
  medium: 'h-24 md:h-32',
  large: 'h-32 md:h-40',
  xlarge: 'h-40 md:h-52',
}

const overlayColorMap: Record<string, string> = {
  dark: 'bg-kawai-black',
  light: 'bg-white',
  red: 'bg-kawai-red',
  none: '',
}

const textColorMap: Record<string, string> = {
  white: 'text-white',
  black: 'text-kawai-black',
  charcoal: 'text-kawai-charcoal',
}

const separatorMap: Record<string, string> = {
  x: 'X',
  times: '×',
  plus: '+',
  ampersand: '&',
}

const buttonStyleMap: Record<ButtonStyle, string> = {
  primary:
    'bg-kawai-red hover:bg-kawai-red-700 text-white border-2 border-kawai-red hover:border-kawai-red-700',
  outline:
    'bg-transparent border-2 border-current hover:bg-white/10',
  frosted:
    'bg-white/80 backdrop-blur-sm text-kawai-black hover:bg-white/90 border border-white/40',
}

function CtaButton({ cta }: { cta: CtaConfig }) {
  const { text, link, scrollToId, openInNewTab, style = 'primary' } = cta

  if (!text) return null

  const className = cn(
    'inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-lg font-medium',
    'text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl',
    'cursor-pointer relative drop-shadow-lg',
    buttonStyleMap[style],
  )

  if (scrollToId) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          const el = document.getElementById(scrollToId)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        {text}
      </button>
    )
  }

  if (!link) return null

  if (link.startsWith('http') || openInNewTab) {
    return (
      <a
        href={link}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {text}
      </a>
    )
  }

  return (
    <Link href={link} className={className}>
      {text}
    </Link>
  )
}

export const UniversityEventHeroRenderer: React.FC<UniversityEventHeroRendererProps> = ({
  block,
  headingLevel = 'h1',
}) => {
  const SectionHeading = headingLevel
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const leftLogo = isMediaObject(block.leftLogo) ? block.leftLogo : null
  const rightLogo = isMediaObject(block.rightLogo) ? block.rightLogo : null
  const backgroundImage = isMediaObject(block.backgroundImage) ? block.backgroundImage : null
  const hasDualLogos = leftLogo && rightLogo

  const heightClass = heightMap[block.height ?? 'viewport'] ?? 'min-h-screen'
  const textColorClass = textColorMap[block.textColor ?? 'white'] ?? 'text-white'

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden flex items-center justify-center',
        heightClass,
      )}
    >
      {/* Background — video takes priority over image */}
      {block.backgroundVideoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          onLoadedData={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = block.videoStartTime ?? 0
              videoRef.current.play().catch(() => {})
            }
          }}
        >
          <source src={block.backgroundVideoUrl} type="video/mp4" />
        </video>
      ) : backgroundImage?.url ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage.url}
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
          className={cn('absolute inset-0', overlayColorMap[block.overlayColor ?? 'dark'])}
          style={{ opacity: block.overlayOpacity ?? 0.55 }}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center py-12 sm:py-16 lg:pt-24 lg:pb-16',
          textColorClass,
          'transition-all duration-1000 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        {/* Eyebrow */}
        {block.eyebrow && (
          <p
            className="text-xs sm:text-sm font-medium tracking-wider uppercase mb-6 opacity-90 drop-shadow-sm"
            style={{ animationDelay: '0s' }}
          >
            {block.eyebrow}
          </p>
        )}

        {/* Logos */}
        {leftLogo?.url && (
          <div className="mb-8 sm:mb-10">
            {hasDualLogos ? (
              /* Dual-logo layout */
              <>
                {/* Mobile: vertical stack */}
                <div className="flex flex-col items-center gap-4 sm:hidden">
                  <Image
                    src={leftLogo.url}
                    alt={leftLogo.alt ?? 'Partner logo'}
                    width={200}
                    height={80}
                    className={cn('object-contain w-auto drop-shadow-2xl', logoSizeMap[block.logoSize ?? 'medium'])}
                  />
                  <span className="text-2xl font-black drop-shadow-2xl">
                    {separatorMap[block.separatorStyle ?? 'x']}
                  </span>
                  <Image
                    src={rightLogo!.url!}
                    alt={rightLogo!.alt ?? 'Partner logo'}
                    width={200}
                    height={80}
                    className={cn('object-contain w-auto drop-shadow-2xl', logoSizeMap[block.logoSize ?? 'medium'])}
                  />
                </div>
                {/* Desktop: horizontal layout */}
                <div className="hidden sm:flex items-center justify-center gap-8 md:gap-12">
                  <Image
                    src={leftLogo.url}
                    alt={leftLogo.alt ?? 'Partner logo'}
                    width={200}
                    height={80}
                    className={cn('object-contain w-auto drop-shadow-2xl', logoSizeMap[block.logoSize ?? 'medium'])}
                  />
                  <span className="text-5xl md:text-6xl lg:text-7xl font-black drop-shadow-2xl opacity-90">
                    {separatorMap[block.separatorStyle ?? 'x']}
                  </span>
                  <Image
                    src={rightLogo!.url!}
                    alt={rightLogo!.alt ?? 'Partner logo'}
                    width={200}
                    height={80}
                    className={cn('object-contain w-auto drop-shadow-2xl', logoSizeMap[block.logoSize ?? 'medium'])}
                  />
                </div>
              </>
            ) : (
              /* Single-logo centered */
              <div className="flex justify-center">
                <Image
                  src={leftLogo.url}
                  alt={leftLogo.alt ?? 'Logo'}
                  width={200}
                  height={80}
                  className={cn('object-contain w-auto drop-shadow-2xl', logoSizeMap[block.logoSize ?? 'medium'])}
                />
              </div>
            )}
          </div>
        )}

        {/* Headline */}
        {block.headline && (
          <SectionHeading className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
            {block.headline}
          </SectionHeading>
        )}

        {/* Subheadline */}
        {block.subheadline && (
          <div className="max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
            <p className="text-lg sm:text-xl md:text-2xl font-light tracking-wider drop-shadow-lg">
              {block.subheadline}
            </p>
          </div>
        )}

        {/* CTAs */}
        {(block.primaryCta?.text || block.secondaryCta?.text) && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6">
            {block.primaryCta?.text && <CtaButton cta={block.primaryCta} />}
            {block.secondaryCta?.text && <CtaButton cta={block.secondaryCta} />}
          </div>
        )}

        {/* Supporting message */}
        {block.supportingMessage && (
          <p className="text-sm sm:text-base italic opacity-80 drop-shadow-sm">
            {block.supportingMessage}
          </p>
        )}
      </div>
    </section>
  )
}
