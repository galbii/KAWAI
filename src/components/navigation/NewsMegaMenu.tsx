'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

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

interface NewsMegaMenuProps {
  /** Whether the menu is currently open */
  isOpen: boolean
  /** Callback when menu should close */
  onClose: () => void
  /** Optional CSS class */
  className?: string
}

// ============================================================================
// News Articles Data (Placeholder - will be replaced with CMS data)
// ============================================================================

const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'KAWAI at NAMM 2026',
    excerpt: 'Experience exclusive piano innovations and live artist performances at our booth',
    category: 'Events',
    date: 'January 2026',
    image: '/images/namm/general/TK7_7390.jpg',
    link: '/namm-2026',
    featured: true,
  },
  {
    id: '2',
    title: 'New Artist Partnerships',
    excerpt: 'Renowned pianists join the KAWAI family',
    category: 'Artists',
    date: 'Coming Soon',
    image: '/images/defaults/piano-fallback.jpg',
    link: '/news',
  },
  {
    id: '3',
    title: 'Innovation Spotlight',
    excerpt: 'Latest advancements in piano technology',
    category: 'Technology',
    date: 'Coming Soon',
    image: '/images/defaults/piano-fallback.jpg',
    link: '/news',
  },
]

// ============================================================================
// Component
// ============================================================================

/**
 * NewsMegaMenu - Full-width mega menu for news navigation
 *
 * Features:
 * - Featured news card with glassmorphism design
 * - Grid of recent news articles
 * - Category badges matching carousel style
 * - Elegant hover effects
 *
 * @example
 * ```tsx
 * <NewsMegaMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 * />
 * ```
 */
export function NewsMegaMenu({
  isOpen,
  onClose,
  className,
}: NewsMegaMenuProps) {
  const featuredArticle = newsArticles.find(article => article.featured) || newsArticles[0]

  // Don't render if no articles available
  if (!featuredArticle) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="news-mega-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'fixed left-0 right-0 z-50',
            'bg-white border-t border-b border-gray-200/50 shadow-2xl',
            'transition-[top] duration-300 ease-in-out',
            className
          )}
          style={{
            top: 'var(--header-height, 80px)',
            width: '100vw',
            maxHeight: 'calc(100vh - var(--header-height, 80px) - 20px)',
            overflowY: 'auto',
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {/* Header */}
            <div className="mb-4 lg:mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-kawai-black mb-1">
                Latest News & Updates
              </h2>
              <p className="text-xs lg:text-sm text-gray-600">
                Stay informed about KAWAI innovations, events, and artist spotlights
              </p>
            </div>

            {/* Featured Article - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-6 lg:mb-8"
            >
              <Link
                href={featuredArticle.link}
                onClick={onClose}
                className="group block relative h-[min(350px,40vh)] rounded-2xl overflow-hidden bg-gray-900"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                    priority
                  />
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/80 via-kawai-black/40 to-kawai-black/20" />

                {/* Category Badge - Top Right */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase bg-kawai-red/90 backdrop-blur-sm text-white rounded-full shadow-lg border border-white/10">
                    {featuredArticle.category}
                  </span>
                </div>

                {/* Content - Bottom with Glassmorphism */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3 transition-all duration-300 group-hover:bg-white/15">
                    {/* Label */}
                    <div className="flex items-center gap-2 text-xs text-kawai-pearl tracking-[0.15em] uppercase font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{featuredArticle.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-light font-serif text-white leading-tight">
                      {featuredArticle.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-white/90 leading-relaxed">
                      {featuredArticle.excerpt}
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

            {/* Footer - View All Link */}
            <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-200 text-center">
              <Link
                href="/news"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 font-medium transition-colors"
              >
                <span>View All News & Updates</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
