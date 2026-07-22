import type { Block } from 'payload'
import { trackingField } from '@/lib/payload/fields/tracking'

export const ThreeDViewer: Block = {
  slug: 'marketing-3d-viewer',
  labels: {
    singular: '🎹 3D Model Viewer',
    plural: '3D Model Viewers',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=3D+Model+Viewer',
  imageAltText:
    'Interactive 3D piano model viewer block. Allows users to explore Kawai piano models in immersive 3D with configurable button positioning, themes, and auto-open behavior.',
  interfaceName: 'Marketing3DViewerBlock',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Enable the 3D model viewer on this page. Uncheck to hide the button and viewer without removing the block.',
      },
    },
    {
      name: 'modelId',
      type: 'text',
      required: true,
      admin: {
        description:
          'Piano model ID for the 3D viewer (e.g., "ca901", "gl-10", "gx-7", "sk-ex"). This identifies which piano model to display.',
        placeholder: 'ca901',
      },
    },
    {
      name: 'productName',
      type: 'text',
      admin: {
        description:
          'Optional: Display name for analytics tracking (e.g., "CA901 Digital Piano"). If not provided, the model ID will be used.',
        placeholder: 'CA901 Digital Piano',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'View in 3D',
          admin: {
            description: 'Text displayed on the floating 3D viewer button',
            placeholder: 'View in 3D',
          },
        },
        {
          name: 'buttonPosition',
          type: 'select',
          defaultValue: 'bottom-left',
          options: [
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Bottom Center', value: 'bottom-center' },
          ],
          admin: {
            description: 'Position of the floating 3D viewer button on the page',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'kawai-red',
          options: [
            { label: 'Kawai Red (Default)', value: 'kawai-red' },
            { label: 'Blue', value: 'blue' },
            { label: 'Black', value: 'black' },
            { label: 'Gold', value: 'gold' },
          ],
          admin: {
            description: 'Button color theme',
          },
        },
        {
          name: 'autoOpen',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Allow ?mode=3d URL parameter to automatically open the 3D viewer when the page loads',
          },
        },
      ],
    },
    {
      name: 'contextSection',
      type: 'group',
      fields: [
        {
          name: 'showContext',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Show a text section near the 3D viewer button to provide context or instructions',
          },
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Heading text for the context section',
            placeholder: 'Explore in 3D',
            condition: (data, siblingData) => siblingData?.showContext === true,
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Description text explaining the 3D viewer feature',
            placeholder: 'Click the button to explore this piano model in interactive 3D...',
            condition: (data, siblingData) => siblingData?.showContext === true,
          },
        },
        {
          name: 'contextPosition',
          type: 'select',
          defaultValue: 'above',
          options: [
            { label: 'Above Button', value: 'above' },
            { label: 'Below Button', value: 'below' },
            { label: 'Separate Section', value: 'separate' },
          ],
          admin: {
            description: 'Where to display the context section relative to the button',
            condition: (data, siblingData) => siblingData?.showContext === true,
          },
        },
      ],
      admin: {
        description: 'Optional context section to explain the 3D viewer feature',
      },
    },
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          name: 'hideOnMobile',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Hide the 3D viewer button on mobile devices (some 3D models may not perform well on mobile)',
          },
        },
        {
          name: 'showScrollIndicator',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Show a subtle scroll indicator if this block is placed at the top of the page',
          },
        },
      ],
      admin: {
        description: 'Layout and display options',
      },
    },
    trackingField({
      defaultEnabled: true,
      overrides: {
        admin: {
          description:
            'Track when visitors open the 3D model viewer — high-intent engagement signal',
        },
      },
    }),
  ],
}
