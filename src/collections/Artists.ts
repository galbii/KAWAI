import type { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isActive', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the artist',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version for routing',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Concert Pianist', value: 'concert-pianist' },
        { label: 'Jazz Musician', value: 'jazz-musician' },
        { label: 'Classical Musician', value: 'classical-musician' },
        { label: 'Contemporary Artist', value: 'contemporary-artist' },
        { label: 'Composer', value: 'composer' },
        { label: 'Educator', value: 'educator' },
        { label: 'Recording Artist', value: 'recording-artist' },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Professional title or designation',
      },
    },
    {
      name: 'biography',
      type: 'richText',
      admin: {
        description: 'Full biography',
      },
    },
    {
      name: 'shortBio',
      type: 'textarea',
      admin: {
        description: 'Brief biography for cards and listings',
      },
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'achievement',
          type: 'text',
          required: true,
        },
        {
          name: 'year',
          type: 'number',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Notable achievements and awards',
      },
    },
    {
      name: 'kawaiRelationship',
      type: 'group',
      fields: [
        {
          name: 'endorsementType',
          type: 'select',
          options: [
            { label: 'Kawai Artist', value: 'kawai-artist' },
            { label: 'Brand Ambassador', value: 'brand-ambassador' },
            { label: 'Recording Artist', value: 'recording-artist' },
            { label: 'Educator', value: 'educator' },
            { label: 'Competition Winner', value: 'competition-winner' },
          ],
          required: true,
        },
        {
          name: 'relationshipSince',
          type: 'number',
          admin: {
            description: 'Year relationship with Kawai began',
          },
        },
        {
          name: 'preferredPianos',
          type: 'array',
          fields: [
            {
              name: 'piano',
              type: 'relationship',
              relationTo: 'pianos',
              required: true,
            },
            {
              name: 'notes',
              type: 'textarea',
            },
          ],
          admin: {
            description: 'Preferred Kawai piano models',
          },
        },
        {
          name: 'testimonial',
          type: 'richText',
          admin: {
            description: 'Testimonial about Kawai pianos',
          },
        },
        {
          name: 'quote',
          type: 'textarea',
          admin: {
            description: 'Short quote for use in marketing',
          },
        },
      ],
    },
    {
      name: 'performances',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'venue',
          type: 'text',
        },
        {
          name: 'date',
          type: 'date',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'recordingUrl',
          type: 'text',
          admin: {
            description: 'URL to recording or video',
          },
        },
      ],
      admin: {
        description: 'Notable performances on Kawai pianos',
      },
    },
    {
      name: 'recordings',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'releaseYear',
          type: 'number',
        },
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'kawaiPiano',
          type: 'relationship',
          relationTo: 'pianos',
          admin: {
            description: 'Kawai piano used for recording',
          },
        },
        {
          name: 'streamingLinks',
          type: 'array',
          fields: [
            {
              name: 'platform',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
      admin: {
        description: 'Recordings made on Kawai pianos',
      },
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'profileImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'gallery',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'videos',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'videoFile',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'youtubeUrl',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'website',
          type: 'text',
        },
        {
          name: 'socialMedia',
          type: 'array',
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'TikTok', value: 'tiktok' },
              ],
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature on main artists page',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this artist on the website',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (if different from name)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma separated)',
          },
        },
      ],
    },
  ],
}