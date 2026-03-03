import type { Block } from 'payload'

export const ArtistHero: Block = {
  slug: 'marketing-artist-hero',
  labels: {
    singular: '🎤 Artist Hero',
    plural: 'Artist Heroes',
  },
  imageAltText: 'Full-screen hero carousel showcasing featured KAWAI artists with smooth transitions.',
  interfaceName: 'MarketingArtistHeroBlock',
  fields: [
    {
      name: 'autoFeatured',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Automatically display all artists marked as "featured" in the Artists collection (recommended)',
      },
    },
    {
      name: 'artists',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      maxRows: 8,
      admin: {
        description: 'Manually select artists to feature in the hero (used when Auto Featured is disabled)',
        condition: (data) => data.autoFeatured === false,
      },
      maxDepth: 2,
    },
    {
      name: 'maxArtists',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 10,
      admin: {
        description: 'Maximum number of artists to display in the hero carousel (1–10)',
      },
    },
    {
      name: 'showScrollIndicator',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the scroll-down indicator at the bottom of the hero',
      },
    },
    {
      name: 'scrollTargetId',
      type: 'text',
      defaultValue: 'artists-grid',
      admin: {
        description: 'ID of the element the scroll indicator should link to (without #)',
        condition: (data) => data.showScrollIndicator !== false,
      },
    },
  ],
}
