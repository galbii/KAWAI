'use client'

import { motion } from 'framer-motion'
import { Trophy, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ArtistModelCard } from './ArtistModelCard'
import { SocialBrandIcon } from './SocialBrandIcon'

type SocialPlatform =
  | 'website' | 'instagram' | 'youtube' | 'spotify' | 'apple-music'
  | 'soundcloud' | 'facebook' | 'twitter' | 'tiktok' | 'linkedin'
  | 'bandcamp' | 'other'

interface SocialLink {
  platform: SocialPlatform
  url: string
  label?: string | null
  id?: string | null
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  website:       'Website',
  instagram:     'Instagram',
  youtube:       'YouTube',
  spotify:       'Spotify',
  'apple-music': 'Apple Music',
  soundcloud:    'SoundCloud',
  facebook:      'Facebook',
  twitter:       'X / Twitter',
  tiktok:        'TikTok',
  linkedin:      'LinkedIn',
  bandcamp:      'Bandcamp',
  other:         'Link',
}

interface ArtistRightPanelProps {
  kawaiModel?: { name: string | null; slug: string; imageUrl?: string | null } | null
  achievements?: { achievement: string; id?: string | null }[] | null
  quote?: { text?: string | null; date?: string | null }
  region?: string | null
  socialLinks?: SocialLink[] | null
  audienceMetrics?: {
    instagramFollowers?: string | null
    youtubeSubscribers?: string | null
    spotifyMonthlyListeners?: string | null
  }
}

function formatQuoteDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function ArtistRightPanel({
  kawaiModel,
  achievements,
  quote,
  region,
  socialLinks,
}: ArtistRightPanelProps) {
  const hasModel = Boolean(kawaiModel)
  const hasAchievements = achievements && achievements.length > 0
  const hasQuote = Boolean(quote?.text)
  const hasRegion = Boolean(region)
  const hasSocials = socialLinks && socialLinks.length > 0

  if (!hasModel && !hasAchievements && !hasQuote && !hasRegion && !hasSocials) return null

  return (
    <aside
      className={cn(
        'hidden xl:block w-64 shrink-0',
        'sticky top-[calc(var(--header-bottom,120px)+24px)]',
        'max-h-[calc(100vh-var(--header-bottom,120px)-48px)]',
        'overflow-y-auto overscroll-contain scrollbar-hide space-y-4',
      )}
    >
      {/* KAWAI Model — white card */}
      {hasModel && kawaiModel && (
        <ArtistModelCard product={kawaiModel} variant="light" />
      )}

      {/* Social links */}
      {hasSocials && (
        <div className="bg-white border border-kawai-neutral rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-kawai-charcoal/40 mb-3">
            Follow
          </p>
          <div className="flex flex-col divide-y divide-kawai-neutral/40">
            {socialLinks!.map((link, idx) => (
              <a
                key={link.id ?? idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 text-sm text-kawai-charcoal hover:text-kawai-red transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-kawai-pearl flex items-center justify-center shrink-0 group-hover:bg-kawai-red/10 transition-colors overflow-hidden">
                  <SocialBrandIcon platform={link.platform} className="w-3.5 h-3.5" />
                </span>
                <span className="font-medium text-xs truncate">
                  {link.label || PLATFORM_LABELS[link.platform] || link.platform}
                </span>
                <span className="ml-auto text-kawai-red opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {hasAchievements && (
        <div className="bg-kawai-pearl rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-kawai-red mb-4">
            Achievements
          </p>
          {achievements!.map((item, index) => (
            <motion.div
              key={item.id ?? index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="flex items-start gap-3 mb-3 last:mb-0"
            >
              <Trophy className="w-4 h-4 text-kawai-gold shrink-0 mt-0.5" />
              <span className="text-sm text-kawai-charcoal leading-relaxed">
                {item.achievement}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quote */}
      {hasQuote && (
        <div className="bg-kawai-charcoal rounded-xl p-5 relative overflow-hidden">
          <span
            className="absolute -top-2 -left-1 text-kawai-red text-[80px] font-serif leading-none opacity-20 select-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p className="relative italic text-white text-sm leading-relaxed">
            {quote!.text}
          </p>
          {quote!.date && (
            <p className="text-kawai-neutral/50 text-xs mt-3">
              {formatQuoteDate(quote!.date)}
            </p>
          )}
        </div>
      )}

      {/* Region chip */}
      {hasRegion && (
        <div>
          <span className="inline-flex items-center gap-2 bg-white border border-kawai-neutral rounded-full px-4 py-2 text-sm text-kawai-charcoal">
            <MapPin className="w-4 h-4 text-kawai-red" />
            {region}
          </span>
        </div>
      )}
    </aside>
  )
}
