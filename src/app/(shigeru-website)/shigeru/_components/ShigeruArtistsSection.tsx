'use client'

import { useState, useEffect, useCallback } from 'react'

const FEATURED_ARTISTS = [
  {
    name: 'Joe Bongiorno',
    role: 'Solo Piano Artist',
    quote:
      'My Shigeru SK-7 has given me a whole new level of expression, control, tone and clarity that I never dreamed was possible.',
  },
  {
    name: 'David Lanz',
    role: 'Grammy-Nominated Pianist',
    quote:
      'Ever since I played a Shigeru Kawai piano for the first time, I dreamed of owning one — and now I do. Some dreams really do come true.',
  },
  {
    name: 'David Hicken',
    role: 'Contemporary Pianist & Composer',
    quote:
      'The action of the Shigeru Kawai is far superior to anything I have experienced. Playing this instrument is pure joy.',
  },
  {
    name: 'Junko Ueno Garrett',
    role: 'Concert Pianist',
    quote:
      'The Shigeru piano always gives me inspiration to create music at a very high level. I love its honest and transparent sound.',
  },
] as const

export function ShigeruArtistsSection() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((index: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 350)
  }, [])

  const next = useCallback(() => {
    goTo((current + 1) % FEATURED_ARTISTS.length)
  }, [current, goTo])

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  const artist = FEATURED_ARTISTS[current]

  return (
    <section aria-label="Shigeru Kawai Artists" className="bg-white sk-section">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16">
        {/* Carousel slide */}
        <div className="relative">
          {/* Quote area */}
          <div
            className="py-24 lg:py-36 transition-opacity duration-350"
            style={{ opacity: fading ? 0 : 1 }}
          >
            {/* Opening mark */}
            <span
              className="block text-kawai-gold/20 font-light italic leading-none select-none mb-10"
              style={{ fontFamily: 'var(--font-brand-luxury)', fontSize: '9rem' }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Quote */}
            <blockquote
              className="text-kawai-black/70 font-light italic leading-relaxed max-w-4xl"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(1.6rem, 3.2vw, 2.75rem)',
              }}
            >
              {artist?.quote}
            </blockquote>

            {/* Artist overlay — name + rule */}
            <div className="flex items-center gap-6 mt-16">
              <span className="block h-px w-12 bg-kawai-gold/40 flex-shrink-0" />
              <div>
                <p
                  className="text-kawai-black font-semibold tracking-[0.12em] uppercase mb-1.5"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '1rem' }}
                >
                  {artist?.name}
                </p>
                <p
                  className="text-kawai-gold-on-light tracking-[0.25em] uppercase"
                  style={{ fontFamily: 'var(--font-oswald)', fontSize: '0.8rem' }}
                >
                  {artist?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar — dots + view all */}
          <div className="flex items-center justify-between border-t border-kawai-black/[0.07] pt-8 pb-4">
            {/* Dot navigation */}
            <div className="flex items-center gap-4" role="tablist" aria-label="Artist slides">
              {FEATURED_ARTISTS.map((a, i) => (
                <button
                  key={a.name}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to ${a.name}`}
                  onClick={() => goTo(i)}
                  className="group flex items-center justify-center w-8 h-8 focus:outline-none"
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? '28px' : '5px',
                      height: '5px',
                      backgroundColor:
                        i === current ? 'var(--color-kawai-gold)' : 'rgba(0,0,0,0.15)',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* View all link */}
            <a
              href="/shigeru/artists"
              className="inline-flex items-center gap-3 text-kawai-charcoal/40 hover:text-kawai-gold transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-oswald)',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              View all artists&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
