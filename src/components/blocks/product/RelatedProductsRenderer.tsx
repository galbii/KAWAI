import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { formatPrice } from '@/lib/utils'
import {
  dedupeWithLimit,
  extractRelationshipIds,
  mergeCuratedWithAuto,
  nonAccessoriesFirst,
  orderByIds,
} from '@/lib/products/related-selection'
import { RelatedProductsCarousel } from './RelatedProductsCarousel'
import { Reveal, RevealRule } from './RelatedProductsMotion'

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------

interface SectionHeader {
  eyebrow?: string | null
  heading?: string | null
  subheading?: string | null
}

interface RelatedProductsBlockData {
  sectionHeader?: SectionHeader | null
  selectionMode?: 'auto' | 'curated' | 'curatedPlusAuto' | null
  curatedProducts?: (string | Product)[] | null
  displayMode?: 'collection' | 'accessories' | 'both' | null
  maxProducts?: number | null
  layout?: 'grid' | 'carousel' | null
  showPrice?: boolean | null
  theme?: 'light' | 'dark' | null
}

interface RelatedProductsRendererProps extends RelatedProductsBlockData {
  /** Injected by BlockRenderer — the current page's product document */
  product: Product
  isCanada?: boolean
}

type RelatedProduct = {
  id: string
  model: string
  name?: string | null
  slug?: string | null
  type?: string | null
  category?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null; currency?: string | null } | null
  variants?: Array<{ price?: number | null; compareAtPrice?: number | null }> | null
}

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, string> = {
  grand: 'Grand Piano',
  digital: 'Digital Piano',
  upright: 'Upright Piano',
  hybrid: 'Hybrid Piano',
  accessory: 'Accessory',
  software: 'Software',
}

function formatCategory(type: string | null | undefined): string {
  if (!type) return ''
  return CATEGORY_LABELS[type] ?? type
}

// -------------------------------------------------------------------
// Product Card
// -------------------------------------------------------------------

interface ProductCardProps {
  product: RelatedProduct
  showPrice: boolean
  isDark: boolean
  index: number
}

