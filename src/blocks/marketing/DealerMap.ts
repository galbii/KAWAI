import type { Block } from 'payload'

export const DealerMap: Block = {
  slug: 'marketing-dealer-map',
  labels: {
    singular: '🗺️ Dealer Map',
    plural: 'Dealer Map Blocks',
  },
  imageAltText:
    'Full-screen interactive dealer finder with map, search bar, radius picker, dealer-type filter, country filter, and list/split view toggle. Renders all authorized Kawai dealers and storefronts.',
  interfaceName: 'MarketingDealerMapBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description:
          'Optional H1 shown in the control bar. Leave blank to use the default ("Find an Authorized Kawai Dealer Near You").',
        placeholder: 'Find an Authorized Kawai Dealer Near You',
      },
    },
  ],
}
