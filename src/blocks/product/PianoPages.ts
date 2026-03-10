import type { Block } from 'payload'

export const PianoPages: Block = {
  slug: 'product-piano-pages',
  interfaceName: 'ProductPianoPagesBlock',
  labels: {
    singular: 'Piano Pages Browser',
    plural: 'Piano Pages Browsers',
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Piano Category',
      admin: {
        description:
          'Which piano category to display. Products and collections will be pre-filtered to this category.',
      },
      options: [
        { label: 'Grand Pianos', value: 'grand' },
        { label: 'Digital Pianos', value: 'digital' },
        { label: 'Upright Pianos', value: 'upright' },
        { label: 'Hybrid Pianos', value: 'hybrid' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      admin: {
        description:
          'Optional heading displayed above the browser. Leave blank to use no heading.',
        placeholder: 'e.g. Grand Pianos',
      },
    },
    {
      name: 'showCarousel',
      type: 'checkbox',
      label: 'Show Video Carousel Hero',
      defaultValue: true,
      admin: {
        description: 'Display the collection video carousel above the product browser.',
      },
    },
    {
      name: 'carouselHeight',
      type: 'select',
      label: 'Carousel Height',
      defaultValue: 'large',
      admin: {
        condition: (_, siblingData) => siblingData?.showCarousel === true,
        description: 'Height of the video carousel hero section.',
      },
      options: [
        { label: 'Medium (50vh)', value: 'medium' },
        { label: 'Large (70vh)', value: 'large' },
        { label: 'Fullscreen (100vh)', value: 'fullscreen' },
      ],
    },
    {
      name: 'carouselAutoplayInterval',
      type: 'number',
      label: 'Carousel Autoplay Interval (ms)',
      defaultValue: 6000,
      min: 2000,
      max: 30000,
      admin: {
        condition: (_, siblingData) => siblingData?.showCarousel === true,
        description:
          'Milliseconds between automatic slide transitions. Min 2000, max 30000.',
        step: 500,
      },
    },
  ],
}
