##Product Media Sync Integration Guide

Complete guide for integrating Shopify product media (images, videos, 3D models, external videos) into Payload CMS Products collection.

## Overview

This integration adds a `shopifyMedia` array field to your Products collection that stores all media types from Shopify with their complete metadata, eliminating the need for additional API calls when displaying product galleries.

## What's Included

### Files Created

1. **`src/lib/payload/fields/shopify-media-field.ts`** - Payload field definition
2. **`src/lib/shopify/transform-media-to-payload.ts`** - Data transformation utilities
3. **Shopify media integration** (already implemented):
   - `src/lib/shopify/media-types.ts`
   - `src/lib/shopify/media-queries.ts`
   - `src/lib/shopify/media.ts`

### Media Types Supported

| Type | Shopify Type | Fields Stored |
|------|--------------|---------------|
| **Images** | MediaImage | url, width, height, mimeType, alt |
| **Videos** | Video | url, duration, format, thumbnail |
| **3D Models** | Model3d | GLB URL, USDZ URL, bounding box |
| **External Videos** | ExternalVideo | embedUrl, host (YouTube/Vimeo) |

## Integration Steps

### Step 1: Add Field to Products Collection

Update `src/collections/Products.ts`:

```typescript
import { shopifyMediaField } from '@/lib/payload/fields'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            // ... existing fields ...

            // Add shopifyMedia field
            shopifyMediaField(),

            // Keep existing imageUrl for backwards compatibility
            {
              name: 'imageUrl',
              type: 'text',
              admin: {
                description: 'Primary image URL (auto-populated from first shopifyMedia image)',
                readOnly: true
              }
            },
          ]
        }
      ]
    }
  ]
}
```

### Step 2: Update Shopify Sync Function

Update `transformShopifyToPayload` in `Products.ts` to fetch and transform media:

```typescript
import { getProductMedia, transformMediaToPayload, getPrimaryImageUrl } from '@/lib/shopify'

async function transformShopifyToPayload(shopifyProduct: ShopifyProductData): Promise<any> {
  // ... existing transformation code ...

  // Fetch all media from Shopify
  let shopifyMedia = []
  try {
    const media = await getProductMedia(shopifyProduct.id)
    shopifyMedia = transformMediaToPayload(media)
    console.log(`[Sync] Fetched ${shopifyMedia.length} media items for ${shopifyProduct.title}`)
  } catch (error) {
    console.error('[Sync] Failed to fetch product media:', error)
  }

  // Get primary image URL for backwards compatibility
  const primaryImageUrl = getPrimaryImageUrl(shopifyMedia) || shopifyProduct.featuredImage?.url

  return {
    model,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,

    // ... other fields ...

    // Media fields
    shopifyMedia,              // ✅ All media types with metadata
    imageUrl: primaryImageUrl,  // ✅ Backwards compatibility

    shopify: {
      productId: shopifyProduct.id,
      // ... rest of shopify data ...
    },
  }
}
```

### Step 3: Update Bulk Sync Endpoint

The existing bulk sync endpoint in `Products.ts` will automatically use the updated `transformShopifyToPayload` function, so no additional changes are needed!

```typescript
// The bulk sync endpoint already calls transformShopifyToPayload
// So media will automatically be synced when you click "Sync from Shopify"
```

## Frontend Usage

### Basic Usage: Get All Media

```typescript
// app/products/[slug]/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: params.slug } }
  })

  const product = docs[0]

  if (!product) notFound()

  const { shopifyMedia } = product

  return (
    <div>
      <h1>{product.name}</h1>

      {/* All media available! */}
      <ProductGallery media={shopifyMedia} />
    </div>
  )
}
```

### Filter by Media Type

```typescript
import { filterMediaByType } from '@/lib/shopify'

// Get only images
const images = filterMediaByType(product.shopifyMedia, 'IMAGE')

// Get only videos
const videos = filterMediaByType(product.shopifyMedia, 'VIDEO')

// Get 3D models
const models = filterMediaByType(product.shopifyMedia, 'MODEL_3D')

// Get external videos (YouTube/Vimeo)
const externalVideos = filterMediaByType(product.shopifyMedia, 'EXTERNAL_VIDEO')
```

