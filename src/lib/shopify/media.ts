/**
 * Shopify Product Media Operations
 *
 * Functions for fetching and managing product media from Shopify Admin API
 * Supports images, videos, 3D models, and external videos
 *
 * @example Basic Usage
 * ```typescript
 * import { getProductMedia } from '@/lib/shopify/media'
 *
 * const allMedia = await getProductMedia('gid://shopify/Product/123')
 * ```
 *
 * @example Filter by Type
 * ```typescript
 * import { getProductMediaByType } from '@/lib/shopify/media'
 *
 * const images = await getProductMediaByType('gid://shopify/Product/123', 'IMAGE')
 * const videos = await getProductMediaByType('gid://shopify/Product/123', 'VIDEO')
 * ```
 */

import { shopifyAdminClient } from './admin-client'
import {
  GET_PRODUCT_WITH_MEDIA,
  GET_PRODUCT_MEDIA_FILTERED,
  GET_PRODUCT_IMAGES,
  GET_PRODUCT_VIDEOS,
  GET_PRODUCT_3D_MODELS,
} from './media-queries'
import type {
  Media,
  MediaImage,
  Video,
  Model3d,
  ExternalVideo,
  MediaContentType,
  ProductMediaQueryResponse,
  ProductMediaQueryVariables,
  ShopifyGID,
} from './types'
import {
  isMediaImage,
  isVideo,
  isModel3d,
  isExternalVideo,
  isMediaReady,
} from './media-types'

// Re-export type guards for convenience
export {
  isMediaImage,
  isVideo,
  isModel3d,
  isExternalVideo,
  isMediaReady,
}

// ============================================================================
// Main Media Functions
// ============================================================================

/**
 * Fetch all media for a product
 *
 * Returns all media items sorted by position (same order as Shopify admin).
 * Automatically filters to only READY media (excludes PROCESSING/FAILED).
 *
 * @param productId - Shopify product GID (e.g., "gid://shopify/Product/123")
 * @param options - Query options
 * @returns Array of media items (images, videos, 3D models, external videos)
 *
 * @example
 * ```typescript
 * const allMedia = await getProductMedia('gid://shopify/Product/123456')
 *
 * // Filter by type using type guards
 * const images = allMedia.filter(isMediaImage)
 * const videos = allMedia.filter(isVideo)
 * const models = allMedia.filter(isModel3d)
 * const externalVideos = allMedia.filter(isExternalVideo)
 * ```
 */
export async function getProductMedia(
  productId: ShopifyGID,
  options: {
    /** Number of media items to fetch (max 250) */
    first?: number
    /** Include processing media (default: false, only READY) */
    includeProcessing?: boolean
    /** Cursor for pagination */
    after?: string | null
  } = {}
): Promise<Media[]> {
  const { first = 50, includeProcessing = false, after = null } = options

  try {
    const response = await shopifyAdminClient.query<
      ProductMediaQueryResponse,
      ProductMediaQueryVariables
    >(GET_PRODUCT_WITH_MEDIA, {
      id: productId,
      first,
      after,
      sortKey: 'POSITION',
      reverse: false,
    })

    if (!response.product) {
      console.warn(`[Shopify Media] Product not found: ${productId}`)
      return []
    }

    if (!response.product.media || !response.product.media.edges) {
      console.warn(`[Shopify Media] No media found for product: ${productId}`)
      return []
    }

    const media = response.product.media.edges.map((edge) => edge.node)

    // Filter to only ready media unless includeProcessing is true
    const filteredMedia = includeProcessing ? media : media.filter(isMediaReady)

    if (!includeProcessing && filteredMedia.length < media.length) {
      const processingCount = media.length - filteredMedia.length
      console.log(
        `[Shopify Media] ${processingCount} media item(s) still processing for product ${productId}`
      )
    }

    return filteredMedia
  } catch (error) {
    console.error('[Shopify Media] Failed to fetch product media:', error)
    return []
  }
}

/**
 * Fetch media filtered by type
 *
 * More efficient than fetching all media and filtering in code.
 * Uses Shopify's query filter to only fetch specific media types.
 *
 * @param productId - Shopify product GID
 * @param mediaType - Media type to filter by
 * @param options - Query options
 * @returns Array of media items of the specified type
 *
 * @example
 * ```typescript
 * // Get only images
 * const images = await getProductMediaByType(
 *   'gid://shopify/Product/123',
 *   'IMAGE'
 * )
 *
 * // Get only videos (Shopify-hosted)
 * const videos = await getProductMediaByType(
 *   'gid://shopify/Product/123',
 *   'VIDEO'
 * )
 * ```
 */
