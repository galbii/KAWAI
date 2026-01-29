import type { Block } from 'payload'

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
        { label: 'YouTube', value: 'youtube' },
        { label: 'Direct Video File (MP4)', value: 'direct' },
      ],
      admin: {
        description: 'Choose video source type',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: {
        description:
          'YouTube video URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ)',
        placeholder: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        condition: (data: any) => !data.videoSource || data.videoSource === 'youtube',
      },
      validate: (value: string | null | undefined, { data }: { data: any }) => {
        const isYouTube = !data.videoSource || data.videoSource === 'youtube'
        if (isYouTube && !value) {
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
        condition: (data: any) => data.videoSource === 'direct',
      },
      validate: (value: string | null | undefined, { data }: { data: any }) => {
        if (data.videoSource === 'direct' && !value) {
          return 'Video URL is required when using direct video file'
        }
        return true
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
  ],
}
