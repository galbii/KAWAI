import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const ProductDescription: Block = {
  slug: 'product-description',
  interfaceName: 'ProductDescriptionBlock',
  labels: {
    singular: '📝 Product Description',
    plural: 'Product Descriptions',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Product+Description',
  imageAltText: 'Display product descriptions with image or video backgrounds',
  fields: [
    // Media Background Group
    {
      name: 'background',
      type: 'group',
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          required: true,
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'YouTube Video', value: 'youtube' },
          ],
          admin: {
            description: 'Choose background type for the description section',
          },
        },
        imageField('backgroundImage', {
          admin: {
            description: 'Background image (recommended: 1920x1080px)',
            condition: (data, siblingData) => siblingData?.mediaType === 'image',
          },
        }),
        {
          name: 'youtubeUrl',
          type: 'text',
          admin: {
            description: 'YouTube video URL (supports youtube.com/watch, youtu.be, embed URLs)',
            condition: (data, siblingData) => siblingData?.mediaType === 'youtube',
          },
        },
        {
          name: 'overlayColor',
          type: 'select',
          defaultValue: 'dark',
          options: [
            { label: 'Dark (Black)', value: 'dark' },
            { label: 'Light (White)', value: 'light' },
            { label: 'KAWAI Red', value: 'kawai-red' },
            { label: 'None', value: 'none' },
          ],
          admin: {
            description: 'Overlay color to improve text readability',
          },
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: {
            description: 'Overlay opacity (0-100%). Higher values make text more readable.',
          },
        },
      ],
      admin: {
        description: 'Background media configuration (image or video)',
      },
    },

    // Content Options Group
    {
      name: 'content',
      type: 'group',
      fields: [
        {
          name: 'showProductName',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display the product name as heading above description',
          },
        },
        {
          name: 'useCustomDescription',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable to override the product description with custom text',
          },
        },
        {
          name: 'customDescription',
          type: 'textarea',
          admin: {
            description: 'Custom description text (only used when "Use Custom Description" is enabled)',
            condition: (data, siblingData) => siblingData?.useCustomDescription === true,
          },
        },
      ],
      admin: {
        description: 'Automatically uses the description from the current product. Enable custom override if needed.',
      },
    },

    // Layout & Styling Group
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'contentAlignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Horizontal alignment of text content',
          },
        },
        {
          name: 'verticalAlignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Center', value: 'center' },
            { label: 'Bottom', value: 'bottom' },
          ],
          admin: {
            description: 'Vertical alignment of content',
          },
        },
        {
          name: 'textColor',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Charcoal', value: 'charcoal' },
          ],
          admin: {
            description: 'Text color (choose based on background)',
          },
        },
        {
          name: 'textSize',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xlarge' },
          ],
          admin: {
            description: 'Text size for description content',
          },
        },
        {
          name: 'useGlassmorphism',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Wrap content in a glassmorphism effect (frosted glass background)',
          },
        },
        {
          name: 'minHeight',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Small (400px)', value: 'small' },
            { label: 'Medium (600px)', value: 'medium' },
            { label: 'Large (800px)', value: 'large' },
            { label: 'Full Screen (100vh)', value: 'fullscreen' },
          ],
          admin: {
            description: 'Minimum height of the description section',
          },
        },
      ],
      admin: {
        description: 'Layout and styling options',
      },
    },
  ],
}
