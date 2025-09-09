'use client'

import { useEffect, useRef, useCallback } from 'react'
import { trackPageEvent } from '../lib/analytics'

interface UsePageTrackingOptions {
  pageName?: string
  enableScrollTracking?: boolean
  enableTimeTracking?: boolean
  enableExitIntent?: boolean
  scrollThresholds?: number[]
  timeUpdateInterval?: number
}

export function usePageTracking(options: UsePageTrackingOptions = {}) {
  const {
    pageName = 'unknown',
    enableScrollTracking = false,
    enableTimeTracking = true,
    enableExitIntent = true,
    scrollThresholds = [25, 50, 75, 90],
    timeUpdateInterval = 30000 // 30 seconds
  } = options

  // Tracking state
  const startTimeRef = useRef<number>(Date.now())
  const lastActiveTimeRef = useRef<number>(Date.now())
  const activeTimeRef = useRef<number>(0)
  const isVisibleRef = useRef<boolean>(true)
  const maxScrollDepthRef = useRef<number>(0)
  const scrollMilestonesRef = useRef<Set<number>>(new Set())
  const interactionCountRef = useRef<number>(0)
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Track user interactions
  const trackInteraction = useCallback(() => {
    interactionCountRef.current++
    lastActiveTimeRef.current = Date.now()
  }, [])

  // Calculate engagement time (only when page is visible)
  const updateEngagementTime = useCallback(() => {
    if (isVisibleRef.current) {
      const now = Date.now()
      const timeDiff = now - lastActiveTimeRef.current
      
      // Only count as engagement if less than 30 seconds since last activity
      if (timeDiff < 30000) {
        activeTimeRef.current += timeDiff
      }
      lastActiveTimeRef.current = now
    }
  }, [])

  // Handle visibility changes
  const handleVisibilityChange = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const isVisible = !document.hidden
    
    if (isVisible && !isVisibleRef.current) {
      // Page became visible
      lastActiveTimeRef.current = Date.now()
    } else if (!isVisible && isVisibleRef.current) {
      // Page became hidden - update engagement time
      updateEngagementTime()
    }
    
    isVisibleRef.current = isVisible
  }, [updateEngagementTime])

  // Handle scroll tracking
  const handleScroll = useCallback(() => {
    if (!enableScrollTracking) return
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    const scrollPercentage = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    )
    
    // Update max scroll depth
    if (scrollPercentage > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = scrollPercentage
    }

    // Track scroll milestones
    scrollThresholds.forEach(threshold => {
      if (scrollPercentage >= threshold && !scrollMilestonesRef.current.has(threshold)) {
        scrollMilestonesRef.current.add(threshold)
        
        // Check if scrollDepth function is enabled
        if (trackPageEvent.scrollDepth) {
          trackPageEvent.scrollDepth(threshold, pageName)
        }
      }
    })

    // Track interaction
    trackInteraction()
  }, [enableScrollTracking, scrollThresholds, pageName, trackInteraction])

  // Handle exit intent
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (!enableExitIntent) return
    
    // Detect if mouse is leaving through the top of the page
    if (e.clientY <= 0) {
      updateEngagementTime()
      const totalTime = activeTimeRef.current / 1000
      
      trackPageEvent.exitIntent(
        totalTime,
        maxScrollDepthRef.current,
        interactionCountRef.current
      )
    }
  }, [enableExitIntent, updateEngagementTime])

  // Send periodic engagement updates
  const sendEngagementUpdate = useCallback(() => {
    if (!enableTimeTracking) return

    updateEngagementTime()
    const totalTime = activeTimeRef.current / 1000
    
    if (totalTime > 0) {
      // Check if engagementTime function is enabled
      if (trackPageEvent.engagementTime) {
        trackPageEvent.engagementTime(totalTime, pageName)
      }
      
      // Check if sessionQuality function is enabled
      if (trackPageEvent.sessionQuality) {
        // Calculate session quality score (0-100)
        const timeScore = Math.min(totalTime / 60, 1) * 40 // Up to 40 points for time
        const scrollScore = Math.min(maxScrollDepthRef.current, 100) * 0.3 // Up to 30 points for scroll
        const interactionScore = Math.min(interactionCountRef.current * 5, 30) // Up to 30 points for interactions
        
        const qualityScore = Math.round(timeScore + scrollScore + interactionScore)
        
        trackPageEvent.sessionQuality(
          qualityScore,
          interactionCountRef.current,
          totalTime
        )
      }
    }
  }, [enableTimeTracking, updateEngagementTime, pageName])

  // Throttle scroll events
  const throttledScroll = useCallback(() => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }
  }, [handleScroll])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const throttledScrollHandler = throttledScroll()

    // Add event listeners
    if (enableTimeTracking) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // Track common interaction events
      const interactionEvents = ['click', 'keydown', 'mousemove', 'touchstart']
      interactionEvents.forEach(event => {
        document.addEventListener(event, trackInteraction, { passive: true })
      })

      // Set up periodic time updates
      timeUpdateIntervalRef.current = setInterval(sendEngagementUpdate, timeUpdateInterval)
    }

    if (enableScrollTracking) {
      window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    }

    if (enableExitIntent) {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    // Cleanup function
    return () => {
      // Send final engagement update
      if (enableTimeTracking) {
        sendEngagementUpdate()
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        
        const interactionEvents = ['click', 'keydown', 'mousemove', 'touchstart']
        interactionEvents.forEach(event => {
          document.removeEventListener(event, trackInteraction)
        })

        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current)
        }
      }

      if (enableScrollTracking) {
        window.removeEventListener('scroll', throttledScrollHandler)
      }

      if (enableExitIntent) {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [
    enableTimeTracking,
    enableScrollTracking,
    enableExitIntent,
    handleVisibilityChange,
    trackInteraction,
    throttledScroll,
    handleMouseLeave,
    sendEngagementUpdate,
    timeUpdateInterval
  ])

  // Return tracking methods for manual use
  return {
    trackInteraction,
    trackContentInteraction: (contentType: string, elementId?: string) => {
      trackInteraction()
      const timeToInteraction = (Date.now() - startTimeRef.current) / 1000
      trackPageEvent.contentInteraction(contentType, elementId, timeToInteraction)
    },
    getCurrentEngagementTime: () => {
      updateEngagementTime()
      return activeTimeRef.current / 1000
    },
    getScrollDepth: () => maxScrollDepthRef.current,
    getInteractionCount: () => interactionCountRef.current
  }
}