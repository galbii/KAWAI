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
      name: 'pageHeading',
      type: 'text',
      defaultValue: 'Experience the Complete Kawai Piano Collection',
      admin: {
        description: 'H1 heading rendered at the top of the piano browser section (used by search engines as the primary page heading)',
      },
    },
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
