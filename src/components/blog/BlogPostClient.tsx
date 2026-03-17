'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Post } from '@/payload-types'

interface BlogPostClientProps {
  post: Post
  featuredImageUrl: string
  hasFeaturedImage: boolean
  formattedDate: string | null
  authorName: string
  categoryLabels: Record<string, string>
  readTime: number
  sidebarSlot?: React.ReactNode
  relatedPostsSlot?: React.ReactNode
}

const easeKawai: [number, number, number, number] = [0.4, 0, 0.2, 1]

export function BlogPostClient({
  post,
  featuredImageUrl,
  hasFeaturedImage,
  formattedDate,
  authorName,
  categoryLabels,
  readTime,
  sidebarSlot,
  relatedPostsSlot,
}: BlogPostClientProps) {
  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* Cinematic Hero Section */}
      {hasFeaturedImage && (
        <div
          className="relative w-full h-[50vh] md:h-[60vh] lg:h-[65vh] bg-kawai-black"
          data-blog-hero
        >
          {/* Hero image — scale-in reveal */}
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

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
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
                  className="text-white/70 text-sm md:text-base italic mb-3 font-[family-name:var(--font-brand-serif)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeKawai, delay: 0.6 }}
                >
                  By {authorName}
                </motion.p>
              )}

              {/* Title — serif, delayed */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-5xl font-[family-name:var(--font-brand-serif)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeKawai, delay: 0.45 }}
              >
                {post.title}
              </motion.h1>

              {/* Metadata strip */}
              <motion.div
                className="mt-5 flex flex-wrap items-center gap-4 text-white/70 text-sm font-[family-name:var(--font-brand-sans)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeKawai, delay: 0.6 }}
              >
                {formattedDate && (
                  <time dateTime={post.publishedDate || undefined}>{formattedDate}</time>
                )}
                {formattedDate && <span aria-hidden>•</span>}
                <span>{readTime} min read</span>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Article Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Column — slide up on mount */}
          <motion.article
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeKawai, delay: 0.2 }}
          >
            <div className="max-w-3xl mx-auto lg:mx-0 bg-white rounded-lg shadow-sm p-8 md:p-12">

              {/* Back link */}
              <div className="mb-10">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 font-medium transition-colors text-sm font-[family-name:var(--font-brand-sans)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>

              {/* Lead excerpt — large serif intro paragraph */}
              {post.excerpt && (
                <p className="text-xl md:text-2xl font-[family-name:var(--font-brand-serif)] text-kawai-charcoal leading-relaxed mb-10 pb-10 border-b border-kawai-neutral italic">
                  {post.excerpt}
                </p>
              )}

              {/* Rich Text Content — scroll-triggered reveal */}
              {post.content && (
                <motion.div
                  className="prose prose-lg prose-headings:font-[family-name:var(--font-brand-serif)] prose-headings:text-kawai-black prose-p:text-kawai-charcoal prose-p:leading-relaxed prose-a:text-kawai-red prose-a:no-underline hover:prose-a:underline prose-strong:text-kawai-black prose-blockquote:border-l-kawai-red prose-blockquote:text-kawai-charcoal prose-li:text-kawai-charcoal prose-li:leading-relaxed max-w-none"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, ease: easeKawai }}
                >
                  <RichText data={post.content} />
                </motion.div>
              )}

              {/* Back to Blog — bottom */}
              <div className="mt-16 pt-8 border-t border-kawai-neutral">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 font-medium transition-colors font-[family-name:var(--font-brand-sans)]"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </motion.article>

          {/* Sidebar Column — slide in from right on mount */}
          {sidebarSlot && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: easeKawai, delay: 0.4 }}
            >
              {sidebarSlot}
            </motion.div>
          )}
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPostsSlot}
    </div>
  )
}
