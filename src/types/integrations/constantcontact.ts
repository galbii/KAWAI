// Constant Contact API integration types
export interface ConstantContactConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  accessToken?: string
  refreshToken?: string
}

export interface ConstantContactContact {
  email_address: string
  first_name?: string
  last_name?: string
  phone_numbers?: Array<{
    phone_number: string
    kind: 'home' | 'work' | 'mobile'
  }>
  custom_fields?: Array<{
    custom_field_id: string
    value: string
  }>
  list_memberships?: string[]
}

export interface ConstantContactList {
  list_id: string
  name: string
  description?: string
  status: 'active' | 'hidden' | 'deleted'
  membership_count: number
  created_at: string
  updated_at: string
}