'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RelatedProductsCarouselProps {
  children: React.ReactNode
  isDark: boolean
}

export function RelatedProductsCarousel({ children, isDark }: RelatedProductsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    // Scroll by ~75% of the visible width
    const amount = el.offsetWidth * 0.75
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const buttonBase =
    'absolute top-1/3 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 shadow-brand-medium'
  const buttonColors = isDark
    ? 'bg-white/10 hover:bg-white/20 text-white'
    : 'bg-white hover:bg-kawai-pearl text-kawai-black'

  return (
    <div className="relative group/carousel">
      {/* Prev */}
      <button
        onClick={() => scroll('left')}
        className={`${buttonBase} ${buttonColors} left-0 -translate-x-5`}
        aria-label="Previous products"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2"
      >
        {children}
      </div>

      {/* Next */}
      <button
        onClick={() => scroll('right')}
        className={`${buttonBase} ${buttonColors} right-0 translate-x-5`}
        aria-label="Next products"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
