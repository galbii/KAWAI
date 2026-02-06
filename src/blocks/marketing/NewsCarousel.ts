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
      defaultValue: 7000,
      admin: { description: 'Auto-play duration in milliseconds (7000 = 7 seconds)' },
    },
    {
      name: 'newsItems',
      type: 'array',
      required: true,
      admin: { description: 'Carousel news items' },
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
      ],
      defaultValue: [
        {
          title: 'New CA901 Digital Piano Now Available',
          description:
            'Experience the latest in digital piano technology with our newest arrival.',
          category: 'new-arrivals',
          link: '/products/ca901',
        },
        {
          title: 'Spring Piano Sale - Save Up To 20%',
          description:
            'Limited time offer on select Kawai piano models. Visit our showroom today!',
          category: 'promotions',
          link: '/contact',
        },
        {
          title: 'Piano Lessons Starting This Month',
          description:
            'Professional instruction available for all skill levels. Enroll now!',
          category: 'education',
          link: '/contact',
        },
      ],
    },
  ],
}
