import type { Block } from 'payload'

export const BlogGrid: Block = {
  slug: 'marketing-blog-grid',
  interfaceName: 'MarketingBlogGridBlock',
  labels: {
    singular: 'Blog Grid',
    plural: 'Blog Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'The KAWAI Journal',
      admin: {
        description: 'Section heading displayed above the blog grid',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Optional subtitle displayed below the heading',
        placeholder: 'Notes on craft, artistry, and the enduring world of the piano',
      },
    },
    {
      name: 'postLimit',
      type: 'number',
      min: 3,
      max: 12,
      defaultValue: 6,
      admin: {
        description: 'Number of posts to show in the grid (not counting the featured post)',
        step: 1,
      },
    },
    {
      name: 'showFeatured',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the featured post as a large hero card above the grid',
      },
    },
    {
      name: 'showHeading',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show the heading and tagline section',
      },
    },
  ],
}
