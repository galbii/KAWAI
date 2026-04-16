'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Product } from '@/payload-types'
import type { Product as ShopifyProduct } from '@/lib/shopify'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { BuyNowButton } from '@/components/piano/BuyNowButton'
import { cn, formatPrice } from '@/lib/utils'

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
  /** Populated CMS Product object (relationship at depth ≥ 1) */
  product: Product | string | null
  /** Shopify product — available in server-rendered contexts; null in client-only (blog) contexts */
  shopifyProduct?: ShopifyProduct | null
  /** Canada site flag — passed by server wrapper; falls back to hostname detection */
  isCanada?: boolean
  display?: DisplayOptions | null
  layout?: LayoutOptions | null
}

// ─── Normalised variant shape (works with either data source) ─────────────────

interface NormalisedVariant {
  id: string           // Shopify variant ID (numeric or GID)
  title: string
  price: number
  compareAtPrice: number | null
  available: boolean
}

function getVariants(
  product: Product,
  shopifyProduct: ShopifyProduct | null | undefined,
): NormalisedVariant[] {
  // Prefer live Shopify data when available (server-rendered path)
  if (shopifyProduct?.variants?.length) {
    return shopifyProduct.variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: v.price,
      compareAtPrice: v.compareAtPrice ?? null,
      available: v.available ?? true,
    }))
  }

  // Fall back to CMS variations (client-rendered path — synced from Shopify on last save)
  return (product.variations ?? [])
    .filter((v): v is typeof v & { name: string } => Boolean(v.name))
    .map((v) => ({
      id: v.shopifyVariantId ?? '',
      title: v.name,
      price: v.price ?? 0,
      compareAtPrice: v.compareAtPrice ?? null,
      available: v.available ?? true,
    }))
    .filter((v) => v.id !== '')
}

// ─── Style maps ──────────────────────────────────────────────────────────────

const IMAGE_WIDTH: Record<string, string> = {
  small:  'w-40 shrink-0',
  medium: 'w-56 shrink-0',
  large:  'w-72 shrink-0',
}
const BG:     Record<string, string> = { white: 'bg-white',        pearl: 'bg-kawai-pearl',  black: 'bg-kawai-black' }
const TEXT:   Record<string, string> = { white: 'text-kawai-black', pearl: 'text-kawai-black', black: 'text-white' }
const MUTED:  Record<string, string> = { white: 'text-kawai-charcoal/60', pearl: 'text-kawai-charcoal/60', black: 'text-white/50' }
const BORDER: Record<string, string> = { white: 'border-kawai-neutral', pearl: 'border-kawai-neutral', black: 'border-white/10' }

// ─── Sub-components ──────────────────────────────────────────────────────────

