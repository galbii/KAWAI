import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/queries'
import { formatPrice } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductAccessoriesRendererProps {
  heading?: string | null
  eyebrow?: string | null
  maxItems?: number | null
  layout?: 'grid' | 'carousel' | null
  theme?: 'light' | 'dark' | null
  product: Product
}

type AccessoryCard = {
  id: string
  model: string
  name?: string | null
  slug?: string | null
  type?: string | null
  imageUrl?: string | null
  price?: { msrp?: number | null; currency?: string | null } | null
  variants?: Array<{ price?: number | null; compareAtPrice?: number | null }> | null
  description?: string | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SELECT_FIELDS = {
  model: true,
  name: true,
  slug: true,
  type: true,
  imageUrl: true,
  price: true,
  variants: true,
  description: true,
} as any

// ---------------------------------------------------------------------------
// Card Component
// ---------------------------------------------------------------------------

interface CardProps {
  accessory: AccessoryCard
  isDark: boolean
  index: number
}

function AccessoryCardItem({ accessory, isDark, index }: CardProps) {
  const num = String(index + 1).padStart(2, '0')
  const href = `/products/${accessory.slug ?? accessory.model}`

  const numColor = isDark ? 'text-white/20' : 'text-kawai-charcoal/25'
  const imgBg = isDark ? 'bg-[#252220]' : 'bg-white'
  // Bottom panel always matches the footer: bg-kawai-black/95
  const bottomBg = 'bg-kawai-black/95'
  const nameColor = 'text-white'
  const modelColor = 'text-white/40'
  const priceColor = 'text-white/55'

  const typeLabel = accessory.type
    ? accessory.type.charAt(0).toUpperCase() + accessory.type.slice(1)
    : 'Accessory'

  // Resolve best price + compare-at from variants, falling back to top-level msrp
  const firstVariant = accessory.variants?.[0]
  const salePrice = firstVariant?.price ?? null
  const compareAtPrice = firstVariant?.compareAtPrice ?? null
  const msrp = accessory.price?.msrp ?? null

  // A genuine sale: compare-at exists, is higher than the current price
  const isOnSale =
    salePrice !== null &&
    compareAtPrice !== null &&
    compareAtPrice > salePrice

  // Display price: prefer variant price, fall back to msrp
  const displayPrice = salePrice ?? msrp
  const displayCompare = isOnSale ? compareAtPrice : null

  return (
    <article className="group flex flex-col">
      {/* Index number — sits above the card */}
      <p className={`text-[10px] tracking-[0.35em] font-medium mb-3 select-none ${numColor}`}>
        {num}
      </p>

      {/* Image zone — own link so it's not nested with the button */}
      <Link href={href} className={`block relative aspect-square overflow-hidden ${imgBg} flex-shrink-0`} tabIndex={-1} aria-hidden="true">
        {accessory.imageUrl ? (
          <Image
            src={accessory.imageUrl}
            alt={accessory.name ?? accessory.model}
            fill
            className="object-contain object-center p-4 transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className={`w-12 h-12 ${isDark ? 'text-white/10' : 'text-kawai-neutral'}`}
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <rect x="6" y="14" width="36" height="24" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M16 14V12a8 8 0 0 1 16 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="24" cy="26" r="4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        )}

        {/* Price overlay — bottom-right of image */}
        {displayPrice !== null && (
          <div className="absolute bottom-3 right-3 flex flex-col items-end gap-0.5">
            {/* Compare-at / original price (struck through) */}
            {displayCompare !== null && (
              <span className="bg-kawai-black/60 backdrop-blur-sm text-white/60 text-[10px] px-2 py-0.5 line-through">
                {formatPrice(displayCompare)}
              </span>
            )}
            {/* Current price */}
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

      {/* Bottom panel */}
      <div className={`${bottomBg} px-4 pt-4 pb-4 flex flex-col flex-1`}>
        {/* Type */}
        <p className="text-[9px] tracking-[0.4em] uppercase font-medium text-kawai-red mb-1.5">
          {typeLabel}
        </p>

        {/* Name */}
        <h3 className={`font-[family-name:var(--font-brand-luxury)] text-[1.1rem] leading-tight mb-1 ${nameColor}`}>
          {accessory.name ?? accessory.model}
        </h3>

        {/* Model */}
        <p className={`text-[10px] tracking-[0.25em] uppercase ${modelColor}`}>
          {accessory.model}
        </p>
      </div>

      {/* Button — sits below the card */}
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

// ---------------------------------------------------------------------------
// Main Renderer (async Server Component)
// ---------------------------------------------------------------------------

export async function ProductAccessoriesRenderer({
  heading = 'The Full Experience',
  eyebrow = 'Accessories',
  maxItems = 8,
  layout = 'grid',
  theme = 'light',
  product,
}: ProductAccessoriesRendererProps) {
  if (!product) return null

  const limit = Math.min(Math.max(maxItems ?? 8, 2), 12)
  const payload = await getPayloadClient()

  let accessories: AccessoryCard[] = []

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
    accessories = docs as AccessoryCard[]
  } catch {
    return null
  }

  if (accessories.length === 0) return null

  const isDark = theme === 'dark'

  // Theme tokens
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-kawai-pearl'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/50' : 'text-kawai-charcoal/55'
  const dividerColor = isDark ? 'bg-white/10' : 'bg-kawai-neutral'
  const countColor = isDark ? 'text-white/30' : 'text-kawai-charcoal/35'

  const productLabel = product.name ?? product.model

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
                {eyebrow || 'Accessories'}
              </p>
            </div>

            {/* Heading */}
            <h2
              className={`text-3xl md:text-[2.5rem] font-[family-name:var(--font-brand-luxury)] leading-tight ${headingColor}`}
            >
              {heading || 'The Full Experience'}
            </h2>

            {/* Sub copy */}
            <p className={`mt-2 text-sm leading-relaxed ${subColor}`}>
              Curated additions for the {productLabel}
            </p>
          </div>

          {/* Item count — right-aligned, subtle */}
          <p className={`text-[11px] tracking-[0.3em] uppercase font-medium pb-1 ${countColor}`}>
            {accessories.length}&thinsp;{accessories.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Full-width rule */}
        <div className={`w-full h-px ${dividerColor} mt-6 mb-12`} />

        {/* ── Cards ─────────────────────────────────────────────── */}
        {layout === 'carousel' ? (
          /* Carousel — horizontal scroll with snap */
          <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:-mx-10 lg:px-10">
            {accessories.map((accessory, i) => (
              <div
                key={accessory.id}
                className="snap-start flex-shrink-0 w-[72vw] sm:w-[42vw] md:w-[30vw] lg:w-[22vw]"
              >
                <AccessoryCardItem accessory={accessory} isDark={isDark} index={i} />
              </div>
            ))}
          </div>
        ) : (
          /* Grid — 2-up mobile, 4-up desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 items-start">
            {accessories.map((accessory, i) => (
              <AccessoryCardItem
                key={accessory.id}
                accessory={accessory}
                isDark={isDark}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── Footer rule ───────────────────────────────────────── */}
        <div className={`w-full h-px ${dividerColor} mt-14 md:mt-20`} />
        <p className={`mt-4 text-[10px] tracking-[0.3em] uppercase ${countColor}`}>
          Compatible with {productLabel}
        </p>

      </div>
    </section>
  )
}
