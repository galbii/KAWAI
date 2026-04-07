'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Post } from '@/payload-types'
import { BlogCardAnimated } from './BlogCardAnimated'
import { cn } from '@/lib/utils'

const EASE_PIANO = [0.4, 0, 0.2, 1] as const
const VIEWPORT = { once: true, margin: '-60px' } as const

interface BlogLatestClientProps {
  allPosts: Post[]
  pageSize: number
  cols: 2 | 3
  showCta: boolean
  ctaLabel: string
  ctaHref: string
  showSecondaryCta: boolean
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
}

export function BlogLatestClient({
  allPosts,
  pageSize,
  cols,
  showCta,
  ctaLabel,
  ctaHref,
  showSecondaryCta,
  secondaryCtaLabel,
  secondaryCtaHref,
}: BlogLatestClientProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const visiblePosts = allPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allPosts.length
  const remaining = allPosts.length - visibleCount

  const hasCtas = showCta || (showSecondaryCta && secondaryCtaLabel)

  return (
    <>
      <motion.div
        className={
          cols === 2
            ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        }
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.4, ease: EASE_PIANO }}
      >
        {visiblePosts.map((post, i) => (
          <BlogCardAnimated key={post.id} post={post} index={i} />
        ))}
      </motion.div>

      {/* Load more + CTAs — all in one row */}
      {(hasMore || hasCtas) && (
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-14"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, ease: EASE_PIANO }}
        >
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + pageSize)}
              className={cn(
                'inline-flex items-center gap-3 px-10 py-4 rounded-full',
                'border border-kawai-neutral bg-white text-kawai-black',
                'text-base font-semibold font-[family-name:var(--font-brand-sans)] tracking-wide',
                'transition-all duration-300 ease-[var(--ease-piano)]',
                'hover:border-kawai-red hover:text-kawai-red hover:shadow-brand-red-glow',
              )}
            >
              <span>Load more stories</span>
              <span className="text-sm text-kawai-charcoal/40">{remaining} remaining</span>
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
          )}

          {showSecondaryCta && secondaryCtaLabel && (
            <Link
              href={secondaryCtaHref || '#'}
              className={cn(
                'inline-flex items-center gap-2 px-10 py-4 rounded-full',
                'border border-kawai-neutral bg-white text-kawai-black',
                'text-base font-semibold font-[family-name:var(--font-brand-sans)] tracking-wide',
                'transition-all duration-300 ease-[var(--ease-piano)]',
                'hover:border-kawai-red hover:text-kawai-red',
              )}
            >
              {secondaryCtaLabel}
            </Link>
          )}

          {showCta && (
            <Link
              href={ctaHref}
              className={cn(
                'inline-flex items-center gap-2 px-10 py-4 rounded-full',
                'bg-kawai-red text-white',
                'text-base font-semibold font-[family-name:var(--font-brand-sans)] tracking-wide',
                'transition-all duration-300 ease-[var(--ease-piano)]',
                'hover:bg-kawai-red-700 hover:shadow-brand-red-glow',
              )}
            >
              {ctaLabel}
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 5h8M5.5 1.5 9 5l-3.5 3.5" />
              </svg>
            </Link>
          )}
        </motion.div>
      )}
    </>
  )
}