### Product Gallery Component

```tsx
// components/product/ProductGallery.tsx
'use client'

import type { PayloadShopifyMedia } from '@/lib/shopify'
import Image from 'next/image'

interface ProductGalleryProps {
  media: PayloadShopifyMedia[]
}

export function ProductGallery({ media }: ProductGalleryProps) {
  // Separate by type
  const images = media.filter(m => m.mediaType === 'IMAGE')
  const videos = media.filter(m => m.mediaType === 'VIDEO')
  const models3d = media.filter(m => m.mediaType === 'MODEL_3D')
  const externalVideos = media.filter(m => m.mediaType === 'EXTERNAL_VIDEO')

  return (
    <div className="grid gap-8">
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => img.imageUrl && (
            <div key={img.shopifyMediaId} className="relative aspect-square">
              <Image
                src={img.imageUrl}
                alt={img.alt || 'Product image'}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Video Player */}
      {videos.length > 0 && (
        <div>
          <h3>Videos</h3>
          {videos.map((video) => video.videoUrl && (
            <video
              key={video.shopifyMediaId}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              controls
              className="w-full rounded-lg"
            />
          ))}
        </div>
      )}

      {/* 3D Viewer */}
      {models3d.length > 0 && (
        <div>
          <h3>3D View</h3>
          {models3d.map((model) => (
            <div key={model.shopifyMediaId}>
              {/* Add your 3D viewer component */}
              <a href={model.model3dUrlGlb} target="_blank">
                View 3D Model (GLB)
              </a>
              {model.model3dUrlUsdz && (
                <a href={model.model3dUrlUsdz} rel="ar">
                  View in AR (iOS)
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* External Videos (YouTube/Vimeo) */}
      {externalVideos.length > 0 && (
        <div>
          <h3>Featured Videos</h3>
          {externalVideos.map((video) => video.embedUrl && (
            <iframe
              key={video.shopifyMediaId}
              src={video.embedUrl}
              title={video.alt || 'Product video'}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Piano Product with 3D Viewer

```tsx
// components/product/PianoProduct3D.tsx
import type { PayloadShopifyMedia } from '@/lib/shopify'

interface Props {
  shopifyMedia: PayloadShopifyMedia[]
}

