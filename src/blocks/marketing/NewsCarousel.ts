import type { Block } from 'payload'
import { imageField, videoField } from '@/lib/payload/fields/media'

export const NewsCarousel: Block = {
  slug: 'marketing-news-carousel',
  labels: {
    singular: '📰 News Carousel',
    plural: 'News Carousel Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=News+Carousel',
  imageAltText: 'Rotating news and updates carousel',
  interfaceName: 'MarketingNewsCarouselBlock',
  fields: [
    {
      name: 'autoPlayDuration',
      type: 'number',
      admin: {
        description: 'Auto-play duration in milliseconds (leave empty to use Homepage tab setting, default: 7000ms)',
      },
    },
    {
      name: 'newsItems',
      type: 'array',
      admin: {
        description: 'Additional news items (will be added to Homepage news items automatically)',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        imageField('image', { required: false }),
        videoField('backgroundVideo', {
          required: false,
          admin: {
            description: 'Self-hosted video file (webm/mp4) as slide background. Overrides image. Use instead of YouTube URL for uploaded video.',
            condition: (_data: any, siblingData: any) => !siblingData?.videoUrl,
          },
        }),
        {
          name: 'category',
          type: 'select',
          required: true,
          options: [
            { label: '📰 News', value: 'news' },
            { label: '📅 Events', value: 'events' },
            { label: '🎉 Promotions', value: 'promotions' },
            { label: '✨ New Arrivals', value: 'new-arrivals' },
            { label: '📚 Education', value: 'education' },
          ],
          defaultValue: 'news',
        },
        {
          name: 'link',
          type: 'text',
          admin: { description: 'Optional link for this news item' },
        },
        {
          name: 'ctaText',
          type: 'text',
          admin: { description: 'Button label (default: "Read Full Story")' },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description:
              'YouTube video URL to use as this slide\'s background (e.g., https://youtube.com/watch?v=...). When set, overrides the image.',
            placeholder: 'https://www.youtube.com/watch?v=...',
          },
        },
        {
          name: 'youtubeZoom',
          type: 'number',
          required: false,
          defaultValue: 1.15,
          min: 1.0,
          max: 2.5,
          admin: {
            description:
              'Zoom level for YouTube background (1.0 = no zoom, 1.15 = default — crops YouTube UI from edges). Only applies when YouTube URL is set.',
            step: 0.05,
            condition: (_data: any, siblingData: any) => Boolean(siblingData?.videoUrl),
          },
        },
      ],
    },
  ],
}
