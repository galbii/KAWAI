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
  description: true,
} as any

// ---------------------------------------------------------------------------
// Card Component
// ---------------------------------------------------------------------------

interface CardProps {
  accessory: AccessoryCard
  isDark: boolean
}

function AccessoryCardItem({ accessory, isDark }: CardProps) {
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/50' : 'text-kawai-charcoal/50'
  const discoverColor = isDark
    ? 'text-white/40 group-hover:text-white'
    : 'text-kawai-charcoal/40 group-hover:text-kawai-red'

  return (
    <Link href={`/products/${accessory.slug ?? accessory.model}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden rounded-sm mb-3 aspect-[4/3] bg-kawai-pearl">
        {accessory.imageUrl ? (
          <Image
            src={accessory.imageUrl}
            alt={accessory.name ?? accessory.model}
            fill
            className="object-cover object-center transition-transform duration-500 ease-[var(--ease-piano)] group-hover:scale-105"
          />
        ) : (
          /* Accessory placeholder */
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className={`w-10 h-10 ${isDark ? 'text-white/15' : 'text-kawai-neutral'}`}
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <rect x="4" y="12" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M13 12V10a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="20" cy="22" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* Accessory badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-kawai-black text-[10px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
          Accessory
        </span>
      </div>

      {/* Text */}
      <div>
        <p className={`text-[10px] tracking-[0.25em] uppercase mb-0.5 font-medium ${subColor}`}>
          {accessory.model}
        </p>
        <h3
          className={`text-base font-[family-name:var(--font-brand-luxury)] leading-snug transition-colors group-hover:text-kawai-red ${headingColor}`}
        >
          {accessory.name ?? accessory.model}
        </h3>

        {accessory.price?.msrp ? (
          <p className={`text-sm mt-1.5 ${subColor}`}>
            <span className="text-[10px] tracking-widest mr-1">MSRP</span>
            {formatPrice(accessory.price.msrp)}
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

// ---------------------------------------------------------------------------
// Main Renderer (async Server Component)
// ---------------------------------------------------------------------------

export async function ProductAccessoriesRenderer({
  heading = 'Popular Additions',
  eyebrow = 'Accessories',
  maxItems = 8,
  layout = 'grid',
  theme = 'light',
  product,
}: ProductAccessoriesRendererProps) {
  // Don't render on accessory pages
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
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-[#f5f3f0]'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/60' : 'text-kawai-charcoal/60'
  const dividerColor = isDark ? 'bg-white/15' : 'bg-kawai-neutral'


  return (
    <section className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 md:mb-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-kawai-red mb-3 font-medium">
            {eyebrow || 'Accessories'}
          </p>
          <h2
            className={`text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] leading-tight ${headingColor}`}
          >
            {heading || 'Popular Additions'}
          </h2>
          <p className={`mt-3 text-base max-w-2xl leading-relaxed ${subColor}`}>
            Popular add-ons for the {product.name ?? product.model}
          </p>
          <div className={`mt-6 w-12 h-px ${dividerColor}`} />
        </div>

        {/* Grid or Carousel */}
        {layout === 'carousel' ? (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:-mx-8 lg:px-8">
            {accessories.map((accessory) => (
              <div
                key={accessory.id}
                className="snap-start flex-shrink-0 w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <AccessoryCardItem accessory={accessory} isDark={isDark} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {accessories.map((accessory) => (
              <div
                key={accessory.id}
                className="w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <AccessoryCardItem accessory={accessory} isDark={isDark} />
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className={`mt-8 text-[11px] tracking-[0.15em] uppercase text-center ${subColor}`}>
          Compatible with {product.name ?? product.model}
        </p>
      </div>
    </section>
  )
}
