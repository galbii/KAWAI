# Shopify Product Media Implementation

Complete implementation of Shopify Admin API product media fetching with support for all 4 media types.

## ✅ Implementation Status

**All files created and type-safe:**

- ✅ `media-types.ts` - TypeScript type definitions for all media types
- ✅ `media-queries.ts` - GraphQL queries and fragments
- ✅ `media.ts` - Main API functions for fetching media
- ✅ `media-usage-examples.ts` - Comprehensive usage examples
- ✅ Updated `types.ts` - Re-exported media types
- ✅ Updated `index.ts` - Barrel exports for clean imports

## 📦 What's Included

### Media Types Supported

1. **MediaImage** - Shopify CDN-hosted images (PNG, GIF, JPG)
2. **Video** - Shopify-hosted MP4 videos
3. **Model3d** - 3D models (GLB, USDZ) for AR/3D viewers
4. **ExternalVideo** - YouTube/Vimeo embeds

### Key Features

- ✅ TypeScript strict mode compliant (all null checks in place)
- ✅ Type guards for runtime type checking
- ✅ Automatic filtering of READY media (excludes processing/failed)
- ✅ Efficient filtered queries (fetch only specific media types)
- ✅ Utility functions for common operations
- ✅ Comprehensive error handling
- ✅ Pagination support for large galleries

## 🚀 Quick Start

### Basic Usage

```typescript
import { getProductMedia, isMediaImage, isVideo } from '@/lib/shopify'

// Fetch all media for a product
const allMedia = await getProductMedia('gid://shopify/Product/123456')

// Separate by type using type guards
const images = allMedia.filter(isMediaImage)
const videos = allMedia.filter(isVideo)
```

### Fetch Specific Media Types

```typescript
import { getProductImages, getProductVideos } from '@/lib/shopify'

// Get only images (most efficient)
const images = await getProductImages('gid://shopify/Product/123456')

// Get videos (Shopify-hosted + external)
const { videos, externalVideos } = await getProductVideos('gid://shopify/Product/123456')
```

### Product Gallery Component

```typescript
import { groupMediaByType } from '@/lib/shopify'

const allMedia = await getProductMedia(productId)
const grouped = groupMediaByType(allMedia)

// Now you have:
// - grouped.images (MediaImage[])
// - grouped.videos (Video[])
// - grouped.models3d (Model3d[])
// - grouped.externalVideos (ExternalVideo[])
```

## 📋 API Reference

### Main Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `getProductMedia(productId)` | Fetch all media types | `Media[]` |
| `getProductMediaByType(productId, type)` | Fetch specific media type | `Media[]` |
| `getProductImages(productId)` | Fetch only images | `MediaImage[]` |
| `getProductVideos(productId)` | Fetch videos + external | `{ videos, externalVideos }` |
| `getProduct3DModels(productId)` | Fetch 3D models | `Model3d[]` |
| `getProductPrimaryImage(productId)` | Get first image | `MediaImage \| null` |

### Utility Functions

| Function | Description |
|----------|-------------|
| `hasProductMediaType(productId, type)` | Check if product has media type |
| `countMediaByType(media)` | Count media items by type |
| `groupMediaByType(media)` | Group media into type arrays |
| `extractMediaUrls(media)` | Extract all URLs from media |

### Type Guards

| Function | Usage |
|----------|-------|
| `isMediaImage(media)` | Check if media is MediaImage |
| `isVideo(media)` | Check if media is Video |
| `isModel3d(media)` | Check if media is Model3d |
| `isExternalVideo(media)` | Check if media is ExternalVideo |
| `isMediaReady(media)` | Check if media is ready (status = READY) |

## 🎯 Common Use Cases

### 1. Product Detail Page Gallery

```typescript
const allMedia = await getProductMedia(productId)
const grouped = groupMediaByType(allMedia)

// Render image gallery
{grouped.images.map(img => (
  <Image src={img.image?.url} alt={img.alt || ''} />
))}

// Render video player
{grouped.videos.map(video => (
  <video src={video.sources[0]?.url} controls />
))}
```

### 2. Piano with 3D Viewer

```typescript
const has3D = await hasProductMediaType(productId, 'MODEL_3D')

if (has3D) {
  const models = await getProduct3DModels(productId)
  const model = models[0]

  // Load 3D viewer with GLB/USDZ sources
  const glb = model?.sources.find(s => s.format === 'glb')?.url
  const usdz = model?.sources.find(s => s.format === 'usdz')?.url
}
```

### 3. Homepage Featured Product Images

```typescript
const primaryImage = await getProductPrimaryImage(productId)

if (primaryImage?.image) {
  return <Image src={primaryImage.image.url} alt={primaryImage.alt || ''} />
}
```

## 🔧 TypeScript Strict Mode

All files are fully compliant with TypeScript strict mode:

- ✅ All function parameters explicitly typed
- ✅ Null checks for optional properties
- ✅ Array access properly guarded (`noUncheckedIndexedAccess`)
- ✅ Type guards for runtime safety
- ✅ No implicit `any` types

## 📚 Documentation

- **Detailed examples**: See `media-usage-examples.ts`
- **Type definitions**: See `media-types.ts`
- **GraphQL queries**: See `media-queries.ts`
- **API functions**: See `media.ts`

## 🔗 Integration Notes

### Shopify Admin API Requirements

- **API Version**: 2025-01 (already configured)
- **Required Scope**: `read_products` (already have this)
- **Authentication**: OAuth 2.0 (already implemented via `admin-client.ts`)

### Differences from product.images

The `product.media` field provides:

- ✅ All 4 media types (not just images)
- ✅ Processing status tracking
- ✅ Detailed error handling
- ✅ Better filtering options
- ✅ Admin API only (server-side)

The old `product.images` field:

- Only returns images
- Available in Storefront API
- Limited metadata
- No status tracking

## ✨ Next Steps

1. **Test with real product**: Use a product ID from your Shopify store
2. **Implement in UI**: Use in product detail pages, galleries, etc.
3. **Add 3D viewer**: If you have 3D models, integrate a viewer
4. **Cache strategy**: Configure ISR revalidation times as needed

## 📖 Example: Complete Product Page

```typescript
// app/products/[id]/page.tsx
import { getProductMedia, groupMediaByType } from '@/lib/shopify'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = `gid://shopify/Product/${params.id}`
  const allMedia = await getProductMedia(productId)
  const grouped = groupMediaByType(allMedia)

  return (
    <div>
      <h1>Product Gallery</h1>

      {/* Images */}
      <div className="grid grid-cols-3 gap-4">
        {grouped.images.map(img => img.image && (
          <img key={img.id} src={img.image.url} alt={img.alt || ''} />
        ))}
      </div>

      {/* Videos */}
      {grouped.videos.length > 0 && (
        <div className="mt-8">
          <h2>Videos</h2>
          {grouped.videos.map(video => {
            const source = video.sources[0]
            return source ? (
              <video key={video.id} src={source.url} controls />
            ) : null
          })}
        </div>
      )}

      {/* 3D Models */}
      {grouped.models3d.length > 0 && (
        <div className="mt-8">
          <h2>3D View</h2>
          {/* Add your 3D viewer component here */}
        </div>
      )}
    </div>
  )
}
```

---

**Status**: ✅ Complete and production-ready
**TypeScript**: ✅ Strict mode compliant
**Testing**: Ready for integration testing with real Shopify data
