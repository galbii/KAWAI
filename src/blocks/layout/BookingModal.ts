import type { Block } from 'payload'
import { trackingField, ctaTrackingField } from '@/lib/payload/fields/tracking'
import { imageField } from '@/lib/payload/fields'

/**
 * Booking Modal Block
 *
 * Button that opens Calendly booking widget in a modal dialog.
 * Tracks both button clicks (CTA) and booking completions separately.
 *
 * Features:
 * - Customizable button with icon support
 * - Modal dialog with Calendly widget
 * - Dual tracking: button clicks + booking events
 * - Automatic Constant Contact lead capture
 * - Non-blocking tracking
 *
 * @see src/components/blocks/BookingModalBlock.tsx
 * @see src/components/pages/signature/CalendlyBookingWidget.tsx
 * @see src/hooks/useCalendlyTracking.ts
 */
export const BookingModal: Block = {
  slug: 'layout-booking-modal',
  labels: {
    singular: '🎫 Booking Modal',
    plural: 'Booking Modals',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Booking+Modal',
  imageAltText: 'Button that opens Calendly booking widget in modal dialog',
  interfaceName: 'LayoutBookingModalBlock',
  fields: [
    // ========================================================================
    // Button Configuration
    // ========================================================================
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      required: true,
      defaultValue: 'Book Now',
      admin: {
        description: 'Text displayed on the button',
        placeholder: 'Schedule Consultation',
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
        description: 'Visual style of the button',
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
        description: 'Size of the button',
      },
    },
    imageField('buttonIcon', {
      admin: {
        description: 'Optional icon displayed on the button (recommended: 24x24px)',
      },
    }),
    {
      name: 'buttonAlignment',
      type: 'select',
      label: 'Button Alignment',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Horizontal alignment of the button',
      },
    },

    // ========================================================================
    // Modal Settings
    // ========================================================================
    {
      name: 'modalTitle',
      type: 'text',
      label: 'Modal Title',
      defaultValue: 'Schedule Your Consultation',
      admin: {
        description: 'Title displayed in the modal header',
        placeholder: 'Book Your Appointment',
      },
    },
    {
      name: 'modalSubtitle',
      type: 'text',
      label: 'Modal Subtitle',
      admin: {
        description: 'Subtitle displayed below the title (optional)',
        placeholder: 'Choose a time that works best for you',
      },
    },
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

    // ========================================================================
    // Styling
    // ========================================================================
    {
      name: 'displayMode',
      type: 'select',
      label: 'Display Mode',
      defaultValue: 'inline',
      options: [
        { label: 'Inline (in page flow)', value: 'inline' },
        { label: 'Floating (bottom right)', value: 'floating' },
      ],
      admin: {
        description: 'How the button is positioned on the page',
      },
    },
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
      ],
      admin: {
        description: 'Background color for the block section (inline mode only)',
        condition: (data, siblingData) => siblingData?.displayMode === 'inline',
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
        description: 'Vertical spacing around the block (inline mode only)',
        condition: (data, siblingData) => siblingData?.displayMode === 'inline',
      },
    },

    // ========================================================================
    // Button Click Tracking
    // ========================================================================
    ctaTrackingField(),

    // ========================================================================
    // Booking Completion Tracking
    // ========================================================================
    {
      ...ctaTrackingField(),
      name: 'bookingTracking',
      label: '🎯 Booking Completion Analytics',
      admin: {
        description: 'Track successful Calendly bookings (fires after user completes scheduling)',
      },
    } as any,

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
            placeholder: 'Leads from booking modal',
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
  ],
}
