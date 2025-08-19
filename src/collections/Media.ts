import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
    defaultColumns: ['filename', 'alt', 'mediaType', 'updatedAt'],
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  fields: [
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

    // Usage Context
    {
      name: 'usage',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Hero Images', value: 'hero' },
        { label: 'Product Images', value: 'product' },
        { label: 'Category Images', value: 'category' },
        { label: 'Carousel/Gallery', value: 'carousel' },
        { label: 'Background Images', value: 'background' },
        { label: 'Thumbnails', value: 'thumbnail' },
        { label: 'Technical Diagrams', value: 'technical' },
        { label: 'Marketing Materials', value: 'marketing' },
      ],
      admin: {
        description: 'Where this media is intended to be used',
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
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  },
}
