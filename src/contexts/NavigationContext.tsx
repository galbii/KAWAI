'use client'

/**
 * Navigation Context
 * 
 * Provides navigation origin context throughout the application to maintain
 * user's entry point (main site vs dealer location) across page navigation.
 * 
 * This context tracks whether users entered through:
 * - Main homepage (/)
 * - Dealer location page (/st-louis, /dallas, etc.)
 * 
 * The logo and navigation links use this context to return users to their
 * original entry point rather than always going to the main homepage.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { parseNavigationOrigin, NavigationOrigin } from '@/lib/navigation-utils'

interface NavigationContextType {
  /** Current navigation origin */
  origin: NavigationOrigin
  /** Whether the context has been initialized (for hydration) */
  isInitialized: boolean
  /** Update the navigation origin (for programmatic changes) */
  updateOrigin: (origin: NavigationOrigin) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationContextProviderProps {
  children: ReactNode
  /** Initial origin (for SSR) */
  initialOrigin?: NavigationOrigin
}

/**
 * Provides navigation context throughout the application
 * 
 * Automatically detects user's origin based on:
 * 1. URL search parameter `?origin=/dealer-slug`
 * 2. Current pathname analysis
 * 3. Session storage (for client-side persistence)
 */
export function NavigationContextProvider({ 
  children, 
  initialOrigin 
}: NavigationContextProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [origin, setOrigin] = useState<NavigationOrigin>(
    initialOrigin || {
      basePath: '/',
      isDealerLocation: false
    }
  )
  const [isInitialized, setIsInitialized] = useState(false)

  // Update origin when pathname or search params change
  useEffect(() => {
    const newOrigin = parseNavigationOrigin(pathname, searchParams)
    
    // PRIORITY 1: URL parameters (especially ?origin=/dealer-slug)
    const originParam = searchParams?.get('origin')
    if (originParam) {
      // URL has explicit origin parameter - always use this
      console.log('[NavigationContext] Using URL origin parameter:', { 
        originParam, 
        newOrigin, 
        pathname, 
        searchParams: searchParams?.toString() 
      })
      setOrigin(newOrigin)
      setIsInitialized(true)
      return
    }
    
    // PRIORITY 2: Session storage for persisted origin (only if no URL param)
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedOrigin = sessionStorage.getItem('kawai-navigation-origin')
        if (savedOrigin) {
          const parsedOrigin = JSON.parse(savedOrigin) as NavigationOrigin
          
          // Only use saved origin if we're on a neutral page (like product pages)
          // and the URL doesn't explicitly indicate a different context
          if (newOrigin.basePath === '/' && parsedOrigin.isDealerLocation) {
            console.log('[NavigationContext] Using saved origin from session storage:', { 
              parsedOrigin, 
              newOrigin, 
              pathname 
            })
            setOrigin(parsedOrigin)
            setIsInitialized(true)
            return
          }
        }
      } catch (error) {
        console.warn('Failed to parse saved navigation origin:', error)
      }
    }
    
    // PRIORITY 3: Parse from current URL structure
    console.log('[NavigationContext] Using parsed origin from URL structure:', { 
      newOrigin, 
      pathname, 
      searchParams: searchParams?.toString() 
    })
    setOrigin(newOrigin)
    setIsInitialized(true)
  }, [pathname, searchParams, isInitialized])

  // Persist origin to session storage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        sessionStorage.setItem('kawai-navigation-origin', JSON.stringify(origin))
      } catch (error) {
        console.warn('Failed to save navigation origin:', error)
      }
    }
  }, [origin, isInitialized])

  const updateOrigin = (newOrigin: NavigationOrigin) => {
    setOrigin(newOrigin)
  }

  const contextValue: NavigationContextType = {
    origin,
    isInitialized,
    updateOrigin
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}

/**
 * Hook to access navigation context
 * 
 * @returns Navigation context with origin information
 * @throws Error if used outside NavigationContextProvider
 */
export function useNavigationContext(): NavigationContextType {
  const context = useContext(NavigationContext)
  
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationContextProvider')
  }
  
  return context
}

/**
 * Hook to get context-aware home URL
 * 
 * @returns The appropriate home URL based on navigation context
 */
export function useContextAwareHomeUrl(): string {
  const { origin } = useNavigationContext()
  return origin.basePath
}

/**
 * Hook to create context-aware navigation functions
 * 
 * @returns Navigation helpers that preserve user context
 */
export function useContextAwareNavigation() {
  const { origin } = useNavigationContext()
  
  const getContextAwareUrl = (targetPath: string, preserveOrigin: boolean = true): string => {
    // If target is already absolute or external, return as-is
    if (targetPath.startsWith('http') || targetPath.startsWith('//')) {
      return targetPath
    }

    // Clean target path
    const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`

    // If we're on main site or target is dealer-specific, no modification needed
    if (!origin.isDealerLocation) {
      return cleanPath
    }

    // If preserveOrigin is false, return clean path
    if (!preserveOrigin) {
      return cleanPath
    }

    // Add origin parameter to preserve context
    const url = new URL(cleanPath, 'https://example.com')
    url.searchParams.set('origin', origin.basePath)
    
    return `${url.pathname}${url.search}`
  }

  const getHomeUrl = (): string => {
    return origin.basePath
  }

  const getLinkProps = (href: string, preserveOrigin: boolean = true) => ({
    href: getContextAwareUrl(href, preserveOrigin)
  })

  return {
    origin,
    getContextAwareUrl,
    getHomeUrl,
    getLinkProps
  }
}

/**
 * Server-side function to create initial navigation origin from request
 * Use this in Server Components to provide initial context
 * 
 * @param pathname - Request pathname
 * @param searchParams - Request search parameters
 * @returns NavigationOrigin for initial context
 */
export function createInitialNavigationOrigin(
  pathname: string,
  searchParams?: { [key: string]: string | string[] | undefined }
): NavigationOrigin {
  const urlSearchParams = new URLSearchParams()
  
  // Convert Next.js search params to URLSearchParams
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === 'string') {
        urlSearchParams.set(key, value)
      } else if (Array.isArray(value)) {
        value.forEach(v => urlSearchParams.append(key, v))
      }
    })
  }
  
  return parseNavigationOrigin(pathname, urlSearchParams)
}