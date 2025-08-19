import type { CollectionConfig } from 'payload'

export const Productlines: CollectionConfig = {
  slug: 'productlines',
  labels: {
    singular: 'Product Line',
    plural: 'Product Lines',
  },
  admin: {
    group: 'Products',
    defaultColumns: ['name', 'category', 'featured', 'updatedAt'],
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  fields: [
    // Basic Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { 
        description: 'Series name (e.g., "CA Series", "Shigeru Kawai SK Series")' 
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { 
        description: 'URL-friendly version of name' 
      }
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Digital Pianos', value: 'digital' },
        { label: 'Grand Pianos', value: 'grand' },
        { label: 'Hybrid Pianos', value: 'hybrid' },
        { label: 'Upright Pianos', value: 'upright' }
      ],
      admin: {
        description: 'Piano category for organizing series'
      }
    },
    
    // Content
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { 
        description: 'Main series description for the browser' 
      }
    },
    {
      name: 'highlight',
      type: 'text',
      admin: { 
        description: 'Optional highlighted callout text' 
      }
    },
    
    // Main Series Image
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main series image displayed in the browser'
      }
    },
    
    // Slide Images for Clean Series Browser
    {
      name: 'slides',
      type: 'array',
      required: false,
      minRows: 0,
      labels: {
        singular: 'Slide',
        plural: 'Slides',
      },
      admin: {
        description: 'Additional slides for the clean series browser carousel'
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title for this slide'
          }
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Slide image'
          }
        }
      ]
    },
    
    // Meta Fields
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { 
        description: 'Feature this series prominently',
        position: 'sidebar'
      }
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: { 
        description: 'Display order (lower numbers first)',
        position: 'sidebar'
      }
    }
  ],
  
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        }
        return data;
      }
    ]
  }
}