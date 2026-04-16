'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Product } from '@/payload-types'
import type { Product as ShopifyProduct } from '@/lib/shopify'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { BuyNowButton } from '@/components/piano/BuyNowButton'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DisplayOptions {
  showPrice?: boolean | null
  showBuyNow?: boolean | null
  showAddToCart?: boolean | null
  showDescription?: boolean | null
  showVariantSelector?: boolean | null
}

interface LayoutOptions {
  orientation?: ('horizontal' | 'vertical') | null
  imageSize?: ('small' | 'medium' | 'large') | null
  backgroundColor?: ('white' | 'pearl' | 'black') | null
}

export interface ProductReferenceBlockProps {
  product: Product
  shopifyProduct: ShopifyProduct | null
  isCanada?: boolean
  display?: DisplayOptions | null
  layout?: LayoutOptions | null
}

// ─── Image size map ───────────────────────────────────────────────────────────

const IMAGE_WIDTH_CLASS = {
  small:  'w-40 shrink-0',
  medium: 'w-56 shrink-0',
  large:  'w-72 shrink-0',
} as const

const IMAGE_ASPECT = {
  small:  'aspect-[3/4]',
  medium: 'aspect-[3/4]',
  large:  'aspect-[3/4]',
} as const

// ─── Background styles ────────────────────────────────────────────────────────

const BG_CLASS = {
  white: 'bg-white',
  pearl: 'bg-kawai-pearl',
  black: 'bg-kawai-black',
} as const

const TEXT_CLASS = {
  white: 'text-kawai-black',
  pearl: 'text-kawai-black',
  black: 'text-white',
} as const

const MUTED_CLASS = {
  white: 'text-kawai-charcoal/60',
  pearl: 'text-kawai-charcoal/60',
  black: 'text-white/50',
} as const

const BORDER_CLASS = {
  white: 'border-kawai-neutral',
  pearl: 'border-kawai-neutral',
  black: 'border-white/10',
} as const

// ─── Price display helper ─────────────────────────────────────────────────────

function PriceDisplay({
  shopifyProduct,
  selectedVariantId,
  muted,
}: {
  shopifyProduct: ShopifyProduct
  selectedVariantId: string | null
  muted: string
}) {
  const variant = selectedVariantId
    ? shopifyProduct.variants.find((v) => v.id === selectedVariantId)
    : shopifyProduct.variants[0]

  if (!variant) {
    return (
      <p className={cn('text-lg font-semibold font-[family-name:var(--font-brand-sans)]')}>
        {shopifyProduct.price.display}
      </p>
    )
  }

  const onSale = variant.compareAtPrice !== null && variant.compareAtPrice > variant.price

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-lg font-bold font-[family-name:var(--font-brand-sans)] text-kawai-red">
        {formatPrice(variant.price)}
      </span>
      {onSale && variant.compareAtPrice && (
        <span className={cn('text-sm line-through font-[family-name:var(--font-brand-sans)]', muted)}>
          {formatPrice(variant.compareAtPrice)}
        </span>
      )}
    </div>
  )
}

// ─── Variant selector ─────────────────────────────────────────────────────────