export async function getProductMediaByType(
  productId: ShopifyGID,
  mediaType: MediaContentType,
  options: {
    /** Number of media items to fetch */
    first?: number
    /** Include processing media (default: false) */
    includeProcessing?: boolean
  } = {}
): Promise<Media[]> {
  const { first = 50, includeProcessing = false } = options

  try {
    const response = await shopifyAdminClient.query<
      ProductMediaQueryResponse,
      ProductMediaQueryVariables
    >(GET_PRODUCT_MEDIA_FILTERED, {
      id: productId,
      query: `media_type:${mediaType}`,
      first,
      sortKey: 'POSITION',
    })

    if (!response.product || !response.product.media || !response.product.media.edges) {
      return []
    }

    const media = response.product.media.edges.map((edge) => edge.node)

    // Filter to only ready media unless includeProcessing is true
    return includeProcessing ? media : media.filter(isMediaReady)
  } catch (error) {
    console.error(
      `[Shopify Media] Failed to fetch ${mediaType} media for product ${productId}:`,
      error
    )
    return []
  }
}

/**
 * Fetch only images for a product
 *
 * Convenience function for the most common use case.
 * Returns only MediaImage objects with image data ready.
 *
 * @param productId - Shopify product GID
 * @param options - Query options
 * @returns Array of MediaImage items
 *
 * @example
 * ```typescript
 * const images = await getProductImages('gid://shopify/Product/123')
 *
 * images.forEach((img) => {
 *   if (img.image) {
 *     console.log(img.image.url, img.image.width, img.image.height)
 *   }
 * })
 * ```
 */
export async function getProductImages(
  productId: ShopifyGID,
  options: { first?: number } = {}
): Promise<MediaImage[]> {
  const { first = 50 } = options

  try {
    const response = await shopifyAdminClient.query<{
      product: {
        id: string
        title: string
        media: {
          edges: Array<{ node: MediaImage }>
          pageInfo: {
            hasNextPage: boolean
            endCursor: string | null
          }
        }
      } | null
    }>(GET_PRODUCT_IMAGES, {
      id: productId,
      first,
    })

    if (!response.product || !response.product.media || !response.product.media.edges) {
      return []
    }

    const images = response.product.media.edges.map((edge) => edge.node)

    // Filter to only ready images with valid image data
    return images.filter((img) => img.status === 'READY' && img.image !== null)
  } catch (error) {
    console.error(`[Shopify Media] Failed to fetch images for product ${productId}:`, error)
    return []
  }
}

/**
 * Fetch all videos for a product (Shopify-hosted + external)
 *
 * Returns both Shopify-hosted videos (Video type) and external videos
 * (YouTube/Vimeo embeds).
 *
 * @param productId - Shopify product GID
 * @param options - Query options
 * @returns Object with videos and externalVideos arrays
 *
 * @example
 * ```typescript
 * const { videos, externalVideos } = await getProductVideos(
 *   'gid://shopify/Product/123'
 * )
 *
 * // Shopify-hosted videos
 * videos.forEach((video) => {
 *   console.log(video.sources[0].url, video.duration)
 * })
 *
 * // External videos (YouTube/Vimeo)
 * externalVideos.forEach((video) => {
 *   console.log(video.embedUrl, video.host)
 * })
 * ```
 */
export async function getProductVideos(
  productId: ShopifyGID,
  options: { first?: number } = {}
): Promise<{
  videos: Video[]
  externalVideos: ExternalVideo[]
}> {
  const { first = 50 } = options

  try {
    const response = await shopifyAdminClient.query<{
      product: {
        id: string
        title: string
        videos: {
          edges: Array<{ node: Media }>
        }
        externalVideos: {
          edges: Array<{ node: Media }>
        }
      } | null
    }>(GET_PRODUCT_VIDEOS, {
      id: productId,
      first,
    })

    if (!response.product) {
      return { videos: [], externalVideos: [] }
    }

    const videos = response.product.videos.edges
      .map((edge) => edge.node)
      .filter(isVideo)
      .filter((v) => v.status === 'READY' && v.sources.length > 0 && v.duration !== null)

    const externalVideos = response.product.externalVideos.edges
      .map((edge) => edge.node)
      .filter(isExternalVideo)
      .filter((v) => v.status === 'READY')

    return { videos, externalVideos }
  } catch (error) {
    console.error(`[Shopify Media] Failed to fetch videos for product ${productId}:`, error)
    return { videos: [], externalVideos: [] }
  }
}

/**
 * Fetch 3D models for a product
 *
 * Returns Model3d objects (GLB/USDZ format).
 * Useful for products that have 3D viewer support.
 *
 * @param productId - Shopify product GID
 * @param options - Query options
 * @returns Array of Model3d items
 *
 * @example
 * ```typescript
 * const models = await getProduct3DModels('gid://shopify/Product/123')
 *
 * models.forEach((model) => {
 *   const glb = model.sources.find(s => s.format === 'glb')
 *   const usdz = model.sources.find(s => s.format === 'usdz')
 *   console.log('GLB:', glb?.url)
 *   console.log('USDZ:', usdz?.url)
 * })
 * ```
 */
