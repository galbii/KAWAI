/**
 * Shopify Product Media GraphQL Queries
 *
 * GraphQL fragments and queries for fetching product media
 * from Shopify Admin API (2025-01)
 *
 * @see https://shopify.dev/docs/api/admin-graphql/latest/interfaces/media
 */

// ============================================================================
// Media Fragment - All Media Types
// ============================================================================

/**
 * Complete media fragment supporting all 4 media types
 *
 * Includes type-specific fields for:
 * - MediaImage: image data, mimeType
 * - Video: duration, sources
 * - Model3d: 3D sources, bounding box
 * - ExternalVideo: embedUrl, host
 */
export const MEDIA_FRAGMENT = `
  fragment MediaFields on Media {
    __typename
    id
    alt
    mediaContentType
    status
    preview {
      image {
        url
        width
        height
      }
      status
    }
    mediaErrors {
      code
      message
    }
    mediaWarnings {
      code
      message
    }

    # MediaImage - Regular product images
    ... on MediaImage {
      image {
        id
        url
        altText
        width
        height
      }
      mimeType
      originalSource {
        url
        fileSize
      }
      createdAt
      updatedAt
      fileStatus
      fileErrors {
        code
        message
      }
    }

    # Video - Shopify-hosted videos
    ... on Video {
      filename
      duration
      sources {
        url
        format
        mimeType
        width
        height
        fileSize
      }
      originalSource {
        url
        format
        mimeType
        width
        height
      }
      createdAt
      updatedAt
      fileStatus
      fileErrors {
        code
        message
      }
    }

    # Model3d - 3D piano models (GLB, USDZ)
    ... on Model3d {
      filename
      sources {
        url
        format
        mimeType
      }
      originalSource {
        url
        format
        mimeType
      }
      boundingBox {
        size {
          x
          y
          z
        }
      }
      createdAt
      updatedAt
      fileStatus
      fileErrors {
        code
        message
      }
    }

    # ExternalVideo - YouTube/Vimeo embeds
    ... on ExternalVideo {
      embedUrl
      originUrl
      host
      createdAt
      updatedAt
      fileStatus
      fileErrors {
        code
        message
      }
    }
  }
`

// ============================================================================
// Product Media Queries
// ============================================================================

/**
 * Get all media for a product
 *
 * @param id - Product ID (gid://shopify/Product/123)
 * @param first - Number of media items (max 250, default 50)
 * @param after - Pagination cursor
 * @param sortKey - Sort by POSITION (default), CREATED_AT, or UPDATED_AT
 * @param reverse - Reverse sort order
 *
 * @example
 * ```typescript
 * const response = await shopifyAdminClient.query(GET_PRODUCT_WITH_MEDIA, {
 *   id: 'gid://shopify/Product/123456'
 * })
 * ```
 */
export const GET_PRODUCT_WITH_MEDIA = `
  ${MEDIA_FRAGMENT}

  query GetProductWithMedia(
    $id: ID!
    $first: Int = 50
    $after: String
    $sortKey: ProductMediaSortKeys = POSITION
    $reverse: Boolean = false
  ) {
    product(id: $id) {
      id
      title
      handle
      description

      media(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...MediaFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`

/**
 * Get filtered media for a product
 *
 * @param id - Product ID
 * @param query - Filter query (e.g., "media_type:IMAGE")
 * @param first - Number of media items
 *
 * Available query filters:
 * - media_type:IMAGE
 * - media_type:VIDEO
 * - media_type:MODEL_3D
 * - media_type:EXTERNAL_VIDEO
 *
 * @example
 * ```typescript
 * // Get only images
 * const response = await shopifyAdminClient.query(GET_PRODUCT_MEDIA_FILTERED, {
 *   id: 'gid://shopify/Product/123456',
 *   query: 'media_type:IMAGE'
 * })
 * ```
 */
