'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { SHIGERU_MODELS } from '../_data/models'

export function ShigeruModelCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Update dot indicator on scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth } = container
      const cardWidth = scrollWidth / SHIGERU_MODELS.length
      const idx = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(Math.max(idx, 0), SHIGERU_MODELS.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return
    const card = container.children[index] as HTMLElement | undefined
    if (!card) return
    container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' })
    setActiveIndex(index)
  }, [])

  const prev = () => scrollToIndex(Math.max(0, activeIndex - 1))
  const next = () => scrollToIndex(Math.min(SHIGERU_MODELS.length - 1, activeIndex + 1))

  return (
    <section
      id="collection"
      aria-label="Shigeru Kawai Grand Piano Collection"
      className="bg-kawai-pearl sk-section"
    >
      <div className="max-w-screen-xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between mb-12 px-6 lg:px-12">
          <div>
            <p
              className="sk-eyebrow text-kawai-gold mb-4"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              The Collection
            </p>
            <h2
              className="text-kawai-black font-light italic leading-none"
              style={{
                fontFamily: 'var(--font-brand-luxury)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              Six Grand Pianos
            </h2>
          </div>

          {/* Prev / Next — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Previous model"
              className="w-10 h-10 flex items-center justify-center border border-kawai-neutral hover:border-kawai-black disabled:opacity-25 transition-colors duration-200"
            >
              <span className="text-kawai-black text-sm" aria-hidden="true">←</span>
            </button>
            <button
              onClick={next}
              disabled={activeIndex === SHIGERU_MODELS.length - 1}
              aria-label="Next model"
              className="w-10 h-10 flex items-center justify-center border border-kawai-neutral hover:border-kawai-black disabled:opacity-25 transition-colors duration-200"
            >
              <span className="text-kawai-black text-sm" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Cards — horizontal scroll */}
        <div
          ref={scrollRef}
          className="sk-scroll-hide flex gap-px overflow-x-auto px-6 lg:px-12"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {SHIGERU_MODELS.map((model) => (
            <Link
              key={model.slug}
              href={`/shigeru/models/${model.slug}`}
              className="group flex-shrink-0 bg-white hover:bg-[#0a0a0a] border border-kawai-neutral hover:border-[#0a0a0a] transition-all duration-500 p-8 lg:p-10 flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-kawai-gold"
              style={{
                scrollSnapAlign: 'start',
                width: 'clamp(260px, 31vw, 320px)',
                minHeight: '300px',
              }}
            >
              {/* Model name */}
              <span
                className="text-kawai-black group-hover:text-kawai-gold font-light italic leading-none transition-colors duration-500 mb-6"
                style={{
                  fontFamily: 'var(--font-brand-luxury)',
                  fontSize: 'clamp(2.5rem, 5vw, 3.2rem)',
                }}
              >
                {model.name}
              </span>

              <span className="sk-rule w-8 mb-6" />

              {/* Type */}
              <p
                className="sk-eyebrow text-kawai-gold mb-3"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {model.type}
              </p>

              {/* Dimensions */}
              <p
                className="text-kawai-charcoal/50 group-hover:text-white/30 text-xs tracking-wide mb-5 transition-colors duration-500"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {model.feet}&ensp;/&ensp;{model.cm}
              </p>

              {/* Tagline */}
              <p
                className="text-kawai-charcoal/55 group-hover:text-white/50 text-sm font-light italic leading-relaxed mt-auto transition-colors duration-500"
                style={{ fontFamily: 'var(--font-brand-luxury)' }}
              >
                {model.tagline}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 mt-8 pt-6 border-t border-kawai-neutral/50 group-hover:border-white/10 transition-colors duration-500">
                <span
                  className="sk-eyebrow text-kawai-charcoal/40 group-hover:text-kawai-gold transition-colors duration-500"
                  style={{ fontFamily: 'var(--font-brand-sans)', letterSpacing: '0.25em' }}
                >
                  Explore
                </span>
                <span
                  className="text-kawai-charcoal/40 group-hover:text-kawai-gold text-xs transition-colors duration-500"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dot indicators */}
        <div
          className="flex items-center gap-3 mt-10 px-6 lg:px-12"
          role="tablist"
          aria-label="Piano model navigation"
        >
          {SHIGERU_MODELS.map((model, i) => (
            <button
              key={model.slug}
              onClick={() => scrollToIndex(i)}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`${model.name} — ${model.type}`}
              className={`block h-px transition-all duration-300 ${
                i === activeIndex
                  ? 'w-10 bg-kawai-gold'
                  : 'w-4 bg-kawai-charcoal/20 hover:bg-kawai-charcoal/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
