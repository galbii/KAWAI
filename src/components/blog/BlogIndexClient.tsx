'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Post } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { BlogCardAnimated } from './BlogCardAnimated'

interface BlogIndexClientProps {
  featuredPost: Post | null
  heroIsFeatured: boolean
  gridPosts: Post[]
  category?: string
}

const EASE_PIANO = [0.4, 0, 0.2, 1] as const

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

export function BlogIndexClient({
  featuredPost,
  heroIsFeatured,
  gridPosts,
  category,
}: BlogIndexClientProps) {
  const hasPosts = featuredPost !== null || gridPosts.length > 0

  const featuredImageUrl = featuredPost ? resolveMediaUrl(featuredPost.featuredImage) : null
  const featuredVideoId = featuredPost?.heroVideoUrl ? getYouTubeId(featuredPost.heroVideoUrl) : null
  const featuredCategories =
    featuredPost?.categories?.map((cat) => {
      if (typeof cat === 'string') return { slug: cat, title: cat }
      return { slug: cat.slug ?? cat.id, title: cat.title }
    }) ?? []
  const featuredDate = featuredPost?.publishedDate
    ? new Date(featuredPost.publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* ── Editorial Masthead ── */}
      <motion.section
        className="bg-kawai-black"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_PIANO }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Red rule */}
          <div className="w-12 h-0.5 bg-kawai-red mb-8" />

          <h1 className="text-5xl md:text-7xl text-white font-[family-name:var(--font-brand-serif)] font-normal leading-none tracking-tight mb-6">
            The KAWAI Journal
          </h1>

          <p className="text-white/60 text-lg font-[family-name:var(--font-brand-sans)] max-w-xl leading-relaxed">
            Notes on craft, artistry, and the enduring world of the piano — from
            our gallery to yours.
          </p>

          {category && (
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mt-8 text-kawai-red/80 hover:text-kawai-red text-sm font-[family-name:var(--font-brand-sans)] transition-colors duration-200"
            >
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5H1M4.5 1.5 1 5l3.5 3.5" />
              </svg>
              All stories
            </Link>
          )}
        </div>
      </motion.section>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {!hasPosts ? (
          /* ── Empty State ── */
          <motion.div
            className="flex flex-col items-center justify-center py-32 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_PIANO }}
          >
            <div className="w-10 h-0.5 bg-kawai-red mb-8" />
            <h2 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
              No stories yet
            </h2>
            <p className="text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] max-w-sm">
              We&apos;re composing our first notes. Check back soon for articles,
              guides, and artist spotlights.
            </p>
          </motion.div>
        ) : (
          <>
            {/* ── Featured Hero Post ── */}
            {featuredPost && (
              <div className="mb-20">
                {/* Section label */}
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: EASE_PIANO }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-kawai-red font-[family-name:var(--font-brand-sans)]">
                    Featured
                  </span>
                  <div className="flex-1 h-px bg-kawai-neutral" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15, ease: EASE_PIANO }}
                >
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <article className="grid md:grid-cols-[3fr_2fr] gap-0 bg-white rounded-2xl border border-kawai-neutral overflow-hidden transition-all duration-300 ease-[var(--ease-piano)] hover:shadow-brand-premium">
                      {/* Image / Video — left 60% */}
                      <div className="relative w-full aspect-[4/3] md:aspect-auto md:min-h-[480px] overflow-hidden bg-kawai-black">
                        {featuredVideoId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${featuredVideoId}?autoplay=1&mute=1&loop=1&playlist=${featuredVideoId}&controls=0&rel=0&playsinline=1&modestbranding=1`}
                            allow="autoplay; encrypted-media"
                            title={featuredPost.title}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '56.25vw', border: 'none' }}
                          />
                        ) : featuredImageUrl ? (
                          <Image
                            src={featuredImageUrl}
                            alt={featuredPost.title}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 60vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-kawai-pearl flex items-center justify-center">
                            <span className="text-kawai-neutral text-6xl select-none">♪</span>
                          </div>
                        )}
                      </div>

                      {/* Content — right 40% */}
                      <div className="flex flex-col justify-center p-10 lg:p-14">
                        {/* Category + featured badge + date */}
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                          {featuredCategories[0] && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-widest bg-kawai-red text-white font-[family-name:var(--font-brand-sans)]">
                              {featuredCategories[0].title}
                            </span>
                          )}
                          {heroIsFeatured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-widest bg-kawai-black text-white font-[family-name:var(--font-brand-sans)]">
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
                          {featuredDate && (
                            <time
                              dateTime={featuredPost.publishedDate ?? undefined}
                              className="text-xs text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]"
                            >
                              {featuredDate}
                            </time>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-4xl font-[family-name:var(--font-brand-serif)] font-semibold text-kawai-black leading-tight mb-5 transition-colors duration-200 group-hover:text-kawai-red">
                          {featuredPost.title}
                        </h2>

                        {/* Excerpt */}
                        {featuredPost.excerpt && (
                          <p className="text-kawai-charcoal/70 font-[family-name:var(--font-brand-sans)] leading-relaxed line-clamp-3 mb-8">
                            {featuredPost.excerpt}
                          </p>
                        )}

                        {/* CTA */}
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-kawai-red font-[family-name:var(--font-brand-sans)] group-hover:gap-3 transition-all duration-200">
                          Read Story
                          <svg
                            viewBox="0 0 10 10"
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 5h8M5.5 1.5 9 5l-3.5 3.5" />
                          </svg>
                        </span>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* ── Grid Posts ── */}
            {gridPosts.length > 0 && (
              <div>
                <motion.div
                  className="flex items-center gap-4 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.25, ease: EASE_PIANO }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
                    Latest Stories
                  </span>
                  <div className="flex-1 h-px bg-kawai-neutral" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map((post, i) => (
                    <BlogCardAnimated key={post.id} post={post} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
