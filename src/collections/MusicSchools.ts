import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { imageField, slugBeforeDuplicate } from '@/lib/payload/fields'
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
      hooks: { beforeDuplicate: [slugBeforeDuplicate] },
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
            {
              name: 'minimumAge',
              type: 'number',
              label: 'Minimum Age for Private Lessons',
              admin: { description: 'Minimum student age for private lessons (e.g. 5)' },
            },
            {
              name: 'instruments',
              type: 'array',
              label: 'Instruments Taught',
              labels: { singular: 'Instrument', plural: 'Instruments' },
              defaultValue: [{ instrument: 'Piano' }],
              fields: [{ name: 'instrument', type: 'text', label: 'Instrument', required: true }],
            },
            {
              name: 'studentAgeGroups',
              type: 'array',
              label: 'Suitable For',
              labels: { singular: 'Age Group', plural: 'Age Groups' },
              defaultValue: [{ ageGroup: 'Children' }, { ageGroup: 'Teens' }, { ageGroup: 'Adults' }],
              fields: [{ name: 'ageGroup', type: 'text', label: 'Age Group', required: true }],
            },
            {
              name: 'whyChooseTitle',
              type: 'text',
              label: 'Why Choose Section Title',
              defaultValue: 'Why Choose Kawai Piano Lessons',
            },
            {
              name: 'whyChooseBenefits',
              type: 'array',
              label: 'Why Choose — Benefits',
              labels: { singular: 'Benefit', plural: 'Benefits' },
              defaultValue: [
                { title: 'Experienced Faculty', description: 'Teachers hold advanced degrees in piano and music with extensive teaching and performing experience.' },
                { title: 'Award-Winning Pianos', description: 'Students learn on Kawai\'s award-winning grand and upright pianos.' },
                { title: 'Performance Opportunities', description: 'Public recitals, masterclasses with visiting artists, and more.' },
                { title: 'State-of-the-Art Facility', description: 'Soundproof teaching and practice rooms, comfortable waiting area, and a recital hall with Shigeru Kawai concert grand piano.' },
              ],
              fields: [
                { name: 'title', type: 'text', label: 'Benefit Title', required: true },
                { name: 'description', type: 'textarea', label: 'Description' },
              ],
            },
            {
              name: 'trialLesson',
              type: 'group',
              label: 'Trial / Free Lesson Offer',
              fields: [
                { name: 'enabled', type: 'checkbox', label: 'Enable Trial Lesson CTA', defaultValue: false },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  defaultValue: 'Sign up for a free complimentary lesson with one of our instructors.',
                },
                { name: 'phone', type: 'text', label: 'Enrollment Phone' },
                { name: 'ctaText', type: 'text', label: 'CTA Button Text', defaultValue: 'Schedule a Free Trial Lesson' },
                { name: 'ctaLink', type: 'text', label: 'CTA Button Link' },
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
                {
                  name: 'programType',
                  type: 'select',
                  label: 'Program Type',
                  defaultValue: 'private-lessons',
                  options: [
                    { label: 'Private Lessons', value: 'private-lessons' },
                    { label: 'Group Lessons', value: 'group-lessons' },
                    { label: 'Voice Lessons', value: 'voice-lessons' },
                    { label: 'Keyboard Class', value: 'keyboard-class' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                { name: 'isHighlighted', type: 'checkbox', label: 'Highlight (pin to top)', defaultValue: false },
              ],
            },
            {
              name: 'groupClasses',
              type: 'array',
              label: 'Group Classes',
              labels: { singular: 'Group Class', plural: 'Group Classes' },
              admin: { description: 'Fixed-schedule group classes (keyboard classes, adult hobbyist groups, etc.)' },
              fields: [
                { name: 'name', type: 'text', label: 'Class Name', required: true },
                { name: 'description', type: 'textarea', label: 'Description' },
                { name: 'ageRange', type: 'text', label: 'Age Range' },
                { name: 'studentsMin', type: 'number', label: 'Min Students Per Class', defaultValue: 4 },
                { name: 'studentsMax', type: 'number', label: 'Max Students Per Class', defaultValue: 8 },
                { name: 'tuition', type: 'number', label: 'Tuition (USD)' },
                { name: 'schedule', type: 'textarea', label: 'Schedule (e.g. "Tuesdays @ 6pm–6:45pm")' },
                { name: 'sessionsInfo', type: 'textarea', label: 'Sessions Info (e.g. "3 sessions/year: Jan–Apr, May–Aug, Sep–Dec")' },
                { name: 'isHighlighted', type: 'checkbox', label: 'Highlight this class', defaultValue: false },
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
                { name: 'registrationDeadline', type: 'text', label: 'Registration Deadline (e.g. "August 10")' },
                { name: 'fullSemesterPrice30', type: 'number', label: 'Full Semester Price — 30 min ($)' },
                { name: 'fullSemesterPrice45', type: 'number', label: 'Full Semester Price — 45 min ($)' },
                { name: 'fullSemesterPrice60', type: 'number', label: 'Full Semester Price — 60 min ($)' },
                {
                  name: 'monthlyRates',
                  type: 'array',
                  label: 'Monthly Rate Breakdown',
                  labels: { singular: 'Month', plural: 'Months' },
                  admin: { description: 'Per-month pricing within this semester (if rates vary by month)' },
                  fields: [
                    { name: 'month', type: 'text', label: 'Month (e.g. "September")', required: true },
                    { name: 'price30', type: 'number', label: '30 min rate ($)' },
                    { name: 'price45', type: 'number', label: '45 min rate ($)' },
                    { name: 'price60', type: 'number', label: '60 min rate ($)' },
                  ],
                },
                {
                  name: 'lessonPackages',
                  type: 'array',
                  label: 'Lesson Count Packages',
                  labels: { singular: 'Package', plural: 'Packages' },
                  admin: { description: 'Fixed-lesson-count pricing (e.g. Summer: 6 or 8 lessons)' },
                  fields: [
                    { name: 'lessonCount', type: 'number', label: 'Number of Lessons', required: true },
                    { name: 'price30', type: 'number', label: '30 min price ($)' },
                    { name: 'price45', type: 'number', label: '45 min price ($)' },
                    { name: 'price60', type: 'number', label: '60 min price ($)' },
                  ],
                },
                { name: 'payInFullDeadline', type: 'text', label: 'Pay-in-Full Deadline (e.g. "May 30")' },
                { name: 'semesterNotes', type: 'textarea', label: 'Semester Notes' },
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
            {
              name: 'tuitionPaymentType',
              type: 'select',
              label: 'Tuition Payment Structure',
              defaultValue: 'monthly',
              options: [
                { label: 'Semester-based', value: 'semester' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Per Lesson', value: 'per-lesson' },
              ],
            },
            { name: 'tuitionDueDate', type: 'text', label: 'Tuition Due Date', admin: { description: 'e.g. "10th of each month" or "1st of each month"' } },
            { name: 'acceptedPayments', type: 'textarea', label: 'Accepted Payment Methods / Restrictions', admin: { description: 'e.g. "Credit card only — no cash or checks accepted"' } },
            { name: 'withdrawalPolicy', type: 'textarea', label: 'Withdrawal Policy' },
            { name: 'withdrawalEmail', type: 'text', label: 'Withdrawal Contact Email' },
            { name: 'withdrawalNoticeDays', type: 'number', label: 'Required Notice Period (days)', defaultValue: 30 },
            { name: 'makeupLessonPolicy', type: 'textarea', label: 'Makeup Lesson Policy' },
            {
              name: 'makeupOptions',
              type: 'array',
              label: 'Makeup Lesson Options',
              labels: { singular: 'Option', plural: 'Options' },
              fields: [{ name: 'option', type: 'text', label: 'Option', required: true }],
            },
            { name: 'lessonProtocol', type: 'textarea', label: 'Lesson Protocol', admin: { description: 'e.g. escort policy, pickup policy for minors' } },
            { name: 'foodDrinksPolicy', type: 'text', label: 'Food & Drinks Policy' },
            { name: 'photoReleasePolicy', type: 'textarea', label: 'Photo / Media Release Policy' },
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
        // Tab 6: Service Areas (local SEO landing pages)
        {
          label: 'Service Areas',
          description: 'Each entry generates a local SEO page at /store/[storeslug]/music-school/[location-slug] targeting nearby cities and suburbs.',
          fields: [
            {
              name: 'serviceLocations',
              type: 'array',
              label: 'Service Area Pages',
              labels: { singular: 'Service Area', plural: 'Service Areas' },
              admin: {
                description:
                  'Add a city/suburb to generate a dedicated page (e.g. "Frisco" → /store/dallas/music-school/frisco). Use the SEO fields to control titles and descriptions.',
              },
              fields: [
                {
                  name: 'cityName',
                  type: 'text',
                  required: true,
                  admin: { description: 'Display name, e.g. "Frisco" or "Plano, TX"' },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  admin: { description: 'URL slug — lowercase, no spaces. e.g. "frisco" or "plano-tx"' },
                },
                {
                  name: 'headline',
                  type: 'text',
                  admin: { description: 'Page H1 override. Defaults to "Piano Lessons in [City]".' },
                },
                {
                  name: 'intro',
                  type: 'textarea',
                  admin: { description: 'Optional intro paragraph about serving this area.' },
                },
                {
                  name: 'metaTitle',
                  type: 'text',
                  localized: true,
                  admin: { description: 'SEO title override. Defaults to "[Headline] | [School Name]".' },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  localized: true,
                  admin: { description: 'SEO description override.' },
                },
                {
                  name: 'services',
                  type: 'array',
                  label: 'Services Available in This Area',
                  labels: { singular: 'Service', plural: 'Services' },
                  admin: {
                    description:
                      'List the lessons/programs available in this area. Displayed as feature cards on the page.',
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. "Private Piano Lessons" or "Kids Piano Classes"' },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: { description: 'Brief description of this service.' },
                    },
                    {
                      name: 'ageRange',
                      type: 'text',
                      admin: { description: 'e.g. "Ages 5–18" or "All ages welcome"' },
                    },
                    {
                      name: 'price',
                      type: 'text',
                      admin: { description: 'e.g. "$150/month" or "Contact for pricing"' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // Tab 7: SEO
        {
          label: 'SEO',
          description:
            'Switch the locale (top of page) to override these fields for ca.kawaius.com. Blank CA values fall back to the US value.',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Page title for search engines (50–60 characters recommended)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true,
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
