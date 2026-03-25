'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Post } from '@/payload-types'

interface BlogPostClientProps {
  post: Post
  featuredImageUrl: string
  hasFeaturedImage: boolean
  heroVideoUrl?: string | null
  formattedDate: string | null
  authorName: string
  categoryLabels: Record<string, string>
  readTime: number
  sidebarSlot?: React.ReactNode
  relatedPostsSlot?: React.ReactNode
  layoutSlot?: React.ReactNode
}

const easeKawai: [number, number, number, number] = [0.4, 0, 0.2, 1]

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

export function BlogPostClient({
  post,
  featuredImageUrl,
  hasFeaturedImage,
  heroVideoUrl,
  formattedDate,
  authorName,
  categoryLabels,
  readTime,
  sidebarSlot,
  relatedPostsSlot,
  layoutSlot,
}: BlogPostClientProps) {
  const youtubeId = heroVideoUrl ? extractYouTubeId(heroVideoUrl) : null
  const hasHero = !!youtubeId || hasFeaturedImage

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Cinematic Hero Section */}
      {hasHero && (
        <div
          className="relative w-full min-h-[60vh] md:min-h-[68vh] lg:min-h-[72vh] bg-kawai-black overflow-hidden"
          data-blog-hero
        >
          {youtubeId ? (
            /* YouTube video hero — cover-fills the container */
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: easeKawai }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&playsinline=1&modestbranding=1`}
                allow="autoplay; encrypted-media"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '56.25vw' }}
                title={post.title}
              />
            </motion.div>
          ) : (
            /* Featured image hero — scale-in reveal */
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: easeKawai }}
            >
              <Image
                src={featuredImageUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          )}

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 pb-14 md:pb-20 lg:pb-24">
              {/* Category badges — stagger in from bottom */}
              {post.categories && post.categories.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 mb-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easeKawai, delay: 0.3 }}
                >
                  {post.categories.slice(0, 3).map((category) => {
                    const categorySlug =
                      typeof category === 'object' && category !== null
                        ? category.slug || ''
                        : typeof category === 'string'
                          ? category
                          : ''
                    return (
                      <span
                        key={categorySlug}
                        className="inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-kawai-red/90 text-white rounded-full backdrop-blur-sm font-[family-name:var(--font-brand-sans)]"
                      >
                        {categoryLabels[categorySlug] || categorySlug}
                      </span>
                    )
                  })}
                </motion.div>
              )}

              {/* Author byline above title */}
              {authorName && (
                <motion.p
                  className="text-white/60 text-sm md:text-sm tracking-wide italic mb-4 font-[family-name:var(--font-brand-serif)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeKawai, delay: 0.6 }}
                >
                  By {authorName}
                </motion.p>
              )}

              {/* Title — serif, delayed */}
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight max-w-4xl font-[family-name:var(--font-brand-serif)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeKawai, delay: 0.45 }}
              >
                {post.title}
              </motion.h1>

              {/* Metadata strip */}
              <motion.div
                className="mt-6 flex flex-wrap items-center gap-3 text-white/55 text-xs tracking-wide font-[family-name:var(--font-brand-sans)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeKawai, delay: 0.6 }}
              >
                {formattedDate && (
                  <time dateTime={post.publishedDate || undefined}>{formattedDate}</time>
                )}
                {formattedDate && <span aria-hidden className="opacity-40">•</span>}
                <span>{readTime} min read</span>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Article Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Column — slide in from left on mount */}
          {sidebarSlot && (
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: easeKawai, delay: 0.4 }}
            >
              {sidebarSlot}
            </motion.div>
          )}

          {/* Main Content Column — slide up on mount */}
          <motion.article
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeKawai, delay: 0.2 }}
          >
            <div className="max-w-3xl mx-auto lg:mx-0 bg-white rounded-lg shadow-sm p-8 md:p-12">

              {/* Lead excerpt — large serif intro paragraph */}
              {post.excerpt && (
                <p className="text-xl md:text-2xl font-[family-name:var(--font-brand-serif)] text-kawai-charcoal leading-relaxed mb-10 pb-10 border-b border-kawai-neutral italic">
                  {post.excerpt}
                </p>
              )}

              {/* Page Builder Content — scroll-triggered reveal */}
              {layoutSlot && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: easeKawai }}
                >
                  {layoutSlot}
                </motion.div>
              )}

            </div>

            {/* Kawai Latest News — below article card */}
            <div className="max-w-3xl mx-auto lg:mx-0 mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 font-medium transition-colors font-[family-name:var(--font-brand-sans)]"
              >
                <ArrowLeft className="w-5 h-5" />
                Kawai Latest News
              </Link>
            </div>
          </motion.article>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPostsSlot}
    </div>
  )
}
