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
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-kawai-red' : 'text-kawai-charcoal/20'}`}
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
    ? testimonials.filter((t) => t.testimonialText && t.customerName).slice(0, 3)
    : FALLBACK_TESTIMONIALS

  if (featured.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-white/85 backdrop-blur-md border-b border-kawai-neutral/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <SakuraIcon className="w-4 h-4 text-kawai-red/60" />
            <p className="text-kawai-red/60 text-xs tracking-[0.2em] uppercase font-medium">
              From Our Customers
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold font-[family-name:var(--font-brand-serif)] text-kawai-black">
            What grand piano ownership actually feels like.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((t, i) => (
            <div
              key={i}
              className="bg-kawai-pearl p-8 rounded-lg border border-kawai-neutral/60 shadow-brand-subtle flex flex-col"
            >
              {/* Rating */}
              <div className="mb-5">
                <StarRating rating={t.rating ?? 5} />
              </div>

              {/* Quote */}
              <blockquote className="text-kawai-charcoal/80 text-base leading-relaxed flex-1 mb-6">
                &ldquo;{t.testimonialText}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="pt-5 border-t border-kawai-neutral">
                <div className="font-semibold text-kawai-black text-base">{t.customerName}</div>
                {(t.customerCity ?? t.pianoModel) && (
                  <div className="text-kawai-charcoal/50 text-sm mt-0.5">
                    {[t.pianoModel, t.customerCity].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
