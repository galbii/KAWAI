import type { Block } from 'payload'

export const ArtistI2L: Block = {
  slug: 'marketing-artist-i2l',
  labels: {
    singular: '🎹 Artist I2L',
    plural: 'Artist I2L Sections',
  },
  interfaceName: 'MarketingArtistI2LBlock',
  fields: [
    {
      name: 'sectionLabel',
      type: 'text',
      defaultValue: 'Instrumental To Life',
      admin: { description: 'Small eyebrow label (e.g. "Instrumental To Life")' },
    },
    {
      name: 'heading',
      type: 'text',
      admin: { description: 'Large heading displayed bottom-left (optional)' },
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: { description: 'Supporting text below the heading (optional)' },
    },
    {
      name: 'videos',
      type: 'array',
      labels: { singular: 'Video', plural: 'Videos' },
      maxRows: 20,
      admin: {
        description: 'Manually curated videos shown first. Artist recent work is appended automatically after these.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { placeholder: 'Chopin Nocturne — Live at Carnegie Hall' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { placeholder: 'Brief description of the performance...' },
        },
        {
          name: 'youtubeUrl',
          type: 'text',
          required: true,
          admin: {
            description: 'Full YouTube video URL',
            placeholder: 'https://www.youtube.com/watch?v=...',
          },
        },
        {
          name: 'eyebrowText',
          type: 'text',
          admin: { placeholder: 'Live Performance' },
        },
        {
          name: 'ctaText',
          type: 'text',
          admin: { placeholder: 'Watch Full Performance' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          admin: { placeholder: '/artists/artist-slug' },
        },
        {
          name: 'ctaOpenInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'showArtistVideos',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Automatically append YouTube videos from all active artist Recent Work fields, sorted by most recent' },
    },
    {
      name: 'maxArtistVideos',
      type: 'number',
      defaultValue: 30,
      min: 1,
      max: 100,
      admin: {
        description: 'Cap on artist videos to pull (sorted newest first)',
        condition: (_data, siblingData) => siblingData?.showArtistVideos === true,
      },
    },
    {
      name: 'initialVisible',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: { description: 'How many thumbnails to show before the "+ More" expand button (default 3)' },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
      admin: { description: 'Section color theme' },
    },
  ],
}
