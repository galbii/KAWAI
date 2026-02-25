/**
 * Fetch all products with custom.model metafield from Shopify Admin API
 *
 * This utility fetches all products from Shopify that have a `custom.model` metafield.
 * It handles pagination to retrieve large catalogs and returns a clean list of products
 * suitable for bulk import into Payload CMS.
 *
 * @module fetch-all-products
 */

import { shopifyAdminClient } from './admin-client'
import type { ShopifyProductData, ShopifySpecification } from './fetch-product'

/**
 * GraphQL query to fetch products with custom.model metafield
 *
 * Features:
 * - Fetches up to 250 products per page (Shopify Admin API limit)
 * - Includes pagination support via cursor
 * - Only fetches necessary fields for sync
 * - Filters for products with custom.model metafield
 */
const PRODUCTS_WITH_MODEL_QUERY = `
  query GetProductsWithModels($cursor: String) {
    products(first: 250, after: $cursor, query: "metafields.custom.model:*") {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          vendor
          productType
          tags
          status
          createdAt
          updatedAt
          publishedAt

          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }

          compareAtPriceRange {
            minVariantCompareAtPrice {
              amount
              currencyCode
            }
            maxVariantCompareAtPrice {
              amount
              currencyCode
            }
          }

          featuredImage {
            url
            altText
            width
            height
          }

          images(first: 20) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }

          variants(first: 100) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                sku
                barcode
                availableForSale
                inventoryQuantity
                image {
                  url
                  altText
                  width
                  height
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }

          # Custom metafields
          metafield_model: metafield(namespace: "custom", key: "model") {
            key
            value
            type
          }

          metafield_blueprint: metafield(namespace: "custom", key: "blueprint") {
            key
            value
            type
            reference {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }

          metafield_specifications: metafield(namespace: "custom", key: "specifications") {
            key
            value
            type
            references(first: 50) {
              edges {
                node {
                  ... on Metaobject {
                    id
                    type
                    fields {
                      key
                      value
                    }
                  }
                }
              }
            }
          }

          metafield_highlights: metafield(namespace: "custom", key: "highlights") {
            key
            value
            type
            references(first: 20) {
              edges {
                node {
                  ... on Metaobject {
                    id
                    type
                    fields {
                      key
                      value
                    }
                  }
                }
              }
            }
          }

          metafield_specification_json: metafield(namespace: "custom", key: "specification_json") {
            key
            value
            type
          }

          seo {
            title
            description
          }

          category {
            id
            name
            fullName
          }

          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
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

/**
 * GraphQL response type
 */
interface ProductsWithModelsResponse {
  products: {
    edges: Array<{
      node: any
    }>
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
  }
}

/**
 * Fetch all products with custom.model metafield from Shopify
 *
 * This function:
 * 1. Queries Shopify Admin API for products with custom.model metafield
 * 2. Handles pagination automatically (fetches all pages)
 * 3. Transforms raw Shopify data to ShopifyProductData format
 * 4. Returns array of products ready for Payload import
 *
 * @returns Array of Shopify products with model metafields
 * @throws Error if API request fails
 *
 * @example
 * ```typescript
 * const products = await fetchAllShopifyProductsWithModels()
 * console.log(`Found ${products.length} products with models`)
 * products.forEach(p => console.log(p.metafields?.model, p.title))
 * ```
 */
export async function fetchAllShopifyProductsWithModels(): Promise<ShopifyProductData[]> {
  console.log('[Shopify Fetch All] Starting bulk fetch for products with custom.model metafield')

  const allProducts: ShopifyProductData[] = []
  let hasNextPage = true
  let cursor: string | null = null
  let pageCount = 0

  try {
    while (hasNextPage) {
      pageCount++
      console.log(
        `[Shopify Fetch All] Fetching page ${pageCount}${cursor ? ` (cursor: ${cursor.substring(0, 20)}...)` : ''}`
      )

      // Query Shopify with pagination
      const variables: { cursor?: string } | undefined = cursor ? { cursor } : undefined
      const data: ProductsWithModelsResponse = await shopifyAdminClient.query<ProductsWithModelsResponse>(
        PRODUCTS_WITH_MODEL_QUERY,
        variables
      )

      // Extract products from edges
      const products = data.products.edges
        .map((edge) => edge.node)
        .filter((node) => node.metafield_model?.value) // Ensure product has model metafield

      console.log(`[Shopify Fetch All] Page ${pageCount}: Raw products count: ${products.length}`)

      // Transform each product with detailed logging
      const transformedProducts = products.map((product, index) => {
        console.log(`\n[Shopify Fetch All] Transforming product ${index + 1}/${products.length}: ${product.title}`)
        console.log(`[Shopify Fetch All] - Model: ${product.metafield_model?.value}`)
        console.log(`[Shopify Fetch All] - Blueprint metafield exists: ${!!product.metafield_blueprint}`)
        console.log(`[Shopify Fetch All] - Specifications metafield exists: ${!!product.metafield_specifications}`)
        console.log(`[Shopify Fetch All] - Highlights metafield exists: ${!!product.metafield_highlights}`)
        console.log(`[Shopify Fetch All] - Highlights edges count: ${product.metafield_highlights?.references?.edges?.length ?? 0}`)

        if (product.metafield_blueprint) {
          console.log(`[Shopify Fetch All] - Blueprint details:`, JSON.stringify({
            hasReference: !!product.metafield_blueprint.reference,
            hasImage: !!product.metafield_blueprint.reference?.image,
            imageUrl: product.metafield_blueprint.reference?.image?.url,
          }, null, 2))
        }

        if (product.metafield_specifications) {
          console.log(`[Shopify Fetch All] - Specifications details:`, JSON.stringify({
            hasReferences: !!product.metafield_specifications.references,
            edgesCount: product.metafield_specifications.references?.edges?.length || 0,
          }, null, 2))
        }

        return transformShopifyProduct(product)
      })

      allProducts.push(...transformedProducts)

      console.log(
        `[Shopify Fetch All] Page ${pageCount}: fetched ${products.length} products (total: ${allProducts.length})\n`
      )

      // Check pagination
      hasNextPage = data.products.pageInfo.hasNextPage
      cursor = data.products.pageInfo.endCursor
    }

    console.log(
      `[Shopify Fetch All] ✅ Successfully fetched ${allProducts.length} products with models across ${pageCount} pages`
    )

    return allProducts
  } catch (error) {
    console.error('[Shopify Fetch All] ❌ Error fetching products:', error)
    throw error
  }
}

/**
 * Transform Shopify GraphQL response to simplified format
 *
 * Handles:
 * - Edge/node connection unwrapping
 * - Price formatting
 * - Null safety for optional fields
 * - Metafield extraction
 *
 * @param shopifyProduct - Raw GraphQL response
 * @returns Simplified product data structure
 */
function transformShopifyProduct(shopifyProduct: any): ShopifyProductData {
  // Price formatting helper
  const formatPrice = (amount: string, currency: string): string => {
    const num = parseFloat(amount)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num)
  }

  const minPrice = shopifyProduct.priceRangeV2.minVariantPrice
  const maxPrice = shopifyProduct.priceRangeV2.maxVariantPrice
  const currency = minPrice.currencyCode

  // Format price display
  const minFormatted = formatPrice(minPrice.amount, currency)
  const maxFormatted = formatPrice(maxPrice.amount, currency)
  const priceDisplay =
    minPrice.amount === maxPrice.amount ? minFormatted : `${minFormatted} - ${maxFormatted}`

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description || '',
    descriptionHtml: shopifyProduct.descriptionHtml || '',
    vendor: shopifyProduct.vendor || '',
    productType: shopifyProduct.productType || '',
    tags: shopifyProduct.tags || [],
    status: shopifyProduct.status,

    price: {
      min: minPrice.amount,
      max: maxPrice.amount,
      currency,
      display: priceDisplay,
    },

    compareAtPrice: shopifyProduct.compareAtPriceRange
      ? {
          min: shopifyProduct.compareAtPriceRange.minVariantCompareAtPrice.amount,
          max: shopifyProduct.compareAtPriceRange.maxVariantCompareAtPrice.amount,
        }
      : null,

    images: shopifyProduct.images.edges.map((edge: any) => ({
      url: edge.node.url,
      alt: edge.node.altText || '',
      width: edge.node.width,
      height: edge.node.height,
    })),

    featuredImage: shopifyProduct.featuredImage
      ? {
          url: shopifyProduct.featuredImage.url,
          alt: shopifyProduct.featuredImage.altText || '',
          width: shopifyProduct.featuredImage.width,
          height: shopifyProduct.featuredImage.height,
        }
      : null,

    variants: shopifyProduct.variants.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.price,
      compareAtPrice: edge.node.compareAtPrice,
      sku: edge.node.sku || '',
      barcode: edge.node.barcode,
      available: edge.node.availableForSale,
      inventoryQuantity: edge.node.inventoryQuantity || 0,
      inventoryTracked: false,
      image: edge.node.image ? {
        url: edge.node.image.url,
        alt: edge.node.image.altText || '',
        width: edge.node.image.width,
        height: edge.node.image.height,
      } : null,
      options: edge.node.selectedOptions.map((opt: any) => ({
        name: opt.name,
        value: opt.value,
      })),
    })),

    seo: {
      title: shopifyProduct.seo?.title || shopifyProduct.title,
      description: shopifyProduct.seo?.description || shopifyProduct.description || '',
    },

    category: shopifyProduct.category ? {
      id: shopifyProduct.category.id,
      name: shopifyProduct.category.name,
      fullName: shopifyProduct.category.fullName,
    } : null,

    collections: shopifyProduct.collections?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
    })) || [],

    metafields: {
      model: shopifyProduct.metafield_model?.value || undefined,

      // Parse blueprint file reference
      blueprint: (() => {
        console.log(`[Transform] Blueprint metafield raw for ${shopifyProduct.title}:`, JSON.stringify(shopifyProduct.metafield_blueprint, null, 2))

        if (!shopifyProduct.metafield_blueprint) {
          console.log(`[Transform] No blueprint metafield found for ${shopifyProduct.title}`)
          return null
        }

        if (!shopifyProduct.metafield_blueprint.reference) {
          console.log(`[Transform] Blueprint metafield exists but no reference for ${shopifyProduct.title}:`, shopifyProduct.metafield_blueprint)
          return null
        }

        const imageRef = shopifyProduct.metafield_blueprint.reference.image
        if (!imageRef) {
          console.log(`[Transform] Blueprint reference exists but no image for ${shopifyProduct.title}:`, shopifyProduct.metafield_blueprint.reference)
          return null
        }

        console.log(`[Transform] ✅ Blueprint image found for ${shopifyProduct.title}: ${imageRef.url}`)

        return {
          url: imageRef.url,
          alt: imageRef.altText || null,
          width: imageRef.width || null,
          height: imageRef.height || null,
        }
      })(),

      // Parse specifications metaobject list
      specifications: (() => {
        console.log(`[Transform] Specifications metafield raw for ${shopifyProduct.title}:`, JSON.stringify(shopifyProduct.metafield_specifications, null, 2))

        if (!shopifyProduct.metafield_specifications) {
          console.log(`[Transform] No specifications metafield found for ${shopifyProduct.title}`)
          return []
        }

        // Check if references were resolved by GraphQL query
        if (!shopifyProduct.metafield_specifications.references) {
          console.log(`[Transform] ⚠️ Specifications metafield exists but references is null for ${shopifyProduct.title}`)
          console.log(`[Transform] This usually means:`)
          console.log(`[Transform]   1. Missing 'read_metaobjects' access scope in Shopify app`)
          console.log(`[Transform]   2. Metaobjects are in draft state (not published)`)
          console.log(`[Transform]   3. Metaobjects were deleted`)
          console.log(`[Transform] Raw value: ${shopifyProduct.metafield_specifications.value}`)

          // Try to parse the value field to at least get the IDs
          try {
            const metaobjectIds = JSON.parse(shopifyProduct.metafield_specifications.value || '[]')
            console.log(`[Transform] Found ${metaobjectIds.length} metaobject IDs in value field:`, metaobjectIds)

            if (metaobjectIds.length > 0) {
              console.log(`[Transform] ⚠️ Metaobject data not available - will need to be fetched separately`)
              console.log(`[Transform] Add 'read_metaobjects' scope to your Shopify app to auto-resolve`)
            }
          } catch (e) {
            console.log(`[Transform] Failed to parse metaobject IDs from value field:`, e)
          }

          return []
        }

        // References is not null, but might have empty edges
        if (!shopifyProduct.metafield_specifications.references.edges ||
            shopifyProduct.metafield_specifications.references.edges.length === 0) {
          console.log(`[Transform] Specifications references exists but edges array is empty for ${shopifyProduct.title}`)
          return []
        }

        const specs = shopifyProduct.metafield_specifications.references.edges.map((edge: any) => {
          const fields = edge.node?.fields || []

          console.log(`[Transform] Processing specification metaobject for ${shopifyProduct.title}:`, {
            id: edge.node?.id,
            fields: fields.map((f: any) => ({ key: f.key, value: f.value }))
          })

          // Extract field values from metaobject fields array
          const getFieldValue = (key: string): string => {
            const field = fields.find((f: any) => f.key === key)
            return field?.value || ''
          }

          return {
            id: edge.node?.id || '',
            spec: getFieldValue('spec'),
            type: getFieldValue('type'),
            details: getFieldValue('details'),
          }
        })

        console.log(`[Transform] ✅ Processed ${specs.length} specifications for ${shopifyProduct.title}`)

        return specs
      })(),

      // Parse highlights metaobject list
      highlights: (() => {
        if (!shopifyProduct.metafield_highlights) return []
        if (!shopifyProduct.metafield_highlights.references?.edges?.length) return []
        return shopifyProduct.metafield_highlights.references.edges.map((edge: any) => {
          const fields = edge.node?.fields || []
          const getFieldValue = (key: string): string => {
            const field = fields.find((f: any) => f.key === key)
            return field?.value || ''
          }
          return {
            id: edge.node?.id || '',
            highlight: getFieldValue('highlight'),
            description: getFieldValue('description'),
          }
        })
      })(),

      // Parse specification_json metafield (raw JSON string)
      specificationJson: (() => {
        const raw = shopifyProduct.metafield_specification_json?.value
        if (!raw) return null
        try {
          const parsed = JSON.parse(raw) as Record<string, unknown>
          console.log(`[Transform] ✅ specification_json parsed for ${shopifyProduct.title}, keys: ${Object.keys(parsed).length}`)
          return parsed
        } catch {
          console.warn(`[Transform] ⚠️ Failed to parse specification_json for ${shopifyProduct.title}`)
          return null
        }
      })(),
    },

    // Calculate availableForSale from variants (Admin API doesn't have it on Product)
    availableForSale: shopifyProduct.variants.edges.some(
      (edge: any) => edge.node.availableForSale
    ),
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
    publishedAt: shopifyProduct.publishedAt,
  }
}
