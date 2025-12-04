/**
 * ArtistsCTA Component
 *
 * Call-to-action section for returning to main NAMM page or planning visit
 * Features gradient background with kawai-red accents
 */

import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react'
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience These Artists Live?
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Join us at NAMM 2026 for exclusive performances, hands-on demonstrations,
            and the opportunity to meet our talented artists in person.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/namm-2026"
              className={cn(
                "group inline-flex items-center justify-center gap-2",
                "px-8 py-4 rounded-xl",
                "bg-gradient-to-r from-[#E31937] to-[#FF3B55]",
                "text-white font-bold text-lg",
                "shadow-lg shadow-[#E31937]/25 hover:shadow-[#E31937]/40",
                "hover:scale-105 transition-all duration-300",
                "w-full sm:w-auto"
              )}
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to NAMM 2026</span>
            </Link>

            <Link
              href="/namm-2026#plan-your-visit"
              className={cn(
                "group inline-flex items-center justify-center gap-2",
                "px-8 py-4 rounded-xl",
                "bg-white/5 border border-white/10 hover:border-[#E31937]/50",
                "text-white font-bold text-lg",
                "hover:bg-white/10 transition-all duration-300",
                "w-full sm:w-auto"
              )}
            >
              <Calendar className="w-5 h-5" />
              <span>Plan Your Visit</span>
            </Link>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Event Dates */}
          <div className={cn(
            "p-6 rounded-xl",
            "bg-white/5 border border-white/10",
            "hover:border-[#E31937]/50 transition-colors duration-300"
          )}>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#E31937] to-[#FF3B55] flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Event Dates
            </h3>
            <p className="text-sm text-white/60">
              January 22-24, 2026
              <br />
              Daily: 10:00 AM - 6:00 PM
            </p>
          </div>

          {/* Location */}
          <div className={cn(
            "p-6 rounded-xl",
            "bg-white/5 border border-white/10",
            "hover:border-[#E31937]/50 transition-colors duration-300"
          )}>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#E31937] to-[#FF3B55] flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Location
            </h3>
            <p className="text-sm text-white/60">
              Anaheim Convention Center
              <br />
              800 W Katella Ave, Anaheim, CA
            </p>
          </div>

          {/* Registration */}
          <div className={cn(
            "p-6 rounded-xl",
            "bg-white/5 border border-white/10",
            "hover:border-[#E31937]/50 transition-colors duration-300"
          )}>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#E31937] to-[#FF3B55] flex items-center justify-center mb-4">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Registration
            </h3>
            <p className="text-sm text-white/60 mb-3">
              Register for NAMM Show badge to attend all performances
            </p>
            <a
              href="https://www.namm.org/show"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#E31937] hover:text-[#FF3B55] transition-colors inline-flex items-center gap-1 group"
            >
              <span>Register Now</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/50">
            All performances are subject to change. Please check back for the latest updates.
          </p>
        </div>
      </div>
    </section>
  )
}
