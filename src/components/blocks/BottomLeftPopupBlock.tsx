'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { X } from 'lucide-react'
import { trackCTAClick, trackWithConfig } from '@/lib/analytics/unified-tracking'

interface ExcludePath {
  path?: string | null
}

/**
 * Match the current pathname against the editor-supplied exclude list.
 * Supports exact paths (`/contact`) and trailing wildcards (`/pianos/*`).
 */
function isPathExcluded(pathname: string | null, excludePaths?: ExcludePath[] | null): boolean {
  if (!pathname || !excludePaths?.length) return false
  const norm = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p)
  const path = norm(pathname)
  return excludePaths.some(({ path: raw }) => {
    let pat = raw?.trim()
    if (!pat) return false
    if (!pat.startsWith('/')) pat = '/' + pat
    if (pat.endsWith('/*')) {
      const base = norm(pat.slice(0, -2))
      return path === base || path.startsWith(base + '/')
    }
    if (pat.endsWith('*')) return path.startsWith(pat.slice(0, -1))
    return path === norm(pat)
  })
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
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
  zIndex?: number | null  // Default 9010 — must be above mobile search bar (z-9003)
  showOnAllPages?: boolean | null
  excludePaths?: ExcludePath[] | null
  /**
   * True when rendered by the site-wide GlobalBottomPopup mount. The homepage
   * inline instance (rendered via RenderBlocks) sets this false and bails when
   * showOnAllPages is on, so exactly one popup renders across the site.
   */
  isGlobalMount?: boolean
  tracking?: any
  ctaTracking?: any
}

type PopupState = 'hidden' | 'entering' | 'visible' | 'exiting' | 'dismissed'

const DEFAULT_STORAGE_KEY = 'kawai-bottom-popup-shown'

// Theme tokens — each theme has a complete set of design values
const THEMES = {
  light: {
    bg: '#FAF8F5',
    accentBar: '#E11922',
    titleColor: '#1E1B16',
    messageColor: '#6B7280',
    eyebrowColor: '#E11922',
    divider: 'rgba(30,27,22,0.08)',
    dismissFg: 'rgba(30,27,22,0.35)',
    dismissHoverBg: 'rgba(30,27,22,0.06)',
    ctaBg: '#E11922',
    ctaFg: '#FFFFFF',
    ctaHoverBg: '#c7151c',
    ctaBorderColor: 'transparent',
    shadow: '0 24px 64px rgba(0,0,0,0.10), 0 6px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
  },
  dark: {
    bg: '#1E1B16',
    accentBar: '#d5c78c',
    titleColor: '#FFFFFF',
    messageColor: '#9CA3AF',
    eyebrowColor: '#d5c78c',
    divider: 'rgba(255,255,255,0.08)',
    dismissFg: 'rgba(255,255,255,0.38)',
    dismissHoverBg: 'rgba(255,255,255,0.08)',
    ctaBg: 'transparent',
    ctaFg: '#FFFFFF',
    ctaHoverBg: 'rgba(255,255,255,0.08)',
    ctaBorderColor: 'rgba(255,255,255,0.24)',
    shadow: '0 24px 64px rgba(0,0,0,0.50), 0 6px 20px rgba(0,0,0,0.30), 0 1px 4px rgba(0,0,0,0.20)',
  },
  red: {
    bg: '#E11922',
    accentBar: 'rgba(255,255,255,0.25)',
    titleColor: '#FFFFFF',
    messageColor: 'rgba(255,255,255,0.72)',
    eyebrowColor: 'rgba(255,255,255,0.55)',
    divider: 'rgba(255,255,255,0.14)',
    dismissFg: 'rgba(255,255,255,0.55)',
    dismissHoverBg: 'rgba(255,255,255,0.12)',
    ctaBg: '#FFFFFF',
    ctaFg: '#E11922',
    ctaHoverBg: '#F5F5F5',
    ctaBorderColor: 'transparent',
    shadow: '0 24px 64px rgba(225,25,34,0.38), 0 6px 20px rgba(225,25,34,0.22), 0 1px 4px rgba(0,0,0,0.10)',
  },
  gold: {
    bg: '#F4EFE2',
    accentBar: '#d5c78c',
    titleColor: '#1E1B16',
    messageColor: '#6B7280',
    eyebrowColor: '#9A7E42',
    divider: 'rgba(213,199,140,0.45)',
    dismissFg: 'rgba(30,27,22,0.32)',
    dismissHoverBg: 'rgba(30,27,22,0.06)',
    ctaBg: '#1E1B16',
    ctaFg: '#FFFFFF',
    ctaHoverBg: '#2C2C2C',
    ctaBorderColor: 'transparent',
    shadow: '0 24px 64px rgba(0,0,0,0.09), 0 6px 20px rgba(213,199,140,0.30), 0 1px 4px rgba(0,0,0,0.04)',
  },
} as const

const IMG_HEIGHTS = { small: 140, medium: 192, large: 256, tall: 320 } as const
const DESKTOP_WIDTHS = { compact: '276px', medium: '316px', large: '356px' } as const

