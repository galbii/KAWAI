'use client'

/**
 * Navigation Context
 *
 * Tracks whether the user entered via a dealer storefront (/store/[slug]) or
 * the main site (/). Used by the header logo, KawaiLogo, and ContextAwareLink
 * to show dealer branding and route the logo home link correctly.
 *
 * Source of truth (in priority order):
 *   1. Current pathname — if on /store/[slug], always use that
 *   2. kawai-dealer-slug cookie — set by middleware on storefront visits,
 *      readable both server-side (cookies()) and client-side (document.cookie)
 *
 * There is no ?origin= URL manipulation and no sessionStorage. Links are plain
 * clean URLs everywhere.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { NavigationOrigin } from '@/lib/navigation-utils'

interface NavigationContextType {
  origin: NavigationOrigin
  isInitialized: boolean
  updateOrigin: (origin: NavigationOrigin) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationContextProviderProps {
  children: ReactNode
  /** Initial origin derived server-side from the cookie (prevents hydration flash). */
  initialOrigin?: NavigationOrigin
}

export function NavigationContextProvider({
  children,
  initialOrigin,
}: NavigationContextProviderProps) {
  const pathname = usePathname()

  const [origin, setOrigin] = useState<NavigationOrigin>(
    initialOrigin ?? { basePath: '/', isDealerLocation: false },
  )
  // Already initialized when the server provided a valid initialOrigin
  const [isInitialized, setIsInitialized] = useState(!!initialOrigin)

  useEffect(() => {
    // Priority 1: currently on a storefront page
    if (pathname.startsWith('/store/')) {
      const slug = pathname.split('/')[2]
      if (slug) {
        setOrigin({ basePath: `/store/${slug}`, isDealerLocation: true, dealerSlug: slug })
        setIsInitialized(true)
        return
      }
    }

    // Priority 2: dealer cookie set by middleware (not httpOnly — readable here)
    const match = document.cookie.match(/(?:^|;\s*)kawai-dealer-slug=([^;]+)/)
    const cookieSlug = match?.[1]
    if (cookieSlug) {
      setOrigin({ basePath: `/store/${cookieSlug}`, isDealerLocation: true, dealerSlug: cookieSlug })
      setIsInitialized(true)
      return
    }

    // No dealer context
    setOrigin({ basePath: '/', isDealerLocation: false })
    setIsInitialized(true)
  }, [pathname]) // pathname is the only dependency — no double-run, no sessionStorage race

  const updateOrigin = (newOrigin: NavigationOrigin) => setOrigin(newOrigin)

  return (
    <NavigationContext.Provider value={{ origin, isInitialized, updateOrigin }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigationContext(): NavigationContextType {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationContextProvider')
  }
  return context
}

export function useContextAwareHomeUrl(): string {
  const { origin } = useNavigationContext()
  return origin.basePath
}

/**
 * Hook for components that need to build URLs or check dealer context.
 * getContextAwareUrl is now a simple pass-through — no ?origin= appended.
 */
export function useContextAwareNavigation() {
  const { origin } = useNavigationContext()

  const getContextAwareUrl = (targetPath: string): string => {
    if (targetPath.startsWith('http') || targetPath.startsWith('//')) return targetPath
    return targetPath.startsWith('/') ? targetPath : `/${targetPath}`
  }

  return {
    origin,
    getContextAwareUrl,
    getHomeUrl: () => origin.basePath,
    getLinkProps: (href: string) => ({ href: getContextAwareUrl(href) }),
  }
}

/**
 * Server-side helper — kept for call-site compatibility in layout.tsx.
 * @deprecated Pass dealerSlug from cookies() directly instead.
 */
export function createInitialNavigationOrigin(pathname: string): NavigationOrigin {
  if (pathname.startsWith('/store/')) {
    const slug = pathname.split('/')[2]
    if (slug) return { basePath: `/store/${slug}`, isDealerLocation: true, dealerSlug: slug }
  }
  return { basePath: '/', isDealerLocation: false }
}
