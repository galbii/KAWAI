import type { Block } from 'payload'

export const StorefrontLocations: Block = {
  slug: 'marketing-storefront-locations',
  labels: {
    singular: '📍 Storefront Locations',
    plural: 'Storefront Locations Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Storefront+Locations',
  imageAltText: 'Automatic storefront locations grid with customizable heading and CTA',
  interfaceName: 'MarketingStorefrontLocationsBlock',
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      defaultValue: 'Our Locations',
      admin: {
        description: 'Small label text above the description (e.g., "Our Locations")',
      },
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      defaultValue:
        'Visit our Kawai Showrooms and experience our complete collection of acoustic and digital pianos with expert consultation.',
      admin: {
        description: 'Description text below the section label',
      },
    },
    {
      name: 'ctaSubheading',
      type: 'text',
      defaultValue: "Can't find a location near you?",
      admin: {
        description: 'Text above the CTA button',
      },
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      required: true,
      defaultValue: 'Find Your Perfect Piano',
      admin: {
        description: 'CTA button text',
      },
    },
    {
      name: 'ctaButtonLink',
      type: 'text',
      required: true,
      defaultValue: '/piano-finder',
      admin: {
        description: 'CTA button destination URL',
      },
    },
  ],
}
