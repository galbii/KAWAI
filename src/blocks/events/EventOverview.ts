import type { Block } from 'payload'
import { imageField } from '@/lib/payload/fields'

export const EventOverview: Block = {
  slug: 'events-event-overview',
  labels: {
    singular: '📅 Event Overview',
    plural: 'Event Overview Sections',
  },
  imageURL: 'https://via.placeholder.com/800x600?text=Event+Overview',
  imageAltText:
    'Event overview section with event details on the left and featured image on the right. Perfect for showcasing event information, promotional images, and venue photos.',
  interfaceName: 'EventsEventOverviewBlock',
  fields: [
    // Event Information
    {
      type: 'collapsible',
      label: 'Event Information',
      admin: {
        description: 'Event details and descriptive content',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            description: 'Small label above title (e.g., "Special Event", "Annual Conference")',
            placeholder: 'Special Event',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Event title/name',
            placeholder: 'NAMM Show 2025',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          admin: {
            description: 'Event subtitle or tagline',
            placeholder: 'The Global Music, Sound & Event Technology Expo',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Event description (2-4 sentences)',
            placeholder:
              'Join us at the world\'s largest trade show for music products, pro audio, event tech, sound, and lighting. Experience the latest innovations and connect with industry professionals.',
          },
        },
        {
          name: 'highlights',
          type: 'array',
          maxRows: 6,
          labels: {
            singular: 'Highlight',
            plural: 'Event Highlights',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'Key highlight or feature (keep concise)',
                placeholder: 'Live product demonstrations',
              },
            },
            {
              name: 'icon',
              type: 'select',
              defaultValue: 'check',
              options: [
                { label: '✓ Checkmark', value: 'check' },
                { label: '★ Star', value: 'star' },
                { label: '🎵 Music Note', value: 'music' },
                { label: '📅 Calendar', value: 'calendar' },
                { label: '📍 Location Pin', value: 'location' },
                { label: '🎹 Piano', value: 'piano' },
                { label: '• Bullet Point', value: 'bullet' },
              ],
              admin: {
                description: 'Icon to display before the highlight',
              },
            },
          ],
          admin: {
            description: 'Key event highlights or features (up to 6)',
          },
        },
      ],
    },

    // Event Details
    {
      type: 'collapsible',
      label: 'Event Details',
      admin: {
        description: 'Date, time, location, and logistical information',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'date',
              type: 'text',
              admin: {
                description: 'Event date (formatted as you want to display)',
                placeholder: 'January 23-25, 2025',
              },
            },
            {
              name: 'time',
              type: 'text',
              admin: {
                description: 'Event time (if applicable)',
                placeholder: '9:00 AM - 6:00 PM PST',
              },
            },
          ],
        },
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'Event location/venue',
            placeholder: 'Anaheim Convention Center, Anaheim, CA',
          },
        },
        {
          name: 'contact',
          type: 'text',
          admin: {
            description: 'Contact information (phone, email, or name)',
            placeholder: '(555) 123-4567 or contact@example.com',
          },
        },
      ],
    },

    // Event Images
    {
      type: 'collapsible',
      label: 'Event Images',
      admin: {
        description: 'Featured images for the event (1-2 images). If two images are provided, they will automatically transition after 2 seconds when user scrolls to the section.',
        initCollapsed: false,
      },
      fields: [
        imageField('eventImage1', {
          required: false,
          admin: {
            description: 'First event image (recommended: 1200x1600px or portrait orientation)',
          },
        }),
        imageField('eventImage2', {
          required: false,
          admin: {
            description: 'Second event image (optional) - will auto-transition from first image after 2 seconds on scroll',
          },
        }),
      ],
    },

    // Map Configuration
    {
      type: 'collapsible',
      label: 'Map & Address',
      admin: {
        description: 'Map display configuration (appears below content and image)',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'showMap',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Display map with location',
          },
        },
        {
          name: 'mapAddress',
          type: 'textarea',
          admin: {
            description: 'Full address for Google Maps (used for map pin location)',
            placeholder: 'Venue Name\n123 Street Address\nCity, State ZIP\nCountry (if international)',
            condition: (data: any, siblingData: any) => siblingData?.showMap === true,
          },
        },
      ],
    },

    // Call to Action
    {
      type: 'collapsible',
      label: 'Call to Action',
      admin: {
        description: 'Up to two CTA buttons (e.g., Register Now + Learn More)',
        initCollapsed: true,
      },
      fields: [
        // Primary CTA
        {
          type: 'row',
          fields: [
            {
              name: 'ctaText',
              type: 'text',
              admin: {
                description: 'Primary CTA button text (leave empty to hide)',
                placeholder: 'Register Now',
              },
            },
            {
              name: 'ctaLink',
              type: 'text',
              admin: {
                description: 'Primary CTA button link',
                placeholder: '/events/register',
                condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ctaStyle',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary (Filled Red)', value: 'primary' },
                { label: 'Secondary (Outline Red)', value: 'secondary' },
                { label: 'Tertiary (Text Link)', value: 'tertiary' },
              ],
              admin: {
                description: 'Primary button style',
                condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
              },
            },
            {
              name: 'ctaOpenInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new tab',
                condition: (data: any, siblingData: any) => !!siblingData?.ctaText,
              },
            },
          ],
        },
        // Secondary CTA
        {
          type: 'row',
          fields: [
            {
              name: 'cta2Text',
              type: 'text',
              admin: {
                description: 'Secondary CTA button text (optional)',
                placeholder: 'Learn More',
              },
            },
            {
              name: 'cta2Link',
              type: 'text',
              admin: {
                description: 'Secondary CTA button link',
                placeholder: '/about',
                condition: (data: any, siblingData: any) => !!siblingData?.cta2Text,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'cta2Style',
              type: 'select',
              defaultValue: 'secondary',
              options: [
                { label: 'Primary (Filled Red)', value: 'primary' },
                { label: 'Secondary (Outline Red)', value: 'secondary' },
                { label: 'Tertiary (Text Link)', value: 'tertiary' },
              ],
              admin: {
                description: 'Secondary button style',
                condition: (data: any, siblingData: any) => !!siblingData?.cta2Text,
              },
            },
            {
              name: 'cta2OpenInNewTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in new tab',
                condition: (data: any, siblingData: any) => !!siblingData?.cta2Text,
              },
            },
          ],
        },
      ],
    },

    // Layout & Style
    {
      type: 'collapsible',
      label: 'Layout & Style',
      admin: {
        description: 'Visual styling and layout options',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'light',
          options: [
            { label: 'Light (Pearl Background)', value: 'light' },
            { label: 'Dark (Charcoal Background)', value: 'dark' },
            { label: 'White', value: 'white' },
            { label: 'None (Transparent)', value: 'none' },
          ],
          admin: {
            description: 'Background theme',
          },
        },
        {
          name: 'contentAlignment',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Left (Content Left, PDF Right)', value: 'left' },
            { label: 'Right (PDF Left, Content Right)', value: 'right' },
          ],
          admin: {
            description: 'Layout direction',
          },
        },
        {
          name: 'spacing',
          type: 'select',
          defaultValue: 'comfortable',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Comfortable', value: 'comfortable' },
            { label: 'Spacious', value: 'spacious' },
          ],
          admin: {
            description: 'Vertical spacing/padding',
          },
        },
      ],
    },
  ],
}
