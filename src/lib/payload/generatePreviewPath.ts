import { PayloadRequest, CollectionSlug } from 'payload'

/**
 * Collection URL Prefix Mapping
 *
 * Maps collection slugs to their URL prefixes for frontend routing.
 * This ensures preview URLs match the actual frontend route structure.
 */
const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/blog',
  pages: '', // Pages render at root level /[slug]
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

/**
 * Generate Preview Path
 *
 * Creates preview URLs for Payload CMS collections that match
 * the actual frontend route structure.
 *
 * Examples:
 * - pages/about → /about
 * - posts/hello → /blog/hello
 */
export const generatePreviewPath = ({ collection, slug }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
