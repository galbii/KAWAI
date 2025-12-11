/**
 * ArtistsCTA Component
 *
 * Call-to-action section encouraging attendance at NAMM 2026
 * Features gradient background with kawai-red accents
 */

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
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience These Artists Live?
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Join us at NAMM 2026 for exclusive performances, hands-on demonstrations,
            and the opportunity to meet our talented artists in person.
          </p>
        </div>
      </div>
    </section>
  )
}
