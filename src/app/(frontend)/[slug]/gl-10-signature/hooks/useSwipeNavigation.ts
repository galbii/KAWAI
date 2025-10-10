import { useState, useCallback } from 'react'
import type { PanInfo } from 'framer-motion'
import type { ViewType } from '../components/GL10Navigation'
import { triggerHaptic } from '../utils/haptics'

interface UseSwipeNavigationOptions {
  currentView: ViewType
  views: ViewType[]
  onViewChange: (view: ViewType) => void
  threshold?: number
  velocityThreshold?: number
}

/**
 * Hook for swipe-based navigation between views
 * Detects horizontal swipes and navigates to adjacent views
 */
export function useSwipeNavigation({
  currentView,
  views,
  onViewChange,
  threshold = 50,
  velocityThreshold = 500
}: UseSwipeNavigationOptions) {
  const [dragOffset, setDragOffset] = useState(0)

  const currentIndex = views.indexOf(currentView)
  const hasNext = currentIndex < views.length - 1
  const hasPrevious = currentIndex > 0

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback(() => {
    setDragOffset(0)
  }, [])

  /**
   * Handle drag motion
   */
  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Prevent dragging beyond bounds
    const newOffset = info.offset.x

    // Apply resistance at boundaries
    if ((newOffset > 0 && !hasPrevious) || (newOffset < 0 && !hasNext)) {
      setDragOffset(newOffset * 0.2) // 80% resistance
    } else {
      setDragOffset(newOffset)
    }
  }, [hasNext, hasPrevious])

  /**
   * Handle drag end and determine if we should switch views
   */
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeDistance = info.offset.x
    const swipeVelocity = info.velocity.x

    // Determine if swipe was significant enough
    const isSignificantSwipe =
      Math.abs(swipeDistance) > threshold ||
      Math.abs(swipeVelocity) > velocityThreshold

    if (isSignificantSwipe) {
      if (swipeDistance > 0 && hasPrevious) {
        // Swipe right - go to previous view
        const previousView = views[currentIndex - 1]
        if (previousView) {
          triggerHaptic('light')
          onViewChange(previousView)
        }
      } else if (swipeDistance < 0 && hasNext) {
        // Swipe left - go to next view
        const nextView = views[currentIndex + 1]
        if (nextView) {
          triggerHaptic('light')
          onViewChange(nextView)
        }
      }
    }

    // Reset drag offset
    setDragOffset(0)
  }, [threshold, velocityThreshold, currentIndex, views, hasNext, hasPrevious, onViewChange])

  return {
    dragOffset,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    hasNext,
    hasPrevious,
    currentIndex
  }
}
