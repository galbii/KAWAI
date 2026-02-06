'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { X } from 'lucide-react'

// Hook to detect mobile screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    // Check on mount
    checkMobile()

    // Listen for resize
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

interface BottomLeftPopupBlockProps {
  enabled?: boolean | null
  icon?: string | Media | null
  featuredImage?: string | Media | null
  featuredImageHeight?: 'small' | 'medium' | 'large' | 'tall' | null
  title?: string | null
  message?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  ctaOpenInNewTab?: boolean | null
  theme?: 'light' | 'dark' | 'red' | 'gold' | null
  position?: 'bottom-left' | 'bottom-right' | null
  size?: 'compact' | 'medium' | 'large' | null
  autoShowDelay?: number | null
  autoDismissDelay?: number | null
  showOncePerSession?: boolean | null
  dismissible?: boolean | null
  animationStyle?: 'slide' | 'fade' | 'bounce' | 'scale' | null
  customStorageKey?: string | null
  zIndex?: number | null
}

type PopupState = 'hidden' | 'entering' | 'visible' | 'exiting' | 'dismissed'

const DEFAULT_STORAGE_KEY = 'kawai-bottom-popup-shown'

/**
 * BottomLeftPopupBlock - Japanese minimalist notification popup
 *
 * Design inspired by Japanese 行灯 (andon) paper lanterns and 間 (ma - meaningful space).
 * Features glassmorphism, refined animations, and haptic spring physics.
 *
 * Features:
 * - Customizable content (icon, title, message, CTA)
 * - Multiple animation styles (slide, fade, bounce, scale)
 * - Auto-show and auto-dismiss timing
 * - Session-based persistence
 * - Accessibility-friendly with ARIA labels and keyboard support
 * - Japanese-inspired refined glassmorphism
 * - Mobile-optimized: Displays as centered dialog on mobile, corner popup on desktop
 */
