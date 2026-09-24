'use client'

import { Collection, Media, Product } from '@/payload-types'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import Image from 'next/image'
import { BackgroundYouTube } from '@/components/ui/background-youtube'

interface CollectionShowcaseBlockProps {
  enabled?: boolean | null
  collection?: string | Collection | null
  bannerSize?: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'fullscreen' | null
  customSubheading?: string | null
  overrideYoutubeUrl?: string | null
  product?: Product | null
  actionLabel?: string | null
  toneLabel?: string | null
  featuresLabel?: string | null
  /** When true, renders a "View Collection" CTA linking to /pianos/[handle]. Use on product pages. */
  showViewCollectionLink?: boolean
}

/**
 * CollectionShowcaseBlock - Cinematic YouTube Video Banner
 *
 * A refined, Japanese-inspired banner with YouTube video background.
 * Combines wabi-sabi minimalism with European luxury aesthetics.
 */
export function CollectionShowcaseBlock({
  enabled = true,
  collection,
  bannerSize: blockBannerSize,
  customSubheading,
  overrideYoutubeUrl,
  product,
  actionLabel,
  toneLabel,
  featuresLabel,
  showViewCollectionLink = false,
}: CollectionShowcaseBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Don't render if disabled
  if (!enabled) return null

  // Type guard for collection object
  const isCollectionObject = typeof collection === 'object' && collection !== null
  if (!isCollectionObject) return null

  // Extract only what we need from the collection (video + fallback image)
  const { youtubeUrl, media, heading } = collection

  const activeYoutubeUrl = overrideYoutubeUrl || youtubeUrl || null

  // Kept even when a video is present — it paints under the player until the
  // first real frame, so nobody sees YouTube's black-and-spinner.
  const posterImage =
    media && typeof media === 'object' ? ((media as Media).url ?? null) : null

  // Build tabs from action / tone / features string arrays
  const safeStringArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return (val as unknown[]).filter((v): v is string => typeof v === 'string')
    return []
  }

  const tabs = [
    { label: actionLabel   || 'Touch & Action',          items: safeStringArray((product as any)?.action) },
    { label: toneLabel     || 'Sound & Tone',            items: safeStringArray((product as any)?.tone) },
    { label: featuresLabel || 'Connectivity & Features', items: safeStringArray((product as any)?.features) },
  ].filter(t => t.items.length > 0)

  // Nothing to show — don't render
  if (tabs.length === 0 && !activeYoutubeUrl && !posterImage) return null
  if (product && tabs.length === 0) return null

  const active = tabs[activeIndex] ?? tabs[0]

  return (
    <section className="relative w-full overflow-hidden bg-black text-white" style={{ minHeight: '420px' }}>
      {/* Video background — chrome-free player, poster underneath */}
      {activeYoutubeUrl && (
        <div className="absolute inset-0 z-0">
          <BackgroundYouTube
            url={activeYoutubeUrl}
            poster={posterImage}
            title="Collection showcase video"
            priority
          />
        </div>
      )}
      {!activeYoutubeUrl && posterImage && (
        <div className="absolute inset-0 z-0">
          <Image src={posterImage} alt={heading || 'Collection showcase'} fill className="object-cover" sizes="100vw" priority />
        </div>
      )}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Tab navigation */}
      {tabs.length > 0 && (
        <div className="relative z-20 border-b border-white/20">
          <div className="container mx-auto px-6 md:px-12 flex gap-8 overflow-x-auto">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'py-5 text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors',
                  i === activeIndex
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active tab content */}
      {active && (
        <div key={activeIndex} className="relative z-20 container mx-auto px-6 md:px-12 py-20 md:py-28 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-light tracking-widest uppercase mb-8 max-w-4xl">
            {active.label}
          </h2>
          <ul className="space-y-3 max-w-lg">
            {active.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-white/70">
                <span className="mt-[0.45em] w-1 h-1 rounded-full bg-white/50 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
