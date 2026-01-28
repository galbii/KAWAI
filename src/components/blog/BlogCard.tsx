import Image from 'next/image'
import Link from 'next/link'
import type { Post, Media, Category } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { getOptimizedImageProps } from '@/lib/media/r2-utils'

interface BlogCardProps {
  post: Post
}

/**
 * BlogCard Component
 *
 * Displays a single blog post card with featured image, title, excerpt,
 * categories, and publish date. Optimized for responsive layouts with
 * hover effects and KAWAI brand styling.
 */
export function BlogCard({ post }: BlogCardProps) {
  const {
    title,
    slug,
    excerpt,
    featuredImage,
    publishedDate,
    categories: rawCategories,
  } = post

  // Resolve featured image URL
  const imageUrl = resolveMediaUrl(featuredImage)
  const hasImage = imageUrl && imageUrl !== ''

  // Format publish date
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Extract category data (handles both Category objects and string IDs)
  const categories = rawCategories?.map((cat) => {
    if (typeof cat === 'string') {
      return { slug: cat, title: cat }
    }
    return { slug: cat.slug, title: cat.title }
  }) || []

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block h-full"
    >
      <article className="flex flex-col h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Featured Image */}
        {hasImage && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Card Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.slice(0, 2).map((category) => (
                <span
                  key={category.slug}
                  className="inline-block px-2 py-1 text-xs font-medium text-kawai-red bg-kawai-red/10 rounded"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-kawai-charcoal mb-2 line-clamp-2 group-hover:text-kawai-red transition-colors duration-200">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
              {excerpt}
            </p>
          )}

          {/* Meta Footer */}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
            {/* Published Date */}
            {formattedDate && (
              <time
                dateTime={publishedDate || undefined}
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
}
