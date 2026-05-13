'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Shield,
  Star,
  Truck,
  Piano,
  Clock,
  Check,
  Heart,
  Award,
  GraduationCap,
  Phone,
} from 'lucide-react'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Proposition {
  icon: string
  title: string
  description?: string | null
  ctaText?: string | null
  ctaLink?: string | null
}

interface UniversityValuePropsRendererProps {
  block: {
    heading: string
    subheading?: string | null
    backgroundImage?: Media | string | null
    overlayColor?: 'dark' | 'red' | 'navy' | 'none' | null
    overlayOpacity?: number | null
    propositions?: Proposition[] | null
    sectionCtaBadgeText?: string | null
    sectionCtaText?: string | null
    sectionCtaLink?: string | null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  star: Star,
  truck: Truck,
  piano: Piano,
  clock: Clock,
  check: Check,
  heart: Heart,
  award: Award,
  'graduation-cap': GraduationCap,
  phone: Phone,
}

const OVERLAY_COLOR_MAP: Record<string, string> = {
  dark: 'bg-black',
  red: 'bg-kawai-red',
  navy: 'bg-[#1B2A4A]',
  none: '',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PropositionCard({
  proposition,
  index,
}: {
  proposition: Proposition
  index: number
}) {
  const { ref, isVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  })

  const IconComponent = ICON_MAP[proposition.icon] ?? Star
  const delayMs = 200 + index * 200

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center text-center space-y-4 md:space-y-5 px-4',
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
      style={{ transitionDelay: isVisible ? `${delayMs}ms` : '0ms' }}
    >
      {/* Icon */}
      <div className="flex justify-center transform transition-transform duration-300 hover:scale-110">
        <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
      </div>

      {/* Text */}
      <div className="space-y-2 md:space-y-3">
        <h3 className="text-lg sm:text-xl lg:text-2xl text-white font-semibold leading-snug">
          {proposition.title}
        </h3>
        {proposition.description && (
          <p className="text-white/80 leading-relaxed text-sm sm:text-base max-w-xs mx-auto">
            {proposition.description}
          </p>
        )}
      </div>

      {/* Optional CTA */}
      {proposition.ctaText && proposition.ctaLink && (
        <Link
          href={proposition.ctaLink}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            'text-white/70 hover:text-white underline-offset-4 hover:underline',
            'transition-colors duration-200',
          )}
        >
          {proposition.ctaText}
        </Link>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UniversityValuePropsRenderer({ block }: UniversityValuePropsRendererProps) {
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -60px 0px',
  })

  const { ref: ctaRef, isVisible: ctaVisible } = useIntersectionAnimation<HTMLDivElement>({
    threshold: 0.2,
  })

  const backgroundImage = isMediaObject(block.backgroundImage)
    ? block.backgroundImage.url
    : null

  const overlayColor = block.overlayColor ?? 'dark'
  const overlayOpacity = block.overlayOpacity ?? 0.75
  const propositions = block.propositions ?? []

  return (
    <section className="relative overflow-hidden py-16 lg:py-20">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
        </div>
      )}

      {/* Overlay */}
      {overlayColor !== 'none' && (
        <div
          className={cn('absolute inset-0', OVERLAY_COLOR_MAP[overlayColor])}
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            'text-center mb-12 lg:mb-16',
            'transition-all duration-700 ease-out',
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            {block.heading}
          </h2>
          {block.subheading && (
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {block.subheading}
            </p>
          )}
        </div>

        {/* Value Propositions Grid */}
        {propositions.length > 0 && (
          <div
            className={cn(
              'grid gap-8 md:gap-6 lg:gap-12',
              propositions.length === 1 && 'grid-cols-1 max-w-md mx-auto',
              propositions.length === 2 && 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto',
              propositions.length >= 3 && 'grid-cols-1 md:grid-cols-3',
            )}
          >
            {propositions.map((proposition, index) => (
              <PropositionCard
                key={index}
                proposition={proposition}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Section CTA */}
        {(block.sectionCtaBadgeText || block.sectionCtaText) && (
          <div
            ref={ctaRef}
            className={cn(
              'mt-12 sm:mt-16 text-center',
              'transition-all duration-700 ease-out',
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
            style={{ transitionDelay: ctaVisible ? '800ms' : '0ms' }}
          >
            {/* Badge */}
            {block.sectionCtaBadgeText && (
              <div className="max-w-2xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 bg-kawai-red/20 backdrop-blur-sm rounded-full px-4 py-2 border border-kawai-red/30">
                  <div className="w-2 h-2 bg-kawai-red rounded-full animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">
                    {block.sectionCtaBadgeText}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            {block.sectionCtaText && block.sectionCtaLink && (
              <Link
                href={block.sectionCtaLink}
                className={cn(
                  'inline-flex items-center gap-3',
                  'bg-kawai-red hover:bg-kawai-red-700 text-white',
                  'px-8 py-4 rounded-lg font-semibold text-base',
                  'transition-all duration-300',
                  'shadow-lg hover:shadow-xl hover:-translate-y-0.5',
                  'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2 focus:ring-offset-transparent',
                )}
              >
                {block.sectionCtaText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
