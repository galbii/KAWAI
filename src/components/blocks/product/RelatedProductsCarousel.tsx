'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RelatedProductsCarouselProps {
  children: React.ReactNode
  isDark: boolean
}

export function RelatedProductsCarousel({ children, isDark }: RelatedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [progress, setProgress] = useState(0)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < maxScroll - 4)
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 1)
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    // Re-measure when cards load/resize (images settling changes scrollWidth)
    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)
    return () => observer.disconnect()
  }, [updateScrollState])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    // Scroll by ~75% of the visible width
    const amount = el.offsetWidth * 0.75
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const buttonBase =
    'absolute top-1/3 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-brand-medium disabled:opacity-0 disabled:pointer-events-none opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100'
  const buttonColors = isDark
    ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
    : 'bg-white hover:bg-kawai-pearl text-kawai-black'

  const fadeFrom = isDark ? 'from-kawai-black' : 'from-kawai-pearl'
  const trackColor = isDark ? 'bg-white/10' : 'bg-kawai-neutral'
  const thumbColor = 'bg-kawai-red'

  return (
    <div className="relative group/carousel">
      {/* Prev */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`${buttonBase} ${buttonColors} left-0 -translate-x-5`}
        aria-label="Previous products"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Edge fades — signal there's more to scroll */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-10 z-[5] bg-gradient-to-r ${fadeFrom} to-transparent pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 w-10 z-[5] bg-gradient-to-l ${fadeFrom} to-transparent pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2"
      >
        {children}
      </div>

      {/* Next */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`${buttonBase} ${buttonColors} right-0 translate-x-5`}
        aria-label="Next products"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scroll progress */}
      {(canScrollLeft || canScrollRight) && (
        <div className={`mt-8 h-px w-full ${trackColor} relative overflow-hidden`} aria-hidden="true">
          <div
            className={`absolute inset-y-0 left-0 ${thumbColor} transition-[width] duration-150 ease-out`}
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
