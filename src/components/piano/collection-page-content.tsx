'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CollectionShowcaseBlock } from '@/components/blocks/CollectionShowcaseBlock'
import { CollectionProductRow } from '@/components/piano/CollectionProductRow'

export interface CollectionVariation {
  name: string
  shopifyVariantId: string | null
  price: number | null
  compareAtPrice: number | null
  available: boolean
  imageUrl: string | null
}

export interface CollectionProduct {
  id: string
  model: string
  name?: string | null
  slug: string
  type?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null; currency?: string | null } | null
  salePrice?: number | null
  description?: string | null
  variations: CollectionVariation[]
}

interface CollectionPageContentProps {
  collection: any
  products: CollectionProduct[]
}

function PianoSilhouette() {
  return (
    <svg viewBox="0 0 160 100" className="w-40 h-auto" fill="none" aria-hidden>
      <rect x="12" y="32" width="136" height="52" rx="3" fill="#D8D3CC" />
      <rect x="16" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="28" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="37" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="49" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="58" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="70" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="82" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="91" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="103" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="112" y="36" width="10" height="44" rx="1" fill="white" />
      <rect x="124" y="36" width="7"  height="28" rx="1" fill="#1E1B16" opacity="0.55" />
      <rect x="133" y="36" width="11" height="44" rx="1" fill="white" />
    </svg>
  )
}

const CATEGORY_LABELS: Record<string, string> = {
  digital: 'Digital Pianos',
  grand: 'Grand Pianos',
  upright: 'Upright Pianos',
  hybrid: 'Hybrid Pianos',
}

export function CollectionPageContent({ collection, products }: CollectionPageContentProps) {
  const hasProducts = products.length > 0

  // Use the pianoCategories field from the Collections collection (first value if multiple)
  const rawCategories: string[] = Array.isArray(collection.pianoCategories)
    ? collection.pianoCategories
    : collection.pianoCategories
      ? [collection.pianoCategories]
      : []
  const primaryCategory = rawCategories[0] ?? null
  const categoryLabel = primaryCategory
    ? (CATEGORY_LABELS[primaryCategory] ?? primaryCategory)
    : null

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero banner ────────────────────────────────────────────────────────── */}
      <CollectionShowcaseBlock
        collection={collection}
        bannerSize="medium"
        showViewCollectionLink={false}
      />

      {/* ── Sticky breadcrumb — tracks header via CSS var ───────────────────── */}
      <div
        className="sticky z-40 bg-[#f0eeeb] border-b border-kawai-black/8"
        style={{ top: 'var(--header-bottom, 0px)' }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-3.5 flex items-center justify-between">
          <nav
            className="flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase font-semibold"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            <Link href="/" className="text-kawai-charcoal/50 hover:text-kawai-black transition-colors duration-200">
              Home
            </Link>
            <span className="text-kawai-charcoal/25">·</span>
            <Link href="/pianos" className="text-kawai-charcoal/50 hover:text-kawai-black transition-colors duration-200">
              Pianos
            </Link>
            <span className="text-kawai-charcoal/25">·</span>
            <span className="text-kawai-black font-bold">{collection.title}</span>
          </nav>
          {/* Red accent pip */}
          <div className="w-1.5 h-1.5 rounded-full bg-kawai-red" aria-hidden />
        </div>
      </div>

      {/* ── Collection name header ──────────────────────────────────────────── */}
      <header className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div>
            {/* Category subheading */}
            {categoryLabel && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-[10px] tracking-[0.45em] uppercase font-bold text-kawai-red mb-4"
                style={{ fontFamily: 'var(--font-brand-sans)' }}
              >
                {categoryLabel}
              </motion.p>
            )}

            {/* Collection title */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="text-6xl lg:text-8xl xl:text-9xl text-kawai-black leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
            >
              {collection.title}
            </motion.h1>

          </div>

          {collection.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-sm text-kawai-charcoal/50 leading-relaxed max-w-sm lg:text-right lg:pb-2"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {collection.description}
            </motion.p>
          )}
        </div>

        {/* Opening hairline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 h-px bg-kawai-black/10 origin-left"
        />
      </header>

      {/* ── Product rows ─────────────────────────────────────────────────────── */}
      {hasProducts ? (
        <main className="overflow-hidden">
          {products.map((product, index) => (
            <div key={product.id}>
              <CollectionProductRow
                product={product}
                index={index}
                isEven={index % 2 === 0}
                collectionHandle={collection?.handle ?? ''}
              />

              {/* Divider between rows */}
              {index < products.length - 1 && (
                <div className="flex items-center px-6 md:px-12 py-1">
                  <div className="flex-1 h-px bg-kawai-black/8" />
                  <div className="mx-5 w-1 h-1 rounded-full bg-kawai-black/15" />
                  <div className="flex-1 h-px bg-kawai-black/8" />
                </div>
              )}
            </div>
          ))}

          {/* Closing hairline */}
          <div className="px-6 md:px-12 mt-2">
            <div className="h-px bg-kawai-black/10" />
          </div>
        </main>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <div className="opacity-20 mb-8">
            <PianoSilhouette />
          </div>
          <p
            className="text-kawai-charcoal/40 text-sm mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            No instruments are available in this collection right now.
          </p>
          <Link
            href="/pianos"
            className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-kawai-black hover:opacity-50 transition-opacity"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Browse All Pianos
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 8h12M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-kawai-black text-white py-28 mt-4">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <p
            className="text-[9px] tracking-[0.45em] uppercase font-bold text-white/30 mb-6"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Find Your Piano
          </p>
          <h2
            className="text-4xl lg:text-5xl text-white leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
          >
            Experience the {collection.title}
            <br />
            <span className="text-white/35">in Person</span>
          </h2>
          <p
            className="text-white/45 text-sm leading-[1.85] mb-10 max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            Visit our showroom to hear and feel the difference. Our piano specialists will help you find the perfect instrument for your musical journey.
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
