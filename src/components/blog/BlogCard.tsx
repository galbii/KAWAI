import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  post: Post
  className?: string
  featured?: boolean
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

export function BlogCard({ post, className, featured }: BlogCardProps) {
  const { title, slug, excerpt, featuredImage, heroVideoUrl, publishedDate, categories: rawCategories } = post

  const videoId = heroVideoUrl ? getYouTubeId(heroVideoUrl) : null
  const imageUrl = resolveMediaUrl(featuredImage)
  const hasImage = imageUrl && imageUrl !== ''

  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const categories =
    rawCategories?.map((cat) => {
      if (typeof cat === 'string') return { slug: cat, title: cat }
      return { slug: cat.slug ?? cat.id, title: cat.title }
    }) ?? []

  const primaryCategory = categories[0] ?? null

  return (
    <Link
      href={`/blog/${slug}`}
      className={cn('group block h-full', className)}
    >
      <article
        className={cn(
          'flex flex-col h-full bg-white rounded-xl border border-kawai-neutral overflow-hidden',
          'transition-all duration-300 ease-[var(--ease-piano)]',
          'hover:-translate-y-[2px] hover:shadow-brand-medium',
        )}
      >
        {/* Image / Video */}
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-kawai-black shrink-0">
          {videoId ? (
            /* Auto-playing muted YouTube embed.
               16:9 video in 3:2 container → fill by height (video is wider):
               width = container_height × 16/9 = (2/3 × W) × 16/9 = 32W/27 ≈ 118.5% */
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&playsinline=1&modestbranding=1`}
              allow="autoplay; encrypted-media"
              title={title}
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                height: '100%',
                width: '118.52%',
                border: 'none',
                pointerEvents: 'none',
              }}
            />
          ) : hasImage ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-[var(--ease-elegant)] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-kawai-pearl flex items-center justify-center">
              <span className="text-kawai-neutral text-4xl select-none">♪</span>
            </div>
          )}

          {/* Category pill — absolute top-left over image */}
          {primaryCategory && (
            <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-widest bg-kawai-red text-white font-[family-name:var(--font-brand-sans)]">
              {primaryCategory.title}
            </span>
          )}

          {/* Featured badge — absolute top-right over image */}
          {featured && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-widest bg-kawai-black/80 text-white backdrop-blur-sm font-[family-name:var(--font-brand-sans)]">
              <svg
                viewBox="0 0 12 12"
                className="w-2.5 h-2.5 fill-kawai-gold shrink-0"
                aria-hidden="true"
              >
                <path d="M6 1l1.236 2.504 2.764.402-2 1.95.472 2.751L6 7.351l-2.472 1.256.472-2.751-2-1.95 2.764-.402L6 1z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* Title */}
          <h3
            className={cn(
              'text-xl leading-snug mb-3 line-clamp-2',
              'font-[family-name:var(--font-brand-serif)] font-semibold text-kawai-black',
              'transition-colors duration-200 ease-[var(--ease-piano)]',
              'group-hover:text-kawai-red',
            )}
          >
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm leading-relaxed text-kawai-charcoal/70 line-clamp-2 flex-1 font-[family-name:var(--font-brand-sans)]">
              {excerpt}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-kawai-neutral">
            {formattedDate ? (
              <time
                dateTime={publishedDate ?? undefined}
                className="text-xs text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)] tracking-wide"
              >
                {formattedDate}
              </time>
            ) : (
              <span />
            )}

            {/* Animated arrow */}
            <span
              aria-hidden="true"
              className={cn(
                'flex items-center gap-1 text-kawai-red text-sm',
                'transition-transform duration-200 ease-[var(--ease-piano)]',
                'group-hover:translate-x-1',
              )}
            >
              <span className="w-5 h-px bg-kawai-red inline-block transition-all duration-200 group-hover:w-7" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 10 10"
                className="w-2.5 h-2.5 fill-kawai-red"
              >
                <path d="M1 5h8M5.5 1.5 9 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
