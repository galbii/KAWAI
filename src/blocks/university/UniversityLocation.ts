import type { Block } from 'payload'

export const UniversityLocation: Block = {
  slug: 'university-location',
  labels: {
    singular: '📍 University Location',
    plural: 'University Location Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Location',
  imageAltText:
    'Location section with embedded Google Map, venue address, hours, contact details, and optional Constant Contact inline form.',
  interfaceName: 'UniversityLocationBlock',
  fields: [
    // ========================================================================
    // Section Header
    // ========================================================================
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading (e.g., "Find Us")',
        placeholder: 'Visit Our Showroom',
      },
    },

    // ========================================================================
    // Venue / Address
    // ========================================================================
    {
      type: 'collapsible',
      label: '🏛️ Venue & Address',
      admin: {
        description: 'Physical location details displayed in the contact info panel',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'venueName',
          type: 'text',
          admin: {
            description: 'Name of the venue or building',
            placeholder: 'C.S. Lane Home Economics Center',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'addressLine1',
              type: 'text',
              admin: {
                description: 'Street address',
                placeholder: '3100 Cleburne St',
              },
            },
            {
              name: 'addressLine2',
              type: 'text',
              admin: {
                description: 'Suite, floor, building (optional)',
                placeholder: 'Suite 200',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              admin: {
                placeholder: 'Houston',
              },
            },
            {
              name: 'state',
              type: 'text',
              admin: {
                placeholder: 'TX',
              },
            },
            {
              name: 'zip',
              type: 'text',
              admin: {
                placeholder: '77004',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phone',
              type: 'text',
              admin: {
                description: 'Contact phone number',
                placeholder: '(713) 904-0001',
              },
            },
            {
              name: 'email',
              type: 'email',
              admin: {
                description: 'Contact email address (optional)',
                placeholder: 'info@kawaipianosgallery.com',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Map
    // ========================================================================
    {
      type: 'collapsible',
      label: '🗺️ Google Maps',
      admin: {
        description: 'Embed URL for the Google Maps iframe',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'googleMapsEmbedUrl',
          type: 'text',
          admin: {
            description:
              'Google Maps embed URL — get it from Google Maps → Share → Embed a map → copy the src value (starts with https://www.google.com/maps/embed?...)',
            placeholder: 'https://www.google.com/maps/embed?pb=...',
          },
        },
      ],
    },

    // ========================================================================
    // Hours
    // ========================================================================
    {
      type: 'collapsible',
      label: '🕐 Hours',
      admin: {
        description: 'Opening hours list (e.g., event days, showroom hours)',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'hours',
          type: 'array',
          admin: {
            description: 'Each row represents a day or range of days',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'dayLabel',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Day or day range',
                    placeholder: 'Wednesday – Friday',
                  },
                },
                {
                  name: 'hoursText',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Hours for this day/range',
                    placeholder: '10:00 AM – 7:00 PM',
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Contact Form (Constant Contact)
    // ========================================================================
    {
      type: 'collapsible',
      label: '📧 Contact Form',
      admin: {
        description: 'Optional inline Constant Contact form rendered on the right panel',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'showContactForm',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Show an inline Constant Contact form in the right panel',
          },
        },
        {
          name: 'constantContactFormId',
          type: 'text',
          admin: {
            description:
              'Constant Contact form UUID (data-form-id value from the ctct-inline-form div)',
            placeholder: '3ba8c9c8-796d-41fd-987f-7a506d7e03be',
            condition: (_data, siblingData) => siblingData?.showContactForm === true,
          },
        },
        {
          name: 'contactFormHeading',
          type: 'text',
          admin: {
            description: 'Heading above the Constant Contact form',
            placeholder: 'Get In Touch',
            condition: (_data, siblingData) => siblingData?.showContactForm === true,
          },
        },
        {
          name: 'contactFormDescription',
          type: 'text',
          admin: {
            description: 'Short description below the form heading',
            placeholder: "Send us a message and we'll get back to you soon.",
            condition: (_data, siblingData) => siblingData?.showContactForm === true,
          },
        },
      ],
    },
  ],
}
