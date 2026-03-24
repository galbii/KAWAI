/**
 * Navigation Context Utilities
 *
 * Dealer context is now persisted via the `kawai-dealer-slug` cookie set by
 * middleware. These utilities handle pathname-based origin parsing (used on the
 * server) and aria-label helpers. There is no longer any ?origin= URL
 * manipulation — links are plain clean URLs everywhere.
 */

export interface NavigationOrigin {
  /** The base path for navigation (e.g., '/' or '/store/st-louis') */
  basePath: string
  /** Whether this is a dealer location or main site */
  isDealerLocation: boolean
  /** The dealer slug if applicable (e.g., 'st-louis') */
  dealerSlug?: string
  /** Display name for the location */
  locationName?: string
}

/**
 * Parse the navigation origin from a pathname.
 * Only uses the pathname — no search params / ?origin= logic.
 */
export function parseNavigationOrigin(pathname: string): NavigationOrigin {
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  const secondSegment = pathSegments[1]

  if (firstSegment === 'store' && secondSegment) {
    return {
      basePath: `/store/${secondSegment}`,
      isDealerLocation: true,
      dealerSlug: secondSegment,
    }
  }

  return { basePath: '/', isDealerLocation: false }
}

/**
 * Returns the clean target path unchanged.
 * Kept for call-site compatibility — no longer appends ?origin= params.
 */
export function getContextAwareUrl(
  targetPath: string,
  _origin?: NavigationOrigin,
): string {
  if (targetPath.startsWith('http') || targetPath.startsWith('//')) return targetPath
  return targetPath.startsWith('/') ? targetPath : `/${targetPath}`
}

/**
 * Create accessible aria-label for context-aware navigation.
 */
export function getContextAwareAriaLabel(
  defaultLabel: string,
  origin: NavigationOrigin,
): string {
  if (origin.isDealerLocation && origin.locationName) {
    return `${defaultLabel} - Return to ${origin.locationName}`
  } else if (origin.isDealerLocation) {
    return `${defaultLabel} - Return to dealer location`
  }
  return defaultLabel
}
