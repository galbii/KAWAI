'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'
import {
  CheckIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface EventOverviewRendererProps {
  block: any
}

// Type guard for Media object
function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

export const EventOverviewRenderer: React.FC<EventOverviewRendererProps> = ({ block }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSecondImage, setShowSecondImage] = useState(false)
  const sectionRef = React.useRef<HTMLDivElement>(null)

  // Get image URLs
  const eventImage1 = isMediaObject(block.eventImage1) ? block.eventImage1 : null
  const eventImage2 = isMediaObject(block.eventImage2) ? block.eventImage2 : null
  const imageUrl1 = eventImage1?.url || null
  const imageUrl2 = eventImage2?.url || null
  const imageAlt1 = eventImage1?.alt || block.title || 'Event image'
  const imageAlt2 = eventImage2?.alt || block.title || 'Event image'

  // Has two images
  const hasTwoImages = imageUrl1 && imageUrl2

  // Initial fade-in effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Scroll-triggered image transition (only if two images exist)
  useEffect(() => {
    if (!hasTwoImages || !sectionRef.current) return

    let timer: NodeJS.Timeout | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !showSecondImage) {
            // Wait 2 seconds after section comes into view, then switch to second image
            timer = setTimeout(() => {
              setShowSecondImage(true)
            }, 2000)
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
      }
    )

    const currentSection = sectionRef.current
    observer.observe(currentSection)

    return () => {
      if (timer) clearTimeout(timer)
      if (currentSection) observer.unobserve(currentSection)
    }
  }, [hasTwoImages, showSecondImage])

  // Get map embed URL
  const getMapEmbedUrl = (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || !address) return null

    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=15`
  }

  const mapUrl = block.showMap && block.mapAddress ? getMapEmbedUrl(block.mapAddress) : null

  // Theme colors
  const isDark = block.theme === 'dark'
  const bgColor = isDark ? 'bg-[#1a1a1a]' : 'bg-white'
  const textColor = isDark ? 'text-white' : 'text-[#2C2C2C]'
  const mutedColor = isDark ? 'text-white/60' : 'text-[#2C2C2C]/60'
  const borderColor = isDark ? 'border-white/10' : 'border-[#2C2C2C]/10'

  return (
    <section
      ref={sectionRef}
      className={cn(
        'w-full py-16 md:py-24',
        bgColor,
        textColor
      )}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Two Column Layout - Content and Image */}
        <div
          className={cn(
            'grid lg:grid-cols-2 gap-12 lg:gap-16',
            'transition-opacity duration-700 mb-16',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            {block.eyebrow && (
              <p className="text-sm uppercase tracking-widest text-[#C41E3A] font-semibold">
                {block.eyebrow}
              </p>
            )}

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              {block.title}
            </h2>

            {/* Subtitle */}
            {block.subtitle && (
              <p className="text-xl md:text-2xl font-light leading-relaxed">
                {block.subtitle}
              </p>
            )}

            {/* Description */}
            <p className={cn('text-lg leading-relaxed', mutedColor)}>
              {block.description}
            </p>

            {/* Event Details */}
            <div className="space-y-4 pt-4">
              {block.date && (
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-[#C41E3A] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{block.date}</p>
                    {block.time && (
                      <p className={cn('text-sm', mutedColor)}>{block.time}</p>
                    )}
                  </div>
                </div>
              )}

              {block.location && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#C41E3A] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{block.location}</p>
                    {block.booth && (
                      <p className={cn('text-sm', mutedColor)}>{block.booth}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Highlights */}
            {block.highlights && block.highlights.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-sm uppercase tracking-widest font-semibold mb-4">
                  Highlights
                </h3>
                {block.highlights.map((highlight: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <p className="text-base leading-relaxed">{highlight.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {block.ctaText && block.ctaLink && (
              <div className="pt-4">
                {block.ctaLink.startsWith('http') || block.ctaOpenInNewTab ? (
                  <a
                    href={block.ctaLink}
                    target={block.ctaOpenInNewTab ? '_blank' : undefined}
                    rel={block.ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'inline-flex items-center justify-center',
                      'px-8 py-4 rounded-md',
                      'bg-[#C41E3A] text-white font-semibold',
                      'hover:bg-[#A01828] transition-colors duration-200',
                      'text-base'
                    )}
                  >
                    {block.ctaText}
                  </a>
                ) : (
                  <Link
                    href={block.ctaLink}
                    className={cn(
                      'inline-flex items-center justify-center',
                      'px-8 py-4 rounded-md',
                      'bg-[#C41E3A] text-white font-semibold',
                      'hover:bg-[#A01828] transition-colors duration-200',
                      'text-base'
                    )}
                  >
                    {block.ctaText}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Image(s) */}
          <div className="relative">
            {imageUrl1 ? (
              <div
                className={cn(
                  'relative w-full rounded-lg overflow-hidden',
                  isDark ? 'bg-white/5' : 'bg-gray-50'
                )}
                style={{ aspectRatio: '8.5 / 11' }}
              >
                {/* First Image */}
                <Image
                  src={imageUrl1}
                  alt={imageAlt1}
                  fill
                  className={cn(
                    'object-contain transition-opacity duration-1000',
                    hasTwoImages && showSecondImage ? 'opacity-0' : 'opacity-100'
                  )}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Second Image (if exists) - crossfades in */}
                {hasTwoImages && imageUrl2 && (
                  <Image
                    src={imageUrl2}
                    alt={imageAlt2}
                    fill
                    className={cn(
                      'object-contain transition-opacity duration-1000',
                      showSecondImage ? 'opacity-100' : 'opacity-0'
                    )}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center justify-center',
                  'rounded-lg border border-dashed',
                  borderColor,
                  'min-h-[500px]',
                  mutedColor
                )}
              >
                <p className="text-sm">No image available</p>
              </div>
            )}
          </div>
        </div>

        {/* Full Width Map Section Below */}
        {mapUrl && (
          <div className="mt-16">
            <div
              className={cn(
                'relative rounded-lg overflow-hidden border',
                borderColor,
                'shadow-lg'
              )}
              style={{ height: '500px' }}
            >
              <iframe
                src={mapUrl}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event location map"
              />
            </div>

            {/* Address Card */}
            {block.mapAddress && (
              <div
                className={cn(
                  'mt-4 p-4 rounded-lg border',
                  borderColor,
                  isDark ? 'bg-white/5' : 'bg-[#F8F8F8]'
                )}
              >
                <p className="text-xs uppercase tracking-wider font-semibold mb-2 text-[#C41E3A]">
                  Address
                </p>
                <p className="text-sm leading-relaxed">{block.mapAddress}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
