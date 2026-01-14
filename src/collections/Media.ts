import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'

/**
 * Generates the public R2 URL for a media file
 */
function generatePublicUrl(filename: string): string {
  const publicUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_URL
  if (!publicUrl) {
    console.error('NEXT_PUBLIC_S3_PUBLIC_URL environment variable is not set')
    return ''
  }
  const cleanPublicUrl = publicUrl.replace(/\/$/, '')
  return `${cleanPublicUrl}/media/${filename}`
}

/**
 * Hook to automatically populate publicUrl field after upload
 */
const populatePublicUrl: CollectionAfterChangeHook = async ({
  doc,
  req,
  context,
}) => {
  // Prevent infinite loop - skip if we're already updating publicUrl
  if (context.skipPublicUrlUpdate) return doc

  // Only update if we have a filename and publicUrl is missing or outdated
  if (doc.filename) {
    const expectedUrl = generatePublicUrl(doc.filename)

    if (doc.publicUrl !== expectedUrl) {
      await req.payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          publicUrl: expectedUrl,
        },
        context: { skipPublicUrlUpdate: true },
        req,
      })

      // Return updated doc
      return { ...doc, publicUrl: expectedUrl }
    }
  }

  return doc
}

export const Media: CollectionConfig = {
  slug: 'media',
  // Enable Payload folders for media organization
  folders: true,
  admin: {
    group: 'System',
    description: 'Media library for images, videos, and documents',
    defaultColumns: ['filename', 'alt', 'publicUrl', 'mediaType', 'updatedAt'],
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [populatePublicUrl],
  },
  fields: [
    // Public R2 URL (auto-populated)
    {
      name: 'publicUrl',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Public CDN URL for this media file (auto-generated)',
        position: 'sidebar',
      },
    },
    // Basic Media Information
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for accessibility and SEO. Describe what the image shows.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption displayed with the image',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description for administrative purposes',
      },
    },

    // Media Type Classification
    {
      name: 'mediaType',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Document', value: 'document' },
      ],
      admin: {
        description: 'Type of media for better organization',
        position: 'sidebar',
      },
    },

    // Video-specific Fields
    {
      name: 'videoMeta',
      type: 'group',
      admin: {
        condition: (data) => data.mediaType === 'video',
        description: 'Video-specific metadata',
      },
      fields: [
        {
          name: 'duration',
          type: 'number',
          admin: {
            description: 'Video duration in seconds',
          },
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Custom thumbnail for the video',
          },
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Should this video autoplay (use sparingly)',
          },
        },
        {
          name: 'muted',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Start video muted (recommended for autoplay)',
          },
        },
      ],
    },

    // Responsive Image Variants
    {
      name: 'variants',
      type: 'group',
      admin: {
        condition: (data) => data.mediaType === 'image',
        description: 'Responsive image variants (generated automatically when uploaded)',
      },
      fields: [
        {
          name: 'mobile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optimized for mobile devices (480px width)',
          },
        },
        {
          name: 'tablet',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optimized for tablets (768px width)',
          },
        },
        {
          name: 'desktop',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optimized for desktop (1200px width)',
          },
        },
        {
          name: 'largeDesktop',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optimized for large screens (1920px width)',
          },
        },
      ],
    },

    // SEO and Technical Metadata
    {
      name: 'seoMeta',
      type: 'group',
      admin: {
        description: 'SEO and technical metadata',
      },
      fields: [
        {
          name: 'focusKeywords',
          type: 'text',
          admin: {
            description: 'Keywords this image relates to (comma-separated)',
          },
        },
        {
          name: 'photographerCredit',
          type: 'text',
          admin: {
            description: 'Photo credit information',
          },
        },
        {
          name: 'copyrightInfo',
          type: 'text',
          admin: {
            description: 'Copyright or licensing information',
          },
        },
        {
          name: 'originalSource',
          type: 'text',
          admin: {
            description: 'Original source or URL if external',
          },
        },
      ],
    },

    // Admin Organization
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured media for easy access',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Tags for organization and search (e.g., "grand-piano", "black-finish")',
        position: 'sidebar',
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  },
}
