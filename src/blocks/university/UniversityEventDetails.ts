import type { Block } from 'payload'

export const UniversityEventDetails: Block = {
  slug: 'university-event-details',
  labels: {
    singular: '📅 University Event Details',
    plural: 'University Event Details Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Event+Details',
  imageAltText:
    'Event details section with dates, schedule table, and a grid of special offers with icons.',
  interfaceName: 'UniversityEventDetailsBlock',
  fields: [
    // ========================================================================
    // Content
    // ========================================================================
    {
      type: 'collapsible',
      label: '📝 Content',
      admin: {
        description: 'Section heading and event location info',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'sectionHeading',
          type: 'text',
          admin: {
            description: 'Main heading for this section (e.g., "Event Details")',
            placeholder: 'Event Details',
          },
        },
        {
          name: 'locationName',
          type: 'text',
          admin: {
            description: 'Event venue or location name',
            placeholder: 'Kawai Piano Gallery – 601 W. Plano Pkwy, Suite 153',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventStartDate',
              type: 'date',
              required: true,
              admin: {
                description: 'Event start date',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'eventEndDate',
              type: 'date',
              required: true,
              admin: {
                description: 'Event end date',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
        {
          name: 'showCountdownLink',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Link to a countdown block elsewhere on this page (informational only)',
          },
        },
      ],
    },

    // ========================================================================
    // Offers
    // ========================================================================
    {
      type: 'collapsible',
      label: '🎁 Exclusive Offers',
      admin: {
        description: 'Special offers / benefits grid – displayed as icon cards',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'offers',
          type: 'array',
          maxRows: 6,
          admin: {
            description: 'Up to 6 offer cards',
          },
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              defaultValue: 'gift',
              options: [
                { label: '🎁 Gift', value: 'gift' },
                { label: '% Percent / Discount', value: 'percent' },
                { label: '🚚 Truck / Delivery', value: 'truck' },
                { label: '🛡️ Shield / Warranty', value: 'shield' },
                { label: '🏆 Award / Excellence', value: 'award' },
                { label: '⭐ Star / Featured', value: 'star' },
              ],
              admin: {
                description: 'Icon to display for this offer',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Up to 40% off select models',
              },
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                placeholder: 'Premium upright and grand pianos',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Schedule
    // ========================================================================
    {
      type: 'collapsible',
      label: '🗓️ Schedule',
      admin: {
        description: 'Day-by-day event schedule',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'schedule',
          type: 'array',
          maxRows: 10,
          admin: {
            description: 'Event schedule rows',
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
                    placeholder: 'Wednesday',
                  },
                },
                {
                  name: 'dateLabel',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'Dec 4',
                  },
                },
                {
                  name: 'hours',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: '10:00 AM – 7:00 PM',
                  },
                },
              ],
            },
            {
              name: 'highlight',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Highlight this row (e.g., opening day)',
              },
            },
          ],
        },
      ],
    },
  ],
}
