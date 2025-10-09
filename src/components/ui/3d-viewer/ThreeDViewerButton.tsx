'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ThreeDViewerButtonProps } from './types'

/**
 * 3D icon SVG (encoded as data URI for inline rendering)
 * This is the same icon from the original WordPress implementation
 */
const THREED_ICON_SVG = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='white' xmlns:v='https://vecta.io/nano'%3e%3cpath d='M12 23c-1.52 0-2.95-.29-4.29-.87s-2.5-1.36-3.49-2.35-1.77-2.15-2.35-3.49S1 13.52 1 12h1.74c0 2.32.75 4.34 2.26 6.07a9.04 9.04 0 0 0 5.7 3.09l-1.75-1.75 1.22-1.22 4.44 4.44c-.43.13-.86.23-1.3.28-.44.06-.88.08-1.32.08zm.76-7.7V8.71h3.34c.33 0 .6.11.83.33a1.13 1.13 0 0 1 .33.83v4.28c0 .33-.11.6-.33.83a1.13 1.13 0 0 1-.83.33h-3.34zm-6.02 0v-1.38h3.12v-1.4H7.9V11.5h1.96v-1.4H6.74V8.72h3.52a.94.94 0 0 1 .98.98v4.63a.94.94 0 0 1-.98.98H6.74zm7.4-1.39h1.6s.08-.01.1-.03.03-.06.03-.1v-3.56s-.01-.08-.03-.1-.06-.03-.1-.03h-1.6v3.83zM21.26 12c0-2.32-.75-4.34-2.26-6.07a9.04 9.04 0 0 0-5.7-3.09l1.75 1.75-1.22 1.22-4.44-4.44c.43-.13.86-.23 1.3-.28a11.69 11.69 0 0 1 1.32-.08c1.52 0 2.95.29 4.29.87s2.5 1.36 3.49 2.35 1.77 2.15 2.35 3.49.87 2.77.87 4.29h-1.74z'/%3e%3c/svg%3e`

/**
 * ThreeDViewerButton - Floating button to open 3D viewer
 *
 * Features:
 * - Fixed position (bottom-left by default)
 * - Fade-in animation on mount
 * - Hover effects
 * - GTM tracking on click
 * - Accessible with ARIA labels
 * - Custom icon (3D rotation arrows)
 *
 * @example
 * ```tsx
 * <ThreeDViewerButton
 *   onClick={() => setIsOpen(true)}
 *   text="View the GL-10 in 3D"
 *   productName="GL-10 Grand Piano"
 * />
 * ```
 */
export function ThreeDViewerButton({
  onClick,
  text = 'View in 3D',
  productName,
  className,
  visible = true
}: ThreeDViewerButtonProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Trigger fade-in animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Track GTM event on click
  const handleClick = () => {
    // Fire GTM event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: '3D Viewer',
        event_label: `${productName}_VIEWIN3D_BUTTON`,
        product_name: productName
      })
    }

    onClick()
  }

  if (!visible) return null

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isMounted ? 1 : 0,
        y: isMounted ? 0 : 20
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut'
      }}
      onClick={handleClick}
      className={cn(
        // Positioning
        'fixed bottom-5 left-5 z-[999]',
        // Layout & Styling
        'flex items-center gap-3 px-5 py-3 rounded-lg',
        'bg-blue-600 hover:bg-blue-700 text-white',
        'shadow-lg hover:shadow-xl',
        // Typography
        'font-sans text-base font-normal whitespace-nowrap',
        // Transitions
        'transition-all duration-200',
        // Focus state
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        // Custom classes
        className
      )}
      aria-label={`Open 3D viewer for ${productName}`}
      data-gtm-click={`${productName}_VIEWIN3D_BUTTON`}
    >
      {/* 3D Icon */}
      <div
        className="w-6 h-6 flex-shrink-0"
        style={{
          backgroundImage: `url("${THREED_ICON_SVG}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
        aria-hidden="true"
      />

      {/* Button Text */}
      <span>{text}</span>
    </motion.button>
  )
}
