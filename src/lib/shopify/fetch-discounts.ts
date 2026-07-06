/**
 * Fetch active automatic discounts from Shopify Admin API
 *
 * Shopify "Discounts" (Admin → Discounts) are a SEPARATE resource from a product's
 * price / compareAtPrice. They are never returned on the Product object and never
 * mutate `price`/`compareAtPrice` — they only apply at cart/checkout. To reflect a
 * discount on a product page we must query the discount list independently, then
 * match each discount's targeting (product / collection / all items) against each
 * product ourselves and compute the effective price.
 *
 * Scope (per product decision):
 * - AUTOMATIC discounts only (apply with no code) — a code discount only applies if
 *   the customer enters the code, so showing a lowered price for one would be wrong.
 * - Targeting: specific products, any collection the product belongs to, OR all items.
 *
 * ⚠️ Requires Admin API 2025-10+. Earlier versions only return automatic discounts
 *    whose `context` is `all`; product-/collection-targeted discounts are filtered out.
 *    The store is on 2025-10 (see admin-client.ts DEFAULT_ADMIN_API_VERSION).
 *
 * @module fetch-discounts
 */

import { shopifyAdminClient, type ShopifyAdminClient } from './admin-client'

/**
 * A normalized automatic discount, flattened from the Shopify GraphQL union types
 * into a shape that's cheap to match against products.
 */
export interface NormalizedDiscount {
  /** DiscountAutomaticNode GID */
  id: string
  title: string
  /** 'percentage' → `value` is a fraction 0–1; 'fixed' → `value` is an amount off */
  valueType: 'percentage' | 'fixed'
  value: number
  /** Currency of a fixed-amount discount (null for percentage discounts) */
  currencyCode: string | null
  startsAt: string | null
  endsAt: string | null
  /**
   * True when the discount has a minimum subtotal/quantity requirement. The discount
   * is still surfaced, but the deduction may not apply to every cart — the flag lets
   * editors (and the UI) qualify the "sale" price.
   */
  hasMinimumRequirement: boolean
  target: {
    /** Applies to every product in the store */
    all: boolean
    /** Product GIDs the discount explicitly targets */
    productIds: Set<string>
    /** Collection GIDs the discount targets */
    collectionIds: Set<string>
  }
}

/**
 * The synced per-product discount snapshot written to Payload
 * (`products.shopifyDiscount`). `active: false` means no automatic discount currently
 * applies — writing it on every sync clears a stale discount when one expires.
 */
export interface ProductDiscount {
  active: boolean
  title?: string | null
  valueType?: 'percentage' | 'fixed' | null
  value?: number | null
  discountedPrice?: number | null
  hasMinimumRequirement?: boolean | null
  startsAt?: string | null
  endsAt?: string | null
}

