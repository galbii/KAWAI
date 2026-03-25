import type { Block } from 'payload'

export const ContentCta: Block = {
  slug: 'content-cta',
  labels: {
    singular: '🔗 Content CTA',
    plural: 'Content CTAs',
  },
  imageAltText: 'Inline call-to-action with 1 or 2 buttons for blog posts and editorial content',
  interfaceName: 'ContentCtaBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional short heading displayed above the buttons',
      },
    },
    {
      name: 'subtext',
      type: 'textarea',
      admin: {
        description: 'Optional supporting text displayed below the heading',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left-aligned' },
        { label: 'Card (light background)', value: 'card' },
      ],
      admin: {
        description: 'Layout style for the CTA block',
      },
    },
    {
      name: 'links',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      required: true,
      admin: {
        description: 'Add 1 or 2 CTA buttons',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Button label text',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Button destination URL (e.g. /pianos or https://example.com)',
          },
        },
        {
          name: 'variant',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (filled)', value: 'primary' },
            { label: 'Secondary (outlined)', value: 'secondary' },
            { label: 'Ghost (text only)', value: 'ghost' },
          ],
          admin: {
            description: 'Visual style of the button',
          },
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'red',
          options: [
            { label: 'Red (KAWAI)', value: 'red' },
            { label: 'Black', value: 'black' },
            { label: 'White', value: 'white' },
            { label: 'Gold', value: 'gold' },
          ],
          admin: {
            description: 'Button color — applies to filled background (primary) or text/border (secondary/ghost)',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in a new browser tab',
          },
        },
      ],
    },
  ],
}
