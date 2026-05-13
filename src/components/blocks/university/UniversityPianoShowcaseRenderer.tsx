'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeyFeature {
  feature: string
}

interface PianoEntry {
  name: string
  modelNumber?: string | null
  category?: string | null
  badgeText?: string | null
  description?: string | null
  image?: Media | string | null
  originalPrice?: number | null
  salePrice?: number | null
  savingsText?: string | null
  keyFeatures?: KeyFeature[] | null
  ctaText?: string | null
  ctaLink?: string | null
}

interface UniversityPianoShowcaseRendererProps {
  block: {
    sectionLabel?: string | null
    heading: string
    subheading?: string | null
    pianos?: PianoEntry[] | null
    sectionCtaHeading?: string | null
    sectionCtaSubtext?: string | null
    sectionCtaButtonText?: string | null
    sectionCtaButtonLink?: string | null
    sectionCtaNote?: string | null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

// ─── Piano Row ────────────────────────────────────────────────────────────────

function PianoRow({ piano, index }: { piano: PianoEntry; index: number }) {
  const { ref, isVisible } = useIntersectionAnimation<HTMLElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  })

  const isEven = index % 2 === 0
  const imageUrl = isMediaObject(piano.image) ? piano.image.url : null
  const imageAlt = isMediaObject(piano.image) ? (piano.image.alt ?? piano.name) : piano.name

  const hasCtaText = piano.ctaText && piano.ctaLink

