import type { Block } from 'payload'

export const PianosBrowser: Block = {
  slug: 'marketing-pianos-browser',
  labels: {
    singular: '🎹 Pianos Browser',
    plural: 'Pianos Browser Sections',
  },
  interfaceName: 'MarketingPianosBrowserBlock',
  fields: [
    {
      name: 'showNewsCarousel',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the product spotlight news carousel above the piano browser',
      },
    },
  ],
}