export function BottomLeftPopupBlock({
  enabled = true,
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
  zIndex = 9010,
  showOnAllPages = false,
  excludePaths,
  isGlobalMount = false,
  tracking,
  ctaTracking,
}: BottomLeftPopupBlockProps) {
  const [state, setState] = useState<PopupState>('hidden')
  const [shouldRender, setShouldRender] = useState(true)
  const isMobile = useIsMobile()
  const pathname = usePathname()

  // A single popup instance should render across the site:
  // - When showOnAllPages is on, only the global mount renders (the homepage
  //   inline instance defers to it).
  // - When it's off, only the inline instance renders (the global mount is null).
  // - Never on an excluded path.
  const active =
    enabled !== false &&
    (showOnAllPages ? isGlobalMount : !isGlobalMount) &&
    !isPathExcluded(pathname, excludePaths)

  const storageKey = customStorageKey || DEFAULT_STORAGE_KEY

  const handleDismiss = useCallback(() => {
    if (!dismissible || state === 'dismissed' || state === 'exiting') return

    trackWithConfig({
      blockType: 'layout-bottom-left-popup',
      blockData: { tracking: tracking as any },
      action: 'engagement',
      label: 'popup_dismissed',
      additionalProps: { theme, position },
    })

    setState('exiting')
    setTimeout(() => {
      setState('dismissed')
      setShouldRender(false)
      if (showOncePerSession && typeof window !== 'undefined') {
        sessionStorage.setItem(storageKey, 'true')
      }
    }, 350)
  }, [dismissible, state, showOncePerSession, storageKey, theme, position, tracking])

  useEffect(() => {
    if (!active) { setShouldRender(false); return }
    if (showOncePerSession && typeof window !== 'undefined') {
      if (sessionStorage.getItem(storageKey)) { setShouldRender(false); return }
    }
    setShouldRender(true)
    const timer = setTimeout(() => {
      setState('entering')
      setTimeout(() => {
        setState('visible')
        trackWithConfig({
          blockType: 'layout-bottom-left-popup',
          blockData: { tracking: tracking as any },
          action: 'impression',
          label: title || 'Bottom Popup',
          additionalProps: { theme, position, auto_show_delay: autoShowDelay },
        })
      }, 50)
    }, autoShowDelay ?? 3000)
    return () => clearTimeout(timer)
  }, [active, autoShowDelay, showOncePerSession, storageKey])

  useEffect(() => {
    if (state === 'visible' && autoDismissDelay && autoDismissDelay > 0) {
      const timer = setTimeout(handleDismiss, autoDismissDelay)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [state, autoDismissDelay, handleDismiss])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state === 'visible') handleDismiss()
    }
    if (state === 'visible') {
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
    return undefined
  }, [state, handleDismiss])

  if (!active || !shouldRender || state === 'dismissed') return null

  const featuredMedia =
    typeof featuredImage === 'object' && featuredImage !== null ? (featuredImage as Media) : null
  const featuredImageUrl = featuredMedia?.url ?? null
  const featuredImageAlt = featuredMedia?.alt ?? ''
  const featuredIsVideo = Boolean(featuredMedia?.mimeType?.startsWith('video'))

  // Ensure popup is above mobile floating search bar (z-9003)
  const resolvedZIndex = Math.max(zIndex ?? 9010, 9010)
  const t = THEMES[theme ?? 'light']
  const isVisible = state === 'entering' || state === 'visible'
  const isExiting = state === 'exiting'
  const imgH = IMG_HEIGHTS[featuredImageHeight ?? 'medium']

  // Animation — mobile slides up from below, desktop fades + lifts from below
  const enterEase = 'cubic-bezier(0.16, 1, 0.3, 1)'
  const exitEase = 'cubic-bezier(0.4, 0, 1, 1)'

  const popupTransform = isMobile
    ? isVisible ? 'translateY(0)' : 'translateY(108%)'
    : isVisible ? 'translateY(0)' : 'translateY(14px)'

  const popupOpacity = isMobile ? 1 : isVisible ? 1 : 0

  const popupTransition = isMobile
    ? `transform ${isExiting ? `0.28s ${exitEase}` : `0.44s ${enterEase}`}`
    : `transform ${isExiting ? `0.24s ${exitEase}` : `0.38s ${enterEase}`}, opacity ${isExiting ? '0.20s ease' : '0.32s ease'}`

  const scrimOpacity = isVisible ? 1 : 0
  const scrimTransition = isExiting ? `opacity 0.24s ease` : `opacity 0.38s ease`

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.52)',
            zIndex: resolvedZIndex - 1,
            opacity: scrimOpacity,
            pointerEvents: isVisible ? 'auto' : 'none',
            transition: scrimTransition,
          }}
          onClick={dismissible ? handleDismiss : undefined}
          aria-hidden="true"
        />
      )}

      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          zIndex: resolvedZIndex,
          ...(isMobile
            ? { bottom: 0, left: 0, right: 0 }
            : position === 'bottom-right'
              ? { bottom: 24, right: 24, width: DESKTOP_WIDTHS[size ?? 'medium'] }
              : { bottom: 24, left: 24, width: DESKTOP_WIDTHS[size ?? 'medium'] }),
          transform: popupTransform,
          opacity: popupOpacity,
          transition: popupTransition,
        }}
        role="dialog"
        aria-labelledby="kawai-popup-title"
        aria-describedby="kawai-popup-message"
        aria-live="polite"
      >
        <div
          style={{
            background: t.bg,
            borderRadius: isMobile ? '20px 20px 0 0' : '10px',
            boxShadow: t.shadow,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Accent bar — the brand signature line */}
          <div style={{ height: 3, background: t.accentBar }} />

          {/* Featured image or video */}
          {featuredImageUrl && (
            <div style={{ position: 'relative', width: '100%', height: imgH, flexShrink: 0 }}>
              {featuredIsVideo ? (
                <video
                  src={featuredImageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={featuredImageAlt || title || undefined}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Image
                  src={featuredImageUrl}
                  alt={featuredImageAlt || title || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              )}
              {/* Bottom vignette so title reads cleanly below */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.18) 100%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          )}

          {/* Mobile drag handle */}
          {isMobile && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: featuredImageUrl ? 14 : 14,
                paddingBottom: 2,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: theme === 'dark' || theme === 'red'
                    ? 'rgba(255,255,255,0.20)'
                    : 'rgba(0,0,0,0.14)',
                }}
              />
            </div>
          )}

          {/* Dismiss button — overlays the top-right of the image when present
              (frosted circle so it reads over any photo); otherwise sits subtly
              in the card's top-right corner. */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="kawai-popup-dismiss"
              style={{
                position: 'absolute',
                top: featuredImageUrl ? (isMobile ? 16 : 13) : isMobile ? 22 : 14,
                right: featuredImageUrl ? (isMobile ? 16 : 13) : isMobile ? 20 : 14,
                width: featuredImageUrl ? 30 : 28,
                height: featuredImageUrl ? 30 : 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: featuredImageUrl ? '50%' : 6,
                border: 'none',
                background: featuredImageUrl ? 'rgba(0,0,0,0.40)' : 'transparent',
                backdropFilter: featuredImageUrl ? 'blur(6px)' : undefined,
                WebkitBackdropFilter: featuredImageUrl ? 'blur(6px)' : undefined,
                cursor: 'pointer',
                color: featuredImageUrl ? 'rgba(255,255,255,0.92)' : t.dismissFg,
                transition: 'background 0.15s ease, color 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = featuredImageUrl ? 'rgba(0,0,0,0.60)' : t.dismissHoverBg
                el.style.color = featuredImageUrl ? '#FFFFFF' : t.titleColor
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = featuredImageUrl ? 'rgba(0,0,0,0.40)' : 'transparent'
                el.style.color = featuredImageUrl ? 'rgba(255,255,255,0.92)' : t.dismissFg
              }}
              aria-label="Dismiss"
            >
              <X size={featuredImageUrl ? 15 : 13} strokeWidth={2.2} />
            </button>
          )}

          {/* Content */}
          <div
            style={{
              padding: isMobile ? '20px 24px 36px' : '20px 20px 22px',
            }}
          >
            {/* Title */}
            <h3
              id="kawai-popup-title"
              style={{
                fontFamily: 'var(--font-brand-luxury, Georgia, serif)',
                fontSize: isMobile ? 21 : 18,
                fontWeight: 600,
                lineHeight: 1.28,
                color: t.titleColor,
                margin: '0 0 9px',
                paddingRight: dismissible ? 18 : 0,
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>

            {/* Message */}
            {message && (
              <p
                id="kawai-popup-message"
                style={{
                  fontFamily: 'var(--font-brand-sans, system-ui)',
                  fontSize: 13,
                  lineHeight: 1.62,
                  color: t.messageColor,
                  margin: '0 0 18px',
                  fontWeight: 400,
                }}
              >
                {message}
              </p>
            )}

            {/* CTA */}
            {ctaText && ctaLink && (
              <a
                href={ctaLink}
                target={ctaOpenInNewTab ? '_blank' : undefined}
                rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  trackCTAClick({
                    blockType: 'layout-bottom-left-popup',
                    blockData: { ctaTracking: ctaTracking as any },
                    ctaText: ctaText || '',
                    destination: ctaLink || '',
                    additionalProps: { theme, position, size },
                  })
                }}
                style={{
                  display: 'block',
                  textAlign: 'center' as const,
                  padding: isMobile ? '13px 20px' : '11px 20px',
                  background: t.ctaBg,
                  color: t.ctaFg,
                  border: `1px solid ${t.ctaBorderColor}`,
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: 'var(--font-brand-sans, system-ui)',
                  fontWeight: 600,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase' as const,
                  textDecoration: 'none',
                  transition: 'background 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = t.ctaHoverBg
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLAnchorElement).style.background = t.ctaBg
                }}
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Auto-dismiss progress bar */}
          {(autoDismissDelay ?? 0) > 0 && state === 'visible' && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: t.accentBar,
                  animation: `kawai-popup-shrink ${autoDismissDelay}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kawai-popup-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      ` }} />
    </>
  )
}
