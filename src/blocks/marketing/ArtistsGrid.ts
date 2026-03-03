import type { Block } from 'payload'

export const ArtistsGrid: Block = {
  slug: 'marketing-artists-grid',
  interfaceName: 'MarketingArtistsGridBlock',
  labels: { singular: 'Artists Grid', plural: 'Artists Grids' },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Artists',
      admin: { description: 'Section heading (default: "Our Artists")' },
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Show the search bar' },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 200,
      min: 1,
      max: 500,
      admin: { description: 'Maximum number of artists to display' },
    },
  ],
}
