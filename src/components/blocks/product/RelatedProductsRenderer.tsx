import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { formatPrice } from '@/lib/utils'
import { RelatedProductsCarousel } from './RelatedProductsCarousel'

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
  displayMode?: 'collection' | 'accessories' | 'both' | null
  maxProducts?: number | null
  layout?: 'grid' | 'carousel' | null
  showPrice?: boolean | null
  theme?: 'light' | 'dark' | null
}

interface RelatedProductsRendererProps extends RelatedProductsBlockData {
  /** Injected by BlockRenderer — the current page's product document */
  product: Product
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

  const numColor = isDark ? 'text-white/20' : 'text-kawai-charcoal/25'
  const imgBg = isDark ? 'bg-[#252220]' : 'bg-white'
  const nameColor = 'text-white'
  const modelColor = 'text-white/40'

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
    <article className="group flex flex-col">
      {/* Index number — sits above the card */}
      <p className={`text-[10px] tracking-[0.35em] font-medium mb-3 select-none ${numColor}`}>
        {num}
      </p>

      {/* Image zone — own link, not nested with the button below */}
      <Link
        href={href}
        className={`block relative aspect-[4/3] overflow-hidden ${imgBg} flex-shrink-0`}
        tabIndex={-1}
        aria-hidden="true"
      >
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
                {formatPrice(displayCompare)}
              </span>
            )}
            <span
              className={`backdrop-blur-sm text-[12px] font-medium px-2.5 py-1 ${
                isOnSale
                  ? 'bg-kawai-red text-white'
                  : 'bg-kawai-black/70 text-white'
              }`}
            >
              {formatPrice(displayPrice)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-kawai-black/0 group-hover:bg-kawai-black/[0.04] transition-colors duration-500 pointer-events-none" />
      </Link>

      {/* Bottom panel — footer grey */}
      <div className="bg-kawai-black/95 px-4 pt-4 pb-4 flex flex-col flex-1">
        {/* Type */}
        {typeLabel && (
          <p className="text-[9px] tracking-[0.4em] uppercase font-medium text-kawai-red mb-1.5">
            {typeLabel}
          </p>
        )}

        {/* Name */}
        <h3 className={`font-[family-name:var(--font-brand-luxury)] text-[1.1rem] leading-tight mb-1 ${nameColor}`}>
          {product.name ?? product.model}
        </h3>

        {/* Model */}
        <p className={`text-[10px] tracking-[0.25em] uppercase ${modelColor}`}>
          {product.model}
        </p>
      </div>

      {/* Explore button — below the card */}
      <Link
        href={href}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-kawai-black text-white text-[10px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 hover:bg-kawai-red mt-3"
      >
        <span>Explore</span>
        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </article>
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
  limit,
}: RenderSectionArgs) {
  const isDark = theme === 'dark'
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-kawai-pearl'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/50' : 'text-kawai-charcoal/55'
  const dividerColor = isDark ? 'bg-white/10' : 'bg-kawai-neutral'
  const countColor = isDark ? 'text-white/30' : 'text-kawai-charcoal/35'

  const count = allProducts.length

  return (
    <section className={`py-20 md:py-28 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Section Header ────────────────────────────────────── */}
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

        {/* Full-width rule */}
        <div className={`w-full h-px ${dividerColor} mt-6 mb-12`} />

        {/* ── Cards ─────────────────────────────────────────────── */}
        {layout === 'carousel' ? (
          <RelatedProductsCarousel isDark={isDark}>
            {allProducts.map((rp, i) => (
              <div
                key={rp.id}
                className="snap-start flex-shrink-0 w-[72vw] sm:w-[42vw] md:w-[30vw] lg:w-[22vw]"
              >
                <ProductCard product={rp} showPrice={showPrice ?? true} isDark={isDark} index={i} />
              </div>
            ))}
          </RelatedProductsCarousel>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 items-start">
            {allProducts.map((rp, i) => (
              <ProductCard
                key={rp.id}
                product={rp}
                showPrice={showPrice ?? true}
                isDark={isDark}
                index={i}
              />
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

function extractId(val: unknown): string | null {
  if (!val) return null
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val !== null && 'id' in val) {
    const id = (val as { id: unknown }).id
    return typeof id === 'string' ? id : typeof id === 'number' ? String(id) : null
  }
  return null
}

function dedupe(products: RelatedProduct[], limit: number): RelatedProduct[] {
  const seen = new Set<string>()
  const result: RelatedProduct[] = []
  for (const p of products) {
    if (!seen.has(p.id) && result.length < limit) {
      seen.add(p.id)
      result.push(p)
    }
  }
  return result
}

/** Sort so non-accessories come first — pianos fill visible slots before accessories */
function nonAccessoriesFirst(products: RelatedProduct[]): RelatedProduct[] {
  return [...products].sort((a, b) => {
    const aIsAccessory = a.type === 'accessory' ? 1 : 0
    const bIsAccessory = b.type === 'accessory' ? 1 : 0
    return aIsAccessory - bIsAccessory
  })
}

// -------------------------------------------------------------------
// Main Renderer (async Server Component)
// -------------------------------------------------------------------

export async function RelatedProductsRenderer({
  sectionHeader,
  displayMode = 'collection',
  maxProducts = 4,
  layout = 'grid',
  showPrice = true,
  theme = 'light',
  product,
}: RelatedProductsRendererProps) {
  if (!product) return null

  const limit = Math.min(Math.max(maxProducts ?? 4, 2), 8)
  const payload = await getPayloadClient()

  // ── 0. Accessory page: show explicitly-linked compatible pianos ────
  if (product.type === 'accessory') {
    const compatibleIds = ((product as any).compatibleProducts as unknown[])
      ?.map(extractId)
      .filter((id): id is string => id !== null) ?? []

    if (compatibleIds.length > 0) {
      let pianos: RelatedProduct[] = []
      try {
        const { docs } = await payload.find({
          collection: 'products',
          where: { and: [{ id: { in: compatibleIds } }, { status: { equals: 'active' } }] },
          select: SELECT_FIELDS,
          depth: 0,
          limit,
        })
        pianos = dedupe(docs as RelatedProduct[], limit)
      } catch { /* silent */ }

      if (pianos.length === 0) return null
      return renderSection({ allProducts: pianos, sectionHeader, layout, showPrice, theme, limit })
    }

    return null
  }

  // ── 1. Same-collection products ───────────────────────────────────
  const collectionProducts: RelatedProduct[] = []

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
          limit,
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
              limit,
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
          limit,
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
        limit,
      })
      accessories.push(...(docs as RelatedProduct[]))
    } catch { /* silent */ }
  }

  // ── 3. Render two independent sections ────────────────────────────
  const collectionSlice = dedupe(nonAccessoriesFirst(collectionProducts), limit)
  const accessoriesSlice = dedupe(accessories, limit)

  if (collectionSlice.length === 0 && accessoriesSlice.length === 0) return null

  const collectionSection = collectionSlice.length > 0
    ? renderSection({ allProducts: collectionSlice, sectionHeader, layout, showPrice, theme, limit })
    : null

  const accessoriesSection = accessoriesSlice.length > 0
    ? renderSection({
        allProducts: accessoriesSlice,
        sectionHeader: { eyebrow: 'Accessories', heading: 'Compatible Accessories' },
        layout,
        showPrice,
        theme,
        limit,
      })
    : null

  return (
    <>
      {collectionSection}
      {accessoriesSection}
    </>
  )
}
