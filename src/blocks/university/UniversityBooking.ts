import type { Block } from 'payload'

export const UniversityBooking: Block = {
  slug: 'university-booking',
  labels: {
    singular: '📅 University Booking',
    plural: 'University Booking Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Booking',
  imageAltText:
    'Two-step booking flow: captures visitor contact info then launches a prefilled Calendly widget for appointment scheduling.',
  interfaceName: 'UniversityBookingBlock',
  fields: [
    // ========================================================================
    // Content
    // ========================================================================
    {
      type: 'collapsible',
      label: '📝 Content',
      admin: {
        description: 'Heading, description copy, and form intro text',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'heading',
              type: 'text',
              admin: {
                description: 'Section heading (e.g., "Book Your Appointment")',
                placeholder: 'Reserve Your Spot',
              },
            },
            {
              name: 'subheading',
              type: 'text',
              admin: {
                description: 'Short subheading below the main heading',
                placeholder: 'Schedule a one-on-one piano consultation',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Longer description shown on the left column (desktop). Supports plain text.',
            placeholder:
              "Get personalized recommendations from our expert piano consultants. We'll help you find the perfect instrument for your skill level and home.",
          },
        },
        {
          name: 'formIntroText',
          type: 'text',
          admin: {
            description: 'Small text above the contact form fields (e.g., "Enter your details to continue")',
            placeholder: 'Enter your details to access exclusive pricing',
          },
        },
        {
          name: 'privacyNotice',
          type: 'text',
          admin: {
            description: 'Privacy / anti-spam notice shown below the form submit button',
            placeholder: 'Your information is secure and will never be shared.',
          },
        },
      ],
    },

    // ========================================================================
    // Calendly Settings
    // ========================================================================
    {
      type: 'collapsible',
      label: '📆 Calendly Settings',
      admin: {
        description: 'Calendly event URL for the booking widget shown after form submission',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'calendlyUrl',
          type: 'text',
          required: true,
          admin: {
            description: 'Full Calendly event URL (e.g., https://calendly.com/your-org/event-name)',
            placeholder: 'https://calendly.com/kawaipianogallery/consultation',
          },
        },
      ],
    },

    // ========================================================================
    // Trust Badges
    // ========================================================================
    {
      type: 'collapsible',
      label: '🛡️ Trust Badges',
      admin: {
        description: 'Up to 3 short trust signals displayed below the contact form',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'trustBadges',
          type: 'array',
          maxRows: 3,
          admin: {
            description: 'Short reassurance phrases (e.g., "Secure booking", "No spam ever")',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Secure booking',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Appearance
    // ========================================================================
    {
      type: 'collapsible',
      label: '🎨 Appearance',
      admin: {
        description: 'Background color and section styling',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light (kawai-pearl)', value: 'light' },
            { label: 'White', value: 'white' },
            { label: 'Dark (kawai-black)', value: 'dark' },
            { label: 'Red (kawai-red)', value: 'red' },
          ],
          admin: {
            description: 'Background color for the entire booking section',
          },
        },
      ],
    },
  ],
}
