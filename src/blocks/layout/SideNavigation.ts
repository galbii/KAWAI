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
        description: 'Enable/disable the side navigation',
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
      name: 'sections',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      admin: {
        description: 'Define navigation sections that will scroll to page blocks',
        condition: (data: any) => data.enabled !== false,
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Display label for this section (e.g., "Overview", "Features", "Specifications")',
            placeholder: 'Section Name',
          },
        },
        {
          name: 'targetId',
          type: 'text',
          required: true,
          admin: {
            description: 'CSS ID of the target block (without #). This should match the block\'s HTML id attribute.',
            placeholder: 'section-overview',
          },
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
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
          defaultValue: 'circle',
          admin: {
            description: 'Optional icon for this navigation item',
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
          defaultValue: 'bottom-bar',
          options: [
            { label: 'Floating Bottom Bar (Andon Style)', value: 'bottom-bar' },
            { label: 'Hamburger Menu (Top Right)', value: 'hamburger' },
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
