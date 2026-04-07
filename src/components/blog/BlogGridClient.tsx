'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Post } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/payload'
import { BlogCardAnimated } from './BlogCardAnimated'
import { cn } from '@/lib/utils'

export interface BlogGridClientProps {
  heading: string
  tagline: string
  featuredPost: Post | null
  heroIsFeatured: boolean
  /** All grid posts (pre-fetched); client paginates these */
  allGridPosts: Post[]
  /** How many posts to show per page / per "Load More" click */
  pageSize: number
  showFeatured: boolean
  showHeading: boolean
  youtubeUrl?: string | null
}

/** Extract the 11-char video ID from any standard YouTube URL */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

const EASE_PIANO = [0.4, 0, 0.2, 1] as const
const VIEWPORT = { once: true, margin: '-60px' } as const

export function BlogGridClient({
  heading,
  tagline,
  featuredPost,
  heroIsFeatured,
  allGridPosts,
  pageSize,
  showFeatured,
  showHeading,
  youtubeUrl,
}: BlogGridClientProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const gridPosts = allGridPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allGridPosts.length

  const hasPosts = featuredPost !== null || allGridPosts.length > 0
  const videoId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null

  const featuredImageUrl = featuredPost ? resolveMediaUrl(featuredPost.featuredImage) : null
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
    <section className="bg-kawai-pearl py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        {showHeading && (
          <div className={cn('relative mb-14 overflow-hidden', videoId && 'bg-kawai-black -mx-4 sm:-mx-6 lg:-mx-8')}>
            {/* YouTube video background */}
            {videoId && (
              <>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0`}
                    allow="autoplay; encrypted-media"
                    title="Background video"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ width: '100vw', height: '56.25vw', minHeight: '100%', minWidth: '177.78vh' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-kawai-black/90 via-kawai-black/70 to-kawai-black/40 pointer-events-none" />
              </>
            )}

            <motion.div
              className={cn('relative', videoId ? 'px-4 sm:px-6 lg:px-8 py-16' : 'pb-10')}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE_PIANO }}
            >
              {/* Heading */}
              <h2 className={cn(
                'text-5xl lg:text-7xl font-[family-name:var(--font-brand-serif)] font-semibold leading-[1.0] tracking-tight mb-5',
                videoId ? 'text-white' : 'text-kawai-black',
              )}>
                {heading}
              </h2>

              {/* Tagline */}
              <p className={cn(
                'text-base font-[family-name:var(--font-brand-sans)] leading-relaxed max-w-lg',
                videoId ? 'text-white/50' : 'text-kawai-charcoal/60',
              )}>
                {tagline || 'Stories from the studio, the stage, and the showroom.'}
              </p>

              {/* Rule */}
              <div className="flex items-center mt-8">
                <div className="w-10 h-px bg-kawai-red" />
                <div className={cn('flex-1 h-px', videoId ? 'bg-white/15' : 'bg-kawai-neutral')} />
              </div>
            </motion.div>
          </div>
        )}

        {!hasPosts ? (
          /* ── Empty State ── */
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE_PIANO }}
          >
            <div className="w-10 h-0.5 bg-kawai-red mb-8" />
            <h3 className="text-3xl font-[family-name:var(--font-brand-serif)] text-kawai-black mb-4">
              No stories yet
            </h3>
            <p className="text-kawai-charcoal/60 font-[family-name:var(--font-brand-sans)] max-w-sm">
              We&apos;re composing our first notes. Check back soon for articles, guides, and artist
              spotlights.
            </p>
          </motion.div>
        ) : (
          <>
            {/* ── Featured Hero Post ── */}
            {showFeatured && featuredPost && (
              <div className="mb-20">
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.4, ease: EASE_PIANO }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-kawai-red font-[family-name:var(--font-brand-sans)]">
                    Featured
                  </span>
                  <div className="flex-1 h-px bg-kawai-neutral" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.7, ease: EASE_PIANO }}
                >
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <article className="grid md:grid-cols-[3fr_2fr] gap-0 bg-white rounded-2xl border border-kawai-neutral overflow-hidden transition-all duration-300 ease-[var(--ease-piano)] hover:shadow-brand-premium">
                      {/* Image — left 60% */}
                      <div className="relative w-full aspect-[4/3] md:aspect-auto md:min-h-[480px] overflow-hidden bg-kawai-pearl">
                        {featuredImageUrl ? (
                          <Image
                            src={featuredImageUrl}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 60vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-kawai-pearl flex items-center justify-center">
                            <Image
                              src="/images/kawai-logo-red-1x.png"
                              alt="KAWAI"
                              fill
                              className="object-contain p-16"
                              sizes="(max-width: 768px) 100vw, 60vw"
                            />
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
                        <h3 className="text-3xl lg:text-4xl font-[family-name:var(--font-brand-serif)] font-semibold text-kawai-black leading-tight mb-5 transition-colors duration-200 group-hover:text-kawai-red">
                          {featuredPost.title}
                        </h3>

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
                  whileInView={{ opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.4, ease: EASE_PIANO }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-kawai-charcoal/50 font-[family-name:var(--font-brand-sans)]">
                    Latest Stories
                  </span>
                  <div className="flex-1 h-px bg-kawai-neutral" />
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.4, ease: EASE_PIANO }}
                >
                  {gridPosts.map((post, i) => (
                    <BlogCardAnimated key={post.id} post={post} index={i} />
                  ))}
                </motion.div>

                {/* Load More */}
                {hasMore && (
                  <motion.div
                    className="flex justify-center mt-14"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.4, ease: EASE_PIANO }}
                  >
                    <button
                      onClick={() => setVisibleCount((c) => c + pageSize)}
                      className={cn(
                        'inline-flex items-center gap-3 px-8 py-3.5 rounded-full',
                        'border border-kawai-neutral bg-white text-kawai-black',
                        'text-sm font-semibold font-[family-name:var(--font-brand-sans)] tracking-wide',
                        'transition-all duration-300 ease-[var(--ease-piano)]',
                        'hover:border-kawai-red hover:text-kawai-red hover:shadow-brand-red-glow',
                      )}
                    >
                      <span>Load more stories</span>
                      <span className="text-xs text-kawai-charcoal/40">
                        {allGridPosts.length - visibleCount} remaining
                      </span>
                      <svg
                        viewBox="0 0 16 16"
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M8 3v10M3 8l5 5 5-5" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
