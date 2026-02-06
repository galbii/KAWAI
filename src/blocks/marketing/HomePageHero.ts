import type { Block } from 'payload'
import { videoField } from '@/lib/payload/fields/media'

export const HomePageHero: Block = {
  slug: 'marketing-homepage-hero',
  labels: {
    singular: '🏠 HomePage Hero',
    plural: 'HomePage Hero Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=HomePage+Hero',
  imageAltText: 'Full-screen hero with video background, location, title split, CTAs',
  interfaceName: 'MarketingHomePageHeroBlock',
  fields: [
    {
      name: 'locationText',
      type: 'text',
      defaultValue: "St. Louis's Premier Piano Gallery",
      admin: { description: 'Location/Piano Gallery status text (optional - leave empty to hide)' },
    },
    {
      name: 'establishedText',
      type: 'text',
      defaultValue: 'Est. 1927 • Lake St. Louis, Missouri',
      admin: { description: 'Establishment year and location' },
    },
    {
      name: 'titlePrefix',
      type: 'text',
      defaultValue: 'The',
      admin: { description: 'First part of the title (e.g., "The")' },
    },
    {
      name: 'titleMain',
      type: 'text',
      defaultValue: 'INSTRUMENTAL',
      admin: { description: 'Main emphasized part of the title' },
    },
    {
      name: 'titleSuffix',
      type: 'text',
      defaultValue: 'to Life',
      admin: { description: 'Final part of the title' },
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Every musician harbors a vision. Every performance seeks perfection. At Kawai Piano Gallery, we understand that finding the right piano is a deeply personal journey. With nearly a century of expertise, we guide you to the instrument that resonates with your soul and elevates your artistry.',
      admin: { description: 'Hero description text' },
    },
    {
      name: 'primaryCta',
      type: 'group',
      admin: { description: 'Primary call-to-action button' },
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: 'View Our Piano Collection',
        },
        { name: 'link', type: 'text', defaultValue: '/pianos' },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      admin: { description: 'Secondary call-to-action button' },
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Visit Our St. Louis Piano Gallery',
        },
        { name: 'link', type: 'text', defaultValue: '/contact' },
      ],
    },
    videoField('backgroundVideo', { required: false }),
  ],
}
