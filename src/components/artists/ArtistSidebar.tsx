'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArtistSidebarProps {
  name: string
  imageUrl: string
  heroImageUrl?: string | null
  genre?: string | null
  instrument?: string | null
  region?: string | null
  shortBio?: string | null
  isShigeruArtist?: boolean | null
}

const INSTRUMENT_LABELS: Record<string, string> = {
  grand: 'Grand Piano',
  upright: 'Upright Piano',
  digital: 'Digital Piano',
  hybrid: 'Hybrid Piano',
  multiple: 'Multiple',
}

export function ArtistSidebar({
  name,
  imageUrl,
  heroImageUrl,
  genre,
  instrument,
  region,
  shortBio,
  isShigeruArtist,
}: ArtistSidebarProps) {
  const displayImage = heroImageUrl || imageUrl

  return (
    <aside className="hidden lg:block w-[340px] xl:w-[420px] shrink-0">
      <div
        className="sticky space-y-4 overflow-y-auto overscroll-contain scrollbar-hide"
        style={{
          top: 'calc(var(--header-bottom, 120px) + 24px)',
          maxHeight: 'calc(100vh - var(--header-bottom, 120px) - 48px)',
        }}
      >
        {/* Back link — above the card */}
        <Link
          href="/artists"
          className="inline-flex items-center gap-1.5 text-kawai-charcoal/60 hover:text-kawai-black transition-colors text-xs font-medium group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          All Artists
        </Link>

        {/* Hero portrait — image carries the artist identity */}
        <div className="relative rounded-2xl overflow-hidden shadow-brand-premium">
          <div className="relative aspect-[2/3]">
            <Image
              src={displayImage}
              alt={name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1280px) 340px, 420px"
              priority
            />

            {/* Gradient: subtle at top, heavy at bottom for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

            {/* Shigeru badge — top right */}
            {isShigeruArtist && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1.5 bg-kawai-gold/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Star className="w-3 h-3 text-kawai-black fill-kawai-black" />
                  <span className="text-kawai-black text-xs font-bold leading-none">Shigeru</span>
                </div>
              </div>
            )}

            {/* Name + metadata overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h1 className="text-2xl font-bold text-white leading-tight mb-2.5">
                {name}
              </h1>
              <div className="flex flex-wrap gap-1.5">
                {genre && (
                  <span className="bg-kawai-red/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {genre}
                  </span>
                )}
                {instrument && INSTRUMENT_LABELS[instrument] && (
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/20">
                    {INSTRUMENT_LABELS[instrument]}
                  </span>
                )}
                {region && (
                  <span className="bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium px-2.5 py-1 rounded-full border border-white/10">
                    {region}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Short bio — only if filled */}
        {shortBio && (
          <div className="bg-white border border-kawai-neutral rounded-xl px-5 py-4">
            <p className="text-sm text-kawai-charcoal/80 leading-relaxed italic">
              &ldquo;{shortBio}&rdquo;
            </p>
          </div>
        )}

      </div>
    </aside>
  )
}
