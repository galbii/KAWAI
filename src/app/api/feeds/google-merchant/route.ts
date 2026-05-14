import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/queries'
import type { Product } from '@/payload-types'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kawaius.com'

// Google product category IDs
// https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt
const GMC_CATEGORY: Record<string, string> = {
  digital: '54',   // Arts & Entertainment > ... > Musical Instruments > Pianos
  grand: '54',
  upright: '54',
  hybrid: '54',
  shigeru: '54',
  accessory: '55', // Musical Instrument Accessories
  other: '54',
}

const PRODUCT_TYPE_LABEL: Record<string, string> = {
  digital: 'Digital Piano',
  grand: 'Grand Piano',
  upright: 'Upright Piano',
  hybrid: 'Hybrid Piano',
  shigeru: 'Grand Piano',
  accessory: 'Piano Accessory',
  other: 'Musical Instrument',
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function deriveAvailability(product: Product, variantAvailable?: boolean | null): string {
  if (product.status === 'discontinued') return 'out_of_stock'
  if (product.backorder) return 'backorder'
  if (variantAvailable === false) return 'out_of_stock'
  return 'in_stock'
}

function getAdditionalImages(product: Product, primaryImageUrl: string): string[] {
  const extras: string[] = []
  if (!Array.isArray(product.shopifyMedia)) return extras

  for (const media of product.shopifyMedia) {
    if (
      media.mediaType === 'IMAGE' &&
      media.imageUrl &&
      media.imageUrl !== primaryImageUrl &&
      media.status === 'READY'
    ) {
      extras.push(media.imageUrl)
      if (extras.length >= 10) break
    }
  }
  return extras
}

type VariantOption = { name?: string; value?: string }

function extractColor(options: unknown): string | null {
  if (!Array.isArray(options)) return null
  const match = (options as VariantOption[]).find(
    (o) => o.name?.toLowerCase() === 'color' || o.name?.toLowerCase() === 'finish',
  )
  return match?.value ?? null
}

type FeedItem = {
  id: string
  title: string
  description: string
  link: string
  imageLink: string
  additionalImages: string[]
  availability: string
  price: string | null
  brand: string
  condition: 'new'
  mpn: string
  gtin: string | null
  itemGroupId: string | null
  color: string | null
  googleProductCategory: string
  productType: string
}

function buildFeedItems(product: Product): FeedItem[] {
  const link = `${SITE_URL}/products/${product.slug}`
  const type = product.type ?? 'other'
  const googleProductCategory = GMC_CATEGORY[type] ?? '54'
  const productType = PRODUCT_TYPE_LABEL[type] ?? 'Musical Instrument'
  // Prefer description; fall back to name so the feed is never blank
  const description = product.description?.trim() || product.name || product.model

  const hasVariants = Array.isArray(product.variations) && product.variations.length > 0

  if (hasVariants) {
    return product.variations!.map((v) => {
      const variantSlug = (v.name ?? v.shopifyVariantId ?? 'variant')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      const imageLink = v.imageUrl || product.imageUrl || ''
      const additionalImages = getAdditionalImages(product, imageLink)
      const color = extractColor(v.options)
      const variantSuffix = v.name ? ` - ${v.name}` : ''

      return {
        id: `${product.model}-${variantSlug}`,
        title: `${product.name || product.model}${variantSuffix}`,
        description: description ?? '',
        link,
        imageLink,
        additionalImages,
        availability: deriveAvailability(product, v.available),
        price: v.price != null ? `${v.price.toFixed(2)} USD` : null,
        brand: 'Kawai',
        condition: 'new',
        mpn: product.model,
        gtin: v.barcode || null,
        itemGroupId: product.model,
        color,
        googleProductCategory,
        productType,
      }
    })
  }

  // Single-SKU product — one feed row
  const imageLink = product.imageUrl || ''
  const additionalImages = getAdditionalImages(product, imageLink)
  const msrp = product.price?.msrp

  return [
    {
      id: product.model,
      title: product.name || product.model,
      description: description ?? '',
      link,
      imageLink,
      additionalImages,
      availability: deriveAvailability(product),
      price: msrp != null ? `${msrp.toFixed(2)} USD` : null,
      brand: 'Kawai',
      condition: 'new',
      mpn: product.model,
      gtin: null,
      itemGroupId: null,
      color: null,
      googleProductCategory,
      productType,
    },
  ]
}

function itemToXml(item: FeedItem): string {
  const lines: string[] = ['    <item>']

  const tag = (name: string, value: string | null | undefined) => {
    if (!value) return
    lines.push(`      <g:${name}>${escapeXml(value)}</g:${name}>`)
  }

  tag('id', item.id)
  tag('title', item.title)
  tag('description', item.description)
  tag('link', item.link)
  tag('image_link', item.imageLink)
  for (const img of item.additionalImages) tag('additional_image_link', img)
  tag('availability', item.availability)
  if (item.price) tag('price', item.price)
  tag('brand', item.brand)
  tag('condition', item.condition)
  tag('mpn', item.mpn)
  if (item.gtin) tag('gtin', item.gtin)
  if (item.itemGroupId) tag('item_group_id', item.itemGroupId)
  if (item.color) tag('color', item.color)
  tag('google_product_category', item.googleProductCategory)
  tag('product_type', item.productType)

  lines.push('    </item>')
  return lines.join('\n')
}

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const { docs: products } = await payload.find({
      collection: 'products',
      where: { status: { equals: 'active' } },
      depth: 0,
      limit: 500,
    })

    const items = products.flatMap(buildFeedItems)

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
      '  <channel>',
      `    <title>${escapeXml('Kawai America Piano Catalog')}</title>`,
      `    <link>${escapeXml(SITE_URL)}</link>`,
      `    <description>${escapeXml('Kawai acoustic and digital piano products — kawaius.com')}</description>`,
      ...items.map(itemToXml),
      '  </channel>',
      '</rss>',
    ].join('\n')

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('[GMC Feed] Error generating feed:', error)
    return new NextResponse('Feed generation failed', { status: 500 })
  }
}
