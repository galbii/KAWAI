import type { CollectionConfig } from 'payload'

export const ConstantContactSettings: CollectionConfig = {
  slug: 'constant-contact-settings',
  labels: {
    singular: 'Constant Contact Settings',
    plural: 'Constant Contact Settings',
  },
  admin: {
    group: 'SYSTEM',
    useAsTitle: 'id',
    description: 'Manage Constant Contact API credentials and OAuth2 tokens. Restricted to admin users only.',
    hidden: ({ user }) => !user || user.role !== 'admin', // Hide from non-admin users
  },
  access: {
    // Only authenticated admin users can read
    read: ({ req: { user } }) => {
      return Boolean(user && user.role === 'admin')
    },
    // Only authenticated admin users can create
    create: ({ req: { user } }) => {
      return Boolean(user && user.role === 'admin')
    },
    // Only authenticated admin users can update
    update: ({ req: { user } }) => {
      return Boolean(user && user.role === 'admin')
    },
    // Only authenticated admin users can delete
    delete: ({ req: { user } }) => {
      return Boolean(user && user.role === 'admin')
    },
  },
  hooks: {
    // Ensure only one settings document can exist (singleton behavior)
    beforeValidate: [
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          // Check if a settings document already exists
          const existingSettings = await req.payload.find({
            collection: 'constant-contact-settings',
            limit: 1,
          })

          if (existingSettings.docs.length > 0) {
            throw new Error('Constant Contact settings already exist. Please update the existing settings instead of creating new ones.')
          }
        }
      },
    ],
    // Auto-populate client credentials from environment variables on create
    beforeChange: [
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          // Auto-populate from environment variables if not provided
          if (!data.clientId && process.env.CONSTANT_CONTACT_CLIENT_ID) {
            data.clientId = process.env.CONSTANT_CONTACT_CLIENT_ID
          }
          if (!data.clientSecret && process.env.CONSTANT_CONTACT_CLIENT_SECRET) {
            data.clientSecret = process.env.CONSTANT_CONTACT_CLIENT_SECRET
          }
          if (!data.redirectUri && process.env.CONSTANT_CONTACT_REDIRECT_URI) {
            data.redirectUri = process.env.CONSTANT_CONTACT_REDIRECT_URI
          }

          // Set initial status
          if (!data.status) {
            data.status = 'pending_authorization'
          }
        }

        // Update the updatedAt timestamp
        data.updatedAt = new Date().toISOString()

        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // OAuth2 Credentials Tab
        {
          label: 'OAuth2 Credentials',
          description: 'Basic OAuth2 application credentials from Constant Contact Developer Portal',
          fields: [
            {
              name: 'clientId',
              type: 'text',
              required: true,
              admin: {
                description: 'Your Constant Contact Client ID from the developer portal',
                placeholder: 'e.g., d6771a97-02f1-4ee6-a52e-4f906a1c546d',
              },
            },
            {
              name: 'clientSecret',
              type: 'text',
              required: true,
              admin: {
                description: 'Your Constant Contact Client Secret from the developer portal',
                placeholder: 'e.g., HYJSXJ_32u2ZSF9-Sfo7wQ',
                // TODO: Consider encrypting this field in production
              },
            },
            {
              name: 'redirectUri',
              type: 'text',
              required: true,
              admin: {
                description: 'The redirect URI configured in your Constant Contact app',
                placeholder: 'http://localhost:3000/api/auth/constantcontact/callback',
              },
            },
            {
              name: 'baseUrl',
              type: 'text',
              defaultValue: 'https://api.cc.email/v3',
              admin: {
                description: 'Constant Contact API base URL (usually https://api.cc.email/v3)',
              },
            },
          ],
        },
        // Access Tokens Tab
        {
          label: 'Access Tokens',
          description: 'OAuth2 access and refresh tokens obtained through authorization flow',
          fields: [
            {
              name: 'accessToken',
              type: 'textarea',
              admin: {
                description: 'Current access token for API requests',
                placeholder: 'Will be populated after OAuth2 authorization',
                rows: 3,
              },
            },
            {
              name: 'refreshToken',
              type: 'textarea',
              admin: {
                description: 'Refresh token for obtaining new access tokens',
                placeholder: 'Will be populated after OAuth2 authorization',
                rows: 3,
              },
            },
            {
              name: 'tokenType',
              type: 'text',
              defaultValue: 'Bearer',
              admin: {
                description: 'Token type (typically "Bearer")',
              },
            },
            {
              name: 'scope',
              type: 'text',
              defaultValue: 'campaign_data contact_data offline_access',
              admin: {
                description: 'OAuth2 scopes granted to the application',
              },
            },
            {
              name: 'expiresAt',
              type: 'date',
              admin: {
                description: 'When the current access token expires',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM d, yyyy h:mm a',
                },
              },
            },
          ],
        },
        // Status & Metadata Tab
        {
          label: 'Status & Metadata',
          description: 'Current status and tracking information',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'pending_authorization',
              options: [
                {
                  label: 'Pending Authorization',
                  value: 'pending_authorization',
                },
                {
                  label: 'Active',
                  value: 'active',
                },
                {
                  label: 'Token Expired',
                  value: 'expired',
                },
                {
                  label: 'Refresh Failed',
                  value: 'refresh_failed',
                },
                {
                  label: 'Error',
                  value: 'error',
                },
              ],
              admin: {
                description: 'Current status of the API connection',
              },
            },
            {
              name: 'lastSuccessfulRequest',
              type: 'date',
              admin: {
                description: 'Timestamp of the last successful API request',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM d, yyyy h:mm a',
                },
              },
            },
            {
              name: 'lastTokenRefresh',
              type: 'date',
              admin: {
                description: 'Timestamp of the last token refresh',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM d, yyyy h:mm a',
                },
              },
            },
            {
              name: 'errorMessage',
              type: 'textarea',
              admin: {
                description: 'Last error message (if any)',
                rows: 2,
              },
            },
            {
              name: 'notes',
              type: 'textarea',
              admin: {
                description: 'Additional notes or configuration details',
                rows: 3,
              },
            },
          ],
        },
        // System Fields Tab
        {
          label: 'System Fields',
          description: 'Read-only system information',
          fields: [
            {
              name: 'createdAt',
              type: 'date',
              admin: {
                readOnly: true,
                description: 'When this configuration was created',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM d, yyyy h:mm a',
                },
              },
              hooks: {
                beforeValidate: [
                  ({ operation, value }) => {
                    if (operation === 'create') {
                      return new Date().toISOString()
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'updatedAt',
              type: 'date',
              admin: {
                readOnly: true,
                description: 'When this configuration was last updated',
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'MMM d, yyyy h:mm a',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}