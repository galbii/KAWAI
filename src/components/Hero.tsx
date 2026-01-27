import React from 'react'
import type { Page } from '@/payload-types'
import { RichText } from './RichText'
import { LinkGroup } from './CMSLink'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type HeroType = Page['hero']

/**
 * Hero Component
 *
 * Renders the hero section with different impact levels:
 * - none: No hero displayed
 * - lowImpact: Simple text-only hero
 * - mediumImpact: Text + image side-by-side
 * - highImpact: Full-width background image with overlay
 *
 * Server Component
 */
export function Hero({ hero }: { hero: HeroType }) {
  if (!hero || hero.type === 'none') {
    return null
  }

  const { type, richText, links, media } = hero

  // Low Impact - Simple text hero
  if (type === 'lowImpact') {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            {richText && <RichText data={richText} enableGutter={false} />}
            {links && links.length > 0 && (
              <div className="mt-8">
                <LinkGroup links={links} className="justify-center" />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Get media data if available
  const mediaData = media && typeof media === 'object' ? media : null

  // Medium Impact - Text + image side-by-side
  if (type === 'mediumImpact') {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              {richText && <RichText data={richText} enableGutter={false} />}
              {links && links.length > 0 && (
                <div className="mt-8">
                  <LinkGroup links={links} />
                </div>
              )}
            </div>

            {/* Image */}
            {mediaData?.url && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={mediaData.url}
                  alt={mediaData.alt || ''}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // High Impact - Full-width background image
  if (type === 'highImpact') {
    return (
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Image */}
        {mediaData?.url && (
          <>
            <Image
              src={mediaData.url}
              alt={mediaData.alt || ''}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </>
        )}

        {/* Content */}
        <div className="container relative z-10">
          <div className="max-w-3xl text-white">
            {richText && (
              <div className="prose prose-invert prose-lg">
                <RichText data={richText} enableGutter={false} />
              </div>
            )}
            {links && links.length > 0 && (
              <div className="mt-8">
                <LinkGroup links={links} />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return null
}