export function BottomLeftPopupBlock({
  enabled = true,
  icon,
  featuredImage,
  featuredImageHeight = 'medium',
  title = 'Announcement',
  message = 'Explore our latest collection...',
  ctaText,
  ctaLink,
  ctaOpenInNewTab = false,
  theme = 'light',
  position = 'bottom-left',
  size = 'medium',
  autoShowDelay = 3000,
  autoDismissDelay = 0,
  showOncePerSession = true,
  dismissible = true,
  animationStyle = 'slide',
  customStorageKey,
  zIndex = 9000,
}: BottomLeftPopupBlockProps) {
  const [state, setState] = useState<PopupState>('hidden')
  const [shouldRender, setShouldRender] = useState(true)
  const isMobile = useIsMobile()

  const storageKey = customStorageKey || DEFAULT_STORAGE_KEY

  const handleDismiss = useCallback(() => {
    if (!dismissible || state === 'dismissed' || state === 'exiting') return

    setState('exiting')
    setTimeout(() => {
      setState('dismissed')
      setShouldRender(false)

      // Mark as shown in session storage
      if (showOncePerSession && typeof window !== 'undefined') {
        sessionStorage.setItem(storageKey, 'true')
      }
    }, 400) // Exit animation duration
  }, [dismissible, state, showOncePerSession, storageKey])

  useEffect(() => {
    // Check if disabled or already shown this session
    if (!enabled) {
      setShouldRender(false)
      return
    }

    if (showOncePerSession && typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem(storageKey)
      if (hasShown) {
        setShouldRender(false)
        return
      }
    }

    // Auto-show timer
    const showTimer = setTimeout(() => {
      setState('entering')
      setTimeout(() => setState('visible'), 50)
    }, autoShowDelay ?? 3000)

    return () => clearTimeout(showTimer)
  }, [enabled, autoShowDelay, showOncePerSession, storageKey])

  useEffect(() => {
    // Auto-dismiss timer
    if (state === 'visible' && autoDismissDelay && autoDismissDelay > 0) {
      const dismissTimer = setTimeout(() => {
        handleDismiss()
      }, autoDismissDelay)

      return () => clearTimeout(dismissTimer)
    }
    return undefined
  }, [state, autoDismissDelay, handleDismiss])

  // Keyboard accessibility - dismiss on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state === 'visible') {
        handleDismiss()
      }
    }

    if (state === 'visible') {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    return undefined
  }, [state, handleDismiss])

  // Don't render if disabled or dismissed
  if (!shouldRender || state === 'dismissed') {
    return null
  }

  // Get icon URL
  const iconUrl = typeof icon === 'object' && icon !== null && 'url' in icon ? icon.url : null

  // Get featured image URL and alt text
  const featuredImageUrl =
    typeof featuredImage === 'object' && featuredImage !== null && 'url' in featuredImage
      ? featuredImage.url
      : null
  const featuredImageAlt =
    typeof featuredImage === 'object' && featuredImage !== null && 'alt' in featuredImage
      ? featuredImage.alt
      : ''

  // Featured image height classes
  const imageHeightClasses = {
    small: 'h-40',    // 160px
    medium: 'h-60',   // 240px
    large: 'h-80',    // 320px
    tall: 'h-[400px]', // 400px
  }

  // Size classes - mobile uses responsive widths, desktop uses fixed
  const sizeClasses = {
    compact: isMobile ? 'w-[calc(100vw-2rem)] max-w-[320px]' : 'w-[280px]',
    medium: isMobile ? 'w-[calc(100vw-2rem)] max-w-[380px]' : 'w-[360px]',
    large: isMobile ? 'w-[calc(100vw-2rem)] max-w-[440px]' : 'w-[420px]',
  }

  // Position classes - mobile is centered, desktop is corner
  const positionClasses = {
    'bottom-left': isMobile ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'bottom-6 left-6',
    'bottom-right': isMobile ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'bottom-6 right-6',
  }

  // Theme styles (glassmorphism with Japanese refinement)
  const themeStyles = {
    light: {
      bg: 'bg-white/80',
      border: 'border-neutral-200/40',
      text: 'text-neutral-900',
      subtext: 'text-neutral-600',
      shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.08),0_2px_8px_rgb(0,0,0,0.04)]',
      backdrop: 'backdrop-blur-xl',
      accent: 'bg-kawai-red hover:bg-kawai-red/90',
      accentText: 'text-white',
    },
    dark: {
      bg: 'bg-neutral-900/85',
      border: 'border-neutral-700/40',
      text: 'text-white',
      subtext: 'text-neutral-300',
      shadow: 'shadow-[0_8px_40px_rgb(0,0,0,0.35),0_2px_12px_rgb(0,0,0,0.2)]',
      backdrop: 'backdrop-blur-xl',
      accent: 'bg-white hover:bg-neutral-100',
      accentText: 'text-neutral-900',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50/90 to-red-100/80',
      border: 'border-red-200/50',
      text: 'text-neutral-900',
      subtext: 'text-red-900/70',
      shadow: 'shadow-[0_8px_30px_rgb(127,29,29,0.15),0_2px_8px_rgb(127,29,29,0.08)]',
      backdrop: 'backdrop-blur-xl',
      accent: 'bg-kawai-red hover:bg-kawai-red/90',
      accentText: 'text-white',
    },
    gold: {
      bg: 'bg-gradient-to-br from-amber-50/90 to-yellow-100/80',
      border: 'border-amber-200/50',
      text: 'text-neutral-900',
      subtext: 'text-amber-900/70',
      shadow: 'shadow-[0_8px_30px_rgb(120,53,15,0.15),0_2px_8px_rgb(120,53,15,0.08)]',
      backdrop: 'backdrop-blur-xl',
      accent: 'bg-kawai-gold hover:bg-kawai-gold/90',
      accentText: 'text-neutral-900',
    },
  }

  const currentTheme = themeStyles[theme ?? 'light']

  // Animation transform based on state, style, and device
  const getTransform = () => {
    // Mobile: Always use centered fade/scale animations
    if (isMobile) {
      if (state === 'hidden') {
        return 'scale(0.92) translateY(10px)'
      }
      if (state === 'entering' || state === 'visible') {
        return 'scale(1) translateY(0)'
      }
      if (state === 'exiting') {
        return 'scale(0.92) translateY(10px)'
      }
      return 'scale(1) translateY(0)'
    }

    // Desktop: Use position-aware animations
    const isLeft = position === 'bottom-left'

    if (state === 'hidden') {
      switch (animationStyle) {
        case 'slide':
          return isLeft ? 'translateX(-120%)' : 'translateX(120%)'
        case 'fade':
          return 'translateY(0)'
        case 'bounce':
          return isLeft ? 'translateX(-120%)' : 'translateX(120%)'
        case 'scale':
          return 'scale(0.85)'
        default:
          return isLeft ? 'translateX(-120%)' : 'translateX(120%)'
      }
    }

    if (state === 'entering' || state === 'visible') {
      return animationStyle === 'scale' ? 'scale(1)' : 'translateX(0) translateY(0)'
    }

    if (state === 'exiting') {
      switch (animationStyle) {
        case 'slide':
          return 'translateY(120%)'
        case 'fade':
          return 'translateY(20px)'
        case 'bounce':
          return 'translateY(120%)'
        case 'scale':
          return 'scale(0.85)'
        default:
          return 'translateY(120%)'
      }
    }

    return 'translateX(0) translateY(0)'
  }

  const getOpacity = () => {
    if (state === 'hidden') return 0
    if (state === 'entering') return animationStyle === 'fade' ? 0 : 1
    if (state === 'visible') return 1
    if (state === 'exiting') return animationStyle === 'fade' ? 0 : 1
    return 0
  }

  // Animation timing - spring physics for bounce
  const getTransition = () => {
    if (animationStyle === 'bounce') {
      return 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease-in-out'
    }
    if (animationStyle === 'scale') {
      return 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-in-out'
    }
    return 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-in-out'
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobile && (
        <div
          className={cn(
            'fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
            'z-[var(--backdrop-z-index)]'
          )}
          style={
            {
              '--backdrop-z-index': (zIndex ?? 9000) - 1,
              opacity: state === 'entering' || state === 'visible' ? 1 : 0,
              pointerEvents: state === 'entering' || state === 'visible' ? 'auto' : 'none',
            } as React.CSSProperties
          }
          onClick={dismissible ? handleDismiss : undefined}
          aria-hidden="true"
        />
      )}

      {/* Subtle noise texture overlay */}
      <style jsx>{`
        @keyframes grain {
          0%,
          100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-5%, -10%);
          }
          20% {
            transform: translate(-15%, 5%);
          }
          30% {
            transform: translate(7%, -25%);
          }
          40% {
            transform: translate(-5%, 25%);
          }
          50% {
            transform: translate(-15%, 10%);
          }
          60% {
            transform: translate(15%, 0%);
          }
          70% {
            transform: translate(0%, 15%);
          }
          80% {
            transform: translate(3%, 35%);
          }
          90% {
            transform: translate(-10%, 10%);
          }
        }

        .grain-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          animation: grain 8s steps(10) infinite;
          opacity: 0.35;
          border-radius: inherit;
        }
      `}</style>

      <div
        className={cn(
          'fixed z-[var(--popup-z-index)] transition-all duration-300',
          positionClasses[position ?? 'bottom-left'],
          sizeClasses[size ?? 'medium']
        )}
        style={
          {
            '--popup-z-index': zIndex,
            transform: getTransform(),
            opacity: getOpacity(),
            transition: getTransition(),
          } as React.CSSProperties
        }
        role="dialog"
        aria-labelledby="popup-title"
        aria-describedby="popup-message"
        aria-live="polite"
      >
        {/* Main popup container with glassmorphism */}
        <div
          className={cn(
            'grain-texture relative overflow-hidden rounded-2xl border',
            isMobile ? 'p-6' : 'p-5',
            currentTheme.bg,
            currentTheme.border,
            currentTheme.shadow,
            currentTheme.backdrop,
            // Subtle inner shadow for depth
            'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
          )}
        >
          {/* Subtle inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" />

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="relative -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl">
              <Image
                src={featuredImageUrl}
                alt={featuredImageAlt || title || 'Featured image'}
                width={420}
                height={400}
                className={cn('w-full object-cover', imageHeightClasses[featuredImageHeight ?? 'medium'])}
                priority
              />
              {/* Gradient overlay for better text readability */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Dismiss button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={cn(
                'absolute right-3 top-3 rounded-lg p-1.5 transition-all duration-200',
                'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-white/50',
                'text-white',
                'hover:rotate-90'
              )}
              aria-label="Dismiss notification"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}

          {/* Content */}
          <div className="flex gap-4">
            {/* Icon */}
            {iconUrl && (
              <div className="flex-shrink-0">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-white/20 to-white/5 p-2.5 shadow-inner">
                  <Image
                    src={iconUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Text content */}
            <div className="flex-1 space-y-2 pr-6">
              <h3
                id="popup-title"
                className={cn(
                  'font-serif text-lg font-semibold leading-tight tracking-tight',
                  currentTheme.text
                )}
                style={{ fontFamily: "'Noto Serif JP', 'Crimson Text', serif" }}
              >
                {title}
              </h3>
              <p
                id="popup-message"
                className={cn('text-sm leading-relaxed', currentTheme.subtext)}
              >
                {message}
              </p>

              {/* CTA Button */}
              {ctaText && ctaLink && (
                <div className="pt-2">
                  <a
                    href={ctaLink}
                    target={ctaOpenInNewTab ? '_blank' : undefined}
                    rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-offset-2',
                      'shadow-sm hover:shadow-md',
                      currentTheme.accent,
                      currentTheme.accentText
                    )}
                  >
                    {ctaText}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar for auto-dismiss */}
          {(autoDismissDelay ?? 0) > 0 && state === 'visible' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-2xl bg-black/5">
              <div
                className={cn('h-full', currentTheme.accent)}
                style={{
                  animation: `shrink ${autoDismissDelay}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Progress bar animation */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>

      {/* Google Fonts: Noto Serif JP for Japanese refinement */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  )
}
