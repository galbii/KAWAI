import type { Block } from 'payload'

export const SignupInstructors: Block = {
  slug: 'signup-instructors',
  interfaceName: 'SignupInstructorsBlock',
  labels: { singular: 'Instructors', plural: 'Instructors' },
  admin: { group: 'Signup' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: "Who you'll meet" },
    { name: 'intro', type: 'textarea' },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      admin: { description: 'Maximum faculty to show. Pulled from the linked Music School.' },
    },
  ],
}
