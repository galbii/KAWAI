import type { CollectionConfig } from 'payload'

export const Pianos: CollectionConfig = {
  slug: 'pianos',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'category', 'price', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the piano model',
      },
    },
    {
      name: 'model',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Model number (e.g., GX-3, CA701, K-200)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version for routing',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'piano-categories',
      required: true,
    },
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'piano-series',
      admin: {
        description: 'Piano series (Shigeru Kawai, GX, GL, K, CA, CN, etc.)',
      },
    },
    {
      name: 'pianoType',
      type: 'select',
      options: [
        { label: 'Grand Piano', value: 'grand' },
        { label: 'Upright Piano', value: 'upright' },
        { label: 'Digital Piano', value: 'digital' },
        { label: 'Hybrid Piano', value: 'hybrid' },
        { label: 'Silent Piano', value: 'silent' },
      ],
      required: true,
      admin: {
        description: 'Type of piano',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Available',
          value: 'available',
        },
        {
          label: 'Out of Stock',
          value: 'out-of-stock',
        },
        {
          label: 'Discontinued',
          value: 'discontinued',
        },
        {
          label: 'Pre-Order',
          value: 'pre-order',
        },
      ],
      defaultValue: 'available',
      required: true,
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        {
          name: 'msrp',
          type: 'number',
          required: true,
          admin: {
            description: 'Manufacturer Suggested Retail Price',
          },
        },
        {
          name: 'salePrice',
          type: 'number',
          admin: {
            description: 'Current sale price (if different from MSRP)',
          },
        },
        {
          name: 'showPrice',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display price on website',
          },
        },
      ],
    },
    {
      name: 'specifications',
      type: 'group',
      fields: [
        {
          name: 'dimensions',
          type: 'group',
          fields: [
            {
              name: 'length',
              type: 'text',
              admin: {
                description: 'Length in inches or cm',
              },
            },
            {
              name: 'width',
              type: 'text',
              admin: {
                description: 'Width in inches or cm',
              },
            },
            {
              name: 'height',
              type: 'text',
              admin: {
                description: 'Height in inches or cm',
              },
            },
            {
              name: 'weight',
              type: 'text',
              admin: {
                description: 'Weight in lbs or kg',
              },
            },
          ],
        },
        {
          name: 'keys',
          type: 'number',
          admin: {
            description: 'Number of keys (usually 88)',
          },
        },
        {
          name: 'pedals',
          type: 'number',
          admin: {
            description: 'Number of pedals',
          },
        },
        {
          name: 'voices',
          type: 'number',
          admin: {
            description: 'Number of voices (for digital pianos)',
          },
        },
        {
          name: 'polyphony',
          type: 'number',
          admin: {
            description: 'Polyphony count (for digital pianos)',
          },
        },
        {
          name: 'actionType',
          type: 'text',
          admin: {
            description: 'Action type (e.g., Millennium III, RHIII)',
          },
        },
        {
          name: 'soundEngine',
          type: 'text',
          admin: {
            description: 'Sound engine (e.g., Harmonic Imaging XL, SK-EX)',
          },
        },
        {
          name: 'touchSensitivity',
          type: 'text',
          admin: {
            description: 'Touch sensitivity levels',
          },
        },
        {
          name: 'finishes',
          type: 'array',
          fields: [
            {
              name: 'finish',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
          admin: {
            description: 'Available finishes (e.g., Ebony Polish, Mahogany)',
          },
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          name: 'brochure',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'PDF brochure or specification sheet',
          },
        },
        {
          name: 'audioSamples',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
          admin: {
            description: 'Audio samples demonstrating piano sound',
          },
        },
        {
          name: 'videos',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'youtubeUrl',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'thumbnail',
              type: 'upload',
              relationTo: 'media',
            },
          ],
          admin: {
            description: 'Demonstration videos and performances',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Main description of the piano',
      },
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key features and selling points',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (if different from name)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma separated)',
          },
        },
      ],
    },
    {
      name: 'isPreOwned',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as pre-owned piano',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature on homepage',
      },
    },
    {
      name: 'innovations',
      type: 'array',
      fields: [
        {
          name: 'innovation',
          type: 'relationship',
          relationTo: 'technologies',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Kawai innovations featured in this piano',
      },
    },
    {
      name: 'awards',
      type: 'array',
      fields: [
        {
          name: 'award',
          type: 'relationship',
          relationTo: 'awards',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
      ],
      admin: {
        description: 'Awards and recognitions',
      },
    },
    {
      name: 'endorsements',
      type: 'array',
      fields: [
        {
          name: 'artist',
          type: 'relationship',
          relationTo: 'artists',
          required: true,
        },
        {
          name: 'quote',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Artist endorsements',
      },
    },
    {
      name: 'compareFeatures',
      type: 'group',
      fields: [
        {
          name: 'enableComparison',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow this piano to be compared with others',
          },
        },
        {
          name: 'comparisonHighlights',
          type: 'array',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Key features for comparison tables',
          },
        },
      ],
    },
    {
      name: 'availabilityRegions',
      type: 'array',
      fields: [
        {
          name: 'region',
          type: 'text',
          required: true,
        },
        {
          name: 'availability',
          type: 'select',
          options: [
            { label: 'Available', value: 'available' },
            { label: 'Limited', value: 'limited' },
            { label: 'Coming Soon', value: 'coming-soon' },
            { label: 'Not Available', value: 'not-available' },
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Regional availability status',
      },
    },
  ],
}