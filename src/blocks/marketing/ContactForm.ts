import type { Block } from 'payload'
import { trackingField } from '@/lib/payload/fields/tracking'

export const ContactForm: Block = {
  slug: 'marketing-contact-form',
  labels: {
    singular: '📝 Contact Form',
    plural: 'Contact Form Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Contact+Form',
  imageAltText: 'Multi-step contact and assessment form',
  interfaceName: 'MarketingContactFormBlock',
  fields: [
    {
      name: 'contactTitle',
      type: 'text',
      defaultValue: 'Find Your Perfect',
      admin: { description: 'First part of the title' },
    },
    {
      name: 'contactTitleHighlight',
      type: 'text',
      defaultValue: 'Piano',
      admin: { description: 'Highlighted part of the title' },
    },
    {
      name: 'contactDescription',
      type: 'textarea',
      defaultValue:
        'Answer a few quick questions to help us understand your needs and preferences. Our piano experts will guide you to the perfect instrument for your musical journey.',
      admin: { description: 'Form introduction text' },
    },
    {
      name: 'stepTitles',
      type: 'array',
      admin: { description: 'Step titles for the multi-step form' },
      fields: [{ name: 'step', type: 'text', required: true }],
      defaultValue: [
        { step: 'Experience Level' },
        { step: 'Piano Type' },
        { step: 'Budget & Use' },
        { step: 'Your Information' },
      ],
    },
    {
      name: 'trustMessage',
      type: 'text',
      defaultValue:
        "We respect your privacy. Your information is secure and won't be shared.",
      admin: { description: 'Trust/privacy message below form' },
    },
    {
      name: 'benefits',
      type: 'array',
      admin: { description: 'Benefits/features list' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: '🛡️ Shield Check', value: 'shield-check' },
            { label: '🕐 Clock', value: 'clock' },
            { label: '👥 Users', value: 'users' },
            { label: '🏆 Award', value: 'award' },
            { label: '🎵 Music', value: 'music' },
            { label: '❤️ Heart', value: 'heart' },
          ],
        },
        { name: 'text', type: 'text', required: true },
      ],
      defaultValue: [
        { icon: 'shield-check', text: 'Expert Guidance' },
        { icon: 'clock', text: 'Fast Response' },
        { icon: 'award', text: 'Nearly 100 Years of Excellence' },
      ],
    },
    {
      name: 'formOptions',
      type: 'group',
      admin: { description: 'Form dropdown and selection options' },
      fields: [
        {
          name: 'experienceLevels',
          type: 'array',
          fields: [{ name: 'level', type: 'text', required: true }],
          defaultValue: [
            { level: 'Beginner' },
            { level: 'Intermediate' },
            { level: 'Advanced' },
            { level: 'Professional' },
          ],
        },
        {
          name: 'pianoTypes',
          type: 'array',
          fields: [{ name: 'type', type: 'text', required: true }],
          defaultValue: [
            { type: 'Digital Piano' },
            { type: 'Grand Piano' },
            { type: 'Upright Piano' },
            { type: 'Hybrid Piano' },
            { type: "Not Sure - I'd Like Guidance" },
          ],
        },
        {
          name: 'budgetRanges',
          type: 'array',
          fields: [{ name: 'range', type: 'text', required: true }],
          defaultValue: [
            { range: 'Under $3,000' },
            { range: '$3,000 - $7,000' },
            { range: '$7,000 - $15,000' },
            { range: '$15,000 - $30,000' },
            { range: 'Over $30,000' },
            { range: 'Flexible' },
          ],
        },
        {
          name: 'primaryUses',
          type: 'array',
          fields: [{ name: 'use', type: 'text', required: true }],
          defaultValue: [
            { use: 'Personal Practice' },
            { use: 'Teaching' },
            { use: 'Performance' },
            { use: 'Recording/Studio' },
            { use: 'Church/Institution' },
            { use: 'Gift' },
          ],
        },
      ],
    },

    // Analytics & Tracking
    trackingField({
      defaultEnabled: true,
      showAdvanced: false,
      overrides: {
        fields: [
          {
            name: 'category',
            type: 'select',
            defaultValue: 'lead',
            options: [
              { label: 'Engagement', value: 'engagement' },
              { label: 'Conversion', value: 'conversion' },
              { label: 'Lead Generation', value: 'lead' },
            ],
          },
          {
            name: 'conversionValue',
            type: 'number',
            defaultValue: 100,
            admin: {
              description: 'Estimated dollar value of form submission',
            },
          },
        ],
      },
    }),
  ],
}
