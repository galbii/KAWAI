import type { Block } from 'payload'

export const BrandIntro: Block = {
  slug: 'marketing-brand-intro',
  labels: {
    singular: '🎹 Brand Intro',
    plural: 'Brand Intros',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Kawai+Brand+Intro',
  imageAltText:
    'Full-screen brand intro overlay with Kawai logo and "Instrumental to Life" tagline. Elegant fade-in/fade-out animation that plays before revealing page content. Perfect for homepage hero moments.',
  interfaceName: 'MarketingBrandIntroBlock',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable the brand intro animation',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Kawai logo image (optional - uses default if not provided)',
        condition: (data: any) => data.enabled !== false,
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Instrumental to Life',
      admin: {
        description: 'Brand tagline text',
        placeholder: 'Instrumental to Life',
        condition: (data: any) => data.enabled !== false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'black',
          options: [
            { label: 'Black', value: 'black' },
            { label: 'Kawai Black', value: 'kawai-black' },
            { label: 'Kawai Charcoal', value: 'kawai-charcoal' },
            { label: 'White', value: 'white' },
          ],
          admin: {
            description: 'Background color for the intro overlay',
            condition: (data: any) => data.enabled !== false,
          },
        },
        {
          name: 'logoSize',
          type: 'select',
          defaultValue: 'large',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xlarge' },
          ],
          admin: {
            description: 'Size of the logo',
            condition: (data: any) => data.enabled !== false,
          },
        },
      ],
    },
    {
      name: 'timing',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'fadeInDuration',
              type: 'number',
              defaultValue: 800,
              min: 200,
              max: 3000,
              admin: {
                description: 'Fade in duration (milliseconds)',
                step: 100,
              },
            },
            {
              name: 'displayDuration',
              type: 'number',
              defaultValue: 2000,
              min: 500,
              max: 10000,
              admin: {
                description: 'Display duration (milliseconds)',
                step: 100,
              },
            },
            {
              name: 'fadeOutDuration',
              type: 'number',
              defaultValue: 800,
              min: 200,
              max: 3000,
              admin: {
                description: 'Fade out duration (milliseconds)',
                step: 100,
              },
            },
          ],
        },
      ],
      admin: {
        description: 'Animation timing configuration',
        condition: (data: any) => data.enabled !== false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showOncePerSession',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Only show once per browser session (uses sessionStorage)',
            condition: (data: any) => data.enabled !== false,
          },
        },
        {
          name: 'allowSkip',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow users to skip the animation by clicking',
            condition: (data: any) => data.enabled !== false,
          },
        },
      ],
    },
  ],
}
