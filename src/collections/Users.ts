import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '@/lib/payload/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
    description: 'User accounts and authentication management',
  },
  auth: true,
  access: {
    create: adminOnly,
    read: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      saveToJWT: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      admin: {
        description: 'User role for access control',
      },
    },
    // Add more fields as needed
  ],
}
