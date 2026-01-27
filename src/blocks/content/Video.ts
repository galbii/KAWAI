import type { Block } from 'payload'

export const Video: Block = {
  slug: 'content-video',
  labels: {
    singular: '🎥 Video',
    plural: 'Videos',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Video',
  imageAltText: 'Embed videos from YouTube, Vimeo, or upload video files',
  interfaceName: 'ContentVideoBlock',
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
        description: 'Choose video source type',
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 0, // Prevent deep media fetching
      admin: {
        description: 'Upload a video file from your computer',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'Paste YouTube or Vimeo video URL',
        condition: (data, siblingData) =>
          siblingData?.source === 'youtube' || siblingData?.source === 'vimeo',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 0, // Prevent deep media fetching
      admin: {
        description: 'Thumbnail image shown before video plays (optional)',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'controls',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show video player controls (play, pause, volume, etc.)',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Autoplay video on page load (video will be muted)',
        condition: (data, siblingData) => siblingData?.source === 'upload',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Loop video playback continuously',
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
