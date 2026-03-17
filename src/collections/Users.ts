import type { CollectionConfig } from 'payload'
import { adminOnly, authenticated } from '@/lib/payload/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
    description: 'User accounts and authentication management',
  },
  auth: {
    tokenExpiration: 7200, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 60 * 60 * 1000, // 1 hour lockout after 5 failed attempts
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
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
