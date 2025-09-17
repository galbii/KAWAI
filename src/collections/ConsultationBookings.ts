import type { CollectionConfig } from 'payload'

export const ConsultationBookings: CollectionConfig = {
  slug: 'consultation-bookings',
  labels: {
    singular: 'Consultation Booking',
    plural: 'Consultation Bookings',
  },
  admin: {
    group: 'Bookings',
    defaultColumns: ['firstName', 'lastName', 'email', 'selectedDate', 'selectedTime', 'status', 'createdAt'],
    useAsTitle: 'email',
    description: 'Premium piano consultation booking requests from signature experience',
  },
  access: {
    read: () => true, // Allow frontend to read for confirmation
    create: () => true, // Allow frontend to create bookings
    update: ({ req: { user } }) => {
      // Only authenticated users can update
      return Boolean(user)
    },
    delete: ({ req: { user } }) => {
      // Only authenticated users can delete
      return Boolean(user)
    },
  },
  timestamps: true,
  fields: [
    // Contact Information
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer last name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address for confirmation',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      admin: {
        description: 'Customer phone number (optional)',
      },
    },

    // Booking Details
    {
      name: 'selectedDate',
      type: 'select',
      required: true,
      options: [
        {
          label: 'October 9, 2024',
          value: '2024-10-09',
        },
        {
          label: 'October 10, 2024',
          value: '2024-10-10',
        },
        {
          label: 'October 11, 2024',
          value: '2024-10-11',
        },
        {
          label: 'October 12, 2024',
          value: '2024-10-12',
        },
      ],
      admin: {
        description: 'Selected consultation date during the signature event',
      },
    },
    {
      name: 'selectedTime',
      type: 'select',
      required: true,
      options: [
        // Morning slots
        {
          label: '9:00 AM',
          value: '09:00',
        },
        {
          label: '10:00 AM',
          value: '10:00',
        },
        {
          label: '11:00 AM',
          value: '11:00',
        },
        // Afternoon slots
        {
          label: '1:00 PM',
          value: '13:00',
        },
        {
          label: '2:00 PM',
          value: '14:00',
        },
        {
          label: '3:00 PM',
          value: '15:00',
        },
        {
          label: '4:00 PM',
          value: '16:00',
        },
        // Evening slots
        {
          label: '5:00 PM',
          value: '17:00',
        },
        {
          label: '6:00 PM',
          value: '18:00',
        },
      ],
      admin: {
        description: 'Selected consultation time slot',
      },
    },

    // Event and Status
    {
      name: 'eventType',
      type: 'select',
      required: true,
      defaultValue: 'premium-consultation',
      options: [
        {
          label: 'Premium Consultation',
          value: 'premium-consultation',
        },
        {
          label: 'Signature Selection',
          value: 'signature-selection',
        },
        {
          label: 'Private Viewing',
          value: 'private-viewing',
        },
      ],
      admin: {
        description: 'Type of consultation or event',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending Review',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      admin: {
        description: 'Current booking status',
        position: 'sidebar',
      },
    },

    // Additional Information
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes or special requests from customer',
        rows: 3,
      },
    },
    {
      name: 'pianoInterest',
      type: 'select',
      options: [
        {
          label: 'Grand Piano',
          value: 'grand',
        },
        {
          label: 'Upright Piano',
          value: 'upright',
        },
        {
          label: 'Digital Piano',
          value: 'digital',
        },
        {
          label: 'Hybrid Piano',
          value: 'hybrid',
        },
        {
          label: 'Not Sure / Multiple',
          value: 'multiple',
        },
      ],
      admin: {
        description: 'Customer piano type interest',
      },
    },

    // Source Tracking
    {
      name: 'sourceSignaturePage',
      type: 'text',
      admin: {
        description: 'Which signature page generated this booking (slug)',
        position: 'sidebar',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser user agent for analytics',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address for security',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}