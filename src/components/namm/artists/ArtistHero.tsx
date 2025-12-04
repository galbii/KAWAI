/**
 * ArtistHero Component
 *
 * Hero section for NAMM 2026 Artists page
 * Features dramatic black background with kawai-red accents
 */

import { Music2, CalendarDays, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArtistHeroProps {
  className?: string
}

export default function ArtistHero({ className }: ArtistHeroProps) {
  return (
    <section className={cn(
      "relative min-h-[70vh] flex items-center justify-center",
      "bg-black text-white overflow-hidden",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(227,25,55,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Music2 className="w-4 h-4 text-[#E31937]" />
            <span className="text-sm font-medium text-white/80">
              NAMM 2026 Artist Lineup
            </span>
          </div>

          {/* Main Heading */}
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-7xl font-bold mb-6",
            "bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent",
            "leading-tight"
          )}>
            Experience World-Class
            <br />
            <span className="bg-gradient-to-r from-[#E31937] to-[#FF3B55] bg-clip-text text-transparent">
              Piano Artistry
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
            Join us for exclusive performances and demonstrations by renowned pianists
            showcasing the power and precision of Kawai instruments at NAMM 2026.
          </p>

          {/* Event Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#E31937]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/50 uppercase tracking-wide">Dates</div>
                <div className="text-sm font-semibold">January 22-24, 2026</div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#E31937]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/50 uppercase tracking-wide">Venue</div>
                <div className="text-sm font-semibold">Anaheim Convention Center</div>
              </div>
            </div>

            <div className="hidden md:block w-px h-12 bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-[#E31937]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/50 uppercase tracking-wide">Access</div>
                <div className="text-sm font-semibold">Free with NAMM Badge</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 md:mt-20 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full mx-auto flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-white/40 mt-3 uppercase tracking-wide">
              Explore Artists
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}