function ProductCard({ product, showPrice, isDark, index }: ProductCardProps) {
  const num = String(index + 1).padStart(2, '0')
  const href = `/products/${product.slug}`

  const numColor = isDark ? 'text-white/20' : 'text-kawai-muted'
  const imgBg = isDark ? 'bg-[#252220]' : 'bg-white'

  const typeLabel = formatCategory(product.type)

  // Resolve price + compare-at from variants, fall back to msrp
  const firstVariant = product.variants?.[0]
  const salePrice = firstVariant?.price ?? null
  const compareAtPrice = firstVariant?.compareAtPrice ?? null
  const msrp = product.price?.msrp ?? null

  const isOnSale =
    salePrice !== null &&
    compareAtPrice !== null &&
    compareAtPrice > salePrice

  const displayPrice = salePrice ?? msrp
  const displayCompare = isOnSale ? compareAtPrice : null

  return (
    <Link
      href={href}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kawai-red"
    >
      <article className="flex flex-col h-full transition-transform duration-500 ease-[var(--ease-elegant)] group-hover:-translate-y-1">
        {/* Index number — encodes curated/display order */}
        <p className={`text-[10px] tracking-[0.35em] font-medium mb-3 select-none ${numColor}`}>
          {num}
        </p>

        {/* Image zone */}
        <div className={`relative aspect-[4/3] overflow-hidden ${imgBg} flex-shrink-0`}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name ?? product.model ?? 'Piano'}
              fill
              className="object-cover object-center transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className={`w-14 h-14 ${isDark ? 'text-white/10' : 'text-kawai-neutral'}`}
                viewBox="0 0 48 36"
                fill="none"
                aria-hidden="true"
              >
                <rect x="1" y="14" width="46" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                {[6, 12, 19, 26, 33, 39].map((x) => (
                  <rect key={x} x={x} y="6" width="4" height="9" rx="1" fill="currentColor" />
                ))}
              </svg>
            </div>
          )}

          {/* Price overlay — bottom-right */}
          {showPrice && displayPrice !== null && (
            <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5">
              {displayCompare !== null && (
                <span className="bg-kawai-black/60 backdrop-blur-sm text-white/60 text-[10px] px-2 py-0.5 line-through">
                  {formatPrice(displayCompare, product.price?.currency ?? 'USD')}
                </span>
              )}
              <span
                className={`backdrop-blur-sm text-[12px] font-medium px-2.5 py-1 ${
                  isOnSale
                    ? 'bg-kawai-red text-white'
                    : 'bg-kawai-black/70 text-white'
                }`}
              >
                {formatPrice(displayPrice, product.price?.currency ?? 'USD')}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/[0.04] transition-colors duration-500 pointer-events-none" />
        </div>

        {/* Bottom panel — single slab: type, name, then model + explore on one baseline */}
        <div className="bg-kawai-black/95 px-5 pt-4 pb-5 flex flex-col flex-1">
          {/* Type */}
          {typeLabel && (
            <p className="text-[9px] tracking-[0.4em] uppercase font-medium text-kawai-red-400 mb-1.5">
              {typeLabel}
            </p>
          )}

          {/* Name */}
          <h3 className="font-[family-name:var(--font-brand-luxury)] text-[1.1rem] leading-tight text-white">
            {product.name ?? product.model}
          </h3>

          {/* Model + Explore — shared baseline row */}
          <div className="mt-auto pt-4 flex items-end justify-between gap-3">
            {/* white/60 ≥4.5:1 on kawai-black/95 (WCAG 1.4.3 — /40 failed) */}
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/60">
              {product.model}
            </p>

            <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-white/70 group-hover:text-white transition-colors duration-300">
              <span className="relative">
                Explore
                <span
                  className="absolute -bottom-1 left-0 h-px w-full bg-kawai-red scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[var(--ease-elegant)]"
                  aria-hidden="true"
                />
              </span>
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

// -------------------------------------------------------------------
// Shared render helper
// -------------------------------------------------------------------

interface RenderSectionArgs {
  allProducts: RelatedProduct[]
  sectionHeader?: SectionHeader | null | undefined
  layout?: 'grid' | 'carousel' | null | undefined
  showPrice?: boolean | null | undefined
  theme?: 'light' | 'dark' | null | undefined
  limit: number
}

function renderSection({
  allProducts,
  sectionHeader,
  layout = 'grid',
  showPrice = true,
  theme = 'light',
}: RenderSectionArgs) {
  const isDark = theme === 'dark'
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-kawai-pearl'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/50' : 'text-kawai-muted'
  const dividerColor = isDark ? 'bg-white/10' : 'bg-kawai-neutral'
  const countColor = isDark ? 'text-white/30' : 'text-kawai-muted'

  const count = allProducts.length

  return (
    <section className={`py-20 md:py-28 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Section Header ────────────────────────────────────── */}
        <Reveal>
          <div className="flex items-end justify-between mb-2">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="block w-5 h-px bg-kawai-red" aria-hidden="true" />
                <p className="text-[10px] tracking-[0.4em] uppercase font-medium text-kawai-red">
                  {sectionHeader?.eyebrow ?? 'Explore More'}
                </p>
              </div>

              {/* Heading */}
              <h2
                className={`text-3xl md:text-[2.5rem] font-[family-name:var(--font-brand-luxury)] leading-tight ${headingColor}`}
              >
                {sectionHeader?.heading ?? 'You May Also Like'}
              </h2>

              {/* Subheading */}
              {sectionHeader?.subheading && (
                <p className={`mt-2 text-sm leading-relaxed ${subColor}`}>
                  {sectionHeader.subheading}
                </p>
              )}
            </div>

            {/* Item count — right-aligned, subtle */}
            <p className={`text-[11px] tracking-[0.3em] uppercase font-medium pb-1 ${countColor}`}>
              {count}&thinsp;{count === 1 ? 'item' : 'items'}
            </p>
          </div>
        </Reveal>

        {/* Full-width rule — draws in from the left */}
        <RevealRule className={`w-full h-px ${dividerColor} mt-6 mb-12`} />

        {/* ── Cards — staggered keyfall reveal ──────────────────── */}
        {layout === 'carousel' ? (
          <RelatedProductsCarousel isDark={isDark}>
            {allProducts.map((rp, i) => (
              <Reveal
                key={rp.id}
                delay={Math.min(i, 3) * 0.08}
                className="snap-start flex-shrink-0 w-[72vw] sm:w-[42vw] md:w-[30vw] lg:w-[22vw]"
              >
                <ProductCard product={rp} showPrice={showPrice ?? true} isDark={isDark} index={i} />
              </Reveal>
            ))}
          </RelatedProductsCarousel>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 items-start">
            {allProducts.map((rp, i) => (
              <Reveal key={rp.id} delay={Math.min(i, 7) * 0.07}>
                <ProductCard
                  product={rp}
                  showPrice={showPrice ?? true}
                  isDark={isDark}
                  index={i}
                />
              </Reveal>
            ))}
          </div>
        )}

        {/* ── Footer rule ───────────────────────────────────────── */}
        <div className={`w-full h-px ${dividerColor} mt-14 md:mt-20`} />

      </div>
    </section>
  )
}

// -------------------------------------------------------------------
// Select fields
// -------------------------------------------------------------------

const SELECT_FIELDS = {
  model: true,
  name: true,
  slug: true,
  type: true,
  category: true,
  imageUrl: true,
  price: true,
  variants: true,
} as any

// -------------------------------------------------------------------
// Main Renderer (async Server Component)
// -------------------------------------------------------------------

export async function RelatedProductsRenderer({
  sectionHeader,
  selectionMode = 'auto',
  curatedProducts,
  displayMode = 'collection',
  maxProducts = 4,
  layout = 'grid',
  showPrice = true,
  theme = 'light',
  product,
  isCanada = false,
}: RelatedProductsRendererProps) {
  const effectiveShowPrice = showPrice ?? true
  if (!product) return null

  const limit = Math.min(Math.max(maxProducts ?? 4, 2), 8)
  const selection = selectionMode ?? 'auto'
  const payload = await getPayloadClient()

  const sectionArgs = {
    sectionHeader,
    layout,
    showPrice: effectiveShowPrice,
    theme,
    limit,
  }

  // ── Curated picks — fetched in editor order, never the current product ──
  const curatedIds =
    selection === 'auto'
      ? []
      : extractRelationshipIds(curatedProducts).filter((id) => id !== String(product.id))
  const curatedIdSet = new Set(curatedIds)

  let curated: RelatedProduct[] = []
  if (curatedIds.length > 0) {
    try {
      const { docs } = await payload.find({
        collection: 'products',
        where: { and: [{ id: { in: curatedIds } }, { status: { equals: 'active' } }] },
        select: SELECT_FIELDS,
        depth: 0,
        limit: curatedIds.length,
      })
      curated = orderByIds(docs as RelatedProduct[], curatedIds)
    } catch { /* silent */ }
  }

  // ── Curated Only: the picked list replaces all auto-discovery ─────
  if (selection === 'curated') {
    const picks = dedupeWithLimit(curated, limit)
    if (picks.length === 0) return null
    return renderSection({ allProducts: picks, ...sectionArgs })
  }

  // ── 0. Accessory page: show explicitly-linked compatible pianos ────
  if (product.type === 'accessory') {
    const compatibleIds = extractRelationshipIds((product as any).compatibleProducts)

    let pianos: RelatedProduct[] = []
    if (compatibleIds.length > 0) {
      try {
        const { docs } = await payload.find({
          collection: 'products',
          where: { and: [{ id: { in: compatibleIds } }, { status: { equals: 'active' } }] },
          select: SELECT_FIELDS,
          depth: 0,
          limit: limit + curated.length,
        })
        pianos = docs as RelatedProduct[]
      } catch { /* silent */ }
    }

    const combined = mergeCuratedWithAuto(curated, pianos, limit)
    if (combined.length === 0) return null
    return renderSection({ allProducts: combined, ...sectionArgs })
  }

  // ── 1. Same-collection products ───────────────────────────────────
  const collectionProducts: RelatedProduct[] = []
  const autoFetchLimit = limit + curated.length

  if (displayMode === 'collection' || displayMode === 'both') {
    const shopifyCollectionIds = (product.shopifyCollections ?? [])
      .map((c: any) => c?.shopifyCollectionId)
      .filter(Boolean) as string[]

    if (shopifyCollectionIds.length > 0) {
      try {
        const { docs } = await payload.find({
          collection: 'products',
          where: {
            and: [
              { 'shopifyCollections.shopifyCollectionId': { in: shopifyCollectionIds } } as any,
              { id: { not_equals: String(product.id) } },
              { status: { equals: 'active' } },
            ],
          },
          select: SELECT_FIELDS,
          depth: 0,
          limit: autoFetchLimit,
        })
        collectionProducts.push(...(docs as RelatedProduct[]))
      } catch {
        if (product.type) {
          try {
            const { docs } = await payload.find({
              collection: 'products',
              where: {
                and: [
                  { type: { equals: product.type } },
                  { id: { not_equals: String(product.id) } },
                  { status: { equals: 'active' } },
                ],
              },
              select: SELECT_FIELDS,
              depth: 0,
              limit: autoFetchLimit,
            })
            collectionProducts.push(...(docs as RelatedProduct[]))
          } catch { /* silent */ }
        }
      }
    } else if (product.type) {
      try {
        const { docs } = await payload.find({
          collection: 'products',
          where: {
            and: [
              { type: { equals: product.type } },
              { id: { not_equals: String(product.id) } },
              { status: { equals: 'active' } },
            ],
          },
          select: SELECT_FIELDS,
          depth: 0,
          limit: autoFetchLimit,
        })
        collectionProducts.push(...(docs as RelatedProduct[]))
      } catch { /* silent */ }
    }
  }

  // ── 2. Compatible accessories (reverse lookup) ────────────────────
  const accessories: RelatedProduct[] = []

  if (displayMode === 'accessories' || displayMode === 'both') {
    try {
      const { docs } = await payload.find({
        collection: 'products',
        where: {
          and: [
            { compatibleProducts: { in: [String(product.id)] } } as any,
            { status: { equals: 'active' } },
          ],
        },
        select: SELECT_FIELDS,
        depth: 0,
        limit: autoFetchLimit,
      })
      accessories.push(...(docs as RelatedProduct[]))
    } catch { /* silent */ }
  }

  // ── 3. Render two independent sections ────────────────────────────
  // Curated picks lead the main section in editor order; auto results fill
  // the rest. The accessories section never repeats a curated pick.
  const mainSlice = mergeCuratedWithAuto(
    curated,
    nonAccessoriesFirst(collectionProducts),
    limit,
  )
  const accessoriesSlice = dedupeWithLimit(
    accessories.filter((a) => !curatedIdSet.has(a.id)),
    limit,
  )

  if (mainSlice.length === 0 && accessoriesSlice.length === 0) return null

  const mainSection = mainSlice.length > 0
    ? renderSection({ allProducts: mainSlice, ...sectionArgs })
    : null

  const accessoriesSection = accessoriesSlice.length > 0
    ? renderSection({
        ...sectionArgs,
        allProducts: accessoriesSlice,
        sectionHeader: { eyebrow: 'Accessories', heading: 'Compatible Accessories' },
      })
    : null

  return (
    <>
      {mainSection}
      {accessoriesSection}
    </>
  )
}
