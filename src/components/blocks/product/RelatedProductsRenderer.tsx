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

const GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3',
  7: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  8: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

// -------------------------------------------------------------------
// Product Card
// -------------------------------------------------------------------

interface ProductCardProps {
  product: RelatedProduct
  showPrice: boolean
  isDark: boolean
}

function ProductCard({ product, showPrice, isDark }: ProductCardProps) {
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/50' : 'text-kawai-charcoal/50'
  const discoverColor = isDark
    ? 'text-white/40 group-hover:text-white'
    : 'text-kawai-charcoal/40 group-hover:text-kawai-red'

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden rounded-sm mb-3 aspect-[4/3] bg-kawai-pearl">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name ?? product.model ?? 'Related piano'}
            fill
            className="object-cover object-center transition-transform duration-500 ease-[var(--ease-piano)] group-hover:scale-105"
          />
        ) : (
          /* Piano silhouette placeholder */
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-kawai-neutral"
              viewBox="0 0 48 36"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="1"
                y="14"
                width="46"
                height="20"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {[6, 12, 19, 26, 33, 39].map((x) => (
                <rect key={x} x={x} y="6" width="4" height="9" rx="1" fill="currentColor" />
              ))}
            </svg>
          </div>
        )}

        {/* Type badge */}
        {product.type && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-kawai-black text-[10px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            {formatCategory(product.type)}
          </span>
        )}
      </div>

      {/* Text */}
      <div>
        <p className={`text-[10px] tracking-[0.25em] uppercase mb-0.5 font-medium ${subColor}`}>
          {product.model}
        </p>
        <h3
          className={`text-base font-[family-name:var(--font-brand-luxury)] leading-snug transition-colors group-hover:text-kawai-red ${headingColor}`}
        >
          {product.name ?? product.model}
        </h3>

        {showPrice && product.price?.msrp ? (
          <p className={`text-sm mt-1.5 ${subColor}`}>
            <span className="text-[10px] tracking-widest mr-1">MSRP</span>
            {formatPrice(product.price.msrp)}
          </p>
        ) : null}

        <div
          className={`flex items-center gap-1 mt-2.5 text-xs font-medium transition-all ${discoverColor}`}
        >
          <span>Discover</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

// -------------------------------------------------------------------
// Main Renderer (async Server Component)
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// Shared render helper (used by both accessory and generic paths)
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
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-[#f5f3f0]'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/60' : 'text-kawai-charcoal/60'
  const dividerColor = isDark ? 'bg-white/15' : 'bg-kawai-neutral'

  const gridCols =
    GRID_COLS[Math.min(allProducts.length, limit)] ??
    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <section className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 md:mb-12">
          {sectionHeader?.eyebrow && (
            <p className="text-[11px] tracking-[0.3em] uppercase text-kawai-red mb-3 font-medium">
              {sectionHeader.eyebrow}
            </p>
          )}
          <h2
            className={`text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] leading-tight ${headingColor}`}
          >
            {sectionHeader?.heading ?? 'You May Also Like'}
          </h2>
          {sectionHeader?.subheading && (
            <p className={`mt-3 text-base max-w-2xl leading-relaxed ${subColor}`}>
              {sectionHeader.subheading}
            </p>
          )}
          <div className={`mt-6 w-12 h-px ${dividerColor}`} />
        </div>

        {layout === 'carousel' ? (
          <RelatedProductsCarousel isDark={isDark}>
            {allProducts.map((rp) => (
              <div
                key={rp.id}
                className="snap-start flex-shrink-0 w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <ProductCard product={rp} showPrice={showPrice ?? true} isDark={isDark} />
              </div>
            ))}
          </RelatedProductsCarousel>
        ) : (
          <div className={`grid gap-6 md:gap-8 ${gridCols}`}>
            {allProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} showPrice={showPrice ?? true} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Cast as any to bypass Payload's generated ProductsSelect<T> strict typing
// These are valid field names — types will be verified after next build
const SELECT_FIELDS = {
  model: true,
  name: true,
  slug: true,
  type: true,
  category: true,
  imageUrl: true,
  price: true,
} as any

// Extract an ID string from a Payload relationship value (populated object or raw ID string)
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

export async function RelatedProductsRenderer({
  sectionHeader,
  displayMode = 'both',
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
  // When an accessory editor has hand-picked compatible piano models,
  // render those as a single "Works With" section and stop.
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

    // Accessory with no compatible products linked — render nothing
    return null
  }

  // ── 1. Same-collection products ───────────────────────────────────
  // Other products sharing a Shopify collection with this piano.
  // Falls back to same product type if no Shopify collections are set.
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
        // Fallback to same product type
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
  // Find accessories where the editor has listed this product as compatible.
  // This is intentionally a reverse lookup — not just "any accessory".
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
  const collectionSlice = dedupe(collectionProducts, limit)
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
