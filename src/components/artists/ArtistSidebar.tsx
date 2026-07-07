'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Star } from 'lucide-react'
import { SocialBrandIcon } from './SocialBrandIcon'

interface SocialLink {
  platform: string
  url: string
  label?: string | null
  id?: string | null
}

interface ArtistSidebarProps {
  name: string
  imageUrl: string
  heroImageUrl?: string | null
  genre?: string | null
  instrument?: string | null
  region?: string | null
  shortBio?: string | null
  isShigeruArtist?: boolean | null
  socialLinks?: SocialLink[] | null
}

const INSTRUMENT_LABELS: Record<string, string> = {
  grand: 'Grand Piano',
  upright: 'Upright Piano',
  digital: 'Digital Piano',
  hybrid: 'Hybrid Piano',
  multiple: 'Multiple',
}

const PLATFORM_LABELS: Record<string, string> = {
  website: 'Website', instagram: 'Instagram', youtube: 'YouTube',
  spotify: 'Spotify', 'apple-music': 'Apple Music', soundcloud: 'SoundCloud',
  facebook: 'Facebook', twitter: 'X / Twitter', tiktok: 'TikTok',
  linkedin: 'LinkedIn', bandcamp: 'Bandcamp', other: 'Link',
}

export function ArtistSidebar({
  name, imageUrl, heroImageUrl, genre, instrument, region,
  shortBio, isShigeruArtist, socialLinks,
}: ArtistSidebarProps) {
  const displayImage = heroImageUrl || imageUrl

  const tags = [
    genre ? { label: genre, style: 'bg-kawai-red/80 text-white' } : null,
    instrument && INSTRUMENT_LABELS[instrument] ? { label: INSTRUMENT_LABELS[instrument], style: 'bg-white/20 text-white border border-white/20' } : null,
    region ? { label: region, style: 'bg-white/10 text-white/80 border border-white/10' } : null,
  ].filter(Boolean) as { label: string; style: string }[]

  return (
    <div className="contents">
      {/* Single semantic page heading — the visual name overlays below are
          responsive duplicates, so they render as <p> to avoid multiple h1s. */}
      <h1 className="sr-only">{name}</h1>
      {/* ── MOBILE HERO (hidden on lg+) ─────────────────────────── */}
      <div className="lg:hidden">
        {/* Back link */}
        <div className="px-4 pt-8 pb-3">
          <Link
            href="/artists"
            className="inline-flex items-center gap-1.5 text-kawai-charcoal/50 hover:text-kawai-black transition-colors text-xs font-medium group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            All Artists
          </Link>
        </div>

        {/* Hero image — full width, shorter aspect on mobile */}
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Shigeru badge */}
          {isShigeruArtist && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1.5 bg-kawai-gold/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                <Star className="w-3 h-3 text-kawai-black fill-kawai-black" />
                <span className="text-kawai-black text-xs font-bold leading-none">Shigeru</span>
              </div>
            </div>
          )}

          {/* Name + tags overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-3xl font-bold text-white leading-tight mb-3">
              {name}
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span
                    key={tag.label}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${tag.style}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Short bio */}
        {shortBio && (
          <div className="px-5 py-4 border-b border-kawai-neutral/60">
            <p className="text-sm text-kawai-charcoal/70 leading-relaxed italic">
              &ldquo;{shortBio}&rdquo;
            </p>
          </div>
        )}

        {/* Social links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="px-5 py-4 flex flex-wrap gap-2 border-b border-kawai-neutral/60">
            {socialLinks.map((link, idx) => (
              <a
                key={link.id ?? idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-kawai-pearl border border-kawai-neutral rounded-full px-3 py-1.5 text-xs font-medium text-kawai-charcoal hover:bg-kawai-black hover:text-white hover:border-kawai-black transition-all duration-200"
              >
                <SocialBrandIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
                {link.label || PLATFORM_LABELS[link.platform] || link.platform}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP SIDEBAR (hidden below lg) ───────────────────── */}
      <aside className="hidden lg:block w-[340px] xl:w-[420px] shrink-0">
        <div
          className="sticky space-y-4 overflow-y-auto overscroll-contain scrollbar-hide"
          style={{
            top: 'calc(var(--header-bottom, 120px) + 24px)',
            maxHeight: 'calc(100vh - var(--header-bottom, 120px) - 48px)',
          }}
        >
          {/* Back link */}
          <Link
            href="/artists"
            className="inline-flex items-center gap-1.5 text-kawai-charcoal/60 hover:text-kawai-black transition-colors text-xs font-medium group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            All Artists
          </Link>

          {/* Hero portrait */}
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/40" />

              {isShigeruArtist && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-kawai-gold/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Star className="w-3 h-3 text-kawai-black fill-kawai-black" />
                    <span className="text-kawai-black text-xs font-bold leading-none">Shigeru</span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-2xl font-bold text-white leading-tight mb-2.5">
                  {name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span
                      key={tag.label}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${tag.style}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Short bio */}
          {shortBio && (
            <div className="bg-white border border-kawai-neutral rounded-xl px-5 py-4">
              <p className="text-sm text-kawai-charcoal/80 leading-relaxed italic">
                &ldquo;{shortBio}&rdquo;
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
