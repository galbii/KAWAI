'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { Media } from '@/payload-types'
import type { LatestPost } from '@/components/layout/header'

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

// ============================================================================
// Types
// ============================================================================

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  link: string
  videoUrl?: string | null
}

export interface NewsItem {
  title: string
  description: string
  image?: Media | string | null
  category: string
  link?: string
  videoUrl?: string | null
}

interface NewsMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  isHeaderScrolled?: boolean
  newsItems?: NewsItem[]
  latestPosts?: LatestPost[]
}

// ============================================================================
// Helper
// ============================================================================

function transformNewsItem(item: NewsItem, index: number): NewsArticle {
  let imageUrl = '/images/defaults/piano-fallback.jpg'
  if (item.image) {
    if (typeof item.image === 'string') {
      imageUrl = item.image
    } else if (item.image.url) {
      imageUrl = item.image.url
    }
  }
  return {
    id: `news-${index}`,
    title: item.title,
    excerpt: item.description,
    category: item.category,
    image: imageUrl,
    link: item.link || '/blog',
    videoUrl: item.videoUrl ?? null,
  }
}

// ============================================================================
// Component
// ============================================================================

export function NewsMegaMenu({
  isOpen,
  onClose,
  className,
  isHeaderScrolled = false,
  newsItems = [],
  latestPosts = [],
}: NewsMegaMenuProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const articles = newsItems.map(transformNewsItem)

  if (articles.length === 0) return null

  const current = articles[currentIndex]
  if (!current) return null

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const goToPrev = () => goTo(currentIndex === 0 ? articles.length - 1 : currentIndex - 1)
  const goToNext = () => goTo((currentIndex + 1) % articles.length)

  if (!isOpen && currentIndex !== 0) setCurrentIndex(0)

  const topOffset = isHeaderScrolled
    ? 'calc(112px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'
    : 'calc(128px + var(--announcement-bar-height, 0px) + var(--admin-bar-height, 0px))'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="news-mega-menu"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0, top: topOffset }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed left-0 right-0 z-[60]',
            'border-b border-kawai-neutral',
            className,
          )}
          style={{
            maxHeight: isHeaderScrolled ? 'calc(100vh - 112px - var(--admin-bar-height, 0px))' : 'calc(100vh - 128px - var(--admin-bar-height, 0px))',
            overflowY: 'auto',
            transformOrigin: 'top center',
            boxShadow: '0 40px 80px -16px rgba(30,27,22,0.25)',
          }}
        >
          {/* ── Main two-column layout ── */}
          <div
            className="grid grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]"
            style={{ minHeight: 'min(300px, 38vh)' }}
          >

            {/* ── LEFT: editorial panel ── */}
            <div className="relative flex flex-col justify-start bg-kawai-black px-8 py-10">
              {/* Red left rule */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-kawai-red" />

              {/* Heading */}
              <div>
                <p
                  className="text-kawai-red font-[family-name:var(--font-brand-sans)] mb-6"
                  style={{ fontSize: '9px', letterSpacing: '0.35em', fontWeight: 700 }}
                >
                  KAWAI
                </p>
                <h2
                  className="text-kawai-pearl"
                  style={{
                    fontFamily: 'var(--font-brand-luxury)',
                    fontSize: 'clamp(2.8rem, 4vw, 3.6rem)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    lineHeight: 0.92,
                  }}
                >
                  Latest<br />News
                </h2>
              </div>

            </div>

            {/* ── RIGHT: full-bleed carousel ── */}
            <div className="relative overflow-hidden bg-kawai-black">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <Link
                    href={current.link}
                    onClick={onClose}
                    className="group block relative h-full"
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      {current.videoUrl ? (
                        /* Auto-playing muted video background */
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(current.videoUrl)}?autoplay=1&mute=1&loop=1&playlist=${getYouTubeId(current.videoUrl)}&controls=0&rel=0&playsinline=1&modestbranding=1`}
                          allow="autoplay; encrypted-media"
                          title={current.title}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '56.25vw', border: 'none' }}
                        />
                      ) : (
                        <Image
                          src={current.image}
                          alt={current.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 1280px) 80vw, 85vw"
                          priority={currentIndex === 0}
                        />
                      )}
                    </div>

                    {/* Gradient — radial-style vignette for centered text legibility */}
                    <div className="absolute inset-0 bg-kawai-black/50" />

                    {/* Text content — centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 z-10">
                      <span
                        className="bg-kawai-red text-white font-[family-name:var(--font-brand-sans)] uppercase px-3 py-1 mb-5 inline-block"
                        style={{ fontSize: '9px', letterSpacing: '0.28em', fontWeight: 700 }}
                      >
                        {current.category}
                      </span>

                      <h3
                        className="text-white mb-3 leading-tight"
                        style={{
                          fontFamily: 'var(--font-brand-luxury)',
                          fontSize: 'clamp(1.7rem, 2.6vw, 2.5rem)',
                          fontWeight: 300,
                          letterSpacing: '-0.02em',
                          maxWidth: '70%',
                        }}
                      >
                        {current.title}
                      </h3>

                      <p
                        className="text-white/60 mb-5 line-clamp-2 font-[family-name:var(--font-brand-sans)]"
                        style={{ fontSize: '13px', maxWidth: '55%', lineHeight: 1.6 }}
                      >
                        {current.excerpt}
                      </p>

                      <div
                        className="inline-flex items-center gap-2 text-kawai-red font-[family-name:var(--font-brand-sans)] uppercase"
                        style={{ fontSize: '10px', letterSpacing: '0.2em', fontWeight: 600 }}
                      >
                        <span>Read Story</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Nav controls: dots + arrows, bottom-right */}
              {articles.length > 1 && (
                <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {articles.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Go to story ${i + 1}`}
                        className={cn(
                          'rounded-full transition-all duration-300',
                          i === currentIndex
                            ? 'w-5 h-1.5 bg-kawai-red'
                            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60',
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.preventDefault(); goToPrev() }}
                      className="w-8 h-8 border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition-all duration-300"
                      aria-label="Previous story"
                    >
                      <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); goToNext() }}
                      className="w-8 h-8 border border-white/20 hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition-all duration-300"
                      aria-label="Next story"
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Latest posts strip ── */}
          {latestPosts.length > 0 && (
            <div className="bg-white border-t border-kawai-neutral">
              {/* Section label row */}
              <div className="px-8 pt-5 pb-4 flex items-center gap-4">
                <span
                  className="text-kawai-charcoal/40 font-[family-name:var(--font-brand-sans)] uppercase"
                  style={{ fontSize: '9px', letterSpacing: '0.35em', fontWeight: 600 }}
                >
                  From the blog
                </span>
                <div className="flex-1 h-px bg-kawai-neutral" />
              </div>

              {/* Cards */}
              <div
                className="grid px-6 gap-5"
                style={{ gridTemplateColumns: `repeat(${latestPosts.length}, 1fr)` }}
              >
                {latestPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    className="group flex flex-col"
                  >
                    {/* Thumbnail / Video */}
                    {(() => {
                      const videoId = post.heroVideoUrl ? getYouTubeId(post.heroVideoUrl) : null
                      return (
                        /* padding-bottom trick: height = 56.25% × width → reliable 16:9 in any flex/grid context */
                        <div
                          className="relative overflow-hidden w-full mb-3 bg-kawai-black"
                          style={{ height: 0, paddingBottom: '56.25%' }}
                        >
                          {videoId ? (
                            /* Auto-playing muted embed — pointer-events-none so the <Link> still navigates on click.
                               iframe fills the padding-box exactly: inset-0 spans top-padding-edge to bottom-padding-edge */
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&playsinline=1&modestbranding=1`}
                              allow="autoplay; encrypted-media"
                              title={post.title}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                pointerEvents: 'none',
                              }}
                            />
                          ) : post.featuredImage ? (
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                              sizes="(max-width: 1280px) 25vw, 300px"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-kawai-neutral/60" />
                          )}
                          {/* Subtle darkening on hover */}
                          <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/10 transition-colors duration-300" />
                        </div>
                      )
                    })()}

                    {/* Text below image */}
                    <div className="flex flex-col gap-1.5">
                      {post.category && (
                        <span
                          className="text-kawai-red font-[family-name:var(--font-brand-sans)] uppercase"
                          style={{ fontSize: '8px', letterSpacing: '0.28em', fontWeight: 700 }}
                        >
                          {post.category}
                        </span>
                      )}
                      <p
                        className="text-kawai-black group-hover:text-kawai-charcoal transition-colors duration-200 line-clamp-2 leading-snug"
                        style={{
                          fontFamily: 'var(--font-brand-luxury)',
                          fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
                          fontWeight: 400,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {post.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* All Stories CTA — below blog cards */}
              <div className="px-6 py-5 border-t border-kawai-neutral">
                <Link
                  href="/blog"
                  onClick={onClose}
                  className="group inline-flex items-center gap-3 bg-kawai-red hover:bg-kawai-red-700 text-white px-5 py-3 transition-all duration-300"
                >
                  <span
                    className="font-[family-name:var(--font-brand-sans)] uppercase"
                    style={{ fontSize: '11px', letterSpacing: '0.2em', fontWeight: 700 }}
                  >
                    All Stories
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                </Link>
              </div>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  )
}
