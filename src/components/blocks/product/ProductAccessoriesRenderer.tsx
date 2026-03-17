import Link from 'next/link'
import type { Product } from '@/payload-types'
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
// Card Component
// ---------------------------------------------------------------------------

interface CardProps {
  accessory: AccessoryCard
  isDark: boolean
  index: number
}

function AccessoryCardItem({ accessory, isDark, index }: CardProps) {
  const borderColor = isDark ? 'border-white/10' : 'border-kawai-neutral'
  const bgColor = isDark ? 'bg-white/[0.03] hover:bg-white/[0.06]' : 'bg-white hover:bg-white'
  const labelColor = isDark ? 'text-white/30' : 'text-kawai-charcoal/40'
  const nameColor = isDark ? 'text-white' : 'text-kawai-black'
  const descColor = isDark ? 'text-white/50' : 'text-kawai-charcoal/60'
  const priceColor = isDark ? 'text-kawai-gold' : 'text-kawai-black'
  const badgeBg = isDark ? 'bg-white/8 text-white/50' : 'bg-kawai-pearl text-kawai-charcoal/60'
  const dividerColor = isDark ? 'bg-white/10' : 'bg-kawai-neutral'
  const ctaColor = isDark
    ? 'text-white/40 border-white/15 hover:text-white hover:border-white/40'
    : 'text-kawai-charcoal/50 border-kawai-neutral hover:text-kawai-red hover:border-kawai-red'
  const imageBg = isDark ? 'bg-white/5' : 'bg-kawai-pearl/60'

  return (
    <Link
      href={`/products/${accessory.slug ?? accessory.model}`}
      className={`group relative flex flex-col border ${borderColor} ${bgColor} transition-all duration-300 ease-[var(--ease-piano)] overflow-hidden`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Index number — subtle corner label */}
      <span
        className={`absolute top-3 left-3 z-10 text-[10px] font-mono tracking-widest ${labelColor} select-none`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Image */}
      <div className={`relative w-full aspect-square overflow-hidden ${imageBg}`}>
        {accessory.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={accessory.imageUrl}
            alt={accessory.name ?? accessory.model}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-[var(--ease-piano)] group-hover:scale-105"
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
        <span
          className={`absolute top-3 right-3 text-[9px] font-medium tracking-[0.2em] uppercase px-2 py-0.5 ${badgeBg}`}
        >
          Accessory
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Model number */}
        <p className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-1 ${labelColor}`}>
          {accessory.model}
        </p>

        {/* Name */}
        <h3
          className={`text-base leading-snug font-[family-name:var(--font-brand-luxury)] transition-colors duration-200 group-hover:text-kawai-red ${nameColor}`}
        >
          {accessory.name ?? accessory.model}
        </h3>

        {/* Description */}
        {accessory.description && (
          <p className={`mt-1.5 text-xs leading-relaxed line-clamp-2 ${descColor}`}>
            {accessory.description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-3" />

        {/* Divider */}
        <div className={`w-full h-px my-3 ${dividerColor}`} />

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-2">
          {accessory.price?.msrp ? (
            <div>
              <span className={`block text-[9px] tracking-[0.2em] uppercase font-medium ${labelColor}`}>
                MSRP
              </span>
              <span className={`text-sm font-medium tabular-nums ${priceColor}`}>
                {formatPrice(accessory.price.msrp)}
              </span>
            </div>
          ) : (
            <span className={`text-xs ${labelColor}`}>Price on request</span>
          )}

          <span
            className={`text-[10px] font-medium tracking-[0.15em] uppercase border px-2.5 py-1 transition-all duration-200 ease-[var(--ease-piano)] ${ctaColor}`}
          >
            View
          </span>
        </div>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Main Renderer (async Server Component)
// ---------------------------------------------------------------------------

export async function ProductAccessoriesRenderer({
  heading = 'Accessories & Add-Ons',
  eyebrow = 'Enhance Your Piano',
  maxItems = 8,
  layout = 'grid',
  theme = 'light',
  product,
}: ProductAccessoriesRendererProps) {
  // Don't render on accessory pages
  if (!product) return null

  const limit = Math.min(Math.max(maxItems ?? 8, 2), 12)

  // product.accessories is populated at depth 2 by getProductBySlugDirect.
  // Editors configure compatible accessories directly on the piano product's sidebar.
  const accessories: AccessoryCard[] = (product.accessories ?? [])
    .filter((a): a is Product => typeof a === 'object' && a !== null)
    .filter((a) => a.status === 'active')
    .slice(0, limit)
    .map((a) => ({
      id: String(a.id),
      model: a.model,
      name: a.name ?? null,
      slug: a.slug ?? null,
      type: a.type ?? null,
      imageUrl: a.imageUrl ?? null,
      price: a.price ?? null,
      description: a.description ?? null,
    }))

  if (accessories.length === 0) return null

  const isDark = theme === 'dark'
  const sectionBg = isDark ? 'bg-kawai-black' : 'bg-[#f0ede8]'
  const headingColor = isDark ? 'text-white' : 'text-kawai-black'
  const subColor = isDark ? 'text-white/50' : 'text-kawai-charcoal/60'
  const dividerColor = isDark ? 'bg-white/15' : 'bg-kawai-black/20'
  const countColor = isDark ? 'text-white/20' : 'text-kawai-charcoal/20'

  // Grid columns based on count
  const count = accessories.length
  const gridCols =
    count === 2
      ? 'grid-cols-2'
      : count === 3
        ? 'grid-cols-2 md:grid-cols-3'
        : count <= 4
          ? 'grid-cols-2 md:grid-cols-4'
          : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  const carouselClasses =
    'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:-mx-8 lg:px-8'

  return (
    <section className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            {eyebrow && (
              <p className="text-[11px] tracking-[0.3em] uppercase text-kawai-red mb-3 font-medium">
                {eyebrow}
              </p>
            )}
            <h2
              className={`text-3xl md:text-4xl font-[family-name:var(--font-brand-luxury)] leading-tight ${headingColor}`}
            >
              {heading ?? 'Accessories & Add-Ons'}
            </h2>
            <div className={`mt-4 w-12 h-px ${dividerColor}`} />
          </div>

          {/* Item count */}
          <span
            className={`hidden md:block text-[11px] font-mono tracking-[0.2em] uppercase self-start mt-1 ${countColor}`}
          >
            {accessories.length} item{accessories.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid or Carousel */}
        {layout === 'carousel' ? (
          <div className={carouselClasses}>
            {accessories.map((accessory, index) => (
              <div
                key={accessory.id}
                className="snap-start flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
              >
                <AccessoryCardItem accessory={accessory} isDark={isDark} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-px ${gridCols}`} style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)' }}>
            {accessories.map((accessory, index) => (
              <AccessoryCardItem
                key={accessory.id}
                accessory={accessory}
                isDark={isDark}
                index={index}
              />
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
