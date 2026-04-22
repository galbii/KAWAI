'use client'

import { useState, useEffect } from 'react'

function SakuraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          <ellipse cx="20" cy="11" rx="5" ry="9" fill="currentColor" fillOpacity="0.9" />
          <ellipse cx="20" cy="5.5" rx="2" ry="2.5" fill="white" fillOpacity="0.35" />
        </g>
      ))}
      <circle cx="20" cy="20" r="4" fill="white" fillOpacity="0.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  )
}

interface Testimonial {
  customerName?: string | null
  testimonialText?: string | null
  pianoModel?: string | null
  customerCity?: string | null
  rating?: number | null
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[] | null
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    customerName: 'Margaret T.',
    testimonialText:
      'I kept telling myself a grand was out of reach. The financing made it completely possible — and the Kawai GX-2 has been in our living room for two years now. Best decision I\'ve made for our family.',
    pianoModel: 'GX-2 Grand',
    customerCity: 'St. Louis, MO',
    rating: 5,
  },
  {
    customerName: 'David K.',
    testimonialText:
      'I\'m a piano teacher. I was skeptical of anything other than a Steinway. After playing the Shigeru SK-2 at the showroom, I understood immediately why serious pianists choose Kawai. The action is extraordinary.',
    pianoModel: 'SK-2 Shigeru Kawai Grand',
    customerCity: 'Chicago, IL',
    rating: 5,
  },
  {
    customerName: 'Susan R.',
    testimonialText:
      'We traded in my old upright and the trade-in credit made the upgrade surprisingly affordable. The staff was patient, not pushy — I felt like they genuinely wanted to find the right instrument for me.',
    pianoModel: 'GL-30 Grand',
    customerCity: 'Nashville, TN',
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-kawai-red' : 'text-kawai-neutral'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const featured = testimonials && testimonials.length >= 2
    ? testimonials.filter((t) => t.testimonialText && t.customerName).slice(0, 6)
    : FALLBACK_TESTIMONIALS

  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  if (featured.length === 0) return null

  const go = (next: number) => {
    setVisible(false)
    setTimeout(() => {
      setIndex((next + featured.length) % featured.length)
      setVisible(true)
    }, 220)
  }

  const t = featured[index]!

  return (
    <section className="py-20 md:py-32 bg-white/85 backdrop-blur-md border-b border-kawai-neutral/60 overflow-hidden">
      <style>{`
        .ts-fade { transition: opacity 0.22s ease, transform 0.22s ease; }
        .ts-fade-in { opacity: 1; transform: translateY(0); }
        .ts-fade-out { opacity: 0; transform: translateY(8px); }
      `}</style>

      <div className="max-w-4xl mx-auto px-8">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="h-px w-12 bg-kawai-red/30" />
          <SakuraIcon className="w-3.5 h-3.5 text-kawai-red/50" />
          <span className="font-kawai-script text-kawai-red/70" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}>
            From Our Customers
          </span>
          <SakuraIcon className="w-3.5 h-3.5 text-kawai-red/50" />
          <div className="h-px w-12 bg-kawai-red/30" />
        </div>

        {/* Card */}
        <div
          className={`ts-fade ${visible ? 'ts-fade-in' : 'ts-fade-out'} bg-kawai-pearl rounded-xl border border-kawai-neutral/70 shadow-brand-premium px-10 py-12 md:px-14 md:py-14 relative overflow-hidden`}
          aria-live="polite"
        >
          {/* Decorative opening mark — sits inside the card */}
          <div
            className="font-[family-name:var(--font-brand-serif)] text-kawai-red/10 leading-none select-none absolute top-4 left-8 pointer-events-none"
            style={{ fontSize: 'clamp(6rem, 12vw, 9rem)', lineHeight: 0.75 }}
            aria-hidden
          >
            &ldquo;
          </div>

          {/* Stars */}
          <div className="mb-6 relative z-10">
            <StarRating rating={t.rating ?? 5} />
          </div>

          {/* Quote */}
          <blockquote
            className="font-[family-name:var(--font-brand-serif)] italic text-kawai-black leading-[1.55] relative z-10"
            style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)' }}
          >
            {t.testimonialText}
          </blockquote>

          {/* Divider + attribution */}
          <div className="mt-10 pt-8 border-t border-kawai-neutral flex items-center justify-between gap-6 flex-wrap relative z-10">
            <div>
              <p className="text-kawai-black font-semibold text-base tracking-wide">
                {t.customerName}
              </p>
              {(t.pianoModel ?? t.customerCity) && (
                <p className="text-kawai-charcoal/45 text-xs tracking-[0.15em] uppercase mt-1">
                  {[t.pianoModel, t.customerCity].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>

            {/* Counter */}
            {featured.length > 1 && (
              <p className="text-kawai-charcoal/30 text-xs tracking-[0.2em] tabular-nums">
                {String(index + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
              </p>
            )}
          </div>
        </div>

        {/* Navigation */}
        {featured.length > 1 && (
          <div className="mt-12 flex items-center justify-between">
            {/* Prev */}
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className="group flex items-center gap-2 text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-200"
            >
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span className="text-xs tracking-[0.2em] uppercase hidden sm:block">Prev</span>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === index ? '2rem' : '0.375rem',
                    height: '0.375rem',
                    background: i === index ? '#E11922' : '#DBDBDB',
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className="group flex items-center gap-2 text-kawai-charcoal/40 hover:text-kawai-black transition-colors duration-200"
            >
              <span className="text-xs tracking-[0.2em] uppercase hidden sm:block">Next</span>
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
