import type { Field, GroupField } from 'payload'

/**
 * Reusable tracking field factory for Payload blocks
 *
 * Based on Payload CMS best practices for field composition
 * @see https://payloadcms.com/docs/fields/overview
 *
 * Usage:
 * ```typescript
 * import { trackingField } from '@/lib/payload/fields/tracking'
 *
 * export const MyBlock: Block = {
 *   slug: 'my-block',
 *   fields: [
 *     // ... other fields
 *     trackingField({ defaultEnabled: true }),
 *   ]
 * }
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export interface TrackingFieldOptions {
  /** Override field name (default: 'tracking') */
  name?: string
  /** Show advanced tracking options in admin */
  showAdvanced?: boolean
  /** Default enabled state */
  defaultEnabled?: boolean
  /** Custom field overrides */
  overrides?: Partial<GroupField>
}

// ============================================================================
// Deep Merge Utility
// ============================================================================

/**
 * Deep merge utility for field overrides
 * Recursively merges source into target object
 * Handles field arrays specially by merging fields with the same name
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = result[key]

    // Special handling for 'fields' array - merge by field name
    if (key === 'fields' && Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      const mergedFields = [...targetValue]

      sourceValue.forEach((sourceField: any) => {
        const existingIndex = mergedFields.findIndex((f: any) => f.name === sourceField.name)

        if (existingIndex >= 0) {
          // Merge with existing field (override properties)
          mergedFields[existingIndex] = { ...mergedFields[existingIndex], ...sourceField }
        } else {
          // Add new field
          mergedFields.push(sourceField)
        }
      })

      result[key] = mergedFields as T[Extract<keyof T, string>]
    } else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      // Deep merge objects
      result[key] = deepMerge(targetValue || {}, sourceValue) as T[Extract<keyof T, string>]
    } else {
      // Replace primitives and other arrays
      result[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }

  return result
}

// ============================================================================
// Field Factories
// ============================================================================

/**
 * Creates a standardized tracking configuration group field
 * Can be added to any block for consistent event tracking setup
 *
 * @example
 * ```typescript
 * trackingField({
 *   defaultEnabled: true,
 *   showAdvanced: false,
 * })
 * ```
 */
export const trackingField = (options: TrackingFieldOptions = {}): GroupField => {
  const {
    name = 'tracking',
    showAdvanced = false,
    defaultEnabled = true,
    overrides = {},
  } = options

  const baseField: GroupField = {
    name,
    type: 'group',
    label: '📊 Analytics & Tracking',
    admin: {
      description: 'Configure event tracking for this block',
    },
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        label: 'Enable tracking for this block',
        defaultValue: defaultEnabled,
        admin: {
          description: 'Track interactions with this block (CTAs, impressions, etc.)',
        },
      },
      {
        name: 'eventName',
        type: 'text',
        label: 'Custom Event Name',
        admin: {
          description: 'Override default event name (leave empty for auto-generated)',
          placeholder: 'e.g., custom_cta_click',
          condition: (data, siblingData) => siblingData?.enabled === true,
        },
      },
      {
        name: 'category',
        type: 'select',
        label: 'Event Category',
        defaultValue: 'engagement',
        options: [
          { label: 'Engagement', value: 'engagement' },
          { label: 'Conversion', value: 'conversion' },
          { label: 'Lead Generation', value: 'lead' },
          { label: 'Navigation', value: 'navigation' },
          { label: 'Media', value: 'media' },
        ],
        admin: {
          description: 'Category for organizing analytics reports',
          condition: (data, siblingData) => siblingData?.enabled === true,
        },
      },
      {
        name: 'conversionValue',
        type: 'number',
        label: 'Conversion Value (USD)',
        admin: {
          description: 'Estimated dollar value of this conversion (for ROI tracking)',
          placeholder: '25',
          step: 1,
          condition: (data, siblingData) =>
            siblingData?.enabled === true && siblingData?.category === 'conversion',
        },
      },
    ],
  }

  // Add advanced options if enabled
  if (showAdvanced) {
    baseField.fields.push({
      name: 'customProperties',
      type: 'json',
      label: 'Custom Properties',
      admin: {
        description: 'Additional custom properties (JSON format)',
        condition: (data, siblingData) => siblingData?.enabled === true,
      },
    })
  }

  // Deep merge with overrides
  return deepMerge(baseField, overrides)
}

