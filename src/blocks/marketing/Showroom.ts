import type { Block } from 'payload'

export const Showroom: Block = {
  slug: 'marketing-showroom',
  labels: {
    singular: '🏢 Showroom Location',
    plural: 'Showroom Sections',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=Showroom+Location',
  imageAltText: 'Showroom with map, hours, features, and contact info',
  interfaceName: 'MarketingShowroomBlock',
  fields: [
    {
      name: 'sectionHeader',
      type: 'text',
      required: true,
      defaultValue: 'Our Showroom',
      admin: { description: 'Section header text' },
    },
    {
      name: 'showroomTitle',
      type: 'text',
      required: true,
      defaultValue: 'Visit Our Lake St. Louis',
      admin: { description: 'Main showroom title' },
    },
    {
      name: 'showroomDescription',
      type: 'textarea',
      required: true,
      defaultValue:
        'Experience the difference at our state-of-the-art showroom in Lake St. Louis, Missouri. Browse our extensive collection of Kawai pianos in person, test play in our soundproofed rooms, and receive expert guidance from our knowledgeable staff.',
      admin: { description: 'Showroom description text' },
    },
    {
      name: 'showroomInfo',
      type: 'group',
      admin: { description: 'Showroom contact and location details' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Kawai Piano Gallery - Lake St. Louis',
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          defaultValue: '123 Piano Way\nLake St. Louis, MO 63367',
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '(636) 555-PIANO',
        },
        {
          name: 'serviceArea',
          type: 'text',
          required: true,
          defaultValue: 'Serving Greater St. Louis & Surrounding Areas',
        },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      required: true,
      admin: { description: 'Showroom operating hours' },
      fields: [
        { name: 'day', type: 'text', required: true },
        { name: 'time', type: 'text', required: true },
      ],
      defaultValue: [
        { day: 'Monday - Friday', time: '10:00 AM - 6:00 PM' },
        { day: 'Saturday', time: '10:00 AM - 5:00 PM' },
        { day: 'Sunday', time: 'By Appointment' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      admin: { description: 'Showroom features and amenities' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: '🎹 Piano', value: 'piano' },
            { label: '🎵 Music', value: 'music' },
            { label: '🏆 Award', value: 'award' },
            { label: '👥 Users', value: 'users' },
            { label: '🕐 Clock', value: 'clock' },
            { label: '🛡️ Shield', value: 'shield' },
            { label: '🎧 Headphones', value: 'headphones' },
            { label: '🚗 Car', value: 'car' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
      defaultValue: [
        {
          icon: 'piano',
          title: 'Extensive Selection',
          description: '50+ Kawai pianos in stock',
        },
        {
          icon: 'headphones',
          title: 'Private Try Rooms',
          description: 'Soundproofed testing areas',
        },
        {
          icon: 'users',
          title: 'Expert Staff',
          description: '100+ years combined experience',
        },
        {
          icon: 'shield',
          title: 'Warranty & Service',
          description: 'Comprehensive protection plans',
        },
      ],
    },
    {
      name: 'showroomCtas',
      type: 'group',
      admin: { description: 'Call-to-action buttons' },
      fields: [
        {
          name: 'directionsText',
          type: 'text',
          defaultValue: 'Get Directions',
        },
        {
          name: 'directionsLink',
          type: 'text',
          defaultValue: 'https://maps.google.com',
        },
        {
          name: 'scheduleText',
          type: 'text',
          defaultValue: 'Schedule a Visit',
        },
        { name: 'scheduleLink', type: 'text', defaultValue: '/contact' },
      ],
    },
  ],
}
