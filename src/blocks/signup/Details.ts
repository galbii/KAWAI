import type { Block } from 'payload'

export const SignupDetails: Block = {
  slug: 'signup-details',
  interfaceName: 'SignupDetailsBlock',
  labels: { singular: 'Event Details', plural: 'Event Details' },
  admin: { group: 'Signup' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'What to expect' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'calendar',
          options: [
            { label: 'Calendar', value: 'calendar' },
            { label: 'Clock', value: 'clock' },
            { label: 'Price tag', value: 'price' },
            { label: 'People', value: 'people' },
            { label: 'Location pin', value: 'pin' },
            { label: 'Note', value: 'note' },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
