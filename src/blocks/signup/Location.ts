import type { Block } from 'payload'

export const SignupLocation: Block = {
  slug: 'signup-location',
  interfaceName: 'SignupLocationBlock',
  labels: { singular: 'Location', plural: 'Locations' },
  admin: { group: 'Signup' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Getting here' },
    { name: 'showMap', type: 'checkbox', defaultValue: true },
    { name: 'showHours', type: 'checkbox', defaultValue: true },
    {
      name: 'parkingNote',
      type: 'textarea',
      admin: { description: 'Address and hours come from the Storefront record automatically.' },
    },
  ],
}