function VariantSelector({
  variants,
  selectedId,
  onSelect,
  borderClass,
}: {
  variants: NormalisedVariant[]
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

function PriceRow({
  variant,
  mutedClass,
}: {
  variant: NormalisedVariant
  mutedClass: string
}) {
  const onSale = variant.compareAtPrice !== null && variant.compareAtPrice > variant.price
  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-lg font-bold font-[family-name:var(--font-brand-sans)] text-kawai-red">
        {formatPrice(variant.price)}
      </span>
      {onSale && variant.compareAtPrice && (
        <span className={cn('text-sm line-through font-[family-name:var(--font-brand-sans)]', mutedClass)}>
          {formatPrice(variant.compareAtPrice)}
        </span>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProductReferenceBlock({
  product: productProp,
  shopifyProduct,
  isCanada: isCanadaProp,
  display,
  layout,
}: ProductReferenceBlockProps) {
  // Resolve relationship — may arrive as populated object or bare string ID
  const product = typeof productProp === 'object' && productProp !== null ? productProp : null

  // Canada detection: use prop when available (server path), fall back to hostname (client path)
  const [isCanada, setIsCanada] = useState(isCanadaProp ?? false)
  useEffect(() => {
    if (isCanadaProp === undefined) {
      setIsCanada(window.location.hostname.startsWith('cad.'))
    }
  }, [isCanadaProp])

  const orientation  = layout?.orientation    ?? 'horizontal'
  const imageSize    = layout?.imageSize      ?? 'medium'
  const bg           = layout?.backgroundColor ?? 'white'

  const showPrice           = display?.showPrice           !== false
  const showBuyNow          = display?.showBuyNow          !== false
  const showAddToCart       = display?.showAddToCart       !== false
  const showDescription     = display?.showDescription     !== false
  const showVariantSelector = display?.showVariantSelector !== false

  const variants = useMemo(
    () => (product ? getVariants(product, shopifyProduct) : []),
    [product, shopifyProduct],
  )

  const defaultVariantId = useMemo(() => {
    return (variants.find((v) => v.available) ?? variants[0])?.id ?? null
  }, [variants])

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId)
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null

  const imageSrc = shopifyProduct?.image?.url ?? product?.imageUrl ?? null
  const hasShopify  = shopifyProduct !== null && shopifyProduct !== undefined
  const hasVariants = variants.length > 0
  // Can transact when: not Canada, has variant IDs (either from Shopify or CMS sync)
  const canTransact = !isCanada && hasVariants

  if (!product) return null

  const bgClass     = BG[bg]     ?? 'bg-white'
  const textClass   = TEXT[bg]   ?? 'text-kawai-black'
  const mutedClass  = MUTED[bg]  ?? 'text-kawai-charcoal/60'
  const borderClass = BORDER[bg] ?? 'border-kawai-neutral'

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden border my-6',
        bgClass,
        borderClass,
        'shadow-brand-subtle',
      )}
    >
      <div className={cn('flex', orientation === 'horizontal' ? 'flex-col sm:flex-row' : 'flex-col')}>

        {/* ── Image ── */}
        {imageSrc && (
          <div
            className={cn(
              'relative overflow-hidden bg-kawai-pearl shrink-0',
              orientation === 'horizontal'
                ? cn(IMAGE_WIDTH[imageSize] ?? IMAGE_WIDTH.medium, 'aspect-[3/4] sm:h-auto')
                : 'w-full aspect-[16/9]',
            )}
          >
            <Image
              src={imageSrc}
              alt={product.name ?? product.model}
              fill
              className="object-contain p-4"
              sizes={orientation === 'horizontal' ? '(max-width: 640px) 100vw, 288px' : '100vw'}
            />
          </div>
        )}

        {/* ── Details ── */}
        <div className={cn('flex flex-col justify-between p-6 flex-1 min-w-0', textClass)}>
          <div className="space-y-4">

            {/* Model + name */}
            <div>
              <span className={cn('text-[10px] uppercase tracking-[0.25em] font-semibold font-[family-name:var(--font-brand-sans)]', mutedClass)}>
                {product.model}
              </span>
              <h3 className={cn('text-xl font-semibold leading-snug mt-0.5 font-[family-name:var(--font-brand-serif)]', textClass)}>
                {product.name ?? product.model}
              </h3>
            </div>

            {/* Description */}
            {showDescription && product.description && (
              <p className={cn('text-sm leading-relaxed line-clamp-3 font-[family-name:var(--font-brand-sans)]', mutedClass)}>
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
            {showPrice && canTransact && selectedVariant && (
              <PriceRow variant={selectedVariant} mutedClass={mutedClass} />
            )}
          </div>

          {/* ── CTAs ── */}
          <div className="mt-6 space-y-2">
            {canTransact && selectedVariant && selectedVariant.available ? (
              <>
                {showAddToCart && (
                  <AddToCartButton
                    variantId={selectedVariant.id}
                    available={selectedVariant.available}
                    className="w-full"
                  />
                )}
                {showBuyNow && (
                  <BuyNowButton
                    items={[{ shopifyVariantId: selectedVariant.id, quantity: 1 }]}
                    className="w-full"
                  />
                )}
                {product.slug && (
                  <Link
                    href={`/products/${product.slug}`}
                    className={cn(
                      'block text-center text-xs font-medium mt-1 transition-colors duration-150',
                      'font-[family-name:var(--font-brand-sans)]',
                      bg === 'black' ? 'text-white/50 hover:text-white/80' : 'text-kawai-charcoal/50 hover:text-kawai-red',
                    )}
                  >
                    View full product page →
                  </Link>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/find-a-dealer"
                  className="flex items-center justify-center gap-2 w-full py-3 text-[10px] uppercase tracking-[0.22em] font-bold font-[family-name:var(--font-brand-sans)] bg-kawai-red text-white hover:bg-red-700 transition-colors duration-200 rounded"
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
                      bg === 'black' ? 'text-white/50 hover:text-white/80' : 'text-kawai-charcoal/50 hover:text-kawai-red',
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
