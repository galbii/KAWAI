import React from 'react'
import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload/queries'
import type { ArchiveBlock as ArchiveBlockProps, Post } from '@/payload-types'
import { RichText } from '@/components/RichText'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type Props = ArchiveBlockProps & {
  id?: string
}

/**
 * ArchiveBlock Component
 *
 * Renders a collection of posts with optional category filtering.
 * Can be populated by collection query or manual selection.
 *
 * Server Component - fetches data directly from Payload
 */
export async function ArchiveBlock(props: Props) {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 6

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const flattenedCategories = (categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    }) ?? []).filter(Boolean) as string[]

    const cacheKey = `archive-posts-${flattenedCategories.sort().join(',')}-${limit}`
    const fetchPosts = unstable_cache(
      async () => {
        const payload = await getPayloadClient()
        const result = await payload.find({
          collection: 'posts',
          depth: 1,
          limit,
          where: flattenedCategories.length > 0
            ? { categories: { in: flattenedCategories } }
            : {},
          sort: '-publishedDate',
        })
        return result.docs as Post[]
      },
      [cacheKey],
      { tags: ['posts'], revalidate: 300 }
    )

    posts = await fetchPosts()
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs
        .map((post) => {
          if (typeof post.value === 'object') return post.value
          return null
        })
        .filter((post): post is Post => post !== null)

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={id ? `block-${id}` : undefined}>
      {introContent && (
        <div className="container mb-8">
          <RichText data={introContent} enableGutter={false} className="max-w-3xl" />
        </div>
      )}

      {posts && posts.length > 0 ? (
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <div className="container">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      )}
    </div>
  )
}

/**
 * PostCard Component
 *
 * Displays a single post in the archive
 */
function PostCard({ post }: { post: Post }) {
  const featuredImage = post.featuredImage && typeof post.featuredImage === 'object'
    ? post.featuredImage
    : null

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {featuredImage && featuredImage.url && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-kawai-red transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.publishedDate && (
          <time className="text-xs text-gray-500">
            {formatDate(post.publishedDate)}
          </time>
        )}
      </div>
    </Link>
  )
}
