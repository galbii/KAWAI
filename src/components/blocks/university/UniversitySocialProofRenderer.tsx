import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

interface StatItem {
  number: string
  label: string
  sublabel?: string
}

interface TestimonialItem {
  quote: string
  authorName: string
  authorTitle?: string
  rating?: number
  authorImage?: Media | string | null
}

interface UniversitySocialProofRendererProps {
  block: {
    sectionHeading?: string
    subheading?: string
    stats?: StatItem[]
    testimonials?: TestimonialItem[]
  }
}

function isMediaObject(media: Media | string | null | undefined): media is Media {
  return typeof media === 'object' && media !== null && 'url' in media
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={cn('w-4 h-4', i < rating ? 'text-kawai-gold fill-kawai-gold' : 'text-kawai-neutral fill-kawai-neutral')}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export const UniversitySocialProofRenderer: React.FC<UniversitySocialProofRendererProps> = ({ block }) => {
  const { sectionHeading, subheading, stats = [], testimonials = [] } = block

  return (
    <section className="py-24 bg-kawai-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        {(sectionHeading || subheading) && (
          <div className="text-center mb-14 space-y-3">
            {sectionHeading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                {sectionHeading}
              </h2>
            )}
            <div className="w-16 h-1 bg-kawai-red mx-auto rounded-full" />
            {subheading && (
              <p className="text-white/70 text-lg max-w-2xl mx-auto">{subheading}</p>
            )}
          </div>
        )}

        {/* Stats row */}
        {stats.length > 0 && (
          <div className={cn('grid gap-6 mb-16', {
            'md:grid-cols-2': stats.length === 2,
            'md:grid-cols-3': stats.length === 3,
            'md:grid-cols-4': stats.length >= 4,
          })}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-kawai-gold mb-1">{stat.number}</div>
                <div className="text-white text-sm font-medium">{stat.label}</div>
                {stat.sublabel && (
                  <div className="text-white/50 text-xs mt-0.5">{stat.sublabel}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Testimonials grid */}
        {testimonials.length > 0 && (
          <div className={cn('grid gap-6', {
            'md:grid-cols-1': testimonials.length === 1,
            'md:grid-cols-2': testimonials.length === 2,
            'md:grid-cols-3': testimonials.length >= 3,
          })}>
            {testimonials.map((t, i) => {
              const avatarMedia = isMediaObject(t.authorImage) ? t.authorImage : null

              return (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col"
                >
                  <StarRating rating={t.rating ?? 5} />

                  <blockquote className="text-white/90 text-sm leading-relaxed mt-4 mb-6 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                    {avatarMedia?.url ? (
                      <Image
                        src={avatarMedia.url}
                        alt={avatarMedia.alt ?? t.authorName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      /* Fallback avatar */
                      <div className="w-10 h-10 rounded-full bg-kawai-red/30 flex items-center justify-center shrink-0">
                        <span className="text-kawai-red font-semibold text-sm">
                          {t.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-white font-medium text-sm leading-tight">{t.authorName}</div>
                      {t.authorTitle && (
                        <div className="text-white/50 text-xs">{t.authorTitle}</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
