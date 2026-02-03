/**
 * Product Media Usage Examples
 *
 * Comprehensive examples showing how to use the Shopify product media system
 * in various scenarios.
 *
 * This file serves as documentation and can be used as a reference
 * when implementing media features in the KAWAI Piano application.
 */

import {
  getProductMedia,
  getProductMediaByType,
  getProductImages,
  getProductVideos,
  getProduct3DModels,
  getProductPrimaryImage,
  hasProductMediaType,
  countMediaByType,
  groupMediaByType,
  extractMediaUrls,
  isMediaImage,
  isVideo,
  isModel3d,
  isExternalVideo,
} from '@/lib/shopify'
import type { ShopifyGID } from '@/lib/shopify'

// ============================================================================
// Example 1: Fetch All Media for a Product
// ============================================================================

/**
 * Basic usage: Get all media for a product
 */
async function example1_fetchAllMedia() {
  const productId = 'gid://shopify/Product/123456'

  // Fetch all media (images, videos, 3D models, external videos)
  const allMedia = await getProductMedia(productId)

  console.log(`Total media items: ${allMedia.length}`)

  // Separate by type using type guards
  const images = allMedia.filter(isMediaImage)
  const videos = allMedia.filter(isVideo)
  const models3d = allMedia.filter(isModel3d)
  const externalVideos = allMedia.filter(isExternalVideo)

  console.log(`Images: ${images.length}`)
  console.log(`Videos: ${videos.length}`)
  console.log(`3D Models: ${models3d.length}`)
  console.log(`External Videos: ${externalVideos.length}`)

  return allMedia
}

// ============================================================================
// Example 2: Product Gallery Component
// ============================================================================

/**
 * Product detail page with media gallery
 */
async function example2_productGallery(productId: ShopifyGID) {
  // Fetch all media
  const allMedia = await getProductMedia(productId)

  // Group by type for organized rendering
  const grouped = groupMediaByType(allMedia)

  // Component rendering logic (pseudo-code)
  return {
    gallery: {
      // Main product images
      images: grouped.images.map((img) => ({
        url: img.image?.url || '',
        alt: img.alt || img.image?.altText || '',
        width: img.image?.width || 800,
        height: img.image?.height || 600,
      })),

      // Video gallery
      videos: grouped.videos.map((video) => ({
        url: video.sources[0]?.url || '',
        duration: video.duration,
        thumbnail: video.preview?.image?.url || '',
      })),

      // YouTube/Vimeo videos
      externalVideos: grouped.externalVideos.map((video) => ({
        embedUrl: video.embedUrl,
        host: video.host, // 'YOUTUBE' or 'VIMEO'
      })),

      // 3D viewer (if available)
      models3d: grouped.models3d.map((model) => ({
        glb: model.sources.find((s) => s.format === 'glb')?.url,
        usdz: model.sources.find((s) => s.format === 'usdz')?.url,
      })),
    },
  }
}

// ============================================================================
// Example 3: Filter by Media Type
// ============================================================================

/**
 * Fetch only images (most efficient for image galleries)
 */
async function example3_imagesOnly(productId: ShopifyGID) {
  // Direct query for images only (faster than fetching all media)
  const images = await getProductImages(productId)

  // Render images
  const imageData = images
    .filter((img) => img.image !== null) // TypeScript null check
    .map((img) => ({
      src: img.image!.url,
      alt: img.alt || img.image!.altText || 'Product image',
      width: img.image!.width || 800,
      height: img.image!.height || 600,
    }))

  return imageData
}

/**
 * Fetch videos for video showcase section
 */
async function example3_videosOnly(productId: ShopifyGID) {
  // Fetch both Shopify-hosted and external videos
  const { videos, externalVideos } = await getProductVideos(productId)

  return {
    shopifyVideos: videos.map((v) => ({
      url: v.sources[0]?.url,
      duration: v.duration, // milliseconds
      thumbnail: v.preview?.image?.url,
    })),
    youtubeVimeo: externalVideos.map((v) => ({
      embedUrl: v.embedUrl,
      host: v.host, // 'YOUTUBE' or 'VIMEO'
    })),
  }
}

// ============================================================================
// Example 4: Piano Product Page with 3D Viewer
// ============================================================================

/**
 * Piano product page with 3D model support
 */
async function example4_pianoWith3D(productId: ShopifyGID) {
  // Check if product has 3D models before loading viewer
  const has3D = await hasProductMediaType(productId, 'MODEL_3D')

  if (has3D) {
    // Fetch 3D models
    const models = await getProduct3DModels(productId)

    if (models.length > 0) {
      const model = models[0]

      // TypeScript strict mode: array access can return undefined
      if (!model) {
        return { has3DViewer: false }
      }

      // Get GLB for web viewer, USDZ for AR on iOS
      const glbSource = model.sources.find((s) => s.format === 'glb')
      const usdzSource = model.sources.find((s) => s.format === 'usdz')

      return {
        has3DViewer: true,
        model: {
          glb: glbSource?.url,
          usdz: usdzSource?.url,
          boundingBox: model.boundingBox,
        },
      }
    }
  }

  return { has3DViewer: false }
}

// ============================================================================
// Example 5: Media Statistics Dashboard
// ============================================================================

/**
 * Admin dashboard showing media statistics
 */
