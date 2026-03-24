import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, Tag } from 'lucide-react'
import type { Post, Category } from '@/payload-types'
import { cn } from '@/lib/utils'
import { ShareButtons } from './ShareButtons'

interface ArticleSidebarProps {
  post: Post
  className?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function estimateReadTime(post: Post): number {
  const wordCount = post.excerpt?.split(' ').length ?? 100
  return Math.max(2, Math.round(wordCount / 200))
}

function isCategoryObject(cat: string | Category): cat is Category {
  return typeof cat === 'object' && cat !== null && 'title' in cat
}

export function ArticleSidebar({ post, className = '' }: ArticleSidebarProps) {
  const resolvedCategories = (post.categories ?? []).filter(isCategoryObject)
  const publishDate = post.publishedDate ?? post.updatedAt
  const readTime = estimateReadTime(post)

  return (
    <aside
      className={cn('hidden lg:block w-80 mr-12 h-full', className)}
      aria-label="Article sidebar"
    >
      <div
        className="sticky space-y-5"
        style={{ top: 'calc(var(--header-bottom, 120px) + 24px)' }}
      >

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 font-medium transition-colors text-sm font-[family-name:var(--font-brand-sans)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kawai Latest News
        </Link>

        {/* Section A — About This Post */}
        <div className="bg-white border border-kawai-neutral rounded-xl p-5">
          <h3 className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mb-4">
            About This Post
          </h3>

          <div className="space-y-4">
            {/* Categories */}
            {resolvedCategories.length > 0 && (
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-kawai-red mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex flex-wrap gap-1.5">
                  {resolvedCategories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kawai-red/10 text-kawai-red border border-kawai-red/20"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Publish date */}
            {publishDate && (
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-kawai-charcoal shrink-0" aria-hidden="true" />
                <span className="text-sm text-kawai-charcoal">
                  {formatDate(publishDate)}
                </span>
              </div>
            )}

            {/* Read time */}
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-kawai-charcoal shrink-0" aria-hidden="true" />
              <span className="text-sm text-kawai-charcoal">
                {readTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* Section B — Share This Article */}
        <div className="bg-white border border-kawai-neutral rounded-xl p-5">
          <h3 className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mb-4">
            Share
          </h3>
          <ShareButtons title={post.title} slug={post.slug ?? ''} />
        </div>

        {/* Section C — Explore More CTA */}
        <div className="bg-kawai-black rounded-xl p-5">
          <h3 className="text-base font-semibold text-white mb-1.5">
            The Full Collection
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Browse all piano insights and stories
          </p>
          <Link
            href="/blog"
            className={cn(
              'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
              'bg-kawai-red text-white',
              'hover:bg-kawai-red-700 transition-colors duration-200',
            )}
          >
            View all posts →
          </Link>
        </div>

      </div>
    </aside>
  )
}
