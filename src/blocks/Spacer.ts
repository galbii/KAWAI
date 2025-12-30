import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  imageURL: 'https://via.placeholder.com/300x200?text=Spacer',
  imageAltText: 'Spacer block for adding vertical spacing',
  interfaceName: 'SpacerBlock',
  fields: [
    {
      name: 'height',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Extra Small (0.5rem / 8px)', value: 'xs' },
        { label: 'Small (1rem / 16px)', value: 'small' },
        { label: 'Medium (2rem / 32px)', value: 'medium' },
        { label: 'Large (4rem / 64px)', value: 'large' },
        { label: 'Extra Large (6rem / 96px)', value: 'xl' },
      ],
      admin: {
        description: 'Vertical spacing height',
      },
    },
  ],
}
