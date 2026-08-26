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
                {
                  name: 'backgroundColor',
                  type: 'select',
                  defaultValue: 'black',
                  options: [
                    { label: 'Black', value: 'black' },
                    { label: 'Kawai Red', value: 'red' },
                    { label: 'Charcoal', value: 'charcoal' },
                  ],
                  admin: {
                    description:
                      'Solid colour behind the hero. Shows on its own when no image or video is set, and fills any gap around one that does not cover.',
                  },
                },
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
                    condition: (_, sibling) => Boolean(sibling?.background),
                    description:
                      'Darkening behind hero text, over the image or video. Must keep text at 4.5:1 — check visually.',
                  },
                },
              ],
            },
            {
              name: 'bodyBackground',
              type: 'select',
              defaultValue: 'white',
              options: [
                { label: 'White', value: 'white' },
                { label: 'Pearl', value: 'pearl' },
                { label: 'Kawai Red', value: 'red' },
                { label: 'Black', value: 'black' },
              ],
              admin: {
                description:
                  'Colour of the section below the hero, behind the content and the form. On Kawai Red or Black, rich text blocks are placed on a white card so they stay readable.',
              },
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
          label: 'Popup',
          fields: [
            {
              name: 'promoModal',
              type: 'group',
              label: 'Music school popup',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  index: true,
                  admin: {
                    description:
                      'Show this campaign as a popup on /store/{store}/music-school. Only one campaign per store should have this on — if several do, the soonest-ending one wins.',
                  },
                },
                {
                  name: 'heading',
                  type: 'text',
                  admin: {
                    description: 'Defaults to the hero heading if left empty.',
                    condition: (_, sibling) => Boolean(sibling?.enabled),
                  },
                },
                {
                  name: 'body',
                  type: 'textarea',
                  admin: {
                    description: 'Defaults to the hero subheading if left empty.',
                    condition: (_, sibling) => Boolean(sibling?.enabled),
                  },
                },
                {
                  name: 'delaySeconds',
                  type: 'number',
                  defaultValue: 6,
                  min: 0,
                  max: 120,
                  admin: {
                    description: 'Seconds on the page before the popup opens. 0 opens immediately.',
                    condition: (_, sibling) => Boolean(sibling?.enabled),
                  },
                },
                {
                  name: 'frequency',
                  type: 'select',
                  defaultValue: 'session',
                  options: [
                    { label: 'Once per browser session', value: 'session' },
                    { label: 'Once, until they clear site data', value: 'once' },
                    { label: 'Every page view', value: 'always' },
                  ],
                  admin: {
                    description:
                      'A popup that reopens on every visit is the fastest way to train people to dismiss it. "Every page view" is for testing.',
                    condition: (_, sibling) => Boolean(sibling?.enabled),
                  },
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
