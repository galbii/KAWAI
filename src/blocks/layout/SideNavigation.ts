import type { Block } from 'payload'

export const SideNavigation: Block = {
  slug: 'layout-side-navigation',
  labels: {
    singular: '🧭 Side Navigation',
    plural: 'Side Navigations',
  },
  imageURL: 'https://via.placeholder.com/600x400?text=Side+Navigation',
  imageAltText:
    'Elegant side navigation bar with scroll-spy functionality. Automatically detects page sections and highlights the active block as users scroll. Features Japanese-inspired minimalist design with glassmorphism effects. Transforms into a floating bottom navigation on mobile devices.',
  interfaceName: 'LayoutSideNavigationBlock',
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable/disable the side navigation. Navigation items are automatically generated from page blocks.',
      },
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Navigation',
      admin: {
        description: 'Optional title displayed above navigation items',
        condition: (data: any) => data.enabled !== false,
      },
    },
    {
      name: 'position',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left Side', value: 'left' },
        { label: 'Right Side', value: 'right' },
      ],
      admin: {
        description: 'Position of the side navigation (desktop only)',
        condition: (data: any) => data.enabled !== false,
      },
    },
    {
      name: 'zoom',
      type: 'number',
      defaultValue: 100,
      min: 50,
      max: 200,
      admin: {
        description: 'Zoom level (50-200%). Default is 100%. Higher values make the navigation larger.',
        condition: (data: any) => data.enabled !== false,
        step: 5,
      },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light (Frosted Pearl)', value: 'light' },
        { label: 'Dark (Charcoal Glass)', value: 'dark' },
        { label: 'Kawai Red Accent', value: 'red' },
        { label: 'Gold Accent', value: 'gold' },
      ],
      admin: {
        description: 'Visual theme for the navigation',
        condition: (data: any) => data.enabled !== false,
      },
    },
    {
      name: 'sectionLabels',
      type: 'array',
      minRows: 0,
      maxRows: 20,
      admin: {
        description: '✏️ Optional: Custom labels and icons for navigation items. Enter in order they appear on the page. Leave empty to use auto-generated names.',
        condition: (data: any) => data.enabled !== false,
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Navigation label (e.g., "Overview", "Key Features", "Technical Specs")',
            placeholder: 'Section name',
          },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Auto (based on block type)', value: 'auto' },
            { label: '● Circle', value: 'circle' },
            { label: '■ Square', value: 'square' },
            { label: '▲ Triangle', value: 'triangle' },
            { label: '◆ Diamond', value: 'diamond' },
            { label: '🎹 Piano', value: 'piano' },
            { label: '✨ Sparkles', value: 'sparkles' },
            { label: '🎯 Target', value: 'target' },
            { label: '📍 Pin', value: 'pin' },
            { label: '⭐ Star', value: 'star' },
          ],
          defaultValue: 'auto',
          admin: {
            description: 'Optional: Override the auto-assigned icon for this section',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Mobile Configuration',
      admin: {
        condition: (data: any) => data.enabled !== false,
      },
      fields: [
        {
          name: 'mobileStyle',
          type: 'select',
          defaultValue: 'hamburger',
          options: [
            { label: 'Hamburger Menu (Bottom Right)', value: 'hamburger' },
            { label: 'Floating Bottom Bar (Andon Style)', value: 'bottom-bar' },
            { label: 'Hidden on Mobile', value: 'hidden' },
          ],
          admin: {
            description: 'How navigation appears on mobile devices',
          },
        },
        {
          name: 'mobileLabel',
          type: 'text',
          defaultValue: 'Menu',
          admin: {
            description: 'Label for mobile navigation toggle',
            condition: (data: any) => data.mobileStyle === 'hamburger',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Behavior Settings',
      admin: {
        condition: (data: any) => data.enabled !== false,
        initCollapsed: true,
      },
      fields: [
        {
          name: 'smoothScroll',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable smooth scroll animation when clicking navigation items',
          },
        },
        {
          name: 'scrollOffset',
          type: 'number',
          defaultValue: 80,
          min: 0,
          max: 200,
          admin: {
            description: 'Pixel offset from top when scrolling to sections (accounts for fixed headers)',
            step: 10,
          },
        },
        {
          name: 'autoHide',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Automatically hide navigation when scrolling down, show when scrolling up',
          },
        },
        {
          name: 'showProgress',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show a vertical progress indicator line connecting navigation items',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Styling & Effects',
      admin: {
        condition: (data: any) => data.enabled !== false,
        initCollapsed: true,
      },
      fields: [
        {
          name: 'glassmorphism',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable glassmorphism backdrop blur effect',
          },
        },
        {
          name: 'showBorder',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show subtle border around navigation container',
          },
        },
        {
          name: 'compactMode',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use compact spacing for more navigation items',
          },
        },
      ],
    },
  ],
}
