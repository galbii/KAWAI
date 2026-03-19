import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'
import { authenticated } from '@/lib/payload/access'

const revalidateHeaderSettings: GlobalAfterChangeHook = async ({ doc }) => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tag: 'header-settings',
    }),
  }).catch((err) => console.error('[revalidateHeaderSettings]', err))
  return doc
}

export const HeaderSettings: GlobalConfig = {
  slug: 'header-settings',
  admin: {
    group: 'Settings',
    description: 'Global settings for the site header',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateHeaderSettings],
  },
  fields: [
    {
      name: 'autoMinimize',
      type: 'checkbox',
      label: 'Auto-minimize navigation',
      defaultValue: true,
      admin: {
        description:
          'When enabled, the navigation bar automatically collapses after 2 seconds and reveals on hover. Disable to keep the navigation always visible.',
      },
    },
  ],
}
