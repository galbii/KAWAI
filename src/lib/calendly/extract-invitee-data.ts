/**
 * Calendly Invitee Data Extraction Utility
 *
 * Extracts contact information from Calendly event payloads.
 * Calendly's onEventScheduled event includes invitee data in the payload.
 */

export interface CalendlyInviteeData {
  email: string
  firstName?: string
  lastName?: string
  name?: string
  phone?: string
  timezone?: string
  uri?: string
}

/**
 * Extract invitee data from Calendly event payload
 *
 * Calendly event structure:
 * event.data.payload = {
 *   event: { uri, name, ... },
 *   invitee: { uri, name, email, ... }
 * }
 */
export function extractInviteeData(eventData: any): CalendlyInviteeData | null {
  try {
    console.log('🔍 Extracting invitee data from Calendly event...')
    console.log('📦 Full event structure:', JSON.stringify(eventData, null, 2))

    const payload = eventData?.data?.payload
    if (!payload) {
      console.warn('⚠️ No payload found in Calendly event')
      return null
    }

    const invitee = payload?.invitee
    if (!invitee) {
      console.warn('⚠️ No invitee data found in payload')
      return null
    }

    console.log('👤 Invitee data found:', JSON.stringify(invitee, null, 2))

    // Extract email (required)
    const email = invitee.email
    if (!email) {
      console.error('❌ No email found in invitee data')
      return null
    }

    // Extract name - Calendly provides full name, we'll split it
    const fullName = invitee.name || ''
    const nameParts = fullName.split(' ')
    const firstName = nameParts[0] || undefined
    const lastName = nameParts.slice(1).join(' ') || undefined

    // Extract other data
    const phone = invitee.phone_number || undefined
    const timezone = invitee.timezone || undefined
    const uri = invitee.uri || undefined

    const extractedData: CalendlyInviteeData = {
      email,
      firstName,
      lastName,
      name: fullName,
      phone,
      timezone,
      uri
    }

    console.log('✅ Successfully extracted invitee data:', {
      email: email ? '[PRESENT]' : '[MISSING]',
      firstName: firstName ? '[PRESENT]' : '[MISSING]',
      lastName: lastName ? '[PRESENT]' : '[MISSING]',
      phone: phone ? '[PRESENT]' : '[MISSING]'
    })

    return extractedData
  } catch (error) {
    console.error('❌ Error extracting invitee data from Calendly event:', error)
    return null
  }
}

/**
 * Alternative extraction if data is in answers format
 * Some Calendly events include custom question answers
 */
export function extractInviteeDataFromAnswers(eventData: any): Partial<CalendlyInviteeData> | null {
  try {
    const payload = eventData?.data?.payload
    const questions = payload?.questions_and_answers || []

    console.log('🔍 Checking for custom question answers:', questions)

    const data: Partial<CalendlyInviteeData> = {}

    questions.forEach((qa: any) => {
      const question = qa.question?.toLowerCase() || ''
      const answer = qa.answer

      if (question.includes('email')) {
        data.email = answer
      } else if (question.includes('first name') || question.includes('firstname')) {
        data.firstName = answer
      } else if (question.includes('last name') || question.includes('lastname')) {
        data.lastName = answer
      } else if (question.includes('phone') || question.includes('mobile')) {
        data.phone = answer
      }
    })

    return Object.keys(data).length > 0 ? data : null
  } catch (error) {
    console.error('❌ Error extracting data from answers:', error)
    return null
  }
}

/**
 * Master extraction function that tries multiple methods
 */
export function extractCalendlyContactData(eventData: any): CalendlyInviteeData | null {
  // Try standard invitee extraction first
  let data = extractInviteeData(eventData)

  // If that fails or is incomplete, try answers extraction
  if (!data || !data.email) {
    console.log('🔄 Trying alternative extraction from custom answers...')
    const answersData = extractInviteeDataFromAnswers(eventData)
    if (answersData) {
      data = { ...data, ...answersData } as CalendlyInviteeData
    }
  }

  return data
}