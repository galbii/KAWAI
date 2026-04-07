import type { Block } from 'payload'

export const FeaturedCollections: Block = {
  slug: 'marketing-featured-collections',
  labels: {
    singular: '⭐ Featured Collections',
    plural: 'Featured Collections Sections',
  },
  interfaceName: 'MarketingFeaturedCollectionsBlock',
  fields: [
    // ── Display ────────────────────────────────────────────────────────────────
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'grid',
      required: true,
      options: [
        { label: 'Grid — cards side by side', value: 'grid' },
        { label: 'Carousel — full-screen slideshow', value: 'carousel' },
      ],
      admin: {
        description: 'How collections are displayed on the page',
      },
    },

    // ── Source ─────────────────────────────────────────────────────────────────
    {
      name: 'collectionSource',
      type: 'select',
      defaultValue: 'featured',
      required: true,
      options: [
        { label: 'Featured Collections (auto)', value: 'featured' },
        { label: 'Manual Selection', value: 'manual' },
        { label: 'Filter by Category', value: 'category' },
      ],
      admin: {
        description:
          '"Featured" pulls from the collections marked as featured in CMS, sorted by priority. "Manual" lets you pick specific collections. "Category" filters by piano type.',
      },
    },
    {
      name: 'collections',
      type: 'relationship',
      relationTo: 'collections',
      hasMany: true,
      admin: {
        condition: (_data, siblingData) => siblingData.collectionSource === 'manual',
        description: 'Select the collections to display. Order here is the display order.',
      },
    },
    {
      name: 'categoryFilter',
      type: 'select',
      options: [
        { label: 'Digital Pianos', value: 'digital' },
        { label: 'Grand Pianos', value: 'grand' },
        { label: 'Upright Pianos', value: 'upright' },
        { label: 'Hybrid Pianos', value: 'hybrid' },
        { label: 'Shigeru Kawai', value: 'shigeru' },
      ],
      admin: {
        condition: (_data, siblingData) => siblingData.collectionSource === 'category',
        description: 'Show only collections tagged with this piano category.',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 9,
      min: 2,
      max: 24,
      admin: {
        condition: (_data, siblingData) => siblingData.collectionSource !== 'manual',
        description: 'Maximum number of collections to show (ignored when using manual selection)',
      },
    },

    // ── Filter ────────────────────────────────────────────────────────────────
    {
      name: 'showCategoryFilter',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show a category pill bar (Digital / Grand / Upright / etc.) that lets visitors filter collections client-side.',
      },
    },

    // ── Grid options ───────────────────────────────────────────────────────────
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        condition: (_data, siblingData) => siblingData.displayMode === 'grid',
        description: 'Number of columns on desktop. Always 1 on mobile, 2 on tablet.',
      },
    },

    // ── Content ────────────────────────────────────────────────────────────────
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Kawai Piano',
      admin: { description: 'Small label above the heading (optional)' },
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Featured Collections',
      admin: { description: 'Section heading' },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Explore All',
      admin: { description: 'Link text next to the heading (leave blank to hide)' },
    },
    {
      name: 'ctaHref',
      type: 'text',
      defaultValue: '/pianos',
      admin: { description: 'Destination for the "Explore All" link' },
    },
    {
      name: 'browseCtaText',
      type: 'text',
      defaultValue: 'Browse All Products',
      admin: {
        condition: (_data, siblingData) => siblingData.displayMode === 'grid',
        description: 'Text for the bottom browse button (leave blank to hide)',
      },
    },
    {
      name: 'browseCtaHref',
      type: 'text',
      defaultValue: '/pianos',
      admin: {
        condition: (_data, siblingData) => siblingData.displayMode === 'grid',
        description: 'Destination for the bottom browse button',
      },
    },
  ],
}
