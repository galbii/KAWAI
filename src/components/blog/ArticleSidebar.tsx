'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, Tag, X, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Post, Category, Product } from '@/payload-types'
import { cn } from '@/lib/utils'
import { ShareButtons } from './ShareButtons'
import { ProductReferenceBlock } from '@/components/blocks/ProductReferenceBlock'

// ─── Social icons ────────────────────────────────────────────────────────────

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('fill-current', className)} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('fill-current', className)} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('fill-current', className)} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('fill-current', className)} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// ─── Utilities ────────────────────────────────────────────────────────────────

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

// ─── Sidebar content (shared between desktop + mobile panel) ─────────────────

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
          className="text-xs text-kawai-muted hover:text-kawai-red transition-colors font-[family-name:var(--font-brand-sans)]"
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

      {/* Follow Kawai */}
      <div className="bg-white border border-kawai-neutral rounded-xl p-5">
        <h3 className="text-xs font-semibold text-kawai-charcoal uppercase tracking-widest mb-4">
          Follow Kawai
        </h3>
        <div className="flex flex-col gap-3.5">
          <a
            href="https://www.instagram.com/kawaipianosus/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
              style={{
                background:
                  'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
              }}
            >
              <InstagramIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors leading-tight">
                @kawaipianosus
              </div>
              <div className="text-xs text-kawai-muted mt-0.5">Instagram</div>
            </div>
          </a>

          <a
            href="https://www.facebook.com/KawaiPianosUS/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <FacebookIcon className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors leading-tight">
                Kawai Pianos US
              </div>
              <div className="text-xs text-kawai-muted mt-0.5">Facebook</div>
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@kawaipianosus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#010101] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <TikTokIcon className="w-[17px] h-[17px] text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors leading-tight">
                @kawaipianosus
              </div>
              <div className="text-xs text-kawai-muted mt-0.5">TikTok</div>
            </div>
          </a>

          <a
            href="https://x.com/KawaiPianosUS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#000000] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <XIcon className="w-[15px] h-[15px] text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-kawai-black group-hover:text-kawai-red transition-colors leading-tight">
                @KawaiPianosUS
              </div>
              <div className="text-xs text-kawai-muted mt-0.5">X / Twitter</div>
            </div>
          </a>
        </div>
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

// ─── Main export ─────────────────────────────────────────────────────────────

interface ArticleSidebarProps {
  post: Post
  className?: string
}

export function ArticleSidebar({ post, className = '' }: ArticleSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Escape key to close
  useEffect(() => {
    if (!drawerOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [drawerOpen])

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <>
      {/* ── Desktop sticky sidebar ─────────────────────────────────────────── */}
      <aside
        className={cn('hidden lg:block w-72 shrink-0 h-full', className)}
        aria-label="Article sidebar"
      >
        <div
          className="sticky space-y-5 overflow-y-auto overscroll-contain scrollbar-hide"
          style={{
            top: 'calc(var(--header-bottom, 120px) + 24px)',
            maxHeight: 'calc(100vh - var(--header-bottom, 120px) - 48px)',
          }}
        >
          <SidebarContent post={post} />
        </div>
      </aside>

      {/* ── Mobile: pull-tab + right-side panel ───────────────────────────── */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9009]"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/*
         * The motion container is the full panel width.
         * When closed: translateX(calc(100% - 40px)) — only the 40px tab is on-screen.
         * When open:   translateX(0)                 — full panel is visible.
         *
         * The first child is the pull tab (40px wide), the second is the panel body.
         */}
        <motion.div
          className="fixed right-0 top-0 h-screen z-[9010] flex w-[min(85vw,320px)]"
          initial={false}
          animate={{ x: drawerOpen ? '0%' : 'calc(100% - 40px)' }}
          transition={{ type: 'spring', damping: 30, stiffness: 340, mass: 0.75 }}
          role={drawerOpen ? 'dialog' : undefined}
          aria-modal={drawerOpen ? true : undefined}
          aria-label="Article sidebar"
        >
          {/* Pull tab — left edge of the motion container, always visible when closed */}
          <div className="w-10 shrink-0 flex items-center justify-center">
            <button
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label={drawerOpen ? 'Close article info' : 'Open article info'}
              aria-expanded={drawerOpen}
              className="w-10 h-[88px] bg-kawai-red rounded-l-xl flex flex-col items-center justify-center gap-2 select-none"
              style={{ boxShadow: '-4px 0 20px rgba(0,0,0,0.30)' }}
            >
              {/* Chevron — rotates 180° when open */}
              <motion.div
                animate={{ rotate: drawerOpen ? 180 : 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="flex items-center justify-center"
              >
                <ChevronLeft className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Vertical label */}
              <span
                className="text-[7.5px] text-white/70 font-bold uppercase tracking-[0.2em] leading-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                aria-hidden="true"
              >
                INFO
              </span>
            </button>
          </div>

          {/* Panel body */}
          <div
            className="flex-1 bg-kawai-pearl flex flex-col h-full"
            style={{ boxShadow: '-10px 0 40px rgba(0,0,0,0.18)' }}
          >
            {/* Panel header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-kawai-neutral/60 bg-kawai-pearl">
              <span className="text-[11px] font-semibold text-kawai-charcoal uppercase tracking-[0.14em]">
                Article Info
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 -mr-1 rounded-full hover:bg-kawai-neutral/60 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4 text-kawai-charcoal" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 pb-10">
              <SidebarContent post={post} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