  return (
    <section ref={ref} className="py-10 lg:py-14">
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div
          className={cn(
            'grid lg:grid-cols-2 gap-8 lg:gap-12 items-center',
            !isEven && 'lg:grid-flow-col-dense',
          )}
        >
          {/* Image column */}
          <div
            className={cn(
              'relative',
              isEven ? 'order-1 lg:order-2' : 'order-1 lg:col-start-1',
            )}
          >
            <div
              className={cn(
                'relative transition-all duration-700 delay-300',
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95',
              )}
            >
              {/* Badge */}
              {piano.badgeText && (
                <div className="absolute top-3 left-3 z-10 bg-kawai-red text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                  {piano.badgeText}
                </div>
              )}

              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt ?? piano.name}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              ) : (
                /* Placeholder when no image */
                <div className="w-full aspect-[4/3] bg-kawai-pearl flex items-center justify-center rounded-lg">
                  <span className="text-kawai-charcoal/40 text-sm">{piano.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content column */}
          <div
            className={cn(
              'space-y-5',
              isEven ? 'order-2 lg:order-1' : 'order-2 lg:col-start-2',
            )}
          >
            {/* Category + Name */}
            <div
              className={cn(
                'space-y-1 transition-all duration-600',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              )}
            >
              {piano.category && (
                <div className="text-sm font-medium text-kawai-charcoal/60 uppercase tracking-wide">
                  {piano.category}
                  {piano.modelNumber && (
                    <span className="ml-2 text-kawai-charcoal/40">· {piano.modelNumber}</span>
                  )}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-kawai-black leading-tight">
                {piano.name}
              </h2>
            </div>

            {/* Pricing */}
            {(piano.originalPrice != null || piano.salePrice != null) && (
              <div
                className={cn(
                  'flex flex-wrap items-center gap-3 transition-all duration-600 delay-100',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                )}
              >
                {piano.salePrice != null && (
                  <span className="text-2xl font-bold text-kawai-red">
                    {formatPrice(piano.salePrice)}
                  </span>
                )}
                {piano.originalPrice != null && piano.salePrice != null && (
                  <span className="text-base text-kawai-charcoal/50 line-through">
                    {formatPrice(piano.originalPrice)}
                  </span>
                )}
                {piano.savingsText && (
                  <span className="inline-flex items-center bg-kawai-red/10 text-kawai-red text-xs font-semibold px-2.5 py-1 rounded-full">
                    {piano.savingsText}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {piano.description && (
              <p
                className={cn(
                  'text-sm md:text-base leading-relaxed text-kawai-black/75 max-w-lg',
                  'transition-all duration-600 delay-200',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                )}
              >
                {piano.description}
              </p>
            )}

            {/* Key Features */}
            {piano.keyFeatures && piano.keyFeatures.length > 0 && (
              <div
                className={cn(
                  'space-y-2 transition-all duration-600 delay-300',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                )}
              >
                <h4 className="text-sm font-semibold text-kawai-black">Key Features</h4>
                <ul className="space-y-1.5">
                  {piano.keyFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-kawai-black/70">
                      <Check className="w-3.5 h-3.5 text-kawai-red flex-shrink-0" />
                      {f.feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Per-piano CTA */}
            {hasCtaText && (
              <div
                className={cn(
                  'pt-2 transition-all duration-600 delay-400',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                )}
              >
                <Link
                  href={piano.ctaLink!}
                  className={cn(
                    'inline-flex items-center gap-2',
                    'bg-kawai-red hover:bg-kawai-red-700 text-white',
                    'px-6 py-3 rounded-lg font-semibold text-sm',
                    'transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5',
                    'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                    'group',
                  )}
                >
                  {piano.ctaText}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function ShowcaseHeader({
  sectionLabel,
  heading,
  subheading,
}: {
  sectionLabel?: string | null
  heading: string
  subheading?: string | null
}) {
  const { ref, isVisible } = useIntersectionAnimation<HTMLElement>({
    threshold: 0.2,
    rootMargin: '0px 0px -60px 0px',
  })

  return (
    <section ref={ref} className="py-12 text-center relative overflow-hidden">
      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-kawai-pearl/50 to-white pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div
          className={cn(
            'transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          {sectionLabel && (
            <div className="text-kawai-red font-bold text-sm uppercase tracking-[0.2em] mb-3">
              {sectionLabel}
            </div>
          )}

          <div className="relative inline-block mb-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-kawai-black">
              {heading}
            </h1>
            {/* Red underline accent */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-kawai-red to-kawai-red-700 rounded-full" />
          </div>

          {subheading && (
            <p
              className={cn(
                'text-lg md:text-xl text-kawai-charcoal/70 font-medium tracking-wide mt-6',
                'transition-all duration-700 delay-200 ease-out',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
              )}
            >
              {subheading}
            </p>
          )}
        </div>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-4 left-4 w-20 h-20 bg-kawai-red/10 rounded-full opacity-30 animate-pulse pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-16 h-16 bg-kawai-neutral/30 rounded-full opacity-20 animate-pulse delay-1000 pointer-events-none" />
    </section>
  )
}

// ─── Section CTA ─────────────────────────────────────────────────────────────

function ShowcaseCTA({
  heading,
  subtext,
  buttonText,
  buttonLink,
  note,
}: {
  heading?: string | null
  subtext?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  note?: string | null
}) {
  const { ref, isVisible } = useIntersectionAnimation<HTMLElement>({
    threshold: 0.2,
  })

  if (!heading && !buttonText) return null

  return (
    <section
      ref={ref}
      className={cn(
        'py-14 text-center bg-white border-t border-kawai-neutral',
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
    >
      <div className="max-w-2xl mx-auto px-6 space-y-4">
        {heading && (
          <h3 className="text-2xl font-semibold text-kawai-black leading-snug">
            {heading}
          </h3>
        )}
        {subtext && (
          <p className="text-kawai-black/60 max-w-lg mx-auto leading-relaxed">
            {subtext}
          </p>
        )}
        {buttonText && buttonLink && (
          <div className="pt-2 space-y-2">
            <Link
              href={buttonLink}
              className={cn(
                'inline-flex items-center gap-3',
                'bg-kawai-red hover:bg-kawai-red-700 text-white',
                'px-8 py-4 rounded-lg font-semibold text-base',
                'transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1',
                'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                'group',
              )}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {note && (
              <p className="text-xs text-kawai-charcoal/50 mt-2">{note}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UniversityPianoShowcaseRenderer({ block }: UniversityPianoShowcaseRendererProps) {
  const pianos = block.pianos ?? []

  return (
    <div className="bg-white">
      {/* Section Header */}
      <ShowcaseHeader
        heading={block.heading}
        {...(block.sectionLabel !== undefined && { sectionLabel: block.sectionLabel })}
        {...(block.subheading !== undefined && { subheading: block.subheading })}
      />

      {/* Piano Rows */}
      {pianos.map((piano, index) => (
        <PianoRow key={index} piano={piano} index={index} />
      ))}

      {/* Bottom CTA */}
      <ShowcaseCTA
        {...(block.sectionCtaHeading !== undefined && { heading: block.sectionCtaHeading })}
        {...(block.sectionCtaSubtext !== undefined && { subtext: block.sectionCtaSubtext })}
        {...(block.sectionCtaButtonText !== undefined && { buttonText: block.sectionCtaButtonText })}
        {...(block.sectionCtaButtonLink !== undefined && { buttonLink: block.sectionCtaButtonLink })}
        {...(block.sectionCtaNote !== undefined && { note: block.sectionCtaNote })}
      />
    </div>
  )
}
