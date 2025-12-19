import type { CollectionConfig } from 'payload'

/**
 * KPM Christmas 2025 Campaign Lead Collection
 *
 * Stores all form submissions from "The Gift of Music" campaign.
 * This collection serves as the PRIMARY data store - submissions are saved here FIRST
 * before attempting external integrations (Constant Contact, Resend).
 *
 * This ensures no lead data is lost even if external services fail.
 */
export const KPM_Christmas2k25: CollectionConfig = {
  slug: 'kpm-christmas-2k25',
  labels: {
    singular: 'KPM Christmas 2025 Lead',
    plural: 'KPM Christmas 2025 Leads',
  },
  admin: {
    group: 'Campaign Leads',
    useAsTitle: 'studentFullName',
    defaultColumns: ['studentFullName', 'emergencyContactEmail', 'instrument', 'submittedAt', 'constantContactStatus'],
    description: 'Holiday 2025 music school enrollment campaign leads. All submissions are saved here first as a safety net before external integrations.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // Student Information Tab
        {
          label: 'Student Information',
          description: 'Information about the student enrolling in music lessons',
          fields: [
            {
              name: 'studentFullName',
              type: 'text',
              admin: {
                readOnly: true,
                description: 'Auto-generated from first and last name',
              },
              hooks: {
                beforeValidate: [
                  ({ data, value }) => {
                    if (data?.studentFirstName && data?.studentLastName) {
                      return `${data.studentFirstName} ${data.studentLastName}`
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'studentFirstName',
              type: 'text',
              required: true,
              admin: {
                description: 'Student\'s first name',
              },
            },
            {
              name: 'studentLastName',
              type: 'text',
              required: true,
              admin: {
                description: 'Student\'s last name',
              },
            },
            {
              name: 'studentBirthYear',
              type: 'text',
              required: true,
              admin: {
                description: 'Student\'s birth year (e.g., 2010)',
              },
            },
            {
              name: 'studentGender',
              type: 'select',
              required: true,
              options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Non-binary', value: 'non-binary' },
                { label: 'Prefer not to say', value: 'prefer-not-to-say' },
              ],
              admin: {
                description: 'Student\'s gender',
              },
            },
            {
              name: 'schoolGrade',
              type: 'text',
              admin: {
                description: 'Current school grade (optional)',
              },
            },
            {
              name: 'currentSchool',
              type: 'text',
              admin: {
                description: 'Name of current school (optional)',
              },
            },
          ],
        },

        // Musical Background Tab
        {
          label: 'Musical Background',
          description: 'Student\'s musical experience and lesson preferences',
          fields: [
            {
              name: 'instrument',
              type: 'select',
              required: true,
              options: [
                { label: 'Piano', value: 'piano' },
                { label: 'Keyboard', value: 'keyboard' },
                { label: 'Voice/Singing', value: 'voice' },
                { label: 'Guitar', value: 'guitar' },
                { label: 'Violin', value: 'violin' },
                { label: 'Other', value: 'other' },
              ],
              admin: {
                description: 'Primary instrument of interest',
              },
            },
            {
              name: 'lengthOfPreviousStudy',
              type: 'select',
              required: true,
              options: [
                { label: 'No previous experience', value: 'none' },
                { label: 'Less than 1 year', value: 'less-than-1-year' },
                { label: '1-2 years', value: '1-2-years' },
                { label: '3-5 years', value: '3-5-years' },
                { label: '5+ years', value: '5-plus-years' },
              ],
              admin: {
                description: 'How long the student has studied music',
              },
            },
            {
              name: 'privateLessonType',
              type: 'select',
              required: true,
              options: [
                { label: 'In-Person Lessons', value: 'in-person' },
                { label: 'Online Lessons', value: 'online' },
                { label: 'Hybrid (Both In-Person & Online)', value: 'hybrid' },
                { label: 'Not sure yet', value: 'undecided' },
              ],
              admin: {
                description: 'Preferred lesson format',
              },
            },
          ],
        },

        // Lesson Preferences Tab
        {
          label: 'Lesson Preferences',
          description: 'Scheduling and pricing preferences',
          fields: [
            {
              name: 'lessonPrice',
              type: 'select',
              required: true,
              options: [
                { label: '$25 - $40 per lesson', value: '$25-$40' },
                { label: '$40 - $60 per lesson', value: '$40-$60' },
                { label: '$60 - $80 per lesson', value: '$60-$80' },
                { label: '$80+ per lesson', value: '$80+' },
                { label: 'Flexible - discuss options', value: 'flexible' },
              ],
              admin: {
                description: 'Preferred price range for lessons',
              },
            },
            {
              name: 'preferredTime',
              type: 'select',
              required: true,
              options: [
                { label: 'Weekday Mornings (9am - 12pm)', value: 'weekday-morning' },
                { label: 'Weekday Afternoons (12pm - 5pm)', value: 'weekday-afternoon' },
                { label: 'Weekday Evenings (5pm - 8pm)', value: 'weekday-evening' },
                { label: 'Weekend Mornings (9am - 12pm)', value: 'weekend-morning' },
                { label: 'Weekend Afternoons (12pm - 5pm)', value: 'weekend-afternoon' },
                { label: 'Flexible - Any time', value: 'flexible' },
              ],
              admin: {
                description: 'Preferred lesson time',
              },
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Additional notes or questions from the applicant',
                rows: 4,
              },
            },
          ],
        },

        // Emergency Contact Tab
        {
          label: 'Primary Contact',
          description: 'Parent/Guardian or emergency contact information',
          fields: [
            {
              name: 'emergencyContactFirstName',
              type: 'text',
              required: true,
              admin: {
                description: 'Emergency contact\'s first name',
              },
            },
            {
              name: 'emergencyContactLastName',
              type: 'text',
              required: true,
              admin: {
                description: 'Emergency contact\'s last name',
              },
            },
            {
              name: 'emergencyContactPhone',
              type: 'text',
              required: true,
              admin: {
                description: 'Emergency contact\'s phone number',
              },
            },
            {
              name: 'emergencyContactEmail',
              type: 'email',
              required: true,
              admin: {
                description: 'Emergency contact\'s email address',
              },
            },
          ],
        },

        // Submission Status Tab
        {
          label: 'Submission Status',
          description: 'External integration status and metadata',
          fields: [
            {
              name: 'submittedAt',
              type: 'date',
              required: false,
              admin: {
                readOnly: true,
                description: 'When this form was submitted (auto-generated)',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM d, yyyy h:mm:ss a',
                },
              },
              hooks: {
                beforeValidate: [
                  ({ operation, value }) => {
                    if (operation === 'create' && !value) {
                      return new Date().toISOString()
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'constantContactStatus',
              type: 'select',
              required: true,
              defaultValue: 'pending',
              options: [
                { label: '⏳ Pending', value: 'pending' },
                { label: '✅ Success', value: 'success' },
                { label: '❌ Failed', value: 'failed' },
                { label: '⏭️ Skipped', value: 'skipped' },
              ],
              admin: {
                description: 'Status of Constant Contact API submission',
              },
            },
            {
              name: 'constantContactId',
              type: 'text',
              admin: {
                description: 'Constant Contact contact ID (if submission succeeded)',
                readOnly: true,
              },
            },
            {
              name: 'constantContactError',
              type: 'textarea',
              admin: {
                description: 'Error message from Constant Contact (if failed)',
                rows: 3,
                readOnly: true,
              },
            },
            {
              name: 'resendStatus',
              type: 'select',
              required: true,
              defaultValue: 'pending',
              options: [
                { label: '⏳ Pending', value: 'pending' },
                { label: '✅ Success', value: 'success' },
                { label: '❌ Failed', value: 'failed' },
                { label: '⏭️ Skipped', value: 'skipped' },
              ],
              admin: {
                description: 'Status of Resend email notification',
              },
            },
            {
              name: 'resendEmailId',
              type: 'text',
              admin: {
                description: 'Resend email ID (if email sent successfully)',
                readOnly: true,
              },
            },
            {
              name: 'resendError',
              type: 'textarea',
              admin: {
                description: 'Error message from Resend (if failed)',
                rows: 3,
                readOnly: true,
              },
            },
          ],
        },

        // System Metadata Tab
        {
          label: 'System Metadata',
          description: 'System tracking information',
          fields: [
            {
              name: 'sourceUrl',
              type: 'text',
              admin: {
                description: 'URL where the form was submitted',
                readOnly: true,
              },
            },
            {
              name: 'userAgent',
              type: 'text',
              admin: {
                description: 'Browser user agent string',
                readOnly: true,
              },
            },
            {
              name: 'ipAddress',
              type: 'text',
              admin: {
                description: 'IP address of submission (if available)',
                readOnly: true,
              },
            },
            {
              name: 'processingNotes',
              type: 'textarea',
              admin: {
                description: 'Internal notes about processing this submission',
                rows: 4,
              },
            },
          ],
        },
      ],
    },
  ],

  // Timestamps are automatically added by Payload CMS
  timestamps: true,
}
