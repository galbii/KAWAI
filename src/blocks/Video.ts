import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  imageURL: 'https://via.placeholder.com/300x200?text=Video',
  imageAltText: 'Video block for embedded videos',
  interfaceName: 'VideoBlock',
  fields: [
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'upload',
      options: [
        { label: 'Upload Video File', value: 'upload' },
        { label: 'YouTube URL', value: 'youtube' },
        { label: 'Vimeo URL', value: 'vimeo' },
      ],
      admin: {
        description: 'Video source type',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a video file',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'YouTube or Vimeo video URL',
        condition: (data, siblingData) =>
          siblingData?.source === 'youtube' || siblingData?.source === 'vimeo',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Thumbnail image shown before video plays',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show video player controls',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Autoplay video on page load (muted)',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Loop video playback',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption displayed below the video',
      },
    },
  ],
}
