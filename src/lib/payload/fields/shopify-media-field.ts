/**
 * Shopify Media Field Definition
 *
 * Array field for storing all Shopify media types (images, videos, 3D models, external videos)
 * with complete metadata from Shopify Admin API.
 *
 * This field stores media URLs and metadata synced from Shopify product.media,
 * allowing the frontend to access all media types without additional API calls.
 */

import type { ArrayField } from 'payload'

/**
 * Shopify Media array field for Products collection
 *
 * Stores all media from Shopify with type-specific metadata:
 * - MediaImage: url, altText, width, height, mimeType
 * - Video: url, duration, format, mimeType
 * - Model3d: url, format (glb/usdz), fileSize
 * - ExternalVideo: embedUrl, host (YouTube/Vimeo)
 *
 * @example Usage in Products collection
 * ```typescript
 * import { shopifyMediaField } from '@/lib/payload/fields/shopify-media-field'
 *
 * export const Products: CollectionConfig = {
 *   fields: [
 *     shopifyMediaField(),
 *     // ... other fields
 *   ]
 * }
 * ```
 */
export function shopifyMediaField(): ArrayField {
  return {
    name: 'shopifyMedia',
    type: 'array',
    maxRows: 100, // Generous limit for product galleries
    labels: {
      singular: 'Media Item',
      plural: 'Shopify Media',
    },
    admin: {
      description:
        'Media items synced from Shopify (images, videos, 3D models, external videos) - Auto-populated from Shopify Admin API',
      readOnly: true, // Prevent manual editing (synced from Shopify)
      initCollapsed: false, // Show by default for visibility
    },
    fields: [
      // Media Type (required for type discrimination)
      {
        name: 'mediaType',
        type: 'select',
        required: true,
        options: [
          { label: '🖼️ Image', value: 'IMAGE' },
          { label: '🎥 Video (Shopify-hosted)', value: 'VIDEO' },
          { label: '🎨 3D Model', value: 'MODEL_3D' },
          { label: '📺 External Video (YouTube/Vimeo)', value: 'EXTERNAL_VIDEO' },
        ],
        admin: {
          description: 'Type of media (synced from Shopify)',
          readOnly: true,
        },
      },

      // Shopify Media ID
      {
        name: 'shopifyMediaId',
        type: 'text',
        required: true,
        admin: {
          description: 'Shopify Media ID (gid://shopify/MediaImage/... or Video/... etc.)',
          readOnly: true,
        },
      },

      // Processing Status
      {
        name: 'status',
        type: 'select',
        defaultValue: 'READY',
        options: [
          { label: '✅ Ready', value: 'READY' },
          { label: '⏳ Processing', value: 'PROCESSING' },
          { label: '📤 Uploaded', value: 'UPLOADED' },
          { label: '❌ Failed', value: 'FAILED' },
        ],
        admin: {
          description: 'Media processing status from Shopify',
          readOnly: true,
        },
      },

      // Position (for sorting)
      {
        name: 'position',
        type: 'number',
        admin: {
          description: 'Display order position (0 = first)',
          readOnly: true,
        },
      },

      // Alt Text (common to all types)
      {
        name: 'alt',
        type: 'text',
        admin: {
          description: 'Alt text for accessibility (synced from Shopify)',
          readOnly: true,
        },
      },

      // === MediaImage Fields ===
      {
        type: 'collapsible',
        label: '🖼️ Image Data',
        admin: {
          description: 'Image-specific fields (only for mediaType = IMAGE)',
          condition: (data, siblingData) => siblingData?.mediaType === 'IMAGE',
        },
        fields: [
          {
            name: 'imageUrl',
            type: 'text',
            admin: {
              description: 'Shopify CDN image URL',
              readOnly: true,
            },
          },
          {
            name: 'imageWidth',
            type: 'number',
            admin: {
              description: 'Image width in pixels',
              readOnly: true,
            },
          },
          {
            name: 'imageHeight',
            type: 'number',
            admin: {
              description: 'Image height in pixels',
              readOnly: true,
            },
          },
          {
            name: 'mimeType',
            type: 'text',
            admin: {
              description: 'MIME type (e.g., image/png, image/jpeg)',
              readOnly: true,
            },
          },
        ],
      },

      // === Video Fields ===
      {
        type: 'collapsible',
        label: '🎥 Video Data',
        admin: {
          description: 'Video-specific fields (only for mediaType = VIDEO)',
          condition: (data, siblingData) => siblingData?.mediaType === 'VIDEO',
        },
        fields: [
          {
            name: 'videoFilename',
            type: 'text',
            admin: {
              description: 'Video filename',
              readOnly: true,
            },
          },
          {
            name: 'videoUrl',
            type: 'text',
            admin: {
              description: 'Shopify-hosted video URL',
              readOnly: true,
            },
          },
          {
            name: 'duration',
            type: 'number',
            admin: {
              description: 'Video duration in milliseconds',
              readOnly: true,
            },
          },
          {
            name: 'videoFormat',
            type: 'text',
            admin: {
              description: 'Video format (e.g., mp4)',
              readOnly: true,
            },
          },
          {
            name: 'videoMimeType',
            type: 'text',
            admin: {
              description: 'Video MIME type (e.g., video/mp4)',
              readOnly: true,
            },
          },
          {
            name: 'videoWidth',
            type: 'number',
            admin: {
              description: 'Video width in pixels',
              readOnly: true,
            },
          },
          {
            name: 'videoHeight',
            type: 'number',
            admin: {
              description: 'Video height in pixels',
              readOnly: true,
            },
          },
          {
            name: 'thumbnailUrl',
            type: 'text',
            admin: {
              description: 'Video thumbnail/preview image URL',
              readOnly: true,
            },
          },
        ],
      },

      // === Model3d Fields ===
      {
        type: 'collapsible',
        label: '🎨 3D Model Data',
        admin: {
          description: '3D model-specific fields (only for mediaType = MODEL_3D)',
          condition: (data, siblingData) => siblingData?.mediaType === 'MODEL_3D',
        },
        fields: [
          {
            name: 'model3dFilename',
            type: 'text',
            admin: {
              description: '3D model filename',
              readOnly: true,
            },
          },
          {
            name: 'model3dUrlGlb',
            type: 'text',
            admin: {
              description: 'GLB format URL (for web 3D viewers)',
              readOnly: true,
            },
          },
          {
            name: 'model3dUrlUsdz',
            type: 'text',
            admin: {
              description: 'USDZ format URL (for iOS AR)',
              readOnly: true,
            },
          },
          {
            name: 'model3dBoundingBox',
            type: 'json',
            admin: {
              description: '3D model dimensions (bounding box)',
              readOnly: true,
            },
          },
        ],
      },

      // === ExternalVideo Fields ===
      {
        type: 'collapsible',
        label: '📺 External Video Data',
        admin: {
          description: 'External video fields (only for mediaType = EXTERNAL_VIDEO)',
          condition: (data, siblingData) => siblingData?.mediaType === 'EXTERNAL_VIDEO',
        },
        fields: [
          {
            name: 'embedUrl',
            type: 'text',
            admin: {
              description: 'Embed URL for YouTube/Vimeo player',
              readOnly: true,
            },
          },
          {
            name: 'originUrl',
            type: 'text',
            admin: {
              description: 'Original video URL',
              readOnly: true,
            },
          },
          {
            name: 'host',
            type: 'select',
            options: [
              { label: 'YouTube', value: 'YOUTUBE' },
              { label: 'Vimeo', value: 'VIMEO' },
            ],
            admin: {
              description: 'Video hosting platform',
              readOnly: true,
            },
          },
        ],
      },

      // Timestamps
      {
        name: 'createdAt',
        type: 'date',
        admin: {
          description: 'When this media was created in Shopify',
          readOnly: true,
          date: {
            displayFormat: 'MMM d, yyyy h:mm a',
          },
        },
      },
      {
        name: 'updatedAt',
        type: 'date',
        admin: {
          description: 'When this media was last updated in Shopify',
          readOnly: true,
          date: {
            displayFormat: 'MMM d, yyyy h:mm a',
          },
        },
      },
    ],
  }
}
