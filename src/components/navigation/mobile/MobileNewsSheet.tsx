'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Play, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NewsItem } from '@/components/navigation/NewsMegaMenu'
import type { LatestPost } from '@/components/layout/header'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MobileNewsSheetProps {
  isOpen: boolean
  onBack: () => void
  onNavigate: () => void
  newsItems?: NewsItem[]
  latestPosts?: LatestPost[]
}

interface ArticleEntry {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  link: string
  isVideo: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeThumb(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null
}

function buildArticles(newsItems: NewsItem[], latestPosts: LatestPost[]): ArticleEntry[] {
  const from_news: ArticleEntry[] = newsItems.map((item, i) => {
    let image = '/images/defaults/piano-fallback.jpg'
    if (item.image) {
      if (typeof item.image === 'string') image = item.image
      else if (typeof item.image === 'object' && 'url' in item.image && item.image.url) image = item.image.url
    }
    const isVideo = Boolean('videoUrl' in item && item.videoUrl)
    const videoThumb = isVideo && 'videoUrl' in item && item.videoUrl
      ? getYouTubeThumb(item.videoUrl as string)
      : null
    return {
      id: `news-${i}`,
      title: item.title,
      excerpt: item.description,
      category: item.category,
      image: videoThumb ?? image,
      link: item.link ?? '/blog',
      isVideo,
    }
  })

  const from_posts: ArticleEntry[] = latestPosts
    .filter((p) => !from_news.some((a) => a.link === `/blog/${p.slug}`))
    .map((p) => {
      const isVideo = Boolean(p.heroVideoUrl)
      const videoThumb = isVideo && p.heroVideoUrl ? getYouTubeThumb(p.heroVideoUrl) : null
      return {
        id: p.id,
        title: p.title,
        excerpt: p.excerpt ?? '',
        category: p.category ?? 'Blog',
        image: videoThumb ?? p.featuredImage ?? '/images/defaults/piano-fallback.jpg',
        link: `/blog/${p.slug}`,
        isVideo,
      }
    })

  return [...from_news, ...from_posts]
}

// ─── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ article, onNavigate }: { article: ArticleEntry; onNavigate: () => void }) {
  return (
    <Link
      href={article.link}
      onClick={onNavigate}
      className="flex gap-3 px-4 py-3.5 bg-white rounded-xl border border-kawai-neutral/30 hover:border-kawai-red/30 hover:bg-kawai-pearl/50 transition-all group"
    >
      {/* thumbnail */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-kawai-charcoal">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="80px"
          className="object-cover"
        />
        {article.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        )}
      </div>

      {/* text */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <span className="inline-block px-2 py-0.5 rounded-full bg-kawai-red/10 text-kawai-red text-[10px] font-semibold uppercase tracking-wider mb-1.5">
            {article.category}
          </span>
          <p className="font-semibold text-sm text-kawai-black line-clamp-2 leading-snug group-hover:text-kawai-red transition-colors">
            {article.title}
          </p>
        </div>
        {article.excerpt && (
          <p className="text-xs text-kawai-charcoal/50 line-clamp-1 mt-1">{article.excerpt}</p>
        )}
      </div>

      <ArrowRight className="w-4 h-4 text-kawai-charcoal/20 group-hover:text-kawai-red group-hover:translate-x-0.5 transition-all flex-shrink-0 self-center" />
    </Link>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MobileNewsSheet({
  isOpen,
  onBack,
  onNavigate,
  newsItems = [],
  latestPosts = [],
}: MobileNewsSheetProps) {
  const articles = buildArticles(newsItems, latestPosts)

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9502] bg-black/40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onBack}
          />

          <motion.div
            className="fixed inset-x-0 bottom-0 z-[9503] xl:hidden bg-kawai-pearl rounded-t-2xl shadow-2xl flex flex-col"
            style={{ maxHeight: '92vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }}
          >
            {/* handle */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-kawai-neutral/60" />
            </div>

            {/* header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-kawai-neutral/40">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-kawai-charcoal hover:text-kawai-black transition-colors"
                aria-label="Back to menu"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h2 className="text-base font-bold tracking-tight text-kawai-black">News & Stories</h2>
              <button
                onClick={onNavigate}
                className="p-1.5 rounded-md hover:bg-kawai-neutral/30 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-kawai-charcoal" />
              </button>
            </div>

            {/* article list */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-2">
              {articles.length === 0 ? (
                <div className="text-center py-12 text-kawai-charcoal/40">
                  <p className="text-sm">No articles available</p>
                </div>
              ) : (
                articles.map((article) => (
                  <ArticleCard key={article.id} article={article} onNavigate={onNavigate} />
                ))
              )}

              {/* view all link */}
              <Link
                href="/blog"
                onClick={onNavigate}
                className="flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-xl bg-kawai-black text-white text-sm font-semibold hover:bg-kawai-charcoal transition-colors"
              >
                View All Stories
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
