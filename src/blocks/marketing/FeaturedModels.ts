import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'

export const FeaturedModels: Block = {
  slug: 'marketing-featured-models',
  labels: {
    singular: '🎹 Featured Models',
    plural: 'Featured Models Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=Featured+Models',
  imageAltText:
    'Showcase piano models with alternating media-rich layouts. Japanese-inspired minimalist design featuring glassmorphism content cards, product embeds, and cinematic video/image backgrounds. Perfect for product launches and series showcases.',
  interfaceName: 'MarketingFeaturedModelsBlock',
  fields: [
    // Section Header
    {
      type: 'collapsible',
      label: 'Section Header',
      admin: {
        description: 'Main section heading and introductory text',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Small uppercase label above heading (e.g., "Our Collection", "Flagship Series")',
            placeholder: 'Discover Excellence',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            description: 'Main section heading - large serif typography',
            placeholder: 'Featured Piano Models',
          },
        },
        {
          name: 'subheading',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Supporting text below heading (2-3 sentences, max 200 characters)',
            placeholder:
              'Discover our most celebrated instruments, each crafted with meticulous attention to detail and Japanese precision.',
          },
        },
      ],
    },

    // Featured Models Array
    {
      name: 'models',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      labels: {
        singular: 'Featured Model',
        plural: 'Featured Models',
      },
      admin: {
        description: 'Add up to 8 featured piano models with alternating layouts',
        initCollapsed: true,
      },
      fields: [
        // Layout Configuration
        {
          type: 'collapsible',
          label: '⚙️ Layout & Media',
          admin: {
            description: 'Configure layout direction and media background',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'layoutDirection',
              type: 'select',
              required: true,
              defaultValue: 'left',
              options: [
                { label: 'Media Left / Content Right', value: 'left' },
                { label: 'Content Left / Media Right', value: 'right' },
              ],
              admin: {
                description: 'Which side shows the media background',
              },
            },
            {
              name: 'backgroundVideoUrl',
              type: 'text',
              admin: {
                description:
                  '🎥 YouTube video URL for background (if filled, this takes priority over image below)',
                placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
            },
            imageField('backgroundImage', {
              required: false,
              admin: {
                description:
                  '📷 Background image (used if YouTube URL above is empty) - Recommended: 1200x1600px portrait or 1600x900px landscape',
              },
            }),
            {
              name: 'overlayOpacity',
              type: 'number',
              min: 0,
              max: 1,
              defaultValue: 0.3,
              admin: {
                step: 0.05,
                description: 'Dark overlay opacity on media (0 = transparent, 1 = fully dark)',
              },
            },
          ],
        },

        // Product Content
        {
          type: 'collapsible',
          label: '🎹 Product & Content',
          admin: {
            description: 'Product details, title, and features',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              maxDepth: 0,
              admin: {
                description:
                  'Select piano model to embed (pulls product data automatically)',
              },
            },
            {
              name: 'customTitle',
              type: 'text',
              admin: {
                description:
                  'Optional: Override product name with custom title (leave empty to use product name)',
                placeholder: 'The Concert Grand Reimagined',
              },
            },
            imageField('contentImage', {
              required: false,
              admin: {
                description:
                  '📷 Optional content image (displays under the title on mobile) - Recommended: 600x400px or 800x600px',
              },
            }),
            {
              name: 'imageZoom',
              type: 'select',
              defaultValue: 'cover',
              options: [
                { label: 'Fill Container (Crop)', value: 'cover' },
                { label: 'Fit Full Image', value: 'contain' },
                { label: 'Zoom In (120%)', value: 'zoom-in' },
                { label: 'Zoom Out (80%)', value: 'zoom-out' },
              ],
              admin: {
                description: 'Control how the product image is displayed',
                condition: (data: any, siblingData: any) => !!siblingData?.contentImage,
              },
            },
            {
              name: 'description',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description:
                  'Product description or tagline (2-3 sentences, max 300 characters)',
                placeholder:
                  'Experience the pinnacle of piano craftsmanship. Every detail meticulously refined for the discerning musician.',
              },
            },
            {
              name: 'enableVideoPopup',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Show play button to open video in popup modal',
              },
            },
            {
              name: 'popupVideoUrl',
              type: 'text',
              admin: {
                description: 'YouTube video URL for popup (opens in modal when play button is clicked)',
                placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                condition: (data: any, siblingData: any) => siblingData?.enableVideoPopup === true,
              },
            },
            {
              name: 'features',
              type: 'array',
              minRows: 0,
              maxRows: 6,
              labels: {
                singular: 'Feature',
                plural: 'Key Features',
              },
              admin: {
                description: 'Highlight key features with icons (up to 6 features)',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'check',
                  options: [
                    { label: '✓ Checkmark', value: 'check' },
                    { label: '⭐ Star', value: 'star' },
                    { label: '🎵 Music Note', value: 'music' },
                    { label: '🎹 Piano Keys', value: 'piano' },
                    { label: '✨ Sparkles', value: 'sparkles' },
                    { label: '🏆 Trophy', value: 'trophy' },
                    { label: '💎 Diamond', value: 'diamond' },
                    { label: '🌸 Sakura', value: 'sakura' },
                  ],
                  admin: {
                    description: 'Icon style for this feature',
                  },
                },
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Feature text (concise, 5-10 words)',
                    placeholder: 'Grand Feel III Wooden Key Action',
                  },
                },
              ],
            },
          ],
        },

        // Call-to-Action
        {
          type: 'collapsible',
          label: '🔗 Call-to-Action',
          admin: {
            description: 'Optional CTA button configuration',
            initCollapsed: true,
          },
          fields: [
            {
              name: 'ctaText',
              type: 'text',
              admin: {
                description: 'Button text (leave empty to hide button)',
                placeholder: 'Explore This Model',
              },
            },
            {
              name: 'ctaLink',
              type: 'text',
              admin: {
                description: 'Button destination URL',
                placeholder: '/products/ca-901',
                condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
              },
            },
            {
              name: 'ctaStyle',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary (Filled Red)', value: 'primary' },
                { label: 'Secondary (Outline)', value: 'secondary' },
                { label: 'Tertiary (Text Link)', value: 'tertiary' },
              ],
              admin: {
                description: 'Button visual style',
                condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
              },
            },
            {
              name: 'ctaOpenInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new browser tab',
                condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
              },
            },
          ],
        },
      ],
    },

    // Design & Style
    {
      type: 'collapsible',
      label: '🎨 Design & Style',
      admin: {
        description: 'Visual styling and animation options',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light (Pearl Background)', value: 'light' },
            { label: 'Dark (Charcoal Background)', value: 'dark' },
            { label: 'Transparent (No Background)', value: 'transparent' },
          ],
          admin: {
            description: 'Overall section theme',
          },
        },
        {
          name: 'contentCardStyle',
          type: 'select',
          defaultValue: 'glassmorphism',
          options: [
            { label: 'Glassmorphism (Frosted Glass)', value: 'glassmorphism' },
            { label: 'Solid (White with Shadow)', value: 'solid' },
            { label: 'Minimal (No Card)', value: 'minimal' },
          ],
          admin: {
            description: 'Content side card style',
          },
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'comfortable',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Comfortable', value: 'comfortable' },
            { label: 'Spacious', value: 'spacious' },
          ],
          admin: {
            description: 'Vertical spacing between featured models',
          },
        },
        {
          name: 'enableAnimations',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable scroll-triggered staggered reveal animations',
          },
        },
        {
          name: 'mobileLayout',
          type: 'select',
          defaultValue: 'stack',
          options: [
            { label: 'Stack (Media on Top)', value: 'stack' },
            { label: 'Stack (Content on Top)', value: 'stack-reverse' },
            { label: 'Overlay (Content over Media)', value: 'overlay' },
          ],
          admin: {
            description: 'How to display on mobile devices',
          },
        },
      ],
    },
  ],
}
