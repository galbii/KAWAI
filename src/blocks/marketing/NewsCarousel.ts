import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields/media'

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
      ],
    },
  ],
}
