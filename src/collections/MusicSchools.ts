import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { imageField } from '@/lib/payload/fields'
import { anyone, authenticated, adminOnly } from '@/lib/payload/access'

const revalidateMusicSchool: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (context.skipRevalidation) return doc
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATION_SECRET,
      tag: `music-school-${doc.slug}`,
    }),
  }).catch((err) => console.error('Music school revalidation error:', err))
  return doc
}

export const MusicSchools: CollectionConfig = {
  slug: 'music-schools',
  admin: {
    group: 'Business',
    useAsTitle: 'schoolName',
    defaultColumns: ['schoolName', 'storefront', 'isActive', 'updatedAt'],
  },
  access: {
    create: authenticated,
    read: anyone,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateMusicSchool],
  },
  fields: [
    // Top-level fields (before tabs)
    {
      name: 'schoolName',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL identifier for this music school',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'storefront',
      type: 'relationship',
      relationTo: 'storefronts',
      required: false,
      admin: {
        description: 'Which storefront this music school belongs to',
      },
    },
    // Tabs for UI organization
    {
      type: 'tabs',
      tabs: [
        // Tab 1: School Info
        {
          label: 'School Info',
          fields: [
            {
              name: 'officialName',
              type: 'text',
              admin: {
                description: 'Official/legal name of the school (if different from display name)',
              },
            },
            {
              name: 'directorName',
              type: 'text',
            },
            {
              name: 'about',
              type: 'textarea',
              admin: {
                description: 'About/description of the music school',
              },
            },
            {
              name: 'contactInfo',
              type: 'group',
              fields: [
                {
                  name: 'address',
                  type: 'text',
                },
                {
                  name: 'city',
                  type: 'text',
                },
                {
                  name: 'state',
                  type: 'text',
                },
                {
                  name: 'zip',
                  type: 'text',
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: { description: 'Gallery/main phone number' },
                },
                {
                  name: 'schoolPhone',
                  type: 'text',
                  admin: { description: 'Direct school phone (may differ from gallery phone)' },
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: { description: 'Gallery/main email address' },
                },
                {
                  name: 'schoolEmail',
                  type: 'email',
                  admin: { description: 'School-specific email (may differ from gallery email)' },
                },
                {
                  name: 'website',
                  type: 'text',
                },
              ],
            },
            {
              name: 'hours',
              type: 'array',
              fields: [
                {
                  name: 'day',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'hoursOpen',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        // Tab 2: Programs
        {
          label: 'Programs',
          fields: [
            {
              name: 'programs',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'ageRange',
                  type: 'text',
                  admin: {
                    description: 'e.g. "Ages 5–12" or "All ages"',
                  },
                },
                {
                  name: 'duration',
                  type: 'text',
                  admin: {
                    description: 'e.g. "30 minutes", "1 semester"',
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  admin: {
                    description: 'e.g. "$50/month" or "Contact for pricing"',
                  },
                },
              ],
            },
          ],
        },
        // Tab 3: Policies & Fees
        {
          label: 'Policies & Fees',
          fields: [
            {
              name: 'tuitionSemesters',
              type: 'array',
              label: 'Tuition by Semester',
              admin: {
                description:
                  'Semester-based tuition table (e.g. Houston). Leave empty for monthly-billing schools.',
              },
              fields: [
                {
                  name: 'semester',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "Fall", "Spring", "Summer"' },
                },
                {
                  name: 'weeks',
                  type: 'text',
                  admin: { description: 'e.g. "14 weeks" or "6–8 weeks"' },
                },
                { name: 'price30min', type: 'text', label: '30-Min Price' },
                { name: 'price45min', type: 'text', label: '45-Min Price' },
                { name: 'price60min', type: 'text', label: '60-Min Price' },
              ],
            },
            {
              name: 'fees',
              type: 'array',
              label: 'Additional Fees',
              admin: { description: 'Registration fees, supply fees, etc.' },
              fields: [
                { name: 'feeName', type: 'text', required: true },
                { name: 'amount', type: 'text' },
                { name: 'notes', type: 'text' },
              ],
            },
            {
              name: 'policies',
              type: 'array',
              label: 'School Policies',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "Tuition Payment", "Missed Lessons"' },
                },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'FAQs',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        // Tab 4: Facilities
        {
          label: 'Facilities',
          fields: [
            {
              name: 'facilities',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'capacity',
                  type: 'number',
                  admin: { description: 'Seating/room capacity (optional)' },
                },
                {
                  name: 'dimensions',
                  type: 'text',
                  admin: { description: 'Stage or room dimensions, e.g. "33′ × 20′ stage"' },
                },
              ],
            },
          ],
        },
        // Tab 5: Faculty
        {
          label: 'Faculty',
          fields: [
            {
              name: 'faculty',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                },
                {
                  name: 'role',
                  type: 'text',
                },
                imageField('photo'),
                {
                  name: 'specialties',
                  type: 'text',
                  admin: {
                    description: 'e.g. "Classical piano, jazz, music theory"',
                  },
                },
                {
                  name: 'teachingFocus',
                  type: 'text',
                },
                {
                  name: 'background',
                  type: 'textarea',
                },
                {
                  name: 'education',
                  type: 'array',
                  fields: [
                    {
                      name: 'degree',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 6: SEO
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: {
                description: 'Page title for search engines (50–60 characters recommended)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: {
                description: 'Page description for search engines (150–160 characters recommended)',
              },
            },
          ],
        },
      ],
    },
  ],
}
