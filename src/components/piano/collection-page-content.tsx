'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CollectionShowcaseBlock } from '@/components/blocks/CollectionShowcaseBlock'

interface CollectionProduct {
  id: string
  model: string
  name?: string | null
  slug: string
  type?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null; currency?: string | null } | null
  salePrice?: number | null
  description?: string | null
}

interface CollectionPageContentProps {
  collection: any
  products: CollectionProduct[]
}

function formatPrice(price?: number | null): string | null {
  if (!price) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

// ─── Scroll-triggered animation variants ─────────────────────────────────────

function makeImageVariants(fromRight: boolean) {
  return {
    hidden: { opacity: 0, x: fromRight ? 48 : -48 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
    },
  }
}

function makeInfoVariants(fromRight: boolean) {
  return {
    hidden: { opacity: 0, x: fromRight ? -32 : 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] as const },
    },
  }
}

// ─── Piano silhouette fallback ────────────────────────────────────────────────

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

// ─── Individual product row ───────────────────────────────────────────────────

function ProductRow({ product, index }: { product: CollectionProduct; index: number }) {
  // Even index → image LEFT, text RIGHT. Odd → image RIGHT, text LEFT.
  const imageOnLeft = index % 2 === 0
  const indexLabel = String(index + 1).padStart(2, '0')

  const msrp = product.price?.msrp
  const salePrice = product.salePrice
  const displayPrice = salePrice ? formatPrice(salePrice) : formatPrice(msrp)
  const isOnSale = Boolean(salePrice && msrp && salePrice < msrp)

  const imageVariants = makeImageVariants(!imageOnLeft)
  const infoVariants  = makeInfoVariants(imageOnLeft)

  // ── Image panel ───────────────────────────────────────────────────────────
  const ImagePanel = (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="w-full lg:w-[55%] flex-shrink-0"
    >
      <Link
        href={`/products/${product.slug}`}
        tabIndex={-1}
        aria-hidden
        className="group block relative aspect-[4/3] bg-white overflow-hidden"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name ?? product.model}
            fill
            className="object-contain p-10 lg:p-14 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <PianoSilhouette />
          </div>
        )}
        {/* Hover tint */}
        <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/[0.025] transition-colors duration-500" />
      </Link>
    </motion.div>
  )

  // ── Info panel ────────────────────────────────────────────────────────────
  const InfoPanel = (
    <motion.div
      variants={infoVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className={cn(
        'w-full lg:w-[45%] flex-shrink-0 flex flex-col justify-center',
        'px-8 py-14',
        imageOnLeft
          ? 'lg:pl-14 lg:pr-16 xl:pl-20 xl:pr-24'
          : 'lg:pr-14 lg:pl-16 xl:pr-20 xl:pl-24',
      )}
    >
      {/* Index + model label row */}
      <div className="flex items-center gap-3 mb-8">
        <span
          className="text-[9px] tracking-[0.35em] uppercase font-semibold text-kawai-charcoal/25"
          aria-hidden
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {indexLabel}
        </span>
        <div className="flex-1 h-px bg-kawai-neutral/50" />
        <span
          className="text-[9px] tracking-[0.3em] uppercase font-bold text-kawai-red"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {product.model}
        </span>
      </div>

      {/* Product name */}
      {product.name && (
        <h2
          className="text-4xl xl:text-5xl 2xl:text-6xl text-kawai-black leading-[1.04] mb-7"
          style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
        >
          {product.name}
        </h2>
      )}

      {/* Kawai-red accent rule */}
      <div className="w-10 h-px bg-kawai-red mb-7" />

      {/* Description */}
      {product.description && (
        <p
          className="text-[15px] text-kawai-charcoal/65 leading-[1.75] mb-9 max-w-xs line-clamp-4"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          {product.description}
        </p>
      )}

      {/* Price block */}
      {displayPrice && (
        <div className="mb-9">
          <p
            className="text-[9px] tracking-[0.25em] uppercase text-kawai-charcoal/35 mb-1.5"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {isOnSale ? 'Starting from' : 'MSRP from'}
          </p>
          <p
            className={cn(
              'text-2xl font-semibold',
              isOnSale ? 'text-kawai-red' : 'text-kawai-black'
            )}
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            {displayPrice}
          </p>
          {isOnSale && msrp && (
            <p
              className="text-xs text-kawai-charcoal/35 line-through mt-1"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {formatPrice(msrp)}
            </p>
          )}
        </div>
      )}

      {/* Discover CTA */}
      <Link
        href={`/products/${product.slug}`}
        className="group/cta inline-flex items-center gap-3 w-fit"
      >
        <span
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-kawai-black group-hover/cta:text-kawai-red transition-colors duration-300"
          style={{ fontFamily: 'var(--font-brand-sans)' }}
        >
          Discover Model
        </span>
        <span className="flex items-center justify-center w-8 h-8 border border-kawai-black/25 group-hover/cta:border-kawai-red group-hover/cta:bg-kawai-red transition-all duration-300">
          <svg
            viewBox="0 0 16 16"
            className="w-3 h-3 text-kawai-black group-hover/cta:text-white transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M2 8h12M8 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>
    </motion.div>
  )

  return (
    <div className="relative">
      {/* Ghost index — editorial depth layer, hidden on mobile */}
      <span
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none',
          'hidden lg:block text-[28vw] leading-none font-bold',
          'text-kawai-black/[0.022]',
          imageOnLeft ? 'right-0 translate-x-1/4' : 'left-0 -translate-x-1/4',
        )}
        aria-hidden
        style={{ fontFamily: 'var(--font-brand-luxury)' }}
      >
        {indexLabel}
      </span>

      {/* Row — alternates direction */}
      <div
        className={cn(
          'relative z-10 flex flex-col lg:flex-row items-stretch',
          !imageOnLeft && 'lg:flex-row-reverse',
        )}
      >
        {ImagePanel}
        {InfoPanel}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CollectionPageContent({ collection, products }: CollectionPageContentProps) {
  const hasProducts = products.length > 0

  return (
    <div className="min-h-screen bg-kawai-pearl">
      {/* ── Hero banner (CollectionShowcaseBlock handles video / image / text) */}
      <CollectionShowcaseBlock
        collection={collection}
        bannerSize="large"
        showViewCollectionLink={false}
      />

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-kawai-neutral/60">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-4">
          <nav
            className="flex items-center gap-2.5 text-[10px] tracking-[0.2em] uppercase font-semibold"
            style={{ fontFamily: 'var(--font-brand-sans)' }}
          >
            <Link href="/" className="text-kawai-charcoal/35 hover:text-kawai-red transition-colors">
              Home
            </Link>
            <span className="text-kawai-neutral/70">·</span>
            <Link href="/pianos" className="text-kawai-charcoal/35 hover:text-kawai-red transition-colors">
              Pianos
            </Link>
            <span className="text-kawai-neutral/70">·</span>
            <span className="text-kawai-black">{collection.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Collection header ───────────────────────────────────────────────── */}
      <header className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-20 pb-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[9px] tracking-[0.4em] uppercase font-bold text-kawai-red mb-5"
              style={{ fontFamily: 'var(--font-brand-sans)' }}
            >
              {collection.title}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="text-6xl lg:text-8xl text-kawai-black leading-none"
              style={{ fontFamily: 'var(--font-brand-luxury)', fontWeight: 400 }}
            >
              {hasProducts ? (
                <>
                  {products.length}
                  <span className="text-kawai-charcoal/30 ml-3">
                    {products.length === 1 ? 'Instrument' : 'Instruments'}
                  </span>
                </>
              ) : (
                'Collection'
              )}
            </motion.h1>
          </div>

          {collection.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="text-sm text-kawai-charcoal/55 leading-relaxed max-w-xs lg:text-right"
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
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 h-px bg-kawai-neutral/60 origin-left"
        />
      </header>

      {/* ── Product rows ─────────────────────────────────────────────────────── */}
      {hasProducts ? (
        <main className="max-w-screen-2xl mx-auto overflow-hidden">
          {products.map((product, index) => (
            <div key={product.id}>
              <ProductRow product={product} index={index} />

              {/* Divider between rows */}
              {index < products.length - 1 && (
                <div className="flex items-center px-6 md:px-12 py-1">
                  <div className="flex-1 h-px bg-kawai-neutral/40" />
                  <div className="mx-5 w-1 h-1 rounded-full bg-kawai-neutral/60" />
                  <div className="flex-1 h-px bg-kawai-neutral/40" />
                </div>
              )}
            </div>
          ))}

          {/* Closing hairline */}
          <div className="px-6 md:px-12 mt-2">
            <div className="h-px bg-kawai-neutral/50" />
          </div>
        </main>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <div className="opacity-25 mb-8">
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
            className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-kawai-red hover:opacity-60 transition-opacity"
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
            className="text-[9px] tracking-[0.45em] uppercase font-bold text-kawai-red/70 mb-6"
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