export function PianoProduct3D({ shopifyMedia }: Props) {
  const models = shopifyMedia.filter(m => m.mediaType === 'MODEL_3D')

  if (models.length === 0) {
    return null // No 3D model available
  }

  const model = models[0]

  return (
    <div className="3d-viewer-container">
      <model-viewer
        src={model.model3dUrlGlb}
        ios-src={model.model3dUrlUsdz}
        alt={model.alt || 'Piano 3D model'}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
      />
    </div>
  )
}
```

## Data Structure Examples

### Sample shopifyMedia Array

```json
[
  {
    "mediaType": "IMAGE",
    "shopifyMediaId": "gid://shopify/MediaImage/123",
    "status": "READY",
    "position": 0,
    "alt": "Kawai CA99 Digital Piano - Front View",
    "imageUrl": "https://cdn.shopify.com/s/files/1/0000/0000/products/ca99-front.jpg",
    "imageWidth": 1920,
    "imageHeight": 1280,
    "mimeType": "image/jpeg",
    "createdAt": "2025-01-15T10:00:00Z"
  },
  {
    "mediaType": "VIDEO",
    "shopifyMediaId": "gid://shopify/Video/456",
    "status": "READY",
    "position": 1,
    "alt": "CA99 Sound Demo",
    "filename": "ca99-demo.mp4",
    "videoUrl": "https://cdn.shopify.com/videos/ca99-demo.mp4",
    "duration": 120000,
    "videoFormat": "mp4",
    "videoMimeType": "video/mp4",
    "thumbnailUrl": "https://cdn.shopify.com/videos/ca99-thumb.jpg",
    "createdAt": "2025-01-16T14:30:00Z"
  },
  {
    "mediaType": "MODEL_3D",
    "shopifyMediaId": "gid://shopify/Model3d/789",
    "status": "READY",
    "position": 2,
    "alt": "CA99 3D Model",
    "filename": "ca99-model.glb",
    "model3dUrlGlb": "https://cdn.shopify.com/3d/ca99-model.glb",
    "model3dUrlUsdz": "https://cdn.shopify.com/3d/ca99-model.usdz",
    "model3dBoundingBox": {
      "size": { "x": 1.5, "y": 1.0, "z": 0.4 }
    },
    "createdAt": "2025-01-17T09:00:00Z"
  },
  {
    "mediaType": "EXTERNAL_VIDEO",
    "shopifyMediaId": "gid://shopify/ExternalVideo/999",
    "status": "READY",
    "position": 3,
    "alt": "CA99 Performance Video",
    "embedUrl": "https://www.youtube.com/embed/abc123",
    "originUrl": "https://www.youtube.com/watch?v=abc123",
    "host": "YOUTUBE",
    "createdAt": "2025-01-18T16:00:00Z"
  }
]
```

## Benefits

### ✅ Performance

- **No additional API calls** - All media data stored in Payload
- **Faster page loads** - Media URLs available immediately
- **Cached in Payload** - No rate limiting concerns

### ✅ Complete Media Support

- **Images** - Full gallery support with dimensions
- **Videos** - Shopify-hosted videos with thumbnails
- **3D Models** - GLB and USDZ for AR viewers
- **External Videos** - YouTube/Vimeo embeds

### ✅ Backwards Compatible

- **imageUrl field preserved** - Existing code continues working
- **Gradual migration** - Can use shopifyMedia or imageUrl
- **Type-safe** - Full TypeScript support

### ✅ Developer Experience

- **Type-safe** - TypeScript interfaces for all media types
- **Helper functions** - Filter, count, transform utilities
- **Auto-synced** - Updates when bulk sync runs
- **Admin UI** - Rich preview in Payload admin

## Testing

### Test Sync with Real Product

1. Go to Payload Admin → Products
2. Click "Sync from Shopify" button
3. Wait for sync to complete
4. Open a product and check the "Shopify Media" array
5. Verify all media types are populated

### Test Frontend Display

```typescript
// Test page - app/test-media/page.tsx
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function TestMediaPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      'shopifyMedia': { exists: true }
    }
  })

  const product = docs[0]

  if (!product) {
    return <div>No products with media found</div>
  }

  return (
    <div className="p-8">
      <h1>{product.name}</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(product.shopifyMedia, null, 2)}
      </pre>
    </div>
  )
}
```

## Troubleshooting

### Issue: shopifyMedia is empty after sync

**Solution**: Check that:
1. Products in Shopify have media assigned
2. `getProductMedia` is called in `transformShopifyToPayload`
3. Shopify Admin API has `read_products` scope
4. No errors in console during sync

### Issue: Videos not displaying

**Solution**: Check that:
1. Videos are READY status in Shopify
2. `videoUrl` field is populated
3. Video format is supported (MP4)

### Issue: 3D models not loading

**Solution**: Check that:
1. Models are uploaded to Shopify as Model3d media
2. Both GLB and USDZ URLs are available
3. 3D viewer library is installed (`<model-viewer>`)

## Next Steps

1. ✅ Add `shopifyMediaField()` to Products collection
2. ✅ Update `transformShopifyToPayload` to fetch media
3. ✅ Run bulk sync to populate media data
4. ✅ Update frontend components to use `shopifyMedia`
5. ⏭️ Add 3D viewer for Model3d media (optional)
6. ⏭️ Add video player enhancements (optional)

---

**Status**: Ready for integration
**TypeScript**: Fully typed
**Payload Version**: v3.52.0+
