import type { CollectionConfig } from 'payload'
import { adminOnly, anyone, authenticated } from '@/lib/payload/access'
import { mediaField } from '@/lib/payload/fields'
import { revalidateSignupCampaign } from './hooks/revalidateSignupCampaign'

export const SignupCampaigns: CollectionConfig = {
  slug: 'signup-campaigns',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'isActive', 'isDefault', 'updatedAt'],
    description: 'Promo signup landing pages served at /store/{store}/signup',
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateSignupCampaign],
    beforeValidate: [
      ({ data }) => {
        // RSM auto-routing geocodes a ZIP. Enabling it without collecting one
        // would silently route every lead to the fallback inbox, so the two
        // settings are kept consistent here rather than trusted to the editor.
        if (data?.notify?.autoRouteToRSM) {
          data.form = { ...data.form, collectZip: true, requireZip: true }
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Campaign',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: { description: 'URL segment, e.g. fall-open-house' },
            },
            {
              name: 'stores',
              type: 'relationship',
              relationTo: 'storefronts',
              hasMany: true,
              required: true,
              admin: { description: 'Which storefronts this campaign runs at' },
            },
            { name: 'isActive', type: 'checkbox', index: true, defaultValue: false },
            {
              name: 'isDefault',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Serve this campaign at the bare /signup URL' },
            },
            { name: 'startDate', type: 'date' },
            {
              name: 'endDate',
              type: 'date',
              admin: {
                description:
                  'Leave empty for open-ended. After this date the page shows an "ended" panel.',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'kicker',
                  type: 'text',
                  admin: { description: 'Small line above the headline' },
                },
                {
                  name: 'heading',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'The page H1. Exactly one per page — do not add another in a block.',
                  },
                },
                { name: 'subheading', type: 'textarea' },
                mediaField('background', {
                  admin: { description: 'Image or video behind the hero' },
                }),
                {
                  name: 'scrim',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: 'Light', value: 'light' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Heavy', value: 'heavy' },
                  ],
                  admin: {
                    description:
                      'Darkening behind hero text. Must keep text at 4.5:1 — check visually.',
                  },
                },
              ],
            },
            {
              name: 'blocks',
              type: 'blocks',
              blockReferences: [
                'content-rich-text',
                'content-image',
                'content-video',
                'content-banner',
                'layout-columns',
                'layout-spacer',
                'layout-divider',
                'signup-instructors',
                'signup-details',
                'signup-location',
              ],
              blocks: [],
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'Form',
          fields: [
            {
              name: 'form',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', defaultValue: 'Reserve your spot' },
                { name: 'subtitle', type: 'text', defaultValue: 'Takes about 2 minutes' },
                { name: 'submitLabel', type: 'text', defaultValue: 'Save My Spot' },
                { name: 'finePrint', type: 'textarea' },
                { name: 'collectPhone', type: 'checkbox', defaultValue: true },
                { name: 'requirePhone', type: 'checkbox', defaultValue: false },
                { name: 'collectZip', type: 'checkbox', defaultValue: true },
                { name: 'requireZip', type: 'checkbox', defaultValue: false },
                {
                  name: 'questions',
                  type: 'array',
                  admin: {
                    description:
                      'Campaign-specific questions. The first 4 render in the sticky rail; the rest open in a second step.',
                  },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      defaultValue: 'text',
                      options: [
                        { label: 'Short text', value: 'text' },
                        { label: 'Long text', value: 'textarea' },
                        { label: 'Dropdown', value: 'select' },
                        { label: 'Radio buttons', value: 'radio' },
                        { label: 'Checkbox', value: 'checkbox' },
                        { label: 'Date', value: 'date' },
                      ],
                    },
                    { name: 'label', type: 'text', required: true },
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: {
                        description:
                          'Field key, lowercase, no spaces. Unique within this campaign.',
                      },
                    },
                    { name: 'required', type: 'checkbox', defaultValue: false },
                    {
                      name: 'options',
                      type: 'array',
                      admin: {
                        condition: (_, sibling) => ['select', 'radio'].includes(sibling?.type),
                      },
                      fields: [
                        { name: 'label', type: 'text', required: true },
                        { name: 'value', type: 'text', required: true },
                      ],
                    },
                    { name: 'helpText', type: 'text' },
                    {
                      name: 'width',
                      type: 'select',
                      defaultValue: 'full',
                      options: [
                        { label: 'Full width', value: 'full' },
                        { label: 'Half width', value: 'half' },
                      ],
                    },
                  ],
                },
                {
                  name: 'successMode',
                  type: 'select',
                  defaultValue: 'message',
                  options: [
                    { label: 'Show a message', value: 'message' },
                    { label: 'Redirect', value: 'redirect' },
                  ],
                },
                {
                  name: 'successMessage',
                  type: 'richText',
                  admin: { condition: (_, sibling) => sibling?.successMode === 'message' },
                },
                {
                  name: 'redirectUrl',
                  type: 'text',
                  admin: { condition: (_, sibling) => sibling?.successMode === 'redirect' },
                },
              ],
            },
          ],
        },
        {
          label: 'Notifications',
          fields: [
            {
              name: 'notify',
              type: 'group',
              fields: [
                {
                  name: 'recipients',
                  type: 'array',
                  fields: [{ name: 'email', type: 'email', required: true }],
                  admin: { description: 'Who receives each lead' },
                },
                { name: 'includeStorefrontEmail', type: 'checkbox', defaultValue: false },
                { name: 'includeSchoolEmail', type: 'checkbox', defaultValue: false },
                {
                  name: 'autoRouteToRSM',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    hidden: true,
                    description:
                      'NOT YET WIRED. The ZIP-to-RSM matching still lives inside notify-rsm-of-lead.ts and has not been extracted. Hidden so it cannot be switched on with no effect.',
                  },
                },
                {
                  name: 'cc',
                  type: 'array',
                  fields: [{ name: 'email', type: 'email', required: true }],
                },
                {
                  name: 'subjectTemplate',
                  type: 'text',
                  defaultValue: 'New signup — {{campaign}} ({{store}})',
                  admin: { description: 'Supports {{campaign}}, {{store}}, {{firstName}}' },
                },
                {
                  name: 'liveSendEnabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'OFF by default. While off, recipients are logged but no email is sent.',
                  },
                },
                { name: 'sendConfirmationToLead', type: 'checkbox', defaultValue: true },
                {
                  name: 'confirmationSubject',
                  type: 'text',
                  defaultValue: "Thanks — we've got your spot",
                },
                { name: 'confirmationBody', type: 'richText' },
              ],
            },
          ],
        },
        {
          label: 'Shopify',
          fields: [
            {
              name: 'shopify',
              type: 'group',
              fields: [
                { name: 'enableSync', type: 'checkbox', defaultValue: true },
                {
                  name: 'tags',
                  type: 'array',
                  fields: [{ name: 'tag', type: 'text', required: true }],
                  admin: {
                    description:
                      'signup-{slug} and store-{storeslug} are added automatically',
                  },
                },
                { name: 'acceptsMarketing', type: 'checkbox', defaultValue: false },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                mediaField('image'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
