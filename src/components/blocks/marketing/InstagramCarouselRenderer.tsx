"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import type { MarketingInstagramCarouselBlock } from '@/payload-types'
import { cn } from '@/lib/utils'

interface InstagramCarouselRendererProps extends MarketingInstagramCarouselBlock {}

function isValidInstagramUrl(url: string | null | undefined): url is string {
  if (!url) return false
  return /^https?:\/\/(www\.)?instagram\.com\/(p|reels?|tv)\/[\w-]+\/?$/.test(url)
}

const themeClasses = {
  light: 'bg-kawai-pearl text-kawai-charcoal',
  dark: 'bg-kawai-charcoal text-kawai-pearl',
  red: 'bg-gradient-to-br from-kawai-red/10 to-kawai-red/5 text-kawai-charcoal',
  transparent: 'bg-transparent text-kawai-charcoal',
}

const spacingClasses = {
  compact: 'py-12 sm:py-16',
  comfortable: 'py-16 sm:py-24',
  spacious: 'py-24 sm:py-32 lg:py-40',
}

const GAP = 20

export function InstagramCarouselRenderer({
  heading,
  subheading,
  instagramHandle,
  posts,
  settings,
  styling,
  ctaButton,
}: InstagramCarouselRendererProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const validPosts = (posts ?? []).filter((post) => isValidInstagramUrl(post.instagramUrl))
  const totalPosts = validPosts.length
  const maxIndex = Math.max(0, totalPosts - 1)

  const autoPlay = settings?.autoPlay ?? false
  const autoPlayDuration = settings?.autoPlayDuration ?? 8000
  const enableLoop = settings?.enableLoop ?? true
  const showNavigationArrows = settings?.showNavigationArrows ?? true
  const showProgressIndicator = settings?.showProgressIndicator ?? true
  const enableKeyboardNav = settings?.enableKeyboardNav ?? true
  const enableTouchSwipe = settings?.enableTouchSwipe ?? true
  const theme = styling?.theme ?? 'light'
  const spacing = styling?.spacing ?? 'comfortable'

  // Responsive layout
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const count = w >= 1024 ? 3 : w >= 640 ? 2 : 1
      setVisibleCount(count)
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const cardWidth =
    containerWidth > 0 ? (containerWidth - (visibleCount - 1) * GAP) / visibleCount : 0

  // Center activeIndex in the visible window
  const trackX =
    containerWidth > 0 && cardWidth > 0
      ? -(activeIndex * (cardWidth + GAP)) + (containerWidth / 2 - cardWidth / 2)
      : 0

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) =>
      enableLoop ? (prev === 0 ? maxIndex : prev - 1) : Math.max(prev - 1, 0),
    )
  }, [maxIndex, enableLoop])

  const goToNext = useCallback(() => {
    setActiveIndex((prev) =>
      enableLoop ? (prev + 1) % totalPosts : Math.min(prev + 1, maxIndex),
    )
  }, [totalPosts, maxIndex, enableLoop])

  // Auto-play
  useEffect(() => {
    if (!autoPlay || !isInView || totalPosts <= 1 || isHovered) return
    const timer = setTimeout(goToNext, autoPlayDuration)
    return () => clearTimeout(timer)
  }, [autoPlay, isInView, activeIndex, isHovered, autoPlayDuration, goToNext, totalPosts])

  // Keyboard nav
  useEffect(() => {
    if (!enableKeyboardNav) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [enableKeyboardNav, goToPrevious, goToNext])

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    setTouchEnd(null)
    if (e.targetTouches[0]) setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!enableTouchSwipe) return
    if (e.targetTouches[0]) setTouchEnd(e.targetTouches[0].clientX)
  }
  const onTouchEnd = () => {
    if (!enableTouchSwipe || !touchStart || !touchEnd) return
    const d = touchStart - touchEnd
    if (d > 50) goToNext()
    else if (d < -50) goToPrevious()
  }

  if (totalPosts === 0) return null

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full overflow-hidden',
        themeClasses[theme as keyof typeof themeClasses] ?? themeClasses.light,
        spacingClasses[spacing as keyof typeof spacingClasses] ?? spacingClasses.comfortable,
      )}
    >
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        {(heading || subheading || instagramHandle) && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 sm:mb-16 space-y-4"
          >
            {instagramHandle && (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-[14px] h-[14px] text-kawai-red"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span className="text-[11px] font-medium tracking-[0.22em] uppercase opacity-50">
                  {instagramHandle}
                </span>
              </div>
            )}

            {heading && (
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[family-name:var(--font-brand-luxury)] font-light tracking-tight leading-none">
                {heading}
              </h2>
            )}

            {subheading && (
              <p className="text-sm sm:text-base text-current/55 max-w-xl mx-auto leading-relaxed tracking-wide">
                {subheading}
              </p>
            )}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-px w-16 mx-auto bg-kawai-red origin-center"
            />
          </motion.div>
        )}

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {containerWidth > 0 && cardWidth > 0 && (
            <motion.div
              className="flex"
              style={{ gap: `${GAP}px` }}
              animate={{ x: trackX }}
              transition={{ type: 'spring', stiffness: 300, damping: 38, mass: 0.9 }}
            >
              {validPosts.map((post, index) => {
                const diff = Math.abs(index - activeIndex)
                const isActive = diff === 0
                const isSide = diff === 1
                const isPeek = diff === 2

                return (
                  <motion.div
                    key={index}
                    style={{ width: cardWidth, flexShrink: 0 }}
                    animate={{
                      opacity: isActive ? 1 : isSide ? 0.6 : isPeek ? 0.25 : 0.1,
                      scale: isActive ? 1 : isSide ? 0.972 : 0.95,
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => !isActive && setActiveIndex(index)}
                    className={cn(
                      'relative bg-white rounded-2xl overflow-hidden',
                      isActive
                        ? 'shadow-[0_8px_40px_rgba(0,0,0,0.12)] ring-1 ring-black/5'
                        : 'shadow-[0_4px_20px_rgba(0,0,0,0.07)] cursor-pointer',
                    )}
                  >
                    {/* Active top accent */}
                    <motion.div
                      className="absolute top-0 inset-x-0 h-[3px] bg-kawai-red z-10 origin-left"
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {/* Category badge — only on active */}
                    {post.category && isActive && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-kawai-red text-white text-[10px] font-medium tracking-[0.14em] uppercase rounded-full shadow-md">
                          <span className="w-1 h-1 bg-white/80 rounded-full" />
                          {post.category}
                        </span>
                      </div>
                    )}

                    {/* Instagram iframe */}
                    <div className="relative overflow-hidden" style={{ height: '700px' }}>
                      <iframe
                        src={`${post.instagramUrl}embed/captioned/`}
                        width={cardWidth}
                        style={{
                          height: '830px',
                          border: 'none',
                          display: 'block',
                          marginTop: '-2px',
                        }}
                        frameBorder="0"
                        scrolling="no"
                        allow="encrypted-media"
                        loading="lazy"
                        title={post.caption ?? `Instagram post ${index + 1}`}
                      />
                    </div>

                    {/* Caption */}
                    {post.caption && (
                      <div className="px-4 py-3 border-t border-black/[0.06]">
                        <p className="text-xs text-kawai-charcoal/60 leading-relaxed line-clamp-2 tracking-wide">
                          {post.caption}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Controls row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 sm:mt-10 flex items-center justify-between gap-4"
        >
          {/* Progress strip */}
          {showProgressIndicator && totalPosts > 1 && (
            <div className="flex items-center gap-1.5 flex-1">
              {validPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'h-[3px] rounded-full transition-all duration-500 focus:outline-none',
                    index === activeIndex
                      ? 'w-8 bg-kawai-red shadow-sm shadow-kawai-red/40'
                      : 'w-3 bg-current/15 hover:bg-current/30',
                  )}
                  aria-label={`Go to post ${index + 1}`}
                />
              ))}
              <span className="ml-3 text-[11px] text-current/35 tracking-[0.12em] font-light tabular-nums">
                {activeIndex + 1} / {totalPosts}
              </span>
            </div>
          )}

          {/* Navigation arrows */}
          {showNavigationArrows && totalPosts > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={goToPrevious}
                disabled={!enableLoop && activeIndex === 0}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-full',
                  'border border-current/20',
                  'transition-all duration-300',
                  'hover:border-kawai-red hover:text-kawai-red',
                  'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                  'disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-current/20 disabled:hover:text-current',
                  'group',
                )}
                aria-label="Previous post"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-px"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                disabled={!enableLoop && activeIndex === maxIndex}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-full',
                  'border border-current/20',
                  'transition-all duration-300',
                  'hover:border-kawai-red hover:text-kawai-red',
                  'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
                  'disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-current/20 disabled:hover:text-current',
                  'group',
                )}
                aria-label="Next post"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-px"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.text && ctaButton.url && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex justify-center mt-10 sm:mt-12"
          >
            <Link
              href={ctaButton.url}
              target={ctaButton.openInNewTab ? '_blank' : undefined}
              rel={ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
              className={cn(
                'group relative inline-flex items-center gap-3 overflow-hidden',
                'px-8 py-4 rounded-full',
                'bg-kawai-charcoal text-white',
                'font-medium text-xs tracking-[0.15em] uppercase',
                'transition-all duration-500',
                'hover:bg-kawai-red hover:shadow-xl hover:shadow-kawai-red/20 hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-kawai-red focus:ring-offset-2',
              )}
            >
              <span className="relative z-10">{ctaButton.text}</span>
              <svg
                className="relative z-10 w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
