import type { Block } from 'payload'

export const FindADealer: Block = {
  slug: 'marketing-find-a-dealer',
  labels: {
    singular: '📍 Find a Dealer',
    plural: 'Find a Dealer Blocks',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Find+a+Dealer',
  imageAltText:
    'Simple, elegant call-to-action block for finding authorized Kawai dealers. Features customizable heading, message, and prominent CTA button with multiple theme options.',
  interfaceName: 'MarketingFindADealerBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Find Your Perfect Piano',
      admin: {
        description: 'Main heading text',
        placeholder: 'Find Your Perfect Piano',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      defaultValue: 'Visit an authorized Kawai dealer near you to experience our pianos in person.',
      admin: {
        description: 'Supporting message text',
        placeholder: 'Visit an authorized Kawai dealer near you...',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          required: true,
          defaultValue: 'Find a Dealer',
          admin: {
            description: 'Button text',
            placeholder: 'Find a Dealer',
          },
        },
        {
          name: 'ctaLink',
          type: 'text',
          required: true,
          defaultValue: '/find-a-dealer',
          admin: {
            description: 'Button link/URL',
            placeholder: '/find-a-dealer',
          },
        },
      ],
    },
    {
      name: 'ctaOpenInNewTab',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Open link in new tab',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Red Accent', value: 'red' },
            { label: 'Gold Accent', value: 'gold' },
          ],
          admin: {
            description: 'Visual theme',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          admin: {
            description: 'Content alignment',
          },
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image (subtle overlay will be applied)',
      },
    },
  ],
}
