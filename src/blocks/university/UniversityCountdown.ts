import type { Block } from 'payload'

export const UniversityCountdown: Block = {
  slug: 'university-countdown',
  labels: {
    singular: '⏱️ University Countdown',
    plural: 'University Countdown Timers',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=University+Countdown',
  imageAltText:
    'Fixed floating countdown timer that appears after the user scrolls past a configurable percentage of the page, with glassmorphism styling and a CTA scroll button.',
  interfaceName: 'UniversityCountdownBlock',
  fields: [
    // ========================================================================
    // Timer Settings
    // ========================================================================
    {
      type: 'collapsible',
      label: '⏱️ Timer Settings',
      admin: {
        description: 'Target date and event label',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'targetDate',
          type: 'date',
          required: true,
          admin: {
            description: 'Date/time the countdown counts down to — component hides once this passes',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'eventLabel',
          type: 'text',
          admin: {
            description: 'Short label shown above the countdown (e.g., "Piano Sale Ends")',
            placeholder: 'Piano Sale Ends',
          },
        },
      ],
    },

    // ========================================================================
    // CTA
    // ========================================================================
    {
      type: 'collapsible',
      label: '🔗 Call to Action',
      admin: {
        description: 'Button that scrolls the user to a section on the page',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ctaButtonText',
              type: 'text',
              admin: {
                description: 'CTA button label',
                placeholder: 'Book Now',
              },
            },
            {
              name: 'ctaScrollTarget',
              type: 'text',
              admin: {
                description: 'Section ID to scroll to when the button is clicked (include the #)',
                placeholder: '#booking',
              },
            },
          ],
        },
      ],
    },

    // ========================================================================
    // Behavior & Position
    // ========================================================================
    {
      type: 'collapsible',
      label: '⚙️ Behavior & Position',
      admin: {
        description: 'Scroll trigger threshold and fixed position on screen',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'position',
              type: 'select',
              defaultValue: 'bottom-right',
              options: [
                { label: 'Bottom Right', value: 'bottom-right' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Center', value: 'bottom-center' },
              ],
              admin: {
                description: 'Fixed position of the floating timer',
              },
            },
            {
              name: 'showAfterScrollPercent',
              type: 'number',
              defaultValue: 25,
              min: 0,
              max: 100,
              admin: {
                description: 'Show timer after user has scrolled this % of the page (0–100)',
                step: 5,
              },
            },
          ],
        },
      ],
    },
  ],
}
