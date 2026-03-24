'use client'

/**
 * ContextAwareLink
 *
 * Previously appended ?origin= params to preserve dealer context across
 * navigations. That's now handled by the kawai-dealer-slug cookie set in
 * middleware — links are plain clean URLs everywhere.
 *
 * This component is kept as a thin Link wrapper so existing call-sites don't
 * need to change. It is functionally identical to Next.js <Link>.
 */

import Link from 'next/link'
import { ComponentProps, forwardRef } from 'react'

interface ContextAwareLinkProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  children?: React.ReactNode
}

export const ContextAwareLink = forwardRef<HTMLAnchorElement, ContextAwareLinkProps>(
  ({ children, ...props }, ref) => (
    <Link ref={ref} {...props}>
      {children}
    </Link>
  ),
)

ContextAwareLink.displayName = 'ContextAwareLink'
