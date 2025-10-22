import type { Block } from 'payload'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  imageURL: 'https://via.placeholder.com/300x200?text=Image+Gallery',
  imageAltText: 'Image gallery block for showcasing multiple product images',
  interfaceName: 'ImageGalleryBlock',
  fields: [
    // Data Source Configuration
    {
      name: 'dataSource',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Piano Model Gallery', value: 'pianomodel' },
        { label: 'Hybrid (Piano Model + Additional)', value: 'hybrid' }
      ],
      admin: {
        description: 'Choose data source for gallery images'
      }
    },
    // PianoModel Relationship
    {
      name: 'pianoModel',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        description: 'Select piano model to automatically populate gallery from model images',
        condition: (data, siblingData) => {
          const dataSource = siblingData?.dataSource;
          return dataSource === 'pianomodel' || dataSource === 'hybrid';
        }
      }
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional gallery title'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional gallery description'
      }
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Image',
        plural: 'Gallery Images'
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Gallery image'
          }
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Image caption (optional)'
          }
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Alt text for accessibility (optional, will use image alt if not provided)'
          }
        }
      ],
      admin: {
        description: 'Images to display in the gallery (additional images when using Piano Model data source)',
        condition: (data) => {
          const dataSource = data?.dataSource;
          return dataSource === 'manual' || dataSource === 'hybrid';
        }
      }
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'grid',
          options: [
            { label: 'Grid Layout', value: 'grid' },
            { label: 'Masonry Layout', value: 'masonry' },
            { label: 'Carousel/Slider', value: 'carousel' },
            { label: 'Lightbox Grid', value: 'lightbox' }
          ],
          admin: {
            description: 'Gallery display style'
          }
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: 'three',
          options: [
            { label: '2 Columns', value: 'two' },
            { label: '3 Columns', value: 'three' },
            { label: '4 Columns', value: 'four' },
            { label: '5 Columns', value: 'five' }
          ],
          admin: {
            description: 'Number of columns for grid layouts',
            condition: (data, siblingData) => ['grid', 'masonry', 'lightbox'].includes(siblingData?.style)
          }
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ],
          admin: {
            description: 'Spacing between images'
          }
        },
        {
          name: 'aspectRatio',
          type: 'select',
          defaultValue: 'original',
          options: [
            { label: 'Original', value: 'original' },
            { label: 'Square (1:1)', value: 'square' },
            { label: 'Landscape (16:9)', value: 'landscape' },
            { label: 'Portrait (3:4)', value: 'portrait' }
          ],
          admin: {
            description: 'Aspect ratio for images in grid layouts',
            condition: (data, siblingData) => ['grid', 'lightbox'].includes(siblingData?.style)
          }
        }
      ],
      admin: {
        description: 'Gallery layout and display options'
      }
    },
    {
      name: 'carouselSettings',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Auto-advance slides'
          }
        },
        {
          name: 'autoplaySpeed',
          type: 'number',
          defaultValue: 5000,
          min: 1000,
          admin: {
            description: 'Autoplay speed in milliseconds',
            condition: (data, siblingData) => siblingData?.autoplay === true
          }
        },
        {
          name: 'showDots',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation dots'
          }
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show navigation arrows'
          }
        },
        {
          name: 'slidesToShow',
          type: 'select',
          defaultValue: 'one',
          options: [
            { label: '1 Slide', value: 'one' },
            { label: '2 Slides', value: 'two' },
            { label: '3 Slides', value: 'three' },
            { label: '4 Slides', value: 'four' }
          ],
          admin: {
            description: 'Number of slides to show at once'
          }
        },
        {
          name: 'infinite',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable infinite loop'
          }
        }
      ],
      admin: {
        description: 'Carousel-specific settings',
        condition: (data, siblingData) => siblingData?.layout?.style === 'carousel'
      }
    },
    {
      name: 'enableZoom',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable image zoom on hover/click'
      }
    },
    {
      name: 'showCaptions',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display image captions'
      }
    }
  ]
}