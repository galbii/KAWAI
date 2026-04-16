'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, Tag, X, Info } from 'lucide-react'
import type { Post, Category, Product } from '@/payload-types'
import { cn } from '@/lib/utils'
import { ShareButtons } from './ShareButtons'
import { ProductReferenceBlock } from '@/components/blocks/ProductReferenceBlock'

interface ArticleSidebarProps {
  post: Post
  className?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function estimateReadTime(post: Post): number {
  const wordCount = post.excerpt?.split(' ').length ?? 100
  return Math.max(2, Math.round(wordCount / 200))
}

function isCategoryObject(cat: string | Category): cat is Category {
  return typeof cat === 'object' && cat !== null && 'title' in cat
}

function findSidebarProduct(post: Post): Product | null {
  if (!Array.isArray(post.layout)) return null
  for (const block of post.layout as Array<{ blockType?: string; product?: unknown }>) {
    if (
      block.blockType === 'product-reference' &&
      typeof block.product === 'object' &&
      block.product !== null
    ) {
      return block.product as Product
    }
  }
  return null
}

function SidebarContent({ post }: { post: Post }) {
  const resolvedCategories = (post.categories ?? []).filter(isCategoryObject)
  const publishDate = post.publishedDate ?? post.updatedAt
  const readTime = estimateReadTime(post)
  const sidebarProduct = findSidebarProduct(post)

  return (
    <div className="space-y-5">
      {/* Header nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-kawai-red hover:text-kawai-red/80 font-medium transition-colors text-sm font-[family-name:var(--font-brand-sans)]"
        >
          <ArrowLeft className="w-4 h-4" />
          News
        </Link>
        <Link
          href="/accessories"
          className="text-xs text-kawai-charcoal/60 hover:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)]"
        >
          Accessories →
        </Link>
      </div>

      {/* About This Post */}
      <div className="bg-white border border-kawai-neutral rounded-xl p-5">
        <h3 className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mb-4">
          About This Post
        </h3>
        <div className="space-y-4">
          {resolvedCategories.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Tag className="w-4 h-4 text-kawai-red mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex flex-wrap gap-1.5">
                {resolvedCategories.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kawai-red/10 text-kawai-red border border-kawai-red/20"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            </div>
          )}
          {publishDate && (
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-kawai-charcoal shrink-0" aria-hidden="true" />
              <span className="text-sm text-kawai-charcoal">{formatDate(publishDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-kawai-charcoal shrink-0" aria-hidden="true" />
            <span className="text-sm text-kawai-charcoal">{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="bg-white border border-kawai-neutral rounded-xl p-5">
        <h3 className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mb-4">
          Share
        </h3>
        <ShareButtons title={post.title} slug={post.slug ?? ''} />
      </div>

      {/* Product promo — only shown if the post references a product */}
      {sidebarProduct && (
        <div>
          <h3 className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mb-3 px-0.5">
            Featured Product
          </h3>
          <div className="-my-1">
            <ProductReferenceBlock
              product={sidebarProduct}
              layout={{ orientation: 'vertical', imageSize: 'medium', backgroundColor: 'white' }}
              display={{ showDescription: false }}
            />
          </div>
        </div>
      )}

      {/* Explore CTA */}
      <div className="bg-kawai-black rounded-xl p-5">
        <h3 className="text-base font-semibold text-white mb-1.5">The Full Collection</h3>
        <p className="text-sm text-white/70 mb-4">Browse all piano insights and stories</p>
        <Link
          href="/blog"
          className={cn(
            'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
            'bg-kawai-red text-white hover:bg-kawai-red-700 transition-colors duration-200',
          )}
        >
          View all posts →
        </Link>
      </div>
    </div>
  )
}

export function ArticleSidebar({ post, className = '' }: ArticleSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* ── Desktop sticky sidebar ── */}
      <aside
        className={cn('hidden lg:block w-72 shrink-0 h-full', className)}
        aria-label="Article sidebar"
      >
        <div
          className="sticky space-y-5"
          style={{ top: 'calc(var(--header-bottom, 120px) + 24px)' }}
        >
          <SidebarContent post={post} />
        </div>
      </aside>

      {/* ── Mobile: floating trigger button ── */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open article info"
          className="flex items-center gap-2 px-4 py-2.5 bg-kawai-black/90 backdrop-blur text-white rounded-full shadow-brand-premium text-[11px] font-bold font-[family-name:var(--font-brand-sans)] uppercase tracking-[0.12em]"
        >
          <Info className="w-3.5 h-3.5" />
          Article Info
        </button>
      </div>

      {/* ── Mobile: slide-up drawer ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Article sidebar"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-kawai-pearl rounded-t-2xl max-h-[85vh] flex flex-col">
            {/* Drag handle + header */}
            <div className="sticky top-0 bg-kawai-pearl/95 backdrop-blur-sm pt-3 pb-3 px-5 flex items-center justify-between border-b border-kawai-neutral/50 rounded-t-2xl shrink-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-kawai-neutral rounded-full" />
              <span className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mt-1">
                Article Info
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 -mr-1 rounded-full hover:bg-kawai-neutral/60 transition-colors mt-1"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4 text-kawai-charcoal" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto p-5 pb-8">
              <SidebarContent post={post} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
