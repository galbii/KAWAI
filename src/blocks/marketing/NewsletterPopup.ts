import type { Block } from 'payload'
import { trackingField } from '@/lib/payload/fields/tracking'

export const NewsletterPopup: Block = {
  slug: 'marketing-newsletter-popup',
  labels: {
    singular: '📧 Newsletter Popup',
    plural: 'Newsletter Popup Blocks',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Newsletter+Popup',
  imageAltText: 'Newsletter popup modal for email capture',
  interfaceName: 'MarketingNewsletterPopupBlock',
  fields: [
    // ─── Content ────────────────────────────────────────────────────────────
    {
      name: 'content',
      type: 'group',
      admin: { description: 'Text displayed inside the popup modal' },
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Stay in Tune',
          admin: { description: 'Main headline' },
        },
        {
          name: 'subheading',
          type: 'text',
          defaultValue:
            'Be the first to hear about new models, exclusive events, and special offers from Kawai.',
          admin: { description: 'Supporting text below the headline' },
        },
        {
          name: 'privacyText',
          type: 'text',
          defaultValue: 'We respect your privacy. Unsubscribe anytime.',
          admin: { description: 'Privacy / trust note shown beneath the submit button' },
        },
        {
          name: 'successHeading',
          type: 'text',
          defaultValue: "You're subscribed!",
          admin: { description: 'Heading shown after successful signup' },
        },
        {
          name: 'successMessage',
          type: 'text',
          defaultValue:
            'Thank you for joining the Kawai community. Watch your inbox for updates.',
          admin: { description: 'Body text shown after successful signup' },
        },
      ],
    },

    // ─── Form Configuration ──────────────────────────────────────────────────
    {
      name: 'form',
      type: 'group',
      admin: { description: 'Form fields and Shopify tagging' },
      fields: [
        {
          name: 'showFirstName',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Show a First Name input field' },
        },
        {
          name: 'firstNameRequired',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make First Name required',
            condition: (_, siblingData) => Boolean(siblingData?.showFirstName),
          },
        },
        {
          name: 'showLastName',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show a Last Name input field' },
        },
        {
          name: 'lastNameRequired',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make Last Name required',
            condition: (_, siblingData) => Boolean(siblingData?.showLastName),
          },
        },
        {
          name: 'emailPlaceholder',
          type: 'text',
          defaultValue: 'your@email.com',
          admin: { description: 'Placeholder text for the email input' },
        },
        {
          name: 'submitText',
          type: 'text',
          defaultValue: 'Subscribe',
          admin: { description: 'Label for the submit button' },
        },
        {
          name: 'customTags',
          type: 'text',
          admin: {
            description:
              "Comma-separated tags added to the Shopify customer. 'newsletter' and 'source-newsletter-popup' are always included.",
            placeholder: 'e.g. vip, summer-promo, grand-interest',
          },
        },
      ],
    },

    // ─── Behavior ────────────────────────────────────────────────────────────
    {
      name: 'behavior',
      type: 'group',
      admin: { description: 'When and how the popup appears' },
      fields: [
        {
          name: 'autoShowDelay',
          type: 'number',
          defaultValue: 4000,
          min: 0,
          admin: {
            description: 'Milliseconds after page load before the popup appears (0 = immediate)',
          },
        },
        {
          name: 'triggerOnScroll',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description:
              'Also show popup when visitor scrolls 30% down the page (whichever comes first)',
          },
        },
        {
          name: 'showOncePerSession',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description:
              'Store a flag in localStorage so the popup only shows once per browser session',
          },
        },
        {
          name: 'storageKey',
          type: 'text',
          admin: {
            description:
              'Override the localStorage key used to remember dismissal. Leave blank for the default key.',
            placeholder: 'kawai-newsletter-popup-shown',
          },
        },
      ],
    },

    // ─── Appearance ──────────────────────────────────────────────────────────
    {
      name: 'appearance',
      type: 'group',
      admin: { description: 'Visual style of the popup' },
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: '☀️ Light (Pearl)', value: 'light' },
            { label: '🌙 Dark (Kawai Black)', value: 'dark' },
            { label: '🔴 Red (Kawai Red)', value: 'red' },
          ],
          admin: { description: 'Color scheme for the popup' },
        },
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'Small (360px)', value: 'sm' },
            { label: 'Medium (480px)', value: 'md' },
            { label: 'Large (560px)', value: 'lg' },
          ],
          admin: { description: 'Maximum width of the popup modal' },
        },
      ],
    },

    // ─── Analytics & Tracking ────────────────────────────────────────────────
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
              { label: 'Lead Generation', value: 'lead' },
              { label: 'Engagement', value: 'engagement' },
              { label: 'Conversion', value: 'conversion' },
            ],
          },
          {
            name: 'conversionValue',
            type: 'number',
            defaultValue: 15,
            admin: {
              description: 'Estimated value of a newsletter signup (USD)',
            },
          },
        ],
      },
    }),
  ],
}
