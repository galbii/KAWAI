/**
 * Navigation Context Utilities
 * 
 * Provides utilities for maintaining user navigation context across page visits,
 * allowing users to return to their original entry point (main site vs dealer location)
 */

export interface NavigationOrigin {
  /** The base path for navigation (e.g., '/' or '/st-louis') */
  basePath: string
  /** Whether this is a dealer location or main site */
  isDealerLocation: boolean
  /** The dealer slug if applicable */
  dealerSlug?: string
  /** Display name for the location */
  locationName?: string
}

/**
 * Parse the navigation origin from pathname and search parameters
 * 
 * @param pathname - Current pathname (e.g., '/st-louis/products/piano-123')
 * @param searchParams - URL search parameters
 * @returns NavigationOrigin object
 */
export function parseNavigationOrigin(
  pathname: string, 
  searchParams?: URLSearchParams
): NavigationOrigin {
  // Check for explicit origin in search params first
  const originParam = searchParams?.get('origin')
  if (originParam) {
    const isDealerLocation = originParam !== '/' && originParam.startsWith('/')
    const dealerSlug = isDealerLocation ? originParam.slice(1) : undefined

    return {
      basePath: originParam,
      isDealerLocation,
      ...(dealerSlug !== undefined && { dealerSlug })
    }
  }

  // Parse from pathname
  const pathSegments = pathname.split('/').filter(Boolean)

  // If no segments, we're at root
  if (pathSegments.length === 0) {
    return {
      basePath: '/',
      isDealerLocation: false
    }
  }

  const firstSegment = pathSegments[0]
  const secondSegment = pathSegments[1]

  if (!firstSegment) {
    // No first segment, default to main site
    return {
      basePath: '/',
      isDealerLocation: false
    }
  }

  // ✅ NEW: Check if this is a /store/[storeslug] route
  if (firstSegment === 'store' && secondSegment) {
    return {
      basePath: `/store/${secondSegment}`,
      isDealerLocation: true,
      dealerSlug: secondSegment
    }
  }

  // Check if first segment looks like a dealer location (legacy support)
  // Exclude known non-dealer routes
  const knownRoutes = [
    // Core pages
    'pianos', 'products', 'piano-finder', 'find-my-piano', 'find-a-dealer',
    // Product-specific pages
    'concert-artist', 'concert-artist-ca', 'es60', 'technology',
    // Content pages
    'about', 'artists', 'guides', 'showroom', 'storefronts',
    // Events & special pages
    'namm-2026',
    // System routes
    'admin', 'api', 'sitemap.xml', 'robots.txt', 'store',
    // Static assets
    'images', 'favicon.ico', '_next', 'media',
    // Legacy/resources
    'innovation', 'heritage', 'resources', 'experience', 'contact', 'news', 'blog', 'cart'
  ]

  if (!knownRoutes.includes(firstSegment)) {
    // Likely a legacy dealer location (will be redirected by middleware)
    return {
      basePath: `/${firstSegment}`,
      isDealerLocation: true,
      dealerSlug: firstSegment
    }
  }

  // Default to main site
  return {
    basePath: '/',
    isDealerLocation: false
  }
}

/**
 * Create a context-aware URL that preserves navigation origin
 * 
 * @param targetPath - The path to navigate to
 * @param origin - Current navigation origin
 * @param preserveOrigin - Whether to preserve origin in URL params (default: true)
 * @returns Context-aware URL
 */
export function getContextAwareUrl(
  targetPath: string, 
  origin: NavigationOrigin,
  preserveOrigin: boolean = true
): string {
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

/**
 * Get the home URL for the current navigation context
 * 
 * @param origin - Navigation origin
 * @returns Home URL for the context
 */
export function getContextAwareHomeUrl(origin: NavigationOrigin): string {
  return origin.basePath
}

/**
 * Create navigation context-aware Link props
 * 
 * @param href - Target href
 * @param origin - Navigation origin
 * @param preserveOrigin - Whether to preserve origin (default: true)
 * @returns Props object for Next.js Link component
 */
export function getContextAwareLinkProps(
  href: string,
  origin: NavigationOrigin,
  preserveOrigin: boolean = true
) {
  return {
    href: getContextAwareUrl(href, origin, preserveOrigin)
  }
}

/**
 * Determine if a path represents a dealer location
 * 
 * @param pathname - Path to check
 * @returns Whether this looks like a dealer location
 */
export function isDealerLocationPath(pathname: string): boolean {
  const origin = parseNavigationOrigin(pathname)
  return origin.isDealerLocation
}

/**
 * Extract dealer slug from pathname
 * 
 * @param pathname - Path to parse
 * @returns Dealer slug or undefined
 */
export function extractDealerSlug(pathname: string): string | undefined {
  const origin = parseNavigationOrigin(pathname)
  return origin.dealerSlug
}

/**
 * Create accessible aria-label for context-aware navigation
 * 
 * @param defaultLabel - Default aria label
 * @param origin - Navigation origin
 * @returns Accessibility-friendly label
 */
export function getContextAwareAriaLabel(
  defaultLabel: string,
  origin: NavigationOrigin
): string {
  if (origin.isDealerLocation && origin.locationName) {
    return `${defaultLabel} - Return to ${origin.locationName}`
  } else if (origin.isDealerLocation) {
    return `${defaultLabel} - Return to dealer location`
  }
  return defaultLabel
}