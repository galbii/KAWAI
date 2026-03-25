'use client'

/**
 * LivePreviewPost
 *
 * Handles real-time preview for blog posts in the Payload admin iframe.
 *
 * Two mechanisms work together:
 *  1. `useLivePreview`     — streams field changes via postMessage as the editor types.
 *                            Updates: title, excerpt, featured image, date, author, category.
 *  2. `RefreshRouteOnSave` — triggers a full router.refresh() after each save.
 *                            Updates: layout blocks, sidebar (server-rendered RSC slots).
 *
 * The page (page.tsx) stays a pure Server Component: it fetches the initial Post,
 * pre-renders the RSC slots (layoutSlot, sidebarSlot, relatedPostsSlot), and passes
 * everything here. This component owns all client-side rendering and live merging.
 */

import { useLivePreview, RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import type { Post, User } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { BlogPostClient } from '@/components/blog/BlogPostClient'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import { StickyHeaderBar } from '@/components/blog/StickyHeaderBar'
import { RenderBlocksClient } from '@/components/RenderBlocksClient'

// Shared map — keeps page.tsx and this component in sync without duplication
export const CATEGORY_LABELS: Record<string, string> = {
  education: 'Piano Education',
  'product-news': 'Product News',
  artists: 'Artist Spotlights',
  maintenance: 'Maintenance & Care',
  'buying-guides': 'Buying Guides',
  events: 'Events',
  'company-news': 'Company News',
  technology: 'Technology',
}

export interface LivePreviewPostProps {
  /** Initial post data fetched server-side — the hook starts from this. */
  initialPost: Post
  /** True when Next.js draft mode is active (editor clicked "Preview"). */
  isDraftMode: boolean
  /**
   * Pre-rendered RSC slots — these update on save (via RefreshRouteOnSave),
   * not in real-time, because they are Server Components.
   * layout blocks are rendered client-side via RenderBlocksClient for real-time updates.
   */
  sidebarSlot: React.ReactNode
  relatedPostsSlot: React.ReactNode
}

/** Derive the author display name from the populated authors array. */
function getAuthorName(post: Post): string {
  const first = post.authors?.[0]
  if (typeof first === 'object' && first !== null) {
    return (first as User).email || 'Kawai America'
  }
  return 'Kawai America'
}

/** Derive primary category label from post.categories. */
function getCategoryLabel(post: Post): string {
  const first = post.categories?.[0]
  const slug =
    typeof first === 'object' && first !== null
      ? first.slug ?? ''
      : typeof first === 'string'
        ? first
        : ''
  return CATEGORY_LABELS[slug] ?? slug
}

/** Estimate read time from excerpt word count (rough proxy). */
function getReadTime(post: Post): number {
  return Math.ceil((post.excerpt?.split(' ').length ?? 0) / 200) || 5
}

export function LivePreviewPost({
  initialPost,
  isDraftMode,
  sidebarSlot,
  relatedPostsSlot,
}: LivePreviewPostProps) {
  const router = useRouter()

  // Real-time data — updates as the editor types without needing a save.
  // `depth: 2` must match the depth used in getPostBySlug() in page.tsx.
  const { data: post } = useLivePreview<Post>({
    initialData: initialPost,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    depth: 2,
  })

  // Derived values — recomputed whenever `post` updates
  const featuredImageUrl = resolveMediaUrl(post.featuredImage)
  const hasFeaturedImage = Boolean(featuredImageUrl)
  const heroVideoUrl = post.heroVideoUrl ?? null
  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null
  const authorName = getAuthorName(post)
  const categoryLabel = getCategoryLabel(post)
  const readTime = getReadTime(post)

  return (
    <>
      {/* Full-page refresh after each save — keeps RSC slots (blocks, sidebar) in sync */}
      {isDraftMode && (
        <RefreshRouteOnSave
          refresh={router.refresh}
          serverURL={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
        />
      )}

      <ReadingProgressBar />

      {/* Re-renders in real-time as title / category change */}
      <StickyHeaderBar title={post.title} category={categoryLabel} readTime={readTime} />

      <BlogPostClient
        post={post}
        featuredImageUrl={featuredImageUrl}
        hasFeaturedImage={hasFeaturedImage}
        heroVideoUrl={heroVideoUrl}
        formattedDate={formattedDate}
        authorName={authorName}
        categoryLabels={CATEGORY_LABELS}
        readTime={readTime}
        layoutSlot={<RenderBlocksClient blocks={post.layout} />}
        sidebarSlot={sidebarSlot}
        relatedPostsSlot={relatedPostsSlot}
      />
    </>
  )
}