async function example5_mediaStats(productId: ShopifyGID) {
  const allMedia = await getProductMedia(productId)

  // Count media by type
  const counts = countMediaByType(allMedia)

  // Calculate storage usage
  let totalSize = 0
  allMedia.forEach((media) => {
    if (isMediaImage(media) && media.originalSource?.fileSize) {
      totalSize += media.originalSource.fileSize
    } else if (isVideo(media) && media.sources[0]?.fileSize) {
      totalSize += media.sources[0].fileSize
    } else if (isModel3d(media) && media.sources[0]?.fileSize) {
      totalSize += media.sources[0].fileSize
    }
  })

  return {
    counts,
    totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
    breakdown: {
      images: `${counts.images} images`,
      videos: `${counts.videos} Shopify-hosted videos`,
      externalVideos: `${counts.externalVideos} YouTube/Vimeo videos`,
      models3d: `${counts.models3d} 3D models`,
    },
  }
}

// ============================================================================
// Example 6: Responsive Image Component
// ============================================================================

/**
 * Get primary image with fallback
 */
async function example6_primaryImage(productId: ShopifyGID) {
  const primaryImage = await getProductPrimaryImage(productId)

  if (!primaryImage || !primaryImage.image) {
    return {
      src: '/images/defaults/piano-fallback.jpg',
      alt: 'Piano placeholder',
      width: 800,
      height: 600,
    }
  }

  return {
    src: primaryImage.image.url,
    alt: primaryImage.alt || primaryImage.image.altText || 'Piano',
    width: primaryImage.image.width || 800,
    height: primaryImage.image.height || 600,
  }
}

// ============================================================================
// Example 7: Server Component with Media
// ============================================================================

/**
 * Next.js Server Component fetching media
 */
async function example7_serverComponent({ productId }: { productId: ShopifyGID }) {
  // Server Components can directly call async functions
  const allMedia = await getProductMedia(productId)
  const grouped = groupMediaByType(allMedia)

  // Return JSX (pseudo-code)
  return {
    title: 'Product Gallery',
    images: grouped.images,
    videos: grouped.videos,
    has3D: grouped.models3d.length > 0,
  }
}

// ============================================================================
// Example 8: Extract All Media URLs
// ============================================================================

/**
 * Get all media URLs for sitemap or prefetching
 */
async function example8_extractUrls(productId: ShopifyGID) {
  const allMedia = await getProductMedia(productId)

  // Extract URLs from all media types
  const urls = extractMediaUrls(allMedia)

  console.log('All media URLs:', urls)

  return urls
}

// ============================================================================
// Example 9: Conditional Rendering Based on Media Type
// ============================================================================

/**
 * Check media types before rendering
 */
async function example9_conditionalRendering(productId: ShopifyGID) {
  // Check for specific media types without fetching all media
  const [hasImages, hasVideos, has3D] = await Promise.all([
    hasProductMediaType(productId, 'IMAGE'),
    hasProductMediaType(productId, 'VIDEO'),
    hasProductMediaType(productId, 'MODEL_3D'),
  ])

  return {
    showGallery: hasImages,
    showVideoPlayer: hasVideos,
    show3DViewer: has3D,
  }
}

// ============================================================================
// Example 10: Error Handling
// ============================================================================

/**
 * Proper error handling with fallbacks
 */
async function example10_errorHandling(productId: ShopifyGID) {
  try {
    const images = await getProductImages(productId)

    if (images.length === 0) {
      console.warn('No images found for product:', productId)
      return {
        images: [
          {
            src: '/images/defaults/piano-fallback.jpg',
            alt: 'Piano placeholder',
          },
        ],
      }
    }

    return {
      images: images
        .filter((img) => img.image !== null)
        .map((img) => ({
          src: img.image!.url,
          alt: img.alt || img.image!.altText || 'Piano',
        })),
    }
  } catch (error) {
    console.error('Failed to fetch product media:', error)

    // Return fallback
    return {
      images: [
        {
          src: '/images/defaults/piano-fallback.jpg',
          alt: 'Piano placeholder',
        },
      ],
    }
  }
}

// ============================================================================
// Example 11: Pagination for Products with Many Media Items
// ============================================================================

/**
 * Handle pagination for large media galleries
 */
async function example11_pagination(productId: ShopifyGID) {
  // First page (50 items)
  const firstPage = await getProductMedia(productId, { first: 50 })

  console.log(`Loaded ${firstPage.length} media items`)

  // If you need more, use the after cursor (would require modifying getProductMedia
  // to return pageInfo, or use the shopifyAdminClient directly with GET_PRODUCT_MEDIA_PAGINATED)

  return firstPage
}

// ============================================================================
// Export Examples
// ============================================================================

export const mediaExamples = {
  example1_fetchAllMedia,
  example2_productGallery,
  example3_imagesOnly,
  example3_videosOnly,
  example4_pianoWith3D,
  example5_mediaStats,
  example6_primaryImage,
  example7_serverComponent,
  example8_extractUrls,
  example9_conditionalRendering,
  example10_errorHandling,
  example11_pagination,
}

/**
 * Run all examples (for testing)
 */
export async function runAllExamples(productId: ShopifyGID) {
  console.log('Running media examples for product:', productId)

  await example1_fetchAllMedia()
  await example2_productGallery(productId)
  await example3_imagesOnly(productId)
  await example3_videosOnly(productId)
  await example4_pianoWith3D(productId)
  await example5_mediaStats(productId)
  await example6_primaryImage(productId)
  await example7_serverComponent({ productId })
  await example8_extractUrls(productId)
  await example9_conditionalRendering(productId)
  await example10_errorHandling(productId)
  await example11_pagination(productId)

  console.log('All examples completed!')
}
