import type { Block } from 'payload'
import { trackingField } from '@/lib/payload/fields/tracking'

/**
 * Calendly Embed Block
 *
 * Inline Calendly booking widget embedded directly on the page.
 * Includes comprehensive tracking (Meta Pixel, GA4, PostHog) and
 * automatic Constant Contact lead capture.
 *
 * Features:
 * - Inline InlineWidget display
 * - Customizable height and styling
 * - Automatic event tracking on booking completion
 * - Non-blocking Constant Contact submission
 * - UTM parameter support
 *
 * @see src/components/blocks/CalendlyEmbedBlock.tsx
 * @see src/hooks/useCalendlyTracking.ts
 */
export const CalendlyEmbed: Block = {
  slug: 'layout-calendly-embed',
  labels: {
    singular: '📅 Calendly Embed',
    plural: 'Calendly Embeds',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Calendly+Embed',
  imageAltText: 'Inline Calendly booking widget with tracking and CRM integration',
  interfaceName: 'LayoutCalendlyEmbedBlock',
  fields: [
    // ========================================================================
    // Content Section
    // ========================================================================
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        description: 'Main heading above the widget (optional)',
        placeholder: 'Book your appointment',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: {
        description: 'Supporting text below the heading (optional)',
        placeholder: 'Book a time that works best for you',
      },
    },

    // ========================================================================
    // Calendly Settings
    // ========================================================================
    {
      name: 'calendlyUrl',
      type: 'text',
      label: 'Calendly Event URL',
      required: true,
      admin: {
        description: 'Full Calendly event URL (e.g., https://calendly.com/your-org/event-name)',
        placeholder: 'https://calendly.com/kawaipianogallery/consultation',
      },
    },
    {
      name: 'widgetHeight',
      type: 'select',
      label: 'Widget Height',
      defaultValue: '700',
      options: [
        { label: '600px (Compact)', value: '600' },
        { label: '700px (Standard)', value: '700' },
        { label: '800px (Tall)', value: '800' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Height of the embedded widget',
      },
    },
    {
      name: 'customHeight',
      type: 'number',
      label: 'Custom Height (px)',
      admin: {
        description: 'Custom height in pixels',
        placeholder: '750',
        condition: (data, siblingData) => siblingData?.widgetHeight === 'custom',
      },
    },

    // ========================================================================
    // Styling
    // ========================================================================
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'transparent',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark Gray', value: 'dark-gray' },
        { label: 'Brand Red', value: 'brand-red' },
      ],
      admin: {
        description: 'Background color for the entire block section',
      },
    },
    {
      name: 'padding',
      type: 'select',
      label: 'Padding',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small (1rem)', value: 'small' },
        { label: 'Medium (2rem)', value: 'medium' },
        { label: 'Large (4rem)', value: 'large' },
      ],
      admin: {
        description: 'Vertical spacing around the block',
      },
    },
    {
      name: 'textAlignment',
      type: 'select',
      label: 'Text Alignment',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Alignment for heading and subheading',
      },
    },

    // ========================================================================
    // Analytics & Tracking (Booking Completion)
    // ========================================================================
    trackingField({
      defaultEnabled: true,
      showAdvanced: false,
      overrides: {
        label: '📊 Booking Analytics',
        admin: {
          description: 'Track Calendly booking completions for analytics and ROI measurement',
        },
        fields: [
          {
            name: 'category',
            type: 'select',
            defaultValue: 'lead',
            options: [
              { label: 'Lead Generation', value: 'lead' },
              { label: 'Conversion', value: 'conversion' },
              { label: 'Engagement', value: 'engagement' },
            ],
          },
          {
            name: 'conversionValue',
            type: 'number',
            defaultValue: 100,
            admin: {
              description: 'Estimated value of a Calendly booking (USD)',
              placeholder: '100',
            },
          },
        ],
      },
    }),

    // ========================================================================
    // Constant Contact Integration
    // ========================================================================
    {
      name: 'constantContact',
      type: 'group',
      label: '📧 Constant Contact Integration',
      admin: {
        description: 'Automatically capture leads to Constant Contact when bookings are completed',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Constant Contact submission',
          defaultValue: true,
          admin: {
            description: 'Send contact data to Constant Contact after successful booking',
          },
        },
        {
          name: 'targetList',
          type: 'text',
          label: 'Target List Name',
          defaultValue: 'SHOWROOM KAWAI',
          admin: {
            description: 'Constant Contact list name to add contacts to',
            placeholder: 'SHOWROOM KAWAI',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'createListIfMissing',
          type: 'checkbox',
          label: 'Create list if it doesn\'t exist',
          defaultValue: true,
          admin: {
            description: 'Automatically create the list if it doesn\'t exist in your CC account',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'listDescription',
          type: 'text',
          label: 'List Description (for new lists)',
          admin: {
            description: 'Description used when creating a new list',
            placeholder: 'Leads from Calendly booking widget',
            condition: (data, siblingData) =>
              siblingData?.enabled === true && siblingData?.createListIfMissing === true,
          },
        },
        {
          name: 'optInMarketing',
          type: 'checkbox',
          label: 'Mark contacts as opted-in for marketing',
          defaultValue: true,
          admin: {
            description: 'Mark contacts as having opted into marketing communications',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
    },

    // ========================================================================
    // Floating Button (Optional)
    // ========================================================================
    {
      name: 'floatingButton',
      type: 'group',
      label: '🔲 Floating Button',
      admin: {
        description: 'Optional floating button (bottom-right) that opens the Calendly widget in a modal',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable floating button',
          defaultValue: false,
          admin: {
            description: 'Show a floating button that opens the booking modal',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Book Now',
          admin: {
            description: 'Text displayed on the floating button',
            placeholder: 'Book Now',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'buttonStyle',
          type: 'select',
          label: 'Button Style',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Red)', value: 'primary' },
            { label: 'Secondary (Gold)', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
          admin: {
            description: 'Visual style of the floating button',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'buttonSize',
          type: 'select',
          label: 'Button Size',
          defaultValue: 'default',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Default', value: 'default' },
            { label: 'Large', value: 'lg' },
          ],
          admin: {
            description: 'Size of the floating button',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'modalTitle',
          type: 'text',
          label: 'Modal Title',
          defaultValue: 'Book your appointment',
          admin: {
            description: 'Title displayed in the booking modal header',
            placeholder: 'Book Your Appointment',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
        {
          name: 'modalSubtitle',
          type: 'text',
          label: 'Modal Subtitle',
          admin: {
            description: 'Optional subtitle below the modal title',
            placeholder: 'Choose a time that works best for you',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
    },
  ],
}