function VariantSelector({
  variants,
  selectedId,
  onSelect,
  borderClass,
}: {
  variants: ShopifyProduct['variants']
  selectedId: string | null
  onSelect: (id: string) => void
  borderClass: string
}) {
  if (variants.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          disabled={!v.available}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150',
            'font-[family-name:var(--font-brand-sans)]',
            selectedId === v.id
              ? 'bg-kawai-red border-kawai-red text-white'
              : cn('bg-transparent hover:border-kawai-red/50', borderClass),
            !v.available && 'opacity-40 cursor-not-allowed line-through',
          )}
        >
          {v.title}
        </button>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductReferenceBlock({
  product,
  shopifyProduct,
  isCanada = false,
  display,
  layout,
}: ProductReferenceBlockProps) {
  const orientation   = layout?.orientation   ?? 'horizontal'
  const imageSize     = layout?.imageSize     ?? 'medium'
  const bg            = layout?.backgroundColor ?? 'white'

  const showPrice          = display?.showPrice          !== false
  const showBuyNow         = display?.showBuyNow         !== false
  const showAddToCart      = display?.showAddToCart      !== false
  const showDescription    = display?.showDescription    !== false
  const showVariantSelector = display?.showVariantSelector !== false

  const variants = shopifyProduct?.variants ?? []

  // Default to first available variant
  const defaultVariantId = useMemo(() => {
    const first = variants.find((v) => v.available) ?? variants[0]
    return first?.id ?? null
  }, [variants])

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId)

  const selectedVariant = selectedVariantId
    ? variants.find((v) => v.id === selectedVariantId) ?? null
    : null

  // Derive display image: try Shopify product image, then CMS imageUrl
  const imageSrc: string | null =
    shopifyProduct?.image?.url ??
    (typeof product.imageUrl === 'string' ? product.imageUrl : null)

  const isHorizontal = orientation === 'horizontal'
  const hasShopify   = shopifyProduct !== null
  const canTransact  = !isCanada && hasShopify

  const bgClass     = BG_CLASS[bg]
  const textClass   = TEXT_CLASS[bg]
  const mutedClass  = MUTED_CLASS[bg]
  const borderClass = BORDER_CLASS[bg]

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden border',
        bgClass,
        borderClass,
        'shadow-brand-subtle',
      )}
    >
      <div
        className={cn(
          isHorizontal ? 'flex flex-col sm:flex-row' : 'flex flex-col',
        )}
      >
        {/* ── Image ── */}
        {imageSrc && (
          <div
            className={cn(
              'relative overflow-hidden bg-kawai-pearl',
              isHorizontal
                ? cn(IMAGE_WIDTH_CLASS[imageSize], IMAGE_ASPECT[imageSize], 'sm:h-auto')
                : 'w-full aspect-[16/9]',
            )}
          >
            <Image
              src={imageSrc}
              alt={product.name ?? product.model}
              fill
              className="object-contain p-4"
              sizes={
                isHorizontal
                  ? '(max-width: 640px) 100vw, 288px'
                  : '100vw'
              }
            />
          </div>
        )}

        {/* ── Details ── */}
        <div className={cn('flex flex-col justify-between p-6 flex-1', textClass)}>
          <div className="space-y-4">
            {/* Model badge + name */}
            <div>
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.25em] font-semibold font-[family-name:var(--font-brand-sans)]',
                  mutedClass,
                )}
              >
                {product.model}
              </span>
              <h3
                className={cn(
                  'text-xl font-semibold leading-snug mt-0.5 font-[family-name:var(--font-brand-serif)]',
                  textClass,
                )}
              >
                {product.name ?? product.model}
              </h3>
            </div>

            {/* Description */}
            {showDescription && product.description && (
              <p
                className={cn(
                  'text-sm leading-relaxed line-clamp-3 font-[family-name:var(--font-brand-sans)]',
                  mutedClass,
                )}
              >
                {product.description}
              </p>
            )}

            {/* Variant selector */}
            {showVariantSelector && canTransact && (
              <VariantSelector
                variants={variants}
                selectedId={selectedVariantId}
                onSelect={setSelectedVariantId}
                borderClass={borderClass}
              />
            )}

            {/* Price */}
            {showPrice && canTransact && (
              <PriceDisplay
                shopifyProduct={shopifyProduct!}
                selectedVariantId={selectedVariantId}
                muted={mutedClass}
              />
            )}
          </div>

          {/* ── CTAs ── */}
          <div className="mt-6 space-y-2">
            {canTransact ? (
              <>
                {/* Add to Cart */}
                {showAddToCart && selectedVariant && (
                  <AddToCartButton
                    variantId={selectedVariant.id}
                    available={selectedVariant.available}
                    className="w-full"
                  />
                )}

                {/* Buy Now */}
                {showBuyNow && selectedVariant && (
                  <BuyNowButton
                    items={[{ shopifyVariantId: selectedVariant.id, quantity: 1 }]}
                    className="w-full"
                  />
                )}

                {/* Learn more link */}
                {product.slug && (
                  <Link
                    href={`/products/${product.slug}`}
                    className={cn(
                      'block text-center text-xs font-medium mt-1 transition-colors duration-150',
                      'font-[family-name:var(--font-brand-sans)]',
                      bg === 'black'
                        ? 'text-white/50 hover:text-white/80'
                        : 'text-kawai-charcoal/50 hover:text-kawai-red',
                    )}
                  >
                    View full product page →
                  </Link>
                )}
              </>
            ) : (
              /* Canada / no Shopify: Find a Dealer */
              <div className="space-y-2">
                <Link
                  href="/find-a-dealer"
                  className={cn(
                    'flex items-center justify-center gap-2 w-full py-3',
                    'text-[10px] uppercase tracking-[0.22em] font-bold',
                    'font-[family-name:var(--font-brand-sans)]',
                    'bg-kawai-red text-white hover:bg-red-700 transition-colors duration-200',
                    'rounded',
                  )}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Find a Dealer
                </Link>
                {product.slug && (
                  <Link
                    href={`/products/${product.slug}`}
                    className={cn(
                      'block text-center text-xs font-medium mt-1 transition-colors duration-150',
                      'font-[family-name:var(--font-brand-sans)]',
                      bg === 'black'
                        ? 'text-white/50 hover:text-white/80'
                        : 'text-kawai-charcoal/50 hover:text-kawai-red',
                    )}
                  >
                    View full product page →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
