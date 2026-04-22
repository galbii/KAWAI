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
  const [waveStart, setWaveStart] = useState(0)

  const visiblePosts = allPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allPosts.length

  function loadMore() {
    setWaveStart(visibleCount)
    setVisibleCount((c) => c + pageSize)
  }

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
          <BlogCardAnimated
            key={post.id}
            post={post}
            waveIndex={i >= waveStart ? i - waveStart : -1}
          />
        ))}
      </motion.div>

      {/* Buttons row */}
      {(hasMore || hasCtas) && (
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, ease: EASE_PIANO }}
        >
          {hasMore && (
            <button
              onClick={loadMore}
              className={cn(
                'inline-flex items-center px-8 py-4 rounded-lg',
                'bg-white border border-kawai-neutral text-kawai-black',
                'text-base font-semibold font-[family-name:var(--font-brand-sans)]',
                'transition-all duration-200 ease-[var(--ease-piano)]',
                'hover:border-kawai-charcoal/30 hover:shadow-sm',
              )}
            >
              Load more stories
            </button>
          )}

          {showSecondaryCta && secondaryCtaLabel && (
            <Link
              href={secondaryCtaHref || '#'}
              className={cn(
                'inline-flex items-center px-8 py-4 rounded-lg',
                'bg-white border border-kawai-neutral text-kawai-black',
                'text-base font-semibold font-[family-name:var(--font-brand-sans)]',
                'transition-all duration-200 ease-[var(--ease-piano)]',
                'hover:border-kawai-charcoal/30 hover:shadow-sm',
              )}
            >
              {secondaryCtaLabel}
            </Link>
          )}

          {showCta && (
            <Link
              href={ctaHref}
              className={cn(
                'inline-flex items-center px-8 py-4 rounded-lg',
                'bg-kawai-red text-white',
                'text-base font-semibold font-[family-name:var(--font-brand-sans)]',
                'transition-all duration-200 ease-[var(--ease-piano)]',
                'hover:bg-kawai-red-700',
              )}
            >
              {ctaLabel}
            </Link>
          )}
        </motion.div>
      )}
    </>
  )
}
