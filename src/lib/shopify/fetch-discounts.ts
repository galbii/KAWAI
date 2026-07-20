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
    /** Product GIDs the discount targets as WHOLE products (every variant) */
    productIds: Set<string>
    /** Collection GIDs the discount targets */
    collectionIds: Set<string>
    /**
     * Variant-level targeting: parent product GID → the specific variant GIDs
     * (finishes) the discount applies to. A product present here but not in
     * `productIds` is only discounted on these variants.
     */
    variantIdsByProduct: Map<string, Set<string>>
  }
}

/**
 * The synced per-product discount snapshot written to Payload
 * (`products.shopifyDiscount`). All-null means no automatic discount currently
 * applies — writing it on every sync clears a stale discount when one expires.
 * A present `discountedPrice` is the signal that a discount is active.
 */
export interface ProductDiscount {
  /** Discount name in Shopify */
  title?: string | null
  /**
   * How to read `value`: 'percentage' → `value` is a fraction 0–1; 'fixed' →
   * `value` is an amount off. Stored so the frontend can re-apply the discount to
   * an individual variation's price (the synced `discountedPrice` only reflects the
   * min variant price). Null when no discount applies.
   */
  valueType?: 'percentage' | 'fixed' | null
  /** Raw discount value — a fraction for a percentage discount (0.2 = 20%), or an amount for a fixed discount */
  value?: number | null
  /** Effective price after the discount */
  discountedPrice?: number | null
  /**
   * Variant GIDs the discount is restricted to, when it targets specific variants
   * (finishes) of this product rather than the whole product. Null/empty means the
   * discount applies to every variant. US snapshots hold US-store GIDs; CAD
   * snapshots hold CA-store GIDs.
   */
  entitledVariantIds?: string[] | null
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
                    productVariants(first: 250) {
                      nodes {
                        id
                        product { id }
                      }
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

  // Product targeting can arrive as whole products OR specific variants. Whole
  // products go in `productIds` (discount every variant); variant targets are kept
  // per parent product in `variantIdsByProduct` so a finish-level discount is only
  // applied to the entitled finishes.
  const productIds = new Set<string>()
  const variantIdsByProduct = new Map<string, Set<string>>()
  if (items?.__typename === 'DiscountProducts') {
    for (const n of items.products?.nodes ?? []) {
      if (n?.id) productIds.add(n.id)
    }
    for (const v of items.productVariants?.nodes ?? []) {
      if (!v?.id || !v?.product?.id) continue
      let set = variantIdsByProduct.get(v.product.id)
      if (!set) {
        set = new Set<string>()
        variantIdsByProduct.set(v.product.id, set)
      }
      set.add(v.id)
    }
  }

  const target = {
    all: items?.__typename === 'AllDiscountItems' && items.allItems === true,
    productIds,
    collectionIds: new Set<string>(
      (items?.__typename === 'DiscountCollections' ? items.collections?.nodes ?? [] : [])
        .map((n: any) => n?.id)
        .filter(Boolean),
    ),
    variantIdsByProduct,
  }

  // A discount that targets nothing we can match is not useful.
  if (
    !target.all &&
    target.productIds.size === 0 &&
    target.collectionIds.size === 0 &&
    target.variantIdsByProduct.size === 0
  ) {
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
 * Fetched LIVE (no cache) so every sync reflects the current discount state — a
 * cached list would make a product's synced discount lag behind Shopify by up to the
 * cache TTL, which reads as "the discount didn't sync." Cost is one call per sync:
 * the bulk sync fetches this once and passes the list to every product; a single
 * product save fetches it once. Never throws — returns an empty array on any failure
 * so a discount-service outage can't break product sync.
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
          { cache: 'no-store' },
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
 * largest deduction on `basePrice` wins. Returns an all-null snapshot when none
 * apply (so the caller always clears stale discount data on re-sync).
 */
export function computeProductDiscount(params: {
  productGid?: string | null
  collectionGids?: Array<string | null | undefined>
  basePrice?: number | null
  currency?: string | null
  discounts: NormalizedDiscount[]
}): ProductDiscount {
  const { productGid, collectionGids = [], basePrice, currency, discounts } = params

  const empty: ProductDiscount = {
    title: null,
    valueType: null,
    value: null,
    discountedPrice: null,
    entitledVariantIds: null,
  }

  if (!discounts.length || basePrice == null || !isFinite(basePrice) || basePrice <= 0) {
    return empty
  }

  const productCollections = new Set(
    collectionGids.filter((c): c is string => Boolean(c)),
  )

  // True when the discount covers the WHOLE product — all items, this product
  // explicitly, or a collection it belongs to. Variant-level targeting is narrower
  // and tracked separately so the snapshot can scope the discount to finishes.
  const appliesToWholeProduct = (d: NormalizedDiscount): boolean => {
    if (d.target.all) return true
    if (productGid && d.target.productIds.has(productGid)) return true
    for (const cid of d.target.collectionIds) {
      if (productCollections.has(cid)) return true
    }
    return false
  }

  const applies = (d: NormalizedDiscount): boolean => {
    if (appliesToWholeProduct(d)) return true
    if (productGid && d.target.variantIdsByProduct.has(productGid)) return true
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

  if (!best) return empty

  const discountedPrice = Math.max(0, Math.round((basePrice - bestDeduction) * 100) / 100)

  // Whole-product coverage → null (every finish qualifies). Otherwise the discount
  // reached this product only through specific variants — scope it to those finishes.
  const entitledVariantIds = appliesToWholeProduct(best)
    ? null
    : Array.from((productGid && best.target.variantIdsByProduct.get(productGid)) || [])

  return {
    title: best.title,
    valueType: best.valueType,
    value: best.value,
    discountedPrice,
    entitledVariantIds,
  }
}
