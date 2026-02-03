/**
 * Transform Shopify Media to Payload CMS Format
 *
 * Utility functions to transform Shopify Admin API media data into
 * Payload CMS Products collection format.
 *
 * This allows syncing all Shopify media (images, videos, 3D models, external videos)
 * into the Products.shopifyMedia array field.
 */

import type {
  Media,
  MediaImage,
  Video,
  Model3d,
  ExternalVideo,
} from '@/lib/shopify/media-types'
import { isMediaImage, isVideo, isModel3d, isExternalVideo } from '@/lib/shopify/media-types'

/**
 * Payload CMS shopifyMedia array item type
 *
 * Matches the structure defined in shopify-media-field.ts
 */
export interface PayloadShopifyMedia {
  mediaType: 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'EXTERNAL_VIDEO'
  shopifyMediaId: string
  status: 'READY' | 'PROCESSING' | 'UPLOADED' | 'FAILED'
  position?: number
  alt?: string | null

  // Image fields
  imageUrl?: string
  imageWidth?: number | null
  imageHeight?: number | null
  mimeType?: string | null

  // Video fields
  videoFilename?: string
  videoUrl?: string
  duration?: number | null
  videoFormat?: string
  videoMimeType?: string
  videoWidth?: number | null
  videoHeight?: number | null
  thumbnailUrl?: string

  // 3D Model fields
  model3dFilename?: string
  model3dUrlGlb?: string
  model3dUrlUsdz?: string
  model3dBoundingBox?: {
    size: {
      x: number
      y: number
      z: number
    }
  } | null

  // External Video fields
  embedUrl?: string
  originUrl?: string
  host?: 'YOUTUBE' | 'VIMEO'

  // Timestamps
  createdAt?: string
  updatedAt?: string
}

/**
 * Transform MediaImage to Payload format
 */
function transformMediaImage(media: MediaImage, position: number): PayloadShopifyMedia {
  const result: PayloadShopifyMedia = {
    mediaType: 'IMAGE',
    shopifyMediaId: media.id,
    status: media.status as 'READY' | 'PROCESSING' | 'UPLOADED' | 'FAILED',
    position,
    alt: media.alt,
  }

  // Only add properties if they exist (avoid setting undefined)
  if (media.image?.url) result.imageUrl = media.image.url
  if (media.image?.width) result.imageWidth = media.image.width
  if (media.image?.height) result.imageHeight = media.image.height
  if (media.mimeType) result.mimeType = media.mimeType
  if (media.createdAt) result.createdAt = media.createdAt
  if (media.updatedAt) result.updatedAt = media.updatedAt

  return result
}

/**
 * Transform Video to Payload format
 */
function transformVideo(media: Video, position: number): PayloadShopifyMedia {
  // Get first source for primary video URL
  const firstSource = media.sources[0]

  const result: PayloadShopifyMedia = {
    mediaType: 'VIDEO',
    shopifyMediaId: media.id,
    status: media.status as 'READY' | 'PROCESSING' | 'UPLOADED' | 'FAILED',
    position,
    alt: media.alt,
  }

  // Only add properties if they exist (avoid setting undefined)
  if (media.filename) result.videoFilename = media.filename
  if (firstSource?.url) result.videoUrl = firstSource.url
  if (media.duration) result.duration = media.duration
  if (firstSource?.format) result.videoFormat = firstSource.format
  if (firstSource?.mimeType) result.videoMimeType = firstSource.mimeType
  if (firstSource?.width) result.videoWidth = firstSource.width
  if (firstSource?.height) result.videoHeight = firstSource.height
  if (media.preview?.image?.url) result.thumbnailUrl = media.preview.image.url
  if (media.createdAt) result.createdAt = media.createdAt
  if (media.updatedAt) result.updatedAt = media.updatedAt

  return result
}

/**
 * Transform Model3d to Payload format
 */
function transformModel3d(media: Model3d, position: number): PayloadShopifyMedia {
  // Find GLB and USDZ sources
  const glbSource = media.sources.find((s) => s.format === 'glb')
  const usdzSource = media.sources.find((s) => s.format === 'usdz')

  const result: PayloadShopifyMedia = {
    mediaType: 'MODEL_3D',
    shopifyMediaId: media.id,
    status: media.status as 'READY' | 'PROCESSING' | 'UPLOADED' | 'FAILED',
    position,
    alt: media.alt,
  }

  // Only add properties if they exist (avoid setting undefined)
  if (media.filename) result.model3dFilename = media.filename
  if (glbSource?.url) result.model3dUrlGlb = glbSource.url
  if (usdzSource?.url) result.model3dUrlUsdz = usdzSource.url
  if (media.boundingBox) result.model3dBoundingBox = media.boundingBox
  if (media.createdAt) result.createdAt = media.createdAt
  if (media.updatedAt) result.updatedAt = media.updatedAt

  return result
}

/**
 * Transform ExternalVideo to Payload format
 */
