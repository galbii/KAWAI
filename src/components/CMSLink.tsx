import React from 'react'
import Link from 'next/link'
import { Page, Post } from '@/payload-types'
import { cn } from '@/lib/utils'

type LinkType = {
  type?: 'reference' | 'custom' | null
  newTab?: boolean | null
  reference?: {
    value: string | Page | Post
    relationTo: 'pages' | 'posts'
  } | null
  url?: string | null
  label?: string
  appearance?: 'default' | 'outline' | null
  className?: string
  children?: React.ReactNode
}

/**
 * CMSLink Component
 *
 * Renders links from Payload CMS with support for:
 * - Internal references (pages, posts)
 * - External URLs
 * - Appearance variants (default, outline)
 * - New tab behavior
 *
 * @example
 * ```tsx
 * // From link field
 * <CMSLink {...linkField} />
 *
 * // With children
 * <CMSLink {...linkField}>
 *   Custom Link Text
 * </CMSLink>
 * ```
 */
export function CMSLink({
  type,
  newTab,
  reference,
  url,
  label,
  appearance,
  className,
  children,
}: LinkType) {
  const href = generateHref(type, reference, url)

  if (!href) {
    return null
  }

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  const appearanceClasses = {
    default: 'inline-flex items-center justify-center rounded-md bg-kawai-red px-4 py-2 text-sm font-medium text-white hover:bg-kawai-red/90 transition-colors',
    outline: 'inline-flex items-center justify-center rounded-md border border-kawai-red px-4 py-2 text-sm font-medium text-kawai-red hover:bg-kawai-red/10 transition-colors',
  }

  // Default to 'default' appearance if null or undefined
  const effectiveAppearance = appearance || 'default'

  const content = children || label || 'Learn More'

  // External URL
  if (type === 'custom' || !href.startsWith('/')) {
    return (
      <a
        href={href}
        className={cn(appearanceClasses[effectiveAppearance], className)}
        {...newTabProps}
      >
        {content}
      </a>
    )
  }

  // Internal reference
  return (
    <Link
      href={href}
      className={cn(appearanceClasses[effectiveAppearance], className)}
      {...newTabProps}
    >
      {content}
    </Link>
  )
}

/**
 * Generate href from link data
 *
 * Maps Payload collections to their frontend URL structure:
 * - pages → /[slug]
 * - posts → /blog/[slug]
 */
function generateHref(
  type: LinkType['type'],
  reference: LinkType['reference'],
  url: LinkType['url']
): string | null {
  if (type === 'reference' && reference?.value && typeof reference.value === 'object') {
    const doc = reference.value
    const relationTo = reference.relationTo

    // Generate path based on collection
    if (relationTo === 'pages') {
      return `/${doc.slug}`
    }
    if (relationTo === 'posts') {
      return `/blog/${doc.slug}`
    }
  }

  if (type === 'custom' && url) {
    return url
  }

  return null
}

/**
 * LinkGroup Component
 *
 * Renders an array of links with proper spacing.
 * Links array comes from Payload's linkGroup field which wraps each link in a parent object.
 */
export function LinkGroup({
  links,
  className
}: {
  links: Array<{ link: LinkType; id?: string | null }>,
  className?: string
}) {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {links.map((item, index) => (
        <CMSLink key={item.id || index} {...item.link} />
      ))}
    </div>
  )
}
