'use client'

import { useState, useEffect } from 'react'

export type ScrollDirection = 'up' | 'down' | 'none'

interface UseScrollDirectionOptions {
  threshold?: number
  onScrollUp?: () => void
  onScrollDown?: () => void
}

/**
 * Hook to detect scroll direction for auto-hide navigation
 * @param threshold - Minimum scroll distance before direction changes (default: 50px)
 */
export function useScrollDirection({
  threshold = 50,
  onScrollUp,
  onScrollDown
}: UseScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none')
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }

      const direction = scrollY > lastScrollY ? 'down' : 'up'

      if (direction !== scrollDirection) {
        setScrollDirection(direction)

        if (direction === 'up') {
          onScrollUp?.()
        } else {
          onScrollDown?.()
        }
      }

      setLastScrollY(scrollY > 0 ? scrollY : 0)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [scrollDirection, lastScrollY, threshold, onScrollUp, onScrollDown])

  return scrollDirection
}
