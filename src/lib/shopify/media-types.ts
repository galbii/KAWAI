/**
 * Shopify Product Media Types
 *
 * Type definitions for Shopify Admin API product media
 * Supports 4 media types: MediaImage, Video, Model3d, ExternalVideo
 *
 * @see https://shopify.dev/docs/api/admin-graphql/latest/interfaces/media
 */

import type { ShopifyGID } from './types'

// ============================================================================
// Enums
// ============================================================================

/**
 * Media content type
 */
export type MediaContentType = 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'EXTERNAL_VIDEO'

/**
 * Media processing status
 */
export type MediaStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED'

/**
 * File processing status
 */
export type FileStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED'

/**
 * External video host
 */
export type MediaHost = 'YOUTUBE' | 'VIMEO'

// ============================================================================
// Error Types
// ============================================================================

/**
 * Media processing error
 */
export interface MediaError {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** Additional error details */
  details: string | null
}

/**
 * Media warning (non-blocking)
 */
export interface MediaWarning {
  /** Warning code */
  code: string
  /** Warning message */
  message: string
  /** Additional warning details */
  details: string | null
}

/**
 * File processing error
 */
export interface FileError {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** Additional error details */
  details: string | null
}

// ============================================================================
// Common Media Interface
// ============================================================================

/**
 * Preview image for media items
 */
export interface MediaPreviewImage {
  image: {
    url: string
    width: number | null
    height: number | null
  } | null
  status: MediaStatus
}

/**
 * Base media interface - inherited by all media types
 */
export interface BaseMedia {
  /** GraphQL typename for runtime type checking */
  __typename: string
  /** Shopify media ID */
  id: ShopifyGID
  /** Alt text / description */
  alt: string | null
  /** Media content type */
  mediaContentType: MediaContentType
  /** Processing status */
  status: MediaStatus
  /** Preview thumbnail */
  preview: MediaPreviewImage | null
  /** Processing errors */
  mediaErrors: MediaError[]
  /** Non-critical warnings */
  mediaWarnings: MediaWarning[]
}

// ============================================================================
// MediaImage Type
// ============================================================================

/**
 * Original source data for MediaImage
 */
export interface MediaImageOriginalSource {
  /** Original file URL */
  url: string
  /** Original width in pixels */
  width: number | null
  /** Original height in pixels */
  height: number | null
  /** File size in bytes */
  fileSize: number | null
}

/**
 * Image object (null until status = READY)
 */
export interface MediaImageData {
  /** Image ID */
  id: ShopifyGID
  /** CDN URL */
  url: string
  /** Alt text */
  altText: string | null
  /** Width in pixels */
  width: number | null
  /** Height in pixels */
  height: number | null
}

/**
 * Shopify CDN-hosted image
 * Max size: 4472×4472px or 20 megapixels
 */
export interface MediaImage extends BaseMedia {
  __typename: 'MediaImage'
  /** Image data (null until READY) */
  image: MediaImageData | null
  /** MIME type (e.g., "image/png", "image/jpeg") */
  mimeType: string | null
  /** Original upload data */
  originalSource: MediaImageOriginalSource | null
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** File processing status */
  fileStatus: FileStatus
  /** File processing errors */
  fileErrors: FileError[]
}

// ============================================================================
// Video Type
// ============================================================================

/**
 * Video source (format variant)
 */
export interface VideoSource {
  /** Video URL */
  url: string
  /** Format (e.g., "mp4") */
  format: string
  /** MIME type (e.g., "video/mp4") */
  mimeType: string
  /** Width in pixels */
  width: number | null
  /** Height in pixels */
  height: number | null
  /** File size in bytes */
  fileSize: number | null
}

/**
 * Shopify-hosted video
 * Max duration: 10 minutes
 * Max size: 1GB
 */
export interface Video extends BaseMedia {
  __typename: 'Video'
  /** Filename */
  filename: string
  /** Duration in milliseconds (null until READY) */
  duration: number | null
  /** Video sources (empty until READY) */
  sources: VideoSource[]
  /** Original upload source */
  originalSource: VideoSource | null
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** File processing status */
  fileStatus: FileStatus
  /** File processing errors */
  fileErrors: FileError[]
}

// ============================================================================
// Model3d Type
// ============================================================================

/**
 * 3D model source
 */
export interface Model3dSource {
  /** Model file URL */
  url: string
  /** Format ("glb" or "usdz") */
  format: string
  /** MIME type ("model/gltf-binary" or "model/vnd.usdz+zip") */
  mimeType: string
  /** File size in bytes */
  fileSize: number | null
}

