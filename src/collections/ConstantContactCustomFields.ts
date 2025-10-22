/**
 * Constant Contact Custom Fields Collection
 *
 * Stores custom field ID mappings for Constant Contact API
 * This collection caches the custom_field_id returned by Constant Contact
 * for each custom field we create, allowing fast lookups without API calls.
 */

import type { CollectionConfig } from 'payload';

export const ConstantContactCustomFields: CollectionConfig = {
  slug: 'constant-contact-custom-fields',
  admin: {
    group: 'Integrations',
    description: 'Custom field ID mappings for Constant Contact API integration',
    defaultColumns: ['fieldName', 'fieldLabel', 'customFieldId', 'fieldType'],
    useAsTitle: 'fieldLabel',
    hidden: ({ user }) => !user || user.role !== 'admin',
  },
  access: {
    // Only authenticated admin users can access this collection
    read: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    create: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  fields: [
    {
      name: 'fieldName',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Internal field name used in code (e.g., student_first_name)',
        position: 'sidebar',
      },
      validate: (value: string | null | undefined) => {
        // Ensure snake_case format
        if (!value) return true; // Skip validation if empty (required field will handle this)
        if (!/^[a-z][a-z0-9_]*$/.test(value)) {
          return 'Field name must be in snake_case format (lowercase with underscores)';
        }
        return true;
      }
    },
    {
      name: 'fieldLabel',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable label shown in Constant Contact UI',
      },
    },
    {
      name: 'customFieldId',
      type: 'text',
      required: true,
      admin: {
        description: 'Constant Contact API custom field ID (auto-populated)',
        readOnly: true,
      },
    },
    {
      name: 'fieldType',
      type: 'select',
      required: true,
      defaultValue: 'string',
      options: [
        { label: 'Text (String)', value: 'string' },
        { label: 'Date', value: 'date' },
        { label: 'Single Select', value: 'single_select' },
        { label: 'Multi Select', value: 'multi_select' },
      ],
      admin: {
        description: 'Data type for this custom field',
      },
    },
    {
      name: 'createdInConstantContact',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this field exists in Constant Contact',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: {
        description: 'Last time this field was verified with Constant Contact',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};
