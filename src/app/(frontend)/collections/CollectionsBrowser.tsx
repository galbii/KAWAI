'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CollectionForBrowser } from '@/lib/payload/queries'

// ─── helpers ──────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'digital' | 'upright' | 'hybrid' | 'grand'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',     label: 'All'     },
  { id: 'digital', label: 'Digital' },
  { id: 'upright', label: 'Upright' },
  { id: 'hybrid',  label: 'Hybrid'  },
  { id: 'grand',   label: 'Grand'   },
]

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

// ─── single collection row ─────────────────────────────────────────────────

interface RowProps {
  collection: CollectionForBrowser
  index: number
}

function CollectionRow({ collection, index }: RowProps) {
  const isEven = index % 2 === 0

  const videoId = collection.youtubeUrl ? extractYouTubeId(collection.youtubeUrl) : null
  const imageSrc = collection.imageUrl ?? collection.mediaUrl ?? null

  const mediaPane = (
    <div
      className={cn(
        'relative overflow-hidden bg-kawai-black/5',
        // 55% on desktop, full width stacked on mobile
        'w-full lg:w-[55%] shrink-0',
        'aspect-[4/3] lg:aspect-auto lg:min-h-[480px]',
      )}
    >
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
          className="object-cover transition-transform duration-700 ease-[var(--ease-piano)] group-hover:scale-[1.03]"
        />
      ) : (
        /* placeholder when no media */
        <div className="absolute inset-0 bg-kawai-neutral/30 flex items-center justify-center">
          <span
            className="text-[9px] tracking-[0.4em] uppercase text-kawai-charcoal/30 font-semibold"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            No Image
          </span>
        </div>
      )}

      {/* subtle red accent bar on active side edge */}
      <div
        className={cn(
          'absolute top-8 bottom-8 w-[3px] bg-kawai-red/70',
          isEven ? 'right-0' : 'left-0',
        )}
      />
    </div>
  )

  const infoPane = (
    <div
      className={cn(
        'flex flex-col justify-center px-10 py-14 lg:py-20',
        'w-full lg:w-[45%]',
        isEven ? 'lg:pl-16 lg:pr-12' : 'lg:pr-16 lg:pl-12',
      )}
    >
      {/* category pill */}
      {collection.pianoCategories && collection.pianoCategories.length > 0 && (
        <p
          className="text-[9px] tracking-[0.42em] uppercase font-bold text-kawai-red mb-4"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {collection.pianoCategories[0]}
        </p>
      )}

      {/* title */}
      <h2
        className="text-4xl lg:text-5xl xl:text-6xl leading-[1.05] tracking-tight text-kawai-black mb-5"
        style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
      >
        {collection.heading ?? collection.title}
      </h2>

      {/* subheading */}
      {collection.subheading && (
        <p
          className="text-sm text-kawai-charcoal/55 leading-[1.8] mb-8 max-w-xs"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {collection.subheading}
        </p>
      )}

      {/* CTA */}
      <Link
        href={`/pianos/${collection.handle}`}
        className="inline-flex items-center gap-3 self-start group/cta"
      >
        <span
          className="text-[10px] tracking-[0.22em] uppercase font-bold text-kawai-black group-hover/cta:text-kawai-red transition-colors duration-200"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Explore Collection
        </span>
        <span className="flex items-center justify-center w-7 h-7 rounded-full border border-kawai-black/20 group-hover/cta:border-kawai-red group-hover/cta:bg-kawai-red transition-all duration-200">
          <svg
            viewBox="0 0 12 12"
            className="w-3 h-3 text-kawai-black group-hover/cta:text-white transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 6h10M6 1l5 5-5 5" />
          </svg>
        </span>
      </Link>
    </div>
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col lg:flex-row items-stretch"
    >
      {isEven ? (
        <>
          {mediaPane}
          {infoPane}
        </>
      ) : (
        <>
          {infoPane}
          {mediaPane}
        </>
      )}
    </motion.article>
  )
}

// ─── main browser component ────────────────────────────────────────────────

interface CollectionsBrowserProps {
  collections: CollectionForBrowser[]
}

export function CollectionsBrowser({ collections }: CollectionsBrowserProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const visible = collections.filter((c) => {
    if (activeTab === 'all') return true
    return c.pianoCategories?.includes(activeTab) ?? false
  })

  return (
    <div className="min-h-screen bg-white text-kawai-black">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <header className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-24 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-[9px] tracking-[0.48em] uppercase font-bold text-kawai-red mb-4"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Kawai Pianos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.07 }}
          className="text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-kawai-black mb-4"
          style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
        >
          Collections
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-kawai-charcoal/50 max-w-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          All Kawai Piano Collections
        </motion.p>

        {/* hairline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 h-px bg-kawai-black/10 origin-left"
        />
      </header>

      {/* ── Filter tabs ──────────────────────────────────────────────────────── */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 py-2 text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-kawai-black text-white'
                  : 'border border-kawai-black/15 text-kawai-charcoal/60 hover:border-kawai-black/40 hover:text-kawai-charcoal/90',
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
        <main className="overflow-hidden">
          {visible.map((collection, index) => (
            <div key={collection.handle}>
              <CollectionRow collection={collection} index={index} />

              {/* divider */}
              {index < visible.length - 1 && (
                <div className="flex items-center px-6 md:px-12 py-1" aria-hidden>
                  <div className="flex-1 h-px bg-kawai-black/8" />
                  <div className="mx-5 w-1 h-1 rounded-full bg-kawai-black/15" />
                  <div className="flex-1 h-px bg-kawai-black/8" />
                </div>
              )}
            </div>
          ))}

          <div className="px-6 md:px-12 mt-2">
            <div className="h-px bg-kawai-black/10" />
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <p
            className="text-kawai-charcoal/40 text-sm mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            No collections found in this category.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-kawai-black hover:opacity-50 transition-opacity"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            View All Collections
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 8h12M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-kawai-black text-white py-28 mt-8">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p
            className="text-[9px] tracking-[0.45em] uppercase font-bold text-white/30 mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Discover Your Instrument
          </p>
          <h2
            className="text-4xl lg:text-5xl text-white leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
          >
            Hear Every Collection
            <br />
            <span className="text-white/35">in Person</span>
          </h2>
          <p
            className="text-white/45 text-sm leading-[1.85] mb-10 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Visit an authorized Kawai dealer to experience each collection firsthand. Our specialists will help you find the perfect piano for your musical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-a-dealer"
              className="inline-flex items-center justify-center px-10 py-4 bg-kawai-red text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-kawai-red/85 transition-colors"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              Find a Dealer
            </Link>
            <Link
              href="/pianos"
              className="inline-flex items-center justify-center px-10 py-4 border border-white/15 text-white/55 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-white/40 hover:text-white/80 transition-all"
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
