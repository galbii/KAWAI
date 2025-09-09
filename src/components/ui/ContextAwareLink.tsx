'use client'

/**
 * ContextAwareLink Component
 * 
 * A wrapper around Next.js Link that automatically preserves navigation context
 * by adding origin parameters when users navigate from dealer location pages.
 * 
 * This ensures users can maintain their browsing context and return to their
 * original entry point (main homepage vs dealer location).
 */

import Link from 'next/link'
import { ComponentProps, forwardRef } from 'react'
import { useContextAwareNavigation } from '@/contexts/NavigationContext'

interface ContextAwareLinkProps extends Omit<ComponentProps<typeof Link>, 'href' | 'children'> {
  /** The target URL to navigate to */
  href: string
  /** Whether to preserve navigation origin in the URL (default: true) */
  preserveOrigin?: boolean
  /** Override children for conditional rendering based on context */
  children?: React.ReactNode | ((context: { origin: any, getHomeUrl: () => string }) => React.ReactNode)
}

/**
 * A Link component that automatically preserves user's navigation context
 * 
 * Usage:
 * - `<ContextAwareLink href="/products">Products</ContextAwareLink>` - preserves origin by default
 * - `<ContextAwareLink href="/contact" preserveOrigin={false}>Contact</ContextAwareLink>` - no context preservation
 * - Function children for conditional rendering based on context
 */
export const ContextAwareLink = forwardRef<HTMLAnchorElement, ContextAwareLinkProps>(
  ({ href, preserveOrigin = true, children, ...props }, ref) => {
    const navigation = useContextAwareNavigation()
    const contextAwareHref = navigation.getContextAwareUrl(href, preserveOrigin)

    // Handle function children for conditional rendering
    const resolvedChildren = typeof children === 'function' 
      ? children({ 
          origin: navigation.origin, 
          getHomeUrl: navigation.getHomeUrl 
        })
      : children

    return (
      <Link 
        ref={ref}
        href={contextAwareHref} 
        {...props}
      >
        {resolvedChildren}
      </Link>
    )
  }
)

ContextAwareLink.displayName = 'ContextAwareLink'