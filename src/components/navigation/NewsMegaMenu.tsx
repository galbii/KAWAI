'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

import type { Media } from '@/payload-types'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  link: string
  featured?: boolean
}

export interface NewsItem {
  title: string
  description: string
  image?: Media | string | null
  category: string
  link?: string
}

interface NewsMegaMenuProps {
  /** Whether the menu is currently open */
  isOpen: boolean
  /** Callback when menu should close */
  onClose: () => void
  /** Optional CSS class */
  className?: string
  /** Whether the header is in scrolled (compact) state */
  isHeaderScrolled?: boolean
  /** News items from CMS (HomePage collection) */
  newsItems?: NewsItem[]
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert CMS NewsItem to display format for mega menu
 */
function transformNewsItem(item: NewsItem, index: number): NewsArticle {
  // Extract image URL from Media object or use string directly
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
    date: 'Latest', // CMS doesn't have date field currently
    image: imageUrl,
    link: item.link || '/news',
    featured: index === 0, // First item is featured
  }
}

// ============================================================================
// Component
// ============================================================================

/**
 * NewsMegaMenu - Full-width mega menu for news navigation
 *
 * Features:
 * - Featured news card with glassmorphism design
 * - Pulls news from HomePage collection news tab
 * - Category badges matching carousel style
 * - Elegant hover effects
 *
 * @example
 * ```tsx
 * <NewsMegaMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   newsItems={newsItemsFromCMS}
 * />
 * ```
 */
export function NewsMegaMenu({
  isOpen,
  onClose,
  className,
  isHeaderScrolled = false,
  newsItems = [],
}: NewsMegaMenuProps) {
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0)

  // Transform CMS news items to display format
  const newsArticles = newsItems.map(transformNewsItem)

  // Don't render if no articles available
  if (newsArticles.length === 0) {
    return null
  }

  const currentArticle = newsArticles[currentIndex]

  // Type guard: Ensure currentArticle exists (required for strict TypeScript)
  if (!currentArticle) {
    return null
  }

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? newsArticles.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % newsArticles.length)
  }

  // Reset to first slide when menu closes
  if (!isOpen && currentIndex !== 0) {
    setCurrentIndex(0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="news-mega-menu"
          initial={{ opacity: 0, scaleY: 0.95, y: -20 }}
          animate={{
            opacity: 1,
            scaleY: 1,
            y: 0,
            top: isHeaderScrolled
              ? 'calc(112px + var(--announcement-bar-height, 0px))'
              : 'calc(128px + var(--announcement-bar-height, 0px))',
          }}
          exit={{ opacity: 0, scaleY: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            'fixed left-0 right-0 z-[60]',
            'bg-kawai-pearl border-b border-kawai-neutral shadow-2xl',
            className
          )}
          style={{
            maxHeight: isHeaderScrolled ? 'calc(100vh - 112px - 20px)' : 'calc(100vh - 128px - 20px)',
            overflowY: 'auto',
            transformOrigin: 'top center',
          }}
        >
          {/* Full-bleed editorial header — title + "The Newsroom" CTA */}
          <div className="bg-kawai-pearl border-b border-kawai-neutral">
            <div className="container mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-6">
              {/* Left: red accent bar + heading */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-px h-12 bg-kawai-red shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-3xl lg:text-5xl font-bold text-kawai-black leading-tight mb-0.5">
                    Latest News &amp; Updates
                  </h2>
                  <p className="text-sm text-kawai-charcoal/60 leading-snug">
                    Stay informed about KAWAI innovations, events, and artist spotlights
                  </p>
                </div>
              </div>

              {/* Right: prominent white pill button */}
              <Link
                href="/blog"
                onClick={onClose}
                className="group inline-flex items-center gap-2.5 bg-kawai-black hover:bg-kawai-charcoal text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shrink-0 shadow-lg hover:shadow-xl hover:-translate-y-px"
              >
                View all posts
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {/* News Carousel - Full Width */}
            <div className="mb-6 lg:mb-8 relative">
              {/* Carousel Container */}
              <div className="relative h-[min(350px,40vh)] rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait" custom={currentIndex}>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Link
                      href={currentArticle.link}
                      onClick={onClose}
                      className="group block relative h-full bg-gray-900"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={currentArticle.image}
                          alt={currentArticle.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="100vw"
                          priority={currentIndex === 0}
                        />
                      </div>

                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-kawai-black/20" />

                      {/* Category Badge - Top Right */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-block px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase bg-kawai-red/90 backdrop-blur-sm text-white rounded-full shadow-lg border border-white/10">
                          {currentArticle.category}
                        </span>
                      </div>

                      {/* Content - Bottom with Glassmorphism */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3 transition-all duration-300 group-hover:bg-white/15">
                          {/* Label */}
                          <div className="flex items-center gap-2 text-xs text-kawai-pearl tracking-[0.15em] uppercase font-medium">
                            <Calendar className="h-3 w-3" />
                            <span>{currentArticle.date}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl lg:text-3xl font-light font-serif text-white leading-tight">
                            {currentArticle.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-white/90 leading-relaxed">
                            {currentArticle.excerpt}
                          </p>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-white font-medium text-sm pt-2">
                            <span>Read Full Story</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows - Only show if multiple items */}
                {newsArticles.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        goToPrevious()
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                      aria-label="Previous news item"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        goToNext()
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                      aria-label="Next news item"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Navigation Dots - Only show if multiple items */}
              {newsArticles.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {newsArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'transition-all duration-300 rounded-full',
                        index === currentIndex
                          ? 'w-8 h-2 bg-kawai-red shadow-md'
                          : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                      )}
                      aria-label={`Go to news item ${index + 1}`}
                      aria-current={index === currentIndex}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