function transformExternalVideo(media: ExternalVideo, position: number): PayloadShopifyMedia {
  const result: PayloadShopifyMedia = {
    mediaType: 'EXTERNAL_VIDEO',
    shopifyMediaId: media.id,
    status: media.status as 'READY' | 'PROCESSING' | 'UPLOADED' | 'FAILED',
    position,
    alt: media.alt,
  }

  // Only add properties if they exist (avoid setting undefined)
  if (media.embedUrl) result.embedUrl = media.embedUrl
  if (media.originUrl) result.originUrl = media.originUrl
  if (media.host) result.host = media.host
  if (media.createdAt) result.createdAt = media.createdAt
  if (media.updatedAt) result.updatedAt = media.updatedAt

  return result
}

/**
 * Transform array of Shopify Media to Payload format
 *
 * Converts all media types from Shopify Admin API format to Payload CMS
 * shopifyMedia array field format.
 *
 * @param media - Array of Shopify media items
 * @returns Array of Payload shopifyMedia items
 *
 * @example
 * ```typescript
 * import { getProductMedia } from '@/lib/shopify'
 * import { transformMediaToPayload } from '@/lib/shopify/transform-media-to-payload'
 *
 * const shopifyMedia = await getProductMedia('gid://shopify/Product/123')
 * const payloadMedia = transformMediaToPayload(shopifyMedia)
 *
 * // Save to Payload
 * await payload.update({
 *   collection: 'products',
 *   id: productId,
 *   data: {
 *     shopifyMedia: payloadMedia
 *   }
 * })
 * ```
 */
export function transformMediaToPayload(media: Media[]): PayloadShopifyMedia[] {
  return media.map((item, index) => {
    if (isMediaImage(item)) {
      return transformMediaImage(item, index)
    } else if (isVideo(item)) {
      return transformVideo(item, index)
    } else if (isModel3d(item)) {
      return transformModel3d(item, index)
    } else if (isExternalVideo(item)) {
      return transformExternalVideo(item, index)
    }

    // Fallback (should never happen with proper type guards)
    throw new Error(`Unknown media type: ${(item as any).__typename}`)
  })
}

/**
 * Get primary image URL from shopifyMedia array
 *
 * Returns the first image URL from the shopifyMedia array,
 * useful for backwards compatibility with imageUrl field.
 *
 * @param shopifyMedia - Array of Payload shopifyMedia items
 * @returns Primary image URL or null
 *
 * @example
 * ```typescript
 * const primaryImageUrl = getPrimaryImageUrl(product.shopifyMedia)
 * ```
 */
export function getPrimaryImageUrl(shopifyMedia: PayloadShopifyMedia[] | null | undefined): string | null {
  if (!shopifyMedia || shopifyMedia.length === 0) {
    return null
  }

  const firstImage = shopifyMedia.find((m) => m.mediaType === 'IMAGE' && m.imageUrl)
  return firstImage?.imageUrl || null
}

/**
 * Filter shopifyMedia by type
 *
 * Helper to extract specific media types from the shopifyMedia array.
 *
 * @param shopifyMedia - Array of Payload shopifyMedia items
 * @param mediaType - Media type to filter by
 * @returns Filtered array
 *
 * @example
 * ```typescript
 * const images = filterMediaByType(product.shopifyMedia, 'IMAGE')
 * const videos = filterMediaByType(product.shopifyMedia, 'VIDEO')
 * const models = filterMediaByType(product.shopifyMedia, 'MODEL_3D')
 * ```
 */
export function filterMediaByType(
  shopifyMedia: PayloadShopifyMedia[] | null | undefined,
  mediaType: 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'EXTERNAL_VIDEO'
): PayloadShopifyMedia[] {
  if (!shopifyMedia) {
    return []
  }

  return shopifyMedia.filter((m) => m.mediaType === mediaType)
}

/**
 * Count media items by type
 *
 * @param shopifyMedia - Array of Payload shopifyMedia items
 * @returns Object with counts for each type
 *
 * @example
 * ```typescript
 * const counts = countMediaByType(product.shopifyMedia)
 * // { images: 5, videos: 2, models3d: 1, externalVideos: 1, total: 9 }
 * ```
 */
export function countMediaByType(shopifyMedia: PayloadShopifyMedia[] | null | undefined): {
  images: number
  videos: number
  models3d: number
  externalVideos: number
  total: number
} {
  if (!shopifyMedia) {
    return { images: 0, videos: 0, models3d: 0, externalVideos: 0, total: 0 }
  }

  return {
    images: shopifyMedia.filter((m) => m.mediaType === 'IMAGE').length,
    videos: shopifyMedia.filter((m) => m.mediaType === 'VIDEO').length,
    models3d: shopifyMedia.filter((m) => m.mediaType === 'MODEL_3D').length,
    externalVideos: shopifyMedia.filter((m) => m.mediaType === 'EXTERNAL_VIDEO').length,
    total: shopifyMedia.length,
  }
}
