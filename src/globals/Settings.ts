import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'siteUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'defaultSeoImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'businessHours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          required: true,
        },
        {
          name: 'openTime',
          type: 'text',
        },
        {
          name: 'closeTime',
          type: 'text',
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
        },
        {
          name: 'facebookPixelId',
          type: 'text',
        },
      ],
    },
  ],
}