/**
 * 3D model bounding box dimensions
 */
export interface Model3dBoundingBox {
  size: {
    x: number
    y: number
    z: number
  }
}

/**
 * 3D model in GLB or USDZ format
 * Max size: 500MB
 */
export interface Model3d extends BaseMedia {
  __typename: 'Model3d'
  /** Filename */
  filename: string
  /** Model sources (GLB, USDZ) */
  sources: Model3dSource[]
  /** Original upload source */
  originalSource: Model3dSource | null
  /** 3D model dimensions */
  boundingBox: Model3dBoundingBox | null
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** File processing status */
  fileStatus: FileStatus
  /** File processing errors */
  fileErrors: FileError[]
}

// ============================================================================
// ExternalVideo Type
// ============================================================================

/**
 * YouTube or Vimeo embedded video
 */
export interface ExternalVideo extends BaseMedia {
  __typename: 'ExternalVideo'
  /** Platform embed URL */
  embedUrl: string
  /** Original video URL */
  originUrl: string
  /** Video platform */
  host: MediaHost
  /** Creation timestamp */
  createdAt: string
  /** Last update timestamp */
  updatedAt: string
  /** File processing status */
  fileStatus: FileStatus
  /** File processing errors */
  fileErrors: FileError[]
}

// ============================================================================
// Union Type
// ============================================================================

/**
 * Union of all media types
 * Use type guards to narrow to specific type
 */
export type Media = MediaImage | Video | Model3d | ExternalVideo

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if media is a MediaImage
 *
 * @example
 * ```typescript
 * if (isMediaImage(media)) {
 *   console.log(media.image?.url) // TypeScript knows it's MediaImage
 * }
 * ```
 */
export function isMediaImage(media: Media): media is MediaImage {
  return media.__typename === 'MediaImage'
}

/**
 * Check if media is a Video
 *
 * @example
 * ```typescript
 * if (isVideo(media)) {
 *   console.log(media.duration) // TypeScript knows it's Video
 * }
 * ```
 */
export function isVideo(media: Media): media is Video {
  return media.__typename === 'Video'
}

/**
 * Check if media is a Model3d
 *
 * @example
 * ```typescript
 * if (isModel3d(media)) {
 *   console.log(media.sources[0].format) // TypeScript knows it's Model3d
 * }
 * ```
 */
export function isModel3d(media: Media): media is Model3d {
  return media.__typename === 'Model3d'
}

/**
 * Check if media is an ExternalVideo
 *
 * @example
 * ```typescript
 * if (isExternalVideo(media)) {
 *   console.log(media.embedUrl) // TypeScript knows it's ExternalVideo
 * }
 * ```
 */
export function isExternalVideo(media: Media): media is ExternalVideo {
  return media.__typename === 'ExternalVideo'
}

/**
 * Check if media is ready for display (status = READY)
 *
 * @example
 * ```typescript
 * const readyMedia = allMedia.filter(isMediaReady)
 * ```
 */
export function isMediaReady(media: Media): boolean {
  return media.status === 'READY'
}

/**
 * Check if media has errors
 *
 * @example
 * ```typescript
 * const failedMedia = allMedia.filter(hasMediaErrors)
 * ```
 */
export function hasMediaErrors(media: Media): boolean {
  return media.mediaErrors.length > 0 || media.status === 'FAILED'
}

// ============================================================================
// GraphQL Response Types
// ============================================================================

/**
 * Product media connection (GraphQL response)
 */
export interface ProductMediaConnection {
  edges: Array<{
    node: Media
  }>
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string | null
    endCursor: string | null
  }
}

/**
 * Product with media (GraphQL response)
 */
export interface ProductWithMedia {
  id: ShopifyGID
  title: string
  handle: string
  description: string
  media: ProductMediaConnection
}

/**
 * Query variables for fetching product media
 */
export interface ProductMediaQueryVariables {
  /** Product ID (gid://shopify/Product/123) */
  id: ShopifyGID
  /** Number of media items to fetch */
  first?: number
  /** Cursor for pagination */
  after?: string | null
  /** Sort key */
  sortKey?: 'POSITION' | 'CREATED_AT' | 'UPDATED_AT'
  /** Reverse sort order */
  reverse?: boolean
  /** Filter query (e.g., "media_type:IMAGE") */
  query?: string | null
}

/**
 * Response from product media query
 */
export interface ProductMediaQueryResponse {
  product: ProductWithMedia | null
}
