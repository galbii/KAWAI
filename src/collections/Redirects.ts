import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { adminOnly, authenticated } from '@/lib/payload/access'

function triggerRedirectsRevalidation() {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Fire-and-forget — never await, never block the CMS save
  fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tag: 'redirects',
    }),
  }).catch((err) => console.error('[Redirects] Revalidation error:', err))
}

const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (context.skipRevalidation) return doc
  triggerRedirectsRevalidation()
  return doc
}

const revalidateOnDelete: CollectionAfterDeleteHook = async ({ doc, req: { context } }) => {
  if (context.skipRevalidation) return doc
  triggerRedirectsRevalidation()
  return doc
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    group: 'Settings',
    defaultColumns: ['from', 'redirectType', 'isActive', 'updatedAt'],
    description: 'Manage URL redirects. Changes take effect within 30 seconds.',
    components: {
      beforeList: ['/components/admin/SeedRedirectsButton#SeedRedirectsButton'],
    },
  },
  access: {
    create: authenticated,
    read: () => true, // Public — middleware reads this via /api/redirects-list
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateRedirects],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The source path to redirect from. Must start with /.',
        placeholder: '/old-page-slug',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'From path is required'
        if (!value.startsWith('/')) return 'Path must start with a forward slash (/)'
        if (value.includes('?'))
          return 'Query strings are not supported — redirect the base path only'
        if (value.length > 1 && value.endsWith('/'))
          return 'Trailing slashes are not allowed — use /old-page not /old-page/'
        return true
      },
    },
    {
      name: 'to',
      type: 'group',
      label: 'Redirect Destination',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'url',
          options: [
            { label: 'Custom URL', value: 'url' },
            { label: 'Internal Page', value: 'reference' },
          ],
          admin: {
            description:
              'Custom URL for external links or arbitrary paths. Internal Page for CMS-managed content.',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type !== 'reference',
            description: 'Full URL (https://...) or site-relative path starting with /.',
            placeholder: '/new-page or https://example.com',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (siblingData?.type === 'reference') return true
            if (!value || value.trim() === '') return 'A destination URL is required'
            return true
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'products', 'storefronts', 'posts', 'artists', 'dealers'] as const,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'reference',
            description: 'Select an internal CMS page as the redirect destination.',
          },
        },
      ],
    },
    {
      name: 'redirectType',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 — Permanent (cached by browsers & search engines)', value: '301' },
        { label: '302 — Temporary (not cached)', value: '302' },
      ],
      admin: {
        description:
          'Use 301 for permanent URL changes (SEO equity passes). Use 302 for temporary redirects.',
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Disable to pause this redirect without deleting it.',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about why this redirect exists (not shown to users).',
        position: 'sidebar',
      },
    },
  ],
}
