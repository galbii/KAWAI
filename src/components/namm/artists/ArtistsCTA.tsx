/**
 * ArtistsCTA Component
 *
 * Call-to-action section encouraging attendance at NAMM 2026
 * Features gradient background with kawai-red accents
 */

import Link from 'next/link'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArtistsCTAProps {
  className?: string
}

export default function ArtistsCTA({ className }: ArtistsCTAProps) {
  return (
    <section className={cn(
      "relative py-24 overflow-hidden",
      "bg-gradient-to-b from-zinc-950 via-black to-black",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(227,25,55,0.2),transparent_70%)]" />
      </div>

      <div className="relative container mx-auto px-6 max-w-5xl">
        {/* Main CTA */}
        <div className="text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience These Artists Live?
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Join us at NAMM 2026 for exclusive performances, hands-on demonstrations,
            and the opportunity to meet our talented artists in person.
          </p>

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto py-8">
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <Calendar className="w-8 h-8 text-[#E31937]" />
              <div className="text-center">
                <p className="text-sm text-white/50 mb-1">Dates</p>
                <p className="text-white font-semibold">January 22-24, 2026</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <MapPin className="w-8 h-8 text-[#E31937]" />
              <div className="text-center">
                <p className="text-sm text-white/50 mb-1">Location</p>
                <p className="text-white font-semibold">Anaheim Convention Center</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <Clock className="w-8 h-8 text-[#E31937]" />
              <div className="text-center">
                <p className="text-sm text-white/50 mb-1">Admission</p>
                <p className="text-white font-semibold">Free with NAMM Badge</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/namm-2026#plan-your-visit"
            className={cn(
              "inline-flex items-center gap-3 px-8 py-4 rounded-full",
              "bg-gradient-to-r from-[#E31937] to-[#FF3B55]",
              "text-lg font-semibold text-white",
              "transition-all duration-300",
              "hover:shadow-2xl hover:shadow-[#E31937]/40 hover:scale-105",
              "active:scale-95"
            )}
          >
            <span>Plan Your Visit</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
