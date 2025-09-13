/**
 * Responsive Utilities for Assessment Components
 * Mobile-first responsive design utilities and breakpoint management
 */

import { useState, useEffect } from 'react'

// Breakpoint definitions (matches Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Custom hook for responsive design
 * Returns current breakpoint and screen size information
 */
export function useResponsive() {
  const [screenSize, setScreenSize] = useState<{
    width: number
    height: number
    breakpoint: Breakpoint
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
  }>({
    width: 0,
    height: 0,
    breakpoint: 'sm',
    isMobile: true,
    isTablet: false,
    isDesktop: false
  })

  useEffect(() => {
    function updateScreenSize() {
      const width = window.innerWidth
      const height = window.innerHeight
      
      let breakpoint: Breakpoint = 'sm'
      if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl'
      else if (width >= BREAKPOINTS.xl) breakpoint = 'xl'
      else if (width >= BREAKPOINTS.lg) breakpoint = 'lg'
      else if (width >= BREAKPOINTS.md) breakpoint = 'md'
      else breakpoint = 'sm'

      const isMobile = width < BREAKPOINTS.md
      const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg
      const isDesktop = width >= BREAKPOINTS.lg

      setScreenSize({
        width,
        height,
        breakpoint,
        isMobile,
        isTablet,
        isDesktop
      })
    }

    // Set initial size
    updateScreenSize()

    // Add event listener
    window.addEventListener('resize', updateScreenSize)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return screenSize
}

/**
 * Responsive animation variants based on screen size
 */
export function getResponsiveAnimationVariants(isMobile: boolean) {
  return {
    slideDistance: isMobile ? 30 : 50,
    scaleFactor: isMobile ? 0.97 : 0.95,
    duration: isMobile ? 0.25 : 0.3,
    staggerDelay: isMobile ? 0.05 : 0.1
  }
}

/**
 * Responsive spacing utilities
 */
export const responsiveSpacing = {
  container: {
    mobile: 'px-4 py-6',
    tablet: 'px-6 py-8', 
    desktop: 'px-8 py-12'
  },
  section: {
    mobile: 'mb-6',
    tablet: 'mb-8',
    desktop: 'mb-12'
  },
  element: {
    mobile: 'space-y-3',
    tablet: 'space-y-4',
    desktop: 'space-y-6'
  }
}

/**
 * Responsive text sizes for assessment components
 */
export const responsiveText = {
  title: {
    mobile: 'text-2xl',
    tablet: 'text-3xl',
    desktop: 'text-4xl'
  },
  subtitle: {
    mobile: 'text-lg',
    tablet: 'text-xl', 
    desktop: 'text-2xl'
  },
  body: {
    mobile: 'text-base',
    tablet: 'text-lg',
    desktop: 'text-lg'
  },
  caption: {
    mobile: 'text-sm',
    tablet: 'text-sm',
    desktop: 'text-base'
  }
}

/**
 * Progress indicator responsive configurations
 */
export const progressResponsive = {
  dots: {
    mobile: { size: 'w-2.5 h-2.5', spacing: 'space-x-2' },
    tablet: { size: 'w-3 h-3', spacing: 'space-x-2' },
    desktop: { size: 'w-3 h-3', spacing: 'space-x-3' }
  },
  bar: {
    mobile: { height: 'h-2', padding: 'px-1' },
    tablet: { height: 'h-3', padding: 'px-2' },
    desktop: { height: 'h-3', padding: 'px-2' }
  },
  steps: {
    mobile: { size: 'w-8 h-8', text: 'text-xs' },
    tablet: { size: 'w-10 h-10', text: 'text-sm' },
    desktop: { size: 'w-10 h-10', text: 'text-sm' }
  }
}

/**
 * Option button responsive styling
 */
export const optionResponsive = {
  mobile: {
    padding: 'p-4',
    spacing: 'space-x-3',
    iconSize: 'w-8 h-8',
    textSize: 'text-base',
    descriptionSize: 'text-sm'
  },
  tablet: {
    padding: 'p-5',
    spacing: 'space-x-4',
    iconSize: 'w-9 h-9',
    textSize: 'text-lg',
    descriptionSize: 'text-base'
  },
  desktop: {
    padding: 'p-6',
    spacing: 'space-x-4',
    iconSize: 'w-10 h-10',
    textSize: 'text-lg',
    descriptionSize: 'text-base'
  }
}

/**
 * Navigation responsive configurations
 */
export const navigationResponsive = {
  mobile: {
    buttonSize: 'px-4 py-2 text-sm',
    spacing: 'space-x-2',
    alignment: 'justify-between'
  },
  tablet: {
    buttonSize: 'px-5 py-2.5 text-base',
    spacing: 'space-x-3',
    alignment: 'justify-between'
  },
  desktop: {
    buttonSize: 'px-6 py-3 text-base',
    spacing: 'space-x-4',
    alignment: 'justify-between'
  }
}

/**
 * Get responsive class names based on current breakpoint
 */
export function getResponsiveClasses(
  config: Record<string, string>,
  currentBreakpoint: Breakpoint
): string {
  if (currentBreakpoint === '2xl' || currentBreakpoint === 'xl' || currentBreakpoint === 'lg') {
    return config.desktop || config.tablet || config.mobile || ''
  }
  if (currentBreakpoint === 'md') {
    return config.tablet || config.mobile || ''
  }
  return config.mobile || ''
}

/**
 * Touch-friendly interaction utilities
 */
export const touchOptimizations = {
  tapTarget: 'min-h-[44px] min-w-[44px]', // Apple's recommended minimum
  spacing: 'space-y-2', // Adequate spacing for touch
  feedback: {
    hover: 'hover:bg-gray-50 active:bg-gray-100',
    scale: 'active:scale-95 transition-transform duration-150'
  }
}

/**
 * Accessibility improvements for mobile
 */
export const a11yMobile = {
  focusVisible: 'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
  screenReader: 'sr-only sm:not-sr-only', // Hide on mobile, show on larger screens
  contrast: 'text-gray-900 bg-white border-gray-300', // High contrast for readability
  motionReduce: 'motion-reduce:transition-none motion-reduce:transform-none'
}

/**
 * Performance optimizations for mobile
 */
export const performanceOptimizations = {
  willChange: 'will-change-transform',
  backfaceVisibility: 'backface-visibility-hidden',
  perspective: 'perspective-1000',
  gpu: 'transform-gpu'
}

/**
 * Custom hook for detecting touch devices
 */
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouch()
    window.addEventListener('touchstart', checkTouch, { once: true })

    return () => {
      window.removeEventListener('touchstart', checkTouch)
    }
  }, [])

  return isTouch
}

/**
 * Responsive grid configurations for question layouts
 */
export const gridResponsive = {
  options: {
    mobile: 'grid-cols-1',
    tablet: 'grid-cols-1',
    desktop: 'grid-cols-1' // Keep single column for better UX
  },
  progress: {
    mobile: 'grid-cols-6',
    tablet: 'grid-cols-6', 
    desktop: 'grid-cols-6'
  }
}

/**
 * Safe area utilities for mobile devices with notches
 */
export const safeArea = {
  top: 'pt-safe-top',
  bottom: 'pb-safe-bottom',
  left: 'pl-safe-left',
  right: 'pr-safe-right',
  full: 'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right'
}

export default {
  useResponsive,
  useTouch,
  getResponsiveAnimationVariants,
  getResponsiveClasses,
  responsiveSpacing,
  responsiveText,
  progressResponsive,
  optionResponsive,
  navigationResponsive,
  touchOptimizations,
  a11yMobile,
  performanceOptimizations,
  gridResponsive,
  safeArea,
  BREAKPOINTS
}