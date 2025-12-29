/**
 * Shopify GraphQL Queries
 *
 * Optimized GraphQL queries for Shopify Storefront API
 * Following best practices for performance and caching
 *
 * @see https://shopify.dev/docs/api/storefront
 */

/**
 * Product fragment - reusable product fields
 */
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    createdAt
    updatedAt
    onlineStoreUrl
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`

/**
 * Image fragment - reusable image fields
 */
const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`

/**
 * Variant fragment - reusable variant fields
 */
const VARIANT_FRAGMENT = `
  fragment VariantFragment on ProductVariant {
    id
    title
    sku
    availableForSale
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      url
      altText
    }
  }
`

// ============================================================================
// Product Queries
// ============================================================================

/**
 * Get multiple products with pagination
 *
 * @example
 * ```typescript
 * const variables = { first: 10, sortKey: 'TITLE' }
 * const response = await shopifyClient.query(GET_PRODUCTS, variables)
 * ```
 */
export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query GetProducts(
    $first: Int = 20
    $after: String
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first
      after: $after
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      edges {
        node {
          ...ProductFragment
          images(first: 10) {
            edges {
              node {
                ...ImageFragment
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                ...VariantFragment
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "specifications" }
            { namespace: "custom", key: "features" }
            { namespace: "custom", key: "dimensions" }
          ]) {
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`

/**
 * Get a single product by handle (slug)
 *
 * @example
 * ```typescript
 * const variables = { handle: 'kawai-gx-7-grand-piano' }
 * const response = await shopifyClient.query(GET_PRODUCT_BY_HANDLE, variables)
 * ```
 */
export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
      images(first: 20) {
        edges {
          node {
            ...ImageFragment
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            ...VariantFragment
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "specifications" }
        { namespace: "custom", key: "features" }
        { namespace: "custom", key: "dimensions" }
        { namespace: "custom", key: "highlights" }
        { namespace: "custom", key: "series" }
      ]) {
        key
        value
        type
      }
    }
  }
`

/**
 * Get a single product by ID
 *
 * @example
 * ```typescript
 * const variables = { id: 'gid://shopify/Product/123456' }
 * const response = await shopifyClient.query(GET_PRODUCT_BY_ID, variables)
 * ```
 */
export const GET_PRODUCT_BY_ID = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFragment
      images(first: 20) {
        edges {
          node {
            ...ImageFragment
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            ...VariantFragment
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "specifications" }
        { namespace: "custom", key: "features" }
      ]) {
        key
        value
        type
      }
    }
  }
`

// ============================================================================
// Collection Queries
// ============================================================================

/**
 * Get products from a collection
 *
 * @example
 * ```typescript
 * const variables = { handle: 'grand-pianos', productsFirst: 20 }
 * const response = await shopifyClient.query(GET_COLLECTION_PRODUCTS, variables)
 * ```
 */
export const GET_COLLECTION_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query GetCollectionProducts(
    $handle: String!
    $productsFirst: Int = 20
    $productsAfter: String
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        ...ImageFragment
      }
      products(first: $productsFirst, after: $productsAfter) {
        edges {
          node {
            ...ProductFragment
            images(first: 5) {
              edges {
                node {
                  ...ImageFragment
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  ...VariantFragment
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  }
`

/**
 * Get all collections
 *
 * @example
 * ```typescript
 * const variables = { first: 10 }
 * const response = await shopifyClient.query(GET_COLLECTIONS, variables)
 * ```
 */
export const GET_COLLECTIONS = `
  query GetCollections($first: Int = 20, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
          productsCount: products(first: 0) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`

// ============================================================================
// Search Queries
// ============================================================================

/**
 * Search products by query string
 *
 * @example
 * ```typescript
 * const variables = { query: 'grand piano', first: 10 }
 * const response = await shopifyClient.query(SEARCH_PRODUCTS, variables)
 * ```
 *
 * @see https://shopify.dev/docs/api/usage/search-syntax
 */
export const SEARCH_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query SearchProducts($query: String!, $first: Int = 20, $after: String) {
    products(query: $query, first: $first, after: $after) {
      edges {
        node {
          ...ProductFragment
          images(first: 3) {
            edges {
              node {
                ...ImageFragment
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                ...VariantFragment
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "specifications" }
            { namespace: "custom", key: "features" }
          ]) {
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`

// ============================================================================
// Filtered Queries
// ============================================================================

/**
 * Get products by product type
 *
 * @example
 * ```typescript
 * const variables = { productType: 'Grand Piano', first: 20 }
 * const response = await shopifyClient.query(GET_PRODUCTS_BY_TYPE, variables)
 * ```
 */
export const GET_PRODUCTS_BY_TYPE = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query GetProductsByType($productType: String!, $first: Int = 20, $after: String) {
    products(query: $productType, first: $first, after: $after) {
      edges {
        node {
          ...ProductFragment
          images(first: 5) {
            edges {
              node {
                ...ImageFragment
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                ...VariantFragment
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "specifications" }
            { namespace: "custom", key: "features" }
          ]) {
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`

/**
 * Get available products only
 *
 * @example
 * ```typescript
 * const variables = { first: 20 }
 * const response = await shopifyClient.query(GET_AVAILABLE_PRODUCTS, variables)
 * ```
 */
export const GET_AVAILABLE_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}

  query GetAvailableProducts($first: Int = 20, $after: String) {
    products(query: "available_for_sale:true", first: $first, after: $after) {
      edges {
        node {
          ...ProductFragment
          images(first: 5) {
            edges {
              node {
                ...ImageFragment
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                ...VariantFragment
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "specifications" }
            { namespace: "custom", key: "features" }
          ]) {
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`

// ============================================================================
// Lightweight Queries (for listing pages)
// ============================================================================

/**
 * Get products with minimal data (for product listings)
 * More performant for list views
 *
 * @example
 * ```typescript
 * const variables = { first: 50 }
 * const response = await shopifyClient.query(GET_PRODUCTS_MINIMAL, variables)
 * ```
 */
export const GET_PRODUCTS_MINIMAL = `
  query GetProductsMinimal($first: Int = 50, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          productType
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
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

// ============================================================================
// Cart Fragments & Queries
// ============================================================================

/**
 * Cart fragment - reusable cart fields
 */
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    createdAt
    updatedAt
    totalQuantity
    note
    attributes {
      key
      value
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      email
      phone
      countryCode
      customer {
        id
      }
    }
    discountCodes {
      code
      applicable
    }
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            amountPerQuantity {
              amount
              currencyCode
            }
            compareAtAmountPerQuantity {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
              image {
                url
                altText
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`

/**
 * Create a new cart
 *
 * @example
 * ```typescript
 * const variables = {
 *   input: {
 *     lines: [{
 *       merchandiseId: 'gid://shopify/ProductVariant/123456',
 *       quantity: 1
 *     }]
 *   }
 * }
 * const response = await shopifyClient.query(CART_CREATE_MUTATION, variables)
 * ```
 */
export const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}

  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        message
        field
      }
    }
  }
`

/**
 * Add lines to an existing cart
 *
 * @example
 * ```typescript
 * const variables = {
 *   cartId: 'gid://shopify/Cart/abc123',
 *   lines: [{
 *     merchandiseId: 'gid://shopify/ProductVariant/123456',
 *     quantity: 2
 *   }]
 * }
 * const response = await shopifyClient.query(CART_LINES_ADD_MUTATION, variables)
 * ```
 */
export const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}

  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        message
        field
      }
    }
  }
`

/**
 * Update line quantities in cart
 *
 * @example
 * ```typescript
 * const variables = {
 *   cartId: 'gid://shopify/Cart/abc123',
 *   lines: [{
 *     id: 'gid://shopify/CartLine/xyz789',
 *     quantity: 3
 *   }]
 * }
 * const response = await shopifyClient.query(CART_LINES_UPDATE_MUTATION, variables)
 * ```
 */
export const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}

  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        message
        field
      }
    }
  }
`

/**
 * Remove lines from cart
 *
 * @example
 * ```typescript
 * const variables = {
 *   cartId: 'gid://shopify/Cart/abc123',
 *   lineIds: ['gid://shopify/CartLine/xyz789']
 * }
 * const response = await shopifyClient.query(CART_LINES_REMOVE_MUTATION, variables)
 * ```
 */
export const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}

  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        message
        field
      }
    }
  }
`

/**
 * Get cart by ID
 *
 * @example
 * ```typescript
 * const variables = { id: 'gid://shopify/Cart/abc123' }
 * const response = await shopifyClient.query(GET_CART_QUERY, variables)
 * ```
 */
export const GET_CART_QUERY = `
  ${CART_FRAGMENT}

  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFragment
    }
  }
`

/**
 * Update discount codes on cart
 *
 * @example
 * ```typescript
 * const variables = {
 *   cartId: 'gid://shopify/Cart/abc123',
 *   discountCodes: ['SUMMER2024']
 * }
 * const response = await shopifyClient.query(CART_DISCOUNT_CODES_UPDATE_MUTATION, variables)
 * ```
 */
export const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}

  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        message
        field
      }
    }
  }
`
