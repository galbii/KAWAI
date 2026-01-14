import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'

interface RelatedPostsProps {
  relatedPosts?: (Post | string)[] | null
}

/**
 * RelatedPosts Component
 *
 * Displays related blog posts in a grid layout at the end of blog articles.
 * Fetches full post data from Payload Local API if only IDs are provided.
 * Uses KAWAI's existing BlogCard styling patterns for consistency.
 *
 * Features:
 * - Server Component (async/await)
 * - Fetches full post data using Payload Local API
 * - Responsive grid (1 column mobile, 2 columns tablet/desktop)
 * - Graceful handling of empty state
 * - KAWAI brand styling and hover effects
 */
export async function RelatedPosts({ relatedPosts }: RelatedPostsProps) {
  // Handle empty or missing relatedPosts
  if (!relatedPosts || relatedPosts.length === 0) {
    return null
  }

  // Import Payload dynamically (server-side only)
  const { getPayload } = await import('payload')
  const configPromise = await import('@payload-config')
  const payload = await configPromise.default

  // Extract post IDs (handle both Post objects and string IDs)
  const postIds = relatedPosts
    .map((post) => (typeof post === 'string' ? post : post.id))
    .filter((id): id is string => Boolean(id))

  // If no valid IDs, return null
  if (postIds.length === 0) {
    return null
  }

  // Fetch full post data from Payload Local API
  try {
    const payloadInstance = await getPayload({ config: payload })

    const { docs: posts } = await payloadInstance.find({
      collection: 'posts',
      where: {
        id: {
          in: postIds,
        },
        status: {
          equals: 'published',
        },
      },
      depth: 1, // Populate featured image
      limit: postIds.length,
      overrideAccess: false, // Enforce access control (security best practice)
    })

    // If no posts found, return null
    if (!posts || posts.length === 0) {
      return null
    }

    // Category labels mapping
    const categoryLabels: Record<string, string> = {
      education: 'Piano Education',
      'product-news': 'Product News',
      artists: 'Artist Spotlights',
      maintenance: 'Maintenance & Care',
      'buying-guides': 'Buying Guides',
      events: 'Events',
      'company-news': 'Company News',
      technology: 'Technology',
    }

    return (
      <section className="bg-kawai-pearl py-16 md:py-20">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Heading */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kawai-charcoal mb-2">
              Related Articles
            </h2>
            <p className="text-gray-600 text-lg">
              Continue exploring piano insights and stories
            </p>
          </div>

          {/* Grid of Related Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {posts.map((post) => {
              // Resolve featured image URL
              const imageUrl = resolveMediaUrl(post.featuredImage)
              const hasImage = imageUrl && imageUrl !== ''

              // Format publish date
              const formattedDate = post.publishedDate
                ? new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block h-full"
                >
                  <article className="flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    {/* Featured Image */}
                    {hasImage && (
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="flex flex-col flex-1 p-6">
                      {/* Categories */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="inline-block px-2 py-1 text-xs font-medium text-kawai-red bg-kawai-red/10 rounded"
                            >
                              {categoryLabels[category] || category}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-kawai-charcoal mb-2 line-clamp-2 group-hover:text-kawai-red transition-colors duration-200">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta Footer */}
                      <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                        {/* Published Date */}
                        {formattedDate && (
                          <time
                            dateTime={post.publishedDate || undefined}
                            className="text-sm text-gray-500"
                          >
                            {formattedDate}
                          </time>
                        )}

                        {/* Read More Link */}
                        <span className="text-sm font-medium text-kawai-red group-hover:underline">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    // Log error but don't crash the page
    console.error('[RelatedPosts] Error fetching related posts:', error)
    return null
  }
}