/**
 * CTA-specific tracking field with link tracking
 * Includes Meta Pixel event mapping and conversion tracking
 *
 * @example
 * ```typescript
 * {
 *   name: 'buttons',
 *   type: 'array',
 *   fields: [
 *     { name: 'text', type: 'text' },
 *     { name: 'link', type: 'text' },
 *     ctaTrackingField(), // Add CTA-specific tracking
 *   ]
 * }
 * ```
 */
export const ctaTrackingField = (): GroupField => {
  const baseTracking = trackingField({
    name: 'ctaTracking',
    defaultEnabled: true,
  })

  return deepMerge(baseTracking, {
    label: '📊 CTA Analytics',
    admin: {
      description: 'Track clicks and conversions for this call-to-action',
    },
    fields: [
      {
        name: 'trackAsConversion',
        type: 'checkbox',
        label: 'Track as conversion',
        defaultValue: true,
        admin: {
          description: 'Send conversion event to Meta Pixel and Google Analytics',
          condition: (data: any, siblingData: any) => siblingData?.enabled === true,
        },
      },
      {
        name: 'metaEventType',
        type: 'select',
        label: 'Meta Pixel Event',
        defaultValue: 'Lead',
        options: [
          { label: 'Lead', value: 'Lead' },
          { label: 'Schedule', value: 'Schedule' },
          { label: 'Find Location', value: 'FindLocation' },
          { label: 'View Content', value: 'ViewContent' },
          { label: 'Custom Event', value: 'Custom' },
        ],
        admin: {
          description: 'Map to Meta Pixel standard event',
          condition: (data: any, siblingData: any) =>
            siblingData?.enabled === true && siblingData?.trackAsConversion === true,
        },
      },
    ],
  } as Partial<GroupField>)
}

/**
 * Video tracking field with engagement metrics
 * Tracks play, pause, and progress events
 *
 * @example
 * ```typescript
 * {
 *   name: 'videos',
 *   type: 'array',
 *   fields: [
 *     { name: 'url', type: 'text' },
 *     videoTrackingField(), // Add video tracking
 *   ]
 * }
 * ```
 */
export const videoTrackingField = (): GroupField => {
  const baseTracking = trackingField({
    name: 'videoTracking',
    defaultEnabled: true,
  })

  return deepMerge(baseTracking, {
    label: '🎥 Video Analytics',
    admin: {
      description: 'Track video engagement and watch behavior',
    },
    fields: [
      {
        name: 'trackPlayPause',
        type: 'checkbox',
        label: 'Track play/pause events',
        defaultValue: true,
        admin: {
          description: 'Record when users play or pause the video',
          condition: (data: any, siblingData: any) => siblingData?.enabled === true,
        },
      },
      {
        name: 'trackProgress',
        type: 'checkbox',
        label: 'Track watch progress (25%, 50%, 75%, 100%)',
        defaultValue: true,
        admin: {
          description: 'Record milestone completions',
          condition: (data: any, siblingData: any) => siblingData?.enabled === true,
        },
      },
    ],
  } as Partial<GroupField>)
}

/**
 * Impression tracking field for visibility tracking
 * Useful for hero blocks, banners, and promotional content
 *
 * @example
 * ```typescript
 * trackImpressionField({
 *   trackViewport: true,
 *   viewportThreshold: 0.5,
 * })
 * ```
 */
export const trackImpressionField = (options: {
  trackViewport?: boolean
  viewportThreshold?: number
} = {}): GroupField => {
  const { trackViewport = true, viewportThreshold = 0.5 } = options

  const baseTracking = trackingField({
    name: 'impressionTracking',
    defaultEnabled: true,
  })

  return deepMerge(baseTracking, {
    label: '👁️ Impression Tracking',
    admin: {
      description: 'Track when this block is viewed',
    },
    fields: [
      {
        name: 'trackViewport',
        type: 'checkbox',
        label: 'Track viewport visibility',
        defaultValue: trackViewport,
        admin: {
          description: 'Only track when block is visible in viewport',
          condition: (data: any, siblingData: any) => siblingData?.enabled === true,
        },
      },
      {
        name: 'viewportThreshold',
        type: 'number',
        label: 'Visibility threshold',
        defaultValue: viewportThreshold,
        min: 0,
        max: 1,
        admin: {
          step: 0.1,
          description: 'Percentage of block that must be visible (0.5 = 50%)',
          condition: (data: any, siblingData: any) =>
            siblingData?.enabled === true && siblingData?.trackViewport === true,
        },
      },
    ],
  } as Partial<GroupField>)
}