export const GET_PRODUCT_MEDIA_FILTERED = `
  ${MEDIA_FRAGMENT}

  query GetProductMediaFiltered(
    $id: ID!
    $query: String!
    $first: Int = 50
    $after: String
    $sortKey: ProductMediaSortKeys = POSITION
    $reverse: Boolean = false
  ) {
    product(id: $id) {
      id
      title
      handle

      media(
        first: $first
        after: $after
        query: $query
        sortKey: $sortKey
        reverse: $reverse
      ) {
        edges {
          node {
            ...MediaFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`

/**
 * Get only images for a product (optimized query)
 *
 * @param id - Product ID
 * @param first - Number of images
 *
 * @example
 * ```typescript
 * const response = await shopifyAdminClient.query(GET_PRODUCT_IMAGES, {
 *   id: 'gid://shopify/Product/123456'
 * })
 * ```
 */
export const GET_PRODUCT_IMAGES = `
  query GetProductImages(
    $id: ID!
    $first: Int = 50
    $after: String
  ) {
    product(id: $id) {
      id
      title

      media(first: $first, after: $after, query: "media_type:IMAGE", sortKey: POSITION) {
        edges {
          node {
            ... on MediaImage {
              __typename
              id
              alt
              mediaContentType
              status
              image {
                id
                url
                altText
                width
                height
              }
              mimeType
              createdAt
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

/**
 * Get only videos for a product (Shopify-hosted + external)
 *
 * @param id - Product ID
 * @param first - Number of videos
 *
 * @example
 * ```typescript
 * const response = await shopifyAdminClient.query(GET_PRODUCT_VIDEOS, {
 *   id: 'gid://shopify/Product/123456'
 * })
 * ```
 */
export const GET_PRODUCT_VIDEOS = `
  ${MEDIA_FRAGMENT}

  query GetProductVideos(
    $id: ID!
    $first: Int = 50
  ) {
    product(id: $id) {
      id
      title

      # Shopify-hosted videos
      videos: media(first: $first, query: "media_type:VIDEO", sortKey: POSITION) {
        edges {
          node {
            ...MediaFields
          }
        }
      }

      # External videos (YouTube, Vimeo)
      externalVideos: media(first: $first, query: "media_type:EXTERNAL_VIDEO", sortKey: POSITION) {
        edges {
          node {
            ...MediaFields
          }
        }
      }
    }
  }
`

/**
 * Get 3D models for a product
 *
 * @param id - Product ID
 * @param first - Number of models
 *
 * @example
 * ```typescript
 * const response = await shopifyAdminClient.query(GET_PRODUCT_3D_MODELS, {
 *   id: 'gid://shopify/Product/123456'
 * })
 * ```
 */
export const GET_PRODUCT_3D_MODELS = `
  ${MEDIA_FRAGMENT}

  query GetProduct3DModels(
    $id: ID!
    $first: Int = 50
  ) {
    product(id: $id) {
      id
      title

      media(first: $first, query: "media_type:MODEL_3D", sortKey: POSITION) {
        edges {
          node {
            ...MediaFields
          }
        }
      }
    }
  }
`

/**
 * Get media with pagination support
 *
 * Use this for products with 50+ media items
 *
 * @example
 * ```typescript
 * // First page
 * const page1 = await shopifyAdminClient.query(GET_PRODUCT_MEDIA_PAGINATED, {
 *   id: 'gid://shopify/Product/123456',
 *   first: 20
 * })
 *
 * // Next page
 * const page2 = await shopifyAdminClient.query(GET_PRODUCT_MEDIA_PAGINATED, {
 *   id: 'gid://shopify/Product/123456',
 *   first: 20,
 *   after: page1.product.media.pageInfo.endCursor
 * })
 * ```
 */
export const GET_PRODUCT_MEDIA_PAGINATED = `
  ${MEDIA_FRAGMENT}

  query GetProductMediaPaginated(
    $id: ID!
    $first: Int!
    $after: String
  ) {
    product(id: $id) {
      id
      title

      media(first: $first, after: $after, sortKey: POSITION) {
        edges {
          cursor
          node {
            ...MediaFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`
