'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { Media } from '@/payload-types'

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
}

export interface NewsItem {
  title: string
  description: string
  image?: Media | string | null
  category: string
  link?: string
}

interface NewsMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  isHeaderScrolled?: boolean
  newsItems?: NewsItem[]
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
    ? 'calc(112px + var(--announcement-bar-height, 0px))'
    : 'calc(128px + var(--announcement-bar-height, 0px))'

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
            maxHeight: isHeaderScrolled ? 'calc(100vh - 112px)' : 'calc(100vh - 128px)',
            overflowY: 'auto',
            transformOrigin: 'top center',
            boxShadow: '0 40px 80px -16px rgba(30,27,22,0.25)',
          }}
        >
          <div
            className="grid grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr]"
            style={{ minHeight: 'min(480px, 56vh)' }}
          >

            {/* ── LEFT: minimal editorial panel ── */}
            <div className="relative flex flex-col justify-between bg-kawai-black px-8 py-10">
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

              {/* CTA */}
              <Link
                href="/blog"
                onClick={onClose}
                className="group inline-flex items-center gap-2 self-start"
              >
                <span
                  className="text-kawai-pearl/45 group-hover:text-kawai-pearl transition-colors duration-300 font-[family-name:var(--font-brand-sans)] uppercase"
                  style={{ fontSize: '10px', letterSpacing: '0.22em', fontWeight: 600 }}
                >
                  All Stories
                </span>
                <ArrowUpRight className="h-3 w-3 text-kawai-red transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
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
                      <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 1280px) 80vw, 85vw"
                        priority={currentIndex === 0}
                      />
                    </div>

                    {/* Single gradient — bottom only, clean */}
                    <div className="absolute inset-0 bg-gradient-to-t from-kawai-black/75 via-kawai-black/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-8 left-8 z-10">
                      <span
                        className="bg-kawai-red text-white font-[family-name:var(--font-brand-sans)] uppercase px-3 py-1"
                        style={{ fontSize: '9px', letterSpacing: '0.28em', fontWeight: 700 }}
                      >
                        {current.category}
                      </span>
                    </div>

                    {/* Text content */}
                    <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 z-10">
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

              {/* ── Nav controls: arrows + dots together, bottom-right ── */}
              <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
                {/* Dots */}
                {articles.length > 1 && (
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
                )}

                {/* Arrows */}
                {articles.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.preventDefault(); goToPrev() }}
                      className="w-8 h-8 border border-white/20 hover:border-white/50 hover:bg-white/8 flex items-center justify-center transition-all duration-300"
                      aria-label="Previous story"
                    >
                      <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); goToNext() }}
                      className="w-8 h-8 border border-white/20 hover:border-white/50 hover:bg-white/8 flex items-center justify-center transition-all duration-300"
                      aria-label="Next story"
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
