import type { Block } from 'payload'

export const DealerFinder: Block = {
  slug: 'marketing-dealer-finder',
  labels: {
    singular: '🗺️ Dealer Finder',
    plural: 'Dealer Finder Blocks',
  },
  imageAltText:
    'Full-screen interactive dealer finder with map, list, search, and filters. Shows all authorized Kawai dealers.',
  interfaceName: 'MarketingDealerFinderBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Authorized Dealers',
      admin: {
        description: 'Heading shown in the dealer list panel',
        placeholder: 'Our Authorized Dealers',
      },
    },
  ],
}
