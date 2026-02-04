import type { Block } from 'payload'

export const BottomLeftPopup: Block = {
  slug: 'marketing-bottom-popup',
  labels: {
    singular: '💬 Bottom Popup',
    plural: 'Bottom Popups',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Bottom+Popup',
  imageAltText:
    'Elegant bottom notification popup with Japanese minimalist design. Features glassmorphism, customizable content, auto-show behavior, and smooth animations. Perfect for announcements, promotions, or gentle CTAs.',
  interfaceName: 'MarketingBottomPopupBlock',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable the popup',
      },
    },
    {
      type: 'collapsible',
      label: 'Content',
      admin: {
        initCollapsed: false,
        condition: (data: any) => data.enabled !== false,
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional icon/image (recommended: 48x48px - 64x64px)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Popup title (keep concise)',
            placeholder: 'New Collection Available',
          },
        },
        {
          name: 'message',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Popup message content',
            placeholder: 'Explore our latest piano innovations...',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaText',
              type: 'text',
              admin: {
                description: 'Call-to-action button text (leave empty to hide button)',
                placeholder: 'Learn More',
              },
            },
            {
              name: 'ctaLink',
              type: 'text',
              admin: {
                description: 'CTA button link/URL',
                placeholder: '/pianos/digital',
                condition: (data: any, siblingData: any) => Boolean(siblingData?.ctaText),
              },
            },
          ],
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open CTA link in new tab',
            condition: (data: any, siblingData: any) => Boolean(siblingData?.ctaText),
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Appearance',
      admin: {
        initCollapsed: true,
        condition: (data: any) => data.enabled !== false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'theme',
              type: 'select',
              defaultValue: 'light',
              options: [
                { label: 'Light (Frosted Pearl)', value: 'light' },
                { label: 'Dark (Charcoal Glass)', value: 'dark' },
                { label: 'Red Accent', value: 'red' },
                { label: 'Gold Accent', value: 'gold' },
              ],
              admin: {
                description: 'Visual theme',
              },
            },
            {
              name: 'position',
              type: 'select',
              defaultValue: 'bottom-left',
              options: [
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
              ],
              admin: {
                description: 'Screen position',
              },
            },
          ],
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Compact (280px)', value: 'compact' },
            { label: 'Medium (360px)', value: 'medium' },
            { label: 'Large (420px)', value: 'large' },
          ],
          admin: {
            description: 'Popup width',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Behavior & Timing',
      admin: {
        initCollapsed: true,
        condition: (data: any) => data.enabled !== false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'autoShowDelay',
              type: 'number',
              defaultValue: 3000,
              min: 0,
              max: 30000,
              admin: {
                description: 'Auto-show delay (milliseconds, 0 = immediate)',
                step: 500,
              },
            },
            {
              name: 'autoDismissDelay',
              type: 'number',
              defaultValue: 0,
              min: 0,
              max: 60000,
              admin: {
                description: 'Auto-dismiss delay (milliseconds, 0 = manual only)',
                step: 1000,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showOncePerSession',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Only show once per browser session',
              },
            },
            {
              name: 'dismissible',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Allow users to dismiss manually',
              },
            },
          ],
        },
        {
          name: 'animationStyle',
          type: 'select',
          defaultValue: 'slide',
          options: [
            { label: 'Slide In (Smooth)', value: 'slide' },
            { label: 'Fade In (Subtle)', value: 'fade' },
            { label: 'Spring Bounce (Playful)', value: 'bounce' },
            { label: 'Scale In (Elegant)', value: 'scale' },
          ],
          admin: {
            description: 'Entrance animation',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Advanced Options',
      admin: {
        initCollapsed: true,
        condition: (data: any) => data.enabled !== false,
      },
      fields: [
        {
          name: 'customStorageKey',
          type: 'text',
          admin: {
            description:
              'Custom storage key for session tracking (optional - uses default if empty)',
            placeholder: 'popup-holiday-sale-2026',
          },
        },
        {
          name: 'zIndex',
          type: 'number',
          defaultValue: 9000,
          min: 1000,
          max: 9999,
          admin: {
            description: 'Z-index stacking order',
          },
        },
      ],
    },
  ],
}
