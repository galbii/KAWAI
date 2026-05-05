'use client'

import { useEffect, useState } from 'react'
import { SHIGERU_MODELS } from '../../_data/models'

export function ModelProgressIndicator() {
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SHIGERU_MODELS.forEach((model, i) => {
      const el = document.getElementById(`model-${model.slug}`)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActiveIndex(i)
        },
        // Trigger when the section occupies the middle band of the viewport
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const isVisible = activeIndex >= 0

  return (
    <nav
      className={`fixed right-5 xl:right-7 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Piano model navigation"
    >
      {SHIGERU_MODELS.map((model, i) => {
        const isActive = i === activeIndex
        const isPast = i < activeIndex

        return (
          <div key={model.slug} className="relative group/dot flex flex-col items-center">
            {/* Connector line above (skip first) */}
            {i > 0 && (
              <span
                className="block w-px transition-colors duration-500"
                style={{
                  height: '22px',
                  backgroundColor:
                    i <= activeIndex ? 'rgba(213,199,140,0.5)' : 'rgba(0,0,0,0.15)',
                }}
              />
            )}

            {/* Dot button */}
            <button
              onClick={() =>
                document.getElementById(`model-${model.slug}`)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }
              className="relative w-5 h-5 flex items-center justify-center cursor-pointer"
              aria-label={`Jump to ${model.name}`}
            >
              <span
                className="block rounded-full transition-all duration-400"
                style={{
                  width: isActive ? '7px' : '5px',
                  height: isActive ? '7px' : '5px',
                  backgroundColor: isActive
                    ? 'rgba(213,199,140,1)'
                    : isPast
                      ? 'rgba(213,199,140,0.45)'
                      : 'rgba(0,0,0,0.2)',
                  boxShadow: isActive ? '0 0 10px 2px rgba(213,199,140,0.45)' : 'none',
                }}
              />
            </button>

            {/* Model name — appears on hover, positioned to the left */}
            <div
              className="absolute right-full top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none pr-2"
              aria-hidden="true"
            >
              <span
                className="text-[8px] tracking-[0.3em] uppercase whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-brand-sans)',
                  color: isActive ? 'rgba(213,199,140,0.8)' : 'rgba(0,0,0,0.4)',
                }}
              >
                {model.name}
              </span>
              <span
                className="block w-3 h-px flex-shrink-0"
                style={{
                  backgroundColor: isActive
                    ? 'rgba(213,199,140,0.5)'
                    : 'rgba(0,0,0,0.15)',
                }}
              />
            </div>
          </div>
        )
      })}
    </nav>
  )
}
