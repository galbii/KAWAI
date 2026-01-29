'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface BrandIntroBlockProps {
  enabled?: boolean | null
  logo?: string | Media | null
  tagline?: string | null
  backgroundColor?: 'black' | 'kawai-black' | 'kawai-charcoal' | 'white' | null
  logoSize?: 'small' | 'medium' | 'large' | 'xlarge' | null
  timing?: {
    fadeInDuration?: number | null
    displayDuration?: number | null
    fadeOutDuration?: number | null
  } | null
  showOncePerSession?: boolean | null
  allowSkip?: boolean | null
}

type AnimationPhase = 'hidden' | 'fading-in' | 'displaying' | 'fading-out' | 'complete'

const STORAGE_KEY = 'kawai-brand-intro-shown'

/**
 * BrandIntroBlock - Elegant brand intro overlay
 *
 * Shows Kawai logo with "Instrumental to Life" tagline in a full-screen overlay.
 * Sequence: Fade in → Display → Fade out → Reveal page
 *
 * Features:
 * - Configurable timing for each animation phase
 * - Optional session-based showing (only once per session)
 * - Click-to-skip functionality
 * - Body scroll locking during animation
 * - Elegant fade transitions with Japanese minimalism
 */
export function BrandIntroBlock({
  enabled = true,
  logo,
  tagline = 'Instrumental to Life',
  backgroundColor = 'black',
  logoSize = 'large',
  timing,
  showOncePerSession = true,
  allowSkip = true,
}: BrandIntroBlockProps) {
  const [phase, setPhase] = useState<AnimationPhase>('hidden')
  const [shouldRender, setShouldRender] = useState(true)

  // Get timing values with defaults
  const fadeInDuration = timing?.fadeInDuration ?? 800
  const displayDuration = timing?.displayDuration ?? 2000
  const fadeOutDuration = timing?.fadeOutDuration ?? 800

  useEffect(() => {
    // Check if disabled or already shown this session
    if (!enabled) {
      setShouldRender(false)
      return
    }

    if (showOncePerSession && typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem(STORAGE_KEY)
      if (hasShown) {
        setShouldRender(false)
        return
      }
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    // Animation sequence
    const fadeInTimer = setTimeout(() => {
      setPhase('fading-in')
    }, 50) // Small delay to ensure smooth start

    const displayTimer = setTimeout(() => {
      setPhase('displaying')
    }, 50 + fadeInDuration)

    const fadeOutTimer = setTimeout(() => {
      setPhase('fading-out')
    }, 50 + fadeInDuration + displayDuration)

    const completeTimer = setTimeout(() => {
      setPhase('complete')
      document.body.style.overflow = ''
      setShouldRender(false)

      // Mark as shown in session storage
      if (showOncePerSession && typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, 'true')
      }
    }, 50 + fadeInDuration + displayDuration + fadeOutDuration)

    return () => {
      clearTimeout(fadeInTimer)
      clearTimeout(displayTimer)
      clearTimeout(fadeOutTimer)
      clearTimeout(completeTimer)
      document.body.style.overflow = ''
    }
  }, [enabled, fadeInDuration, displayDuration, fadeOutDuration, showOncePerSession])

  // Handle skip on click
  const handleSkip = () => {
    if (!allowSkip || phase === 'complete') return

    setPhase('fading-out')
    setTimeout(() => {
      setPhase('complete')
      document.body.style.overflow = ''
      setShouldRender(false)

      if (showOncePerSession && typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, 'true')
      }
    }, fadeOutDuration)
  }

  // Don't render if disabled or already shown
  if (!shouldRender || phase === 'complete') {
    return null
  }

  // Get logo URL
  const logoUrl = typeof logo === 'object' && logo !== null && 'url' in logo ? logo.url : null

  // Logo size classes
  const logoSizeClasses = {
    small: 'h-16 w-auto md:h-20',
    medium: 'h-24 w-auto md:h-32',
    large: 'h-32 w-auto md:h-40',
    xlarge: 'h-40 w-auto md:h-56',
  }

  // Background color classes
  const bgColorClasses = {
    black: 'bg-black',
    'kawai-black': 'bg-kawai-black',
    'kawai-charcoal': 'bg-kawai-charcoal',
    white: 'bg-white',
  }

  const textColorClasses = {
    black: 'text-white',
    'kawai-black': 'text-white',
    'kawai-charcoal': 'text-white',
    white: 'text-kawai-black',
  }

  // Calculate opacity based on phase
  const getOpacity = () => {
    switch (phase) {
      case 'hidden':
        return 1 // Overlay starts fully opaque
      case 'fading-in':
      case 'displaying':
        return 1 // Keep overlay opaque
      case 'fading-out':
        return 0 // Fade overlay to transparent
      default:
        return 0
    }
  }

  // Calculate content opacity
  const getContentOpacity = () => {
    switch (phase) {
      case 'hidden':
        return 0 // Content starts invisible
      case 'fading-in':
        return 1 // Fade content in
      case 'displaying':
        return 1 // Content fully visible
      case 'fading-out':
        return 0 // Fade content out
      default:
        return 0
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center',
        bgColorClasses[backgroundColor ?? 'black'],
        allowSkip && 'cursor-pointer'
      )}
      style={{
        opacity: getOpacity(),
        transition: `opacity ${phase === 'fading-out' ? fadeOutDuration : 0}ms ease-in-out`,
      }}
      onClick={handleSkip}
      role="presentation"
    >
      <div
        className="flex flex-col items-center gap-6 px-8"
        style={{
          opacity: getContentOpacity(),
          transition: `opacity ${
            phase === 'fading-in' ? fadeInDuration : phase === 'fading-out' ? fadeOutDuration : 0
          }ms ease-in-out`,
          transform:
            phase === 'fading-in' || phase === 'displaying'
              ? 'translateY(0) scale(1)'
              : 'translateY(10px) scale(0.98)',
          transitionProperty: 'opacity, transform',
        }}
      >
        {/* Logo */}
        {logoUrl ? (
          <div className={cn('relative', logoSizeClasses[logoSize ?? 'large'])}>
            <Image
              src={logoUrl}
              alt="Kawai Piano"
              width={400}
              height={200}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        ) : (
          // Default Kawai text logo if no image provided
          <div
            className={cn(
              'font-serif text-6xl font-bold tracking-wider md:text-7xl lg:text-8xl',
              textColorClasses[backgroundColor ?? 'black']
            )}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            KAWAI
          </div>
        )}

        {/* Tagline */}
        {tagline && (
          <div
            className={cn(
              'font-sans text-sm uppercase tracking-[0.3em] md:text-base',
              textColorClasses[backgroundColor ?? 'black'],
              backgroundColor === 'white' ? 'opacity-60' : 'opacity-70'
            )}
          >
            {tagline}
          </div>
        )}

        {/* Skip hint (subtle) */}
        {allowSkip && (phase === 'displaying' || phase === 'fading-in') && (
          <div
            className={cn(
              'absolute bottom-8 font-sans text-xs uppercase tracking-widest',
              textColorClasses[backgroundColor ?? 'black'],
              'opacity-30 transition-opacity duration-300 hover:opacity-50'
            )}
          >
            Click to skip
          </div>
        )}
      </div>

      {/* Google Fonts Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  )
}
