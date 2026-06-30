'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionForBrowser } from '@/lib/payload/queries'
import type { NavProduct } from '@/lib/payload/products-navigation'
import { getProductsByCollection } from '@/lib/actions/collection-products'

// ─── Types & Constants ────────────────────────────────────────────────────────

type FilterTab = 'all' | 'digital' | 'upright' | 'hybrid' | 'grand'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',     label: 'All'     },
  { id: 'digital', label: 'Digital' },
  { id: 'upright', label: 'Upright' },
  { id: 'hybrid',  label: 'Hybrid'  },
  { id: 'grand',   label: 'Grand'   },
]

// Exact constants from ProductsMegaMenu — visual parity across the site
const SCROLL_CLASS =
  'flex gap-7 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:#C8C2BA_#EDE9E3] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#EDE9E3] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C2BA] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[#A01829]'

const NAV_BTN_CLASS =
  'absolute top-[42%] -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF9F7] border border-[#E0DCD6] shadow-md flex items-center justify-center text-[#8A8078] hover:border-[#A01829] hover:text-[#A01829] transition-colors z-10'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/,
  )
  return match?.[1] ?? null
}

function buildEmbedUrl(videoId: string): string {
  return (
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&controls=0&rel=0&modestbranding=1&playsinline=1&playlist=${videoId}`
  )
}

function hasMedia(c: CollectionForBrowser): boolean {
  return Boolean(c.youtubeUrl || c.mediaUrl || c.imageUrl)
}

// ─── Shared CTA arrow ────────────────────────────────────────────────────────

function CtaArrow() {
  return (
    <span className="flex items-center justify-center w-6 h-6 rounded-full border border-[#1E1B16]/20 group-hover/cta:border-[#A01829] group-hover/cta:bg-[#A01829] transition-all duration-200">
      <svg
        viewBox="0 0 10 10"
        className="w-2.5 h-2.5 text-[#1E1B16] group-hover/cta:text-white transition-colors duration-200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 5h8M5 1l4 4-4 4" />
      </svg>
    </span>
  )
}

// ─── Product Card — exact match to ProductsMegaMenu.ProductCard ───────────────

function ProductCard({ product }: { product: NavProduct }) {
  return (
    <Link href={`/products/${product.handle}`} className="block group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white mb-4">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(max-width: 1280px) 22vw, 280px"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs uppercase tracking-widest text-[#C8C2BA]">No image</span>
          </div>
        )}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-[#A01829]/20 transition-all duration-300 pointer-events-none" />
      </div>
      <h3
        className="text-[15px] font-semibold text-[#2C2C2C] leading-snug line-clamp-2 px-0.5"
        style={{ fontFamily: 'var(--font-brand-luxury)' }}
      >
        {product.model ?? product.title}
      </h3>
    </Link>
  )
}

// ─── Product Skeleton ─────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="min-w-[calc((100%-56px)/3)] flex-shrink-0 snap-start">
      <div className="aspect-[4/3] rounded-2xl bg-[#E2DED8] animate-pulse mb-4" />
      <div className="h-3.5 w-28 rounded bg-[#E2DED8] animate-pulse" />
    </div>
  )
}

// ─── Product Strip ────────────────────────────────────────────────────────────
// Lazy-loads via IntersectionObserver. Hidden when collection has no products.

function ProductStrip({ handle }: { handle: string }) {
  const [products, setProducts] = useState<NavProduct[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasTriggered = useRef(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Trigger fetch on first viewport intersection
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true
          setStatus('loading')
          observer.disconnect()
          getProductsByCollection(handle)
            .then((result) => { setProducts(result); setStatus('done') })
            .catch(() => setStatus('done'))
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [handle])

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateScrollState); ro.disconnect() }
  }, [updateScrollState, products])

  const scrollByPage = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * ((el.offsetWidth - 56) / 3 + 28), behavior: 'smooth' })
  }, [])

  // Hide entirely when done and empty
  if (status === 'done' && products.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="border-t border-[#1E1B16]/[0.07] px-6 md:px-12 pt-8 pb-10"
      style={{ background: 'linear-gradient(160deg, #EEEBE6 0%, #F4F1EC 100%)' }}
    >
      {/* Strip label */}
      <div className="flex items-center gap-4 mb-7">
        <span
          className="text-[8px] tracking-[0.5em] uppercase font-bold text-[#2C2C2C]/35 whitespace-nowrap shrink-0"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {status === 'done' && products.length > 0
            ? `${products.length} Model${products.length === 1 ? '' : 's'}`
            : 'Models'}
        </span>
        <div className="flex-1 h-px bg-[#1E1B16]/[0.07]" />
      </div>

      {/* Loading skeletons */}
      {status !== 'done' ? (
        <div className="flex gap-7">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      ) : (
        <div className="relative">
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => scrollByPage(-1)}
                aria-label="Scroll left"
                className={cn(NAV_BTN_CLASS, '-left-5')}
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div ref={scrollRef} className={SCROLL_CLASS}>
              {products.map((product) => (
                <div key={product.id} className="min-w-[calc((100%-56px)/3)] snap-start flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => scrollByPage(1)}
                aria-label="Scroll right"
                className={cn(NAV_BTN_CLASS, '-right-5')}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ─── Collection Row — With Media ──────────────────────────────────────────────

function CollectionMediaRow({
  collection,
  index,
}: {
  collection: CollectionForBrowser
  index: number
}) {
  const isEven = index % 2 === 0
  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  // Prefer CMS-uploaded mediaUrl over Shopify-synced imageUrl
  const imageSrc = collection.mediaUrl ?? collection.imageUrl ?? null

  const mediaPane = (
    <div className="relative overflow-hidden bg-[#1E1B16]/8 w-full lg:w-[55%] shrink-0 aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
      {videoId ? (
        <iframe
          src={buildEmbedUrl(videoId)}
          title={collection.title}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          className="absolute inset-0 w-full h-full pointer-events-none scale-[1.02]"
          style={{ border: 'none' }}
        />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt={collection.heading ?? collection.title}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-piano)] group-hover:scale-[1.025]"
        />
      ) : null}

      <div
        className={cn(
          'absolute top-0 bottom-0 w-[2px] pointer-events-none',
          'bg-gradient-to-b from-transparent via-[#E11922]/55 to-transparent',
          isEven ? 'right-0' : 'left-0',
        )}
      />
    </div>
  )

  const infoPane = (
    <div
      className={cn(
        'flex flex-col justify-center w-full lg:w-[45%]',
        'px-10 py-16 lg:py-24',
        isEven ? 'lg:pl-20 lg:pr-14' : 'lg:pr-20 lg:pl-14',
      )}
    >
      {collection.pianoCategories && collection.pianoCategories.length > 0 && (
        <p
          className="text-[8px] tracking-[0.55em] uppercase font-bold text-[#A01829] mb-6"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {collection.pianoCategories[0]}
        </p>
      )}

      <h2
        className="text-[2.5rem] lg:text-[3.25rem] xl:text-[3.875rem] leading-[1.0] tracking-[-0.02em] text-[#1E1B16] mb-5"
        style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
      >
        {collection.heading ?? collection.title}
      </h2>

      <div className="w-8 h-[1.5px] bg-gradient-to-r from-[#E11922] to-[#E11922]/0 mb-6" />

      {collection.subheading && (
        <p
          className="text-[0.8125rem] text-[#2C2C2C]/42 leading-[1.85] mb-10 max-w-[21rem]"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {collection.subheading}
        </p>
      )}

      <Link
        href={`/pianos/${collection.handle}`}
        className="inline-flex items-center gap-2.5 self-start group/cta"
      >
        <span
          className="text-[0.625rem] tracking-[0.24em] uppercase font-bold text-[#1E1B16] group-hover/cta:text-[#A01829] transition-colors duration-200"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Explore Collection
        </span>
        <CtaArrow />
      </Link>
    </div>
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="flex flex-col lg:flex-row items-stretch">
        {isEven ? <>{mediaPane}{infoPane}</> : <>{infoPane}{mediaPane}</>}
      </div>
      <ProductStrip handle={collection.handle} />
    </motion.article>
  )
}

// ─── Collection Row — Text Only (no media) ────────────────────────────────────

function CollectionTextRow({
  collection,
  index,
}: {
  collection: CollectionForBrowser
  index: number
}) {
  const ordinal = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-[#FAFAF8]"
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20 lg:py-28 relative overflow-hidden">
        <span
          className="absolute -top-4 right-8 md:right-14 text-[9rem] lg:text-[11rem] leading-none font-bold tracking-[-0.04em] text-[#1E1B16]/[0.035] select-none pointer-events-none"
          style={{ fontFamily: 'var(--font-brand-luxury)' }}
          aria-hidden
        >
          {ordinal}
        </span>

        {collection.pianoCategories && collection.pianoCategories.length > 0 && (
          <p
            className="text-[8px] tracking-[0.55em] uppercase font-bold text-[#A01829] mb-5"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {collection.pianoCategories[0]}
          </p>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <h2
              className="text-[3rem] lg:text-[4.5rem] xl:text-[5.5rem] leading-[1.0] tracking-[-0.025em] text-[#1E1B16]"
              style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
            >
              {collection.heading ?? collection.title}
            </h2>
            <div className="w-8 h-[1.5px] bg-gradient-to-r from-[#E11922] to-[#E11922]/0 mt-5" />
            {collection.subheading && (
              <p
                className="text-[0.8125rem] text-[#2C2C2C]/40 leading-[1.85] mt-5 max-w-sm"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {collection.subheading}
              </p>
            )}
          </div>

          <Link
            href={`/pianos/${collection.handle}`}
            className="inline-flex items-center gap-2.5 self-start lg:self-end flex-shrink-0 group/cta"
          >
            <span
              className="text-[0.625rem] tracking-[0.24em] uppercase font-bold text-[#1E1B16] group-hover/cta:text-[#A01829] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Explore Collection
            </span>
            <CtaArrow />
          </Link>
        </div>
      </div>

      <ProductStrip handle={collection.handle} />
    </motion.article>
  )
}

// ─── Main Browser ─────────────────────────────────────────────────────────────

interface CollectionsBrowserProps {
  collections: CollectionForBrowser[]
}

export function CollectionsBrowser({ collections }: CollectionsBrowserProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const visible = collections.filter((c) =>
    activeTab === 'all' ? true : (c.pianoCategories?.includes(activeTab) ?? false),
  )

  return (
    <div className="min-h-screen bg-white text-[#1E1B16]">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <header className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[8px] tracking-[0.55em] uppercase font-bold text-[#A01829] mb-5"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Our Collections
        </motion.p>

        <div className="flex items-baseline gap-5">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="text-[4.25rem] md:text-[5.75rem] lg:text-[7.5rem] leading-[0.92] tracking-[-0.03em] text-[#1E1B16]"
            style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
          >
            Collections
          </motion.h1>
          {collections.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="hidden md:block text-xl text-[#1E1B16]/12 self-end mb-2"
              style={{ fontFamily: 'var(--font-brand-luxury)' }}
              aria-label={`${collections.length} collections`}
            >
              {collections.length}
            </motion.span>
          )}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 h-px bg-[#1E1B16]/10 origin-left"
        />
      </header>

      {/* ── Filter tabs ───────────────────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex items-center border-b border-[#1E1B16]/[0.08]"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative px-5 py-3.5 text-[0.625rem] tracking-[0.22em] uppercase font-bold',
                'transition-colors duration-200 focus-visible:outline-none',
                activeTab === tab.id
                  ? 'text-[#1E1B16] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#E11922] after:content-[""]'
                  : 'text-[#2C2C2C]/32 hover:text-[#2C2C2C]/65',
              )}
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Collection rows ───────────────────────────────────────────────────── */}
      {visible.length > 0 ? (
        <div className="overflow-hidden">
          {visible.map((collection, index) => (
            <div key={collection.handle}>
              {hasMedia(collection) ? (
                <CollectionMediaRow collection={collection} index={index} />
              ) : (
                <CollectionTextRow collection={collection} index={index} />
              )}

              {index < visible.length - 1 && (
                <div className="flex items-center px-6 md:px-12 py-0.5" aria-hidden>
                  <div className="flex-1 h-px bg-[#1E1B16]/[0.07]" />
                  <div className="mx-5 w-1 h-1 rounded-full bg-[#1E1B16]/[0.12]" />
                  <div className="flex-1 h-px bg-[#1E1B16]/[0.07]" />
                </div>
              )}
            </div>
          ))}

          <div className="px-6 md:px-12 mt-2">
            <div className="h-px bg-[#1E1B16]/[0.08]" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-48 text-center">
          <p
            className="text-[#2C2C2C]/28 text-sm mb-8"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            No collections in this category.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="text-[0.625rem] tracking-[0.24em] uppercase font-bold text-[#1E1B16]/45 hover:text-[#1E1B16] transition-colors"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            View all collections →
          </button>
        </div>
      )}

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-[#131210] text-white mt-8">
        <div className="h-[1.5px] bg-gradient-to-r from-[#E11922]/50 via-[#E11922]/20 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-28 text-center">
          <p
            className="text-[8px] tracking-[0.55em] uppercase font-bold text-white/20 mb-8"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Discover Your Instrument
          </p>
          <h2
            className="text-[2.5rem] lg:text-[3.25rem] text-white leading-[1.05] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
          >
            Hear Every Collection
            <br />
            <span className="text-white/22">in Person</span>
          </h2>
          <p
            className="text-white/32 text-[0.8125rem] leading-[1.9] mb-12 max-w-sm mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Visit an authorized Kawai dealer to experience each collection firsthand. Our specialists will help you find the perfect piano for your musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#E11922] text-white text-[0.625rem] font-bold tracking-[0.22em] uppercase hover:bg-[#C8141C] transition-colors"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Find a Dealer
            </Link>
            <Link
              href="/pianos"
              className="inline-flex items-center justify-center px-10 py-4 border border-white/10 text-white/38 text-[0.625rem] font-bold tracking-[0.22em] uppercase hover:border-white/28 hover:text-white/60 transition-all"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Browse All Pianos
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