// Only `DiscountAutomaticBasic` carries an amount-off value we can apply to a single
// product price. Bxgy ("buy X get Y") and app-based discounts can't be reduced to a
// single deducted price, so they're intentionally ignored.
const ACTIVE_AUTOMATIC_DISCOUNTS_QUERY = `
  query ActiveAutomaticDiscounts($cursor: String) {
    automaticDiscountNodes(first: 50, after: $cursor, query: "status:active") {
      edges {
        node {
          id
          automaticDiscount {
            __typename
            ... on DiscountAutomaticBasic {
              title
              startsAt
              endsAt
              minimumRequirement {
                __typename
              }
              customerGets {
                value {
                  __typename
                  ... on DiscountPercentage {
                    percentage
                  }
                  ... on DiscountAmount {
                    amount {
                      amount
                      currencyCode
                    }
                  }
                }
                items {
                  __typename
                  ... on AllDiscountItems {
                    allItems
                  }
                  ... on DiscountProducts {
                    products(first: 250) {
                      nodes { id }
                    }
                  }
                  ... on DiscountCollections {
                    collections(first: 250) {
                      nodes { id }
                    }
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

interface AutomaticDiscountsResponse {
  automaticDiscountNodes: {
    edges: Array<{ node: any }>
    pageInfo: { hasNextPage: boolean; endCursor: string | null }
  }
}

/**
 * Normalize a single `DiscountAutomaticBasic` node into a NormalizedDiscount, or
 * return null if it isn't a basic amount-off discount we can apply per-product.
 */
function normalizeDiscount(node: any): NormalizedDiscount | null {
  const d = node?.automaticDiscount
  if (!d || d.__typename !== 'DiscountAutomaticBasic') return null

  const value = d.customerGets?.value
  let valueType: 'percentage' | 'fixed'
  let numericValue: number
  let currencyCode: string | null = null

  if (value?.__typename === 'DiscountPercentage' && typeof value.percentage === 'number') {
    valueType = 'percentage'
    numericValue = value.percentage // 0–1
  } else if (value?.__typename === 'DiscountAmount' && value.amount?.amount != null) {
    valueType = 'fixed'
    numericValue = parseFloat(value.amount.amount)
    currencyCode = value.amount.currencyCode ?? null
  } else {
    // DiscountOnQuantity and anything else can't be reduced to a single deduction.
    return null
  }

  if (!isFinite(numericValue) || numericValue <= 0) return null

  const items = d.customerGets?.items
  const target = {
    all: items?.__typename === 'AllDiscountItems' && items.allItems === true,
    productIds: new Set<string>(
      (items?.__typename === 'DiscountProducts' ? items.products?.nodes ?? [] : [])
        .map((n: any) => n?.id)
        .filter(Boolean),
    ),
    collectionIds: new Set<string>(
      (items?.__typename === 'DiscountCollections' ? items.collections?.nodes ?? [] : [])
        .map((n: any) => n?.id)
        .filter(Boolean),
    ),
  }

  // A discount that targets nothing we can match is not useful.
  if (!target.all && target.productIds.size === 0 && target.collectionIds.size === 0) {
    return null
  }

  return {
    id: node.id,
    title: d.title ?? 'Discount',
    valueType,
    value: numericValue,
    currencyCode,
    startsAt: d.startsAt ?? null,
    endsAt: d.endsAt ?? null,
    hasMinimumRequirement: Boolean(d.minimumRequirement),
    target,
  }
}

/**
 * Fetch all active automatic discounts from Shopify (US store by default).
 *
 * Cached for an hour via `revalidate` so a full bulk sync (or many single-product
 * syncs) doesn't re-query the discount list per product. Never throws — returns an
 * empty array on any failure so a discount-service outage can't break product sync.
 *
 * @param adminClient - Admin client to use (defaults to the US store client)
 */
export async function fetchActiveAutomaticDiscounts(
  adminClient: ShopifyAdminClient = shopifyAdminClient,
): Promise<NormalizedDiscount[]> {
  const discounts: NormalizedDiscount[] = []
  let hasNextPage = true
  let cursor: string | null = null
  let page = 0

  try {
    while (hasNextPage) {
      page++
      const data: AutomaticDiscountsResponse =
        await adminClient.query<AutomaticDiscountsResponse>(
          ACTIVE_AUTOMATIC_DISCOUNTS_QUERY,
          cursor ? { cursor } : undefined,
          { revalidate: 3600 },
        )

      for (const edge of data.automaticDiscountNodes.edges) {
        const normalized = normalizeDiscount(edge.node)
        if (normalized) discounts.push(normalized)
      }

      hasNextPage = data.automaticDiscountNodes.pageInfo.hasNextPage
      cursor = data.automaticDiscountNodes.pageInfo.endCursor

      // Safety valve — stores don't have hundreds of pages of active discounts.
      if (page >= 10) break
    }

    console.log(
      `[Shopify Discounts] Fetched ${discounts.length} applicable active automatic discount(s) across ${page} page(s)`,
    )
    return discounts
  } catch (error) {
    console.error('[Shopify Discounts] Failed to fetch active automatic discounts:', error)
    return []
  }
}

/**
 * Compute the applicable discount snapshot for one product.
 *
 * A discount applies when it targets all items, this specific product, or any
 * collection the product belongs to. When multiple apply, the one yielding the
 * largest deduction on `basePrice` wins. Returns `{ active: false }` when none apply
 * (so the caller always clears stale discount data on re-sync).
 */
export function computeProductDiscount(params: {
  productGid?: string | null
  collectionGids?: Array<string | null | undefined>
  basePrice?: number | null
  currency?: string | null
  discounts: NormalizedDiscount[]
}): ProductDiscount {
  const { productGid, collectionGids = [], basePrice, currency, discounts } = params

  if (!discounts.length || basePrice == null || !isFinite(basePrice) || basePrice <= 0) {
    return { active: false }
  }

  const productCollections = new Set(
    collectionGids.filter((c): c is string => Boolean(c)),
  )

  const applies = (d: NormalizedDiscount): boolean => {
    if (d.target.all) return true
    if (productGid && d.target.productIds.has(productGid)) return true
    for (const cid of d.target.collectionIds) {
      if (productCollections.has(cid)) return true
    }
    return false
  }

  const deductionFor = (d: NormalizedDiscount): number | null => {
    if (d.valueType === 'percentage') {
      return basePrice * d.value
    }
    // Fixed amount — skip if the currency is known on both sides and differs
    // (a USD product shouldn't be reduced by a CAD discount amount).
    if (currency && d.currencyCode && currency !== d.currencyCode) return null
    return Math.min(d.value, basePrice)
  }

  let best: NormalizedDiscount | null = null
  let bestDeduction = 0

  for (const d of discounts) {
    if (!applies(d)) continue
    const deduction = deductionFor(d)
    if (deduction == null || deduction <= 0) continue
    if (deduction > bestDeduction) {
      best = d
      bestDeduction = deduction
    }
  }

  if (!best) return { active: false }

  const discountedPrice = Math.max(0, Math.round((basePrice - bestDeduction) * 100) / 100)

  return {
    active: true,
    title: best.title,
    valueType: best.valueType,
    value: best.value,
    discountedPrice,
    hasMinimumRequirement: best.hasMinimumRequirement,
    startsAt: best.startsAt,
    endsAt: best.endsAt,
  }
}
