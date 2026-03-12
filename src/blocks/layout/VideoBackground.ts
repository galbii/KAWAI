import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'
import { ctaTrackingField, videoTrackingField } from '@/lib/payload/fields/tracking'

export const VideoBackground: Block = {
  slug: 'layout-video-background',
  labels: {
    singular: '🎬 Video Background',
    plural: 'Video Backgrounds',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Video+Background+Hero',
  imageAltText:
    'Full-screen video background block with glassmorphism sidebar overlay. Perfect for impactful hero sections with ambient video backgrounds. Includes heading, subheading, description, and call-to-action button with customizable positioning.',
  interfaceName: 'LayoutVideoBackgroundBlock',
  fields: [
    {
      name: 'videoSource',
      type: 'select',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube Video', value: 'youtube' },
        { label: 'Direct Video File (MP4)', value: 'direct' },
        { label: 'Image', value: 'image' },
      ],
      admin: {
        description: 'Choose background media type',
      },
    },
    imageField('backgroundImage', {
      required: false,
      admin: {
        description: 'Background image from media library (recommended: 1920x1080 or higher). Click "Browse Media Library" to select from existing images or upload new ones.',
        condition: (_, siblingData) => siblingData?.videoSource === 'image',
      },
    }),
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        description:
          'YouTube video URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ)',
        placeholder: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        condition: (_, siblingData) => siblingData?.videoSource === 'youtube',
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
        if (siblingData?.videoSource === 'youtube' && !value) {
          return 'YouTube URL is required when using YouTube as video source'
        }
        return true
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description:
          'Direct URL to MP4 video file (use R2/CDN URL for best performance). Recommended: 1920x1080, H.264 codec, under 10MB.',
        placeholder: 'https://cdn.example.com/videos/piano-craftsmanship.mp4',
        condition: (_, siblingData) => siblingData?.videoSource === 'direct',
      },
      validate: (value: string | null | undefined, { siblingData }: { siblingData: any }) => {
        if (siblingData?.videoSource === 'direct' && !value) {
          return 'Video URL is required when using direct video file'
        }
        return true
      },
    },
    {
      name: 'videoZoom',
      type: 'number',
      min: 100,
      max: 150,
      defaultValue: 100,
      admin: {
        description: 'Video/Image zoom percentage (100 = no zoom, 110 = 10% zoom, 120 = 20% zoom)',
        step: 5,
        condition: (_, siblingData) =>
          siblingData?.videoSource === 'youtube' ||
          siblingData?.videoSource === 'direct' ||
          siblingData?.videoSource === 'image',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sidebarPosition',
          type: 'select',
          defaultValue: 'left',
          required: true,
          options: [
            { label: 'Left Side', value: 'left' },
            { label: 'Right Side', value: 'right' },
          ],
          admin: {
            description: 'Position of the glassmorphism content sidebar',
          },
        },
        {
          name: 'sidebarHeight',
          type: 'select',
          defaultValue: 'centered',
          required: true,
          options: [
            { label: 'Centered Content', value: 'centered' },
            { label: 'Full Height', value: 'full' },
          ],
          admin: {
            description: 'Sidebar height: centered vertically or spans full screen height',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 0.4,
          required: true,
          admin: {
            description:
              'Overlay darkness (0 = transparent, 1 = fully dark). Adjust for video brightness/readability.',
            step: 0.05,
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Styling Options',
      admin: {
        initCollapsed: true,
        description: 'Customize colors and decorative elements',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'subheadingColor',
              type: 'select',
              defaultValue: 'gold',
              options: [
                { label: 'Kawai Gold', value: 'gold' },
                { label: 'Kawai Red', value: 'red' },
                { label: 'White', value: 'white' },
                { label: 'Pearl (Light Gray)', value: 'pearl' },
              ],
              admin: {
                description: 'Color of the small uppercase subheading text',
              },
            },
            {
              name: 'accentLineStyle',
              type: 'select',
              defaultValue: 'gold-red',
              options: [
                { label: 'Gold to Red Gradient', value: 'gold-red' },
                { label: 'Red to Gold Gradient', value: 'red-gold' },
                { label: 'Gold Only', value: 'gold' },
                { label: 'Red Only', value: 'red' },
                { label: 'White', value: 'white' },
                { label: 'None (Hide Lines)', value: 'none' },
              ],
              admin: {
                description: 'Style of decorative corner accent lines',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'subheading',
      type: 'text',
      admin: {
        description: 'Small uppercase label above main heading (e.g., "Introducing", "Discover")',
        placeholder: 'Crafted in Japan',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main headline - large, prominent serif typography',
        placeholder: 'Experience the Art of Piano Craftsmanship',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Supporting paragraph text below heading (2-3 sentences recommended)',
        placeholder:
          'Discover how Japanese precision and musical passion unite to create instruments that inspire generations of pianists.',
      },
    },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Learn More',
              admin: {
                description: 'Primary button text',
                placeholder: 'Explore Our Collection',
              },
            },
            {
              name: 'link',
              type: 'text',
              defaultValue: '#',
              admin: {
                description: 'Button destination URL',
                placeholder: '/pianos/grand',
              },
            },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in a new browser tab',
          },
        },
      ],
      admin: {
        description: 'Primary call-to-action button (filled style)',
      },
    },
    {
      name: 'secondaryCta',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show secondary CTA button',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'text',
              type: 'text',
              admin: {
                description: 'Secondary button text',
                placeholder: 'Watch Video',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'Button destination URL',
                placeholder: '/videos/demo',
                condition: (data, siblingData) => siblingData?.enabled === true,
              },
            },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in a new browser tab',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
      admin: {
        description: 'Optional secondary call-to-action button (outline style)',
      },
    },
    ctaTrackingField(),
    {
      name: 'showScrollIndicator',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show scroll indicator at bottom of video (animated chevron)',
      },
    },
    videoTrackingField(),
  ],
}