export async function getProduct3DModels(
  productId: ShopifyGID,
  options: { first?: number } = {}
): Promise<Model3d[]> {
  const { first = 50 } = options

  try {
    const response = await shopifyAdminClient.query<{
      product: {
        id: string
        title: string
        media: {
          edges: Array<{ node: Media }>
        }
      } | null
    }>(GET_PRODUCT_3D_MODELS, {
      id: productId,
      first,
    })

    if (!response.product || !response.product.media || !response.product.media.edges) {
      return []
    }

    const models = response.product.media.edges
      .map((edge) => edge.node)
      .filter(isModel3d)
      .filter((m) => m.status === 'READY' && m.sources.length > 0)

    return models
  } catch (error) {
    console.error(`[Shopify Media] Failed to fetch 3D models for product ${productId}:`, error)
    return []
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the primary image for a product
 *
 * Returns the first image (position 0) or null if none exists.
 *
 * @param productId - Shopify product GID
 * @returns First image or null
 *
 * @example
 * ```typescript
 * const primaryImage = await getProductPrimaryImage('gid://shopify/Product/123')
 *
 * if (primaryImage?.image) {
 *   return <Image src={primaryImage.image.url} alt={primaryImage.alt || ''} />
 * }
 * ```
 */
export async function getProductPrimaryImage(
  productId: ShopifyGID
): Promise<MediaImage | null> {
  const images = await getProductImages(productId, { first: 1 })
  const firstImage = images[0]
  return firstImage || null
}

/**
 * Check if a product has media of a specific type
 *
 * @param productId - Shopify product GID
 * @param mediaType - Media type to check
 * @returns True if product has media of specified type
 *
 * @example
 * ```typescript
 * const hasVideos = await hasProductMediaType('gid://shopify/Product/123', 'VIDEO')
 * const has3DModels = await hasProductMediaType('gid://shopify/Product/123', 'MODEL_3D')
 * ```
 */
export async function hasProductMediaType(
  productId: ShopifyGID,
  mediaType: MediaContentType
): Promise<boolean> {
  const media = await getProductMediaByType(productId, mediaType, { first: 1 })
  return media.length > 0
}

/**
 * Count media items by type
 *
 * @param media - Array of media items
 * @returns Object with counts for each media type
 *
 * @example
 * ```typescript
 * const allMedia = await getProductMedia('gid://shopify/Product/123')
 * const counts = countMediaByType(allMedia)
 *
 * console.log(`Images: ${counts.images}`)
 * console.log(`Videos: ${counts.videos}`)
 * console.log(`3D Models: ${counts.models3d}`)
 * console.log(`External Videos: ${counts.externalVideos}`)
 * ```
 */
export function countMediaByType(media: Media[]): {
  images: number
  videos: number
  models3d: number
  externalVideos: number
  total: number
} {
  const images = media.filter(isMediaImage).length
  const videos = media.filter(isVideo).length
  const models3d = media.filter(isModel3d).length
  const externalVideos = media.filter(isExternalVideo).length

  return {
    images,
    videos,
    models3d,
    externalVideos,
    total: media.length,
  }
}

/**
 * Group media by type
 *
 * @param media - Array of media items
 * @returns Object with arrays for each media type
 *
 * @example
 * ```typescript
 * const allMedia = await getProductMedia('gid://shopify/Product/123')
 * const grouped = groupMediaByType(allMedia)
 *
 * // Render images
 * grouped.images.forEach(img => ...)
 *
 * // Render videos
 * grouped.videos.forEach(video => ...)
 * ```
 */
export function groupMediaByType(media: Media[]): {
  images: MediaImage[]
  videos: Video[]
  models3d: Model3d[]
  externalVideos: ExternalVideo[]
} {
  return {
    images: media.filter(isMediaImage),
    videos: media.filter(isVideo),
    models3d: media.filter(isModel3d),
    externalVideos: media.filter(isExternalVideo),
  }
}

/**
 * Extract media URLs for quick access
 *
 * Returns only the URLs from media objects, filtering out items
 * without valid URLs (still processing, failed, etc.)
 *
 * @param media - Array of media items
 * @returns Array of URL strings
 *
 * @example
 * ```typescript
 * const allMedia = await getProductMedia('gid://shopify/Product/123')
 * const urls = extractMediaUrls(allMedia)
 *
 * urls.forEach(url => console.log(url))
 * ```
 */
export function extractMediaUrls(media: Media[]): string[] {
  const urls: string[] = []

  for (const item of media) {
    if (isMediaImage(item) && item.image) {
      urls.push(item.image.url)
    } else if (isVideo(item) && item.sources.length > 0) {
      const firstSource = item.sources[0]
      if (firstSource) {
        urls.push(firstSource.url)
      }
    } else if (isModel3d(item) && item.sources.length > 0) {
      const firstSource = item.sources[0]
      if (firstSource) {
        urls.push(firstSource.url)
      }
    } else if (isExternalVideo(item)) {
      urls.push(item.embedUrl)
    }
  }

  return urls
}
